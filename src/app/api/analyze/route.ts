import { NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";


const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    if (!ai) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from .env.local." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const decision =
      typeof body.decision === "string" ? body.decision.trim() : "";
    const context =
      typeof body.context === "string" ? body.context.trim() : "";

    if (!decision) {
      return NextResponse.json(
        { error: "Please describe your decision first." },
        { status: 400 }
      );
    }

    if (decision.length > 2000 || context.length > 3000) {
      return NextResponse.json(
        { error: "Please shorten your decision or additional context." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
   model: "gemini-3.5-flash-lite",
      contents: `
You are WhatIf AI, a thoughtful decision analysis assistant.

Analyze the user's decision. Do not claim to predict the future.
Consider uncertainty, personal circumstances, risks, and practical choices.
Do not make up facts about the user.

Decision: ${decision}

Additional context: ${context || "No additional context provided."}

Return ONLY a JSON object with this structure:
{
  "summary": "A short balanced summary of the decision",
  "scenarios": [
    {
      "name": "Best case",
      "subtitle": "A positive possibility",
      "description": "A specific possible positive outcome",
      "takeaway": "A practical action to support this outcome"
    },
    {
      "name": "Realistic case",
      "subtitle": "A balanced possibility",
      "description": "A balanced possible outcome including uncertainty",
      "takeaway": "A practical next step"
    },
    {
      "name": "Worst case",
      "subtitle": "A challenging possibility",
      "description": "A plausible challenging outcome, without unnecessary alarm",
      "takeaway": "A practical way to reduce the risk"
    }
  ],
  "nextSteps": [
    "First practical action",
    "Second practical action",
    "Third practical action"
  ]
}
`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            scenarios: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  subtitle: { type: "STRING" },
                  description: { type: "STRING" },
                  takeaway: { type: "STRING" },
                },
                required: [
                  "name",
                  "subtitle",
                  "description",
                  "takeaway",
                ],
              },
            },
            nextSteps: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
          required: ["summary", "scenarios", "nextSteps"],
        },
      },
    });

    if (!response.text) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    const result = JSON.parse(response.text);

    if (
      !result.summary ||
      !Array.isArray(result.scenarios) ||
      result.scenarios.length !== 3 ||
      !Array.isArray(result.nextSteps)
    ) {
      return NextResponse.json(
        { error: "The AI returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("WhatIf AI analysis error:", error);

    return NextResponse.json(
      { error: "Analysis failed. Check your API setup and try again." },
      { status: 500 }
    );
  }
}
