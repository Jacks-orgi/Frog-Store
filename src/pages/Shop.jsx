import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import './Shop.css';

const products = [
  { id: 1, name: 'Plushie 1', price: 12.0, status: 'In Stock', category: 'plushies', image: null },
  { id: 2, name: 'Stress Ball 1', price: 10.0, status: 'Sold Out', category: 'stress-helpers', image: null },
  { id: 3, name: 'Plushie 2', price: 15.0, status: 'In Stock', category: 'plushies', image: null },
  { id: 4, name: 'Stress Ball 2', price: 8.0, status: 'In Stock', category: 'stress-helpers', image: null },
];

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'plushies', label: 'Plushies' },
  { id: 'stress-helpers', label: 'Stress Helpers' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState('price-asc');
  const urlFilter = searchParams.get('filter') || 'all';
  // Initialize selectedCategories based on URL parameter
  const [selectedCategories, setSelectedCategories] = useState([urlFilter]);

  // Update selectedCategories when URL changes
  useEffect(() => {
    setSelectedCategories([urlFilter]);
  }, [urlFilter]);




  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (categoryId === 'all') {
        return prev.includes('all') ? [] : categories.map(cat => cat.id);
      }

      const newCategories = prev.filter(id => id !== 'all');
      if (prev.includes(categoryId)) {
        const filtered = newCategories.filter(id => id !== categoryId);
        return filtered.length === 0 ? [] : filtered;
      }
      
      const updated = [...newCategories, categoryId];
      return updated.length === categories.length - 1 ? ['all', ...updated] : updated;
    });
  };

  const filteredProducts = selectedCategories.includes('all')
    ? products
    : products.filter(product => selectedCategories.includes(product.category));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return sortOrder === 'price-asc' ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="header-content">
          <h1>Shop</h1>
          <span className="sort-label">
            {sortOrder === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
          </span>
        </div>
        <div className="header-controls">
          <div className="sort-dropdown">
            <button className="sort-button">Sort by Price</button>
            <div className="dropdown-menu">
              <button onClick={() => setSortOrder('price-asc')}>Price: Low to High</button>
              <button onClick={() => setSortOrder('price-desc')}>Price: High to Low</button>
            </div>
          </div>
          <div className="filter-dropdown">
            <button className="filter-button">Filter Categories</button>
            <div className="dropdown-menu checkbox-menu">
              {categories.map(category => (
                <label key={category.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  {category.label}
                </label>
              ))}
            </div>
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