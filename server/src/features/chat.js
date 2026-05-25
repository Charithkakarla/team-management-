// Chat feature: Gemini-backed assistant endpoint.
// Chat feature: Gemini-backed assistant endpoint.
// It sends user messages to the Gemini API and returns replies.
// Use this file to understand the assistant backend.
import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler.js";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

export const sendChatMessage = async ({ message, context = "" }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey) {
    return "GEMINI_API_KEY is not configured yet. Add it to your server .env file to enable chatbot replies.";
  }

  const response = await fetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                "You are a concise operations assistant for a team management dashboard.",
                context ? `Context: ${context}` : "",
                `User question: ${message}`
              ].filter(Boolean).join("\n")
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Chat request failed");
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("")?.trim() || "I could not generate a response.";
};

const postChatController = asyncHandler(async (req, res) => {
  const reply = await sendChatMessage({ message: req.body?.message || "", context: req.body?.context || "" });
  res.json({ reply });
});

export const chatRouter = Router();

chatRouter.post("/", postChatController);