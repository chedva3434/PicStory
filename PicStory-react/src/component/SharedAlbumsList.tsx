"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Collapse,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"
import ShareIcon from "@mui/icons-material/Share"
import CloseIcon from "@mui/icons-material/Close"
import EmailIcon from "@mui/icons-material/Email"
import SecurityIcon from "@mui/icons-material/Security"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "../component/store"
import { shareAlbumByEmail } from "../slices/sharedAlbumsSlice"

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    overflow: "visible",
    maxWidth: "500px",
    width: "100%",
  },
}))

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "#e0e0e0",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: "500",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#667eea",
  },
}))

const ActionButton = styled(Button)(() => ({
  borderRadius: "16px",
  padding: "12px 32px",
  fontWeight: "600",
  textTransform: "none",
  fontSize: "16px",
  transition: "all 0.3s ease",
  "&.primary": {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    },
  },
  "&.secondary": {
    background: "transparent",
    color: "#666",
    border: "2px solid #e0e0e0",
    "&:hover": {
      background: "#f5f5f5",
      borderColor: "#d0d0d0",
    },
  },
}))

const PermissionChip = styled(Chip)(() => ({
  borderRadius: "12px",
  height: "40px",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.3s ease",
  "&.view": {
    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    color: "#1976d2",
    border: "2px solid #2196f3",
  },
  "&.edit": {
    background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
    color: "#7b1fa2",
    border: "2px solid #9c27b0",
  },
}))

function SharedAlbumsList() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { albumId } = useParams<{ albumId: string }>()

  const { loading } = useSelector((state: RootState) => state.sharedAlbum)

  const [email, setEmail] = useState("")
  const [permissions, setPermissions] = useState("view")
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    setLocalError(null)
    setSuccessMessage(null)
    navigate(-1)
  }

  const handleShare = async () => {
    setLocalError(null)
    setSuccessMessage(null)

    if (!email) {
      setLocalError("אנא הכנס אימייל")
      return
    }
    if (!albumId) {
      setLocalError("AlbumId לא נמצא")
      return
    }

    try {
      const result = await dispatch(
        shareAlbumByEmail({
          albumId: Number.parseInt(albumId),
          email,
          permissions,
        }),
      ).unwrap()

      setSuccessMessage(`האלבום שותף בהצלחה)`)

      setTimeout(() => handleClose(), 3000)
    } catch (err: any) {
      let message = "שגיאה לא צפויה בשיתוף האלבום"
      if (typeof err === "string") message = err
      else if (err?.message) message = err.message

      setLocalError(message)
    }
  }

  return (
    <StyledDialog open={open} onClose={handleClose} fullWidth>
      <Box
        sx={{
          position: "relative",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px 24px 0 0",
          p: 4,
          color: "#fff",
          textAlign: "center",
        }}
      >
        {/* Background Effects */}
        <Box
          sx={{
            position: "absolute",
            top: "-20px",
            right: "20px",
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        />

        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            background: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <ShareIcon sx={{ fontSize: "40px", color: "#fff" }} />
        </Avatar>

        <Typography variant="h4" sx={{ fontWeight: "700", mb: 1 }}>
          שיתוף אלבום
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          הזמן חברים לצפות ולערוך את האלבום שלך
        </Typography>
      </Box>

      <DialogContent sx={{ p: 4, pt: 3 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", mb: 2, color: "#333", display: "flex", alignItems: "center", gap: 1 }}
            >
              <EmailIcon sx={{ color: "#667eea" }} />
              כתובת אימייל
            </Typography>
            <StyledTextField
              label="Email של המשתמש"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", mb: 2, color: "#333", display: "flex", alignItems: "center", gap: 1 }}
            >
              <SecurityIcon sx={{ color: "#667eea" }} />
              הרשאות גישה
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <PermissionChip
                className={permissions === "view" ? "view" : ""}
                label="צפייה בלבד"
                onClick={() => setPermissions("view")}
                variant={permissions === "view" ? "filled" : "outlined"}
                sx={{ flex: 1, cursor: "pointer" }}
              />
          
            </Box>
          </Box>

          {loading && (
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <CircularProgress
                size={40}
                sx={{
                  color: "#667eea",
                  mb: 1,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                משתף את האלבום...
              </Typography>
            </Box>
          )}

          <AnimatePresence>
            {localError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    "& .MuiAlert-icon": {
                      fontSize: "24px",
                    },
                  }}
                >
                  {localError}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Collapse in={!!successMessage}>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                    "& .MuiAlert-icon": {
                      fontSize: "24px",
                    },
                  }}
                >
                  {successMessage}
                </Alert>
              </motion.div>
            )}
          </Collapse>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
        <ActionButton onClick={handleClose} className="secondary" sx={{ flex: 1 }}>
          ביטול
        </ActionButton>
        <ActionButton onClick={handleShare} className="primary" disabled={loading || !email.trim()} sx={{ flex: 1 }}>
          {loading ? "משתף..." : "שתף אלבום"}
        </ActionButton>
      </DialogActions>    
    </StyledDialog>
  )
}

export default SharedAlbumsList
