import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <h1>
        Welcome to the Graph
        <br />
        Traversal Visualizer
      </h1>

      <p>
        Explore the world of algorithms like never before. Visualize, learn, and
        grow.
      </p>

      <button
        className="hero-btn"
        onClick={() => {
          document
            .getElementById("visualization-section")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Start Visualizing
      </button>
    </section>
  );
};

export default Hero;
