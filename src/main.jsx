import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";
import SettingsProvider from "./contexts/SettingsProvider.jsx";

import "simplebar-react/dist/simplebar.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </LocalizationProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
