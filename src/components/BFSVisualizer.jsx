import { useEffect, useRef, useState } from "react";
import "../styles/visualizer.css";

const BFSVisualizer = () => {
  const canvasRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [startNode, setStartNode] =
    useState(0);

  const [result, setResult] =
    useState([]);

  const [speed, setSpeed] =
    useState(1000);

  const [graphType, setGraphType] =
    useState("directed");

  const [visitedNodes, setVisitedNodes] =
    useState([]);

  const [activeEdges, setActiveEdges] =
    useState([]);

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

    setVisitedNodes([]);

    setActiveEdges([]);

    setResult([]);
  };

  // DRAW ARROW
  const drawArrow = (
    ctx,
    fromX,
    fromY,
    toX,
    toY
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

    ctx.strokeStyle = "gray";

    ctx.lineWidth = 2;

    ctx.stroke();

    // ARROW HEAD
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

    ctx.fillStyle = "yellow";

    ctx.fill();
  };

  // DRAW GRAPH
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

    // NORMAL EDGES
    edges.forEach((edge) => {
      const nodeA = nodes[edge[0]];
      const nodeB = nodes[edge[1]];

      if (!nodeA || !nodeB) return;

      // DIRECTED
      if (graphType === "directed") {
        drawArrow(
          ctx,
          nodeA.x,
          nodeA.y,
          nodeB.x,
          nodeB.y
        );
      }

      // UNDIRECTED
      else {
        ctx.beginPath();

        ctx.moveTo(nodeA.x, nodeA.y);

        ctx.lineTo(nodeB.x, nodeB.y);

        ctx.strokeStyle = "gray";

        ctx.lineWidth = 2;

        ctx.stroke();
      }
    });

    // ACTIVE TRAVERSAL EDGES
    activeEdges.forEach((edge) => {
      const nodeA = nodes[edge[0]];
      const nodeB = nodes[edge[1]];

      if (!nodeA || !nodeB) return;

      ctx.beginPath();

      ctx.moveTo(nodeA.x, nodeA.y);

      ctx.lineTo(nodeB.x, nodeB.y);

      ctx.strokeStyle = "yellow";

      ctx.lineWidth = 4;

      ctx.stroke();
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

      // VISITED NODE
      if (
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

      ctx.fillStyle = "black";

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

  // BFS TRAVERSAL
  const bfsTraversal = async () => {
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

    let queue = [startNode];

    let traversal = [];

    let highlighted = [];

    let traversedEdges = [];

    visited[startNode] = true;

    while (queue.length > 0) {
      let current = queue.shift();

      traversal.push(current);

      highlighted.push(current);

      setVisitedNodes([
        ...highlighted,
      ]);

      await sleep(speed);

      edges.forEach((edge) => {
        const from = edge[0];

        const to = edge[1];

        // DIRECTED GRAPH
        if (
          graphType === "directed"
        ) {
          if (
            from === current &&
            !visited[to]
          ) {
            visited[to] = true;

            queue.push(to);

            traversedEdges.push([
              from,
              to,
            ]);

            setActiveEdges([
              ...traversedEdges,
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

            traversedEdges.push([
              from,
              to,
            ]);

            setActiveEdges([
              ...traversedEdges,
            ]);
          }

          else if (
            to === current &&
            !visited[from]
          ) {
            visited[from] = true;

            queue.push(from);

            traversedEdges.push([
              to,
              from,
            ]);

            setActiveEdges([
              ...traversedEdges,
            ]);
          }
        }
      });
    }

    setResult(traversal);
  };

  // RESET GRAPH
  const resetGraph = () => {
    setVisitedNodes([]);

    setActiveEdges([]);

    setResult([]);
  };

  return (
    <div className="visualizer-page">
      <header>
        <h1>
          Breadth-First Search (BFS)
        </h1>
      </header>

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

        {/* BUTTONS */}
        <button onClick={bfsTraversal}>
          Run BFS
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
      </section>

      {/* GRAPH AREA */}
      <div className="graph-container">
        <canvas
          ref={canvasRef}
          width={700}
          height={430}
        />
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