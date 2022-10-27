import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks"; // import the custom useAppSelector hook
import { getNumItems, getMemoizedNumItems } from "./cartSlice"; // import the getNumItems and getMemoizedNumItems selector from the cartSlice
import styles from "./CartLink.module.css";

export function CartLink() {
  const numItems = useAppSelector(getMemoizedNumItems); // pass in the getMemoizedNumItems selector to the useAppSelector hook
  return (

    <Link className={styles.link} to="/cart">
      <span className={styles.text}>
        🛒&nbsp;&nbsp;{numItems ? numItems : "Cart"}   {/* / turnary operator to display the number of items in the cart or "cart" if there are no items  */}
      </span>
    </Link>
  );
}
