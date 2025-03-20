import { Card, styled } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const StyledCard = styled(Card)({
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // שקיפות נמוכה
    border: "1px solid black",
});
interface LoginFormProps {
    closeModal: () => void;
}

function Login({ closeModal }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`https://localhost:7136/api/Auth/login`, {Username: username, PasswordHash:password });
            console.log(response.data.token);
            
            sessionStorage.setItem("token", response.data.token); // שמירת הטוקן
            alert("wellcome 🤗")
            closeModal(); // סגירת הפופ-אפ לאחר התחברות מוצלחת
            navigate('/summary-up!');

        } catch (err) {
            alert("errorrrrr 😥")
        }
    };

    return (
        <StyledCard>
            <Typography variant="h6">התחברות</Typography>
            <TextField label="שם משתמש" fullWidth margin="normal" onChange={(e) => setUsername(e.target.value)} />
            <TextField label="סיסמה" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                התחבר
            </Button>
        </StyledCard>
    );
}

export default Login;