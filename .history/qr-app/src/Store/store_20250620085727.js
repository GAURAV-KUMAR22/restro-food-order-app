import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

// ⏳ Custom auth reducer to check token age
const authExpireReducer = (state, action) => {
  // If state exists and token is too old, clear it
  const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  if (state?.timestamp && Date.now() - state.timestamp > MAX_AGE) {
    return {
      ...state,
      user: null,
      token: null,
      timestamp: null,
    };
  }
  return authReducer(state, action);
};

const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authExpireReducer, // wrap auth slice with TTL logic
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
