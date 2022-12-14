import React from "react";
import classNames from "classnames";
import { useAppSelector, useAppDispatch } from "../../app/hooks"; // Import the useAppSelector and useAppDispatch hooks
import {
  getTotalPrice, // Import the getTotalPrice selector from the cartSlice
  removeFromCart, // Import the removeFromCart action creator from the cartSlice
  updateQuantity, // Import the updateQuantity action creator from the cartSlice
  checkoutCart, // Import the checkoutCart action creator from the cartSlice
} from "./cartSlice";
import styles from "./Cart.module.css";

export function Cart() {
  const dispatch = useAppDispatch(); // Use the useAppDispatch hook to get the dispatch function
  const products = useAppSelector((state) => state.products.products); // Use the useAppSelector hook to get the products state from the store
  const items = useAppSelector((state) => state.cart.items); // Use the useAppSelector hook to get the items state from the cartSlice
  const totalPrice = useAppSelector(getTotalPrice); // Use the useAppSelector hook to get the getTotalPrice selector from the cartSlice
  const checkoutState = useAppSelector((state) => state.cart.checkoutState); // Use the useAppSelector hook to get the checkoutState state from the cartSlice
  const errorMessage = useAppSelector((state) => state.cart.errorMessage); // Use the useAppSelector hook to get the thunk errorMessage state from the cartSlice


// onQuantityChanged method for handling onBlur, takes 2 arguments
// The first is e, which is a React focus event, and pass into it the type HTMLInputElement, which is the type of the input element.
// The second argument is the id of the product, which is type string.
  function onQuantityChanged(
    e: React.FocusEvent<HTMLInputElement>,
    id: string
  ) { //
    const quantity = Number(e.target.value) || 0; // create variable named quantity, set it to a variable called Number, that takes the
    // e.target.value which is a string and converts it to a number. If it's not a number, it will return 0.
    // Then dispatch the updateQuantity action creator, passing in the id and the value of the input element
    dispatch(updateQuantity({ id, quantity }));
  }


   // onCheckout takes argument e, which is of type React form event, and pass into it the type HTMLFormElement, which is the type of the form element.
  function onCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevents the form from submitting
    dispatch(checkoutCart()); // dispatch the checkoutCart action creator
  }


// Render the cart component classes styles
// provides a single classname string for the cart component based on the checkoutState
  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === "ERROR", // computed property syntax for the checkoutError class
    [styles.checkoutLoading]: checkoutState === "LOADING",
  });

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>  {/* render the tableClasses classNames*/}
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([id, quantity]) => ( // Use Object.entries to iterate over the items
          // object and destructure the key and value. Object.entries takes an object and splits it into an
          // array of arrays, where each array contains a key and value. In this case, the key is the product id
          // and the value is the product quantity. Loop over them and convert them into a table row.
            <tr key={id}>
              <td>{products[id].name}</td> {/* Use the products object to get the product name */}
              <td>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={quantity}
                  onBlur={(e) => onQuantityChanged(e, id)} // onBlur event handler, takes the focus event, pass it to onQuantityChanged, along with the id
                  // Pass the id to the onQuantityChanged function
                  // this allows to update state of from the input elements as well as the add to cart buttons.
                />
              </td>
              <td>${products[id].price}</td>
              <td>
                <button
                  // onclick handler calls dispatch with the removeFromCart action creator, and passes in the id
                  onClick={() => dispatch(removeFromCart(id))}
                  //   template literal to add the product name to the aria-label
                  aria-label={`Remove ${products[id].name} from Shopping Cart`}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td> {/* Use the totalPrice selector to render the total price */}
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={onCheckout}>  {/* onSubmit event handler, calls onCheckout function and sets it to the loading state */}
        {checkoutState === "ERROR" && errorMessage ? ( // if checkoutState is in the error state, render the errorMessage from cartSlice
          <p className={styles.errorBox}>{errorMessage}</p> // render the errorBox class
        ) : null}  {/* if checkoutState is not in the error state, render nothing */}
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
