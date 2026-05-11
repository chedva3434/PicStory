import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Photo } from "../models/Photo";
import { PhotoPostModels } from "../models/PotoPostModels";

const API_PHOTOS = "https://localhost:7213/api/Photo";
const API_UPLOAD = "https://localhost:7213/api/UploadFile/presigned-url";
const API_VIEW = "https://localhost:7213/api/UploadFile/view-url";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("authToken");
    return { Authorization: `Bearer ${token}` };
  };  

export const getPresignedUrl = createAsyncThunk<string, { fileName: string, contentType: string }>(
    "photos/getPresignedUrl",
    async ({ fileName, contentType }) => {
        const response = await axios.get<{ url: string }>(
            API_UPLOAD,
            {
                headers: getAuthHeaders(),
                params: { fileName, contentType }
            }
        );
        return response.data.url;
    }
);

export const uploadToS3 = createAsyncThunk(
    "photos/uploadToS3",
    async ({ file, uploadUrl }: { file: File; uploadUrl: string }) => {
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type,
            }
        });
        return uploadUrl.split("?")[0];
    }
);

export const getViewFileUrl = createAsyncThunk<string, string>(
    'photos/getViewFileUrl',
    async (s3Key: string) => {
        const response = await axios.get<{ url: string }>(API_VIEW, {
            headers: getAuthHeaders(),
            params: { fileName: s3Key }
        });
        return response.data.url;
    }
);

export const savePhoto = createAsyncThunk<Photo, PhotoPostModels>(
    "photos/savePhoto",
    async (photoData) => {
        const response = await axios.post<Photo>(API_PHOTOS, photoData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }
);

export const fetchPhotos = createAsyncThunk<Photo[]>(
    "photos/fetchPhotos",
    async () => {
        const response = await axios.get<Photo[]>(API_PHOTOS, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }
);

export const fetchPhotosByAlbumId = createAsyncThunk<Photo[], number>(
    "photos/fetchPhotosByAlbumId",
    async (albumId) => {
        const response = await axios.get<Photo[]>(`${API_PHOTOS}/album/${albumId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }
);

export const fetchPhotosByUserId = createAsyncThunk<Photo[], number>(
    "photos/fetchPhotosByUserId",
    async (userId) => {
      const response = await axios.get<Photo[]>(`${API_PHOTOS}/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    }
  );  

export const deletePhoto = createAsyncThunk<void, number>(
    "photos/deletePhoto",
    async (photoId) => {
        await axios.delete(`${API_PHOTOS}/${photoId}`, {
            headers: getAuthHeaders(),
        });
    }
);

export const updatePhoto = createAsyncThunk<Photo, Photo>(
    "photos/updatePhoto",
    async (photo) => {
        const response = await axios.put<Photo>(`${API_PHOTOS}/${photo.id}`, photo, {
            headers: getAuthHeaders(),
        });
        return response.data;
    }
);


const photosSlice = createSlice({
    name: "photos",
    initialState: {
        photos: [] as Photo[],
        status: "idle",
        error: null as string | null,
        viewUrl: null as string | null, // ← חדש
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhotos.fulfilled, (state, action) => {
                state.photos = action.payload;
            })
            .addCase(savePhoto.fulfilled, (state, action) => {
                state.photos.push(action.payload);
            })
            .addCase(getViewFileUrl.fulfilled, (state, action) => {
                if (action.payload) {
                    state.viewUrl = action.payload;
                } else {
                    console.error('❌ לא התקבל URL תקין');
                }
            })
            .addCase(fetchPhotosByAlbumId.fulfilled, (state, action) => {
                state.photos = action.payload;
            })  
            .addCase(deletePhoto.fulfilled, (state, action) => {
                state.photos = state.photos.filter(photo => photo.id !== action.meta.arg);
            })
            .addCase(updatePhoto.fulfilled, (state, action) => {
                const index = state.photos.findIndex(photo => photo.id === action.payload.id);
                if (index !== -1) {
                    state.photos[index] = action.payload;
                }
            })           
            .addCase(fetchPhotosByUserId.fulfilled, (state, action) => {
                state.photos = action.payload;
            })            
    },
});

export default photosSlice.reducer;
