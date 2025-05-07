export interface CardElement {
    title: "Rock" | "Scissors" | "Paper";
    image: string;
}

export const CARD_TYPES: CardElement[] = [
    { title: "Rock", image: "/images/rock.jpg" },
    { title: "Scissors", image: "/images/scissors.jpg" },
    { title: "Paper", image: "/images/paper.jpg" }
];

const createCards = (): CardElement[] => {
    return CARD_TYPES.flatMap(type => Array(3).fill(type));
};

export const cardsElements = createCards();

export const doesPlayerWin = (player: CardElement, computer: CardElement): "win" | "lose" | "draw" => {
    const winMap = {
        Rock: "Scissors",
        Scissors: "Paper",
        Paper: "Rock"
    } as const;

    if (player.title === computer.title) return "draw";
    return winMap[player.title] === computer.title ? "win" : "lose";
};

