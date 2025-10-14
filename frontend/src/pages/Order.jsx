import { useContext } from 'react';
import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from '../images/food/foodimages.js';
import '../styles/order.css';

import { ThemeContext } from '../Context.jsx';

//objects in array with meals content
const meals = [
  { img: dumplings, name: 'Dumplings', price: '$10.20' },
  { img: kungpaochicken, name: 'Kung Pao Chicken', price: '$11.00' },
  { img: sweetsourchicken, name: 'Sweet and Sour Chicken', price: '$11.11' },
  { img: chowmein, name: 'Chow Mein', price: '$9.00' },
  { img: lomein, name: 'Lo Mein', price: '$8.35' },
  { img: generaltsochicken, name: 'General Tso Chicken', price: '$7.22' },
  { img: eggrolls, name: 'Egg Rolls', price: '$4.75' },
  { img: wontonsoup, name: 'Wonton Soup', price: '$4.87' },
  { img: chickenwithbroccoli, name: 'Chicken with Broccoli', price: '$8.99' },
];

//splits the meals object array into rows of `size`
function split(array,size) {
  const rows = [];
  
  //converts the meals object array into a 2 dimensional array, 3 meals in each row
  for (let i = 0; i < array.length; i += size){
    rows.push(array.slice(i, i + size));
  }

  return rows;
}

export default function Order() {
  const { addItem } = useContext(ThemeContext);

  function handleAddItem(name, price) {
    const item = { name, price };
    addItem(item);
  }

  const rows = split(meals, 3);

  return (
    <>
      <h2>Choose a meal to start your order</h2>

      {/* loops each row */}
      {rows.map((row, rowIndex) => (
        <section className="row" key={rowIndex}>
          {/* loops each meal in a row */}
          {row.map((meal, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleAddItem(meal.name, meal.price);
              }}
            >
              <img src={meal.img} alt={meal.name} />
              <p>{meal.name}</p>
            </button>
          ))}
        </section>
      ))}
    </>
  );
}
