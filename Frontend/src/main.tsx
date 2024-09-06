import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { WebsocketProvider } from "./context/WebsocketContext";
import "./index.css";
import DRoutes from "./routes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      {/* <React.StrictMode> */}
      <WebsocketProvider>
        <BrowserRouter>
          <DRoutes />
        </BrowserRouter>
      </WebsocketProvider>
      {/* </React.StrictMode> */}
    </UserProvider>
  </QueryClientProvider>
);
