import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import './Shop.css'
import axios from "axios";

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'plushies', label: 'Plushies' },
  { id: 'stress-helpers', label: 'Stress Helpers' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState('price-asc');
  const urlFilter = searchParams.get('filter') || 'all';
  const [selectedCategories, setSelectedCategories] = useState([urlFilter]);

  const [products, setProducts] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("https://2-12.co.uk/~ddar/FrogStore/api/get_products.php");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

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
        {sortedProducts.length === 0
          ? <p>No products available in this category</p>
          : sortedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
      </div>
    </div>
  );
};

export default Shop;
