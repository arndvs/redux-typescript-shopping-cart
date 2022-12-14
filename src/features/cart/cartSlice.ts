import {
  createSlice,
  createAsyncThunk, // Thunk to dispatch async actions and handle loading state
  createSelector, // createSelector is a function that lets us create memoized selectors
  PayloadAction, // PayloadAction is a generic Redux type that takes in an argument of the type of the data that the action payload will contain
} from "@reduxjs/toolkit";
import { checkout, CartItems } from "../../app/api"; // checkout is a function that makes a fake API call to simulate a checkout process
import type { RootState } from "../../app/store"; // import the RootState type from the store.ts file

// Define a type for the slice state CheckoutState to pass into CartState and initialState
type CheckoutState = "LOADING" | "READY" | "ERROR";

// CartState is the type of the state slice managed by this reducer and describes
// what the data is going to look like.
export interface CartState {
  items: { [productID: string]: number }; // key of items has an object with a key
  // of productID of type string and a value of type number tells typescript that
  // our items property is going to be an object where the keys are productID strings
  // and the values are numbers
  checkoutState: CheckoutState; // checkoutState is a property of type CheckoutState
  errorMessage: string;
}

const initialState: CartState = {
  items: {}, // items is an empty object
  checkoutState: "READY", // checkoutState is set to "READY" by default
  errorMessage: "", // errorMessage is a property of type string
};

// reducers can only dispatch actions objects into the redux store. Redux Thunk middleware can dispatch a functions instead objects.
// These functions can dispatch multiple actions and can be used to make asynchronous requests.
// createAsyncThunk is a middleware redux thunk function that accepts a string argument for the action type
export const checkoutCart = createAsyncThunk("cart/checkout", async (_, thunkAPI) => { // thunkAPI is an object that contains
    // the dispatch method, pass in for the action type "cart/checkout". The second argument is an ascync function that takes in two arguments. The first is the argument items cart items, and
  const state = thunkAPI.getState() as RootState; // getState is a method that returns the current state of the redux store. The state is casted as a RootState type
  const items = state.cart.items; // get the items from the cart state
  const response = await checkout(items); // checkout awaits and returns the checkout items
  return response;
});

// above - using AsyncThunk to create an action creator named checkoutCart that dispatches actions based on the reponse of the checkout API call.
// Those three actions i.e pending, fulfilled, and rejected are handled as cases in the extraReducers.
// AsyncThunk generates and dispatches the pending, fulfilled, and rejected actions automatically.
//  -- the pending action is dispatched when the checkoutCart action creator is called
//  -- the fulfilled action is dispatched when the checkoutCart action creator is called and the API call is successful
//  -- the rejected action is dispatched when the checkoutCart action creator is called and the API call is unsuccessful

// Slices

// createSlice is a function that contains an object takes a name, an initialstate, a
// reducers object full of reducer functions, and a slice name, and automatically
// generates action creators and action types that correspond to the reducers and state.
const cartSlice = createSlice({
  name: "cart",
  initialState,

  // reducers object provides syntax for creating reducer functions and generating associated actions in a single step
  // to separate the logic of the reducer function from the logic of the action creator function, to handle other actions,
  // or create custom action creators - then use an extraReducers function below the reducers
  reducers: {
    // the first reducer method is addProductToCart
    addToCart(state, action: PayloadAction<string>) { // method takes state and action
        // with type of PayloadAction with a type of string which will be the id of the
        // product added to the cart
      if (state.items[action.payload]) { // if the items object has a key of id and quantity of value
        state.items[action.payload]++; // increment the value of the product id key by 1
      } else { // if the product is not in the cart,
        state.items[action.payload] = 1; // add one to quantity of the product id key
      }
    },
    // the second reducer method is removeFromCart
    removeFromCart(state, action: PayloadAction<string>) { // method takes 2 arguments,
        // state and action of type PayloadAction, which passes in a payload of type string
        // for the id
      delete state.items[action.payload]; // delete the product id key from the items object
    },
    // the third reducer method is clearCart
    updateQuantity( // method takes 2 arguments, state and action of type PayloadAction
      state,
      action: PayloadAction<{ id: string; quantity: number }>  // PayloadAction is an object with a key
      // value pair of id and quantity, where id is a string and quantity is a number
    ) {
      const { id, quantity } = action.payload; // setting id and quantity equal to the action payload
      state.items[id] = quantity; // setting the items object with the id key equal to the quantity
    },
  },


// Builders

   // extraReducers is a function that takes in an argument called builder that handles custom actions
  extraReducers: (builder) => {
    // first extra reducer is checkoutCart.pending (switch case 1)
    builder.addCase(checkoutCart.pending, (state) => { // builder API is similar functionality to
        // a switch statement commonly used in reducers. Instead of switching through cases by action type,
        // the builder argument uses a method called addCase to define the casses.
        // addCase takes in a type checkoutCart.pending, and the second argument is a reducer function which is state and action
        // async thunk generates a pending action when the async function is called
      state.checkoutState = "LOADING"; // set the checkoutState property of the state to "LOADING"
    });
    // now any time a component dispatches the checkoutCart.pending action, the reducer will be called with the state and action

 // second extra reducer is checkoutCart.fulfilled (switch case 2)
    builder.addCase(
      checkoutCart.fulfilled, // addCase takes in a type checkoutCart.fulfilled
       // async thunk generates a fulfilled action when the async function is called
      (state, action: PayloadAction<{ success: boolean }>) => { // first argument is state, second argument is action of type PayloadAction with an object with success key of type boolean
        const { success } = action.payload; // set success equal to the action payload
        if (success) { // if success is true
          state.checkoutState = "READY"; // set the checkoutState property of the state to "READY"
          state.items = {}; // set the items property of the state to an empty object
        } else { // if success is false
          state.checkoutState = "ERROR"; // set the checkoutState property of the state to "ERROR"
        }
        // after checking out is complete, the checkoutState is set to "READY" and the items object is set to an empty object, emptying the cart
      }
    );

    // third extra reducer is checkoutCart.rejected (switch case 3)
    builder.addCase(checkoutCart.rejected, (state, action) => {  // action specifically for error thunk action = action.error, used to set the state.errorMessage
        // any time there's an error in an async thunk action, the error is passed in as the action.error property with error.message
     // async thunk generates a rejected state action when the async function is called
      state.checkoutState = "ERROR";
      // called any time the promise returned by the async function is rejected
      state.errorMessage = action.error.message || ""; // set the errorMessage property of the state to the error message
    });
  },
});


// export the reducers action creators generated by createSlice
export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
// export each of the reducer actions the addToCart, removeFromCart, and updateQuantity reducer as an action creator

// exporting the cartSlice.reducer function processes the actions passed
// into the redux store, and returns an updated version of the state
// each slice gets its own reducer function that is responsible for
// updating the state for that part of the data
export default cartSlice.reducer;





// Selectors

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


// CreateSelector is a function that lets us create memoized selectors that relies on 2 pieces of state, rather than just one
export const getTotalPrice = createSelector(
// you could explicitly type createSelector<RootState, any, any, string> but it is not necessary when adding type RootState to the function i.e. (state: RootState)
  (state: RootState) => state.cart.items, // takes in the root state of the cart items
  (state: RootState) => state.products.products, // takes in the root state of the products
  (items, products) => { // pass in a function that takes items in as it's first argument and products as it's second argument
    // here we calculate the total value of all the products in the cart
    let total = 0; // set total to 0
    for (let id in items) { // for loop to iterate through the items object in the cart slice of the state
      total += products[id].price * items[id]; // add the price of the individual product multiplied by the quantity of the product to the total
    }
    return total.toFixed(2); // return the total rounded to 2 decimal places
  }
);
