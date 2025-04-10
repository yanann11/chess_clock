import "./App.css";
import { ChessClock } from "./components/ChessClock";
import bgImage from "./assets/chessboard.png";

function App() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: `repeat url(${bgImage})` }}
    >
      <div className="w-full max-w-4xl md:h-auto h-full flex items-center justify-center">
        <ChessClock />
      </div>
    </div>
  );

}

export default App;