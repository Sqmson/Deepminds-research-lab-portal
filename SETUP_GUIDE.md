# DeepMinds Research Lab Portal - Setup Guide

## Project Structure

```
Deepminds-research-lab-portal/
├── backend/                    # PHP Backend API
│   ├── api/                   # API endpoints
│   ├── controllers/           # Request controllers
│   ├── models/               # Database models
│   ├── config/               # Configuration files
│   ├── vendor/               # Composer dependencies
│   ├── server.php            # Main server file
│   └── router.php            # PHP built-in server router
├── themes/deepminds_theme/    # Main frontend theme
│   ├── templates/            # PHP templates
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── assets/               # Static assets
│   └── index.php             # Frontend entry point
├── frontend/                  # Legacy frontend (for reference)
└── README.md                  # This file
```

## Prerequisites

### Required Software
- **PHP 8.0+** (with MongoDB extension)
- **MongoDB** (local or cloud instance)
- **Composer** (for PHP dependencies)

### Optional
- **XAMPP/WAMP** (alternative to PHP built-in server)
- **Node.js** (for development tools)

## Installation Options

### Option 1: PHP Built-in Server (Recommended)

This is the simplest and most portable method.

#### 1. Install Dependencies
```bash
# Install MongoDB PHP extension
sudo apt-get install php-mongodb  # Ubuntu/Debian
# or
brew install php-mongodb          # macOS

# Install Composer dependencies
cd backend
composer install
```

#### 2. Configure Environment
Create `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=deepminds_research_lab
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
ADMIN_USER=admin
ADMIN_PASS=admin123
```

#### 3. Start Servers
```bash
# Terminal 1 - Backend API Server
cd backend
php -S localhost:8001 router.php

# Terminal 2 - Frontend Server
cd themes/deepminds_theme
php -S localhost:8000
```

#### 4. Access the Site
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:8001
- **API Health**: http://localhost:8001/health

### Option 2: XAMPP/WAMP

#### 1. Setup XAMPP
1. Download and install XAMPP
2. Start Apache and MySQL services
3. Place project in `htdocs` folder:
   ```
   C:\xampp\htdocs\Deepminds-research-lab-portal\
   ```

#### 2. Configure Virtual Hosts
Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:
```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/Deepminds-research-lab-portal/themes/deepminds_theme"
    ServerName deepminds.local
    <Directory "C:/xampp/htdocs/Deepminds-research-lab-portal/themes/deepminds_theme">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:8001>
    DocumentRoot "C:/xampp/htdocs/Deepminds-research-lab-portal/backend"
    ServerName api.deepminds.local
    <Directory "C:/xampp/htdocs/Deepminds-research-lab-portal/backend">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### 3. Update Hosts File
Add to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 deepminds.local
127.0.0.1 api.deepminds.local
```

#### 4. Access the Site
- **Frontend**: http://deepminds.local
- **Backend API**: http://api.deepminds.local:8001

### Option 3: Docker (Advanced)

#### 1. Create Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://mongodb:27017
      - DB_NAME=deepminds_research_lab

  frontend:
    build: ./themes/deepminds_theme
    ports:
      - "8000:8000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 2. Run with Docker
```bash
docker-compose up -d
```

## Database Setup

### MongoDB Configuration
1. **Local MongoDB**:
   ```bash
   # Start MongoDB
   sudo systemctl start mongod
   
   # Create database and collections
   mongo
   use deepminds_research_lab
   db.createCollection("articles")
   db.createCollection("videos")
   db.createCollection("announcements")
   db.createCollection("members")
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at https://cloud.mongodb.com
   - Create cluster and get connection string
   - Update `MONGO_URI` in `.env` file

## Configuration

### Environment Variables
Create `backend/.env`:
```env
# Database
MONGO_URI=mongodb://localhost:27017
DB_NAME=deepminds_research_lab

# YouTube API (optional - uses mock data if not set)
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here

# Admin Authentication
ADMIN_USER=admin
ADMIN_PASS=admin123

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### API Configuration
The API uses simple key-based authentication:
- **Admin Key**: `admin-key-123` (change in production)
- **Header**: `X-API-Key: admin-key-123`

## Development

### File Structure
- **Templates**: `themes/deepminds_theme/templates/`
- **Styles**: `themes/deepminds_theme/css/components/`
- **Scripts**: `themes/deepminds_theme/js/components/`
- **Assets**: `themes/deepminds_theme/assets/`

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

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

#### 2. PHP MongoDB Extension Missing
```bash
# Ubuntu/Debian
sudo apt-get install php-mongodb

# macOS
brew install php-mongodb

# Restart web server
sudo systemctl restart apache2  # or nginx
```

#### 3. Port Already in Use
```bash
# Check what's using the port
lsof -i :8000
lsof -i :8001

# Kill process
kill -9 <PID>
```

#### 4. CORS Issues
- Ensure backend server is running on port 8001
- Check API base URL in `frontend/js/api.js`

### Logs
- **PHP Errors**: Check `backend/error.log`
- **MongoDB Logs**: Check system logs
- **Browser Console**: Check for JavaScript errors

## Production Deployment

### Requirements
- **Web Server**: Apache/Nginx
- **PHP**: 8.0+ with MongoDB extension
- **Database**: MongoDB 4.4+
- **SSL Certificate**: For HTTPS

### Security Checklist
- [ ] Change default admin credentials
- [ ] Use strong API keys
- [ ] Enable HTTPS
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up monitoring

### Performance Optimization
- [ ] Enable PHP OPcache
- [ ] Use Redis for caching
- [ ] Optimize database queries
- [ ] Minify CSS/JS
- [ ] Enable gzip compression
- [ ] Use CDN for static assets

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the diagnostic report
3. Check browser console for errors
4. Verify all services are running

## Quick Start Commands

```bash
# Clone and setup
git clone <repository-url>
cd Deepminds-research-lab-portal

# Install dependencies
cd backend && composer install && cd ..

# Start development servers
# Terminal 1
cd backend && php -S localhost:8001 router.php

# Terminal 2  
cd themes/deepminds_theme && php -S localhost:8000

# Access site
open http://localhost:8000
```
