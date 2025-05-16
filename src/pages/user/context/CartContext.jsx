// context/CartContext.js
import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.some(item => item.id === action.payload.id)) {
        return state;
      }
      return [...state, { id: action.payload.id }];

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};


export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (id) => dispatch({ type: 'ADD_ITEM', payload: { id } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
// src/pages/user/context/CartContext.jsx