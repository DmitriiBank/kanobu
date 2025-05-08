import React from "react";
import ComputerHand from "./ComputerHand";
import PlayerHand from "./PlayerHand";
import Card from "./Card";
import styles from "../styles/GameBoard.module.css";
import type {CardElement} from "../utils/constants";
import ScoreStars from "./ScoreStars";

type Props = {
    playerCards: CardElement[];
    computerCards: CardElement[];
    onSelectCard: (card: CardElement) => void;
    selectedCards?: {
        player: CardElement | null;
        computer: CardElement | null;
    };
    roundResult?: string | null;
    onClickCard: () => void;
    onRestart: () => void;
    playerScore: number;
    computerScore: number;
};

const GameBoard: React.FC<Props> = ({
                                        playerCards,
                                        computerCards,
                                        onSelectCard,
                                        selectedCards,
                                        roundResult,
                                        onClickCard,
                                        onRestart,
                                        playerScore,
                                        computerScore
                                    }) => {
    const isGameOver =
        playerCards.length === 0 ||
        computerCards.length === 0 ||
        playerScore === 0 ||
        computerScore === 0;

    return (
        <div className={styles["game-board"]}>
            <div className={styles["top-section"]}>
                <ComputerHand items={computerCards}/>

            </div>

            <div className={styles["middle-section"]}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <ScoreStars score={computerScore}/>

                    <ScoreStars score={playerScore}/>
                </div>
                {selectedCards?.player && selectedCards.computer && (
                    <div className={styles["battle-field"]}>
                        <div className={styles["battle-cards"]}>
                            <div className={styles["computer-card"]}>
                                <h4>Компьютер</h4>

                                <Card
                                    item={selectedCards.computer}
                                    onClick={() => {
                                    }}
                                    className={styles["computer-card-item"]}
                                />
                            </div>
                            <div className={styles["player-card"]}>
                                <h4>Вы</h4>

                                <Card
                                    item={selectedCards.player}
                                    onClick={() => {
                                    }}
                                    className={styles["player-card-item"]}
                                />
                            </div>
                        </div>
                        {roundResult && (
                            <>
                                <h3 className={styles["round-result"]}>{roundResult}</h3>
                                {!isGameOver ? (
                                    <button
                                        className={styles["next-round-button"]}
                                        onClick={onClickCard}
                                    >
                                        Следующий раунд
                                    </button>
                                ) : (
                                    <>
                                        <h3>Игра окончена</h3>
                                        <p>Счёт: Вы {playerScore} — Компьютер {computerScore}</p>
                                        <p>
                                            {playerScore > computerScore
                                                ? "Поздравляем с победой!"
                                                : playerScore === computerScore
                                                    ? "Ничья! Неплохой результат."
                                                    : "ИИ победил. В следующий раз повезёт больше!"}
                                        </p>
                                        <button
                                            className={styles["next-round-button"]}
                                            onClick={onRestart}
                                        >
                                            Другая игра
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className={styles["bottom-section"]}>

                <PlayerHand items={playerCards} selectCard={onSelectCard}/>
            </div>
        </div>
    );
};

export default GameBoard;