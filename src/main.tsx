import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const server = "https://ai-career-backend-q7xn.onrender.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <GoogleOAuthProvider clientId="416246685981-0ib4nfqgg02boa8m26njgcbd48kmou2t.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AppProvider>
  </StrictMode>
);