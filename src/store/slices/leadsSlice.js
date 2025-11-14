import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunks
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/leads", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leads"
      );
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lead"
      );
    }
  }
);

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await api.post("/leads", leadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create lead"
      );
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leads/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lead"
      );
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete lead"
      );
    }
  }
);

const initialState = {
  leads: [],
  currentLead: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch lead by ID
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      // Update lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.currentLead && state.currentLead._id === action.payload._id) {
          state.currentLead = action.payload;
        }
      })
      // Delete lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((lead) => lead._id !== action.payload);
        if (state.currentLead && state.currentLead._id === action.payload) {
          state.currentLead = null;
        }
      });
  },
});

export const { clearCurrentLead, clearError } = leadsSlice.actions;
export default leadsSlice.reducer;


