import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../models/User';
import axios from "axios";

// URL בסיסי ל-API
const API_URL = "http://localhost:5204/api/auth";

// 🔹 פעולה להרשמה
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { userName, name, email, password, role }: 
    { userName: string; name: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        userName,
        name,
        email,
        passwordHash: password,
        role,
      });
      return response.data; // מחזיר את הנתונים שנרשמו
    } catch (err) {
      return rejectWithValue("שגיאה בהרשמה");
    }
  }
);


// 🔹 פעולה להתחברות
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        passwordHash: password
      });
      return response.data;
    } catch (err) {
      return rejectWithValue("שגיאה בהתחברות");
    }
  }
);

// 🔹 פעולה להתחברות עם Google
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (googleCredential: string, { rejectWithValue }) => {
    try {
      // כאן ה-API שלך לעבודה עם Google
      const response = await axios.post(`${API_URL}/google-login`, { credential: googleCredential });
      return response.data;  // החזרת נתונים מהשרת
    } catch (err) {
      return rejectWithValue("שגיאה בהתחברות עם Google");
    }
  }
);

// 🟢 טיפוס ה-State של המשתמש
interface UserState {
  isAuthenticated: any;
  username: any;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 🔹 יצירת ה-Slice לניהול המשתמשים
const userLoginSlice  = createSlice({
  name: "user",
  initialState: { user: null, token: null, loading: false, error: null } as UserState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 🔹 רישום משתמש
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; // שמירת הטוקן ב-Redux
        sessionStorage.setItem("token", action.payload.token); // שמירת הטוקן בזיכרון הדפדפן
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 התחברות משתמש
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; // שמירת הטוקן ב-Redux
        sessionStorage.setItem("token", action.payload.token); // שמירת הטוקן בזיכרון הדפדפן
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // // 🔹 התחברות עם Google
      // .addCase(loginWithGoogle.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(loginWithGoogle.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload.user; // שמירת פרטי המשתמש שהתקבלו מ-Google
      //   state.token = action.payload.token; // שמירת הטוקן
      //   sessionStorage.setItem("token", action.payload.token); // שמירת הטוקן בזיכרון הדפדפן
      // })
      // .addCase(loginWithGoogle.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
  },
});

// ייצוא ה-Actions
export const { logout } = userLoginSlice .actions;

// ייצוא ה-Reducer
export default userLoginSlice .reducer;
