import '../styles/CallToAction.css';
import { Link } from 'react-router-dom';

function CallToAction() {
  return (
    <section className="cta">
      <div className="container cta-container">
        <h2 className="cta-title">Ready to Order?</h2>
        <p className="cta-description">
          Experience the authentic taste of China delivered straight to your door.
          Fresh ingredients, traditional recipes, and fast delivery.
        </p>
        <div className="cta-buttons">
          <Link to="/order">
          <button className="cta-button cta-button-primary">View Full Menu</button>
          </Link>
          <Link to="/order">
          <button className="cta-button cta-button-outline">Order Now</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
