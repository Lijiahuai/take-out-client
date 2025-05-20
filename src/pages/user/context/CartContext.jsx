// context/CartContext.js
import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.some(item => item.dishId === action.payload.dishId)) {
        return state;
      }
      return [...state, { dishId: action.payload.dishId }];

    case 'REMOVE_ITEM':
      return state.filter(item => item.dishId !== action.payload.dishId);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};


export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (dishId) => dispatch({ type: 'ADD_ITEM', payload: { dishId } });
  const removeFromCart = (dishId) => dispatch({ type: 'REMOVE_ITEM', payload: { dishId } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
// src/pages/user/context/CartContext.jsx