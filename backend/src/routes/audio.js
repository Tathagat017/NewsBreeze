const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

// Generate audio from text
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Check if Hugging Face API key is available
    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        error: "Audio generation failed",
        message: "Hugging Face API key not configured",
        fallback: true,
      });
    }

    console.log(`Generating audio for text: "${text.substring(0, 50)}..."`);

    // Try multiple TTS models for better reliability
    const ttsModels = [
      "microsoft/speecht5_tts",
      "espnet/kan-bayashi_ljspeech_vits",
      "facebook/mms-tts-eng",
    ];

    let audioGenerated = false;
    let lastError = null;

    for (const model of ttsModels) {
      try {
        console.log(`Trying TTS model: ${model}`);

        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          { inputs: text },
          {
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
            timeout: 30000, // 30 second timeout
          }
        );

        // Check if we got valid audio data
        if (response.data && response.data.byteLength > 1000) {
          console.log(`Audio generated successfully with ${model}`);

          // Set appropriate headers for audio
          res.set({
            "Content-Type": "audio/wav",
            "Content-Length": response.data.length,
            "Cache-Control": "no-cache",
          });

          res.send(response.data);
          audioGenerated = true;
          break;
        }
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }

    // If no model worked, return error
    if (!audioGenerated) {
      console.error("All TTS models failed:", lastError?.message);

      return res.status(500).json({
        error: "Audio generation failed",
        message:
          "All text-to-speech models are currently unavailable. This might be due to rate limits or model loading time.",
        fallback: true,
        details: lastError?.response?.data || lastError?.message,
      });
    }
  } catch (error) {
    console.error("Error generating audio:", error);

    // Handle specific error types
    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        error: "Audio generation timeout",
        message: "The text-to-speech service took too long to respond",
        fallback: true,
      });
    }

    // Fallback: return a simple text response if TTS fails
    res.status(500).json({
      error: "Audio generation failed",
      message: "Text-to-speech service is currently unavailable",
      fallback: true,
    });
  }
});

module.exports = router;
