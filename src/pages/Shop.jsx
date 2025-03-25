import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import './Shop.css';

const products = [
  { id: 1, name: 'Plushie 1', price: 12.0, status: 'In Stock', category: 'plushies', image: null },
  { id: 2, name: 'Stress Ball 1', price: 10.0, status: 'Sold Out', category: 'stress-helpers', image: null },
  { id: 3, name: 'Plushie 2', price: 15.0, status: 'In Stock', category: 'plushies', image: null },
  { id: 4, name: 'Stress Ball 2', price: 8.0, status: 'In Stock', category: 'stress-helpers', image: null },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const [sortOrder, setSortOrder] = useState('price-asc');

  const filteredProducts = filter === 'all'
    ? products
    : products.filter((product) => product.category === filter);

  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return sortOrder === 'price-asc' ? a.price - b.price : b.price - a.price;
  });

  const handleSort = (option) => {
    setSortOrder(option);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="header-content">
          <h1>Shop</h1>
          <span className="sort-label">
            {sortOrder === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
          </span>
        </div>
        <div className="sort-dropdown">
          <button className="sort-button">Sort by Price</button>
          <div className="dropdown-menu">
            <button onClick={() => handleSort('price-asc')}>Price: Low to High</button>
            <button onClick={() => handleSort('price-desc')}>Price: High to Low</button>
          </div>
        </div>
      </div>
      <div className="product-grid">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;