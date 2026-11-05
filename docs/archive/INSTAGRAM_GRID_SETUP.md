# Instagram Grid with 3D Art Rendering

This feature creates a beautiful Instagram-style grid that showcases your Instagram photos with an interactive 3D rendering capability.

## Features

- 🎨 **Instagram-style Grid**: Beautiful responsive grid layout
- 🎭 **3D Art Rendering**: Click any image to view it in 3D
- 🔄 **Multiple Render Modes**: Plane, Sphere, Cube, Cylinder, Torus
- ✨ **Particle Effects**: Dynamic background particles
- 🎯 **Interactive Controls**: Drag to rotate, scroll to zoom
- 📱 **Responsive Design**: Works on all devices
- 🚀 **Smooth Animations**: Powered by Framer Motion

## Setup Instructions

### 1. Install Dependencies

First, install the required dependencies:

```bash
npm install @react-three/fiber @react-three/drei three framer-motion
```

### 2. Instagram API Integration

To use real Instagram data, you'll need to set up Instagram Basic Display API:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add Instagram Basic Display product
4. Configure your app settings
5. Generate an access token

### 3. Environment Variables

Create a `.env` file in your project root and add:

```env
GATSBY_INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
GATSBY_INSTAGRAM_USER_ID=your_instagram_user_id_here
```

### 4. Usage

The Instagram grid is now available at `/instagram` route. You can also import and use the component anywhere:

```jsx
import InstagramGrid from '../components/InstagramGrid/InstagramGrid';

// In your component
<InstagramGrid />
```

## Component Structure

```
src/
├── components/
│   └── InstagramGrid/
│       ├── InstagramGrid.js      # Main grid component
│       └── Art3DRenderer.js      # 3D rendering component
├── services/
│   └── instagramService.js       # Instagram API service
└── pages/
    └── instagram.js              # Instagram page
```

## Customization

### Styling
The component uses styled-components for styling. You can customize the appearance by modifying the styled components in `InstagramGrid.js`.

### 3D Rendering
The 3D renderer supports multiple geometry types:
- **Plane**: 2D flat surface
- **Sphere**: 3D sphere
- **Cube**: 3D cube
- **Cylinder**: 3D cylinder
- **Torus**: 3D donut shape

### Adding New Render Modes
To add new render modes, modify the `renderGeometry` function in `Art3DRenderer.js`:

```jsx
const renderGeometry = () => {
  switch (renderMode) {
    case 'your_new_mode':
      return <yourGeometry args={[...]} />;
    // ... existing cases
  }
};
```

## API Integration Details

### Instagram Basic Display API
The service uses Instagram Basic Display API to fetch:
- Media URLs
- Captions
- Timestamps
- Permalinks

### Fallback Data
If Instagram API is not configured, the component uses mock data from Unsplash images.

## Performance Optimization

- Images are lazy-loaded
- 3D scenes are optimized for web
- Particle count is limited for performance
- Textures are cached

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Limited 3D performance

## Troubleshooting

### 3D Rendering Issues
- Ensure WebGL is enabled in your browser
- Check console for Three.js errors
- Reduce particle count if performance is poor

### Instagram API Issues
- Verify access token is valid
- Check API rate limits
- Ensure proper CORS configuration

### Build Issues
- Clear Gatsby cache: `gatsby clean`
- Reinstall dependencies: `npm install`
- Check for version conflicts

## Future Enhancements

- [ ] Video support
- [ ] AR preview mode
- [ ] Custom shaders
- [ ] Social sharing
- [ ] Analytics integration
- [ ] Caching layer
- [ ] Progressive loading

## Contributing

Feel free to contribute by:
- Adding new 3D render modes
- Improving performance
- Adding new features
- Fixing bugs

## License

This component is part of your personal website project. 