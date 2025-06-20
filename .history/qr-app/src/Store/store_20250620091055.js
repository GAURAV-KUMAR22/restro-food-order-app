// store.js or Redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
import authReducer from "../Redux/Fetures/authSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// ⏳ 1. Define token expiration time
const MAX_AGE = 1 * 60 * 1000; // 1 minute in milliseconds

// ⛔ 2. Wrap authReducer with expiration logic
const authExpireReducer = (state, action) => {
  console.log(state?.timestamp && Date.now() - state.timestamp > MAX_AGE);
  if (state?.timestamp && Date.now() - state.timestamp > MAX_AGE) {
    // Expired → clear auth
    return {
      user: null,
      token: null,
      timestamp: null,
    };
  }
  return authReducer(state, action);
};

// 3. Create root reducer
const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authExpireReducer,
});

// 4. Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// 5. Apply persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 6. Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// 7. Export persistor
export const persistor = persistStore(store);
export default store;
