import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // the single reducer that knows how to handle all the actions applied to the authSlice 

// configureStore creates the Redux store
// The reducer object lets you pass an object mapping slice names → slice reducers.
const store = configureStore({
  reducer: {
    auth: authReducer, //auth becomes the key in the Redux state tree
  },
});

// store.getState()  will return:
// { auth: { isLoggedIn: false, isAdmin: false, userData: null } }

export default store;