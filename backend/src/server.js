const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const { products } = require("./products");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openaiApiKey = process.env.OPENAI_API_KEY;
let openaiClient = null;
if (openaiApiKey) {
  openaiClient = new OpenAI({
    apiKey: openaiApiKey,
  });
}

function filterProducts(queryParams) {
  const { category, q } = queryParams;
  return products.filter((p) => {
    let ok = true;
    if (category) {
      ok = ok && p.category.toLowerCase() === category.toLowerCase();
    }
    if (q) {
      const haystack = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      ok = ok && haystack.includes(q.toLowerCase());
    }
    return ok;
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", (req, res) => {
  const filtered = filterProducts(req.query);
  res.json({ products: filtered });
});

app.post("/api/ask", async (req, res) => {
  if (!openaiClient) {
    return res.status(503).json({
      error: "LLM is not configured. Please set OPENAI_API_KEY on the server.",
    });
  }

  const { query } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Field 'query' (string) is required." });
  }

  try {
    const productContext = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      tags: p.tags,
      description: p.description,
    }));

    const systemPrompt =
      "You are an assistant that helps users pick products from a catalog. " +
      "You receive a natural language query and a list of products. " +
      "You must respond ONLY with a valid JSON object in this exact shape: " +
      '{ "productIds": [array of product id strings that best match], "summary": "one or two sentence friendly summary for the user" }. ' +
      "If nothing matches well, return an empty productIds array but still give a helpful summary. " +
      "Do NOT include any backticks or extra text, only raw JSON.";

    const userPrompt = `
User query:
${query}

Product catalog (JSON):
${JSON.stringify(productContext, null, 2)}
`;

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const maybeJson = raw.slice(jsonStart, jsonEnd + 1);
        parsed = JSON.parse(maybeJson);
      } else {
        throw err;
      }
    }

    const productIds = Array.isArray(parsed.productIds) ? parsed.productIds : [];
    const summary = typeof parsed.summary === "string" ? parsed.summary : "";

    const matchedProducts = products.filter((p) => productIds.includes(p.id));

    res.json({
      products: matchedProducts,
      productIds,
      summary,
    });
  } catch (error) {
    console.error("Error in /api/ask:", error.message || error);
    res.status(502).json({
      error: "AI service is temporarily unavailable. Please try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});

