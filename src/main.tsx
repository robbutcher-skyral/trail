import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "@adk/lens-design/brands/default";
import "@adk/lens-design/fonts.css";
import "@adk/lens-react/styles.css";

createRoot(document.getElementById("root")!).render(<App />);
