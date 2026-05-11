"use client"
import { TextField, Button, Card, Typography, Link, Box, InputAdornment, IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import SendIcon from "@mui/icons-material/Send"
import PersonIcon from "@mui/icons-material/Person"
import LockIcon from "@mui/icons-material/Lock"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import type { AppDispatch } from "./store"
import { loginSuccess } from "../slices/userSlice"
import { loginUser } from "../slices/userLoginSlice "
import { jwtDecode } from "jwt-decode"


const StyledCard = styled(Card)(() => ({
  padding: "40px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)",
    backgroundSize: "300% 100%",
    animation: "gradient 3s ease infinite",
  },
}))

const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)", borderWidth: "2px" },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
      boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
    },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)", transform: "translateY(-2px)" },
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    fontWeight: "500",
    "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
}))

const StyledButton = styled(Button)(() => ({
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  color: "white",
  padding: "15px 30px",
  borderRadius: "50px",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
    transform: "translateY(-3px)",
    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": { left: "100%" },
}))

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { error } = useSelector((state: any) => state.user)

  const validateForm = () => {
    const formErrors = { username: "", password: "" }
    let isValid = true
    if (!username) { formErrors.username = "Username is required"; isValid = false }
    if (!password) { formErrors.password = "Password is required"; isValid = false }
    setErrors(formErrors)
    return isValid
  }

  const handleLogin = async () => {
    if (!validateForm()) return
    try {
      const resultAction = await dispatch(loginUser({ username, password })).unwrap()
      console.log("Login successful")

      if (!resultAction.token || resultAction.token.split(".").length !== 3) {
        console.error("Invalid JWT format:", resultAction.token)
        return
      }

      const decodedToken: any = jwtDecode(resultAction.token)
      const userId = Number.parseInt(decodedToken["userId"], 10)
      if (!isNaN(userId)) sessionStorage.setItem("userId", userId.toString())

      sessionStorage.setItem("authToken", resultAction.token)
      dispatch(loginSuccess(resultAction.token))
      navigate("/album-list")
    } catch (err: any) {
      console.error("Login failed:", err)
    }
  }

  const handleTogglePassword = () => setShowPassword(!showPassword)

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          marginTop: 15,
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <StyledCard sx={{ maxWidth: "450px", width: "100%" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Box
                sx={{
                  marginTop: 5,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  mb: 3,
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: "40px", color: "white" }} />
              </Box>
            </motion.div>

            <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold", mb: 1, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "16px" }}>
              Sign in to access your photo world
            </Typography>
          </Box>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <StyledTextField
                label="Username"
                fullWidth
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />

              <StyledTextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {error && (
                <Box sx={{ backgroundColor: "rgba(244, 67, 54, 0.1)", border: "1px solid rgba(244, 67, 54, 0.3)", borderRadius: "8px", p: 2, mb: 3 }}>
                  <Typography color="error" sx={{ textAlign: "center" }}>{error}</Typography>
                </Box>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                <StyledButton fullWidth type="submit" sx={{ mb: 3 }}>
                  Sign In
                  <SendIcon sx={{ ml: 1 }} />
                </StyledButton>
              </motion.div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <Box sx={{ textAlign: "center", pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>Don't have an account?</Typography>
              <Link href="/register" sx={{ color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "16px", transition: "all 0.3s ease", "&:hover": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)", transform: "translateY(-1px)" } }}>
                Create Account →
              </Link>
            </Box>
          </motion.div>
        </StyledCard>
      </motion.div>
    </Box>
  )
}

export default Login
