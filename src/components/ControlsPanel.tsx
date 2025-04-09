import { useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { CHESS_CLOCK_STATUS } from "@/types";
import { AppDispatch, RootState } from "@/store";
import { pause, start, reset, selectStatus } from "@/store/rootReducer";

import { Icon } from "@/components/Icon";

const STATUSES_FOR_START_ACTION = [CHESS_CLOCK_STATUS.INITIAL, CHESS_CLOCK_STATUS.PAUSED];

const ControlsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();

  const startButtonRef = useRef<HTMLButtonElement>(null);

  const status = useSelector((state: RootState) => selectStatus(state));

  const onActionClick = useCallback((event: React.MouseEvent) => {
    // ignore key press if it's not in a state that allows starting the action
    if (event.detail === 0 && !STATUSES_FOR_START_ACTION.includes(status)) {
      return;
    }

    if (status === CHESS_CLOCK_STATUS.RUNNING) {
      dispatch(pause());
    } else {
      dispatch(start());
    }
  }, [ status ]);

  const onResetClick = useCallback(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (!startButtonRef.current) {
      return;
    }
    // remove focus from the start button if the current state doesn't allow starting the action; otherwise, keep it focused
    if (STATUSES_FOR_START_ACTION.includes(status)) {
      startButtonRef.current.focus();
    } else {
      startButtonRef.current.blur();
    }
  }, [status]);

  return (
    <div className="flex flex-row items-center justify-center p-4 bg-stone-300 text-black border-t border-b border-indigo-800 w-full"
         style={{ height: "50px" }}>
      <button
        className="w-12 h-12 mr-2 flex items-center justify-center rounded-full bg-indigo-800 hover:bg-indigo-600 text-white"
        onClick={onResetClick}
      >
        <Icon size={32} name={'reset'}/>   
      </button>
      {status !== CHESS_CLOCK_STATUS.FINISHED ? (
        <button 
          ref={startButtonRef}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-800 hover:bg-indigo-600 text-white"
          onClick={onActionClick}
        > 
          <Icon size={32} name={status === CHESS_CLOCK_STATUS.RUNNING ? 'pause': 'play'}/>      
        </button>
      ) : null}
    </div>
  );
};

export { ControlsPanel };
