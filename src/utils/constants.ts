// constants.ts

export interface CardElement {
    title: "Rock" | "Scissors" | "Paper";
    image: string;
    id: string;
}

export const CARD_TYPES: CardElement[] = [
    { title: "Rock", image: `${import.meta.env.BASE_URL}images/rock.jpg`, id: '' },
    { title: "Scissors", image: `${import.meta.env.BASE_URL}images/scissors.jpg`, id: '' },
    { title: "Paper", image: `${import.meta.env.BASE_URL}images/paper.jpg`, id: '' }
];


let idCounter = 0;

export const createCards = () => {
    return CARD_TYPES.flatMap((type) =>
        Array(3)
            .fill(null)
            .map(() => ({
                ...type,
                id: `card-${idCounter++}`,
            }))
    );
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