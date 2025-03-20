import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // ייבוא האייקון
import { useUser } from "../useContext";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function AuthModal() {
    const { user } = useUser();  // משתמש את ה-useContext כדי לקבל את המשתמש
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed" color="transparent" sx={{ width: "100vw", padding: "15px 0" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 0, display: "flex", justifyContent: "flex-start" }}>
                        {user ? (
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar
                                        alt={user.Name}
                                        src="/static/images/avatar/2.jpg"
                                        sx={{ width: 60, height: 60, ml: 2, fontSize: 40}} // הגדלת האות
                                    >
                                        {user.Name.charAt(0).toUpperCase()} {/* מציג את האות הראשונה בשם המשתמש */}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="לא מחובר">
                                <IconButton sx={{ p: 0 }}>
                                    <AccountCircleIcon sx={{ fontSize: 70, color: "#d32f2f" }} /> {/* אייקון של איש קשר */}
                                </IconButton>
                            </Tooltip>
                        )}
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* הקישורים בצד ימין */}
                    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ my: 2, px: 2 }}>
                                <Link to="/home/recipes" style={{ color: "#d32f2f", textDecoration: "none" }}>
                                    המתכונים שלנו
                                </Link>
                            </Box>

                            {/* הצגת "הוספת מתכון" ו-"עריכת מתכון" רק למשתמש מחובר */}
                            {user && (
                                <>
                                    <Box sx={{ my: 2, px: 2 }}>
                                        <Link to="/addrecies" style={{ color: "#d32f2f", textDecoration: "none" }}>
                                            הוספת מתכון
                                        </Link>
                                    </Box>
                                    <Box sx={{ my: 2, px: 2 }}>
                                        <Link to="/editrecipes" style={{ color: "#d32f2f", textDecoration: "none" }}>
                                            עריכת מתכון
                                        </Link>
                                    </Box>
                                    <Box sx={{ my: 2, px: 2 }}>
                                        <Link to="/categories" style={{ color: "#d32f2f", textDecoration: "none" }}>
                                            קטגוריות
                                        </Link>
                                    </Box>
                                </>
                            )}

                            <Box sx={{ my: 2, px: 2 }}>
                                <Link to="/login" style={{ color: "#d32f2f", textDecoration: "none" }}>
                                    הרשמה / התחברות
                                </Link>
                            </Box>
                        </Box>
                        <img src="/images/food1.png" alt="Your Image" style={{ height: "70px" }} />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AuthModal;
