import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductPage.css';
import axios from 'axios';

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://2-12.co.uk/~ddar/FrogStore/api/get_products.php");
        const data = res.data;
  
        const allProducts = data.products;
        const current = allProducts.find(p => p.id === id);
        setProduct(current);
        console.log(current);
  
        console.log("Getting Related PRODUCTS");

        const relatedRes = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/get_related_products.php',
          { 
            "product_id": current.id, 
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const relatedData = relatedRes.data;
        if (relatedData.success) {

          const relatedProducts = allProducts.filter(p =>
            relatedData.related_products.includes(Number(p.id))
          );

          setRelatedProducts(relatedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
  
    fetchProducts();
  }, [id]);
  
  
  const handleClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!product) return <div className="product-page"><p>Loading...</p></div>;

  return (
    <div className="product-page">
      <div className="product-main">
        <div className="product-image-container">
          {product.image_url ? <img src={product.image_url} alt={product.name} /> : <span>No Image Available</span>}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className={`product-status ${product.status.toLowerCase()}`}>{product.status}</p>
          <p className="product-price">£{product.price}</p>
          <div className="product-actions">
            <label>
              Quantity:
              <input type="number" min="1" defaultValue="1" />
            </label>
            <button className="buy-now">Buy Now</button>
            <button className="add-to-basket">Add to Basket</button>
          </div>
          <p className="product-description">{product.description || 'No description available.'}</p>
        </div>
      </div>

      <div className="related-products">
        <h2>You might also like</h2>
        <div className="product-grid">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="product-card" onClick={() => handleClick(relatedProduct.id)} role="button" tabIndex={0}>
              <div className="product-image">
                {relatedProduct.image_url ? <img src={relatedProduct.image_url} alt={relatedProduct.name} /> : <span>No Image Available</span>}
              </div>
              <p className="product-name">{relatedProduct.name}</p>
              <p className="product-price">£{relatedProduct.price}</p>
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
