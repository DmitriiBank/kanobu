// import { useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { CardElement, CardType, CARD_TYPES } from "../utils/constants";
//
// type ShopProps = {
//     onClose: () => void;
//     balance: number;
// };
//
// type ShopCard = CardElement & { id: string };
//
// const Shop = ({ onClose, balance }: ShopProps) => {
//     const [cards, setCards] = useState<ShopCard[]>(() =>
//         CARD_TYPES.flatMap(type =>
//             Array(5).fill(0).map(() => ({ ...type, id: uuidv4() }))
//         );
//
//     const buyCard = (id: string, price: number) => {
//         if (balance >= price) {
//             setCards(prev => prev.filter(card => card.id !== id));
//             // Здесь должна быть логика добавления карты игроку
//         }
//     };
//
//     return (
//         <div className="shop">
//             <h2>Магазин</h2>
//             <p>Баланс: {balance} монет</p>
//
//             <div className="card-grid">
//                 {cards.map(card => (
//                     <div key={card.id} className="shop-card">
//                         <img src={card.image} alt={card.title} />
//                         <p>{card.title}</p>
//                         <button onClick={() => buyCard(card.id, 100)}>
//                             Купить за 100
//                         </button>
//                     </div>
//                 ))}
//             </div>
//
//             <button className="close-button" onClick={onClose}>
//                 Вернуться к игре
//             </button>
//         </div>
//     );
// };
//
// export default Shop;