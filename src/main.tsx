import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainRouter from "./router/MainRouter";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./index.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <MainRouter />
    </PrimeReactProvider>
  </StrictMode>
);
