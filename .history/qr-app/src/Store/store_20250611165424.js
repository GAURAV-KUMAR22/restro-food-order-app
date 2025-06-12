// store.js or Redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
import authReducers from "../Redux/Fetures/authSlice.js";

// redux-persist
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth (or add "cart" if needed)
};

// combine reducers
const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authReducers,
});

// create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// create persistor
export const persistor = persistStore(store);

export default store;
