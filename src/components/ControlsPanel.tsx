import { FC, ReactElement, useState, useCallback, useEffect, useRef, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { CHESS_CLOCK_STATUS } from "@/types";
import { AppDispatch, RootState } from "@/store";
import { pause, start, reset, selectStatus } from "@/store/rootReducer";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";

const STATUSES_FOR_START_ACTION = [CHESS_CLOCK_STATUS.INITIAL, CHESS_CLOCK_STATUS.PAUSED];

type ControlPanelButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactElement;
};

const ControlPanelButton = forwardRef<HTMLButtonElement, ControlPanelButtonProps>(
  ({ onClick, icon }, ref) => {
    return (
      <button
        className="w-12 h-12 mr-2 flex items-center justify-center rounded-full bg-indigo-800 hover:bg-indigo-600 text-white"
        onClick={onClick}
        ref={ref}
      >
        {icon}
      </button>
    );
  }
);

type ControlPanelConfirmButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
};

const ControlPanelConfirmButton: FC<ControlPanelConfirmButtonProps> = ({ onClick, text }) => {
    return (
      <Button
        className="px-3 py-1 text-sm"
        variant="secondary"
        onClick={onClick}
      >
        {text}
      </Button>
    );
};

const ControlsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();

  const startButtonRef = useRef<HTMLButtonElement>(null);

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const chessClockStatus = useSelector((state: RootState) => selectStatus(state));

  const onActionClick = useCallback((event: React.MouseEvent) => {
    // ignore key press if it's not in a state that allows starting the action
    if (event.detail === 0 && !STATUSES_FOR_START_ACTION.includes(chessClockStatus)) {
      return;
    }

    if (chessClockStatus === CHESS_CLOCK_STATUS.RUNNING) {
      dispatch(pause());
    } else {
      dispatch(start());
    }
  }, [ chessClockStatus ]);

  const onResetClick = useCallback(() => {
    // skip asking for confirmation when status is 'finished'
    if (chessClockStatus === CHESS_CLOCK_STATUS.FINISHED) {
      dispatch(reset());
    } else {
      setShowResetConfirmation(true);
    }
  }, [chessClockStatus, setShowResetConfirmation]);

  const onConfirmResetClick = useCallback(() => {
    setShowResetConfirmation(false);
    dispatch(reset());
  }, [setShowResetConfirmation]);

  useEffect(() => {
    if (!startButtonRef.current) {
      return;
    }
    // remove focus from the start button if the current state doesn't allow starting the action; otherwise, keep it focused
    if (STATUSES_FOR_START_ACTION.includes(chessClockStatus)) {
      startButtonRef.current.focus();
    } else {
      startButtonRef.current.blur();
    }
  }, [chessClockStatus]);

  const content = (showResetConfirmation) ? (
    <>
    <div className="flex items-center justify-center gap-4 p-4  text-black">
      <span className="text-sm font-medium">Reset?</span>
      <ControlPanelConfirmButton text="Yes" onClick={onConfirmResetClick}/>
      <ControlPanelConfirmButton text="No" onClick={() => setShowResetConfirmation(false)}/>
    </div>
    </>
  ) : (
    <>
      {chessClockStatus !== CHESS_CLOCK_STATUS.RUNNING ? (
        <ControlPanelButton
          onClick={onResetClick}
          icon={(<Icon size={32} name={'reset'}/>)}
        />
        ) : null}
      {chessClockStatus !== CHESS_CLOCK_STATUS.FINISHED ? (
        <ControlPanelButton
          onClick={onActionClick}
          icon={(<Icon size={32} name={chessClockStatus === CHESS_CLOCK_STATUS.RUNNING ? 'pause': 'play'}/> )}
          ref={startButtonRef}
        />
      ) : null}
    </>
  );

  return (
    <div className="flex flex-row items-center justify-center h-[50px] p-4 bg-stone-300 text-black border-t border-b border-indigo-800 w-full">
      {content}
    </div>
  );
};

export { ControlsPanel };
