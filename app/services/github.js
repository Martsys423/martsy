import { APIError } from '@/app/utils/error-handler'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/app/constants'
import { createAnalysisChain } from '@/app/api/github-summarizer/chain'
import { getGitHubReadme, validateGitHubUrl } from '@/app/api/github-summarizer/github'
import { createClient } from '@supabase/supabase-js'

export const githubService = {
  async validateRequest(apiKey, githubUrl) {
    // Clean the API key
    const cleanApiKey = apiKey?.trim()
    
    console.log('GitHub Service - Validating request:', { 
      originalApiKey: apiKey,
      cleanApiKey,
      apiKeyLength: cleanApiKey?.length,
      githubUrl 
    })

    // Direct database check instead of using validation function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    console.log('GitHub Service - Checking key directly in database')
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', cleanApiKey)
      .maybeSingle()
    
    console.log('GitHub Service - Direct DB check result:', {
      found: !!data,
      error: error?.message || 'none'
    })
    
    if (error) {
      console.error('GitHub Service - Database error:', error)
      throw new APIError(
        "Database error checking API key", 
        HTTP_STATUS.SERVER_ERROR
      )
    }
    
    if (!data) {
      console.log('GitHub Service - No matching key found')
      throw new APIError(
        "Invalid API key", 
        HTTP_STATUS.UNAUTHORIZED
      )
    }

    // Validate GitHub URL
    const urlValidation = validateGitHubUrl(githubUrl)
    console.log('GitHub Service - URL validation result:', urlValidation)

    if (!urlValidation.isValid) {
      throw new APIError(
        urlValidation.message, 
        HTTP_STATUS.BAD_REQUEST
      )
    }
  },

  async analyzeRepository(githubUrl) {
    // Fetch README content
    const readmeResult = await getGitHubReadme(githubUrl)
    
    if (!readmeResult.success) {
      throw new APIError(
        "Failed to fetch README", 
        HTTP_STATUS.SERVER_ERROR
      )
    }

    // Log README content length and preview
    const readmeContent = readmeResult.content;
    console.log(`README content length: ${readmeContent.length}`);
    console.log(`README preview: ${readmeContent.substring(0, 200)}...`);
    
    try {
      // Try direct OpenAI API call instead of using LangChain
      console.log("Making direct OpenAI API call...");
      
      // Check if OpenAI API key is set
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not set in environment variables");
        throw new Error("OpenAI API key is not configured");
      }
      
      // Make direct API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert GitHub repository analyzer. Analyze the README and provide information in JSON format."
            },
            {
              role: "user",
              content: `Analyze this GitHub repository README and provide: 
                1. A concise summary (max 150 words)
                2. 3 specific and interesting facts about the project
                3. Main technologies used
                4. Target audience
                5. Setup complexity (Simple, Moderate, or Complex)
                
                Respond ONLY with valid JSON in this format:
                {
                  "summary": "description",
                  "coolFacts": ["fact1", "fact2", "fact3"],
                  "mainTechnologies": ["tech1", "tech2", "tech3"],
                  "targetAudience": "description",
                  "setupComplexity": "Simple|Moderate|Complex"
                }
                
                README:
                ${readmeContent.substring(0, 4000)}`
            }
          ],
          temperature: 0.2,
          max_tokens: 1000
        })
      });
      
      const result = await response.json();
      console.log("OpenAI API response status:", response.status);
      console.log("OpenAI API response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error("OpenAI API error:", result);
        throw new Error(`OpenAI API error: ${result.error?.message || 'Unknown error'}`);
      }
      
      // Extract content from OpenAI response
      const content = result.choices[0]?.message?.content;
      console.log("OpenAI response content:", content);
      
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      
      // Parse JSON from response
      let parsedResult;
      try {
        // Try to extract JSON if there's any text before or after
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        
        parsedResult = JSON.parse(jsonString);
        console.log('Parsed result:', parsedResult);
      } catch (parseError) {
        console.error('Error parsing result:', parseError);
        throw new Error('Failed to parse JSON result');
      }

      // Return a consistent structure
      return {
        content: readmeResult.content,
        summary: parsedResult.summary || "",
        coolFacts: parsedResult.coolFacts || [],
        mainTechnologies: parsedResult.mainTechnologies || [],
        targetAudience: parsedResult.targetAudience || "",
        setupComplexity: parsedResult.setupComplexity || "Moderate"
      }
    } catch (error) {
      console.error('Error in repository analysis:', error);
      
      // Return fallback analysis for any error
      return {
        content: readmeResult.content,
        summary: "This repository contains code and documentation. Unable to provide detailed analysis.",
        coolFacts: ["Contains a README file", "Is hosted on GitHub", "May include code samples"],
        mainTechnologies: ["Unknown"],
        targetAudience: "Developers",
        setupComplexity: "Moderate"
      }
    }
  }
} 