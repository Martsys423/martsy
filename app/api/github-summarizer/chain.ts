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
    Analyze the following GitHub repository README and provide:
    1. A concise summary (max 200 words)
    2. 3 cool/interesting facts about the project
    3. Main technologies used (as an array)
    4. Target audience
    5. Setup complexity (Simple, Moderate, or Complex)

    README:
    {readme}

    Respond in JSON format with the following structure:
    {
      "summary": "...",
      "coolFacts": ["fact1", "fact2", "fact3"],
      "mainTechnologies": ["tech1", "tech2", "tech3"],
      "targetAudience": "...",
      "setupComplexity": "Simple|Moderate|Complex"
    }

    Make sure to return valid JSON that can be parsed.
  `);

  // Use a simpler output parser to avoid the complex type issues
  return prompt.pipe(model).pipe(new StringOutputParser());
} 