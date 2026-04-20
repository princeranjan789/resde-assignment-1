# Clinical Appointment Dashboard

A full-stack web application for managing clinical appointments with role-based access control (RBAC), audit logging, and a clean, empathetic user interface.

## Features

- **Patient Dashboard**: View all patients with appointment statuses
- **Detailed Patient View**: Access individual patient information and clinical notes (DOCTOR role required)
- **Role-Based Access Control**: Secure API endpoints with RBAC
- **Audit Logging**: Track all data access and modifications
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Error Handling**: Empathetic error messages and loading states

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Express.js**: Node.js web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### DevOps
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline
- **Google Cloud Platform**: Cloud deployment (Cloud Run + Firestore)

## Project Structure

```
clinical-dashboard/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable React components
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                 # Express.js backend
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env               # Environment variables
├── CLOUD_DEPLOYMENT.md    # Cloud deployment guide
├── CI_CD.md              # CI/CD pipeline documentation
└── README.md             # This file
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/clinical-dashboard
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## API Endpoints

### GET /patients
- **Description**: Retrieve all patients
- **Headers**: `role: DOCTOR`, `userid: <user_id>`
- **Response**: Array of patient objects

### GET /patients/:id
- **Description**: Retrieve specific patient details
- **Headers**: `role: DOCTOR` (required), `userid: <user_id>`
- **Response**: Patient object with clinical notes

### POST /patients
- **Description**: Create new patient
- **Headers**: `userid: <user_id>`
- **Body**: Patient data
- **Response**: Created patient object

## Security

- **RBAC**: Role-based access control with DOCTOR role required for clinical notes
- **Audit Logging**: All data access logged to MongoDB
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Server-side validation for all inputs

## Development

### Scripts

#### Client
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

#### Server
- `npm start`: Start the backend server
- `npm run dev`: Start backend in development mode with nodemon
- `npm run build`: Run backend build placeholder (no compilation step)
- `npm test`: Run backend test placeholder

### Testing
```bash
# Run frontend checks and placeholder backend tests
cd client && npm run build
cd ../server && npm test
```

## Deployment

See [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md) for detailed deployment instructions.

## CI/CD

See [CI_CD.md](CI_CD.md) for CI/CD pipeline configuration.

## Agent Log

See [AGENT_LOG.md](AGENT_LOG.md) for the AI prompt chain, agentic workflow, and manual intervention notes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Prompt Chain

This application was built using an agentic workflow that combined AI scaffolding with manual review and production-grade fixes.

1. **High-level design**: Defined the clinical dashboard, RBAC, audit trail, and cloud deployment goals.
2. **AI scaffolding**: Used an AI assistant to generate the Next.js frontend structure and Express/MongoDB backend boilerplate.
3. **Manual refinement**: Fixed build issues, removed duplicate scaffold artifacts, and tuned the UI and API error handling.
4. **Security and audit**: Implemented DOCTOR role enforcement for sensitive `ClinicalNotes` access and added audit logging for every data read/create event.
5. **Empathy check**: Replaced generic 'Patient not found' errors with a clinician-friendly message that supports busy ward rounds.
6. **Documentation**: Added deployment and CI/CD strategy docs, plus an AI agent log describing the workflow.

The development focused on:
- Clean, maintainable code
- Security-first approach
- Human-centered error handling
- Scalable architecture
- Clear AI agent documentation
