import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (leadId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activities/lead/${leadId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activities"
      );
    }
  }
);

export const createActivity = createAsyncThunk(
  "activities/createActivity",
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await api.post("/activities", activityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create activity"
      );
    }
  }
);

export const updateActivity = createAsyncThunk(
  "activities/updateActivity",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/activities/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update activity"
      );
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "activities/deleteActivity",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/activities/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete activity"
      );
    }
  }
);

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create activity
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      })
      // Update activity
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.activities.findIndex(
          (activity) => activity._id === action.payload._id
        );
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      // Delete activity
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(
          (activity) => activity._id !== action.payload
        );
      });
  },
});

export const { addActivity, clearError } = activitiesSlice.actions;
export default activitiesSlice.reducer;

