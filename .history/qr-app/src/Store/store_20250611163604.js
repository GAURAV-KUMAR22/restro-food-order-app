import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
import authReducers from '../Redux/'
const store = configureStore({
    reducer: {
        cart: cartSlice,
        auth:aut
    }
});
export default store;