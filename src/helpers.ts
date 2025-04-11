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

const formatTimeControl = (timeControl: string, shortVersion = false): string => {
  const [time, incremrnt] = timeControl.split('+');
  const units = { minutes: 'min', seconds: 'sec' };

  let timeValue = Number(time);
  if (timeValue < 60) {
    return shortVersion ?
      `${timeValue}+${incremrnt}` :
      `${timeValue} ${units.seconds} + ${incremrnt} ${units.seconds}`;
  }
  
  return shortVersion ?
    `${Number(time)/ 60} + ${incremrnt}` :
    `${Number(time)/ 60} ${units.minutes} + ${incremrnt} ${units.seconds}`;
};

const generateSliderTimeSteps = () => {
  const values: number[] = [1, 2, 5, 10, 30, 45];

  for (let i = 60; i <= 300; i += 60) values.push(i);
  for (let i = 300; i <= 3600; i += 300) values.push(i);

  values.push(5400);

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

const getTimeControlValue = (time: number, increment: number): string => {
  return `${time}+${increment}`;
};

const extractTimeControlValue = (timeControlValue: string): number[] => {
  return timeControlValue.split('+').map((val) => Number(val));
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

  getTimeControlValue,
  extractTimeControlValue,
  formatTimeControl, 

  generateSliderTimeSteps,
  generateSliderIncrementSteps,
  getSliderIndexByValue,

  getChessClockSize
};  
  