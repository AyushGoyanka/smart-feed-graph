import { useState } from "react";
import "../styles/feedback.css";



const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.name &&
      formData.email &&
      formData.message
    ) {
      setResponse(
        `Thank you for your feedback, ${formData.name}!`
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } else {
      setResponse("Please fill all fields!");
    }
  };

  return (
    <section id="feedback" className="feedback-section">
      <h2>We Value Your Feedback!</h2>

      <p>
        Let us know your thoughts about the Graph
        Traversal Visualizer.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Your Name:</label>

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Your Email:</label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Your Feedback:</label>

        <textarea
          name="message"
          rows="4"
          placeholder="Write your feedback here..."
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">
          Submit Feedback
        </button>
      </form>

      <p className="feedback-response">
        {response}
      </p>
    </section>
  );
};

export default Feedback;