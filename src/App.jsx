import React, { useState, useEffect, useRef } from "react";
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
  Grid,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  MobileTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import theme from "./Theme";

dayjs.extend(utc);
dayjs.extend(timezone);

const App = () => {
  const [isOn, setIsOn] = useState(false);
  const [currentTimeSelected, setCurrentTimeSelected] = useState(dayjs());
  const currentTime = useRef(dayjs());
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());

  const GeneralSetting = () => {
    return (
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
              flexWrap: "wrap",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
              <MobileTimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
            </LocalizationProvider>
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
              startIcon={<Save />}
            >
              Save
            </Button>
          </Box>
        </Box>
      </TabPanel>
    );
  };

  const WifiConfig = () => {
    return (
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
              flexWrap: "wrap",
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
              startIcon={<SendIcon />}
            >
              Connect
            </Button>
          </Box>
        </Box>
      </TabPanel>
    );
  };

  const SetTime = () => {
    return (
      <TabPanel>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Set Current Time
        </Typography>
        <Box
          component="form"
          onSubmit={handleSetTimeSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 4,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              label="Current Time"
              value={currentTimeSelected}
              onChange={(newValue) => setCurrentTimeSelected(newValue)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
          </LocalizationProvider>
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
    );
  };

  const tabs = {
    0: <GeneralSetting />,
    1: <WifiConfig />,
    2: <SetTime />,
  };

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Toggle button handler
  const handleToggle = async () => {
    try {
      const response = await fetch("/api/toggle", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setIsOn(data.isOn);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      currentTime.current = now;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWiFiSubmit = async (event) => {
    event.preventDefault();
    const ssid = event.target.ssid.value;
    const password = event.target.password.value;
    const payload = {
      ssid: ssid,
      password: password,
    };

    try {
      const response = await fetch("/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to Wi-Fi");
    }
  };

  const handleGeneralSubmit = async (event) => {
    event.preventDefault();

    const onEpochTime = startTime.unix() + startTime.utcOffset() * 60;
    const offEpochTime = endTime.unix() + startTime.utcOffset() * 60;

    const payload = {
      onTime: onEpochTime,
      offTime: offEpochTime,
    };

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = response;
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving general settings");
    }
  };

  const handleSetTimeSubmit = async (event) => {
    event.preventDefault();
    const epochTime =
      currentTime.current.unix() + currentTime.current.utcOffset() * 60;
    const payload = {
      currentTime: epochTime,
    };

    try {
      const response = await fetch("/api/setTime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Server response:", data);
      alert(`Set Time: ${epochTime} (Epoch Time)`);
    } catch (error) {
      console.error("Error:", error);
      alert("Error setting time");
    }
  };

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
            minWidth: { xs: 300, sm: 500, md: 700 },
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
                letterSpacing: 2,
              }}
            >
              {(() => {
                const now = currentTime.current;
                const hours = now.format("h");
                const minutes = now.format("mm");
                const ampm = now.format("A");
                return `${hours}:${minutes} ${ampm}`;
              })()}
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
            {tabs[tabValue]}
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
