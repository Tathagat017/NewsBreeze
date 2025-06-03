const express = require("express");
const axios = require("axios");
const router = express.Router();

// Fetch and summarize news
router.get("/", async (req, res) => {
  try {
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
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Function to summarize text using Hugging Face
async function summarizeText(text) {
  try {
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
      return text.substring(0, 100) + "..."; // Fallback to truncated text
    }
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    return text.substring(0, 100) + "..."; // Fallback to truncated text
  }
}

module.exports = router;
