import { ChessPlayerPanel } from "./ChessPlayerPanel";
import { ControlsPanel } from "./ControlsPanel";
import { CHESS_PLAYER_COLOR } from "@/types";
import { getChessClockSize } from "@/helpers";
import { useWindowSize } from "@/hooks/useWindowSize";

const ChessClock = () => {
    const windowSize =  useWindowSize();
    const chessClockSize = getChessClockSize(windowSize);
    
    return (
        <div
            className="flex flex-col items-center justify-center bg-gray-200 border-indigo-800 border-2"
            style={{ width: chessClockSize.width, height: chessClockSize.height }}
        >
        <ChessPlayerPanel color={CHESS_PLAYER_COLOR.WHITE}/>
        <ControlsPanel/>
        <ChessPlayerPanel color={CHESS_PLAYER_COLOR.BLACK}/>
      </div>
    );
};

export { ChessClock };
