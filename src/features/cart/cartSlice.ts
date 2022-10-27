import {
  createSlice,
  createAsyncThunk,
  createSelector, // createSelector is a function that lets us create memoized selectors
  PayloadAction, // PayloadAction is a generic Redux type that takes in an argument of the type of the data that the action payload will contain
} from "@reduxjs/toolkit";
import { checkout, CartItems } from "../../app/api";
import type { RootState } from "../../app/store"; // import the RootState type from the store.ts file

type CheckoutState = "LOADING" | "READY" | "ERROR";

// CartState is the type of the state slice managed by this reducer and describes
// what the data is going to look like.
export interface CartState {
  items: { [productID: string]: number }; // key of items has an object with a key
  // of productID of type string and a value of type number tells typescript that
  // our items property is going to be an object where the keys are productID strings
  // and the values are numbers
  checkoutState: CheckoutState;
  errorMessage: string;
}

const initialState: CartState = {
  items: {},
  checkoutState: "READY",
  errorMessage: "",
};

export const checkoutCart = createAsyncThunk("cart/checkout", async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const items = state.cart.items;
  const response = await checkout(items);
  return response;
});

// createSlice is a function that contains an object takes a name, an initialstate, a
// reducers object full of reducer functions, and a slice name, and automatically
// generates action creators and action types that correspond to the reducers and state.
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) { // method takes state and action
        // with type of PayloadAction with a type of string which will be the id of the
        // product added to the cart
      if (state.items[action.payload]) { // if the items object has a key of id and quantity of value
        state.items[action.payload]++; // increment the value of the product id key by 1
      } else { // if the product is not in the cart,
        state.items[action.payload] = 1; // add one to quantity of the product id key
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload; // setting id and quantity equal to the action payload
      state.items[id] = quantity;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkoutCart.pending, (state) => {
      state.checkoutState = "LOADING";
    });
    builder.addCase(
      checkoutCart.fulfilled,
      (state, action: PayloadAction<{ success: boolean }>) => {
        const { success } = action.payload;
        if (success) {
          state.checkoutState = "READY";
          state.items = {};
        } else {
          state.checkoutState = "ERROR";
        }
      }
    );
    builder.addCase(checkoutCart.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      state.errorMessage = action.error.message || "";
    });
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions; // export each of the reducer actions
// the addToCart, removeFromCart, and updateQuantity reducer as an action creator

// exporting the cartSlice.reducer function processes the actions passed
// into the redux store, and returns an updated version of the state
// each slice gets its own reducer function that is responsible for
// updating the state for that part of the data
export default cartSlice.reducer;



// getNumItems is a selector function that takes in the state and returns the number of items in the cart
export function getNumItems(state: RootState) { // function takes in state of type RootState (imported from store.ts)
  console.log("calling numItems"); // each time the function is called, log "calling numItems" to the console
  let numItems = 0; // set numItems to 0
  for (let id in state.cart.items) { // for loop to iterate through the items object in the cart slice of the state
    numItems += state.cart.items[id];
  }
  return numItems; // return the number of items in the cart
}

// CreateSelector is a function that lets us create memoized selectors
// it remembers the last time it was called and if the state has not changed
// since the last time it was called, it will return the cached value instead
// of recalculating the value
export const getMemoizedNumItems = createSelector(
  (state: RootState) => state.cart.items, // if the state.cart.items object in the cart
  // slice of the state has not changed since the last time the function was called, return
  // the cached value instead of recalculating the value

   // if the state.cart.items object in the cart slice of the state has changed then run the function
  (items) => { // convert the items into the number of items in the cart
    console.log("calling getMemoizedNumItems");
    // runs on items object instead of the entire state
    let numItems = 0;
    for (let id in items) {
      numItems += items[id];
    }
    return numItems;
  }
);





export const getTotalPrice = createSelector(
  (state: RootState) => state.cart.items,
  (state: RootState) => state.products.products,
  (items, products) => {
    let total = 0;
    for (let id in items) {
      total += products[id].price * items[id];
    }
    return total.toFixed(2);
  }
);
