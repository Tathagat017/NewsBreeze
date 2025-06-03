# 📰 NewsBreeze - AI-Powered News Reader

NewsBreeze is a minimalist news aggregation app that fetches the latest headlines, summarizes them using AI, and reads the summaries aloud using text-to-speech technology.

## ✨ Features

- **Latest News**: Fetches top 5 headlines from NewsAPI
- **AI Summaries**: Summarizes each article using Hugging Face's `falconsai/text_summarization` model
- **Text-to-Speech**: Converts summaries to audio using Hugging Face's TTS models
- **Clean UI**: Modern, responsive design with smooth animations
- **Real-time Updates**: Refresh news with a single click

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express
- **NewsAPI** for fetching headlines
- **Hugging Face API** for text summarization and text-to-speech
- **Axios** for HTTP requests

### Frontend

- **React** with TypeScript
- **Modern CSS** with gradients and animations
- **Responsive Design** for mobile and desktop

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for NewsAPI and Hugging Face

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NewsBreeze
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
NEWS_API_KEY=your_newsapi_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Get API Keys

#### NewsAPI Key

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key to the `.env` file

#### Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co/)
2. Create an account and go to Settings > Access Tokens
3. Create a new token and copy it to the `.env` file

### 5. Run the Application

Start the backend server:

```bash
cd backend
npm run dev
```

In a new terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The app will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📡 API Endpoints

### GET /api/news

Fetches and returns the latest news headlines with AI-generated summaries.

**Response:**

```json
{
  "articles": [
    {
      "id": "unique_id",
      "title": "Article Title",
      "description": "Article description",
      "summary": "AI-generated summary",
      "url": "article_url",
      "urlToImage": "image_url",
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/audio

Generates audio from text using text-to-speech.

**Request:**

```json
{
  "text": "Text to convert to speech"
}
```

**Response:** Audio file (WAV format)

## 🎯 Usage

1. **View News**: The app automatically loads the latest news on startup
2. **Read Summaries**: Each article shows an AI-generated summary
3. **Listen to Audio**: Click the "🎵 Listen" button to hear the summary
4. **Refresh**: Use the "🔄 Refresh News" button to get the latest headlines
5. **Read Full Article**: Click on article titles to read the complete story

## 🧪 Testing

### Manual Test Checklist

- [ ] Headlines display in UI
- [ ] Summaries are shown for each article
- [ ] Play button works and plays audio
- [ ] App remains stable on refresh
- [ ] Responsive design works on mobile
- [ ] Error handling works when APIs are unavailable

### Test the API

```bash
# Test news endpoint
curl http://localhost:5000/api/news

# Test audio endpoint
curl -X POST http://localhost:5000/api/audio \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}' \
  --output test-audio.wav
```

## 🔧 Configuration

### Environment Variables

- `NEWS_API_KEY`: Your NewsAPI key
- `HUGGINGFACE_API_KEY`: Your Hugging Face API key
- `PORT`: Backend server port (default: 5000)

### Customization

- **News Source**: Modify the NewsAPI parameters in `backend/src/routes/news.js`
- **Summary Model**: Change the Hugging Face model in the summarization function
- **TTS Model**: Update the text-to-speech model in `backend/src/routes/audio.js`
- **Styling**: Customize the appearance in `frontend/src/App.css`

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running on port 5000
2. **API Key Errors**: Verify your API keys are correct and have proper permissions
3. **Audio Not Playing**: Check browser permissions for audio playback
4. **Slow Loading**: Hugging Face models may take time to load initially

### Error Messages

- "Failed to fetch news": Check your NewsAPI key and internet connection
- "Audio generation failed": Verify your Hugging Face API key
- "Failed to connect to server": Ensure the backend is running

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for the AI-powered news experience**
