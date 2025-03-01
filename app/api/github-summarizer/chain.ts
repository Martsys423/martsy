import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export function createAnalysisChain() {
  // Check if OpenAI API key is set with the correct variable name
  const apiKey = process.env.NEXT_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error("Neither NEXT_OPENAI_API_KEY nor OPENAI_API_KEY is set in environment variables");
  } else {
    console.log("OpenAI API key is set (length:", apiKey.length, ")");
  }

  // Use the correct API key
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.2,
    maxTokens: 2000,
    openAIApiKey: apiKey
  });

  console.log("Creating analysis chain with model:", model.modelName);

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