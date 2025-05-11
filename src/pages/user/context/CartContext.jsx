import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();


const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // 如果商品已存在，则不添加
      const existingItem = state.find(item => item.dish.id === action.payload.dish.id);
      if (existingItem) {
        return state;  // 如果商品已存在，则不添加
      } else {
        // 否则将商品加入购物车
        return [...state, { dish: action.payload.dish }];
      }

    case 'REMOVE_ITEM':
      return state.filter(item => item.dish.id !== action.payload.id);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // ✅ 封装 addToCart
  const addToCart = (dish) => {
    dispatch({ type: 'ADD_ITEM', payload: { dish } });
  };

  // 你也可以加上 removeFromCart、clearCart
  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
