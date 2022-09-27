export interface GithubOAuthLoginResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token: string;
  refresh_token_expires_in: number;
}
