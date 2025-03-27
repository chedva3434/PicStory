import {TextField, Button, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./store";
import { loginUser,loginWithGoogle } from "../slices/userLoginSlice ";
import { loginSuccess } from "../slices/userSlice";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { getAlbums } from "./albumReducer";


const StyledCard = styled(Card)(() => ({
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "2px solid #ed5f79", // הגברת עובי המסגרת ל-2px
    borderRadius: "10px", // עיצוב פינות מעוגלות
}));

const StyledTextField = styled(TextField)(() => ({
    '& .MuiInputLabel-root': {
        color: "#757575", // צבע אפור ברירת מחדל ללייבל
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: "#757575", // צבע אפור גם כשהשדה בפוקוס
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: "#ed5f79", // צבע המסגרת הרגילה
        },
        '&:hover fieldset': {
            borderColor: "#ed5f79", // צבע בהובר
        },
        '&.Mui-focused fieldset': {
            borderColor: "#ed5f79", // צבע המסגרת כשהשדה בפוקוס
        },
    },
    '& .MuiInputBase-input': {
        color: "#000", // טקסט שחור רגיל
        backgroundColor: 'white', // רקע לבן קבוע
    },
}));


function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error } = useSelector((state: any) => state.user);

    const validateForm = () => {
        let formErrors = { username: "", password: "" };
        let isValid = true;
        if (!username) { formErrors.username = "The username is required"; isValid = false; }
        if (!password) { formErrors.password = "The password is required"; isValid = false; }
        setErrors(formErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;
        try {
            const resultAction = await dispatch(loginUser({ username, password })).unwrap();
            console.log("Login successful");
    
            if (!resultAction.token || resultAction.token.split(".").length !== 3) {
                console.error("Invalid JWT format:", resultAction.token);
                return;
            }
    
            // 🔹 פענוח ה-JWT ובדיקת התוכן שלו
            const decodedToken: any = jwtDecode(resultAction.token);
            console.log("Decoded Token:", decodedToken);
    
            const userId = parseInt(decodedToken["userId"], 10);
            if (!isNaN(userId)) {
                sessionStorage.setItem("userId", userId.toString());
            } else {
                console.error("UserId is missing or invalid from token!");
            }
    
            // 🔹 שמירה ב-sessionStorage אם ה-userId תקין
            if (userId) {
                sessionStorage.setItem("userId", userId.toString());
            } else {
                console.error("UserId is missing from token!");
            }
    
            // 🔹 עדכון ה-Redux
            dispatch(loginSuccess(resultAction.token));
    
            // 🔹 קריאה מיידית לאלבומים ברגע שהמשתמש מחובר
            dispatch(getAlbums());
    
            console.log("Token stored successfully:", resultAction.token);
    
            navigate("/test");
        } catch (err: any) {
            console.error("Login failed:", err);
        }
    };    
    
    
    
    // const handleGoogleLogin = async (response: any) => {
    //     if (response.credential) {
    //         const resultAction = await dispatch(loginWithGoogle(response.credential)).unwrap();
    //         if (resultAction.token) {
    //             sessionStorage.setItem("token", resultAction.token);
    //             console.log("Google login successful");
    //             navigate("/test");
    //         }
    //     }
    // };

    return (

        <StyledCard sx={{ maxWidth: "400px", margin: "0 auto", marginLeft: "550px" }}>
            <Typography variant="h6" color="#ed5f79" gutterBottom sx={{ textAlign: "center", fontWeight: 'bold' }}>
                Login
            </Typography>

            <StyledTextField
                label="Username"
                fullWidth
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                error={!!errors.username}
                helperText={errors.username}
            />

            <StyledTextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={!!errors.password}
                helperText={errors.password}
            />

            {error && <Typography color="error">{error}</Typography>}

            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleLogin}
                sx={{
                    backgroundColor: "#ed5f79",
                    '&:hover': { backgroundColor: "#d14c6a" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Login
                <SendIcon sx={{ marginLeft: 1 }} />
            </Button>
            {/* <GoogleLogin
                onSuccess={handleGoogleLogin} // הפונקציה שתתבצע כשמשתמש מתחבר
                onError={() => console.error("Google login error")} // לא מקבל פרמטר של שגיאה
                /> */}
        </StyledCard>

    );
};

export default Login;
