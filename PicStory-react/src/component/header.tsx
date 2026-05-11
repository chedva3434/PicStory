"use client"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  Typography,
  Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import CollectionsIcon from "@mui/icons-material/Collections"
import PeopleIcon from "@mui/icons-material/People"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LogoutIcon from "@mui/icons-material/Logout"
import NotificationsIcon from "@mui/icons-material/Notifications"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../slices/userLoginSlice "

const StyledAppBar = styled(AppBar)(() => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)",
    backgroundSize: "300% 100%",
    animation: "gradient 3s ease infinite",
  },
}))

const StyledButton = styled(Button)(() => ({
  color: "#fff",
  fontWeight: "600",
  fontSize: "14px",
  textTransform: "none",
  borderRadius: "25px",
  padding: "8px 20px",
  margin: "0 4px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(255, 255, 255, 0.1)",
  },
}))

const StyledIconButton = styled(IconButton)(() => ({
  color: "#fff",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: "scale(1.1)",
  },
}))

const LogoContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}))

const MobileMenuButton = styled(IconButton)(() => ({
  display: "none",
  color: "#fff",
  "@media (max-width: 1024px)": {
    display: "flex",
  },
}))

const DesktopMenu = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "@media (max-width: 1024px)": {
    display: "none",
  },
}))

const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // וודאי ששמות השדות כאן תואמים ל-State שלך ב-Redux
  const { username, token } = useSelector((state: any) => state.user)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount] = useState(3)

  const handleMenuClick = (path: string) => {
    if (!token) {
      setOpenSnackbar(true)
    } else {
      navigate(path)
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())             // עדכון Redux
    localStorage.clear()           // ניקוי Storage
    navigate("/")                  // ניווט לדף הבית
    // אם הבעיה ממשיכה, שחררי את ההערה מהשורה הבאה במקום navigate:
    // window.location.href = "/"; 
  }

  const menuItems = [
    { label: "Albums", icon: <PhotoLibraryIcon />, path: "/album-list" },
    { label: "Shared With Me", icon: <PeopleIcon />, path: "/shared-with-me" },
    { label: "Collages", icon: <CollectionsIcon />, path: "/gif-slideshow" },
  ]

  return (
    <>
      <StyledAppBar>
        <Toolbar sx={{ padding: "0 24px", minHeight: "80px" }}>
          <LogoContainer onClick={() => navigate("/")}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <PhotoLibraryIcon sx={{ fontSize: "25px", color: "white" }} />
              </Box>
            </motion.div>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff", lineHeight: 1.2 }}>
                PicStory
              </Typography>
            </Box>
          </LogoContainer>

          {/* Desktop Navigation */}
          <DesktopMenu sx={{ flexGrow: 1, justifyContent: "center" }}>
            {!token ? (
              <>
                <StyledButton startIcon={<LoginIcon />} onClick={() => navigate("/login")}>
                  Login
                </StyledButton>
                <StyledButton startIcon={<PersonAddIcon />} onClick={() => navigate("/register")}>
                  Sign Up
                </StyledButton>
              </>
            ) : (
              menuItems.map((item) => (
                <StyledButton key={item.label} startIcon={item.icon} onClick={() => handleMenuClick(item.path)}>
                  {item.label}
                </StyledButton>
              ))
            )}
          </DesktopMenu>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {token && (
              <>
                {/* Notifications */}
                <StyledIconButton>
                  <Box sx={{ position: "relative" }}>
                    <NotificationsIcon />
                    {notificationCount > 0 && (
                      <Chip
                        label={notificationCount}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          minWidth: "18px",
                          height: "18px",
                          fontSize: "10px",
                          background: "#f5576c",
                          color: "white",
                        }}
                      />
                    )}
                  </Box>
                </StyledIconButton>

                {/* Avatar - No menu, just visual */}
                <Tooltip title={`User: ${username}`}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      background: "linear-gradient(45deg, #f093fb, #f5576c)", 
                      mx: 1 
                    }}
                  >
                    {username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Tooltip>

                {/* Logout Button directly in Header */}
                <StyledButton 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    backgroundColor: "rgba(255, 107, 107, 0.2)",
                    "&:hover": { backgroundColor: "rgba(255, 107, 107, 0.4)" }
                  }}
                >
                  Logout
                </StyledButton>
              </>
            )}

            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </MobileMenuButton>
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Box sx={{ background: "rgba(0, 0, 0, 0.8)", p: 2, display: { lg: "none" } }}>
                {!token ? (
                  <>
                    <StyledButton fullWidth onClick={() => { navigate("/login"); setMobileMenuOpen(false) }}>Login</StyledButton>
                    <StyledButton fullWidth onClick={() => { navigate("/register"); setMobileMenuOpen(false) }}>Sign Up</StyledButton>
                  </>
                ) : (
                  <>
                    {menuItems.map((item) => (
                      <StyledButton key={item.label} fullWidth startIcon={item.icon} onClick={() => handleMenuClick(item.path)} sx={{ mb: 1 }}>
                        {item.label}
                      </StyledButton>
                    ))}
                    <StyledButton fullWidth startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ color: "#ff6b6b" }}>
                      Logout
                    </StyledButton>
                  </>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </StyledAppBar>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="warning" variant="filled">
          🔒 Please login to access this feature
        </Alert>
      </Snackbar>
    </>
  )
}

export default Header