// redux/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load from sessionStorage on init
const persistedUser = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: persistedUser, // preloaded state
  },
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload)); // persist
    },
    signOut: (state) => {
      state.currentUser = null;
      sessionStorage.removeItem("user"); // clear storage
    },
  },
});

export const { signInSuccess, signOut } = userSlice.actions;
export default userSlice.reducer;
