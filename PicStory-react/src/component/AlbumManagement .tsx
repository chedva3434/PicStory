import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useDispatch, useSelector } from "react-redux";
import { createAlbumAsync, deleteAlbumAsync, updateAlbumAsync } from "../slices/albumSlice";
import { AppDispatch, RootState } from "./store";

const AlbumManagementDrawer = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const selectedAlbum = useSelector((state: RootState) => state.album.selectedAlbum); // קבלת האלבום הנבחר

  const toggleDrawer = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };

  return (
    <>
      {/* כפתור לפתיחת התפריט */}
      <IconButton onClick={toggleDrawer(true)} sx={{ position: "absolute", left: 10, top: 10 }}>
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* Drawer של התפריט */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250, padding: 2 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => dispatch(createAlbumAsync({ userId: 1, name: "אלבום חדש", description: "תיאור" }))}>
              <AddBoxIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="הוספת אלבום" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                if (selectedAlbum) {
                    dispatch(updateAlbumAsync({ 
                        Id: selectedAlbum.id, 
                        album: { 
                            userId: 1, 
                            name: "עדכון שם", 
                            description: "עדכון תיאור" 
                        } 
                    }));
                                    } else {
                  alert("אין אלבום נבחר לעדכון!");
                }
              }}
            >
              <EditIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="עדכון אלבום" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => dispatch(deleteAlbumAsync(1))}>
              <DeleteIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="מחיקת אלבום" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <AddPhotoAlternateIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="הוספת תמונה" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <EditIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="עדכון תמונה" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <DeleteIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="מחיקת תמונה" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <SearchIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="חיפוש לפי כיתוב תמונה" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default AlbumManagementDrawer;
