let currentFrame;
let frameRolls = [];

$(document).ready(() => {
    scorekeeper = new Scorekeeper();
    setButtons(0);
    // currentFrame = 0;
});

let setButtons = pinsDown => {
    let buttonText = "";
    for (var i = 0; i < 11 - pinsDown; i++) {
        buttonText +=
            '<button type="button" class="scoreButton" onclick="ballRolled(' +
            i +
            ')">' +
            i +
            "</button>";
    }
    $("#buttons").html(buttonText);
};

let ballRolled = pinsDown => {
    let currentFrame = scorekeeper.frames.length - 1;
    if (scorekeeper.frames.length === 0 || scorekeeper.isFrameComplete()) {
        setButtons(0);
        frame = new Frame();
        scorekeeper.newFrame(frame);
        console.log(pinsDown);
        updateScore(1, pinsDown);
    } else {
        updateScore(2, pinsDown);
        console.log("second roll", pinsDown);
    }
    gameOver(currentFrame);
};

let updateScore = (whichRoll, pinsDown) => {
    let currentFrame = scorekeeper.frames.length - 1;
    if (whichRoll == 1) {
        rollOneUpdate(currentFrame, pinsDown);
        frame.rollOutcome(pinsDown);
    } else {
        rollTwoUpdate(currentFrame, pinsDown);
        frame.rollOutcome(pinsDown);
    }
    newButtons(pinsDown);
    calculateScore(currentFrame);
};

let newButtons = pinsDown => {
    if (scorekeeper.isFrameComplete()) {
        setButtons(0);
    } else {
        setButtons(pinsDown);
    }
};

let rollOneUpdate = (currentFrame, pinsDown) => {
    if (pinsDown == 10) {
        rollDisplay(currentFrame, 1, "X");
    } else {
        rollDisplay(currentFrame, 0, pinsDown);
    }
};

let rollTwoUpdate = (currentFrame, pinsDown) => {
    // console.log(currentFrame);
    // console.log(this.frame);
    // console.log(this.frame.rolls[0] + pinsDown);
    if (this.frame.rolls[0] + pinsDown == 10) {
        rollDisplay(currentFrame, 1, "/");
    } else {
        rollDisplay(currentFrame, 1, pinsDown);
    }
};

let rollDisplay = (currentFrame, frameSpot, toDisplay) => {
    $(
        "#scoresTable tr:eq(1) td:eq(" + (currentFrame * 2 + frameSpot) + ")"
    ).html(toDisplay);
};

let calculateScore = currentFrame => {
    let totals = 0;
    for (let i = 0; i < currentFrame + 1; i++) {
        totals += scorekeeper.scoreCalculator(i);
        if (scorekeeper.scoreCalculator(i) != null) {
            $("#scoresTable tr:eq(2) td:eq(" + i + ")").html(totals);
        }
    }
};

let gameOver = currentFrame => {
    if (currentFrame - 1 == scorekeeper.totalGameFrames) {
        $("#buttons").html(`<h1>Game Over</h1>`);
    }
};

// /////////////////////FRAME OBJECT///////////////

function Frame() {
    this.totalPins = 10;
    this.rolls = [];
}

Frame.prototype.rollOutcome = function(pinsDown) {
    this.rolls.push(pinsDown);
};

Frame.prototype.total = function() {
    let currentTotal = 0;
    for (let i = 0; i < this.rolls.length; i++) {
        currentTotal += this.rolls[i];
    }
    return currentTotal;
};

// ////////////////SCOREKEEPER OBJECT ///////////////
function Scorekeeper() {
    this.totalGameFrames = 10;
    this.frames = [];
}

Scorekeeper.prototype.newFrame = function(frame) {
    this.frames.push(frame);
};

Scorekeeper.prototype.isFrameComplete = function() {
    let currentFrame = this.frames.length - 1;
    let roll1 = this.frames[currentFrame].rolls[0];
    let roll2 = this.frames[currentFrame].rolls[1];

    if (roll1 == 10 || (roll1 && roll2)) {
        return true;
    }
};

Scorekeeper.prototype.scoreCalculator = function(frameNumber) {
    // console.log(this.frames[frameNumber].rolls[0]);
    // console.log(this.frames[frameNumber].rolls[1]);
    let displayTotal = null;
    let firstRoll = this.frames[frameNumber].rolls[0];
    let secondRoll = this.frames[frameNumber].rolls[1];
    let currentFrameTotal = this.frames[frameNumber].total();

    // console.log("nextframe total", nextFrameTotal);
    let nextFrame = this.frames[frameNumber + 1];
    let twoFramesDown = this.frames[frameNumber + 2];
    let firstRollNextFrame;
    let nextFrameTotal;
    let firstRollTwoFramesDown;
    let twoFramesDownTotal;

    if (nextFrame) {
        firstRollNextFrame = nextFrame.rolls[0];
    }
    if (nextFrame) {
        nextFrameTotal = this.frames[frameNumber + 1].total();
    }
    if (twoFramesDown) {
        firstRollTwoFramesDown = twoFramesDown.rolls[0];
    }
    if (twoFramesDown) {
        twoFramesDownTotal = twoFramesDown.total();
    }
    // console.log(firstRoll + firstRollNextFrame + firstRollTwoFramesDown);
    // if (firstRoll + firstRollNextFrame + firstRollTwoFramesDown == 30) {
    //     displayTotal = firstRoll + firstRollNextFrame + firstRollTwoFramesDown;
    // }

    if (firstRoll == 10 && nextFrame) {
        if (firstRollNextFrame && firstRoll + firstRollNextFrame == 20) {
            if (firstRoll + firstRollNextFrame + firstRollTwoFramesDown == 30) {
                displayTotal =
                    firstRoll + firstRollNextFrame + firstRollTwoFramesDown;
            } else {
                displayTotal =
                    firstRoll + firstRollNextFrame + twoFramesDownTotal;
            }
        }
    } else if (firstRoll + secondRoll == 10) {
        if (firstRollNextFrame) {
            displayTotal = currentFrameTotal + firstRollNextFrame;
        } else {
            displayTotal = currentFrameTotal;
        }
    } else {
        displayTotal = currentFrameTotal;
    }
    if (firstRoll != 10 && secondRoll) {
        if (firstRoll + secondRoll != 10) {
            displayTotal = currentFrameTotal;
        } else if (firstRoll + secondRoll == 10) {
            console.log("Spare");
            displayTotal = null;
        }
    }
    if (nextFrame) {
        // console.log("checking", firstRollNextFrame);
        if (firstRoll != 10 && currentFrameTotal == 10) {
            displayTotal = currentFrameTotal + firstRollNextFrame;
        }
    }
    return displayTotal;
};
