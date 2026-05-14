import { useEffect, useRef, useState } from "react";
import "../styles/visualizer.css";
import AIChat from "../components/AIChat";

const BFSVisualizer = () => {

  const canvasRef = useRef(null);

  // =========================
  // GRAPH STATES
  // =========================

  const [nodes, setNodes] = useState([]);

  const [edges, setEdges] = useState([]);

  // =========================
  // BFS STATES
  // =========================

  const [startNode, setStartNode] =
    useState(0);

  const [result, setResult] =
    useState([]);

  // =========================
  // VISUAL STATES
  // =========================

  const [visitedNodes, setVisitedNodes] =
    useState([]);

  const [activeEdges, setActiveEdges] =
    useState([]);

  // =========================
  // SETTINGS
  // =========================

  const [speed, setSpeed] =
    useState(1000);

  const [graphType, setGraphType] =
    useState("directed");

  // =========================
  // MANUAL GRAPH STATES
  // =========================

  const [manualMode, setManualMode] =
    useState(false);

  const [selectedNode, setSelectedNode] =
    useState(null);

  // =========================
  // CHATBOT
  // =========================

  const [chatOpen, setChatOpen] =
    useState(false);

  // =========================
  // INITIAL GRAPH
  // =========================

  useEffect(() => {
    generateGraph("small");
  }, []);

  // =========================
  // REDRAW GRAPH
  // =========================

  useEffect(() => {
    drawGraph();
  }, [
    nodes,
    edges,
    visitedNodes,
    activeEdges,
    graphType,
    selectedNode,
  ]);

  // =========================
  // GENERATE GRAPH
  // =========================

  const generateGraph = (size) => {

    const nodeCount =
      size === "small" ? 5 : 10;

    let tempNodes = [];

    let tempEdges = [];

    // CREATE NODES
    for (let i = 0; i < nodeCount; i++) {

      tempNodes.push({
        id: i,
        x: Math.random() * 500 + 80,
        y: Math.random() * 250 + 80,
      });

    }

    // CONNECT GRAPH
    for (let i = 0; i < nodeCount - 1; i++) {

      tempEdges.push([i, i + 1]);

    }

    // RANDOM EDGES
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

    resetGraph();

  };

  // =========================
  // MANUAL GRAPH
  // =========================

  const handleCanvasClick = (e) => {

    if (!manualMode) return;

    const canvas = canvasRef.current;

    const rect =
      canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    // CHECK NODE CLICK
    let clickedNode = null;

    for (let node of nodes) {

      const distance = Math.sqrt(
        (node.x - x) ** 2 +
        (node.y - y) ** 2
      );

      if (distance < 25) {

        clickedNode = node.id;

        break;

      }

    }

    // CREATE NODE
    if (clickedNode === null) {

      const newNode = {
        id: nodes.length,
        x,
        y,
      };

      setNodes([...nodes, newNode]);

      return;

    }

    // SELECT NODE
    if (selectedNode === null) {

      setSelectedNode(clickedNode);

    }

    // CREATE EDGE
    else {

      const edgeExists = edges.some(
        (edge) =>
          edge[0] === selectedNode &&
          edge[1] === clickedNode
      );

      if (
        selectedNode !== clickedNode &&
        !edgeExists
      ) {

        setEdges([
          ...edges,
          [selectedNode, clickedNode],
        ]);

      }

      setSelectedNode(null);

    }

  };

  // =========================
  // DRAW ARROW
  // =========================

  const drawArrow = (
    ctx,
    fromX,
    fromY,
    toX,
    toY,
    color = "gray",
    width = 2
  ) => {

    const radius = 22;

    const angle = Math.atan2(
      toY - fromY,
      toX - fromX
    );

    const startX =
      fromX + radius * Math.cos(angle);

    const startY =
      fromY + radius * Math.sin(angle);

    const endX =
      toX - radius * Math.cos(angle);

    const endY =
      toY - radius * Math.sin(angle);

    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(endX, endY);

    ctx.strokeStyle = color;

    ctx.lineWidth = width;

    ctx.stroke();

    // ARROW HEAD
    if (graphType === "directed") {

      const headLength = 12;

      ctx.beginPath();

      ctx.moveTo(endX, endY);

      ctx.lineTo(
        endX -
        headLength *
        Math.cos(angle - Math.PI / 6),

        endY -
        headLength *
        Math.sin(angle - Math.PI / 6)
      );

      ctx.lineTo(
        endX -
        headLength *
        Math.cos(angle + Math.PI / 6),

        endY -
        headLength *
        Math.sin(angle + Math.PI / 6)
      );

      ctx.closePath();

      ctx.fillStyle = color;

      ctx.fill();

    }

  };

  // =========================
  // DRAW GRAPH
  // =========================

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

    // DRAW EDGES
    edges.forEach((edge) => {

      const nodeA = nodes[edge[0]];

      const nodeB = nodes[edge[1]];

      if (!nodeA || !nodeB) return;

      const isActive =
        activeEdges.some(
          (e) =>
            e[0] === edge[0] &&
            e[1] === edge[1]
        );

      // DIRECTED GRAPH
      if (graphType === "directed") {

        drawArrow(
          ctx,
          nodeA.x,
          nodeA.y,
          nodeB.x,
          nodeB.y,
          isActive ? "yellow" : "gray",
          isActive ? 4 : 2
        );

      }

      // UNDIRECTED GRAPH
      else {

        ctx.beginPath();

        ctx.moveTo(nodeA.x, nodeA.y);

        ctx.lineTo(nodeB.x, nodeB.y);

        ctx.strokeStyle =
          isActive ? "yellow" : "gray";

        ctx.lineWidth =
          isActive ? 4 : 2;

        ctx.stroke();

      }

    });

    // DRAW NODES
    nodes.forEach((node) => {

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        22,
        0,
        Math.PI * 2
      );

      // SELECTED NODE
      if (selectedNode === node.id) {

        ctx.fillStyle = "orange";

      }

      // VISITED NODE
      else if (
        visitedNodes.includes(node.id)
      ) {

        ctx.fillStyle = "#1565c0";

      }

      // NORMAL NODE
      else {

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

  // =========================
  // DELAY
  // =========================

  const sleep = (ms) => {

    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );

  };

  // =========================
  // BFS TRAVERSAL
  // =========================

  const bfsTraversal = async () => {

    if (
      startNode < 0 ||
      startNode >= nodes.length
    ) {

      alert("Invalid Start Node");

      return;

    }

    resetGraph();

    let visited = new Array(
      nodes.length
    ).fill(false);

    let queue = [startNode];

    let traversal = [];

    let highlightedNodes = [];

    let highlightedEdges = [];

    visited[startNode] = true;

    while (queue.length > 0) {

      let current = queue.shift();

      traversal.push(current);

      highlightedNodes.push(current);

      setVisitedNodes([
        ...highlightedNodes,
      ]);

      await sleep(speed);

      for (let edge of edges) {

        let from = edge[0];

        let to = edge[1];

        // DIRECTED GRAPH
        if (graphType === "directed") {

          if (
            from === current &&
            !visited[to]
          ) {

            visited[to] = true;

            queue.push(to);

            highlightedEdges.push([
              from,
              to,
            ]);

            setActiveEdges([
              ...highlightedEdges,
            ]);

          }

        }

        // UNDIRECTED GRAPH
        else {

          if (
            from === current &&
            !visited[to]
          ) {

            visited[to] = true;

            queue.push(to);

            highlightedEdges.push([
              from,
              to,
            ]);

            setActiveEdges([
              ...highlightedEdges,
            ]);

          }

          else if (
            to === current &&
            !visited[from]
          ) {

            visited[from] = true;

            queue.push(from);

            highlightedEdges.push([
              to,
              from,
            ]);

            setActiveEdges([
              ...highlightedEdges,
            ]);

          }

        }

      }

    }

    setResult(traversal);

  };

  // =========================
  // RESET GRAPH
  // =========================

  const resetGraph = () => {

    setVisitedNodes([]);

    setActiveEdges([]);

    setResult([]);

    setSelectedNode(null);

  };

  return (

    <div className="visualizer-page">

      {/* HEADER */}
      <header>
        <h1>
          Breadth-First Search (BFS)
        </h1>
      </header>

      {/* CONTROLS */}
      <section className="controls">

        {/* START NODE */}
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

        {/* RUN BFS */}
        <button onClick={bfsTraversal}>
          Run BFS
        </button>

        {/* RANDOM GRAPH */}
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

        {/* NEW GRAPH */}
        <button
          onClick={() =>
            generateGraph("small")
          }
        >
          New Graph
        </button>

        {/* RESET */}
        <button onClick={resetGraph}>
          Reset Graph
        </button>

        {/* MANUAL GRAPH */}
        <button
          onClick={() => {

            setManualMode(!manualMode);

            if (!manualMode) {

              setNodes([]);
              setEdges([]);
              setVisitedNodes([]);
              setActiveEdges([]);
              setResult([]);
              setSelectedNode(null);

            }

            else {

              generateGraph("small");

            }

          }}
        >
          {manualMode
            ? "Exit Manual Mode"
            : "Manual Graph"}
        </button>

        {/* GRAPH TYPE */}
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

        {/* SPEED */}
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

        {/* AI BUTTON */}
        <button
          className="ai-toggle-btn"
          onClick={() =>
            setChatOpen(!chatOpen)
          }
        >
          {chatOpen
            ? "Close AlgoQuest AI"
            : "Ask AlgoQuest AI"}
        </button>

      </section>

      {/* GRAPH + CHAT */}
      <div className="visualizer-layout">

        {/* GRAPH */}
        <div className="graph-container">

          <canvas
            ref={canvasRef}
            width={700}
            height={430}
            onClick={handleCanvasClick}
          />

        </div>

        {/* CHATBOT */}
        {chatOpen && (

          <div className="chatbot-panel">

            <AIChat />

          </div>

        )}

      </div>

      {/* OUTPUT */}
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

export default BFSVisualizer;