const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/generate", async (req, res) => {
  const prompt = `
You are a student at J2B Academy. Write 3 short and friendly Google reviews (3 lines each) using mixed Hindi-English.

Focus on:
- NSD/FTII experienced faculty
- Positive experience
- Acting career guidance
- Prince sir
- Should join

1. ...
2. ...
3. ...
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ text });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    res.status(500).json({ error: "AI generation failed." });
  }
});

app.listen(3000, () => {
  console.log("✅ J2B AI Server running with Gemini at http://localhost:3000");
});
