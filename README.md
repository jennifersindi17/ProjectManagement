# ProjectFlow - Project Management System

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/jennifersindi17/ProjectManagement.git
cd ProjectManagement
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Setup database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Run development server
```bash
npm run dev
```

6. Open http://localhost:3000

### Default Credentials
- Email: admin@projectflow.com
- Password: admin123

### Environment Variables
```
DATABASE_URL="postgresql://user:password@localhost:5432/projectflow"
JWT_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# S3 Compatible Storage (Optional)
S3_BUCKET="your-bucket"
S3_REGION="us-east-1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"

# OpenAI (for AI Assistant)
OPENAI_API_KEY="your-openai-api-key"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

## Features
- Dashboard with KPI
- Project Management
- Task Management (Jira-like)
- Kanban Board
- Gantt Chart
- Timesheet
- Resource Management
- Meeting & MOM
- Issue Management
- Risk Management
- Change Request
- Document Management
- Client Portal
- Notification Center
- Reporting
- User & Access Management
- AI Project Assistant
