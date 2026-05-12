"use client"

import { Key, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  Button,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import SearchIcon from "@mui/icons-material/Search"
import VisibilityIcon from "@mui/icons-material/Visibility"
import PeopleIcon from "@mui/icons-material/People"
import FilterListIcon from "@mui/icons-material/FilterList"
import RefreshIcon from "@mui/icons-material/Refresh"
import FolderIcon from "@mui/icons-material/Folder"
import { AppDispatch, RootState } from "./store"
import { getSharedAlbums } from "../slices/sharedAlbumsSlice"

const StyledCard = styled(Card)(() => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "20px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    background: "rgba(255, 255, 255, 0.15)",
  },
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

// const AlbumOverlay = styled(Box)(() => ({
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   background: "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.9) 100%)",
//   opacity: 0,
//   transition: "opacity 0.3s ease",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 2,
// }))

// const ActionButton = styled(IconButton)(() => ({
//   background: "rgba(255, 255, 255, 0.9)",
//   backdropFilter: "blur(10px)",
//   color: "#333",
//   width: "48px",
//   height: "48px",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     background: "#fff",
//     transform: "scale(1.1)",
//     boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
//   },
// }))

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

const FilterChip = styled(Chip)(() => ({
  borderRadius: "20px",
  height: "40px",
  fontWeight: "600",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}))


const SharedWithMeAlbums = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const userId = Number(sessionStorage.getItem("userId"))
  const [searchTerm, setSearchTerm] = useState("")

  const { sharedAlbums, loading, error } = useSelector((state: RootState) => state.sharedAlbum)

  useEffect(() => {
    console.log("userId is:", userId)
    if (userId) {
      dispatch(getSharedAlbums(userId))
    } else {
      console.warn("⚠️ userId is not defined – request not sent")
    }
  }, [userId, dispatch])

  const handleAlbumClick = (albumId: number) => {
    navigate(`/album-view/${albumId}`)
  }

  const handleRefresh = () => {
    if (userId) {
      dispatch(getSharedAlbums(userId))
    }
  }

  const filteredAlbums = sharedAlbums.filter((shared: { album: { name: string } }) =>
    shared.album?.name?.toLowerCase().includes(searchTerm.toLowerCase() || ""),
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          pt: 12,
          pb: 4,
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2, color: "#fff" }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: "600" }}>
            Loading shared albums...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          pt: 12,
          pb: 4,
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert
          severity="error"
          sx={{
            borderRadius: "16px",
            maxWidth: "400px",
            "& .MuiAlert-icon": {
              fontSize: "24px",
            },
          }}
        >
          Error: {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
        pt: 12,
        pb: 4,
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #f093fb, #f5576c)",
              mb: 3,
              boxShadow: "0 10px 30px rgba(240, 147, 251, 0.3)",
            }}
          >
            <PeopleIcon sx={{ fontSize: "40px", color: "white" }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              mb: 2,
              textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Shared Albums
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Discover albums that friends have shared with you
          </Typography>
          <Chip
            label={`${filteredAlbums.length} albums`}
            sx={{
              mt: 2,
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontWeight: "bold",
              backdropFilter: "blur(10px)",
            }}
          />
        </Box>
      </motion.div>

      {/* Search and Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <StyledTextField
            placeholder="Search albums..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: "300px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />
          <FilterChip icon={<FilterListIcon />} label="All Albums" variant="outlined" sx={{ borderColor: "#e0e0e0" }} />
          <Badge badgeContent={filteredAlbums.length} color="primary">
            <FilterChip label="Total" variant="filled" color="primary" />
          </Badge>
        </Box>

        <Tooltip title="Refresh">
          <IconButton
            onClick={handleRefresh}
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {filteredAlbums.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 4,
            }}
          >
            <Box
              sx={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                backdropFilter: "blur(10px)",
              }}
            >
              <PeopleIcon sx={{ fontSize: "60px", color: "rgba(255, 255, 255, 0.7)" }} />
            </Box>
            <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: "bold" }}>
              No Shared Albums
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 4 }}>
              {searchTerm ? "No albums found matching your search" : "No albums have been shared with you yet"}
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={4} sx={{ maxWidth: "1400px", mx: "auto" }}>
            {filteredAlbums.map((shared: { id: Key | null | undefined; album: { id: number; name: any } }, index: unknown) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={shared.id}>
                <motion.div variants={itemVariants} custom={index}>
                  <StyledCard onClick={() => shared.album?.id && handleAlbumClick(shared.album.id)}>
                    <CardContent sx={{ p: 3, textAlign: "center", position: "relative" }}>
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "20px",
                            background: "linear-gradient(45deg, #f093fb, #f5576c)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            boxShadow: "0 10px 30px rgba(240, 147, 251, 0.3)",
                            transition: "all 0.3s ease",
                            ".MuiCard-root:hover &": {
                              transform: "scale(1.1) rotate(5deg)",
                            },
                          }}
                        >
                          <FolderIcon sx={{ fontSize: "50px", color: "white" }} />
                        </Box>
                        <Avatar
                          sx={{
                            position: "absolute",
                            bottom: -10,
                            right: -10,
                            width: 30,
                            height: 30,
                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {Math.floor(Math.random() * 50) + 1}
                        </Avatar>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#fff",
                          mb: 3,
                          textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
                        }}
                      >
                        {shared.album?.name || "Untitled"}
                      </Typography>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          color: "#fff",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: "20px",
                          textTransform: "none",
                          "&:hover": {
                            borderColor: "#fff",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        View Album
                      </Button>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </Box>
  )
}

export default SharedWithMeAlbums
