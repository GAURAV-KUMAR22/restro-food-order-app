// store.js or Redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
import authReducer from "../Redux/Fetures/authSlice.js";

// redux-persist
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth slice
};

// combine reducers
const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authReducer, // ✅ changed variable name to match standard
});

// create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist to avoid warnings
    }),
});

// create persistor
export const persistor = persistStore(store);

export default store;
