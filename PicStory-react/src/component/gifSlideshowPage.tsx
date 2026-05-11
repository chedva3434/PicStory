"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPhotosByUserId, getViewFileUrl } from "../slices/photosSlice"
import type { AppDispatch, RootState } from "./store"
import {
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Button,
  Paper,
  Fab,
  Tooltip,
  Badge,
  Avatar,
  Chip,
  Backdrop,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import PreviewIcon from "@mui/icons-material/Preview"
import DownloadIcon from "@mui/icons-material/Download"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"

const StyledImage = styled("img")<{ selected: boolean }>(({ selected }) => ({
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "12px",
  boxShadow: selected ? "0 8px 20px rgba(33, 150, 243, 0.6)" : "0 4px 12px rgba(0,0,0,0.1)",
  transform: selected ? "scale(1.02)" : "scale(1)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  border: selected ? "3px solid #2196f3" : "3px solid transparent",
}))

const SelectionBadge = styled(Box)(() => ({
  position: "absolute",
  top: 8,
  right: 8,
  background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "600",
  fontSize: "14px",
  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.4)",
  transform: "scale(0)",
  transition: "transform 0.3s ease",
  "&.selected": {
    transform: "scale(1)",
  },
}))

const DragCard = styled(Paper)(() => ({
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  borderRadius: "12px",
  padding: "8px",
  cursor: "grab",
  transition: "all 0.3s ease",
  border: "2px solid transparent",
  "&:hover": {
    borderColor: "#2196f3",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(33, 150, 243, 0.2)",
  },
  "&:active": {
    cursor: "grabbing",
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

function GifSlideshowPage() {
  const dispatch = useDispatch<AppDispatch>()
  const reduxUserId = useSelector((state: RootState) => state.user?.userId)
  const { photos } = useSelector((state: RootState) => state.photos)

  const [userId, setUserId] = useState<number | null>(null)
  const [photoUrls, setPhotoUrls] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<number[]>([])
  const [collagePreviewUrl, setCollagePreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // הגדרת userId
  useEffect(() => {
    if (reduxUserId) setUserId(reduxUserId)
    else {
      const storedId = sessionStorage.getItem("userId")
      if (storedId) setUserId(Number(storedId))
    }
  }, [reduxUserId])

  // טוען תמונות
  useEffect(() => {
    if (!userId) return
    setLoading(true)
    dispatch(fetchPhotosByUserId(userId))
      .unwrap()
      .then((res) => {
        console.log("Photos fetched:", res)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching photos:", err)
        setLoading(false)
      })
  }, [dispatch, userId])

  // טוען URL לכל תמונה
  useEffect(() => {
    photos.forEach(async (photo) => {
      if (!photoUrls[photo.id] && photo.fileUrl) {
        try {
          const res: any = await dispatch(getViewFileUrl(photo.fileUrl)).unwrap()
          const url = res?.url || res
          if (url) setPhotoUrls((prev) => ({ ...prev, [photo.id]: url }))
        } catch (err) {
          console.error("Error loading photo URL", err)
        }
      }
    })
  }, [photos, dispatch])

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(selected)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)
    setSelected(items)
  }

  const generatePreview = async () => {
    if (selected.length === 0) return
    setLoading(true)
    try {
      const imageUrls = selected.map((id) => photoUrls[id])
      const response = await fetch("https://localhost:7213/api/UploadFile/collage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageUrls),
      })

      if (!response.ok) throw new Error("שגיאה ביצירת קולאז׳")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setCollagePreviewUrl(url)
      setPreviewOpen(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadCollage = async () => {
    if (!collagePreviewUrl) return
    const link = document.createElement("a")
    link.download = "collage.png"
    link.href = collagePreviewUrl
    link.click()
  }

  if (!userId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#fff" }} />
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          pt: 12,
          pb: 4,
          px: { xs: 2, md: 4 },
          position: "relative",
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

        <Box sx={{ textAlign: "center", mb: 6 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "700",
                color: "#fff",
                mb: 2,
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              🎨 Create Amazing Collages
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Select at least 2 photos to create a beautiful collage
            </Typography>
          </motion.div>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Badge badgeContent={photos.length} color="primary">
            <FilterChip
              icon={<PhotoLibraryIcon />}
              label="Total Photos"
              variant="filled"
              sx={{ background: "rgba(255, 255, 255, 0.9)", color: "#333" }}
            />
          </Badge>
          <Badge badgeContent={selected.length} color="secondary">
            <FilterChip icon={<CheckCircleIcon />} label="Selected" variant="filled" color="secondary" />
          </Badge>
        </Box>

        {loading && photos.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Box textAlign="center">
              <CircularProgress size={60} sx={{ mb: 2, color: "#fff" }} />
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Loading photos...
              </Typography>
            </Box>
          </Box>
        ) : photos.length === 0 ? (
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
              No Photos Available
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              Upload some photos first to create collages
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {photos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ position: "relative" }}>
                    {photoUrls[photo.id] ? (
                      <StyledImage
                        src={photoUrls[photo.id]}
                        alt={photo.title || ""}
                        selected={selected.includes(photo.id)}
                        onClick={() => toggleSelect(photo.id)}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: "200px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <CircularProgress sx={{ color: "#fff" }} />
                      </Box>
                    )}

                    <SelectionBadge className={selected.includes(photo.id) ? "selected" : ""}>
                      {selected.indexOf(photo.id) + 1 || <CheckCircleIcon fontSize="small" />}
                    </SelectionBadge>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  mt: 4,
                  p: 4,
                  borderRadius: "16px",
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "600", color: "#333", mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DragIndicatorIcon /> Arrange Selected Photos ({selected.length})
                </Typography>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="selectedPhotos" direction="horizontal">
                    {(provided) => (
                      <Box
                        display="flex"
                        gap={2}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          overflowX: "auto",
                          py: 2,
                          "&::-webkit-scrollbar": {
                            height: "8px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#c1c1c1",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        {selected.map((id, index) => (
                          <Draggable key={id} draggableId={id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <DragCard
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  minWidth: 120,
                                  flexShrink: 0,
                                  transform: snapshot.isDragging ? "rotate(5deg)" : "none",
                                  zIndex: snapshot.isDragging ? 1000 : 1,
                                }}
                              >
                                <Box sx={{ position: "relative" }}>
                                  <img
                                    src={photoUrls[id] || "/placeholder.svg"}
                                    alt=""
                                    style={{
                                      width: "100%",
                                      height: "80px",
                                      borderRadius: "8px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 4,
                                      left: 4,
                                      background: "#2196f3",
                                      color: "#fff",
                                      borderRadius: "50%",
                                      width: "20px",
                                      height: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {index + 1}
                                  </Box>
                                </Box>
                              </DragCard>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Floating Action Buttons - Outside the main Box to fix position:fixed issue */}
      {selected.length >= 2 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 1500,
          }}
        >
          <Tooltip title="Generate Preview" placement="left">
            <Fab
              color="primary"
              onClick={generatePreview}
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : <PreviewIcon />}
            </Fab>
          </Tooltip>

          {collagePreviewUrl && (
            <Tooltip title="Download Collage" placement="left">
              <Fab
                color="secondary"
                onClick={downloadCollage}
                sx={{
                  background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <DownloadIcon />
              </Fab>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewOpen && collagePreviewUrl && (
          <Backdrop open={previewOpen} sx={{ zIndex: 2000, background: "rgba(0, 0, 0, 0.95)" }}>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              >
                <img
                  src={collagePreviewUrl || "/placeholder.svg"}
                  alt="Collage Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "16px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </motion.div>

              <IconButton
                onClick={() => setPreviewOpen(false)}
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

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={downloadCollage}
                  sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                    },
                  }}
                >
                  Download Collage
                </Button>
              </Box>
            </Box>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  )
}
export default GifSlideshowPage
