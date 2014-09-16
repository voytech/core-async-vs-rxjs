$(function () {
    var secretCombination = "ABBABA";

    var buttonA = $("#ex2-button-a").clickAsObservable().map(function () {
        return "A";
    });
    var buttonB = $("#ex2-button-b").clickAsObservable().map(function () {
        return "B";
    });

    var example12 = $("#ex2-card");

    var bothButtons = Rx.Observable.merge(buttonA, buttonB);

    var evaluationStream = bothButtons
      .merge(bothButtons.throttle(5000).map(function(){return "reset";}))
      .scan(function(acc, x) { // (1)
        if (x === "reset") return "";
        var newAcc = acc + x;
        if (newAcc.length > secretCombination.length) {
          return newAcc.substr(newAcc.length - secretCombination.length);
        }
        else {
          return newAcc;
        }
      })
      .map(function(combination) {
        return combination === secretCombination;
      });

    var wrongStream = evaluationStream
      .throttle(5000)
      .filter(function(result) { return result === false; });

    var correctStream = evaluationStream
      .filter(function(result) { return result === true; });

    wrongStream.subscribe(function() {
        example12.html("Too slow or wrong!");
    });

    correctStream.subscribe(function() {
        example12.html("Combination unlocked!");
    });

});
