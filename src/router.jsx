import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import BFSPage from "./pages/BFSPage";
import DFSPage from "./pages/DFSPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/bfs",
    element: <BFSPage />,
  },
  {
    path: "/dfs",
    element: <DFSPage />,
  },
]);

export default router;