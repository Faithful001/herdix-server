<div align="center">
  <h1>Herdix Server</h1>
  <p>A robust and scalable RESTful API built with NestJS</p>
  
  [![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![CI/CD](https://img.shields.io/github/actions/workflow/status/yourusername/herdix-server/ci.yml?style=for-the-badge)](https://github.com/yourusername/herdix-server/actions)
</div>

## 🚀 Features

### 🏡 Farm Management

- **Farm Management** - Manage multiple farms with detailed information
- **User Management** - Role-based access control (Admin, Manager, Farmer)
- **Task Management** - Assign and track tasks with priorities and deadlines
- **Crop Management** - Track crop types, planting, and growth stages
- **Livestock Management** - Monitor livestock health and inventory
- **Inventory Tracking** - Manage farm resources and supplies
- **AI-Powered Analysis** - Computer vision for crop and livestock health assessment

### 🔐 Authentication & Security

- **JWT Authentication** - Secure API access with JSON Web Tokens
- **Role-Based Access Control** - Fine-grained permissions for different user types
- **OTP Verification** - Secure email verification and password reset flows
- **Password Policies** - Enforce strong password requirements

### 🛠️ Developer Experience

- **RESTful API** - Well-structured endpoints following best practices
- **TypeScript** - Strongly typed codebase for better maintainability
- **API Documentation** - Auto-generated with Swagger/OpenAPI
- **Validation** - Request validation using class-validator
- **Testing** - Comprehensive test suites with Jest
- **Docker** - Containerized application for easy deployment

## 🛠 Tech Stack

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Mongoose
- **AI/ML**: Google's Generative AI for image analysis
- **Authentication**: JWT, Passport.js
- **Validation**: class-validator, class-transformer
- **File Uploads**: Multer integration
- **Email**: Nodemailer for notifications

### Development Tools

- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Containerization**: Docker
- **CI/CD**: GitHub Actions (configurable)
- **Code Quality**: ESLint, Prettier

## 📦 Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn
- PostgreSQL/MySQL (or Docker for containerized database)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/herdix-server.git
   cd herdix-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the application

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod

# Run with Docker
$ docker-compose up --build
```

## 🧪 Running Tests

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## 🌐 API Documentation

Once the application is running, the API documentation is available at:

- Swagger UI: `http://localhost:3000/api`
- JSON format: `http://localhost:3000/api-json`

## 📁 Project Structure

```
src/
├── auth/               # Authentication module
├── users/              # User management
├── common/             # Common utilities and decorators
├── config/             # Configuration files
├── database/           # Database configuration and migrations
├── main.ts             # Application entry point
└── app.module.ts       # Root module
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# App
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=herdix

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue or reach out to the maintainers.

# unit tests

$ npm run test

# e2e tests

$ npm run test:e2e

# test coverage

$ npm run test:cov

````

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
