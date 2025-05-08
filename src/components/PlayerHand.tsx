import styles from "../styles/PlayerHand.module.css";
import Card from "./Card";
import type { CardElement } from "../utils/constants.ts";

interface Props {
    items: CardElement[];
    selectCard: (card: CardElement) => void;
}
const PlayerHand = ({ items, selectCard }: Props) => {
    const angleStep = 30 / items.length; // Веер на 30°
    const startAngle = -angleStep * (items.length - 1) / 2;
    const overlap = 10; // Настройка наслоения: меньше — больше перекрытие

    return (
        <div className={styles["hand-container"]}>
            {items.map((item, index) => {
                const angle = startAngle + index * angleStep;
                const offsetX = index * overlap - ((items.length - 1) * overlap) / 2;

                return (
                    <div
                        key={`${item.id}-${index}`}
                        className={styles["card-wrapper"]}
                        style={{
                            transform: `translateX(${offsetX}px) rotate(${angle}deg)`,
                            zIndex: 100 + index,
                        }}
                        onClick={() => selectCard(item)}
                    >
                        <Card item={item} onClick={() => {}} className={styles["card"]} />
                    </div>
                );
            })}
        </div>
    );
};


export default PlayerHand;