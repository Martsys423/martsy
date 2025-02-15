export async function getGitHubReadme(githubUrl) {
  try {
    // Parse GitHub URL to get owner and repo
    const urlParts = githubUrl.replace('https://github.com/', '').split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]

    console.log(`Fetching README for ${owner}/${repo}...`)

    // Fetch README content using GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'GitHub-Readme-Fetcher'
        }
      }
    )

    console.log('GitHub API response status:', response.status)

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const readmeContent = await response.text()
    console.log('README content length:', readmeContent.length)
    return { success: true, content: readmeContent }

  } catch (error) {
    console.error('Error fetching README:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}

export function validateGitHubUrl(githubUrl) {
  if (!githubUrl) {
    return {
      isValid: false,
      message: "GitHub URL is required"
    }
  }

  if (!githubUrl.startsWith('https://github.com/') || githubUrl.split('/').length < 5) {
    return {
      isValid: false,
      message: "Invalid GitHub URL format. Expected: https://github.com/owner/repo"
    }
  }

  return { isValid: true }
} 