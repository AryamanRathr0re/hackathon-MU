import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import leadsReducer from "./slices/leadsSlice";
import activitiesReducer from "./slices/activitiesSlice";
import notificationsReducer from "./slices/notificationsSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    activities: activitiesReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
  },
});


