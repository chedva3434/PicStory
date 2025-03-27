import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { AlbumDTO } from '../models/AlbumDTO';
import { RootState } from '../component/store';
import { AlbumPostModel } from '../models/AlbumPostModel ';

// הגדרת כתובת ה-API
const API_URL = "http://localhost:5204/api";

// פונקציה שמחזירה את ה-Headers עם ה-Token
const getAuthHeaders = (token: string | null) => {
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "", // אם token הוא null, לא נשלח Authorization
        },
    };
};

// טיפוס מותאם אישית לשגיאות Axios
interface AxiosErrorResponse {
    message?: string;
}

// אקשן אסינכרוני להוספת אלבום
export const createAlbumAsync = createAsyncThunk<
    AlbumDTO, // סוג התוצאה שתחזור מהפעולה הזו
    AlbumPostModel, // סוג הקלט
    { state: RootState } // הטיפוס של ה-state שמגיע מ-getState
>(
    'album/createAlbumAsync',
    async (album: AlbumPostModel, { getState, rejectWithValue }) => {
        const { token } = getState().user; // שליפת ה-Token מתוך ה-Redux
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
        const { token, userId } = getState().user;
        console.log('Fetching albums - UserId:', userId, 'Token:', token);
        try {
            const response = await axios.get(`${API_URL}/Album`, {
                ...getAuthHeaders(token),
                params: { userId },
            });
            console.log('Albums fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching albums:', error);
            return rejectWithValue('הייתה שגיאה בהבאת האלבומים');
        }
    }
);

// אקשן אסינכרוני לעדכון אלבום
export const updateAlbumAsync = createAsyncThunk<
    AlbumDTO,
    { Id: number; album: AlbumPostModel },
    { state: RootState }
>(
    'album/updateAlbumAsync',
    async ({ Id, album }, { getState, rejectWithValue }) => {
        const { token } = getState().user; // שליפת ה-Token מתוך ה-Redux
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

// אקשן אסינכרוני למחיקת אלבום
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
    },
    
    
    
});

export const { setAlbums, setLoading, setError } = albumSlice.actions;
export default albumSlice.reducer;

