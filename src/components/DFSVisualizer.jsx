import { useEffect, useRef, useState } from "react";
import "../styles/visualizer.css";
import AIChat from "../components/AIChat";

const DFSVisualizer = () => {
  const canvasRef = useRef(null);

  // GRAPH STATES
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // DFS STATES
  const [startNode, setStartNode] =
    useState(0);

  const [result, setResult] = useState([]);

  // VISUAL STATES
  const [visitedNodes, setVisitedNodes] =
    useState([]);

  const [activeEdges, setActiveEdges] =
    useState([]);

  // SETTINGS
  const [speed, setSpeed] =
    useState(1000);

  const [graphType, setGraphType] =
    useState("directed");

  // CHATBOT
  const [showChat, setShowChat] =
    useState(false);

  // MANUAL GRAPH
  const [manualMode, setManualMode] =
    useState(false);

  const [selectedNode, setSelectedNode] =
    useState(null);

  // INITIAL GRAPH
  useEffect(() => {
    generateGraph("small");
  }, []);

  // REDRAW GRAPH
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

  // GENERATE GRAPH
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

  // MANUAL GRAPH CLICK
  const handleCanvasClick = (e) => {
    if (!manualMode) return;

    const canvas = canvasRef.current;

    const rect =
      canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    let clickedNode = null;

    // CHECK NODE CLICK
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

    // CREATE NEW NODE
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

  // DRAW ARROW
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

    // ARROW HEAD
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

  // DRAW GRAPH
  const drawGraph = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

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
          (active) =>
            active[0] === edge[0] &&
            active[1] === edge[1]
        );

      // DIRECTED
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

      // UNDIRECTED
      else {
        ctx.beginPath();

        ctx.moveTo(nodeA.x, nodeA.y);

        ctx.lineTo(nodeB.x, nodeB.y);

        ctx.strokeStyle = isActive
          ? "yellow"
          : "gray";

        ctx.lineWidth = isActive ? 4 : 2;

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
        ctx.fillStyle = "red";
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

  // DELAY
  const sleep = (ms) => {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  };

  // DFS TRAVERSAL
  const dfsTraversal = async () => {
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

        // DIRECTED
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

        // UNDIRECTED
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

  // RESET GRAPH
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
          Depth-First Search (DFS)
        </h1>
      </header>

      {/* CONTROLS */}
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

        {/* MANUAL GRAPH */}
        <button
          onClick={() => {
            setManualMode(!manualMode);

            // ENTER MANUAL MODE
            if (!manualMode) {
              setNodes([]);

              setEdges([]);

              resetGraph();
            }

            // EXIT MANUAL MODE
            else {
              generateGraph("small");
            }
          }}
        >
          {manualMode
            ? "Exit Manual Graph"
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

        {/* SPEED CONTROL */}
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
            setShowChat(!showChat)
          }
        >
          {showChat
            ? "Close AlgoQuest AI"
            : "Ask AlgoQuest AI"}
        </button>
      </section>

      {/* MAIN LAYOUT */}
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
        {showChat && (
          <div className="chat-sidebar">
            <AIChat />
          </div>
        )}
      </div>

      {/* OUTPUT */}
      <section className="output">

        <h2>
          Traversal Order:
        </h2>

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