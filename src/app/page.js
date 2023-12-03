"use client";
// react
import { useEffect, useState } from "react";
import Image from "next/image";

// components
import SpeechToTextComponent from "../../components/SpeechToTextComponent";
import TextToSpeechComponent from "../../components/TextToSpeechComponent";

// styles
import styles from "./page.module.css";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

// images
import Logohearable from "../../public/logo_hearable.svg";
import ProfileImage from "../../public/profile.jpg";
import IconVoice from "../../public/icon_voice.svg";
import IconVoicePlus from "../../public/icon_voiceplus.svg";

// MUI styling
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [folderData, setFolderData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [showFolder, setShowFolder] = useState("");

  // fetch folder data
  useEffect(() => {
    const fetchFolder = async () => {
      const url = "/api/folder?userId=6567af7ed5745139ca11c3c0";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const fetchFolderData = await response.json();
      console.log(fetchFolderData);
      setFolderData(fetchFolderData);
    };
    fetchFolder();
  }, []);

  // handle events
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const addFolder = async () => {
    // make a post request to the db
    const url = "/api/folder";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })} ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        user: "6567af7ed5745139ca11c3c0",
        classes: [],
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const postFolder = await response.json();
    console.log(postFolder);
    const addFolder = [...folderData, postFolder];
    setFolderData(addFolder);
  };

  const fetchClass = async (folderId) => {
    setShowFolder(folderId);
    console.log("fetch class, folderId", folderId);
    const url = "/api/class?folderId=" + folderId;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const fetchClassData = await response.json();
    console.log(fetchClassData);
    setClassData(fetchClassData);
  };

  return (
    <div>
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
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "inherit",
            color: "white",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {/* <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%"}}> */}
          <Typography variant="h6" noWrap component="div">
            My Files
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon sx={{ color: "white" }} />
          </IconButton>
          {/* </div> */}
        </DrawerHeader>

        <Divider sx={{ borderColor: "white" }}  />
        <List sx={{ flexGrow: 1 }}>
          {folderData?.map(({ name, _id }, index) => (
            <ListItem
              key={_id}
              disablePadding
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <ListItemButton
                onClick={() => {
                  fetchClass(_id);
                }}
                sx={{
                  background:
                    _id == showFolder ? "rgba(255,255,255,0.25)" : "none",
                  width: "100%",
                }}
              >
                <ListItemIcon sx={{ minWidth: "0", marginRight: "0.5rem" }}>
                  <FolderIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
              {_id == showFolder && (
                <div
                  style={{
                    width: "100%",
                    // justifySelf:"center",
                    // backgroundColor: "red",
                  }}
                >
                  <List sx={{ paddingLeft: "1rem" }}>
                    {classData?.map(({ name, _id }, index) => (
                      <ListItem key={_id} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            fetchClass(_id);
                          }}
                        >
                          <ListItemIcon
                            sx={{ minWidth: "0", marginRight: "0.5rem" }}
                          >
                            <Image
                              src={IconVoice}
                              alt="Logo"
                              width={20}
                              height={20}
                            />
                          </ListItemIcon>
                          <ListItemText primary={name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.25)" , width:"100%", }} />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop:"1rem" }}>
                    <Image
                      src={IconVoicePlus}
                      style={{ marginLeft: "2rem" }}
                      alt="Logo"
                      width={20}
                      height={20}
                    />
                    <Typography variant="body1" noWrap component="div">
                      New Class...
                    </Typography>
                  </div>
                </div>
              )}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: "white" }} />
        <div
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            gap: ".5rem",
            cursor: "pointer",
          }}
          onClick={addFolder}
        >
          <CreateNewFolderIcon sx={{ color: "white" }} />
          <Typography variant="body1" noWrap component="div">
            New Folder...
          </Typography>
        </div>
      </Drawer>
      <main className={styles.main}>
        <h1 style={{ color: "white" }}>Microsoft Hackaton Project</h1>

        <SpeechToTextComponent />
        <TextToSpeechComponent />
      </main>
    </div>
  );
}
