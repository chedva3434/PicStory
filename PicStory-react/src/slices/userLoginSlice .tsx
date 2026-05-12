import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../models/User";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/Auth`;


export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    {
      userName,
      name,
      email,
      password,
      role,
    }: {
      userName: string;
      name: string;
      email: string;
      password: string;
      role: string;
    },
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

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "שגיאה בתקשורת עם השרת"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        passwordHash: password,
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "שגיאה בהתחברות"
      );
    }
  }
);


interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};


const userLoginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      sessionStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

   
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        const token =
          action.payload?.token || action.payload?.Token;

        state.token = token || null;

        if (token) {
          sessionStorage.setItem("token", token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const token =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.token || action.payload?.Token;

        state.token = token || null;

        if (token) {
          sessionStorage.setItem("token", token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userLoginSlice.actions;
export default userLoginSlice.reducer;