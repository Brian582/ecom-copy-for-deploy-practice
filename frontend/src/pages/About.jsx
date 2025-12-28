import { Link } from 'react-router-dom';
import { ChefHat, Heart, Leaf, Award } from 'lucide-react';
// import Navigation from '../components/Navigation';
import dragonEmblem from '../assets/dragon-emblem.png';
import '../styles/About.css';

const values = [
  {
    icon: ChefHat,
    title: 'Authentic Recipes',
    description: 'Passed down through generations, our recipes honor traditional Chinese cooking techniques.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish is prepared with care and passion by our skilled culinary team.',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'We source only the finest, freshest ingredients for authentic flavors.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for excellence in Chinese cuisine and outstanding service.',
  },
];

export default function About() {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-blob about-hero-blob-1" />
        <div className="about-hero-blob about-hero-blob-2" />

        <div className="container about-hero-content">
          <img
            src={dragonEmblem}
            alt="Wok This Way Dragon Emblem"
            className="about-emblem animate-fade-in"
          />
          <h1 className="about-hero-title animate-fade-in">Our Story</h1>
          <p className="about-hero-subtitle animate-fade-in">
            A journey of flavor, tradition, and passion spanning over three decades
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="about-story-card animate-fade-in">
            <h2 className="about-story-title">
              Welcome to <span>Wok This Way</span>
            </h2>
            <div className="about-story-text">
              <p>
                Founded in 1992 by Chef Ming Liu, Wok This Way began as a small family kitchen
                with a big dream: to bring the authentic flavors of Sichuan and Cantonese cuisine
                to our community.
              </p>
              <p>
                What started as a humble 20-seat restaurant has grown into a beloved culinary
                destination, but our commitment to quality and tradition remains unchanged.
                Every dish we serve tells a story of heritage, crafted with recipes passed
                down through four generations.
              </p>
              <p>
                Today, under the leadership of Chef Ming's daughter, Lisa Liu, we continue
                to honor our roots while embracing innovation. Our kitchen team combines
                time-tested techniques with locally-sourced ingredients to create dishes
                that delight both the palate and the soul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2 className="about-values-title animate-fade-in">What We Stand For</h2>
          <div className="about-values-grid">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="value-card animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="value-icon-wrapper">
                    <IconComponent className="value-icon" />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2 className="about-cta-title animate-fade-in">
            Ready to Experience Our Cuisine?
          </h2>
          <p className="about-cta-subtitle animate-fade-in">
            Visit us today or order online for delivery
          </p>
          <div className="about-cta-buttons animate-fade-in">
            <Link to="/">
              <button className="about-button about-button-primary">View Menu</button>
            </Link>
            <Link to="/contact">
              <button className="about-button about-button-outline">Contact Us</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
