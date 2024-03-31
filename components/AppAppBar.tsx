import * as React from "react";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";

import ProfileSidebar from "./profile";
import { useAuth } from "../firebase/auth";
import { useEffect, useState } from "react";
import logo from "../public/Tripify.png";
import { useRouter } from "next/router";
import Link from "next/link";
import Drawer from "@mui/material/Drawer";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
  profilePicURL: string;
}

function AppAppBar({ mode, toggleColorMode, profilePicURL }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

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
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {!isLoading && authUser ? (
                <ProfileSidebar profilePicURL={profilePicURL} />
              ) : (
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
                    href="/sign-in"
                    target="_blank"
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component="a"
                    href="/sign-up"
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
                  <Divider />
                  {!isLoading && authUser ? (
                    <ProfileSidebar profilePicURL={profilePicURL} />
                  ) : (
                    <>
                      <ToggleColorMode
                        mode={mode}
                        toggleColorMode={toggleColorMode}
                      />
                      <Button
                        color="primary"
                        variant="outlined"
                        component="a"
                        href="/sign-in"
                        target="_blank"
                        sx={{ width: "100%" }}
                      >
                        Sign in
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        component="a"
                        href="/sign-up"
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
