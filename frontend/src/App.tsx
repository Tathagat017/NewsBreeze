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

  // Get API URL from environment variable, fallback to localhost:8080
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/news`);
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

      const response = await fetch(`${apiUrl}/api/audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();

        // Check if we got valid audio data
        if (audioBlob.size < 1000) {
          throw new Error("Invalid audio data received");
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setPlayingId(null);
          URL.revokeObjectURL(audioUrl);
          console.log("AI audio failed, trying browser fallback...");
          playBrowserTTS(text, articleId);
        };

        // Add loading event
        audio.onloadstart = () => {
          console.log("AI audio loading started...");
        };

        audio.oncanplay = () => {
          console.log("AI audio ready to play");
        };

        await audio.play();
      } else {
        const errorData = await response.json();

        if (errorData.fallback) {
          console.log("AI TTS failed, using browser fallback...");
          // Inform user and use browser TTS
          const useBuiltIn = confirm(
            `AI voice generation is currently unavailable due to:\n• ${errorData.message}\n\nWould you like to use your browser's built-in voice instead?\n(It will sound more robotic but works offline)`
          );

          if (useBuiltIn) {
            playBrowserTTS(text, articleId);
          } else {
            setPlayingId(null);
          }
        } else {
          setPlayingId(null);
          alert(
            `Failed to generate audio: ${errorData.message || "Unknown error"}`
          );
        }
      }
    } catch (err) {
      console.error("Error with AI audio:", err);

      if (err instanceof Error) {
        if (err.message.includes("Invalid audio data")) {
          console.log("Invalid AI audio data, trying browser fallback...");
          playBrowserTTS(text, articleId);
        } else if (err.message.includes("network")) {
          // Offer browser TTS for network issues
          const useBuiltIn = confirm(
            "Network error connecting to AI voice service.\n\nWould you like to use your browser's built-in voice instead?"
          );

          if (useBuiltIn) {
            playBrowserTTS(text, articleId);
          } else {
            setPlayingId(null);
          }
        } else {
          setPlayingId(null);
          alert(`Audio error: ${err.message}`);
        }
      } else {
        setPlayingId(null);
        alert("Failed to play audio. Please try again.");
      }
    }
  };

  // Browser's built-in Text-to-Speech fallback
  const playBrowserTTS = (text: string, articleId: string) => {
    try {
      // Check if browser supports speech synthesis
      if (!("speechSynthesis" in window)) {
        setPlayingId(null);
        alert("Your browser does not support text-to-speech functionality.");
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Function to set the best available voice
      const setBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.includes("Google") ||
              voice.name.includes("Microsoft") ||
              voice.name.includes("Natural"))
        );

        if (englishVoice) {
          utterance.voice = englishVoice;
          console.log(`Using voice: ${englishVoice.name}`);
        } else if (voices.length > 0) {
          // Fallback to first English voice
          const anyEnglishVoice = voices.find((voice) =>
            voice.lang.startsWith("en")
          );
          if (anyEnglishVoice) {
            utterance.voice = anyEnglishVoice;
            console.log(`Using fallback voice: ${anyEnglishVoice.name}`);
          }
        }
      };

      // Set voice immediately if available, or wait for voices to load
      if (window.speechSynthesis.getVoices().length > 0) {
        setBestVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setBestVoice;
      }

      utterance.onstart = () => {
        console.log(`Browser TTS started for article ${articleId}`);
      };

      utterance.onend = () => {
        console.log(`Browser TTS ended for article ${articleId}`);
        setPlayingId(null);
      };

      utterance.onerror = (event) => {
        console.error(
          `Browser TTS error for article ${articleId}:`,
          event.error
        );
        setPlayingId(null);
        alert("Browser text-to-speech failed. Please try again.");
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error(`Browser TTS error for article ${articleId}:`, error);
      setPlayingId(null);
      alert("Browser text-to-speech is not available.");
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
