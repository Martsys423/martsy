import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export function createAnalysisChain() {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-16k",
    temperature: 0
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are a GitHub repository analyzer. Your task is to analyze the README of a repository and extract key information.
    
    Analyze the following GitHub repository README and provide:
    1. A concise summary (max 200 words)
    2. 3 cool/interesting facts about the project
    3. Main technologies used (as an array)
    4. Target audience
    5. Setup complexity (Simple, Moderate, or Complex)

    README:
    {readme}

    IMPORTANT: You must respond with ONLY a valid JSON object in the following format, with no additional text, markdown, or explanations:
    
    {
      "summary": "A concise description of the project",
      "coolFacts": ["fact1", "fact2", "fact3"],
      "mainTechnologies": ["tech1", "tech2", "tech3"],
      "targetAudience": "Description of who would use this",
      "setupComplexity": "Simple"
    }
    
    Ensure your response is properly formatted JSON with no trailing commas, and all strings are properly quoted.
    Do not include any text outside the JSON object.
  `);

  // Use a simpler output parser to avoid the complex type issues
  return prompt.pipe(model).pipe(new StringOutputParser());
} 