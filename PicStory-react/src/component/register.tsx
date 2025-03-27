import { useState } from "react";
import { TextField, Button, Card, Typography, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "./store"; // ייבוא ה- AppDispatch
import SendIcon from '@mui/icons-material/Send'; // אייקון של שליחה
import { registerUser } from "../slices/userLoginSlice ";
import { registerSuccess } from "../slices/userSlice";

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

function Register() {
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("User");

    const [errors, setErrors] = useState({
        userName: "",
        name: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: any) => state.user);

    const validateForm = () => {
        const newErrors = {
            userName: userName ? "" : "שם משתמש חובה",
            name: name ? "" : "שם מלא חובה",
            email: email && /\S+@\S+\.\S+/.test(email) ? "" : "אימייל לא תקין",
            password: password.length >= 6 ? "" : "סיסמה חייבת להיות לפחות 6 תווים",
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        try {
            const resultAction = await dispatch(registerUser({ userName, name, email, password, role }));
                        if (registerUser.fulfilled.match(resultAction)) {
                console.log("registerSuccess");
    
                // תוצאה עם ה-token
                const token = resultAction.payload.token;
    
                if (!token || token.split(".").length !== 3) {
                    console.error("Invalid JWT format:", token);
                    return;
                }
    
                // עדכון Redux ב-token
                dispatch(registerSuccess(token)); 
                console.log("Token stored successfully:", token);
    
                // ניווט לדף test
                navigate("/test"); 
            } else {
                console.error("Registration failed:", resultAction.error.message);
            }
        } catch (err: any) {
            console.error("Registration failed:", err);
        }
    };
    
 
    return (
        <StyledCard sx={{
            maxWidth: "400px",
            margin: "0 auto",
            marginTop: "130px",
            marginLeft: "550px"
        }}>
            <Typography
                variant="h6"
                color="#ed5f79"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: 'bold' }}
            >
                Sign Up
            </Typography>

            <StyledTextField
                label="userName"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                error={!!errors.userName}
                helperText={errors.userName}
            />
            <StyledTextField
                label="fullName"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
            />
            <StyledTextField
                label="email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
            />
            <StyledTextField
                label="password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
            />
            <StyledTextField
                select
                label="role"
                fullWidth
                margin="normal"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <MenuItem value="User">user</MenuItem>
                <MenuItem value="Admin">admin</MenuItem>
            </StyledTextField>

            {error && <Typography color="error">{error}</Typography>}

            <Button
                variant="contained"
                fullWidth
                onClick={handleRegister}
                disabled={loading}
                sx={{
                    backgroundColor: "#ed5f79", // צבע כפתור ורוד
                    '&:hover': {
                        backgroundColor: "#d14c6a", // צבע בהובר
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Sign Up
                <SendIcon sx={{ marginLeft: 1 }} />
            </Button>
        </StyledCard>
    );
}

export default Register;
