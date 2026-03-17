import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Home.css';

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000',
    title: 'Summer Electronics blowout',
    subtitle: 'Up to 50% off on top brands',
    link: '/products?category=electronics',
    color: '#1e1b4b'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000',
    title: 'Fresh Fashion Trends',
    subtitle: 'New arrivals for the season',
    link: '/products?category=fashion',
    color: '#431407'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7305a3fb?q=80&w=2000',
    title: 'Home Essentials',
    subtitle: 'Upgrade your living space',
    link: '/products?category=home',
    color: '#064e3b'
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  return (
    <div className="hero-carousel">
      <div 
        className="carousel-inner" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {HERO_SLIDES.map((slide) => (
          <div 
            key={slide.id} 
            className="carousel-slide"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${slide.image})` }}
          >
            <div className="slide-content container">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <Link to={slide.link} className="hero-btn primary">Shop Now</Link>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-control prev" onClick={prev}><FiChevronLeft /></button>
      <button className="carousel-control next" onClick={next}><FiChevronRight /></button>
      
      <div className="carousel-dots">
        {HERO_SLIDES.map((_, i) => (
          <div 
            key={i} 
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
