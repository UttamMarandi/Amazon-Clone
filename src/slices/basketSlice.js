import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // Actions
    //addtoBasket and removeFromBasket are both actions . It takes two paramenter state and action itself. we need the action itself as parameter to access the payload
    addToBasket: (state, action) => {
      // our items in initial state is an array , so what we say is keep all the before items using spread operator ...state.items and the add the product that is passed through action i.e action.payload
      state.items = [...state.items, action.payload];
    },
    removeFromBasket: (state, action) => {},
  },
});

//export the actions
export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;

export default basketSlice.reducer;
