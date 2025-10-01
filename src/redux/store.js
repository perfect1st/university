import { configureStore } from "@reduxjs/toolkit";
import passengerSlice from "./slices/passenger/passengerSlice";
import driverSlice from "./slices/driver/driverSlice";
import carTypeSlice from "./slices/carType/carTypeSlice";
import paymentMethodSlice from "./slices/paymentMethod/paymentMethodSlice";
import tripSlice from "./slices/trip/tripSlice";
import carSlice from "./slices/car/carSlice";
import carAssignmentSlice from "./slices/carAssignment/carAssignmentSlice";
import userSlice from "./slices/user/userSlice";
import permissionGroupSlice from "./slices/permissionGroup/permissionGroupSlice";
import walletSlice from "./slices/wallet/walletSlice";
import lookupsSlice from "./slices/lookups/lookupsSlice";
import dailyCommissionsSlice from "./slices/dailyCommissions/dailyCommissionsSlice";
import commissionCategorySlice from "./slices/commissionCategory/commissionCategorySlice";
import liquidationSlice from "./slices/liquidation/liquidationSlice";
import couponSlice from "./slices/coupon/couponSlice";
import offerSlice from "./slices/offer/offerSlice";
import trafficTimeSlice from "./slices/trafficTime/trafficTimeSlice";
import settingSlice from "./slices/setting/settingSlice";
import contactUsSlice from "./slices/contactUs/contactUsSlice";

export const store = configureStore({
  reducer: {
    passenger: passengerSlice,
    driver: driverSlice,
    carType: carTypeSlice,
    paymentMethod: paymentMethodSlice,
    trip: tripSlice,
    car: carSlice,
    carAssignment: carAssignmentSlice,
    user: userSlice,
    permissionGroup: permissionGroupSlice,
    wallet: walletSlice,
    lookups: lookupsSlice,
    dailyCommissions: dailyCommissionsSlice,
    commissionCategory: commissionCategorySlice,
    liquidation: liquidationSlice,
    coupon: couponSlice,
    offer: offerSlice,
    trafficTime: trafficTimeSlice,
    setting: settingSlice,
    contactUs: contactUsSlice,
  },
});
