import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { AlbumDTO } from '../models/AlbumDTO';
import { RootState } from '../component/store';
import { AlbumPostModel } from '../models/AlbumPostModel ';
import { jwtDecode } from 'jwt-decode';


const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = (token: string | null) => {
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};

interface AxiosErrorResponse {
    message?: string;
}

export const createAlbumAsync = createAsyncThunk<
    AlbumDTO, 
    AlbumPostModel,
    { state: RootState } 
>(
    'album/createAlbumAsync',
    async (album: AlbumPostModel, { getState, rejectWithValue }) => {
        const { token } = getState().user; 
        try {
            const response = await axios.post(`${API_URL}/Album`, album, getAuthHeaders(token));
            return response.data as AlbumDTO;
        } catch (error) {
            if (error instanceof AxiosError) {
                const axiosError = error as AxiosError<AxiosErrorResponse>;
                if (axiosError.response && axiosError.response.data?.message) {
                    return rejectWithValue(axiosError.response.data.message);
                }
            }
            return rejectWithValue('הייתה שגיאה בהוספת האלבום');
        }
    }
);

export const getAlbums = createAsyncThunk<AlbumDTO[], void, { state: RootState }>(
    'album/fetchAlbums',
    async (_, { getState, rejectWithValue }) => {
      const { token } = getState().user;
  
      if (!token) {
        return rejectWithValue('No token found');
      }
  
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]; 
  
        if (!userId) {
          return rejectWithValue('User ID not found in token');
        }
  
        const response = await axios.get(`${API_URL}/Album/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Albums fetched successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching albums:', error);
        return rejectWithValue('Error fetching albums');
      }
    }
  );

export const updateAlbumAsync = createAsyncThunk<
    AlbumDTO,
    { Id: number; album: AlbumPostModel },
    { state: RootState }
>(
    'album/updateAlbumAsync',
    async ({ Id, album }, { getState, rejectWithValue }) => {
        const { token } = getState().user; 
        try {
            const response = await axios.put(`${API_URL}/Album/${Id}`, album, getAuthHeaders(token));
            return response.data as AlbumDTO;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<AxiosErrorResponse>;
                if (axiosError.response && axiosError.response.data?.message) {
                    return rejectWithValue(axiosError.response.data.message);
                }
            }
            return rejectWithValue('הייתה שגיאה בעדכון האלבום');
        }
    }
);


export const deleteAlbumAsync = createAsyncThunk<
    number,
    number,
    { state: RootState }
>(
    'album/deleteAlbumAsync',
    async (Id, { getState, rejectWithValue }) => {
        const { token } = getState().user; // שליפת ה-Token מתוך ה-Redux
        try {
            await axios.delete(`${API_URL}/Album/${Id}`, getAuthHeaders(token));
            return Id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<AxiosErrorResponse>;
                if (axiosError.response && axiosError.response.data?.message) {
                    return rejectWithValue(axiosError.response.data.message);
                }
            }
            return rejectWithValue('הייתה שגיאה במחיקת האלבום');
        }
    }
);

export const fetchAlbumById = createAsyncThunk(
    'albums/fetchById',
    async (albumId: number) => {
      try {
        const authToken = sessionStorage.getItem('authToken');
  
        if (!authToken) {
          throw new Error('No authToken found');
        }
  
        const response = await axios.get(`${API_URL}/Album/${albumId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, 
          },
        });
  
        return response.data;
      } catch (error) {
        console.error("Error fetching album:", error);
        throw error;
      }
    }
  );
  


interface AlbumState {
    albums: AlbumDTO[];
    selectedAlbum: AlbumDTO | null;
    loading: boolean;
    isFetching: boolean;  // חדש: מעקב אחרי טעינה ראשונית
    error: string | null;
}

const initialState: AlbumState = {
    albums: [],
    selectedAlbum: null,
    loading: false,
    isFetching: false, // התחלנו ללא טעינה
    error: null,
};

const albumSlice = createSlice({
    name: 'album',
    initialState,
    reducers: {
        updateAlbum: (state, action) => {
            const { Id, album } = action.payload;
            const index = state.albums.findIndex(a => a.id === Id);
            if (index !== -1) {
                state.albums[index] = album;
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setAlbums: (state, action: PayloadAction<AlbumDTO[]>) => {
            state.albums = action.payload;
        },
        setSelectedAlbum: (state, action) => {
            state.selectedAlbum = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAlbumAsync.fulfilled, (state, action: PayloadAction<AlbumDTO>) => {
                // לאחר הוספת האלבום דרך ה-API
                console.log("Album created:", action.payload);
                state.albums.push(action.payload);  // ודא שהאלבום מתווסף
            })
            .addCase(getAlbums.pending, (state) => {
                state.loading = true;
                state.isFetching = true;
                state.error = null;
            })
            .addCase(getAlbums.fulfilled, (state, action) => {
                state.albums = action.payload;
                state.loading = false;
                state.isFetching = false;
            })
            .addCase(getAlbums.rejected, (state, action) => {
                state.loading = false;
                state.isFetching = false;
                state.error = action.payload as string;
            });
            builder.addCase(fetchAlbumById.fulfilled, (state, action) => {
                state.selectedAlbum = action.payload;
             });
    },



});

export const {setSelectedAlbum, setAlbums, setLoading, setError } = albumSlice.actions;
export default albumSlice.reducer;

