Cloudinary and MongoDB configuration

Environment variables (place these in the project root `.env` file):

- MONGO_URI: MongoDB connection string (required for DB storage)
- MONGO_DB: Database name (optional, defaults to `deepminds`)

Cloudinary (optional, if not set file will be stored locally):

- CLOUDINARY_CLOUD_NAME: your Cloudinary cloud name
- CLOUDINARY_API_KEY: your Cloudinary API key
- CLOUDINARY_API_SECRET: your Cloudinary API secret

Notes:
- The upload handler (`backend/api/upload_article.php`) will attempt to upload the image to Cloudinary when all three CLOUDINARY_* variables are set.
- If Cloudinary upload fails or is not configured, the handler falls back to saving the uploaded file under `frontend/uploads/` and still inserts the article into MongoDB where possible.
- The frontend reads article details only via the backend API (`/api/articles`) which pulls from MongoDB. Ensure the webserver's PHP SAPI has the MongoDB extension available or the `backend/config/mongo.php` will throw an error.

Permissions:
- Ensure `frontend/uploads/` and `frontend/data/` are writable by the webserver user (www-data) if you expect local file writes.
