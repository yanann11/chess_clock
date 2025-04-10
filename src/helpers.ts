import { HOUR, MINUTE, CHESS_CLOCK_HEIGHT, CHESS_CLOCK_WIDTH } from "@/consts";
import { WINDOW_SIZE, CHESS_CLOCK_SIZE } from "@/types";

const secondsToTime = (value: number): string => {
  const hours = Math.floor(value / HOUR);
  const minutes = Math.floor((value - HOUR * hours) / MINUTE);
  const seconds = Math.floor(value - HOUR * hours - minutes * MINUTE);

  return (
    (hours ? ("" + hours).padStart(2, "0") + ":" : "") +
    (minutes ? ("" + minutes).padStart(2, "0") : "00") +
    ":" +
    (seconds ? ("" + seconds).padStart(2, "0") : "00")
  );
};

const secondsToString = (seconds: number): string => {
  const minutes = Math.floor(seconds / MINUTE);
  return String(minutes === 0 ? seconds : minutes);
};

const formatTimeControl = (timeControl: string): string => {
  const [time, incremrnt] = timeControl.split('+');
  return `${time} min + ${incremrnt} sec`;
};

const generateSliderTimeSteps = () => {
  const values: number[] = [];

  for (let i = 0; i <= 5; i += 1) values.push(i);
  for (let i = 10; i <= 30; i += 5) values.push(i);

  return values;
};

const generateSliderIncrementSteps = () => {
  const values: number[] = [];

  for (let i = 0; i <= 5; i += 1) values.push(i);
  for (let i = 10; i <= 60; i += 5) values.push(i);

  return values;
};

const getSliderIndexByValue = (steps: number[], value: number): number => {
  const index = steps.indexOf(value);
  return index === -1 ? 0 : index;
};


const getChessClockSize = (windowSize: WINDOW_SIZE): CHESS_CLOCK_SIZE => {
  // if the available width is too small, use full screen for the chess clock.
  if ((windowSize.width - CHESS_CLOCK_HEIGHT) < 100) {
    return { width: "100vw", height: "100vh"};
  }
  // otherwise, use fixed dimensions.
  return { width: `${CHESS_CLOCK_WIDTH}px`, height: `${CHESS_CLOCK_HEIGHT}px`};
};

export {
  secondsToTime,
  secondsToString,

  formatTimeControl, 

  generateSliderTimeSteps,
  generateSliderIncrementSteps,
  getSliderIndexByValue,

  getChessClockSize
};  
  