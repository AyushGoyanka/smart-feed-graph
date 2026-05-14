import "../styles/struggle.css";

import graph1 from "../assets/image1.jpg";
import graph2 from "../assets/image2.jpg";
import graph3 from "../assets/image3.jpg";

const StruggleSection = () => {
  return (
    <section className="struggle-section">

      <h2>
        Why Understanding Graph Traversal is Challenging?
      </h2>

      <div className="image-container">

        <img src={graph1} alt="" className="graph-image" />
        <img src={graph2} alt="" className="graph-image" />
        <img src={graph3} alt="" className="graph-image" />

      </div>

      <p>
        Many students struggle to grasp graph traversal concepts
        like BFS and DFS.
      </p>

    </section>
  );
};

export default StruggleSection;