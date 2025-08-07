# QuickSideTool - Professional File Converter

A comprehensive file conversion platform with Adobe-style quality, built with React.js frontend and FastAPI backend.

## 🚀 Features

### Core Conversion Capabilities

| Conversion | Output Format | Priority | Quality |
|------------|---------------|----------|---------|
| PDF → Word | .docx | ⭐⭐⭐⭐ | Layout & formatting preserved |
| PDF → Text | .txt | ⭐⭐⭐ | Raw text extraction |
| PDF → Excel | .xlsx | ⭐⭐⭐ | Intelligent table detection |
| Word → PDF | .pdf | ⭐⭐⭐⭐ | Document integrity maintained |
| PDF → Images | .jpg/.png | ⭐⭐ | High-quality page export |
| Images → PDF | .pdf | ⭐⭐ | Multi-image PDF creation |

### Key Features

- **Adobe-Style UX**: Modern, intuitive interface with smooth animations
- **Professional Quality**: High-fidelity conversions with layout preservation
- **Batch Processing**: Convert multiple files simultaneously
- **Real-time Progress**: Live conversion status and progress tracking
- **Secure Processing**: Files automatically deleted after 10 minutes
- **Format Validation**: Intelligent file type detection and validation
- **Conversion History**: Track recent conversions with timestamps
- **Preview System**: Preview converted files before download

## 🛠️ Tech Stack

### Backend (FastAPI)
- **Framework**: FastAPI with Uvicorn
- **PDF Processing**: pdf2docx, pdfplumber, PyMuPDF
- **Document Handling**: python-docx, openpyxl
- **Image Processing**: pdf2image, img2pdf, Pillow
- **Security**: File validation, size limits, automatic cleanup

### Frontend (React.js)
- **Framework**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom gradients
- **Animations**: Framer Motion for smooth transitions
- **File Handling**: React Dropzone for drag & drop
- **Icons**: Lucide React for consistent iconography

## 📁 Project Structure

```
QuickSideTool/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── render.yaml           # Render deployment config
├── src/
│   ├── components/
│   │   └── FileConverter.jsx  # Main converter component
│   ├── pages/
│   │   └── FileConverterPage.jsx # Dedicated converter page
│   └── App.jsx               # Main app with routing
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run Development Server**:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 4000
   ```

3. **Deploy to Render**:
   - Connect your GitHub repository to Render
   - Use the `render.yaml` configuration
   - Set environment variables as needed

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔧 API Endpoints

### Core Conversion Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/convert/pdf-to-word` | POST | Convert PDF to Word document |
| `/convert/pdf-to-txt` | POST | Extract text from PDF |
| `/convert/pdf-to-excel` | POST | Convert PDF tables to Excel |
| `/convert/word-to-pdf` | POST | Convert Word to PDF |
| `/convert/pdf-to-image` | POST | Export PDF pages as images |
| `/convert/image-to-pdf` | POST | Combine images into PDF |

### Utility Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/` | GET | API information |

## 🎨 User Experience

### Adobe-Style Design Principles

- **Minimalist Interface**: Clean, uncluttered design
- **Smooth Animations**: Framer Motion transitions
- **Intuitive Workflow**: Drag & drop with visual feedback
- **Progress Indicators**: Real-time conversion status
- **Error Handling**: Graceful error messages with retry options

### Conversion Workflow

1. **Select Format**: Choose source and target formats
2. **Upload Files**: Drag & drop or click to select
3. **Convert**: One-click conversion with progress tracking
4. **Download**: Individual or batch download options
5. **History**: Track recent conversions

## 🔒 Security & Performance

### Security Features
- File size limits (50MB max)
- File type validation
- Automatic file cleanup (10-minute expiry)
- No permanent file storage
- SSL encryption for all transfers

### Performance Optimizations
- Asynchronous file processing
- Background cleanup tasks
- Efficient memory management
- Optimized image processing
- Caching for repeated operations

## 📊 Conversion Quality

### PDF to Word (⭐⭐⭐⭐)
- **Library**: pdf2docx
- **Features**: Layout preservation, formatting retention
- **Best For**: Documents with complex layouts

### PDF to Excel (⭐⭐⭐)
- **Library**: pdfplumber
- **Features**: Intelligent table detection
- **Best For**: Data extraction from reports

### Word to PDF (⭐⭐⭐⭐)
- **Library**: PyMuPDF
- **Features**: Document integrity preservation
- **Best For**: Professional document conversion

### Image Processing (⭐⭐⭐)
- **Libraries**: pdf2image, img2pdf, Pillow
- **Features**: High-quality conversion, format support
- **Best For**: Image format conversion and PDF creation

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy using `render.yaml`
4. Monitor logs and performance

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy to Vercel or Netlify
3. Configure environment variables
4. Set up custom domain (optional)

## 🔧 Configuration

### Environment Variables

```bash
# Backend
PORT=4000
MAX_FILE_SIZE=52428800  # 50MB in bytes
CLEANUP_INTERVAL=600    # 10 minutes

# Frontend
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Customization

- **File Size Limits**: Modify `MAX_FILE_SIZE` in backend
- **Cleanup Interval**: Adjust `CLEANUP_INTERVAL` for file retention
- **Supported Formats**: Extend conversion matrix in frontend
- **UI Theme**: Customize Tailwind classes for branding

## 📈 Monitoring & Analytics

### Backend Monitoring
- Conversion success rates
- File processing times
- Error tracking and logging
- Resource usage monitoring

### Frontend Analytics
- User conversion patterns
- Feature usage tracking
- Performance metrics
- Error reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for professional file conversion needs**







