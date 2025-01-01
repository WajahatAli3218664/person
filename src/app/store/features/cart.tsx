import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price: number; 
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.idMeal === newItem.idMeal);
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.idMeal !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    updateItemQuantity: (state, action: PayloadAction<{ index: number, quantity: number }>) => {
      const { index, quantity } = action.payload;
      if (quantity > 0) {
        state.items[index].quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
