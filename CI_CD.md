# CI/CD Pipeline

## GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd client && npm ci
        cd ../server && npm ci

    - name: Run linting
      run: |
        cd client && npm run lint

    - name: Run tests
      run: |
        cd client && npm test
        cd ../server && npm test

    - name: Build applications
      run: |
        cd client && npm run build
        cd ../server && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Setup Google Cloud
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT_ID }}

    - name: Build and push backend
      run: |
        cd server
        docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/clinical-backend:$GITHUB_SHA .
        docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/clinical-backend:$GITHUB_SHA

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy clinical-backend \
          --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/clinical-backend:$GITHUB_SHA \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated \
          --set-env-vars MONGODB_URI=${{ secrets.MONGODB_URI }}

    - name: Build and deploy frontend
      run: |
        cd client
        npm ci
        npm run build
        firebase deploy --only hosting
```

## Pipeline Stages

1. **Install**: Install dependencies for both frontend and backend
2. **Lint**: Run ESLint on all code
3. **Test**: Execute unit and integration tests
4. **Build**: Build production artifacts
5. **Liveness Check**: Verify applications start successfully
6. **Deploy**: Deploy to GCP (backend to Cloud Run, frontend to Firebase)

## Quality Gates

- All tests must pass
- Code coverage minimum 80%
- No linting errors
- Successful build
- Liveness check passes

## Secrets Required

- `GCP_SA_KEY`: Google Cloud service account key
- `GCP_PROJECT_ID`: Google Cloud project ID
- `MONGODB_URI`: MongoDB connection string