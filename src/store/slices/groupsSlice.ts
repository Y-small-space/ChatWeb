import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface Group {
  group_id: string;
  name: string;
  description?: string;
  avatar?: string;
  created_at: string;
  member_count: number;
  owner_id: string;
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async () => {
    const response = await api.groups.getGroups();
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (data: { name: string; description?: string }) => {
    const response = await api.groups.createGroup(data);
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch groups";
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      });
  },
});

export default groupsSlice.reducer; 