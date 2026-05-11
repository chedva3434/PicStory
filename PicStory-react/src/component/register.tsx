"use client"
import { useState } from "react"
import { TextField, Button, Card, Typography, MenuItem, Box, InputAdornment, IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import SendIcon from "@mui/icons-material/Send"
import PersonIcon from "@mui/icons-material/Person"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import BadgeIcon from "@mui/icons-material/Badge"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import type { AppDispatch } from "./store"
import { registerUser } from "../slices/userLoginSlice "
import { registerSuccess } from "../slices/userSlice"
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
  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.8)", fontWeight: "500" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)", borderWidth: "2px" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)", boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" },
    "&.Mui-focused fieldset": { borderColor: "#fff", boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)" },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)", transform: "translateY(-2px)" },
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    fontWeight: "500",
    "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
  "& .MuiFormHelperText-root": { color: "#ff6b6b", fontWeight: "500", marginLeft: "8px" },
  "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.7)" },
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
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.5)",
    transform: "none",
    boxShadow: "none",
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

function Register() {
  const [userName, setUserName] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("User")
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({ userName: "", name: "", email: "", password: "" })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: any) => state.user)

  const validateForm = () => {
    const newErrors = {
      userName: userName ? "" : "Username is required",
      name: name ? "" : "Full name is required",
      email: email && /\S+@\S+\.\S+/.test(email) ? "" : "Invalid email address",
      password: password.length >= 6 ? "" : "Password must be at least 6 characters",
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(registerUser({ userName, name, email, password, role })).unwrap()
      const token = resultAction.token
      if (!token || token.split(".").length !== 3) return

      const decodedToken: any = jwtDecode(token)
      const userId = Number.parseInt(decodedToken["userId"], 10)
      if (!isNaN(userId)) sessionStorage.setItem("userId", userId.toString())
      sessionStorage.setItem("authToken", token)
      dispatch(registerSuccess(token))
      navigate("/album-list")
    } catch (err: any) {
      console.error("Registration failed:", err)
    }
  }

  const handleTogglePassword = () => setShowPassword(!showPassword)

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
  }

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
      <Box sx={{ position: "absolute", top: "5%", left: "5%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)", borderRadius: "50%", animation: "float 6s ease-in-out infinite" }} />
      <Box sx={{ position: "absolute", bottom: "5%", right: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)", borderRadius: "50%", animation: "float 8s ease-in-out infinite reverse" }} />

      <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <StyledCard sx={{ maxWidth: "500px", width: "100%" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Box sx={{ marginTop:5, display: "inline-flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(45deg, #f093fb, #f5576c)", mb: 3, boxShadow: "0 10px 30px rgba(240, 147, 251, 0.3)" }}>
                <PhotoCameraIcon sx={{ fontSize: "40px", color: "white" }} />
              </Box>
            </motion.div>

            <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold", mb: 1, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>Join Photo World</Typography>
            <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "16px" }}>Create your account to start your photo journey</Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault()
              handleRegister()
            }}
          >
            {/* כל השדות שלך */}
            {/* Username */}
            <motion.div custom={0} variants={formVariants} initial="hidden" animate="visible">
              <StyledTextField
                label="Username"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                error={!!errors.userName}
                helperText={errors.userName}
                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
                sx={{ mb: 2 }}
              />
            </motion.div>

            {/* Full Name */}
            <motion.div custom={1} variants={formVariants} initial="hidden" animate="visible">
              <StyledTextField
                label="Full Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeIcon /></InputAdornment>) }}
                sx={{ mb: 2 }}
              />
            </motion.div>

            {/* Email */}
            <motion.div custom={2} variants={formVariants} initial="hidden" animate="visible">
              <StyledTextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
                sx={{ mb: 2 }}
              />
            </motion.div>

            {/* Password */}
            <motion.div custom={3} variants={formVariants} initial="hidden" animate="visible">
              <StyledTextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </motion.div>

            {/* Role */}
            <motion.div custom={4} variants={formVariants} initial="hidden" animate="visible">
              <StyledTextField
                select
                label="Role"
                fullWidth
                margin="normal"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><AdminPanelSettingsIcon /></InputAdornment>) }}
                sx={{ mb: 3 }}
              >
                <MenuItem value="User"><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><PersonIcon fontSize="small" />User</Box></MenuItem>
              </StyledTextField>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Box sx={{ backgroundColor: "rgba(244, 67, 54, 0.1)", border: "1px solid rgba(244, 67, 54, 0.3)", borderRadius: "8px", p: 2, mb: 3 }}>
                  <Typography color="error" sx={{ textAlign: "center" }}>{error}</Typography>
                </Box>
              </motion.div>
            )}

            <motion.div custom={5} variants={formVariants} initial="hidden" animate="visible">
              <StyledButton fullWidth type="submit" disabled={loading} sx={{ mb: 3 }}>
                {loading ? "Creating Account..." : "Create Account"}
                <SendIcon sx={{ ml: 1 }} />
              </StyledButton>
            </motion.div>
          </Box>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
            <Box sx={{ textAlign: "center", pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}>Already have an account?</Typography>
              <Typography component="a" href="/login" sx={{ color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "16px", cursor: "pointer", transition: "all 0.3s ease", "&:hover": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)", transform: "translateY(-1px)" } }}>Sign In →</Typography>
            </Box>
          </motion.div>
        </StyledCard>
      </motion.div>
    </Box>
  )
}

export default Register
