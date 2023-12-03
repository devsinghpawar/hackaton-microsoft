"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

// MUI
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// images
import Logohearable from "../../../public/Logo_hearable.svg";
import ProfileImage from "../../../public/profile.jpg";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// handle events
const handleDrawerOpen = () => {
  setOpen(true);
  setOpenProp(true);
};

const handleDrawerClose = () => {
  setOpen(false);
};

function Header({openProp, setOpenProp}) {
    const [open, setOpen] = useState(openProp);
  return (
    <AppBar position="fixed" open={open} sx={{ background: "inherit" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            mr: 2,
            ...(open && { display: "none" }),
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image src={Logohearable} alt="Logo" width={70} height={70} />
          <div
            style={{
              width: "50px",
              height: "50px",
              background: "navy",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "0.25rem",
              marginBottom: "0.25rem",
            }}
          >
            <Image src={ProfileImage} alt="Logo" height={100} />
          </div>
        </div>
        {/* <Typography variant="h6" noWrap component="div">
        Persistent drawer
      </Typography> */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
