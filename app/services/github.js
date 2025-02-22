import { APIError } from '@/app/utils/error-handler'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/app/constants'
import { createAnalysisChain } from '@/app/api/github-summarizer/chain'
import { getGitHubReadme, validateGitHubUrl } from '@/app/api/github-summarizer/github'
import { validateApiKey } from '@/app/api/github-summarizer/validation'

export const githubService = {
  async validateRequest(apiKey, githubUrl) {
    // Validate API key
    const apiKeyValidation = await validateApiKey(apiKey)
    if (!apiKeyValidation.isValid) {
      throw new APIError(apiKeyValidation.message, apiKeyValidation.status)
    }

    // Validate GitHub URL
    const urlValidation = validateGitHubUrl(githubUrl)
    if (!urlValidation.isValid) {
      throw new APIError(urlValidation.message, HTTP_STATUS.BAD_REQUEST)
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
    const analysis = await chain.invoke({
      readme: readmeResult.content
    })

    return {
      content: readmeResult.content,
      analysis
    }
  }
} 