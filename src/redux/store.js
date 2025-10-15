import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user/userSlice";
import permissionGroupSlice from "./slices/permissionGroup/permissionGroupSlice";
import settingSlice from "./slices/setting/settingSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    permissionGroup: permissionGroupSlice,
    setting: settingSlice,
  },
});
