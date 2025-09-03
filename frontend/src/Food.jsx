import dumplings from './images/food/dumplings.jpg';
import kungpaochicken from './images/food/kungpaochicken.webp';
import sweetsourchicken from './images/food/sweetsourchicken.webp';
import chowmein from './images/food/chowmein.jpg';
import lomein from './images/food/lomein.jpg';
import generaltsochicken from './images/food/GeneralTsoChicken.jpg';
import eggrolls from './images/food/eggrolls.jpg';
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
          <img src={eggrolls} alt="eggrolls}" />
          <p>Egg rolls</p>
        </div>
        <div>
          <p>Wonton soup</p>
        </div>
        <div>
          <p>Chicken with Broccoli</p>
        </div>
      </section>
    </>
  )
}