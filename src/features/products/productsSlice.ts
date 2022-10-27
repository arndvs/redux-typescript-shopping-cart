// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import the Product type definition interface from the productsSlice.ts file
import type { Product } from "../../app/api";

export interface ProductsState {
  products: { [id: string]: Product } // key of products has an object with a key
  // of id of type string and a value of type Product (imported) - tells typescript that
  // our items property is going to be an object where the keys are productID strings
  // and the values are numbers
}

const initialState: ProductsState = { // initialState with a type of ProductState
  products: {} // key of products and a value of an empty object
}

// productsSlice is a function that contains an object takes a "products" name, an
//initialState, a reducers object full of reducer functions, and a slice name,
const productsSlice = createSlice({
  initialState,
  name: "products",
  reducers: {
    receivedProducts(state, action: PayloadAction<Product[]>) {// method takes state and
        // action with type of PayloadAction. PayloadAction is a generic Redux type that takes in an argument
        // that describes the type of data that the action payload will contain. In this case, the action
        // payload will contain an array of Product objects.
      const products = action.payload; // create a variable called products and set it equal to the action payload
      products.forEach(product => { // convert them into an object by looping over them
        // where each product is the key and the value is the product itself
        state.products[product.id] = product;
      })
      // this function converts the product array Product[] into the products object products: {}
    }
  },
});

export const { receivedProducts } = productsSlice.actions; // export the receivedProducts reducer as an action creator
// Redux toolkit automatically generates action creators for each reducer function passed into the reducers object

export default productsSlice.reducer; // exporting the productsSlice.reducer function
// processes the actions passed into the redux store, and returns an updated version of
// the state each slice gets its own reducer function that is responsible for updating
// the state for that part of the data
