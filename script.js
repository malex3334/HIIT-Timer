// styling elements
const green = "#2ee22e";
const orange = "#ffae1b";

// sounds
let soundOnOff = true;
const audioPlayer = function () {
  if (soundOnOff === true) {
    let bell = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2b08b6e711.mp3?filename=ship-bell-single-ring-81833.mp3"
    );
    bell.play();
    setTimeout(() => {
      bell.src = null;
    }, 3000);
  }
};
/// DOM ELEMENTS
const startBtn = document.querySelector("#submit");
const resetBtn = document.querySelector("#reset");
const timerEl = document.querySelector("#timer");
const cmdEl = document.querySelector("#command");
const roundEl = document.querySelector("#round");
const timerCircle = document.querySelector(".timer-container");
const btnControls = document.querySelectorAll(".btn-control");
const setAlwaysOn = document.querySelector("#screen-on");
const soundCheckbox = document.querySelector("#soundSwitch");

const inputsSection = document.querySelector("#inputs");
const setTime = document.querySelector("#setTime");
const setRes = document.querySelector("#setRest");
const setRounds = document.querySelector("#setRounds");

const messenger = function (msg, parentElement, time = 3) {
  if (parentElement.querySelector(".msgElement")) {
    //     PREVENT DUPLICATING ELEMENTS
    return;
  } else {
    let msgElement = document.createElement("p");
    msgElement.innerHTML = msg;
    msgElement.classList.add("msgElement");
    msgElement.classList.add("active");
    parentElement.appendChild(msgElement);
    parentElement.style.position = "relative";
    setTimeout(() => {
      msgElement.classList.remove("active");
      msgElement.remove();
      parentElement.style.position = "";
    }, time * 1000);
  }
};

// reset settings
const resetValues = function () {
  setTime.value = 30;
  setRes.value = 15;
  setRounds.value = 5;
};
resetValues();

let interval;
let pauseInterval;
let time = setTime.value;
let rounds = setRounds.value;
let pauseTime = setRes.value;
let isRunning = false;
let isRes = false;
let screenAlwaysOn = false;

// format time
function sec2human(seconds) {
  sec = seconds % 60;
  min = parseInt(seconds / 60);
  if (sec.toString().length == 1) {
    // padding
    sec = "0" + sec;
  }
  return min + ":" + sec;
}

const timersSettings = function () {
  time = setTime.value;
  rounds = setRounds.value;
  pauseTime = setRes.value;
  timerEl.innerHTML = sec2human(time);
  roundEl.innerHTML = rounds;
};

btnControls.forEach((btn) => {
  if (btn.classList.contains("plus")) {
    const plused = document.querySelector(`#${btn.previousElementSibling.id}`);
    btn.addEventListener("click", () => {
      plused.value = Number(plused.value) + 5;
      plused.id === "setRounds"
        ? (plused.value = Number(plused.value) - 4)
        : "";
      timersSettings();
    });
  }
  if (btn.classList.contains("minus")) {
    const plused = document.querySelector(`#${btn.nextElementSibling.id}`);
    btn.addEventListener("click", () => {
      if (plused.id !== "setRounds" && plused.value <= 5) {
        plused.value = 5;
        messenger(`Please enter higher value`, plused.parentElement, 3);
      } else if (plused.id === "setRounds" && plused.value <= 1) {
        plused.value = 1;
        messenger(`Please enter higher value`, plused.parentElement, 3);
      } else {
        plused.value = Number(plused.value) - 5;
        plused.id === "setRounds"
          ? (plused.value = Number(plused.value) + 4)
          : "";
        timersSettings();
      }
    });
  }
});

// set timers
inputsSection.addEventListener("keyup", () => {
  timersSettings();
});
inputsSection.addEventListener("change", () => {
  timersSettings();
});

const stopTraining = function () {
  clearInterval(pauseInterval);
  clearInterval(interval);
  isRunning = false;
  time = setTime.value;
  rounds = setRounds.value;
  pauseTime = setRes.value;
  startBtn.innerHTML = "Start";
  //   reset view
  timerEl.innerHTML = sec2human(time);
  roundEl.innerHTML = rounds;
  timerCircle.style.background = "white";
  timerCircle.style.color = "black";
  cmdEl.innerHTML = "Get Ready!";

  // cmdEl.innerHTML = 'Get Ready!'
};

function timer(stopFunction) {
  // bell.play()
  audioPlayer();
  // start training
  isRunning = true;
  timerCircle.style.background = green;
  timerCircle.style.color = "white";
  roundEl.innerHTML = rounds;
  cmdEl.innerHTML = "WORK!";
  interval = setInterval(() => {
    timerEl.innerHTML = sec2human(time);
    time--;
    time < 0 ? audioPlayer() : "";

    // round times up
    if (time < 0) {
      clearInterval(interval);
      rounds--;

      // round ends and work time is not up
      if (rounds > 0) {
        timerCircle.style.background = "orange";
        timerCircle.style.color = "white";
        cmdEl.innerHTML = "REST!";
        roundEl.innerHTML = rounds;
        pauseInterval = setInterval(() => {
          timerEl.innerHTML = sec2human(pauseTime);
          pauseTime--;
          // pause times up
          if (pauseTime < 0) {
            clearInterval(pauseInterval);
            pauseTime = setRes.value;
            time = setTime.value;
            return timer();
          }
        }, 1000);
      }
      // training ends
      if (rounds === 0) {
        stopTraining();
        cmdEl.innerHTML = "GOOD JOB!";
      }
    }
  }, 1000);
}

// buttons
startBtn.addEventListener("click", () => {
  !isRunning ? timer(stopTraining) : stopTraining();
  !isRunning ? (startBtn.innerHTML = "Start") : (startBtn.innerHTML = "Finish");
});

resetBtn.addEventListener("click", () => {
  if (!isRunning) {
    resetValues();
    timersSettings();
  } else {
    //    msgeer function
    messenger(
      `Can't reset while running`,
      document.querySelector(".buttons"),
      2
    );
  }
});
//  circle click
timerCircle.addEventListener("click", () => {
  !isRunning ? timer(stopTraining) : stopTraining();
  !isRunning ? (startBtn.innerHTML = "Start") : (startBtn.innerHTML = "Finish");
});

soundCheckbox.addEventListener("change", () => {
  console.log(soundCheckbox.checked);
  soundCheckbox.checked ? (soundOnOff = true) : (soundOnOff = false);
});
