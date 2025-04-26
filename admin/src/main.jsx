import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import CoworkingContextProvider from "./context/CoworkingContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <CoworkingContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </CoworkingContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
