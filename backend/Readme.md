# College Management System - Backend

This is the backend for the College Management System, a full-featured MERN stack application designed to manage students, faculty, and administrative tasks.

## Features

- **Role-Based Access Control**: Secure endpoints for Admins, Faculty, and Students.
- **Full CRUD Operations**: Manage Branches, Subjects, Notices, Exams, Marks, and more.
- **Authentication**: JWT-based authentication for all user types.
- **File Uploads**: Handles profile pictures and course materials using Multer.
- **Robust Validation**: Schema-based DTO validation with Zod.
- **Comprehensive Testing**: Full integration and unit test suite with Jest and Supertest.

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB
- **JWT**: For secure authentication
- **Zod**: For data validation
- **Jest & Supertest**: For testing

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local or cloud instance)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone
    cd College-Management-System-master/backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory. Use the `.env.sample` file as a template:

    ```
    MONGODB_URI=mongodb://127.0.0.1:2717/College-Management-System
    PORT=4000
    FRONTEND_API_LINK=http://localhost:3000
    JWT_SECRET=your_super_secret_key
    NODEMAILER_EMAIL=your_email@gmail.com
    NODEMAILER_PASS=your_gmail_app_password
    ```

4.  **Seed the database with an admin user:**
    This command will create a default admin user and print the credentials to the console.

    ```bash
    npm run seed
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will be available at `http://localhost:4000`.

## Available Scripts

- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode with Nodemon.
- `npm run seed`: Seeds the database with a default admin.
- `npm test`: Runs the entire test suite.
- `npm run lint`: Lints the codebase for errors.
- `npm run format`: Formats the codebase with Prettier.
