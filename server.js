const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (for HTML, CSS, JS)
app.use(express.static(__dirname));

// Load Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Serve HTML page at root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "re.html"));
});

// Gemini AI POST route
app.post("/generate", async (req, res) => {
  const prompt = `
You are a student at J2B Academy. Write 3 short and friendly Google reviews (3 lines each) using mixed Hindi-English.

Focus on:
- Positive experience
- Acting career guidance
- Prince pandey sir
- Hostel 
- Should join
- Best tching faculty
- Low fees
- Real set for acting

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
    let text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Remove asterisks
    text = text.replace(/\*/g, "");

    // Remove emojis using regex
    text = text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/g,
      ""
    );

    res.json({ text });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    res.status(500).json({ error: "AI generation failed." });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `✅ J2B AI Server running with Gemini at http://localhost:${PORT}`
  );
});
