import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
import authReducers from "../Redux/Fetures/authSlice.js";
const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authReducers,
  },
});
export default store;
