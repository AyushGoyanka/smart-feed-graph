import BFSVisualizer from "../components/BFSVisualizer";
import "../styles/bfs.css";
import { useEffect } from "react";

const BFSPage = ({ setPage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <button className="back-btn" onClick={() => setPage("home")}>
        ← Back To Home
      </button>

      <BFSVisualizer />
    </>
  );
};

export default BFSPage;
