// import { Link } from "react-router-dom";
// import "../styles/header.css";

// const Header = () => {
//   return (
//     <header>
//       <h2 id="heading">AlgoQuest</h2>

//       <nav>
//         <ul>
//           <li><a href="#about">About</a></li>
//           <li><a href="#visualize-options">Visualization</a></li>
//           <li><a href="#feedback">Feedback</a></li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;









import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">AlgoQuest</h1>

      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#visualize-options">Visualization</a></li>
        <li><a href="#feedback">Feedback</a></li>
      </ul>
    </header>
  );
};

export default Header;