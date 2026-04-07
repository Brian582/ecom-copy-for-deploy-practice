import '../styles/Order.css';
import { useContext, useEffect, useState } from 'react';
import menuData from '../data/menu.json';
import pricesData from '../data/meal_prices.json';
import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from '../images/food/foodimages.js';

import { ThemeContext, AuthContext } from '../Context.jsx';

//splits the meals object array into rows of `size`
function split(meals, size) {
  const mealRows = [];
  
  //converts the meals object array into a 2 dimensional array, 3 meals in each row
  for (let i = 0; i < meals.length; i += size){
    mealRows.push(meals.slice(i, i + size));
  }

  return mealRows;
}

export default function Order() {
  const { addItem } = useContext(ThemeContext);
  const { auth } = useContext(AuthContext);
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
      const img = images[key];
      const priceObj = pricesData.meal_prices.find((p) => p.mealId === menuItem.mealId || p.mealId === menuItem.mealId);
      const price = priceObj && priceObj.price;
      return { mealId: menuItem.mealId ?? menuItem.mealId ?? menuItem.mealId, img, name: menuItem.name, price };
    });

    setMeals(combined);
  }, []);

  function handleAddItem(mealId, name, price) {
    const item = { mealId, name, price };
    addItem(item, auth);
  }

  const mealRows = split(meals, 3);//splits the meals into 3 rows for the UI

  return (
    <>
      <h2>Choose a meal to start your order</h2>
      <div>
        {/* loops each row */}
        {mealRows. map((mealRow, rowIndex) => (
          <section className="mealRow" key={rowIndex}>
            {/* loops each meal in a row */}
            {mealRow.map((meal, idx) => (
              <button
                type="button"
                key={meal.mealId ?? idx}
                onClick={() => handleAddItem(meal.mealId ?? idx, meal.name, meal.price)}
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
