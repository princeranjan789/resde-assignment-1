# Cloud Deployment Strategy

## Overview
This application is designed for deployment on Google Cloud Platform (GCP) using a containerized approach for scalability, security, and ease of management.

## Architecture
- **Frontend**: Next.js application deployed as a static site or containerized app
- **Backend**: Express.js API deployed on Google Cloud Run
- **Database**: MongoDB Atlas or Firestore for patient data and audit logs
- **Authentication**: Google Cloud Identity Platform for RBAC

## Deployment Steps

### 1. Prepare a cloud database
- Use MongoDB Atlas or another cloud-hosted MongoDB instance.
- Create a database named `clinical-dashboard` and a user with read/write permissions.
- Store the connection string in a secure secret called `MONGODB_URI`.

### 2. Containerize Applications
#### Backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

#### Frontend
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE:-http://localhost:5000}
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Deploy Backend to Cloud Run
Run these commands after setting the active GCP project and authenticating with `gcloud`:

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/clinical-backend server

gcloud run deploy clinical-backend \
  --image gcr.io/$PROJECT_ID/clinical-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="$MONGODB_URI"
```

### 4. Deploy Frontend to Cloud Run
After the backend is deployed, use its service URL to build the frontend with the correct API base.

```bash
BACKEND_URL=$(gcloud run services describe clinical-backend --platform managed --region us-central1 --format='value(status.url)')

gcloud builds submit --tag gcr.io/$PROJECT_ID/clinical-frontend client --build-arg NEXT_PUBLIC_API_BASE=$BACKEND_URL

gcloud run deploy clinical-frontend \
  --image gcr.io/$PROJECT_ID/clinical-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_BASE=$BACKEND_URL
```

### 5. Confirm and update service URLs
- The backend will be reachable at the Cloud Run URL returned by `gcloud run services describe clinical-backend`.
- The frontend will be reachable at the Cloud Run URL returned by `gcloud run services describe clinical-frontend`.

### Notes
- Cloud Run keeps the app running even when your local machine is off.
- `MONGODB_URI` must point to a cloud-accessible MongoDB Atlas instance.
- `NEXT_PUBLIC_API_BASE` is required during frontend build so the deployed site can call the backend service.

### 6. Database Setup
- Create MongoDB Atlas database
- Use RBAC for database user permissions
- Migrate local data to Atlas if needed

### 5. Security & Monitoring
- Enable Cloud Logging and Monitoring
- Set up VPC for secure communication
- Configure IAM roles for service accounts

## Benefits
- **Scalability**: Cloud Run auto-scales based on traffic
- **Security**: GCP's built-in security features and RBAC
- **Cost-effective**: Pay-per-use model
- **Reliability**: GCP's high availability and global CDN