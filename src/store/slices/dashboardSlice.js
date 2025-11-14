import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const initialState = {
  stats: {
    totalLeads: 0,
    activeLeads: 0,
    convertedLeads: 0,
    totalActivities: 0,
  },
  leadStatusDistribution: [],
  leadSourceDistribution: [],
  monthlyTrends: [],
  recentActivities: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || state.stats;
        state.leadStatusDistribution =
          action.payload.leadStatusDistribution || [];
        state.leadSourceDistribution =
          action.payload.leadSourceDistribution || [];
        state.monthlyTrends = action.payload.monthlyTrends || [];
        state.recentActivities = action.payload.recentActivities || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

