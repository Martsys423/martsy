import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"

// Define the schema using Zod
const responseSchema = z.object({
  summary: z.string().describe("A comprehensive summary of the repository based on the README"),
  coolFacts: z.array(z.string()).describe("A list of interesting facts or key features found in the README"),
  mainTechnologies: z.array(z.string()).describe("List of main technologies and frameworks used"),
  targetAudience: z.string().describe("The target audience or users of this repository"),
  setupComplexity: z.enum(["Simple", "Moderate", "Complex"]).describe("The complexity level of setting up and using the repository")
})

const TEMPLATE = `You are a highly capable AI assistant tasked with analyzing GitHub repositories through their README content.
Please analyze the following README content and provide a comprehensive summary and interesting facts about the repository.

README Content:
{readme}

Provide a structured analysis following these guidelines:
1. Summary should be comprehensive but concise (max 200 words)
2. Cool facts should highlight unique or interesting aspects
3. Main technologies should list key frameworks and tools
4. Target audience should specify who would benefit most
5. Setup complexity should reflect installation/usage difficulty

{format_instructions}

Remember to be objective and base your analysis solely on the README content.`

const parser = StructuredOutputParser.fromZodSchema(responseSchema)
const prompt = PromptTemplate.fromTemplate(TEMPLATE)

// Create the chain
export const createAnalysisChain = () => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: process.env.NEXT_OPENAI_API_KEY
  })

  return RunnableSequence.from([
    {
      readme: (input) => input.readme,
      format_instructions: () => parser.getFormatInstructions(),
    },
    prompt,
    model,
    parser,
  ])
} 