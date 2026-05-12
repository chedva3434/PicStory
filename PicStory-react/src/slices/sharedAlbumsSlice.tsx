import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../component/store";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token: string | null) => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export interface SharedAlbum {
  id: number;
  albumId: number;
  userId: number;
  permissions: string;
  createdAt: string;
  album: {
    id: number;
    name: string;
    description: string;
    userId: number;
    user: {
      id: number;
      email: string;
    };
  };
}

interface SharedAlbumState {
  sharedAlbums: SharedAlbum[];
  loading: boolean;
  error: string | null;
}

const initialState: SharedAlbumState = {
  sharedAlbums: [],
  loading: false,
  error: null,
};

export const shareAlbumByEmail = createAsyncThunk<
  { userName: string; email: string }, 
  { albumId: number; email: string; permissions: string }, 
  { state: RootState }
>("sharedAlbum/shareAlbumByEmail", async (payload, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  try {
    const response = await axios.post(
      `${API_URL}/SharedAlbum/share-by-email`,
      payload,
      getAuthHeaders(token)
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "שגיאה בשיתוף");
    }
    return rejectWithValue("שגיאה לא צפויה");
  }
});

// טעינת כל האלבומים ששיתפו עם המשתמש
export const getSharedAlbums = createAsyncThunk<
  SharedAlbum[],
  number, // userId
  { state: RootState }
>("sharedAlbum/getSharedAlbums", async (userId, { getState, rejectWithValue }) => {
  const { token } = getState().user;
  try {
    const response = await axios.get(
      `${API_URL}/SharedAlbum/user/${userId}`,
      getAuthHeaders(token)
    );
    return response.data as SharedAlbum[];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת אלבומים משותפים");
    }
    return rejectWithValue("שגיאה לא צפויה");
  }
});

const sharedAlbumSlice = createSlice({
  name: "sharedAlbum",
  initialState,
  reducers: {
    clearSharedAlbums: (state) => {
      state.sharedAlbums = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // שיתוף אלבום
      .addCase(shareAlbumByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareAlbumByEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(shareAlbumByEmail.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // טעינת אלבומים משותפים
      .addCase(getSharedAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSharedAlbums.fulfilled, (state, action: PayloadAction<SharedAlbum[]>) => {
        state.loading = false;
        state.sharedAlbums = action.payload;
      })
      .addCase(getSharedAlbums.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSharedAlbums } = sharedAlbumSlice.actions;
export default sharedAlbumSlice.reducer;
