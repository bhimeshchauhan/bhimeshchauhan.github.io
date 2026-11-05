# Instagram API Setup Guide

## 🚀 Quick Setup

To use your Instagram access token and fetch real data from your Instagram account:

### 1. Update Configuration File

Edit `src/config/instagram.js` and replace the placeholder values:

```javascript
export const INSTAGRAM_CONFIG = {
  // Replace with your actual Instagram Access Token
  ACCESS_TOKEN: 'your_actual_access_token_here',
  
  // Replace with your Instagram User ID
  USER_ID: 'your_actual_user_id_here',
  
  // Optional: Your Instagram App credentials
  CLIENT_ID: 'your_client_id_here',
  CLIENT_SECRET: 'your_client_secret_here',
  
  // ... rest of config
};
```

### 2. Get Your Instagram Access Token

#### Option A: Using Instagram Basic Display API
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add "Instagram Basic Display" product
4. Configure Instagram Basic Display settings
5. Generate a long-lived access token

#### Option B: Using Instagram Graph API (Business/Creator Accounts)
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add "Instagram Graph API" product
4. Connect your Instagram Business/Creator account
5. Generate access token with required permissions

### 3. Get Your Instagram User ID

#### Method 1: Using the API
```bash
curl -i -X GET \
  "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN"
```

#### Method 2: Using Online Tools
- Visit: https://www.instagram.com/username/?__a=1
- Replace "username" with your Instagram username
- Look for the "id" field in the response

### 4. Required Permissions

Your access token needs these permissions:
- `user_profile` - Basic profile information
- `user_media` - Access to your media posts

### 5. Test Your Configuration

1. Update the config file with your credentials
2. Restart your development server
3. Check the browser console for API responses
4. Your Instagram posts should now appear in the grid

## 🔧 Troubleshooting

### Common Issues:

1. **"Instagram API not configured"**
   - Make sure you've updated the config file with real values
   - Check that ACCESS_TOKEN and USER_ID are not placeholder values

2. **"Instagram API error: 400"**
   - Verify your access token is valid and not expired
   - Check that you have the required permissions

3. **"Instagram API error: 403"**
   - Your access token might not have the required permissions
   - Ensure your Instagram account is connected to the Facebook app

4. **CORS Errors**
   - Instagram API calls are made from the browser
   - Consider using a proxy or backend service for production

### Fallback Behavior

If the Instagram API fails or is not configured, the component will automatically fall back to using mock data, so your website will continue to work.

## 📝 Environment Variables (Alternative)

If you prefer using environment variables, create a `.env` file in your project root:

```env
GATSBY_INSTAGRAM_ACCESS_TOKEN=your_access_token_here
GATSBY_INSTAGRAM_USER_ID=your_user_id_here
GATSBY_INSTAGRAM_CLIENT_ID=your_client_id_here
GATSBY_INSTAGRAM_CLIENT_SECRET=your_client_secret_here
```

Then update the config file to use them:

```javascript
export const INSTAGRAM_CONFIG = {
  ACCESS_TOKEN: process.env.GATSBY_INSTAGRAM_ACCESS_TOKEN || 'your_access_token_here',
  USER_ID: process.env.GATSBY_INSTAGRAM_USER_ID || 'your_user_id_here',
  // ... rest of config
};
```

## 🔒 Security Notes

- Never commit your access token to version control
- Use environment variables for production deployments
- Consider token expiration and refresh mechanisms
- Monitor API usage to stay within rate limits

## 📚 Additional Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api/)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Facebook Developers Console](https://developers.facebook.com/) 