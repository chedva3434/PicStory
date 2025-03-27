import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Avatar, Button, Tooltip, Snackbar, Alert } from "@mui/material";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CollectionsIcon from '@mui/icons-material/Collections';
import ShareIcon from '@mui/icons-material/Share';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from "react-redux";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { username, token } = useSelector((state: any) => state.user); // token כאן מייצג את מצב ההתחברות

  // State לניהול הצגת הודעה
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // פונקציה לטיפול בלחיצה על כפתורים בתפריט
  const handleMenuClick = (path: string) => {
    if (!token) {
      setOpenSnackbar(true); // הצגת הודעת האזהרה אם המשתמש לא מחובר
    } else {
      navigate(path); // אם מחובר, הוביל לדף המתאים
    }
  };

  return (
    <div>
      <AppBar position="fixed" sx={{ backgroundColor: "#ffffff", padding: "0", width: "100%", top: 0, left: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/img/2.png" alt="Logo" style={{ height: "100px", width: "auto" }} />
          </Box>

          <Box sx={{ display: "flex", gap: "16px", flexGrow: 1 }}>
            {!token ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={{ color: "#ea5674", fontWeight: 'bold' }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>

                <Button
                  color="inherit"
                  startIcon={<PersonAddIcon />}
                  sx={{ color: "#ea5674", fontWeight: 'bold' }}
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            ) : null}
            <Button
              color="inherit"
              startIcon={<PhotoLibraryIcon />}
              sx={{ color: "#ea5674", fontWeight: 'bold' }}
              onClick={() => handleMenuClick('/album-list')}
            >
              Albums
            </Button>

            <Button color="inherit"
              startIcon={<CollectionsIcon />}
              sx={{ color: "#ea5674", fontWeight: 'bold' }}
              onClick={() => handleMenuClick('/album-management')}
            >
              Manage Albums
            </Button>
            <Button color="inherit"
              startIcon={<ShareIcon />}
              sx={{ color: "#ea5674", fontWeight: 'bold' }}
              onClick={() => handleMenuClick('/album-management')}
            >
              Shared Albums
            </Button>
            <Button color="inherit"
              startIcon={<PeopleIcon />}
              sx={{ color: "#ea5674", fontWeight: 'bold' }}
              onClick={() => handleMenuClick('/album-management')}
            >
              Albums Shared With Me
            </Button>


          </Box>

          <Box>
            <Tooltip title={token ? "Open settings" : "לא מחובר"}>
              <IconButton sx={{ p: 0 }}>
                {token ? (
                  <Avatar
                    alt="User"
                    sx={{
                      width: 60,
                      height: 60,
                      fontSize: 20,
                      marginRight: "50px",
                      backgroundColor: "#ea5674",  // צבע הרקע שלך
                      color: "#fff", // צבע הטקסט על האייקון (אם יש לך ראשי תיבות)
                    }}
                  >
                    {username}
                  </Avatar>
                ) : (
                  <AccountCircleIcon sx={{ fontSize: 80, color: "#ea5674", marginRight: "50px" }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Snackbar עבור הודעה אם המשתמש לא מחובר */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="warning"
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
        >
          😞 You are not logged in yet! Please log in or sign up to access this page.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Header;
