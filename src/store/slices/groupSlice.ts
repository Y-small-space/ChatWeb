import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface GroupState {
  groups: Group[];
  currentGroup: GroupDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
};

export const createGroup = createAsyncThunk(
  'groups/create',
  async (data: CreateGroupRequest) => {
    const response = await api.groups.create(data);
    return response.group;
  }
);

export const fetchGroups = createAsyncThunk('groups/fetchList', async () => {
  const response = await api.groups.getList();
  return response.groups;
});

export const fetchGroupDetail = createAsyncThunk(
  'groups/fetchDetail',
  async (groupId: string) => {
    const response = await api.groups.getDetail(groupId);
    return response.group;
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    addMember: (state, action) => {
      if (state.currentGroup) {
        state.currentGroup.members.push(action.payload);
      }
    },
    removeMember: (state, action) => {
      if (state.currentGroup) {
        state.currentGroup.members = state.currentGroup.members.filter(
          (member) => member.user_id !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.loading = false;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取群组列表失败';
      })
      .addCase(fetchGroupDetail.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      });
  },
});

export const { setCurrentGroup, addMember, removeMember } = groupSlice.actions;
export default groupSlice.reducer; 