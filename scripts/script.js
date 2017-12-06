$(function() {
  var availableWords = ['apple', 'banana', 'orange', 'pear'];

  function randomWord() {
    var randomIdx = Math.floor(Math.random() * availableWords.length);
    var splicedWord = availableWords.splice(randomIdx, 1)[0];
    if (splicedWord) {
      return splicedWord;
    } else {
      return undefined;
    }
  }

  function bindKeypress() {
    $(document).keypress(function(e) {
      if (e.key.match(/[a-z]/i) && !currentGame.allGuessedLetters.includes(e.key)) {
        currentGame.allGuessedLetters.push(e.key);
        currentGame.displayGuess(e.key);
        currentGame.guessLetter(e.key);
      }
    })
  }

  function unbindKeyPress() {
    $(document).unbind("keypress");
  }

  $(".play-again").click(function(e) {
    e.preventDefault();
    currentGame.init();
  })

  var currentGame = {
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
      $(".word ul li").remove();
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
      } else {
        $(".game-end .message").text("Sorry, you've run out of guesses.");
        $(document.body).animate({
          "background-color": "#f66565"
        }, 1000);
      }
      $(".game-end").show();
      unbindKeyPress();
    },

    init: function() {
      this.maxAttempts = 6;
      this.attempts = 0;
      this.allGuessedLetters = [];
      this.wrongGuessedLetters = [];
      this.word = randomWord();
      this.setPlaceholders();
      this.positionApples();
      bindKeypress();
      $(".game-end").hide();
    }
  }

  currentGame.init();
})
