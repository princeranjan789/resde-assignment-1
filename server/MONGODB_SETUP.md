# MongoDB Connection Setup

## For Local Development
If using local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/clinical-dashboard
```

## For MongoDB Atlas (Cloud - Required for 24/7 deployment)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string from "Connect" > "Connect your application"
3. Replace `<username>`, `<password>`, and `<cluster>` with your actual values:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clinical-dashboard?retryWrites=true&w=majority
```

## Testing Connection
Run this command to test your MongoDB connection:
```bash
npm run test-connection
```

## Important Notes
- For cloud deployment, you MUST use MongoDB Atlas (not localhost)
- Add your deployment server's IP to MongoDB Atlas network access
- The connection string will be used as a GitHub secret for deployment