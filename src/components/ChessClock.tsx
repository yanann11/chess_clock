import { ChessPlayerPanel } from "./ChessPlayerPanel";
import { ControlsPanel } from "./ControlsPanel";
import { CHESS_PLAYER_COLOR } from "@/types";
import { CHESS_CLOCK_MAX_HEIGHT, CHESS_CLOCK_MAX_WIDTH} from "@/consts";

const ChessClock = () => {
    return (
        <div
            className="flex flex-col items-center justify-center bg-gray-200 border-indigo-800 border-2"
            style={{ width: `${CHESS_CLOCK_MAX_WIDTH}px`, height: `${CHESS_CLOCK_MAX_HEIGHT}px`, maxWidth: "100vw", maxHeight: "100vh" }}
        >
        <ChessPlayerPanel color={CHESS_PLAYER_COLOR.WHITE}/>
        <ControlsPanel/>
        <ChessPlayerPanel color={CHESS_PLAYER_COLOR.BLACK}/>
      </div>
    );
};

export { ChessClock };
