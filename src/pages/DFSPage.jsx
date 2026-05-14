import DFSVisualizer from "../components/DFSVisualizer";
import "../styles/dfs.css";
import { useEffect } from "react";

const DFSPage = ({ setPage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <button className="back-btn" onClick={() => setPage("home")}>
        ← Back To Home
      </button>
      <DFSVisualizer />;
    </>
  );
};

export default DFSPage;
