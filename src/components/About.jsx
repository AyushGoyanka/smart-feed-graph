import "../styles/about.css";

const About = () => {
  return (
    <section className="about-section" id="about">

      <div className="about-container">

        <h2>About Graph Traversal Visualizer</h2>

        <p>
          The Graph Traversal Visualizer is an interactive platform
          designed to help students and learners understand graph
          traversal algorithms like Breadth First Search (BFS)
          and Depth First Search (DFS).
        </p>

        <div className="about-cards">

          <div className="about-card">
            <h3>BFS Visualization</h3>

            <p>
              Understand queue-based graph traversal visually
              with real-time animations.
            </p>
          </div>

          <div className="about-card">
            <h3>DFS Visualization</h3>

            <p>
              Learn recursive depth-based traversal interactively
              using animated graph exploration.
            </p>
          </div>

          <div className="about-card">
            <h3>Interactive Learning</h3>

            <p>
              Improve algorithmic thinking using real-time
              graph traversal simulations.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default About;