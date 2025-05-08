import React from 'react';
import {CARD_TYPES} from "../utils/constants.ts";
import styles from "../styles/CardItem.module.css"

type Props = {
    item: (typeof CARD_TYPES)[number];
    onClick: () => void;
    className?: string;
    src?: string;
}

const Card: React.FC<Props> = ({ item, onClick, className, src }) => {
    return (
        <div className={`${styles["card-item"]} ${className || ""}`} onClick={onClick}>
            <img
                src={src ?? item.image}
                alt={item.title}
                className={styles["img-card"]}
                style={{ cursor: "pointer" }}
            />
        </div>
    );
};

export default Card;