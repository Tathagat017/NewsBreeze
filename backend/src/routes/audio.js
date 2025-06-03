const express = require("express");
const axios = require("axios");
const router = express.Router();

// Generate audio from text
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Use Hugging Face TTS model (using a simpler model that's more reliable)
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    // Set appropriate headers for audio
    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": response.data.length,
    });

    res.send(response.data);
  } catch (error) {
    console.error("Error generating audio:", error);

    // Fallback: return a simple text response if TTS fails
    res.status(500).json({
      error: "Audio generation failed",
      message: "Text-to-speech service is currently unavailable",
      fallback: true,
    });
  }
});

module.exports = router;
