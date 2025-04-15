import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();

  // Mock product data (replace with actual data fetching logic)
  const product = {
    id,
    name: 'Item Name Goes Here',
    price: 12.10,
    status: 'In Stock',
    description:
      'Filet mignon doner landjaeger rump short loin tenderloin. Tongue landjaeger jerky pancetta hamburger buffalo flank capicola salami short ribs venison bresaola.',
    images: ['image1.png', 'image2.png', 'image3.png'], // Replace with actual image URLs
  };

  const relatedProducts = [
    { id: 2, name: 'Product Name', price: 12.0, status: 'In Stock', image: null },
    { id: 3, name: 'Product Name', price: 12.0, status: 'Sold Out', image: null },
    { id: 4, name: 'Product Name', price: 12.0, status: 'In Stock', image: null },
    { id: 5, name: 'Product Name', price: 12.0, status: 'In Stock', image: null },
  ];

  return (
    <div className="product-page">
      <div className="product-main">
        <div className="product-image-container">
          <img src={product.images[0]} alt={product.name} className="product-main-image" />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className={`product-status ${product.status.toLowerCase()}`}>{product.status}</p>
          <p className="product-price">£{product.price.toFixed(2)}</p>
          <div className="product-actions">
            <label>
              Quantity:
              <input type="number" min="1" defaultValue="1" />
            </label>
            <button className="buy-now">Buy Now</button>
            <button className="add-to-basket">Add to Basket</button>
          </div>
          <p className="product-description">{product.description}</p>
        </div>
      </div>
      <div className="product-thumbnails">
        {product.images.map((image, index) => (
          <img key={index} src={image} alt={`Thumbnail ${index + 1}`} className="product-thumbnail" />
        ))}
      </div>
      <div className="related-products">
        <h2>You might also like</h2>
        <div className="product-grid">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="product-card">
              <div className="product-image">{relatedProduct.image || 'Image'}</div>
              <p className="product-name">{relatedProduct.name}</p>
              <p className="product-price">£{relatedProduct.price.toFixed(2)}</p>
              <p className={`product-status ${relatedProduct.status.toLowerCase()}`}>
                {relatedProduct.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;