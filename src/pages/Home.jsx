import Header from "../components/Header";
import Hero from "../components/Hero";
import StruggleSection from "../components/StruggleSection";
import About from "../components/About";
import VisualizationOptions from "../components/VisualizationOptions";
import Feedback from "../components/Feedback";

const Home = ({ setPage }) => {
  return (
    <>
      <Header />
      <Hero />
      <StruggleSection />
      <About />
      <VisualizationOptions setPage={setPage} />
      <Feedback />
    </>
  );
};

export default Home;



