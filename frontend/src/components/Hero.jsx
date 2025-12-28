import dragonEmblem from '../assets/dragon-emblem.png';
import '../styles/Hero.css';

function Hero() {
  return (
    <section className="hero">
      {/* Background gradient overlay */}
      <div className="hero-gradient" />

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title animate-fade-in">Welcome to Wok This Way!</h1>

        <div className="hero-image-wrapper">
          <img
            src={dragonEmblem}
            alt="Golden Dragon Emblem"
            className="hero-image animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          />
        </div>

        <p
          className="hero-subtitle animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Experience authentic Chinese cuisine delivered fresh to your door
        </p>
      </div>

      {/* Decorative elements */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
    </section>
  );
}

export default Hero;
