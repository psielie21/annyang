(function (root, factory) {
  // jshint strict: false
  if (typeof module === 'object' && module.exports) { // CommonJS
    factory(require('../../dist/annyang.js'));
  } else if (typeof define === 'function' && define.amd) { // AMD
    define(['annyang'], factory);
  } else { // Browser globals
    factory(root.annyang);
  }
}(typeof window !== 'undefined' ? window : this, function factory(annyang) {
  "use strict";

  // Issue #193 (https://github.com/TalAter/annyang/issues/193)
  describe('Speech recognition aborting while annyang is paused', function() {

    var recognition;

    beforeEach(function() {
      recognition = annyang.getSpeechRecognizer();
      jasmine.clock().install();
      annyang.abort();
      annyang.removeCommands();
    });

    afterEach(function() {
      jasmine.clock().tick(2000);
      jasmine.clock().uninstall();
    });

    it('should not unpause annyang on restart', function() {
      annyang.start({ autoRestart: true, continuous: false });
      annyang.pause();
      recognition.abort();
      expect(annyang.isListening()).toBe(false);
      jasmine.clock().tick(1000);
      expect(annyang.isListening()).toBe(false);
    });

  });

  describe('Testing hotword only for strings', function(){
    //if hotword is equal to true the user has to say the hotword in order for the program to accept it

    var recognition;
    var loremSpy;
    var hotwordLoremSpy;

    beforeEach(function() {
      loremSpy = jasmine.createSpy();
      hotwordLoremSpy = jasmine.createSpy();
      annyang.abort();
      annyang.debug(false);
      annyang.removeCommands();
      annyang.addCommands({"Lorem": loremSpy, "Jimmy Lorem": hotwordLoremSpy} );
      annyang.start({ autoRestart: true, continuous: false, hotword: "Jimmy" });
      recognition = annyang.getSpeechRecognizer();

    });


    it('should not listen to a phrase while hotword is set to something else than the word in the beginning', function() {
      recognition.say("Lorem");
      expect(loremSpy).not.toHaveBeenCalled();
    });

    it('should call the function without the hotword in the beginning', function() {
      recognition.say("Jimmy Lorem");
      expect(loremSpy).toHaveBeenCalled();
    });

    it('should not call the function without subtracting the hotword', function() {
      recognition.say("Jimmy Lorem");
      expect(hotwordLoremSpy).not.toHaveBeenCalled();
    });

    it('should call the function resulting by subtracting the hotword', function() {
      recognition.say("Jimmy Jimmy Lorem");
      expect(hotwordLoremSpy).toHaveBeenCalled();
    });




  });

  describe('Testing hotword only for arrays', function(){
    //if hotword is equal to true the user has to say the hotword in order for the program to accept it

    var recognition;
    var loremSpy;
    var hotwordLoremSpy;

    beforeEach(function() {
      loremSpy = jasmine.createSpy();
      hotwordLoremSpy = jasmine.createSpy();
      annyang.abort();
      annyang.debug(false);
      annyang.removeCommands();
      annyang.addCommands({"Lorem": loremSpy, "Jimmy Lorem": hotwordLoremSpy} );
      annyang.start({ autoRestart: true, continuous: false, hotword: ["Jimmy", "Kimmel", "live"] });
      recognition = annyang.getSpeechRecognizer();

    });


    it('should not listen to a phrase while hotword is set to something else than the word in the beginning', function() {
      recognition.say("Lorem");
      expect(loremSpy).not.toHaveBeenCalled();
    });


    it('should call the function without the hotword in the beginning [1/3]', function() {
      recognition.say("Jimmy Lorem");
      expect(loremSpy).toHaveBeenCalled();
    });

    it('should call the function without the hotword in the beginning [2/3]', function() {
      recognition.say("Kimmel Lorem");
      expect(loremSpy).toHaveBeenCalled();
    });

    it('should call the function without the hotword in the beginning [3/3]', function() {
      recognition.say("live Lorem");
      expect(loremSpy).toHaveBeenCalled();
    });


    it('should not call the function without subtracting the hotword [1/3]', function() {
      recognition.say("Jimmy Lorem");
      expect(hotwordLoremSpy).not.toHaveBeenCalled();
    });

    it('should not call the function without subtracting the hotword [2/3]', function() {
      recognition.say("Kimmel Lorem");
      expect(hotwordLoremSpy).not.toHaveBeenCalled();
    });

    it('should not call the function without subtracting the hotword [3/3]', function() {
      recognition.say("live Lorem");
      expect(hotwordLoremSpy).not.toHaveBeenCalled();
    });


    it('should call the function resulting by subtracting the hotword [1/3]', function() {
      recognition.say("Jimmy Jimmy Lorem");
      expect(hotwordLoremSpy).toHaveBeenCalled();
    });

    it('should call the function resulting by subtracting the hotword [2/3]', function() {
      recognition.say("Kimmel Jimmy Lorem");
      expect(hotwordLoremSpy).toHaveBeenCalled();
    });

    it('should call the function resulting by subtracting the hotword [3/3]', function() {
      recognition.say("live Jimmy Lorem");
      expect(hotwordLoremSpy).toHaveBeenCalled();
    });

  });

  describe('Testing turning hotwords on and off', function(){
    //if hotword is equal to true the user has to say the hotword in order for the program to accept it

    var recognition;
    var loremSpy;
    var noMatchSpy;

    beforeEach(function() {
      loremSpy = jasmine.createSpy();
      noMatchSpy = jasmine.createSpy();
      annyang.abort();
      annyang.debug(false);
      annyang.removeCommands();
      annyang.addCommands({"Lorem": loremSpy});
      annyang.addCallback('resultNoMatch', noMatchSpy);
      annyang.start({ autoRestart: true, continuous: false, hotword: "Jimmy" });
      recognition = annyang.getSpeechRecognizer();

    });


    it('should not listen to a phrase while the hotword has changed', function() {
      annyang.setHotword("Timmy");
      recognition.say("Jimmy Lorem");
      expect(loremSpy).not.toHaveBeenCalled();
    });

    it('should call the function with the right hotword', function() {
      annyang.setHotword("Jimmy");
      recognition.say("Jimmy Lorem");
      expect(loremSpy).toHaveBeenCalled();
    });

    it('should not call when hotword = false', function() {
      annyang.setHotword(false);
      recognition.say("Jimmy Lorem");
      expect(loremSpy).not.toHaveBeenCalled();
    });

    it('should call "noMatch" when hotword = false', function() {
      annyang.setHotword(false);
      recognition.say("Jimmy Lorem");
      expect(noMatchSpy).toHaveBeenCalled();
    });

    it('should call the function when hotword is set to an array', function() {
      annyang.setHotword(["peter", "Jimmy"]);
      recognition.say("peter Lorem");
      expect(loremSpy).toHaveBeenCalled();
    });




  });

}));
