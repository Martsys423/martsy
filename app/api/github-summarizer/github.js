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
    // Try to fetch the README content using the raw GitHub URL
    const response = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
    )

    if (response.ok) {
      const content = await response.text()
      console.log('README content fetched from main branch')
      console.log('README content preview:', content.substring(0, 200) + '...')
      
      return { 
        success: true, 
        content,
        owner,
        repo
      }
    }
    
    // If main branch doesn't work, try master branch
    const masterResponse = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
    )
    
    if (masterResponse.ok) {
      const content = await masterResponse.text()
      console.log('README content fetched from master branch')
      console.log('README content preview:', content.substring(0, 200) + '...')
      
      return { 
        success: true, 
        content,
        owner,
        repo
      }
    }
    
    // Try GitHub API as a last resort
    const apiResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'GitHub-Readme-Fetcher'
        }
      }
    )
    
    if (apiResponse.ok) {
      const content = await apiResponse.text()
      console.log('README content fetched from GitHub API')
      console.log('README content preview:', content.substring(0, 200) + '...')
      
      return { 
        success: true, 
        content,
        owner,
        repo
      }
    }
    
    console.error('Failed to fetch README from all sources')
    return { 
      success: false, 
      message: 'Failed to fetch README' 
    }
  } catch (error) {
    console.error('Error fetching GitHub README:', error)
    return { 
      success: false, 
      message: 'Failed to fetch README' 
    }
  }
} 