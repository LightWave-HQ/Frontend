import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Paper,
  Typography,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";

import { useMediaQuery } from "@mui/material";
import theme from "./Theme";

const App = () => {
  const [isOn, setIsOn] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Toggle button handler
  const handleToggle = () => {
    setIsOn(!isOn);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  // Form handlers
  const handleWiFiSubmit = (event) => {
    event.preventDefault();
    const ssid = event.target.ssid.value;
    const password = event.target.password.value;

    alert(`Wi-Fi Configuration: SSID=${ssid}, Password=${password}`);
  };

  const handleGeneralSubmit = (event) => {
    event.preventDefault();
    const onTime = event.target.onTime.value;
    const offTime = event.target.offTime.value;

    alert(`General Settings: OnTime=${onTime}, OffTime=${offTime}`);
  };

  const handleSetTimeSubmit = (event) => {
    event.preventDefault();
    const currentTime = event.target.currentTime.value;

    alert(`Set Time: ${currentTime}`);
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* Toggle Button */}
        <Paper
          elevation={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            borderRadius: 2,
            minWidth: 700,
            minHeight: 600,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            onClick={handleToggle}
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "#26a69a",
              fontSize: "1.5rem",
              color: "white",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#00796b",
              },
            }}
          >
            {isOn ? "ON" : "OFF"}
          </Button>

          {/* Digital Clock */}
          <Box
            sx={{
              margin: 2,
              borderRadius: 2,
              backgroundColor: "#f1f1f1",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                margin: 2,
                fontWeight: "bold",
                textAlign: "center",
                color: "primary.main",
                letterSpacing: 1.5,
              }}
            >
              {currentTime}
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ width: "100%", marginTop: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="Settings Tabs"
            >
              <Tab label="General" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Wi-Fi" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Set Time" id="tab-2" aria-controls="tabpanel-2" />
            </Tabs>
            {tabValue === 0 && (
              <TabPanel>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  General Settings
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleGeneralSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      marginTop: 2,
                    }}
                  >
                    <TextField
                      name="onTime"
                      label="Light On Time"
                      variant="outlined"
                      fullWidth
                    />
                    <TextField
                      name="offTime"
                      label="Light Off Time"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: 120, background: "#26a69a" }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            )}
            {tabValue === 1 && (
              <TabPanel>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Wi-Fi Configuration
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleWiFiSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      marginTop: 2,
                    }}
                  >
                    <TextField
                      name="ssid"
                      label="SSID"
                      variant="outlined"
                      fullWidth
                    />
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: 120, background: "#26a69a" }}
                    >
                      Connect
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            )}
            {tabValue === 2 && (
              <TabPanel>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Set Current Time
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSetTimeSubmit}
                  sx={{
                    marginTop: 4,
                  }}
                >
                  <TextField
                    name="currentTime"
                    label="Current Time"
                    variant="outlined"
                    fullWidth
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        width: 120,
                        background: "#26a69a",
                      }}
                    >
                      Set Time
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            )}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

// TabPanel Component for Cleaner Tab Rendering
const TabPanel = ({ children }) => {
  return (
    <Box
      sx={{
        padding: 2,
        marginTop: 2,
        backgroundColor: "#fff",
      }}
    >
      {children}
    </Box>
  );
};

export default App;
