# DeepMinds Research Lab Portal

A modern, responsive web portal for the DeepMinds Research Lab featuring articles, videos, announcements, and team information.

## 🚀 Quick Start

### Prerequisites
- **PHP 8.0+** with MongoDB extension
- **MongoDB** (local or cloud)
- **Composer**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Deepminds-research-lab-portal
   ```

2. **Install dependencies**
   ```bash
   cd backend
   composer install
   cd ..
   ```

3. **Start the servers**
   
   **Linux/macOS:**
   ```bash
   ./start.sh
   ```
   
   **Windows:**
   ```cmd
   start.bat
   ```
   
   **Manual:**
   ```bash
   # Terminal 1 - Backend
   cd backend && php -S localhost:8001 router.php
   
   # Terminal 2 - Frontend  
   cd themes/deepminds_theme && php -S localhost:8000
   ```

4. **Access the site**
   - Frontend: http://localhost:8000
   - API: http://localhost:8001

## 📁 Project Structure

```
Deepminds-research-lab-portal/
├── backend/                    # PHP Backend API
│   ├── api/                   # API endpoints
│   ├── controllers/           # Request controllers  
│   ├── models/               # Database models
│   ├── config/               # Configuration
│   └── server.php            # Main server file
├── themes/deepminds_theme/    # Main Frontend Theme
│   ├── templates/            # PHP templates
│   ├── css/components/       # Modular CSS
│   ├── js/components/        # Modular JavaScript
│   ├── assets/               # Static assets
│   └── index.php             # Frontend entry point
├── frontend/                  # Legacy frontend (reference)
├── start.sh                  # Linux/macOS startup script
├── start.bat                 # Windows startup script
└── SETUP_GUIDE.md           # Detailed setup instructions
```

## 🎯 Features

- **Responsive Design**: Mobile-first, modern UI
- **Modular Architecture**: Drupal-theme-like structure
- **API-First Backend**: RESTful JSON APIs
- **Real-time Data**: MongoDB integration
- **Video Integration**: YouTube API support
- **Admin Panel**: CRUD operations for content
- **Service Worker**: Offline caching support

## 🔧 Configuration

### Environment Variables
Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=deepminds_research_lab
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
ADMIN_USER=admin
ADMIN_PASS=admin123
```

### API Authentication
- **Admin Key**: `admin-key-123` (change in production)
- **Header**: `X-API-Key: admin-key-123`

## 📚 API Endpoints

### Articles
- `GET /api/articles` - List articles
- `GET /api/articles/:id` - Get article
- `GET /api/articles/categories` - Get categories
- `POST /api/articles` - Create article (admin)

### Videos  
- `GET /api/videos` - List videos
- `GET /api/videos/:id` - Get video

### Announcements
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Create announcement (admin)
- `PUT /api/announcements/:id` - Update announcement (admin)
- `DELETE /api/announcements/:id` - Delete announcement (admin)

### Health
- `GET /health` - Health check

## 🛠️ Development

### Adding New Pages
1. Create template in `themes/deepminds_theme/templates/`
2. Add CSS in `themes/deepminds_theme/css/components/`
3. Add JavaScript in `themes/deepminds_theme/js/components/`
4. Update routing in `themes/deepminds_theme/index.php`

### API Development
1. Create controller in `backend/controllers/`
2. Create model in `backend/models/`
3. Create API endpoint in `backend/api/`
4. Update routing in `backend/server.php`

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Start MongoDB
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**PHP MongoDB Extension Missing**
```bash
# Ubuntu/Debian
sudo apt-get install php-mongodb

# macOS  
brew install php-mongodb
```

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :8000
lsof -i :8001

# Kill process
kill -9 <PID>
```

## 📖 Documentation

- **Setup Guide**: `SETUP_GUIDE.md` - Detailed installation instructions
- **Diagnostic Report**: `DIAGNOSTIC_REPORT.md` - Technical details and fixes

## 🚀 Deployment

### Production Requirements
- Web server (Apache/Nginx)
- PHP 8.0+ with MongoDB extension
- MongoDB 4.4+
- SSL certificate

### Security Checklist
- [ ] Change default admin credentials
- [ ] Use strong API keys
- [ ] Enable HTTPS
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the setup guide
3. Check browser console for errors
4. Verify all services are running

---

**Made with ❤️ for DeepMinds Research Lab**
