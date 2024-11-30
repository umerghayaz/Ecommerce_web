
// configureStore Redux Toolkit (RTK) ka ek function hai jo Redux store ko
//  banane ke process ko simplify aur improve karta hai. 
//  Yeh createStore ka modern alternative hai aur best practices ko
//   default mein implement karta hai.
// Automatic Middleware Setup
// Redux Toolkit automatically kuch important middlewares add karta hai, jaise:
// redux-thunk (async logic handle karne ke liye).
// Development mein helpful warnings ke liye kuch extra middlewares.
// Aap multiple reducers ko ek saath combine kar sakte ho bina manually 
// combineReducers ka use karein.
// Haan, Redux Store saari application state ko ek centralized 
// place mein rakhta hai. Iska matlab hai ki tumhare 
// React (ya kisi bhi framework) components ki state 
// alag-alag jagah par scattered hone ke bajay, ek 
// single source of truth mein stored hoti hai.
// Aayiye ise thoda aur detail mein samajhte hain:
// Redux Store ko ek locker samjho:
// Locker: Tumhara Redux Store hai.
// Compartments: State ke alag-alag sections hain, jaise user, cart, etc.
// Key: Tumhare reducers aur actions hain jo locker ko unlock aur modify karte hain.

import { configureStore } from "@reduxjs/toolkit";
import  userSlice  from "./reducers/userReducer";
import  productSlice  from "./reducers/productReducer";
import  cartSlice  from "./reducers/cartReducer";

export default configureStore({
  reducer: {
    user:userSlice,
    product:productSlice,
    cart:cartSlice
  },
});
