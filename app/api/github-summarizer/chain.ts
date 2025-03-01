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
      "analysis": {
        "summary": "...",
        "coolFacts": ["fact1", "fact2", "fact3"],
        "mainTechnologies": ["tech1", "tech2", "tech3"],
        "targetAudience": "...",
        "setupComplexity": "Simple|Moderate|Complex"
      }
    }
  `);

  return prompt.pipe(model).pipe(
    StructuredOutputParser.fromZodSchema(
      z.object({
        analysis: z.object({
          summary: z.string(),
          coolFacts: z.array(z.string()),
          mainTechnologies: z.array(z.string()),
          targetAudience: z.string(),
          setupComplexity: z.enum(["Simple", "Moderate", "Complex"])
        })
      })
    )
  );
} 