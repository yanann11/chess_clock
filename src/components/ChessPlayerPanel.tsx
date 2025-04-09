import { FC, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { CHESS_CLOCK_STATUS, CHESS_PLAYER_COLOR } from "@/types";
import { AppDispatch, RootState } from "@/store";
import { selectChessPlayer, selectStatus, finish, chessPlayerClick } from "@/store/rootReducer";
import { secondsToTime, secondsToString } from "../helpers";
import { cn } from "@/lib/utils";

import { ChessPlayerSettings } from "./ChessPlayerSettings";
import { Button } from '@/components/ui/button';
import { Icon } from "@/components/Icon";

type ChessPlayerPanelProps = {
  color: CHESS_PLAYER_COLOR
};

const ChessPlayerPanel: FC<ChessPlayerPanelProps> = ({color}) => {
  const dispatch = useDispatch<AppDispatch>();

  const timer = useRef<NodeJS.Timeout | null>(null);

  const chessClockStatus = useSelector((state: RootState) => selectStatus(state));
  const { isActive, time, increment, clicks } = useSelector((state: RootState) => selectChessPlayer(state, color));

  const [timerTime, setTimerTime] = useState(time);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const running = chessClockStatus === CHESS_CLOCK_STATUS.RUNNING && isActive;
  const lost = chessClockStatus === CHESS_CLOCK_STATUS.FINISHED && timerTime === 0;
  const timeControl = secondsToString(time) + '+' + secondsToString(increment);

  // funcrion for stopping the timer
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, [timer]);

  // function to change the timer's time
  const changeTimeValue = useCallback(
    (diff: number) => {
      setTimerTime((prevTime: number) => prevTime > 0 ? prevTime + diff : 0);
    },
    [setTimerTime]
  );

  // starts the timer
  useEffect(() => {
    if (running) {
      if (timer.current) {
        return;   
      }
      timer.current = setInterval(() => {
        changeTimeValue(-1);
      }, 1000);
    }
  }, [timer, running, changeTimeValue]);

  // update the timer's time after changes in the settings
  useEffect(() => {
    if (time !== timerTime && chessClockStatus === CHESS_CLOCK_STATUS.INITIAL) {
      setTimerTime(time);
    }
  }, [time, timerTime, chessClockStatus, setTimerTime]);

  // clear timer if needed
  useEffect(() => {
    if (!running) {
      clearTimer();
    }
  }, [
    running,
    clearTimer,
  ]);

  // finish the clock when the timer's time reaches 0
  useEffect(() => {
    if (timerTime === 0 && running) {
      dispatch(finish());
    }
  }, [
    timerTime,
    running
  ]);

  // click handler for the panel
  const onClick = useCallback(() => {
    if (!running) {
      return;
    }
    dispatch(chessPlayerClick(color));
    changeTimeValue(increment);
  }, [
    running, color, increment, changeTimeValue
  ]);

  // handle Enter press as an alternative to click
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && running) {
        onClick();
      }
    },
    [onClick, running]
  );

  // set up keydown listener to control the chess clock via keyboard
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    // clean up on unmount
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  // choose color for the panel
  const bgColor = useMemo(() => {
    let color = 'bg-gray-300';
    if (running) {
      color = 'bg-green-300';
    } else if (lost) {
      color = 'bg-red-300';
    } else if (isActive) {
      color = 'bg-gray-400';
    }
    return color;
  }, [running, lost, isActive]);

  return (
    <div
      className={cn('flex flex-col items-center justify-center w-full h-full p-4 text-black', bgColor)}
      onClick={onClick}
    >
      <div className="text-6xl font-bold">
        {secondsToTime(timerTime)}
      </div>
      {![CHESS_CLOCK_STATUS.RUNNING, CHESS_CLOCK_STATUS.FINISHED].includes(chessClockStatus) ? (
          <Button
            disabled={chessClockStatus !== CHESS_CLOCK_STATUS.INITIAL}
            variant="outline"
            className="gap-2 mt-2 text-2xl bg-gray-100 border-indigo-800 border"
            onClick={() => setIsSettingsOpen(true)}
          >
              <span>{timeControl}</span>
              {chessClockStatus === CHESS_CLOCK_STATUS.INITIAL ? (<Icon name="edit" size={16}/>) : null}
          </Button> 
      ) : null}
      {chessClockStatus !== CHESS_CLOCK_STATUS.INITIAL ? (
        <div className="text-sm mt-2">
          {`Clicks: ${clicks}`}
        </div>
      ) : null}
      <ChessPlayerSettings
        color={color}
        open={isSettingsOpen}
        setOpen={setIsSettingsOpen}
        timeControl={timeControl}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export { ChessPlayerPanel };
