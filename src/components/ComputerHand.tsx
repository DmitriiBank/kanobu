import React from "react";
import type { CardElement } from "../utils/constants.ts";
import Card from "./Card";
import styles from "../styles/ComputerHand.module.css";

type Props = {
    items: CardElement[];
};

const ComputerHand:React.FC<Props> = ({ items }) => {
    const angleStep = -20 / Math.max(items.length, 1); // Меньший угол для компьютера
    const startAngle = angleStep * (items.length - 1) / 2;
    const image = `${import.meta.env.BASE_URL}/images/back.png`;
    return (
        <div className={styles["computer-hand"]}>
            <div className={styles["card-list"]}>
                {items.map((item, index) => {
                    const angle = startAngle + index * angleStep;
                    const offsetX = index * 15 - ((items.length - 1) * 15) / 2;

                    return (
                        <div
                            key={`cpu-${item.id}-${index}`}
                            className={styles["computer-card-wrapper"]}
                            style={{
                                transform: `translateX(${offsetX}px) rotate(${angle}deg)`,
                                zIndex: index,
                                ['--index-rotation' as any]: `${angle}deg`
                            }}
                        >
                            <Card
                                item={item}
                                src={image}
                                onClick={() => {}}
                                className={styles["computer-card"]}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComputerHand;