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

    // Analyze repository
    const chain = createAnalysisChain()
    const resultString = await chain.invoke({
      readme: readmeResult.content
    })

    // Parse the JSON string result
    let parsedResult;
    try {
      parsedResult = JSON.parse(resultString);
      console.log('Parsed chain result:', parsedResult);
    } catch (error) {
      console.error('Error parsing chain result:', error);
      console.log('Raw result:', resultString);
      throw new APIError(
        "Failed to parse analysis result", 
        HTTP_STATUS.SERVER_ERROR
      )
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
  }
} 