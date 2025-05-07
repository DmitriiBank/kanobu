import React from 'react';
import type {CardElement} from "../utils/constants.ts";
import styles from "./CardItem.module.css"

type Props = {
    item: CardElement;
    onClick: () => void;
    className?: string;
    src?: string;
}

const CardItem: React.FC<Props> = ({ item, onClick, className, src }) => {
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

export default CardItem;