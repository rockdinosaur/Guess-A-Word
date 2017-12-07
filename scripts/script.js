$(function() {
  var availableWords = ['apple', 'banana', 'orange', 'pear'];

  $(".play-again").click(function(e) {
    e.preventDefault();
    game.init();
  })

  var game = {
    guessLetter: function(letter) {
      if (this.word.split("").includes(letter)) {
        var matchingIdxs = [];
        this.word.split("").forEach(function(char, idx) {
          if (char === letter) { matchingIdxs.push(idx) }
        })
        matchingIdxs.forEach(function(idx) {
          var currentli = $(".word li").get(idx);
          $(currentli).text(this.word[idx]);
        }, this);
        this.verifyWord();
      } else {
        this.attempts += 1;
        if (!this.wrongGuessedLetters.includes(letter)) {
          this.wrongGuessedLetters.push(letter);
          this.verifyAttempts();
        }
      }
    },

    generateRandomWord: function() {
      var randomIdx = Math.floor(Math.random() * availableWords.length);
      var splicedWord = availableWords.splice(randomIdx, 1)[0];
      if (splicedWord) {
        return splicedWord;
      } else {
        return undefined;
      }
    },

    bindKeypress: function() {
      var self = this;
      $(document).keypress(function(e) {
        if (e.key.match(/[a-z]/i) && !self.allGuessedLetters.includes(e.key)) {
          self.allGuessedLetters.push(e.key);
          self.displayGuess(e.key);
          self.guessLetter(e.key);
        }
      })
    },

    unbindKeyPress: function() {
      $(document).unbind("keypress");
    },

    displayGuess: function(letter) {
      var guessedLetter = document.createElement("li");
      $(guessedLetter).text(letter);
      $(".guesses ul").append($(guessedLetter));
    },

    positionApples: function() {
      $(".apples").css({
        "background-position": "0 " + this.attempts * 20 + "%"
      })
    },

    setPlaceholders: function() {
      var newLetter;
      this.word.split("").forEach(function(letter) {
        newLetter = document.createElement("li");
        $(newLetter).text('');
        $(".word ul").append($(newLetter));
      })
    },

    verifyWord: function() {
      var wordCompleted = false;
      var matches = 0;
      $(".word li").each(function(idx, li) {
        if ($(this).text()) { matches += 1 }
      })
      if (matches === this.word.length) {
        this.displayMessage('win');
      }
    },

    verifyAttempts: function() {
      if (this.attempts >= this.maxAttempts) {
        this.displayMessage('lose');
      } else {
        this.positionApples();
      }
    },

    displayMessage: function(state) {
      if (state === 'win') {
        $(".game-end .message").text("You guessed it!");
        $(document.body).animate({
          "background-color": "#65c9f6"
        }, 1000);
      } else if (state === 'lose') {
        $(".game-end .message").text("Sorry, you've run out of guesses.");
        $(document.body).animate({
          "background-color": "#f66565"
        }, 1000);
      } else if (state === 'finished') {
        $(".game-end .message").text("We're all out of words for you!");
        $(document.body).animate({
          "background-color": "#e5e2e2"
        }, 1000);
      }
      $(".game-end").show();
      this.unbindKeyPress();
    },

    verifyAvailableWords: function() {
      if (availableWords.length === 0) {
        this.displayMessage('finished');
        return false;
      };
      return true;
    },

    clearDisplay: function() {
      $(".game-end").hide();
      $(".word ul li").remove();
      $(".guesses ul li").remove();
    },

    init: function() {
      this.clearDisplay();
      if (this.verifyAvailableWords()) {
        this.maxAttempts = 6;
        this.attempts = 0;
        this.allGuessedLetters = [];
        this.wrongGuessedLetters = [];
        this.word = this.generateRandomWord();
        this.setPlaceholders();
        this.positionApples();
        this.bindKeypress();
      } else {
        return;
      }
      return this;
    }
  }

  currentGame = Object.create(game).init();
})
