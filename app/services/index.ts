import { githubService } from './github'
import { apiKeyService } from './api-key'
import { userService } from './user'

export const services = {
  github: githubService,
  apiKey: apiKeyService,
  user: userService
}

export default services 