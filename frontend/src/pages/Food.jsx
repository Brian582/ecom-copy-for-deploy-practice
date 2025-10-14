import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from '../images/food/foodimages.js';
import '../styles/food.css';

//objects in array with meals content
const meals = [
  { src: dumplings, name: 'Dumplings' },
  { src: kungpaochicken, name: 'Kung Pao Chicken' },
  { src: sweetsourchicken, name: 'Sweet and Sour Chicken' },
  { src: chowmein, name: 'Chow Mein' },
  { src: lomein, name: 'Lo Mein' },
  { src: generaltsochicken, name: 'General Tso Chicken' },
  { src: eggrolls, name: 'Egg Rolls' },
  { src: wontonsoup, name: 'Wonton Soup' },
  { src: chickenwithbroccoli, name: 'Chicken with Broccoli' },
];

//splits the meals object array into rows of `size`
function split(array, size) {
  const rows = [];

  //converts the meals object array into a 2 dimensional array, 3 meals in each row
  for (let i = 0; i < array.length; i += size) {
    rows.push(array.slice(i, i + size));
  }

  return rows;
}

export default function Food() {
  const rows = split(meals, 3);

  return (
    <>
    {/* loops each row */}
      {rows.map((row, rowIndex) => (
        <section className="meal-row" key={rowIndex}>
          {/* loops each meal in a row */}
          {row.map((meal, idx) => (
            <div key={idx}>
              <img src={meal.src} alt={meal.name} />
              <p>{meal.name}</p>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
