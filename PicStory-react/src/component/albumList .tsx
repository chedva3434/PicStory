import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent, Typography, Grid, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, CircularProgress } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { setAlbums, getAlbums, createAlbumAsync, updateAlbumAsync, deleteAlbumAsync } from "../slices/albumSlice";
import { AppDispatch, RootState } from "./store";
import { useEffect, useState } from "react";
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { AlbumDTO } from "../models/AlbumDTO";

const AlbumList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { albums, loading } = useSelector((state: RootState) => state.album);

    // מקבל את ה- userId מה- sessionStorage
    
    const storedUserId = sessionStorage.getItem("userId");
    const userId = storedUserId ? parseInt(storedUserId, 10) : null;

    // סינון האלבומים כך שיציגו רק את אלו של המשתמש המחובר
    const userAlbums = albums.filter(album => album.userId === userId);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newAlbum, setNewAlbum] = useState({ userId: userId || 0, name: "", description: "" });
    const [editingAlbum, setEditingAlbum] = useState<{ id: number; userId: number; name: string; description: string } | null>(null);
    const [albumToDelete, setAlbumToDelete] = useState<{ id: number, name: string } | null>(null);

    useEffect(() => {
        if (userId && albums.length === 0) {
            dispatch(getAlbums());
        }
    }, [dispatch, albums.length, userId]);

    const handleAddAlbum = () => {
        dispatch(createAlbumAsync(newAlbum)).then((action) => {
            if (createAlbumAsync.fulfilled.match(action)) {
                // הודעה לקונסול לצורך דיבוג
                console.log('Album added:', action.payload);
                
                // עדכון הסטור בצורה נכונה על ידי קריאה מחדש לכל האלבומים
                dispatch(getAlbums());  // בקשה לעדכון כל האלבומים מהשרת או הסטור
                setOpenDialog(false);
                setNewAlbum({ userId: storedUserId ? parseInt(storedUserId) : 0, name: "", description: "" });
            }
        });
    };     
    

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteAlbum = () => {
        if (albumToDelete) {
            setOpenDeleteDialog(false); // סוגר את החלונית מיד
    
            dispatch(deleteAlbumAsync(albumToDelete.id)).then(() => {
                const updatedAlbums = userAlbums.filter((album) => album.id !== albumToDelete.id);
                dispatch(setAlbums(updatedAlbums));
                // alert(`The album "${albumToDelete.name}" has been deleted successfully.`);
            }).catch((error) => {
                alert(`Error deleting album: ${error.message}`);
            });
        }
    };
    

    const handleUpdateAlbum = () => {
        if (editingAlbum) {
            dispatch(updateAlbumAsync({ Id: editingAlbum.id, album: editingAlbum })).then(() => {
                const updatedAlbums = userAlbums.map((album) =>
                    album.id === editingAlbum.id ? { ...album, ...editingAlbum } : album
                );
                dispatch(setAlbums(updatedAlbums));
            });
            setOpenDialog(false);
            setEditingAlbum(null);
        }
    };

    const openDeleteConfirmDialog = (album:AlbumDTO ) => {
        setAlbumToDelete(album);
        setOpenDeleteDialog(true);
        console.log('Delete Dialog Opened:', album);
    };


    return (
        <div>
            <Button
                variant="contained"
                startIcon={<AddBoxIcon />}
                onClick={() => {
                    setEditingAlbum(null);
                    setNewAlbum({ userId: userId || 0, name: "", description: "" });
                    setOpenDialog(true);
                }}
                sx={{
                    marginBottom: 2,
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: "#ea5674",
                    zIndex: 3000,
                    "&:hover": { backgroundColor: "#c04a5e" }
                }}
            >
                Add Album
            </Button>

            <Grid container spacing={1} sx={{ marginTop: 8, marginLeft: 8, columnGap: '0.5rem' }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" width="100%">
                        <CircularProgress />
                    </Box>
                ) : userAlbums.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%" sx={{ mt: 4 }}>
                        <FolderOffIcon sx={{ fontSize: 60, color: "gray" }} />
                        <Typography variant="h6" color="textSecondary">
                            No albums found
                        </Typography>
                    </Box>
                ) : (
                    userAlbums.map((album, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album.id || index}>
                            <Card sx={{
                                maxWidth: 220,
                                marginBottom: 0.5,
                                border: `2px solid #ea5674`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#ea5674" }}>
                                        Album Name: <br /> {album.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ marginTop: 1, fontWeight: 'bold', color: "#ea5674" }}>
                                        Description:<br /> {album.description}
                                    </Typography>

                                    <div>
                                        <IconButton
                                            onClick={() => {
                                                setEditingAlbum({
                                                    id: album.id,
                                                    userId: album.userId,
                                                    name: album.name,
                                                    description: album.description,
                                                });
                                                setOpenDialog(true);
                                            }}
                                        >
                                            <EditIcon sx={{ color: "#ea5674" }} />
                                        </IconButton>

                                        <IconButton onClick={() => openDeleteConfirmDialog(album)}>
                                            <DeleteIcon sx={{ color: "#ea5674" }} />
                                        </IconButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Dialog for Adding/Updating Album */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle sx={{ textAlign: 'center', color: "#ea5674", fontWeight: 'bold' }}>
                    {editingAlbum ? "Update Album" : "Add New Album"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Album Name"
                        value={editingAlbum ? editingAlbum.name : newAlbum.name}
                        onChange={(e) => {
                            if (editingAlbum) {
                                setEditingAlbum({ ...editingAlbum, name: e.target.value });
                            } else {
                                setNewAlbum({ ...newAlbum, name: e.target.value });
                            }
                        }}
                        fullWidth
                        sx={{
                            marginBottom: 3,
                            marginTop: 2,
                            fontWeight: 'bold',
                            '& .MuiInputLabel-root': {
                                color: "#757575", // צבע אפור ברירת מחדל ללייבל
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: "#757575", // צבע אפור גם כשהשדה בפוקוס
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: "#ed5f79", // צבע המסגרת הרגילה
                                },
                                '&:hover fieldset': {
                                    borderColor: "#ed5f79", // צבע בהובר
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: "#ed5f79", // צבע המסגרת כשהשדה בפוקוס
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: "#000", // טקסט שחור רגיל
                                backgroundColor: 'white', // רקע לבן קבוע
                            },
                        }}
                    />
                    <TextField
                        label="Description"
                        value={editingAlbum ? editingAlbum.description : newAlbum.description}
                        onChange={(e) => {
                            if (editingAlbum) {
                                setEditingAlbum({ ...editingAlbum, description: e.target.value });
                            } else {
                                setNewAlbum({ ...newAlbum, description: e.target.value });
                            }
                        }}
                        fullWidth
                        sx={{
                            marginBottom: 3,
                            marginTop: 2,
                            fontWeight: 'bold',
                            '& .MuiInputLabel-root': {
                                color: "#757575", // צבע אפור ברירת מחדל ללייבל
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: "#757575", // צבע אפור גם כשהשדה בפוקוס
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: "#ed5f79", // צבע המסגרת הרגילה
                                },
                                '&:hover fieldset': {
                                    borderColor: "#ed5f79", // צבע בהובר
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: "#ed5f79", // צבע המסגרת כשהשדה בפוקוס
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: "#000", // טקסט שחור רגיל
                                backgroundColor: 'white', // רקע לבן קבוע
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: "#ea5674", '&:hover': { backgroundColor: "#c04a5e" } }}>
                        Cancel
                    </Button>
                    <Button onClick={editingAlbum ? handleUpdateAlbum : handleAddAlbum} sx={{ color: "#ea5674", '&:hover': { backgroundColor: "#c04a5e" } }}>
                        {editingAlbum ? "Update Album" : "Add Album"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Delete Confirmation */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle sx={{ textAlign: 'center', color: "#ea5674", fontWeight: 'bold' }}>
                    Are you sure you want to delete the album: {albumToDelete?.name}?
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={handleCloseDeleteDialog} sx={{ color: "#ea5674", '&:hover': { backgroundColor: "#c04a5e" } }}>
                        No
                    </Button>
                    <Button onClick={handleDeleteAlbum} sx={{ color: "#ea5674", '&:hover': { backgroundColor: "#c04a5e" } }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};

export default AlbumList;
