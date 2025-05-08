import { useState } from "react";

const Invitation = () => {
    const [playerName, setPlayerName] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (playerName.trim()) {
            setIsSubmitted(true);
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter" && playerName.trim()) {
            handleSubmit();
        }
    };

    return (
        <div className="invitation-container">
            {!isSubmitted ? (
                <div className="input-section">
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your name"
                        className="name-input"
                        autoFocus
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!playerName.trim()}
                        className="continue-button"
                    >
                        Continue
                    </button>
                </div>
            ) : (
                <div className="invitation-section">
                    <p className="invitation-text">
                        {playerName}, you are invited to the ship "Espoir".
                    </p>
                    <button
                        onClick={() => alert("Let's play!")}
                        className="play-button"
                    >
                        Let's play
                    </button>
                    <button
                        onClick={() => alert("Sorry, you can't leave this ship!")}
                        className="play-button"
                    >
                        Leave
                    </button>
                </div>
            )}
        </div>
    );
};

export default Invitation;