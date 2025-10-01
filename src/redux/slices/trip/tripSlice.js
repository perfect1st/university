import { createSlice } from "@reduxjs/toolkit";
import {
  getAllTrips,
  getAllTripsWithoutPaginations,
  getAllDriverTrips,
  getAllPassengerTrips,
  getOneTrip,
  editTrip,
  addTrip,
  getTripChat,
  getDashboardStats,
} from "./thunk";

const initialState = {
  allTrips: [],
  trips: [],
  allDriverTrips: [],
  allPassengerTrips: [],
  trip: null,
  chat: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

const tripSlice = createSlice({
  name: "tripSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Trips (without pagination)
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.dashboardStats = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.dashboardStats = null;
        state.error = action.error.message;
      });
    builder
      .addCase(getTripChat.pending, (state) => {
        state.loading = true;
        state.chat = [];
      })
      .addCase(getTripChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
      })
      .addCase(getTripChat.rejected, (state, action) => {
        state.loading = false;
        state.chat = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getAllTripsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allTrips = [];
      })
      .addCase(getAllTripsWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allTrips = action.payload;
      })
      .addCase(getAllTripsWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allTrips = [];
        state.error = action.error.message;
      });

    // Get All Trips (with pagination)
    builder
      .addCase(getAllTrips.pending, (state) => {
        state.loading = true;
        state.trips = [];
      })
      .addCase(getAllTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(getAllTrips.rejected, (state, action) => {
        state.loading = false;
        state.trips = [];
        state.error = action.error.message;
      });
    //  Get All Driver Trips (with pagination)
    builder
      .addCase(getAllDriverTrips.pending, (state) => {
        state.loading = true;
        // state.allDriverTrips = [];
      })
      .addCase(getAllDriverTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.allDriverTrips = action.payload;
      })
      .addCase(getAllDriverTrips.rejected, (state, action) => {
        state.loading = false;
        state.allDriverTrips = [];
        state.error = action.error.message;
      });
    //  Get All Passenger Trips (with pagination)
    builder
      .addCase(getAllPassengerTrips.pending, (state) => {
        state.loading = true;
        state.allPassengerTrips = [];
      })
      .addCase(getAllPassengerTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.allPassengerTrips = action.payload;
      })
      .addCase(getAllPassengerTrips.rejected, (state, action) => {
        state.loading = false;
        state.allPassengerTrips = [];
        state.error = action.error.message;
      });

    // Get One Trip
    builder
      .addCase(getOneTrip.pending, (state) => {
        state.loading = true;
        state.trip = null;
        state.error = null;
      })
      .addCase(getOneTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
        state.error = null;
      })
      .addCase(getOneTrip.rejected, (state, action) => {
        state.loading = false;
        state.trip = null;
        state.error = action.error.message;
      });

    // Edit Trip
    builder
      .addCase(editTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTrip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Add Trip
    builder
      .addCase(addTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTrip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tripSlice.reducer;
