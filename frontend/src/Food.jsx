import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from './images/food/foodimages.js';
import './food.css'
import "./data/menu.json"

export default function Food(){
  return ( 
    <>
      {/* first row of meals */}
      <section className='meal-row'>
        <div>
          <img src={dumplings} alt="dumplings"  />
          <p>Dumplings</p>
        </div>
        <div>
          <img src={kungpaochicken} alt="kungpaochicken"  />
          <p>Kung Pao Chicken</p>
        </div>
          <div>
          <img src={sweetsourchicken} alt="sweetsourchicken" />
        <p>Sweet and Sour Chicken</p>
        </div>
      </section>

      {/* second row of meals */}
      <section className='meal-row'>
        <div>
          <img src={chowmein} alt="chowmein"/>
          <p>Chow Mein</p>
        </div>
        <div>
          <img src={lomein} alt="lomein"/>
          <p>Lo Mein</p>
        </div>
        <div>
          <img src={generaltsochicken} alt="generaltsochicken" />
          <p>General Tso Chicken</p>
        </div>
      </section>

      {/* third row of meals */}
      <section className='meal-row'>
        <div>
          <img src={eggrolls} alt="eggrolls" />
          <p>Egg Rolls</p>
        </div>
        <div>
          <img src={wontonsoup} alt="wontonsoup" />
          <p>Wonton Soup</p>
        </div>
        <div>
          <img src={chickenwithbroccoli} alt="chickenwithbroccoli" />
          <p>Chicken with Broccoli</p>
        </div>
      </section>
    </>
  )
}