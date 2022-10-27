import React, { useEffect } from "react"; // useState unnecessary
import { useAppDispatch, useAppSelector } from "../../app/hooks"; // import the useAppDispatch and useAppSelector hooks
import { receivedProducts } from "./productsSlice"; // import the receivedProducts action creator from the productSlice
import { addToCart } from "../cart/cartSlice"; // import the addToCart action creator from the cartSlice
import { getProducts } from "../../app/api"; // products API function
import styles from "./Products.module.css";

export function Products() {
  const dispatch = useAppDispatch(); // use the custom useAppDispatch hook to get the typed dispatch function
  useEffect(() => {
    getProducts().then((products) => { // call the getProducts API function
      dispatch(receivedProducts(products)); // dispatch the receivedProducts action creator
    });
  }, []);

   // use the useAppSelector hook to get the products from the store. Takes
  // in state as an argument and returns the state.products.products object
  const products = useAppSelector((state) => state.products.products);

  return (
    <main className="page">
      <ul className={styles.products}>
      {/* because we store products in redux as an object, not an
       array, we need to use Object.values to map over the values */}
        {Object.values(products).map((product) => (
          <li key={product.id}>
            <article className={styles.product}>
              <figure>
                <img src={product.imageURL} alt={product.imageAlt} />
                <figcaption className={styles.caption}>
                  {product.imageCredit}
                </figcaption>
              </figure>
              <div>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => dispatch(addToCart(product.id))}> {/* onclick handler arrow function dispatch addToCart action creator, pass in the current product.id */}
                  Add to Cart 🛒
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
