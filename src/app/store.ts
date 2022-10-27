import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice"; // import the productsReducer
import cartReducer from "../features/cart/cartSlice"; // import the

export const store = configureStore({
  reducer: {
    // pass all reducers into the reducer object
    // now all data is split into separate slices, it can act as one data store
    products: productsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;  // export the type of the store state
// ReturnType is a TypeScript utility type that trasforms the type definition of a function into the
// type of its return value so RootState contains the type definition that matches all the data in the
// redux store

export type AppDispatch = typeof store.dispatch; // export the type of the store dispatch actions
// into the redux store
