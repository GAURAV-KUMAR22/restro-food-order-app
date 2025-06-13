import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {},
  role: null,
};
console.log(initialState);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("Reducer payload:", action.payload);
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.roll = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
