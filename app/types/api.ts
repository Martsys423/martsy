export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface GithubAnalysis {
  summary: string;
  coolFacts: string[];
  mainTechnologies: string[];
  targetAudience: string;
  setupComplexity: 'Simple' | 'Moderate' | 'Complex';
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  key: string;
  created_at: string;
  usage: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
} 