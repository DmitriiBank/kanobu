import React from "react";
import styles from "./ScoreStars.module.css";

type Props = {
    score: number;
};

const ScoreStars: React.FC<Props> = ({ score }) => {
    const stars = Array.from({ length: score }, (_, i) => (
        <span key={i} className={styles.star}>★</span>
    ));
    return <div className={styles["score-stars"]}>{stars}</div>;
};

export default ScoreStars;
