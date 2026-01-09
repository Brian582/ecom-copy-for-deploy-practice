import featuredDishes from '../assets/featured-dishes.jpg';
import '../styles/FeaturedDishes.css';

const dishes = [
  {
    id: 1,
    name: 'Kung Pao Chicken',
    description: 'Spicy stir-fried chicken with peanuts and vegetables',
    price: '$9.00',
  },
  {
    id: 2,
    name: 'Lo Mein',
    description: 'Soft, chewy egg noodles tossed with a savory sauce, crisp vegetables',
    price: '$10.99',
  },
  {
    id: 3,
    name: 'Egg Rolls',
    description: 'Crispy egg rolls served with sweet chili sauce',
    price: '$2.89',
  },
];

function FeaturedDishes() {
  return (
    <section className="featured-dishes">
      <div className="container">
        <div className="featured-dishes-header">
          <h2 className="featured-dishes-title">Featured Dishes</h2>
          <p className="featured-dishes-subtitle">
            Discover our most popular authentic Chinese dishes
          </p>
        </div>

        <div className="featured-image-wrapper">
          <img
            src={featuredDishes}
            alt="Featured Chinese Dishes"
            className="featured-image"
          />
        </div>

        <div className="dishes-grid">
          {dishes.map((dish, index) => (
            <div
              key={dish.id}
              className="dish-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="dish-card-header">
                <h3 className="dish-card-title">{dish.name}</h3>
                <p className="dish-card-description">{dish.description}</p>
              </div>
              <div className="dish-card-content">
                <p className="dish-card-price">{dish.price}</p>
              </div>
              <div className="dish-card-footer">
                <button className="dish-add-button">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDishes;
