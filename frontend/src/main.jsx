import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SubscriptionProvider>
        <App />
      </SubscriptionProvider>
    </BrowserRouter>
  </StrictMode>
);
