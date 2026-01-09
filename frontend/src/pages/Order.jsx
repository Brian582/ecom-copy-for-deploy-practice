import '../styles/order.css';
import { useContext, useEffect, useState } from 'react';
import menuData from '../data/menu.json';
import pricesData from '../data/meal_prices.json';
import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from '../images/food/foodimages.js';

import { ThemeContext } from '../Context.jsx';

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
  const [meals, setMeals] = useState([]);

  useEffect(() => {

    const images = {
      'dumplings': dumplings,
      'kung pao chicken': kungpaochicken,
      'sweet and sour chicken': sweetsourchicken,
      'chow mein': chowmein,
      'lo mein': lomein,
      'general tso chicken': generaltsochicken,
      'egg rolls': eggrolls,
      'wonton soup': wontonsoup,
      'chicken with broccoli': chickenwithbroccoli,
    };

    // menuData.items is an array of rows; its flattened into single list
    const flattened = menuData.items.flat();

    const combined = flattened.map((menuItem) => {
      const key = menuItem.name.toLowerCase();
      const img = images[key]
      const priceObj = pricesData.meal_prices.find((p) => p.meal_Id === menuItem.meal_Id);
      const price = priceObj && priceObj.price;
      return { meal_Id: menuItem.meal_Id, img, name: menuItem.name, price };
    });

    setMeals(combined);
  }, []);

  function handleAddItem(meal_Id, name, price) {
    const item = { meal_Id, name, price };
    addItem(item);
  }

  const rows = split(meals, 3);//splits the meals into 3 rows for the UI

  return (
    <>
      <h2>Choose a meal to start your order</h2>
      <div className="spacing">
        {/* loops each row */}
        {rows.map((row, rowIndex) => (
          <section className="row" key={rowIndex}>
            {/* loops each meal in a row */}
            {row.map((meal, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleAddItem( meal.meal_Id, meal.name, meal.price);
                }}
              >
                <img src={meal.img} alt={meal.name} />
                <p>{meal.name}</p>
                <p>{meal.price}</p>
              </button>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
