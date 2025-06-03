const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

// Fetch and summarize news
router.get("/", async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({
        error: "NEWS_API_KEY not configured in environment variables",
        message: "Please add your NewsAPI key to the .env file",
      });
    }

    console.log("Fetching news from NewsAPI...");

    // Fetch news from NewsAPI
    const newsResponse = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          country: "us",
          pageSize: 5,
          apiKey: process.env.NEWS_API_KEY,
        },
      }
    );

    const articles = newsResponse.data.articles;

    if (!articles || articles.length === 0) {
      return res.json({
        articles: [],
        message: "No articles found",
      });
    }

    console.log(`Found ${articles.length} articles, summarizing...`);

    // Summarize each article
    const summarizedNews = await Promise.all(
      articles.map(async (article) => {
        try {
          const summary = await summarizeText(
            article.title + ". " + (article.description || "")
          );
          return {
            id: Math.random().toString(36).substr(2, 9),
            title: article.title,
            description: article.description,
            summary: summary,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
          };
        } catch (error) {
          console.error("Error summarizing article:", error);
          return {
            id: Math.random().toString(36).substr(2, 9),
            title: article.title,
            description: article.description,
            summary: article.description || "Summary not available",
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
          };
        }
      })
    );

    res.json({ articles: summarizedNews });
  } catch (error) {
    console.error("Error fetching news:", error);

    // Handle specific API errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;

      if (status === 401) {
        return res.status(401).json({
          error: "Invalid API key",
          message: "Please check your NewsAPI key in the .env file",
          details: message,
        });
      } else if (status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests to NewsAPI. Please try again later.",
          details: message,
        });
      } else {
        return res.status(status).json({
          error: "NewsAPI error",
          message: message,
          status: status,
        });
      }
    }

    res.status(500).json({
      error: "Failed to fetch news",
      message: "Internal server error",
    });
  }
});

// Function to summarize text using Hugging Face
async function summarizeText(text) {
  try {
    // Skip summarization if no Hugging Face key
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.log("No Hugging Face API key, using original text");
      return text.substring(0, 150) + "...";
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/falconsai/text_summarization",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    } else {
      return text.substring(0, 150) + "..."; // Fallback to truncated text
    }
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    return text.substring(0, 150) + "..."; // Fallback to truncated text
  }
}

module.exports = router;
