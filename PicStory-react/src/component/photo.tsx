import type React from "react"
// import * as faceapi from "face-api.js"
import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  Button,
  CardContent,
  TextField,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  InputAdornment,
  Chip,
  Backdrop,
  Paper,
  Fab,
  Tooltip,
  Badge,
  Avatar,
  Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import SearchIcon from "@mui/icons-material/Search"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import CloseIcon from "@mui/icons-material/Close"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import AddIcon from "@mui/icons-material/Add"
import FilterListIcon from "@mui/icons-material/FilterList"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import ViewComfyIcon from "@mui/icons-material/ViewComfy"
import GridViewIcon from "@mui/icons-material/GridView"
import { useDispatch, useSelector } from "react-redux"
import type { Photo } from "../models/Photo"
import type { AlbumDTO } from "../models/AlbumDTO"
import type { AppDispatch, RootState } from "./store"
import { useParams } from "react-router-dom"
import {
  fetchPhotosByAlbumId,
  getPresignedUrl,
  uploadToS3,
  savePhoto,
  getViewFileUrl,
  deletePhoto,
  updatePhoto,
} from "../slices/photosSlice"
import type { PhotoPostModels } from "../models/PotoPostModels"
import { fetchAlbumById } from "../slices/albumSlice"

const StyledCard = styled(Card)(() => ({
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  borderRadius: "16px",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    "& .photo-overlay": {
      opacity: 1,
    },
    "& .photo-image": {
      transform: "scale(1.05)",
    },
  },
}))

const PhotoOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
}))

const ActionButton = styled(IconButton)(() => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  color: "#333",
  width: "48px",
  height: "48px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#fff",
    transform: "scale(1.1)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
  },
}))

const UploadZone = styled(Box)(() => ({
  border: "2px dashed #e0e0e0",
  borderRadius: "16px",
  padding: "40px",
  textAlign: "center",
  background: "linear-gradient(145deg, #fafafa 0%, #ffffff 100%)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#2196f3",
    background: "linear-gradient(145deg, #f3f8ff 0%, #ffffff 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(33, 150, 243, 0.1)",
  },
  "&.dragover": {
    borderColor: "#2196f3",
    background: "linear-gradient(145deg, #e3f2fd 0%, #ffffff 100%)",
    transform: "scale(1.02)",
  },
}))

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "#e0e0e0",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#2196f3",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2196f3",
      boxShadow: "0 0 0 3px rgba(33, 150, 243, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: "500",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2196f3",
  },
}))

const FilterChip = styled(Chip)(() => ({
  borderRadius: "20px",
  height: "36px",
  fontWeight: "600",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}))

const ViewModeButton = styled(IconButton)(() => ({
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#f5f5f5",
    transform: "scale(1.05)",
  },
  "&.active": {
    background: "#2196f3",
    color: "#fff",
    "&:hover": {
      background: "#1976d2",
    },
  },
}))

function PhotosGallery(){
  const dispatch = useDispatch<AppDispatch>()
  const { albumId } = useParams<{ albumId: string }>()
  const numericAlbumId = albumId ? Number.parseInt(albumId, 10) : null
  const photos = useSelector((state: RootState) => state.photos.photos)
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [photoTitle, setPhotoTitle] = useState("")
  const [photoDescription, setPhotoDescription] = useState("")
  const [photoUrls, setPhotoUrls] = useState<Record<number, string>>({})
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "masonry" | "list">("grid")
  const [showUploadForm, setShowUploadForm] = useState(false)
  
  useEffect(() => {
    if (numericAlbumId !== null) {
      dispatch(fetchAlbumById(numericAlbumId))
        .unwrap()
        .then((album: AlbumDTO) => setSelectedAlbum(album))
        .catch((error) => console.error("Error fetching album:", error))

      dispatch(fetchPhotosByAlbumId(numericAlbumId)).catch((err) => console.error("שגיאה בטעינת תמונות לאלבום:", err))
    }
  }, [numericAlbumId, dispatch])

  useEffect(() => {
    const fetchUrls = async () => {
      const urls: Record<number, string> = {}
      const promises = photos.map(async (photo) => {
        if (photo.fileUrl) {
          try {
            const url = await dispatch(getViewFileUrl(photo.fileUrl)).unwrap()
            if (photo.id !== undefined) {
              urls[photo.id] = url
            }
          } catch (err) {
            console.error(`❌ שגיאה בטעינת URL לתמונה ID: ${photo.id}, File: ${photo.fileUrl}`, err)
          }
        }
      })

      await Promise.all(promises)
      setPhotoUrls(urls)
    }

    if (photos.length > 0) {
      fetchUrls()
    }
  }, [photos, dispatch])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setImageFile(files[0])
      setShowUploadForm(true)
    }
  }, [])

  const handleDelete = async (photoId: number) => {
    try {
      await dispatch(deletePhoto(photoId)).unwrap()
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  const handleImageUpload = async () => {
    const storedUserId = sessionStorage.getItem("userId")
    const userId = storedUserId ? Number.parseInt(storedUserId, 10) : null

    if (imageFile && numericAlbumId !== null && userId !== null) {
      const trimmedTitle = photoTitle.trim()
      const trimmedDescription = photoDescription.trim()

      if (!trimmedTitle ) {
        console.warn("Title or description is empty after trimming")
        return
      }

      try {
        setLoading(true)
        setUploadProgress(0)

        const presignedUrl = await dispatch(
          getPresignedUrl({
            fileName: imageFile.name,
            contentType: imageFile.type,
          }),
        ).unwrap()

        setUploadProgress(30)

        const uploadedImageUrl = await dispatch(
          uploadToS3({
            file: imageFile,
            uploadUrl: presignedUrl,
          }),
        ).unwrap()

        setUploadProgress(70)

        const s3Key = decodeURIComponent(uploadedImageUrl.split("/").pop()!)

        const newPhoto: PhotoPostModels = {
          title: trimmedTitle,
          fileUrl: s3Key,
          albumId: numericAlbumId,
          userId: userId,
          description: trimmedDescription,
        }

        await dispatch(savePhoto(newPhoto)).unwrap()
        await dispatch(fetchPhotosByAlbumId(numericAlbumId))

        setUploadProgress(100)
        setTimeout(() => {
          setImageFile(null)
          setPhotoTitle("")
          setPhotoDescription("")
          setLoading(false)
          setUploadProgress(0)
          setShowUploadForm(false)
        }, 1000)
      } catch (error) {
        console.error("Error uploading image:", error)
        setLoading(false)
        setUploadProgress(0)
      }
    }
  }

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo)
    setEditTitle(photo.title)
    setEditDescription(photo.description)
  }

  const handleUpdatePhoto = async () => {
    if (!editingPhoto) return
    const updated = {
      ...editingPhoto,
      title: editTitle,
      description: editDescription,
    }
    await dispatch(updatePhoto(updated)).unwrap()
    await dispatch(fetchPhotosByAlbumId(numericAlbumId!))
    setEditingPhoto(null)
  }

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
  }

  const filteredPhotos = photos.filter((photo) => photo?.title?.toLowerCase().includes(searchTerm?.toLowerCase() || ""))

  const getGridSize = () => {
    switch (viewMode) {
      case "grid":
        return { xs: 12, sm: 6, md: 4, lg: 3 }
      case "masonry":
        return { xs: 12, sm: 6, md: 4, lg: 3 }
      case "list":
        return { xs: 12 }
      default:
        return { xs: 12, sm: 6, md: 4, lg: 3 }
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
        pt: 12,
        pb: 4,
        px: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
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
      {selectedAlbum && (
        <>
          {/* Top Controls */}
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
            {/* Search and Filters */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
              <StyledTextField
                placeholder="Search photos..."
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
              <FilterChip
                icon={<FilterListIcon />}
                label="All Photos"
                variant="outlined"
                sx={{ borderColor: "#e0e0e0" }}
              />
              <Badge badgeContent={filteredPhotos.length} color="primary">
                <FilterChip label="Total" variant="filled" color="primary" />
              </Badge>
            </Box>

            {/* View Mode Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Grid View">
                <ViewModeButton className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
                  <GridViewIcon />
                </ViewModeButton>
              </Tooltip>
              <Tooltip title="Masonry View">
                <ViewModeButton
                  className={viewMode === "masonry" ? "active" : ""}
                  onClick={() => setViewMode("masonry")}
                >
                  <ViewModuleIcon />
                </ViewModeButton>
              </Tooltip>
              <Tooltip title="List View">
                <ViewModeButton className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
                  <ViewComfyIcon />
                </ViewModeButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Upload Section */}
          <AnimatePresence>
            {showUploadForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: "16px",
                    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "600", color: "#333" }}>
                      📸 Upload New Photo
                    </Typography>
                    <IconButton onClick={() => setShowUploadForm(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <UploadZone
                        className={dragOver ? "dragover" : ""}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("file-input")?.click()}
                      >
                        <input
                          id="file-input"
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                        <CloudUploadIcon sx={{ fontSize: "48px", color: "#2196f3", mb: 2 }} />
                        <Typography variant="h6" sx={{ color: "#333", mb: 1, fontWeight: "600" }}>
                          {imageFile ? imageFile.name : "Drop your photo here"}
                        </Typography>
                        <Typography sx={{ color: "#666" }}>or click to browse</Typography>
                      </UploadZone>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
                        <StyledTextField
                          label="Photo Title"
                          fullWidth
                          value={photoTitle}
                          onChange={(e) => setPhotoTitle(e.target.value)}
                        />                    

                        {loading && (
                          <Box sx={{ textAlign: "center" }}>
                            <CircularProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              Uploading... {uploadProgress}%
                            </Typography>
                          </Box>
                        )}

                        <Button
                          variant="contained"
                          onClick={handleImageUpload}
                          disabled={!photoTitle.trim()  || loading || !imageFile}
                          sx={{
                            borderRadius: "12px",
                            py: 1.5,
                            fontWeight: "600",
                            textTransform: "none",
                            background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                            },
                          }}
                        >
                          {loading ? "Uploading..." : "Upload Photo"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Photos Grid */}
          {loading && !imageFile ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <Box textAlign="center">
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Loading photos...
                </Typography>
              </Box>
            </Box>
          ) : filteredPhotos.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 3,
                  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  color: "#2196f3",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: "40px" }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "600", mb: 2, color: "#333" }}>
                No Photos Yet
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                {searchTerm ? "No photos match your search" : "Start building your collection"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowUploadForm(true)}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  fontWeight: "600",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                }}
              >
                Upload First Photo
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredPhotos.map((photo, index) => (
                <Grid item {...getGridSize()} key={photo.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StyledCard>
                      <Box sx={{ position: "relative", height: viewMode === "list" ? 200 : 280 }}>
                        <CardMedia
                          component="img"
                          image={photoUrls[photo.id!] || ""}
                          alt={photo.title}
                          className="photo-image"
                          sx={{
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                        />

                        <PhotoOverlay className="photo-overlay">
                          <ActionButton onClick={() => openLightbox(index)}>
                            <FullscreenIcon />
                          </ActionButton>
                          <ActionButton onClick={() => handleEdit(photo)}>
                            <EditIcon />
                          </ActionButton>
                          <ActionButton onClick={() => handleDelete(photo.id!)}>
                            <DeleteIcon />
                          </ActionButton>
                        </PhotoOverlay>
                      
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "600",
                            color: "#333",
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {photo.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {photo.description}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Floating Add Button */}
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => setShowUploadForm(true)}
          >
            <AddIcon />
          </Fab>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && filteredPhotos[currentPhotoIndex] && (
              <Backdrop open={lightboxOpen} sx={{ zIndex: 2000, background: "rgba(0, 0, 0, 0.95)" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "90vw",
                    height: "90vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    src={photoUrls[filteredPhotos[currentPhotoIndex].id!] || ""}
                    alt={filteredPhotos[currentPhotoIndex].title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />

                  {/* Close Button */}
                  <IconButton
                    onClick={closeLightbox}
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      color: "#fff",
                      background: "rgba(0, 0, 0, 0.5)",
                      "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  {/* Navigation */}
                  {filteredPhotos.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevPhoto}
                        sx={{
                          position: "absolute",
                          left: 20,
                          color: "#fff",
                          background: "rgba(0, 0, 0, 0.5)",
                          "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                        }}
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                      <IconButton
                        onClick={nextPhoto}
                        sx={{
                          position: "absolute",
                          right: 20,
                          color: "#fff",
                          background: "rgba(0, 0, 0, 0.5)",
                          "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </>
                  )}

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      right: 20,
                      background: "rgba(0, 0, 0, 0.7)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                      p: 3,
                      color: "#fff",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                      {filteredPhotos[currentPhotoIndex].title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      {filteredPhotos[currentPhotoIndex].description}
                    </Typography>
                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {currentPhotoIndex + 1} of {filteredPhotos.length}
                    </Typography>
                  </Box>
                </Box>
              </Backdrop>
            )}
          </AnimatePresence>

          {/* Edit Dialog */}
          <Dialog
            open={!!editingPhoto}
            onClose={() => setEditingPhoto(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "16px",
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "600", color: "#333", fontSize: "20px" }}>✏️ Edit Photo</DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
              <StyledTextField
                fullWidth
                margin="dense"
                label="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                sx={{ mb: 3 }}
              />
              
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button
                onClick={() => setEditingPhoto(null)}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  color: "#666",
                  borderColor: "#e0e0e0",
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePhoto}
                variant="contained"
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                  },
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
     
    </Box>
  )
}

 export default PhotosGallery
