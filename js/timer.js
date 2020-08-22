const setterBtns = document.querySelectorAll("button[data-setter]");
const remainTime = document.querySelector(".remain-time");
const startStopBtn = document.querySelector(".start-stop-button");
const progressBar = document.querySelector(".timer-progress");
const timerPointer = document.querySelector(".timer-pointer");
const video = document.getElementById('background-video');
const audio = document.getElementById('background-audio');
const moodBtns = document.querySelectorAll('.mood-picker button');
const activeBtns = Array.from(setterBtns).concat(Array.from(moodBtns))
let paused = true;
let firstCallOfGivenTime = true;
let intervalId = 0;

const changeTime = (function() {
  let splitedTime = [];
  return (seconds) => {
  splitedTime = remainTime.innerHTML.split(":").map(el => parseInt(el));
  seconds = parseInt(seconds);
  if (seconds === 60) {
    splitedTime[0] += 1;                                      //TODO: Shorten these if statements
  } else if (seconds === -60 && splitedTime[0] > 0) {
    splitedTime[0] -= 1;
  } else if (splitedTime[1] === 59 && seconds === 1) {
    splitedTime[0] += 1;
    splitedTime[1] = 0;
  } else if (splitedTime[1] >= 0 && seconds === 1) {
    splitedTime[1] += 1;
  } else if (splitedTime[1] > 0 && seconds === -1) {
    splitedTime[1] += -1;
  } else if (splitedTime[0] > 0 && seconds === -1 && splitedTime[1] === 0) {
    splitedTime[0] -= 1;
    splitedTime[1] = 59;
  }
  return splitedTime.map(el => ("0" + el.toString()).slice(-2)).join(":");
}
})();

const updateRemainTime = newTime => {
  remainTime.innerHTML = newTime;
};

const countDown = (degreeOffset, offsetEverySecond) => {
  updateRemainTime(changeTime(-1));
  progressBarAnim(degreeOffset, offsetEverySecond);
  if (remainTime.innerHTML === "00:00")
    setTimeout(resetCounter, 1000);
};

const resetCounter = () => {
  pauseCounter();
  progressBar.style.strokeDashoffset = 0;
  timerPointer.style.transform = `rotate(${0}deg)`;
  firstCallOfGivenTime = true;
  activeBtns.forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = 1;
  });
};

const pauseCounter = () => {
  clearInterval(intervalId);
  paused = true;
  startStopBtn.classList.remove("paused");
  video.pause();
  audio.pause();
}

const startStopTimer = (() => {
  let offsets = [];
  return () => {
    if (firstCallOfGivenTime) {
      offsets = calculateOffsetsToBarAnim();
      firstCallOfGivenTime = false;
    }
    if(paused) {
      paused = false;
      activeBtns.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = 0.5;
      });
      startStopBtn.classList.add("paused");
      intervalId = setInterval(`countDown(${offsets[0]}, ${offsets[1]})`, 1000);
      video.play();
      audio.play();
    } else {
      pauseCounter();
    }
  }
})();

const calculateOffsetsToBarAnim = (() => {
  let splitedTime = [];
  let totalTime = 0;
  let offsetEverySecond = 0;
  const progressBarLength = Math.PI * 2 * progressBar.r.baseVal.value;
  progressBar.style.strokeDasharray = progressBarLength;
  progressBar.style.strokeDashoffset = 0;
  return () => {
    splitedTime = remainTime.innerHTML.split(":").map(el => parseInt(el));
    totalTime = splitedTime[0] * 60 + splitedTime[1];
    offsetEverySecond = progressBarLength / totalTime;
    degreeOffset = 360 / totalTime;
    return [degreeOffset, offsetEverySecond];
  }
})();

const progressBarAnim = (() => {
  let currentDegree = 0;
  let currentDashoffset = 0;
  return (degreeOffset, offsetEverySecond) => {
    currentDashoffset = parseFloat(progressBar.style.strokeDashoffset);
    progressBar.style.strokeDashoffset = currentDashoffset + offsetEverySecond;
    currentDegree -= degreeOffset;
    timerPointer.style.transform = `rotate(${currentDegree}deg)`;
    if (currentDegree < -360)
      currentDegree = 0;
  }
})();

setterBtns.forEach(btn => {
  btn.addEventListener("click", function() {updateRemainTime(changeTime(this.value))});
})
startStopBtn.addEventListener("click", startStopTimer);
