const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const { OpenAI } = require("openai");
// const fetch = require("node-fetch"); // REMOVED for Node.js v24+

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Azure OpenAI config
const AZURE_OPENAI_ENDPOINT = "";
const AZURE_OPENAI_API_KEY = "";

// // OpenAI setup (commented out)
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a witty, fun assistant for a happy company website.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 100,
        temperature: 0.8
      })
    });
    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "(No response from AI)";
    res.json({ aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get response from Azure OpenAI" });
  }
});

app.post("/api/tictactoe-ai-move", async (req, res) => {
  const { board } = req.body;
  if (!Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ error: "Invalid board" });
  }
  try {
    const prompt = `You are playing Tic Tac Toe as O. The board is an array of 9 elements, where each element is either \"X\", \"O\", or null. Return the index (0-8) where you want to play your next move as O. Only reply with the number, nothing else. Here is the board: ${JSON.stringify(
      board
    )}.`;
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a Tic Tac Toe AI. Only reply with the index (0-8) of your move.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 3,
        temperature: 0.2
      })
    });
    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content?.trim() || "";
    const move = parseInt(aiText, 10);
    if (isNaN(move) || move < 0 || move > 8 || board[move]) {
      return res
        .status(500)
        .json({ error: "AI returned invalid move", aiText });
    }
    res.json({ move });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get move from Azure OpenAI" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 