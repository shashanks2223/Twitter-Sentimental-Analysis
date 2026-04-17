import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Mock "Twitter Stream" with predefined topics
  const TOPICS = ["AI", "Crypto", "SpaceX", "Climate", "Election", "Gaming"];
  const SENTIMENTS = ["positive", "negative", "neutral"];
  const TWEET_TEMPLATES = [
    "Just saw the new {topic} update, absolutely mind-blowing! 🚀",
    "Not sure how I feel about the latest {topic} news. Seems risky. 🤔",
    "Why is {topic} trending again? This is getting old. 🙄",
    "The future of {topic} looks bright. Can't wait for what's next! ✨",
    "Really disappointed with the {topic} results today. 📉",
    "Just another day talking about {topic}. Same old stuff. 🥱",
  ];

  function generateMockTweet() {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const template = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
    const text = template.replace("{topic}", topic);
    
    // In a real PySpark apps, classification happens in the Spark worker.
    // We simulate that metadata here.
    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    if (text.includes("mind-blowing") || text.includes("bright") || text.includes("🚀") || text.includes("✨")) {
      sentiment = "positive";
    } else if (text.includes("risky") || text.includes("disappointed") || text.includes("📉") || text.includes("🙄")) {
      sentiment = "negative";
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      text,
      topic,
      sentiment,
      timestamp: new Date().toISOString(),
      user: `user_${Math.floor(Math.random() * 1000)}`,
    };
  }

  // Socket.io for Real-Time data
  io.on("connection", (socket) => {
    console.log("Client connected to SentimentStream");

    // Simulate the PySpark Streaming Micro-Batching (e.g., every 2 seconds)
    const interval = setInterval(() => {
      const tweets = Array.from({ length: 3 }, () => generateMockTweet());
      socket.emit("tweet_batch", tweets);
    }, 2000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "streaming active", engine: "Virtual Spark Core" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Sentiment Analysis Dashboard running at http://0.0.0.0:${PORT}`);
    console.log(`Backend Engine: PySpark Emulation Layer`);
  });
}

startServer();
