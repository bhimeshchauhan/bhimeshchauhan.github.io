// Instagram Service for Development
// Custom Instagram-like data without API calls

import { INSTAGRAM_CONFIG, getUserMediaUrl } from '../config/instagram';

class InstagramService {
  constructor() {
    this.isConfigured = this.checkConfiguration();
  }

  checkConfiguration() {
    return INSTAGRAM_CONFIG.ACCESS_TOKEN !== 'your_access_token_here' && 
           INSTAGRAM_CONFIG.USER_ID !== 'your_user_id_here';
  }

  async fetchInstagramPosts(limit = INSTAGRAM_CONFIG.POSTS_LIMIT) {
    if (!this.isConfigured) {
      throw new Error('Instagram API not configured. Please update src/config/instagram.js with your access token and user ID.');
    }

    try {
      console.log('Fetching Instagram posts from your account...');
      
      const response = await fetch(getUserMediaUrl());
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message}`);
      }

      console.log('Instagram API response:', data);

      // Transform Instagram API data to our format
      const posts = data.data.map(post => this.transformInstagramPost(post));
      
      return posts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error; // Re-throw the error instead of falling back to mock data
    }
  }

  transformInstagramPost(instagramPost) {
    return {
      id: instagramPost.id,
      imageUrl: instagramPost.media_type === 'VIDEO' 
        ? instagramPost.thumbnail_url 
        : instagramPost.media_url,
      caption: instagramPost.caption || 'No caption',
      likes: instagramPost.like_count || 0,
      comments: instagramPost.comments_count || 0,
      timestamp: this.formatTimestamp(instagramPost.timestamp),
      permalink: instagramPost.permalink,
      mediaType: instagramPost.media_type,
      username: instagramPost.username || 'bhimesh.dev'
    };
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  }
}

const instagramService = new InstagramService();
export default instagramService; 