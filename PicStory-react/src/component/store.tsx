import { configureStore } from "@reduxjs/toolkit";
import userLoginReducer  from "../slices/userLoginSlice ";
import albumReducer  from "../slices/albumSlice";
import userReducer  from "../slices/userSlice";


// הגדרת ה-RootReducer
const store = configureStore({
  reducer: {
    userLogin: userLoginReducer, // מיפוי ה-reducer
    album:albumReducer,  // חשוב להפעיל את ה-reducer שלך
    user:userReducer
  },
});

// יצירת טיפוס של dispatch ו-state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
