# QuickSideTool 🛠️

A comprehensive Chrome extension and web application that provides essential document and image manipulation tools directly in your browser. Transform your productivity with our suite of powerful, easy-to-use tools.

![QuickSideTool](https://img.shields.io/badge/QuickSideTool-v3.0-blue?style=for-the-badge&logo=chrome)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📄 PDF Tools
- **PDF & Image Combiner**: Merge multiple PDFs and images into a single document
- **Drag & Drop Interface**: Intuitive file management with visual previews
- **Page Reordering**: Rearrange pages with simple drag-and-drop
- **Page Replacement**: Replace individual pages with context menu
- **Real-time Progress**: Track processing with beautiful progress indicators
- **Batch Processing**: Handle multiple files simultaneously

### 🔐 PDF Security
- **PDF Unlocker**: Remove password protection from encrypted PDFs
- **PDF Locker**: Add password protection with AES-256 encryption
- **Smart Error Handling**: Clear feedback for various scenarios
- **Secure Processing**: Server-side encryption/decryption

### 🔗 PDF Link Removal
- **Hyperlink Stripper**: Remove all clickable links from PDF documents
- **Annotation Preservation**: Keep non-link annotations intact
- **Encrypted PDF Support**: Handle protected documents appropriately
- **Visual Processing**: Beautiful orbital animation during processing

### 🖼️ Image Tools
- **Image Resizer**: Batch resize images with custom dimensions
  - Aspect ratio locking
  - Multiple output formats (JPEG, PNG, WebP)
  - Individual and global size controls
- **Image Compressor**: Reduce file sizes without quality loss
  - Quality-based compression
  - Format conversion
  - Batch processing with ZIP downloads

### 📱 QR Code Generator
- **Custom QR Codes**: Generate QR codes for URLs, text, or data
- **Customization Options**: Size, colors, format selection
- **Multiple Export Formats**: PNG, JPG, SVG
- **Real-time Preview**: Live QR code generation

### 🎮 Whac-A-Mole Game
- **Stress Relief**: Fun mini-game for breaks
- **Difficulty Levels**: Easy, Medium, Hard modes
- **Sound Effects**: Audio feedback for interactions
- **Score Tracking**: Performance measurement
- **Celebration Effects**: Confetti animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Chrome browser (for extension)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmanYadav007/QuickSideTool.git
   cd QuickSideTool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup (Optional)

For PDF operations, you can run the backend locally:

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server**
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:4000`

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

### Backend
- **Flask** - Python web framework
- **pikepdf** - PDF manipulation library
- **CORS** - Cross-origin resource sharing

### Key Libraries
- `pdf-lib` - Client-side PDF manipulation
- `pdfjs-dist` - PDF rendering and preview
- `react-dropzone` - File upload handling
- `jszip` - Batch file downloads
- `qrcode.react` - QR code generation
- `browser-image-compression` - Image processing

## 🎨 Design Features

- **Dark Theme**: Consistent dark gradient backgrounds
- **Glassmorphism**: Backdrop blur effects and translucent elements
- **Animated Backgrounds**: Floating blob animations
- **Responsive Design**: Mobile-first approach
- **Smooth Transitions**: CSS animations and micro-interactions
- **Loading States**: Custom progress overlays
- **Toast Notifications**: User feedback system

## 📱 Chrome Extension

QuickSideTool can be installed as a Chrome extension:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Load extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

3. **Access the extension**
   - Click the extension icon in your toolbar
   - Or use the side panel (if supported)

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## 🌐 Deployment

### Frontend
The app is configured for deployment on various platforms:
- Vercel
- Netlify
- GitHub Pages
- Chrome Web Store

### Backend
The Flask backend is deployed on Render.com and can be deployed to:
- Heroku
- DigitalOcean
- AWS
- Google Cloud Platform

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aman Yadav**
- Website: [aguider.in](https://aguider.in/)
- GitHub: [@AmanYadav007](https://github.com/AmanYadav007)

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) for the initial setup
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [pikepdf](https://pikepdf.readthedocs.io/) for PDF manipulation
- All contributors and users of QuickSideTool

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainer

---

⭐ **Star this repository if you find it helpful!**

## Development

### Logging System

QuickSideTool uses a professional logging system with environment awareness:

#### Logger Utility (`src/utils/logger.js`)

```javascript
import logger from '../utils/logger';

// Different log levels
logger.info('Information message');           // Development only
logger.success('Success message');            // Development only  
logger.warn('Warning message');               // Always logged
logger.error('Error message', error, 'Context'); // Always logged
logger.debug('Debug message');                // Development only
logger.performance('Operation', duration);    // Performance metrics
```

#### Features:
- **Environment Awareness**: Different behavior in development vs production
- **Structured Logging**: Consistent format with emojis and context
- **Error Tracking**: Ready for integration with services like Sentry
- **Performance Monitoring**: Built-in performance measurement
- **Statistics**: Track error and warning counts

#### Development Tools (`src/utils/devTools.js`)

```javascript
import { devLog, measurePerformance, logStateChange } from '../utils/devTools';

// Component debugging
devLog('ComponentName', 'methodName', data);

// Performance measurement
const result = await measurePerformance('Operation', async () => {
  // Your async operation
});

// State change tracking
logStateChange('Component', 'stateName', oldValue, newValue);
```

### Code Quality Improvements

#### Console Log Cleanup
- ✅ Replaced all `console.log` with structured logging
- ✅ Replaced `console.error` with error tracking
- ✅ Replaced `console.warn` with warning tracking
- ✅ Added context and component information to all logs
- ✅ Environment-specific logging (dev vs production)

#### Professional Touches
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **Performance Monitoring**: Built-in performance measurement utilities
- **Memory Tracking**: Development-only memory usage monitoring
- **Network Logging**: Request/response tracking for debugging
- **File Processing Logs**: Detailed file operation tracking
- **Development Environment Info**: Automatic environment detection and logging

#### Service Worker Improvements
- Professional error handling in service worker
- Development-only logging for cache operations
- Graceful fallback handling

#### Background Script Enhancements
- Proper extension lifecycle management
- Error handling for unhandled promise rejections
- Installation and update tracking

### Usage Examples

#### Basic Logging
```javascript
// Before
console.log('Processing file:', fileName);
console.error('Error processing file:', error);

// After
logger.info('Processing file', { fileName });
logger.error('Error processing file', error, 'FileProcessor');
```

#### Performance Measurement
```javascript
// Before
const start = Date.now();
await processFile();
console.log(`Took ${Date.now() - start}ms`);

// After
await measurePerformance('File Processing', async () => {
  await processFile();
});
```

#### Component Debugging
```javascript
// Before
console.log('Component rendered');

// After
const logRender = createRenderCounter('MyComponent');
logRender(); // Call in useEffect or render
```

### Environment Variables

The logging system respects these environment variables:
- `NODE_ENV`: Controls logging behavior (development/production)
- `REACT_APP_VERSION`: Application version for logging
- `REACT_APP_BUILD_TIME`: Build timestamp for debugging

### Production Considerations

In production:
- Info and debug logs are automatically disabled
- Errors and warnings are still logged
- Error tracking is prepared for external services
- Performance impact is minimized
- Memory usage monitoring is disabled

### Integration Ready

The logging system is designed for easy integration with:
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and debugging
- **Google Analytics**: Custom event tracking
- **Custom Analytics**: Structured data ready for analysis

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Build for production: `npm run build`

## Contributing

When adding new features or fixing bugs:
1. Use the logger utility instead of console methods
2. Add appropriate error handling with context
3. Use performance measurement for expensive operations
4. Follow the established logging patterns

## License

MIT License - see LICENSE file for details.







