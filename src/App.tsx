import { useState } from "react";
import Game from "./components/Game";
import "./App.css";

function App() {
    const [showGame, setShowGame] = useState(false);

    return (
        <div className="app">
            {!showGame ? (
                <div className="invitation">
                    <h1>Камень, Ножницы, Бумага</h1>
                    <button onClick={() => setShowGame(true)}>Начать игру</button>
                </div>
            ) : (
                <Game onExit={() => setShowGame(false)} />
            )}
        </div>
    );
}

export default App;