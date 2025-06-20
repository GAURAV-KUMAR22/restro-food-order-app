// store.js or Redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "../Redux/Cart/index.js";
import authReducer from "../Redux/Fetures/authSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const initialAuthState = authReducer(undefined, { type: "@@INIT" });

const MAX_AGE = 1 * 60 * 1000; // 1 minute

const authExpireReducer = (state = initialAuthState, action) => {
  console.log(state);
  if (state?.timestamp && Date.now() - state.timestamp > MAX_AGE) {
    console.log("🔒 Token expired");
    return {
      ...initialAuthState,
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
