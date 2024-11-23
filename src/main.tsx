import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "./components/ui/toaster.tsx";
// import "./styles/slider.css"
import "./styles/background.css"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
      <Toaster />
    </LocalizationProvider>
    {/* </Provider> */}
  </StrictMode>
);
