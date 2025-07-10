const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Azure OpenAI config
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;

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

// --- Emoji Riddle Game Endpoints ---

// POST /api/emoji-riddle: Generate a new emoji riddle (emojis + answer)
app.post("/api/emoji-riddle", async (req, res) => {
  try {
    const prompt = `Generate a creative emoji riddle. Respond ONLY with a single line of valid JSON with two fields: emojis (a string of 2-4 emojis that together represent a well-known, popular word, phrase, or character—such as a famous person, movie, superhero, idiom, or brand) and answer (the solution to the riddle, a single word or short phrase). Each emoji in the combo must contribute to the answer, and the answer should not be the meaning of just one emoji. The answer must be something widely recognized and popular, not obscure or random. Example: {\"emojis\": \"🕷️🧑\", \"answer\": \"spider man\"}. Do not include any explanation or text before or after the JSON.`;
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a creative emoji riddle generator. Only reply in JSON as instructed." },
          { role: "user", content: prompt }
        ],
        max_tokens: 60,
        temperature: 1.0
      })
    });
    const data = await response.json();
    // Try to parse the JSON from the AI's response
    let riddle = null;
    let aiContent = data.choices?.[0]?.message?.content;
    try {
      riddle = JSON.parse(aiContent);
    } catch (e) {
      // Try to extract the first JSON object from the response
      const match = aiContent && aiContent.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          riddle = JSON.parse(match[0]);
        } catch (e2) {
          return res.status(500).json({ error: "Failed to parse AI response", raw: data });
        }
      } else {
        return res.status(500).json({ error: "Failed to parse AI response", raw: data });
      }
    }
    res.json(riddle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get emoji riddle from Azure OpenAI" });
  }
});

// POST /api/emoji-riddle/check: Check if the user's guess matches the answer using AI
app.post("/api/emoji-riddle/check", async (req, res) => {
  const { emojis, answer, guess } = req.body;
  if (!emojis || !answer || !guess) {
    return res.status(400).json({ error: "emojis, answer, and guess are required" });
  }
  try {
    const prompt = `The emoji riddle is: ${emojis}. The correct answer is: ${answer}. The user's guess is: ${guess}. Is the guess correct? Reply ONLY with a single line of valid JSON in the format: {\"correct\": true/false, \"feedback\": \"short feedback for the user\"}. Do not include any explanation or text before or after the JSON.`;
    const response = await fetch(AZURE_OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are an emoji riddle judge. Only reply in JSON as instructed." },
          { role: "user", content: prompt }
        ],
        max_tokens: 40,
        temperature: 0.2
      })
    });
    const data = await response.json();
    let result = null;
    let aiContent = data.choices?.[0]?.message?.content;
    try {
      result = JSON.parse(aiContent);
    } catch (e) {
      // Try to extract the first JSON object from the response
      const match = aiContent && aiContent.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          result = JSON.parse(match[0]);
        } catch (e2) {
          return res.status(500).json({ error: "Failed to parse AI response", raw: data });
        }
      } else {
        return res.status(500).json({ error: "Failed to parse AI response", raw: data });
      }
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check answer with Azure OpenAI" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 