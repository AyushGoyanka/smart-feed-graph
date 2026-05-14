import { useEffect, useRef, useState } from "react";
import "../styles/visualizer.css";

const DFSVisualizer = () => {
  const canvasRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [startNode, setStartNode] =
    useState(0);

  const [result, setResult] = useState([]);

  const [speed, setSpeed] =
    useState(1000);

  const [graphType, setGraphType] =
    useState("directed");

  const [visitedNodes, setVisitedNodes] =
    useState([]);

  const [activeEdges, setActiveEdges] =
    useState([]);

  // Initial Graph
  useEffect(() => {
    generateGraph("small");
  }, []);

  // Redraw Graph
  useEffect(() => {
    drawGraph();
  }, [
    nodes,
    edges,
    visitedNodes,
    activeEdges,
    graphType,
  ]);

  // Generate Graph
  const generateGraph = (size) => {
    const nodeCount =
      size === "small" ? 5 : 10;

    let tempNodes = [];
    let tempEdges = [];

    for (let i = 0; i < nodeCount; i++) {
      tempNodes.push({
        id: i,
        x: Math.random() * 500 + 80,
        y: Math.random() * 250 + 80,
      });
    }

    // Connected Graph
    for (let i = 0; i < nodeCount - 1; i++) {
      tempEdges.push([i, i + 1]);
    }

    // Random Edges
    for (let i = 0; i < nodeCount; i++) {
      let target = Math.floor(
        Math.random() * nodeCount
      );

      if (
        target !== i &&
        !tempEdges.some(
          (edge) =>
            edge[0] === i &&
            edge[1] === target
        )
      ) {
        tempEdges.push([i, target]);
      }
    }

    setNodes(tempNodes);
    setEdges(tempEdges);

    setVisitedNodes([]);
    setActiveEdges([]);
    setResult([]);
  };

  // Draw Arrow
  const drawArrow = (
    ctx,
    fromX,
    fromY,
    toX,
    toY,
    color = "gray",
    width = 2
  ) => {
    const headLength = 10;

    const dx = toX - fromX;
    const dy = toY - fromY;

    const angle = Math.atan2(dy, dx);

    const offsetX = Math.cos(angle) * 22;
    const offsetY = Math.sin(angle) * 22;

    const startX = fromX + offsetX;
    const startY = fromY + offsetY;

    const endX = toX - offsetX;
    const endY = toY - offsetY;

    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(endX, endY);

    ctx.strokeStyle = color;

    ctx.lineWidth = width;

    ctx.stroke();

    // Arrow Head
    if (graphType === "directed") {
      ctx.beginPath();

      ctx.moveTo(endX, endY);

      ctx.lineTo(
        endX -
          headLength *
            Math.cos(
              angle - Math.PI / 6
            ),
        endY -
          headLength *
            Math.sin(
              angle - Math.PI / 6
            )
      );

      ctx.lineTo(
        endX -
          headLength *
            Math.cos(
              angle + Math.PI / 6
            ),
        endY -
          headLength *
            Math.sin(
              angle + Math.PI / 6
            )
      );

      ctx.closePath();

      ctx.fillStyle = color;

      ctx.fill();
    }
  };

  // Draw Graph
  const drawGraph = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Draw Edges
    edges.forEach((edge) => {
      const nodeA = nodes[edge[0]];
      const nodeB = nodes[edge[1]];

      if (!nodeA || !nodeB) return;

      const isActive =
        activeEdges.some(
          (active) =>
            active[0] === edge[0] &&
            active[1] === edge[1]
        );

      drawArrow(
        ctx,
        nodeA.x,
        nodeA.y,
        nodeB.x,
        nodeB.y,
        isActive ? "yellow" : "gray",
        isActive ? 4 : 2
      );
    });

    // Draw Nodes
    nodes.forEach((node) => {
      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        22,
        0,
        Math.PI * 2
      );

      // Highlight Visited Nodes
      if (
        visitedNodes.includes(node.id)
      ) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "white";
      }

      ctx.fill();

      ctx.strokeStyle = "black";

      ctx.lineWidth = 2;

      ctx.stroke();

      ctx.fillStyle =
        visitedNodes.includes(node.id)
          ? "white"
          : "black";

      ctx.font = "16px Arial";

      ctx.fillText(
        node.id,
        node.x - 5,
        node.y + 5
      );
    });
  };

  // Delay Function
  const sleep = (ms) => {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  };

  // DFS Traversal
  const dfsTraversal = async () => {
    if (
      startNode < 0 ||
      startNode >= nodes.length
    ) {
      alert("Invalid Start Node");
      return;
    }

    let visited = new Array(
      nodes.length
    ).fill(false);

    let traversal = [];

    let highlightedNodes = [];

    let highlightedEdges = [];

    const dfs = async (current) => {
      visited[current] = true;

      traversal.push(current);

      highlightedNodes.push(current);

      setVisitedNodes([
        ...highlightedNodes,
      ]);

      await sleep(speed);

      for (let edge of edges) {
        let from = edge[0];
        let to = edge[1];

        // Directed Graph
        if (
          from === current &&
          !visited[to]
        ) {
          highlightedEdges.push([
            from,
            to,
          ]);

          setActiveEdges([
            ...highlightedEdges,
          ]);

          await sleep(speed / 2);

          await dfs(to);
        }

        // Undirected Graph
        if (
          graphType ===
            "undirected" &&
          to === current &&
          !visited[from]
        ) {
          highlightedEdges.push([
            to,
            from,
          ]);

          setActiveEdges([
            ...highlightedEdges,
          ]);

          await sleep(speed / 2);

          await dfs(from);
        }
      }
    };

    await dfs(startNode);

    setResult(traversal);
  };

  // Reset Graph
  const resetGraph = () => {
    setVisitedNodes([]);
    setActiveEdges([]);
    setResult([]);
  };

  return (
    <div className="visualizer-page">
      <header>
        <h1>
          Depth-First Search (DFS)
        </h1>
      </header>

      <section className="controls">
        <input
          type="number"
          placeholder="Enter node"
          value={startNode}
          onChange={(e) =>
            setStartNode(
              Number(e.target.value)
            )
          }
        />

        <button onClick={dfsTraversal}>
          Run DFS
        </button>

        <button
          onClick={() =>
            generateGraph("small")
          }
        >
          Small Graph
        </button>

        <button
          onClick={() =>
            generateGraph("large")
          }
        >
          Large Graph
        </button>

        <button
          onClick={() =>
            generateGraph("small")
          }
        >
          New Graph
        </button>

        <button onClick={resetGraph}>
          Reset Graph
        </button>

        {/* Graph Type */}
        <div className="radio-group">
          <label>
            <input
              type="radio"
              checked={
                graphType ===
                "directed"
              }
              onChange={() =>
                setGraphType(
                  "directed"
                )
              }
            />
            Directed Graph
          </label>

          <label>
            <input
              type="radio"
              checked={
                graphType ===
                "undirected"
              }
              onChange={() =>
                setGraphType(
                  "undirected"
                )
              }
            />
            Undirected Graph
          </label>
        </div>

        {/* Speed Slider */}
        <div className="speed-control">
          <label>
            Animation Speed:
          </label>

          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) =>
              setSpeed(
                Number(
                  e.target.value
                )
              )
            }
          />
        </div>
      </section>

      {/* Graph */}
      <div className="graph-container">
        <canvas
          ref={canvasRef}
          width={700}
          height={430}
        />
      </div>

      {/* Output */}
      <section className="output">
        <h2>Traversal Order:</h2>

        <p>
          {result.length > 0
            ? result.join(" → ")
            : "Nodes will appear here..."}
        </p>
      </section>
    </div>
  );
};

export default DFSVisualizer;