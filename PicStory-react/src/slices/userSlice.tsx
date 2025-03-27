import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
  username: string | null;
  userId: number | null;  // הוספת המאפיין userId
  token: string | null;
}

const initialState: UserState = {
  username: null,
  userId: null,   // ברירת מחדל ל-userId
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // פונקציה שמעדכנת את המידע אחרי התחברות
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      try {
        const decoded: any = jwtDecode(action.payload);
        console.log("Decoded Token:", decoded); // לוודא שהטוקן מכיל מידע

        state.username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        console.log("Updated Redux State:", state); // לוודא שהשם נשמר
      } catch (error) {
        console.error("JWT Decode Error:", error);
      }
    },

    // פונקציה חדשה שנוספה להצלחה בהרשמה
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      try {
        const decoded: any = jwtDecode(action.payload);
        console.log("Decoded Token:", decoded); // לוודא שהטוקן מכיל מידע

        state.username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        console.log("Updated Redux State:", state); // לוודא שהשם נשמר
      } catch (error) {
        console.error("JWT Decode Error:", error);
      }
    },

    // פונקציה להתנתקות
    logout: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, registerSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
