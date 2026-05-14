import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// GROQ CLIENT
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});

// CHAT ROUTE
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",

            content:
              "You are an AI tutor for BFS, DFS and Graph Algorithms. Explain in simple language.",
          },

          {
            role: "user",

            content: message,
          },
        ],
      });

    res.json({
      reply:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// SERVER START
app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});