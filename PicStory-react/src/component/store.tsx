import { configureStore } from "@reduxjs/toolkit";
import userLoginReducer from "../slices/userLoginSlice ";
import userReducer from "../slices/userSlice";
import albumReducer  from "../slices/albumSlice";
import photosReducer  from "../slices/photosSlice";
import sharedAlbumReducer from "../slices/sharedAlbumsSlice"

// הגדרת ה-RootReducer
const store = configureStore({
    reducer: {
        userLogin: userLoginReducer,// מיפוי ה-reducer
        user: userReducer,
        album:albumReducer,  
        photos: photosReducer,
        sharedAlbum:sharedAlbumReducer
    },
});

// יצירת טיפוס של dispatch ו-state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
