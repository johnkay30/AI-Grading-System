import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { pipeline } from "@huggingface/transformers";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SBERT Scoring Logic (using transformers.js)
  let extractor: any = null;
  const getExtractor = async () => {
    if (!extractor) {
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
  };

  function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // API Routes
  app.post("/api/score", async (req, res) => {
    try {
      const { modelAnswer, studentResponse } = req.body;
      if (!modelAnswer || !studentResponse) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const extract = await getExtractor();
      
      // Get embeddings
      const outputModel = await extract(modelAnswer, { pooling: 'mean', normalize: true });
      const outputStudent = await extract(studentResponse, { pooling: 'mean', normalize: true });

      const vecModel = Array.from(outputModel.data as Float32Array);
      const vecStudent = Array.from(outputStudent.data as Float32Array);

      const similarity = cosineSimilarity(vecModel, vecStudent);
      
      // Map 0.0-1.0 to 0-10 scale
      const score = Math.min(10, Math.max(0, similarity * 10));
      
      res.json({ score: parseFloat(score.toFixed(2)), similarity });
    } catch (error) {
      console.error("Scoring error:", error);
      res.status(500).json({ error: "Failed to calculate score" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
