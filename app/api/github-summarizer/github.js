import { Octokit } from '@octokit/rest'
import { APIError } from '@/app/utils/error-handler'
import { HTTP_STATUS } from '@/app/constants'

// Create Octokit instance with GitHub token if available
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined
})

export function validateGitHubUrl(url) {
  if (!url) {
    return { isValid: false, message: 'GitHub URL is required' }
  }

  // Basic URL validation
  try {
    new URL(url)
  } catch (e) {
    return { isValid: false, message: 'Invalid URL format' }
  }

  // Check if it's a GitHub URL
  if (!url.includes('github.com')) {
    return { isValid: false, message: 'URL must be from github.com' }
  }

  // Extract owner and repo
  const parts = url.split('github.com/').pop().split('/')
  if (parts.length < 2) {
    return { isValid: false, message: 'Invalid GitHub repository URL' }
  }

  return { 
    isValid: true, 
    owner: parts[0], 
    repo: parts[1].split('#')[0].split('?')[0] 
  }
}

export async function getGitHubReadme(url) {
  console.log('Fetching README for URL:', url)
  
  // Validate URL and extract owner/repo
  const validation = validateGitHubUrl(url)
  if (!validation.isValid) {
    console.error('Invalid GitHub URL:', validation.message)
    return { success: false, message: validation.message }
  }

  const { owner, repo } = validation
  console.log(`Fetching README for ${owner}/${repo}`)

  try {
    // Try to fetch the README content
    const response = await octokit.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: 'raw'
      }
    })

    // Check if we got a successful response
    if (response.status !== 200) {
      console.error(`GitHub API error: ${response.status}`)
      return { 
        success: false, 
        message: `Failed to fetch README (Status: ${response.status})` 
      }
    }

    // Get the content
    const content = response.data
    
    // Log a preview of the content
    console.log('README content preview:', content.substring(0, 200) + '...')
    console.log('README content length:', content.length)
    
    return { 
      success: true, 
      content,
      owner,
      repo
    }
  } catch (error) {
    console.error('Error fetching GitHub README:', error)
    
    // Try alternative approach - fetch default branch first
    try {
      console.log('Trying alternative approach to fetch README...')
      
      // Get repository info to determine default branch
      const repoInfo = await octokit.repos.get({
        owner,
        repo
      })
      
      const defaultBranch = repoInfo.data.default_branch
      console.log(`Default branch for ${owner}/${repo}: ${defaultBranch}`)
      
      // Try to fetch README.md directly from the default branch
      const contentResponse = await octokit.repos.getContent({
        owner,
        repo,
        path: 'README.md',
        ref: defaultBranch
      })
      
      if (contentResponse.data && contentResponse.data.content) {
        // Content is base64 encoded
        const content = Buffer.from(contentResponse.data.content, 'base64').toString()
        console.log('README content fetched via alternative method')
        console.log('README content preview:', content.substring(0, 200) + '...')
        
        return {
          success: true,
          content,
          owner,
          repo
        }
      }
      
      return { 
        success: false, 
        message: 'Failed to fetch README content' 
      }
    } catch (altError) {
      console.error('Alternative method also failed:', altError)
      return { 
        success: false, 
        message: 'Failed to fetch README' 
      }
    }
  }
} 