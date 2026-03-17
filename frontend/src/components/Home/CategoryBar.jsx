import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const CategoryBar = ({ categories }) => {
  return (
    <div className="category-bar-wrapper">
      <div className="category-bar container">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat._id}`}
            className="category-bar-item"
          >
            <div className="cat-icon-box">
              <img src={cat.image?.url || 'https://via.placeholder.com/64'} alt={cat.name} />
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
