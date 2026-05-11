"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, Grid, Card, CardMedia, CircularProgress, Container } from "@mui/material"
import { motion } from "framer-motion"
import type { RootState, AppDispatch } from "./store"
import { fetchPhotosByAlbumId, getViewFileUrl } from "../slices/photosSlice"
import type { Photo } from "../models/Photo"

const AlbumView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { albumId } = useParams<{ albumId: string }>()
  const numericAlbumId = albumId ? Number.parseInt(albumId, 10) : null

  const photos = useSelector((state: RootState) => state.photos.photos)
  const [photoUrls, setPhotoUrls] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)

  console.log("albumId:", albumId, "numericAlbumId:", numericAlbumId)

  // Fetch photos for the album
  useEffect(() => {
    if (numericAlbumId !== null) {
      setLoading(true)
      dispatch(fetchPhotosByAlbumId(numericAlbumId))
        .unwrap()
        .then((res) => {
          console.log("Photos fetched:", res)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching photos:", err)
          setLoading(false)
        })
    }
  }, [numericAlbumId, dispatch])

  // Fetch presigned URLs
  useEffect(() => {
    const fetchUrls = async () => {
      const urls: Record<number, string> = {}
      for (const photo of photos) {
        if (photo.fileUrl && photo.id !== undefined) {
          try {
            const url = await dispatch(getViewFileUrl(photo.fileUrl)).unwrap()
            urls[photo.id] = url
            console.log(`URL for photo ${photo.id}:`, url)
          } catch (err) {
            console.error(`Error fetching URL for photo ${photo.id}:`, err)
          }
        }
      }
      setPhotoUrls(urls)
    }

    if (photos.length > 0) {
      fetchUrls()
    } else {
      console.log("No photos in this album yet.")
    }
  }, [photos, dispatch])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress
              size={60}
              sx={{
                color: "#ec4899",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Loading photos...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    )
  }

  if (photos.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "60px 40px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
                marginBottom: 2,
                background: "linear-gradient(45deg, #ec4899, #be123c)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              No photos to display
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1.1rem",
              }}
            >
              This album is currently empty.
            </Typography>
          </Box>
        </motion.div>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(190, 18, 60, 0.4) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ pt: 6, pb: 4 }}>
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <Typography
              variant="h3"
              sx={{
                marginTop:8,
                textAlign: "center",
                fontWeight: 800,
                marginBottom: 6,
                background: "linear-gradient(45deg, #ffffff, #ec4899)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              Photo Gallery
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {photos.map((photo: Photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        background: "rgba(255, 255, 255, 0.15)",
                        "& .photo-overlay": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={photoUrls[photo.id!] || "/abstract-colorful-photo.png"}
                        alt={photo.title}
                        sx={{
                          height: 280,
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      />

                      <Box
                        className="photo-overlay"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                          padding: "20px 16px 16px",
                          opacity: 0,
                          transform: "translateY(20px)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            marginBottom: 1,
                            fontSize: "1.1rem",
                          }}
                        >
                          {photo.title}
                        </Typography>
                        {photo.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.8)",
                              fontSize: "0.9rem",
                              lineHeight: 1.4,
                            }}
                          >
                            {photo.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>  
    </Box>
  )
}

export default AlbumView
