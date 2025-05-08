import { useEffect, useState } from "react";
import type { CardElement } from "../utils/constants";
import { cardsElements, doesPlayerWin } from "../utils/constants.ts";
import GameBoard from "./GameBoard.tsx";

interface GameProps {
    onExit: () => void;
}

// 👇 Добавьте типизацию:
const Game: React.FC<GameProps> = ({ onExit }) => {
    const [playerCards, setPlayerCards] = useState<CardElement[]>(cardsElements);
    const [selectedCard, setSelectedCard] = useState<CardElement | null>(null);
    const [computerCards, setComputerCards] = useState<CardElement[]>(cardsElements);
    const [computerCard, setComputerCard] = useState<CardElement | null>(null);
    const [lastCpuLost, setLastCpuLost] = useState(false);
    const [playerScore, setPlayerScore] = useState(3);
    const [computerScore, setComputerScore] = useState(3);
    const [roundResult, setRoundResult] = useState<string | null>(null);
    const [showRules, setShowRules] = useState(false);
    const [playerHistory, setPlayerHistory] = useState<string[]>([]);
    const [roundNumber, setRoundNumber] = useState(0);
    const [drawStreak, setDrawStreak] = useState<{ count: number; card: string | null }>({ count: 0, card: null });
    // Новые состояния для более агрессивного ИИ
    const [playerCardFrequency, setPlayerCardFrequency] = useState<Record<string, number>>({ Rock: 0, Paper: 0, Scissors: 0 });
    const [playerPatternFound, setPlayerPatternFound] = useState<boolean>(false);
    const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
    const [aggressionLevel, setAggressionLevel] = useState<number>(1); // 1-10, где 10 - максимальная агрессия

    useEffect(() => {
        const hasSeenRules = localStorage.getItem("hasSeenRules");
        if (!hasSeenRules) {
            setShowRules(true);
            localStorage.setItem("hasSeenRules", "true");
        }

        // Увеличиваем агрессию с каждым раундом до максимума
        if (roundNumber > 0 && aggressionLevel < 10) {
            setAggressionLevel(prev => Math.min(prev + 0.5, 10));
        }

        // Увеличиваем агрессию если ИИ начинает проигрывать
        if (computerScore < playerScore && aggressionLevel < 8) {
            setAggressionLevel(prev => Math.min(prev + 1, 10));
        }
    }, [roundNumber, computerScore, playerScore]);

    const counterMap = {
        Rock: "Paper",
        Paper: "Scissors",
        Scissors: "Rock"
    } as const;

    const updatePlayerCardFrequency = (card: CardElement) => {
        setPlayerCardFrequency(prev => ({
            ...prev,
            [card.title]: prev[card.title as keyof typeof prev] + 1
        }));
    };

    // Более продвинутое обнаружение паттернов
    const detectPlayerPattern = (history: string[]): keyof typeof counterMap | null => {
        if (history.length < 3) return null;

        // Проверка на повторение последней карты
        const last = history[history.length - 1];
        const repeatCount = history.slice(-3).filter(h => h === last).length;
        if (repeatCount >= 2) return last as keyof typeof counterMap;

        // Проверка на циклический паттерн (например, Камень-Ножницы-Бумага)
        if (history.length >= 6) {
            const lastThree = history.slice(-3).join("");
            const prevThree = history.slice(-6, -3).join("");
            if (lastThree === prevThree) {
                // Предсказываем следующий ход на основе цикла
                return history[history.length - 3] as keyof typeof counterMap;
            }
        }

        // Проверка на чередование двух карт
        if (history.length >= 4) {
            const lastTwo = [history[history.length - 2], history[history.length - 1]];
            const prevTwo = [history[history.length - 4], history[history.length - 3]];
            if (lastTwo[0] === prevTwo[0] && lastTwo[1] === prevTwo[1]) {
                return lastTwo[0] as keyof typeof counterMap;
            }
        }

        return null;
    };

    const predictPlayerMove = (
        playerCards: CardElement[],
        computerCards: CardElement[],
        lastCpuLost: boolean
    ): CardElement => {
        // Первый ход - играем случайно с небольшим уклоном в сторону камня
        if (roundNumber === 0) {
            // С большей вероятностью выбираем бумагу, которая бьет камень (частый первый выбор игроков)
            const firstMoveBias = computerCards.filter(c => c.title === "Paper");
            if (firstMoveBias.length > 0 && Math.random() > 0.3) {
                return firstMoveBias[0];
            }
            return computerCards[Math.floor(Math.random() * computerCards.length)];
        }

        // Обработка серии ничьих
        if (drawStreak.count >= 2 && drawStreak.card) {
            const antiDrawCard = computerCards.find(c => c.title === counterMap[drawStreak.card as keyof typeof counterMap]);
            if (antiDrawCard) return antiDrawCard;
        }

        // Подсчет оставшихся типов карт у игрока
        const count = { Rock: 0, Scissors: 0, Paper: 0 };
        playerCards.forEach(c => count[c.title as keyof typeof count]++);

        const remainingTypes = Object.entries(count)
            .filter(([_, value]) => value > 0)
            .map(([type]) => type as keyof typeof counterMap);

        // Анализ паттернов
        const pattern = detectPlayerPattern(playerHistory);
        if (pattern) {
            setPlayerPatternFound(true);
            // С высокой агрессией всегда используем обнаруженный паттерн
            if (aggressionLevel > 7) {
                const winCard = computerCards.find(c => c.title === counterMap[pattern]);
                if (winCard) return winCard;
            }
            // С умеренной агрессией используем паттерн с вероятностью
            else if (Math.random() < 0.7 + (aggressionLevel * 0.03)) {
                const winCard = computerCards.find(c => c.title === counterMap[pattern]);
                if (winCard) return winCard;
            }
        } else {
            setPlayerPatternFound(false);
        }

        // Агрессивно реагируем на проигрыш
        if (lastCpuLost) {
            setConsecutiveLosses(prev => prev + 1);

            // После нескольких поражений агрессивно меняем тактику
            if (consecutiveLosses >= 2 || aggressionLevel > 8) {
                // Анализируем, какую карту игрок использовал для победы в последний раз
                const lastPlayerWinningCard = playerHistory[playerHistory.length - 1];
                if (lastPlayerWinningCard) {
                    // Угадываем следующий вероятный ход на основе прошлой победы игрока
                    const expectedNextCard = counterMap[lastPlayerWinningCard as keyof typeof counterMap];
                    const counterToExpected = counterMap[expectedNextCard as keyof typeof counterMap];

                    const optimalCard = computerCards.find(c => c.title === counterToExpected);
                    if (optimalCard) return optimalCard;
                }
            }
        } else {
            setConsecutiveLosses(0);
        }

        // Если у игрока осталось мало карт, используем специальную логику
        if (playerCards.length <= 3) {
            // Находим самый частый тип карты у игрока
            const mostFrequent = Object.entries(playerCardFrequency)
                .filter(([type]) => count[type as keyof typeof count] > 0) // только из оставшихся
                .sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof counterMap;

            if (mostFrequent) {
                const counterCard = computerCards.find(c => c.title === counterMap[mostFrequent]);
                if (counterCard && aggressionLevel > 5) return counterCard;
            }
        }

        // У игрока осталось 2 разных карты — действуем агрессивно
        if (remainingTypes.length === 2) {
            // Собираем все подходящие победные карты
            const winningOptions = remainingTypes
                .map(type => counterMap[type])
                .filter((title, index, self) => self.indexOf(title) === index);

            for (const winTitle of winningOptions) {
                const winningCard = computerCards.find(c => c.title === winTitle);
                if (winningCard) return winningCard;
            }

            // Если нет победных — ищем ничейную
            for (const type of remainingTypes) {
                const drawCard = computerCards.find(c => c.title === type);
                if (drawCard) return drawCard;
            }
        }

        // Стратегия по умолчанию: выбираем карту против самой частой у игрока с учетом агрессии
        const cardWeights = Object.entries(playerCardFrequency)
            .filter(([type]) => count[type as keyof typeof count] > 0) // только из оставшихся
            .map(([type, freq]) => {
                // Добавляем случайный фактор, который уменьшается с ростом агрессии
                const randomFactor = (10 - aggressionLevel) * 0.5;
                return {
                    type,
                    weight: freq + (aggressionLevel * 0.2) + (Math.random() * randomFactor)
                };
            })
            .sort((a, b) => b.weight - a.weight);

        if (cardWeights.length > 0) {
            const mostLikelyType = cardWeights[0].type as keyof typeof counterMap;
            const counterChoice = counterMap[mostLikelyType];

            const bestCard = computerCards.find(c => c.title === counterChoice);
            if (bestCard) return bestCard;
        }

        // Если ничего не сработало, выбираем случайную карту
        return computerCards[Math.floor(Math.random() * computerCards.length)];
    };

    const handleSelectCard = (card: CardElement) => {
        setRoundNumber(prev => prev + 1);

        if (selectedCard) return;

        // Обновляем частоту использования карт игроком
        updatePlayerCardFrequency(card);

        const cpuCard = predictPlayerMove(playerCards, computerCards, lastCpuLost);
        setSelectedCard(card);
        setComputerCard(cpuCard);

        setPlayerCards(prev => {
            const index = prev.findIndex(c => c === card);
            if (index === -1) return prev;

            const newCards = [...prev];
            newCards.splice(index, 1);
            return newCards;
        });

        setComputerCards(prev => {
            const index = prev.findIndex(c => c === cpuCard);
            if (index === -1) return prev;

            const newCards = [...prev];
            newCards.splice(index, 1);
            return newCards;
        });

        setPlayerHistory(prev => {
            const updated = [...prev, card.title];
            return updated.slice(-10); // увеличили до 10 последних ходов для лучшего анализа
        });

        const result = doesPlayerWin(card, cpuCard);
        if (result === "draw") {
            setDrawStreak(prev => ({
                count: prev.card === card.title ? prev.count + 1 : 1,
                card: card.title
            }));
        } else {
            setDrawStreak({ count: 0, card: null });
        }

        if (result === "win") {
            setPlayerScore((s) => s + 1);
            setComputerScore((s) => s - 1);
            setRoundResult("Вы победили!");
            setLastCpuLost(true);
            // Увеличиваем агрессию при проигрыше
            setAggressionLevel(prev => Math.min(prev + 1.5, 10));
        } else if (result === "lose") {
            setPlayerScore((s) => s - 1);
            setComputerScore((s) => s + 1);
            setRoundResult("Вы проиграли.");
            setLastCpuLost(false);
        } else {
            setRoundResult("Ничья!");
            setLastCpuLost(true);
        }
    };

    const handleReset = () => {
        setSelectedCard(null);
        setComputerCard(null);
        setRoundResult(null);
    };

    const restartGame = () => {
        setPlayerCards(cardsElements);
        setComputerCards(cardsElements);
        setSelectedCard(null);
        setComputerCard(null);
        setPlayerScore(3);
        setComputerScore(3);
        setRoundResult(null);
        setLastCpuLost(false);
        setShowRules(false); // если хотите показать правила заново, иначе можно убрать
        setPlayerHistory([]);
        setRoundNumber(0);
        setDrawStreak({ count: 0, card: null });
        setPlayerCardFrequency({ Rock: 0, Paper: 0, Scissors: 0 });
        setPlayerPatternFound(false);
        setConsecutiveLosses(0);
        setAggressionLevel(1);
        localStorage.removeItem("hasSeenRules"); // если хотите сбросить просмотр правил
    };



    return (
        <div className="game-container">
            <h2>Камень, ножницы, бумага</h2>

            {showRules && (
                <div className="rules-modal">
                    <h3>Правила</h3>
                    <p>Камень бьёт ножницы, ножницы — бумагу, бумага — камень.</p>
                    <p>Звезды - это ваши жизни, чем меньше звезд, тем вы ближе к прогрышу.</p>
                    <p>Игра окончится когда закончатся карты или звезды у вас или у вашего противника.</p>
                    <button onClick={() => setShowRules(false)}>Понятно</button>
                </div>
            )}


            <GameBoard
                playerCards={playerCards}
                computerCards={computerCards}
                onSelectCard={handleSelectCard}
                selectedCards={
                    selectedCard && computerCard
                        ? { player: selectedCard, computer: computerCard }
                        : undefined
                }
                roundResult={roundResult}
                onClickCard={handleReset}
                onRestart={restartGame}
                playerScore = {playerScore}
                computerScore={computerScore}
                // Исправлено: имя пропа соответствует GameBoard
            />
            <button onClick={onExit}>Выйти из игры</button>
        </div>
    );
};

export default Game;