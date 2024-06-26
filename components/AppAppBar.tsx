import * as React from "react";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";

import ProfileSidebar from "./profile";
import { useAuth } from "../firebase/auth";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import logo from "../public/Tripify.png";
import { useRouter } from "next/router";
import { TripCardData } from "../CustomTypes";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebase";
import SearchBar from "./SearchBarYelp";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
  curTripData: TripCardData;
  setTripData: React.Dispatch<React.SetStateAction<TripCardData>>;
  fetchTripData: (tripId: string) => Promise<void>;
}

function AppAppBar({ mode, toggleColorMode, curTripData, setTripData, fetchTripData }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);
  const { authUser, isLoading } = useAuth();
  const [login, setLogin] = useState(false);
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/dashboard",
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
    ],
  };
  const goBack = () => {
    router.back();
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  const router = useRouter();
  const { tripId } = router.query as { tripId: string };

  useEffect(() => {
    if (tripId) {
      fetchTripData(tripId);
    }
  }, [tripId]);
  let href;
  if (curTripData?.trip_dest != null){
    href = `/discover?trip_destination=${encodeURIComponent(curTripData?.trip_dest)}&trip_id=${encodeURIComponent(tripId)}`;
  } else {
    href = `/discover?trip_destination=&trip_id=${encodeURIComponent(tripId)}`;
  }

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 0.4,
                display: "flex",
                alignItems: "center",
                ml: "10px",
                px: 0,
              }}
            >
              <Link href="/dashboard" passHref>
                <img
                  src={logo.src}
                  style={logoStyle}
                  alt="logo of tripify"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                />
              </Link>
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  ml:"30px",
                  px:0,
                  width: isMobile ? "100%" : "100%",
                  "& .MuiOutlinedInput-root": {
                    height: "40px", //
                    borderRadius: "20px",
                    "& .MuiOutlinedInput-input": {
                      padding: "10px 14px ",
                    },
                    "& .MuiInputLabel-outlined": {
                      lineHeight: "40px",
                      transform: "translate(14px, 14px) scale(1)", // Adjust label position
                    },
                    "& .MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)", // Adjust label position on focus
                    },
                  },
                }}
              >
                {tripId && curTripData && (
                  <>
                    <SearchBar
                      trip_destination={curTripData.trip_dest}
                      trip_id={tripId}
                      isMobile={isMobile}
                      curTripData = {curTripData}
                      setTripData = {setTripData}
                      fetchTripData = {fetchTripData}
                      sx={{
                        flexGrow: 1, // Allow search bar to grow and fill available space
                        maxWidth: "100%", // Ensure it does not exceed the container width
                      }}
                    />
                    
                    <Link href={href}>
                      <MenuItem sx={{ py: "6px", px: "12px" }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 700 }}
                        >
                          Discover
                        </Typography>
                      </MenuItem>
                    </Link>
                  </>
                )}


              {router.pathname === '/discover' && (
                <>
                <SearchBar
                      trip_destination={curTripData?.trip_dest}
                      trip_id={tripId}
                      isMobile={isMobile}
                      curTripData = {curTripData}
                      setTripData = {setTripData}
                      fetchTripData = {fetchTripData}
                      sx={{
                        flexGrow: 1, // Allow search bar to grow and fill available space
                        maxWidth: "100%", // Ensure it does not exceed the container width
                      }}
                    />
                <MenuItem sx={{ py: "6px", px: "12px" }}>
                <Typography
                  variant="body2"
                  color="text.primary"
                  onClick={goBack}
                  sx={{ fontWeight: 700 }}
                >
                Back to Trip
                </Typography>
              </MenuItem>
              
              </>
            
              
              )}


              </Box>
              
              
              {!isMobile &&  (
                <>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "flex-end", // Align menu items to the right
                    }}
                  >
                    {/* <Link href="/dashboard" passHref>
                      <MenuItem sx={{ py: "6px", px: "12px" }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 700 }}
                        >
                          Trips
                        </Typography>
                      </MenuItem>
                    </Link> */}

                    {/* <Link href="/restaurants" passHref>
                      <MenuItem sx={{ py: "6px", px: "12px" }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 700 }}
                        >
                          Resturants
                        </Typography>
                      </MenuItem>
                    </Link> */}

                    {/* <Link href="/faq" passHref>
                      <MenuItem
                        onClick={() => scrollToSection("faq")}
                        sx={{ py: "6px", px: "12px" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 700 }}
                        >
                          FAQ
                        </Typography>
                      </MenuItem>
                    </Link> */}

                  </Box>
                </>
              )}
            </Box>
            
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {!isLoading && authUser ? (
                // User is logged in, show the ProfileSidebar component
                <ProfileSidebar />
              ) : (
                // User is not logged in, show SIGN IN and SIGN UP buttons
                <>
                  <ToggleColorMode
                    mode={mode}
                    toggleColorMode={toggleColorMode}
                  />
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component="a"
                    href="/material-ui/getting-started/templates/sign-in/"
                    target="_blank"
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component="a"
                    href="/material-ui/getting-started/templates/sign-up/"
                    target="_blank"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  ></Box>
                  <Link href="/discover" passHref>
                    <MenuItem>Discover</MenuItem>
                  </Link>
                  {/*
                  <Link href="/dashboard" passHref>
                    <MenuItem>Trips</MenuItem>
                  </Link>
                  <Link href="/resturants" passHref>
                    <MenuItem>Resturants</MenuItem>
                  </Link>
                  <Link href="/faq" passHref>
                    <MenuItem>FAQ</MenuItem>
                  </Link> */}
                  <Divider />
                  {!isLoading && authUser ? (
                    // User is logged in, show the ProfileSidebar component
                    <ProfileSidebar/>
                  ) : (
                    // User is not logged in, show SIGN IN and SIGN UP buttons
                    <>
                      <ToggleColorMode
                        mode={mode}
                        toggleColorMode={toggleColorMode}
                      />
                      <Button
                        color="primary"
                        variant="outlined"
                        component="a"
                        href="/material-ui/getting-started/templates/sign-in/"
                        target="_blank"
                        sx={{ width: "100%" }}
                      >
                        Sign in
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        component="a"
                        href="/material-ui/getting-started/templates/sign-up/"
                        target="_blank"
                        sx={{ width: "100%" }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;