import { INSTAGRAM_CONFIG, getUserMediaUrl } from '../config/instagram';

export const testInstagramConnection = async () => {
  console.log('🔍 Testing Instagram API connection...');
  console.log('Configuration:', {
    hasAccessToken: !!INSTAGRAM_CONFIG.ACCESS_TOKEN && INSTAGRAM_CONFIG.ACCESS_TOKEN !== 'your_access_token_here',
    hasUserId: !!INSTAGRAM_CONFIG.USER_ID && INSTAGRAM_CONFIG.USER_ID !== 'your_user_id_here',
    apiUrl: getUserMediaUrl()
  });

  if (!INSTAGRAM_CONFIG.ACCESS_TOKEN || INSTAGRAM_CONFIG.ACCESS_TOKEN === 'your_access_token_here') {
    console.error('❌ Instagram Access Token not configured');
    return { success: false, error: 'Access token not configured' };
  }

  if (!INSTAGRAM_CONFIG.USER_ID || INSTAGRAM_CONFIG.USER_ID === 'your_user_id_here') {
    console.error('❌ Instagram User ID not configured');
    return { success: false, error: 'User ID not configured' };
  }

  try {
    console.log('📡 Making API request...');
    const response = await fetch(getUserMediaUrl());
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${errorText}` 
      };
    }

    const data = await response.json();
    console.log('✅ API Response:', data);

    if (data.error) {
      console.error('❌ Instagram API Error:', data.error);
      return { 
        success: false, 
        error: data.error.message || 'Unknown API error' 
      };
    }

    const postCount = data.data ? data.data.length : 0;
    console.log(`✅ Success! Found ${postCount} posts`);
    
    return { 
      success: true, 
      postCount,
      data: data.data || []
    };

  } catch (error) {
    console.error('❌ Network Error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

export const getInstagramUserInfo = async () => {
  if (!INSTAGRAM_CONFIG.ACCESS_TOKEN || INSTAGRAM_CONFIG.ACCESS_TOKEN === 'your_access_token_here') {
    return { success: false, error: 'Access token not configured' };
  }

  try {
    const url = `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${INSTAGRAM_CONFIG.ACCESS_TOKEN}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    
    if (data.error) {
      return { success: false, error: data.error.message };
    }

    return { success: true, userInfo: data };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper function to validate Instagram URL format
export const validateInstagramUrl = (url) => {
  const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
  return instagramRegex.test(url);
};

// Helper function to extract username from Instagram URL
export const extractUsernameFromUrl = (url) => {
  const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
  return match ? match[1] : null;
}; 