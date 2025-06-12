import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
const store = configureStore({
    reducer: {
        cart: cartSlice
    }
});
export default store;