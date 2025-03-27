import * as React from "react";
import { Box, Typography } from "@mui/material";
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import EmailIcon from '@mui/icons-material/Email';

const Footer1 = () => {
  return (
    <Box
      sx={{
        position: "fixed", 
        bottom: 0,  
        left: 0, 
        width: "100%", 
        backgroundColor:"#ffffff",  
        color: "black", // שינוי צבע הכיתוב לשחור
        padding: "15px 0",  
        textAlign: "center",  
      }}
    >
      <Typography variant="body1" sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px", color: "black" }}>
        <PhoneEnabledIcon sx={{ marginRight: "8px" }} />
        0534194892
      </Typography>
      <Typography variant="body1" sx={{ display: "flex", justifyContent: "center", alignItems: "center", color: "black" }}>
        <EmailIcon sx={{ marginRight: "8px" }} />
        chedvaDonenberg@gmail.com
      </Typography>
    </Box>
  );
};

export default Footer1;
