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
    
    // Check if README is too short
    if (readmeContent.length < 100) {
      console.warn("README content is very short, may not provide enough information for analysis");
    }

    try {
      // Analyze repository
      const chain = createAnalysisChain()
      console.log("Invoking analysis chain...");
      
      const resultString = await chain.invoke({
        readme: readmeContent
      })

      console.log('Raw chain result length:', resultString.length);
      console.log('Raw chain result preview:', resultString.substring(0, 200));
      
      // Ensure resultString is actually a string
      if (typeof resultString !== 'string') {
        console.error('Chain result is not a string:', resultString);
        throw new Error('Chain result is not a string');
      }
      
      // Clean the result string to ensure it's valid JSON
      let cleanedResult = resultString;
      
      try {
        // Try to extract JSON if there's any text before or after
        const jsonMatch = resultString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResult = jsonMatch[0];
        }
      } catch (matchError) {
        console.error('Error matching JSON pattern:', matchError);
        // Continue with the original string if matching fails
      }
      
      // Parse the JSON string result
      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedResult);
        console.log('Parsed chain result:', parsedResult);
      } catch (parseError) {
        console.error('Error parsing chain result:', parseError);
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