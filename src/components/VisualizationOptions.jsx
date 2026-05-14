import "../styles/visualization.css";

const VisualizationOptions = ({ setPage }) => {
  return (
    <section
      className="visualize-options"
      id="visualization-section"
    >
      <h2>
        Choose Algorithm Visualization
      </h2>

      <div className="options-container">

        <button onClick={() => setPage("bfs")}>
          BFS Traversal
        </button>

        <button onClick={() => setPage("dfs")}>
          DFS Traversal
        </button>

      </div>
    </section>
  );
};

export default VisualizationOptions;