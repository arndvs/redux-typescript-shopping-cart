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
  const items = useAppSelector((state) => state.cart.items); // Use the useAppSelector hook to get the items state from the cart
  const totalPrice = useAppSelector(getTotalPrice); // Use the useAppSelector hook to get the getTotalPrice selector from the cart
  const checkoutState = useAppSelector((state) => state.cart.checkoutState);
  const errorMessage = useAppSelector((state) => state.cart.errorMessage);

  function onQuantityChanged(
    e: React.FocusEvent<HTMLInputElement>,
    id: string
  ) {
    const quantity = Number(e.target.value) || 0;
    dispatch(updateQuantity({ id, quantity }));
  }

  function onCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(checkoutCart());
  }

  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === "ERROR",
    [styles.checkoutLoading]: checkoutState === "LOADING",
  });

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
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
          // array of arrays, where each array contains a key and value. In this case, the key is the id
          // and the value is the quantity. Loop over them and convert them into a table row.
            <tr key={id}>
              <td>{products[id].name}</td> {/* Use the products object to get the product name */}
              <td>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={quantity}
                  onBlur={(e) => onQuantityChanged(e, id)} // Pass the id to the onQuantityChanged function
                />
              </td>
              <td>${products[id].price}</td>
              <td>
                <button
                  onClick={() => dispatch(removeFromCart(id))} // onclick handler calls dispatch with the
                  // removeFromCart action creator, and passes in the id
                  aria-label={`Remove ${products[id].name} from Shopping Cart`}
                //   template literal to add the product name to the aria-label
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
      <form onSubmit={onCheckout}>
        {checkoutState === "ERROR" && errorMessage ? (
          <p className={styles.errorBox}>{errorMessage}</p>
        ) : null}
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
