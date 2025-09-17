import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from './images/food/foodimages.js';
import './food.css'

export default function Food(){
  return ( 
    <>
      <section className='row'>
        <div>
          <img src={dumplings} alt="dumplings"  />
          <p>Dumplings</p>
        </div>
        <div>
          <img src={kungpaochicken} alt="kungpaochicken"  />
          <p>Kung pao chicken</p>
        </div>
          <div>
          <img src={sweetsourchicken} alt="sweetsourchicken" />
        <p>Sweet and sour chicken</p>
        </div>
      </section>

      <section className='row'>
        <div>
          <img src={chowmein} alt="chowmein"/>
          <p>Chow mein</p>
        </div>
        <div>
          <img src={lomein} alt="lomein"/>
          <p>Chow mein</p>
        </div>
        <div>
          <img src={generaltsochicken} alt="generaltsochicken" />
          <p>General Tso chicken</p>
        </div>
      </section>

      <section className='row' >
        <div>
          <img src={eggrolls} alt="eggrolls" />
          <p>Egg rolls</p>
        </div>
        <div>
          <img src={wontonsoup} alt="wontonsoup" />
          <p>Wonton soup</p>
        </div>
        <div>
          <img src={chickenwithbroccoli} alt="chickenwithbroccoli" />
          <p>Chicken with Broccoli</p>
        </div>
      </section>
    </>
  )
}