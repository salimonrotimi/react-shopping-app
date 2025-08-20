import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavMenu from './components/navbar/nav-menu';
import Home from './pages/home';
import ShopCategory from './pages/shop-category/shop-category';
import Product from './pages/product/product';
import Cart from './pages/cart';
import LoginRegister from './pages/login-register/login-register';
import Footer from './components/footer/footer';
import men_banner from './components/assets/men-banner.png';
import women_banner from './components/assets/women-banner.png';
import kid_banner from './components/assets/kid-banner.png';
import couples_banner from './components/assets/couples-banner.png';
import About from './pages/about/about';
import { ShopContextProvider } from './context/shop-context';
import ProtectedRoute from './components/protected-route';
import ForgotPassword from './pages/forgot-password/forgot-password';
import { Toaster } from 'react-hot-toast';


function AppRouter() {  
  // <AppRouter> is then used inside <AuthContextProvider> in "App.jsx" file.

  // The called "ShopContextProvider" function as a tag to wrap the routes so that the stored 
  // functions can be accessible everywhere in the project.
  return (
    <ShopContextProvider>
        <BrowserRouter>
          
          <NavMenu />
          
          <div className="main">

            <Toaster position="top-center" reverseOrder={false} />
            
            <Routes>

              {/* Open Routes- Accessible to all users */}
              <Route path='/' Component={Home}/>

              <Route path='/about' Component={About}/>

              <Route path='/login-register' Component={LoginRegister}/> 

              <Route path='/forgot-password' Component={ForgotPassword}/> 

              {/* Redirect Handling- Redirect to '/' i.e. home page if no path match and unauthenticated */}
              <Route path='*' element={ <Navigate to='/' replace/> }/>

              {/* Protected Routes- Accessible to only authenticated users */}
              <Route path='/men-collections' element={
                <ProtectedRoute>
                  <ShopCategory category='men' banner={men_banner}/>
                </ProtectedRoute>                
              }/>
              <Route path='/women-collections' element={
                <ProtectedRoute>
                  <ShopCategory category='women' banner={women_banner}/>
                </ProtectedRoute>
              }/>
              <Route path='/kids-collections' element={
                <ProtectedRoute>
                  <ShopCategory category='kids' banner={kid_banner}/>
                </ProtectedRoute>
              }/>
              <Route path='/couples-collections' element={
                <ProtectedRoute>
                  <ShopCategory category='couples' banner={couples_banner}/>
                </ProtectedRoute>
              }/>
              <Route path='/product' element={
                <ProtectedRoute>
                  <Product/>
                </ProtectedRoute>
              }>
                <Route path=':productId' element={<Product/>}/>
              </Route>
              <Route path='/cart' element={
                <ProtectedRoute>
                  <Cart/>
                </ProtectedRoute>
              }/>

            </Routes>
          </div>

          <Footer/>
        </BrowserRouter>
      </ShopContextProvider>
  )
}

export default AppRouter


