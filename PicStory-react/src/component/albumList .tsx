"use client"
import { useDispatch, useSelector } from "react-redux"
import {
    Button,
    Typography,
    Grid,
    IconButton,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Fab,
    Chip,
    Avatar,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import FolderIcon from "@mui/icons-material/Folder"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AddIcon from "@mui/icons-material/Add"
import type { AppDispatch, RootState } from "./store"
import { useEffect, useState } from "react"
import type { AlbumDTO } from "../models/AlbumDTO"
import { useNavigate } from "react-router-dom"
import ShareIcon from "@mui/icons-material/Share"
import { createAlbumAsync, deleteAlbumAsync, getAlbums, setAlbums, updateAlbumAsync } from "../slices/albumSlice"
// import ShareAlbumDialog from "./ShareAlbumDialog"

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

const StyledDialog = styled(Dialog)(() => ({
    "& .MuiDialog-paper": {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        color: "#fff",
    },
}))

const StyledTextField = styled(TextField)(() => ({
    "& .MuiInputLabel-root": {
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "500",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderWidth: "2px",
        },
        "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.5)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#fff",
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
        },
    },
    "& .MuiInputBase-input": {
        color: "#fff",
        fontWeight: "500",
    },
}))

const StyledFab = styled(Fab)(() => ({
    position: "fixed",
    bottom: "30px",
    right: "30px",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    color: "white",
    width: "70px",
    height: "70px",
    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
    zIndex: 1000,
    "&:hover": {
        background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
        transform: "scale(1.1)",
        boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
    },
}))

const ActionButton = styled(IconButton)(() => ({
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    margin: "4px",
    transition: "all 0.3s ease",
    "&:hover": {
        background: "rgba(255, 255, 255, 0.3)",
        transform: "scale(1.1)",
    },
}))

const AlbumList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { albums, loading } = useSelector((state: RootState) => state.album)

    const storedUserId = sessionStorage.getItem("userId")
    const userId = storedUserId ? Number.parseInt(storedUserId, 10) : null
    const navigate = useNavigate()
    const userAlbums = albums.filter((album) => album.userId === userId)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [newAlbum, setNewAlbum] = useState({ userId: userId || 0, name: "", description: "" })
    const [editingAlbum, setEditingAlbum] = useState<{
        id: number
        userId: number
        name: string
        description: string
    } | null>(null)
    const [albumToDelete, setAlbumToDelete] = useState<{ id: number; name: string } | null>(null)

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning">("success")
   

    useEffect(() => {
        if (userId && albums.length === 0) {
            dispatch(getAlbums())
        }
    }, [dispatch, albums.length, userId])

    const showSnackbar = (message: string, severity: "success" | "error" | "warning" = "success") => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setSnackbarOpen(true)
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false)
    }

    const handleAddAlbum = async () => {
        try {
            if (!newAlbum.name) {
                showSnackbar("Please provide both name and description.", "warning")
                return
            }

            await dispatch(createAlbumAsync(newAlbum))
            dispatch(getAlbums())
            setOpenDialog(false)
            setNewAlbum({ userId: userId || 0, name: "", description: "" })
            showSnackbar("Album created successfully! 🎉", "success")
        } catch (error) {
            showSnackbar("Failed to create album. Please try again.", "error")
        }
    }

    const handleDeleteAlbum = () => {
        if (albumToDelete) {
            setOpenDeleteDialog(false)

            dispatch(deleteAlbumAsync(albumToDelete.id))
                .then(() => {
                    const updatedAlbums = userAlbums.filter((album) => album.id !== albumToDelete.id)
                    dispatch(setAlbums(updatedAlbums))
                    showSnackbar("Album deleted successfully.", "success")
                })
                .catch((error) => {
                    showSnackbar(`Error deleting album: ${error.message}`, "error")
                })
        }
    }

    const handleUpdateAlbum = () => {
        if (editingAlbum) {
            dispatch(updateAlbumAsync({ Id: editingAlbum.id, album: editingAlbum })).then(() => {
                const updatedAlbums = userAlbums.map((album) =>
                    album.id === editingAlbum.id ? { ...album, ...editingAlbum } : album,
                )
                dispatch(setAlbums(updatedAlbums))
                showSnackbar("Album updated successfully! ✨", "success")
            })
            setOpenDialog(false)
            setEditingAlbum(null)
        }
    }

    const openDeleteConfirmDialog = (album: AlbumDTO) => {
        setAlbumToDelete(album)
        setOpenDeleteDialog(true)
    }

    const handleShareAlbum = (album: AlbumDTO) => {
        navigate(`/share-album/${album.id}`);
    };

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

            {/* Header Section */}
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
                        <PhotoLibraryIcon sx={{ fontSize: "40px", color: "white" }} />
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
                        My Photo Albums
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            maxWidth: "600px",
                            mx: "auto",
                        }}
                    >
                        Organize your precious memories in beautiful collections
                    </Typography>
                    <Chip
                        label={`${userAlbums.length} Albums`}
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

            {/* Albums Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Box textAlign="center">
                        <CircularProgress
                            size={60}
                            sx={{
                                color: "#fff",
                                mb: 2,
                            }}
                        />
                        <Typography variant="h6" sx={{ color: "#fff" }}>
                            Loading your albums...
                        </Typography>
                    </Box>
                </Box>
            ) : userAlbums.length === 0 ? (
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
                            <PhotoLibraryIcon sx={{ fontSize: "60px", color: "rgba(255, 255, 255, 0.7)" }} />
                        </Box>
                        <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontWeight: "bold" }}>
                            No Albums Yet
                        </Typography>
                        <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 4 }}>
                            Create your first album to start organizing your photos
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditingAlbum(null)
                                setNewAlbum({ userId: userId || 0, name: "", description: "" })
                                setOpenDialog(true)
                            }}
                            sx={{
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                color: "white",
                                px: 4,
                                py: 2,
                                borderRadius: "50px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                                "&:hover": {
                                    background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                                },
                            }}
                        >
                            Create First Album
                        </Button>
                    </Box>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={4} sx={{ maxWidth: "1400px", mx: "auto" }}>
                        {userAlbums.map((album, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
                                <motion.div variants={itemVariants} custom={index}>
                                    <StyledCard onClick={() => navigate(`/${album.id}`)}>
                                        <CardContent sx={{ p: 3, textAlign: "center", position: "relative" }}>
                                            {/* Action Buttons */}
                                            <Box
                                                className="actions"
                                                sx={{
                                                    position: "absolute",
                                                    top: 15,
                                                    right: 15,
                                                    opacity: 0,
                                                    transition: "opacity 0.3s ease",
                                                    ".MuiCard-root:hover &": {
                                                        opacity: 1,
                                                    },
                                                }}
                                            >
                                                <ActionButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleShareAlbum(album)
                                                    }}
                                                >
                                                    <ShareIcon fontSize="small" />
                                                </ActionButton>
                                                <ActionButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingAlbum(album)
                                                        setOpenDialog(true)
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </ActionButton>
                                                <ActionButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openDeleteConfirmDialog(album)
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </ActionButton>
                                            </Box>

                                            {/* Album Icon */}
                                            <Box
                                                sx={{
                                                    marginTop: 5,
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

                                            {/* Album Info */}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#fff",
                                                    mb: 1,
                                                    textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
                                                }}
                                            >
                                                {album.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "rgba(255, 255, 255, 0.8)",
                                                    mb: 3,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {album.description}
                                            </Typography>

                                            {/* View Button */}
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

            {/* Floating Add Button */}
            <AnimatePresence>
                {userAlbums.length > 0 && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <StyledFab
                            onClick={() => {
                                setEditingAlbum(null)
                                setNewAlbum({ userId: userId || 0, name: "", description: "" })
                                setOpenDialog(true)
                            }}
                        >
                            <AddIcon sx={{ fontSize: "30px" }} />
                        </StyledFab>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Album Dialog */}
            {/* {selectedAlbumForShare && (
        <ShareAlbumDialog
          open={openShareDialog}
          onClose={() => {
            setOpenShareDialog(false)
            setSelectedAlbumForShare(null)
          }}
          albumId={selectedAlbumForShare.id}
          albumName={selectedAlbumForShare.name}
        />
      )} */}

            {/* Add/Edit Dialog */}
            <StyledDialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "24px",
                        pb: 1,
                    }}
                >
                    {editingAlbum ? "✨ Update Album" : "🎨 Create New Album"}
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>
                    <StyledTextField
                        label="Album Name"
                        value={editingAlbum ? editingAlbum.name : newAlbum.name}
                        onChange={(e) => {
                            if (editingAlbum) {
                                setEditingAlbum({ ...editingAlbum, name: e.target.value })
                            } else {
                                setNewAlbum({ ...newAlbum, name: e.target.value })
                            }
                        }}
                        fullWidth
                        sx={{ mb: 3, mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            borderRadius: "25px",
                            px: 3,
                            "&:hover": {
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={editingAlbum ? handleUpdateAlbum : handleAddAlbum}
                        variant="contained"
                        sx={{
                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                            borderRadius: "25px",
                            px: 4,
                            fontWeight: "bold",
                            "&:hover": {
                                background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        {editingAlbum ? "Update Album" : "Create Album"}
                    </Button>
                </DialogActions>
            </StyledDialog>

            {/* Delete Confirmation Dialog */}
            <StyledDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm">
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    🗑️ Delete Album
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px" }}>
                        Are you sure you want to delete the album
                        <Box component="span" sx={{ fontWeight: "bold", color: "#f093fb", mx: 1 }}>
                            "{albumToDelete?.name}"
                        </Box>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        variant="outlined"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            borderRadius: "25px",
                            px: 3,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAlbum}
                        variant="contained"
                        sx={{
                            background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                            borderRadius: "25px",
                            px: 4,
                            fontWeight: "bold",
                            "&:hover": {
                                background: "linear-gradient(45deg, #ff5252, #d32f2f)",
                            },
                        }}
                    >
                        Delete Album
                    </Button>
                </DialogActions>
            </StyledDialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                        borderRadius: "15px",
                        fontWeight: "500",
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>


        </Box>
    )
}

export default AlbumList