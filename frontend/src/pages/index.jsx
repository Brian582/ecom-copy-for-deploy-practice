import Hero from '../components/Hero';
import FeaturedDishes from '../components/FeaturedDishes';
import CallToAction from '../components/CallToAction';
import '../styles/Index.css';

export default function Index() {
  return (
    <div className="index-page">
      <Hero />
      <FeaturedDishes />
      <CallToAction />
    </div>
  );
}