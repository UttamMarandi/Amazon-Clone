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
    removeFromBasket: (state, action) => {
      //findIndex will check for each basketItem in state.items and return the id value if found and -1 if not found

      const index = state.items.findIndex(
        (basketItem) => basketItem.id === action.payload.id
      );
      //we make of a copy of existing basket
      let newBasket = [...state.items];
      //if we find the index that means it is not -1 , so we splice the newbasket
      if (index >= 0) {
        //the item exist in baseket ...remove it
        //.splice if take two parameters than first parameter is the starting inded form which items will be removed and second is the index upto which the items will be removed
        //so basically we are saying if index is 3 , than that becomes our starting index, remove [0] i.e the item with index 3 itself stop at index[1],
        newBasket.splice(index, 1);
      } else {
        console.warn(`Cant remove product (id : ${action.payload.id})`);
      }
      state.items = newBasket;
    },
  },
});

//export the actions
export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;

export default basketSlice.reducer;
