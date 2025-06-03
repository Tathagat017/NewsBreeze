import React, { useState, useEffect } from "react";
import "./App.css";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  summary: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/news`);
      const data = await response.json();

      if (response.ok) {
        setArticles(data.articles);
      } else {
        setError("Failed to fetch news");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text: string, articleId: string) => {
    try {
      setPlayingId(articleId);

      const response = await fetch(`${baseUrl}/api/audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
          alert("Audio playback failed");
        };

        await audio.play();
      } else {
        const errorData = await response.json();
        if (errorData.fallback) {
          alert(
            "Audio generation is currently unavailable. Please try again later."
          );
        } else {
          alert("Failed to generate audio");
        }
        setPlayingId(null);
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      alert("Failed to play audio");
      setPlayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>📰 NewsBreeze</h1>
          <p>Your AI-powered news companion</p>
        </header>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>📰 NewsBreeze</h1>
          <p>Your AI-powered news companion</p>
        </header>
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={fetchNews} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📰 NewsBreeze</h1>
        <p>Your AI-powered news companion</p>
        <button onClick={fetchNews} className="refresh-btn">
          🔄 Refresh News
        </button>
      </header>

      <main className="news-container">
        {articles.map((article) => (
          <article key={article.id} className="news-item">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="news-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}

            <div className="news-content">
              <h2 className="news-title">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </h2>

              <div className="news-summary">
                <h3>📝 AI Summary:</h3>
                <p>{article.summary}</p>
              </div>

              <div className="news-actions">
                <button
                  onClick={() => playAudio(article.summary, article.id)}
                  disabled={playingId === article.id}
                  className="play-btn"
                >
                  {playingId === article.id ? "🔊 Playing..." : "🎵 Listen"}
                </button>

                <span className="news-date">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default App;
