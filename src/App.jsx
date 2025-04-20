import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Founders from './components/Founders/Founders';
import Header from './components/Header/Header';
import LinkCard from './components/LinkCard/LinkCard';
import PlushieCardContent from './components/LinkCard/PlushieCardContent';
import SquishyCardContent from './components/LinkCard/SquishyCardContent';
import Mission from './components/Mission/Mission';
import Navbar from './components/Navbar/Navbar';
import { DropdownProvider } from './context/DropdownContext';
import { BasketProvider } from './context/BasketContext';
import { UserProvider } from './context/UserContext';
import Contact from './pages/Contact';
import ProductPage from './pages/ProductPage';
import Shop from './pages/Shop';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BasketPage from './pages/BasketPage';
import AccountPage from './pages/AccountPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <Router basename="/Frog-Store">
      <UserProvider>
        <BasketProvider>
          <DropdownProvider>
            <div className="app">
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <>
                    <Header />
                    <div className="content">
                      <div className="links-section">
                        <LinkCard title="Plushies" filter="plushies">
                          <PlushieCardContent />
                        </LinkCard>
                        <LinkCard title="Stress Helpers" filter="stress-helpers">
                          <SquishyCardContent />
                        </LinkCard>
                      </div>
                      <Founders />
                      <Mission />
                    </div>
                  </>
                } />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginPage />} />           
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/basket" element={<BasketPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
              <Footer />
            </div>
          </DropdownProvider>
        </BasketProvider>
      </UserProvider>
    </Router>
  );
}


export default App;
