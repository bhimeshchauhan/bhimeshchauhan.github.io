// Instagram API Configuration
// Replace these values with your actual Instagram API credentials

export const INSTAGRAM_CONFIG = {
  // Your Instagram Access Token (long-lived token)
  ACCESS_TOKEN: '',
  
  // Your Instagram User ID
  USER_ID: '',
  
  // Your Instagram App Client ID (optional, for additional features)
  CLIENT_ID: 'your_client_id_here',
  
  // Your Instagram App Client Secret (optional, for additional features)
  CLIENT_SECRET: 'your_client_secret_here',
  
  // API Configuration
  API_URL: 'https://graph.instagram.com/v12.0',
  
  // Fields to fetch from Instagram API
  FIELDS: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count',
  
  // Number of posts to fetch
  POSTS_LIMIT: 12
};

// Helper function to get Instagram API URL
export const getInstagramApiUrl = (endpoint) => {
  const { API_URL, ACCESS_TOKEN, FIELDS } = INSTAGRAM_CONFIG;
  return `${API_URL}/${endpoint}?access_token=${ACCESS_TOKEN}&fields=${FIELDS}`;
};

// Helper function to get user media URL
export const getUserMediaUrl = () => {
  const { USER_ID } = INSTAGRAM_CONFIG;
  return getInstagramApiUrl(`${USER_ID}/media`);
}; 