import { useState } from "react";

import Home from "./pages/Home";
import BFSPage from "./pages/BFSPage";
import DFSPage from "./pages/DFSPage";

function App() {
  const [page, setPage] = useState("home");

  if (page === "home") {
    return <Home setPage={setPage} />;
  }

  if (page === "bfs") {
    return <BFSPage setPage={setPage} />;
  }

  if (page === "dfs") {
    return <DFSPage setPage={setPage} />;
  }

  if (page === "visualization") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020b16",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1>Select Visualization</h1>

        <button onClick={() => setPage("bfs")}>
          BFS Traversal
        </button>

        <button onClick={() => setPage("dfs")}>
          DFS Traversal
        </button>
      </div>
    );
  }

  return <Home setPage={setPage} />;
}

export default App;