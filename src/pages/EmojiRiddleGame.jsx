import React, { useState } from "react";

const EmojiRiddleGame = () => {
  const [riddle, setRiddle] = useState(null); // { emojis, answer }
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const generateRiddle = async () => {
    setLoading(true);
    setError("");
    setFeedback("");
    setRiddle(null);
    setGuess("");
    try {
      const res = await fetch("/api/emoji-riddle", { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch riddle");
      const data = await res.json();
      setRiddle(data);
    } catch (err) {
      setError("Could not generate riddle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitGuess = async (e) => {
    e.preventDefault();
    if (!riddle || !guess.trim()) return;
    setChecking(true);
    setFeedback("");
    setError("");
    try {
      const res = await fetch("/api/emoji-riddle/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emojis: riddle.emojis,
          answer: riddle.answer,
          guess,
        }),
      });
      if (!res.ok) throw new Error("Failed to check answer");
      const data = await res.json();
      setFeedback(data.feedback || (data.correct ? "Correct!" : "Try again!"));
    } catch (err) {
      setError("Could not check answer. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #0001", background: "#fff" }}>
      <h2>Emoji Riddle Game</h2>
      <button onClick={generateRiddle} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? "Generating..." : "Generate Combo"}
      </button>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {riddle && (
        <div style={{ fontSize: 48, margin: "16px 0" }}>{riddle.emojis}</div>
      )}
      {riddle && (
        <form onSubmit={submitGuess} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            placeholder="Your guess..."
            value={guess}
            onChange={e => setGuess(e.target.value)}
            disabled={checking}
            style={{ fontSize: 18, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button type="submit" disabled={checking || !guess.trim()} style={{ fontSize: 16 }}>
            {checking ? "Checking..." : "Submit"}
          </button>
        </form>
      )}
      {feedback && <div style={{ marginTop: 12, fontWeight: "bold" }}>{feedback}</div>}
    </div>
  );
};

export default EmojiRiddleGame; 