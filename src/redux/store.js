import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
