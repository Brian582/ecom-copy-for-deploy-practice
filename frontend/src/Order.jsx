import dumplings from './images/food/dumplings.jpg';
import kungpaochicken from './images/food/kungpaochicken.webp';
import sweetsourchicken from './images/food/sweetsourchicken.webp';
import chowmein from './images/food/chowmein.jpg';
import lomein from './images/food/lomein.jpg';
import generaltsochicken from './images/food/GeneralTsoChicken.jpg';
import eggrolls from './images/food/eggrolls.jpg';
import wontonsoup from './images/food/WontonSoup.jpg';
import chickenwithbroccoli from './images/food/chickenwithbroccoli.avif';
import './order.css';

import { useContext } from 'react';
import { ThemeContext } from './Context.jsx';

export default function Order(){
  const { updatecartItemcount } = useContext(ThemeContext);

  return ( 
    <>
      <h2>Choose a meal to start your order</h2>
      <section className='row'>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={dumplings} alt="dumplings" />
          <p>Dumplings</p>
        </button>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={kungpaochicken} alt="kungpaochicken" />
          <p>Kung pao chicken</p>
        </button>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={sweetsourchicken} alt="sweetsourchicken" />
          <p>Sweet and sour chicken</p>
        </button>
      </section>

      <section className='row'>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={chowmein} alt="chowmein"/>
          <p>Chow mein</p>
        </button>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={lomein} alt="lomein"/>
          <p>Chow mein</p>
        </button>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={generaltsochicken} alt="generaltsochicken" />
          <p>General Tso chicken</p>
        </button>
      </section>

      <section className='row' >
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={eggrolls} alt="eggrolls" />
          <p>Egg rolls</p>
        </button>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={wontonsoup} alt="wontonsoup" />
          <p>Wonton soup</p>
        </button>
        <button onClick={()=>{updatecartItemcount()}}>
          <img src={chickenwithbroccoli} alt="chickenwithbroccoli" />
          <p>Chicken with Broccoli</p>
        </button>
      </section>
    </>
    )
}