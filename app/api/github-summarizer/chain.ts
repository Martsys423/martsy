import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export function createAnalysisChain() {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are an expert GitHub repository analyzer. Your task is to analyze the README of a repository and extract key information.
    
    Analyze the following GitHub repository README and provide:
    1. A concise summary (max 150 words) that explains what the project does, its purpose, and its main features
    2. 3 specific and interesting facts about the project that would appeal to developers
    3. Main technologies used (identify programming languages, frameworks, and tools mentioned)
    4. Target audience (who would use this project and why)
    5. Setup complexity (Simple, Moderate, or Complex) based on installation instructions
    
    README:
    {readme}
    
    IMPORTANT: You must respond with ONLY a valid JSON object with the following structure:
    
    {
      "summary": "Concise description of what the project does",
      "coolFacts": ["Specific fact 1", "Specific fact 2", "Specific fact 3"],
      "mainTechnologies": ["Language1", "Framework2", "Tool3"],
      "targetAudience": "Description of target users",
      "setupComplexity": "Simple|Moderate|Complex"
    }
    
    Ensure your response is properly formatted JSON with no trailing commas, and all strings are properly quoted.
    Do not include any text outside the JSON object. Do not use markdown formatting within the JSON values.
  `);

  // Use a simpler output parser to avoid the complex type issues
  return prompt.pipe(model).pipe(new StringOutputParser());
} 