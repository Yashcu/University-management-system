# College Management System - Frontend

This is the frontend for the College Management System, built with React. It provides the user interface for three distinct user roles: Admin, Faculty, and Student.

## Features

- **Role-Based Dashboards**: Separate, tailored interfaces for Admins, Faculty, and Students.
- **Admin Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing students, faculty, branches, and subjects.
- **Faculty Tools**: Tools for finding students, managing study materials, uploading marks, and viewing timetables.
- **Student Portal**: Allows students to view their profile, marks, study materials, and timetables.
- **Secure Authentication**: JWT-based authentication with protected routes.
- **Modern UI**: Built with Tailwind CSS for a responsive and clean user experience.

## Tech Stack

- **React.js**: For building the user interface.
- **React Router**: For client-side routing.
- **Redux Toolkit**: For predictable and centralized state management.
- **Tailwind CSS**: For styling.
- **React Hook Form & Zod**: For robust and validated forms.
- **Axios**: For making API requests to the backend.
- **React Hot Toast**: For user notifications.

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Yashcu/University-management-system
    ```

2.  **Navigate to the frontend directory:**
    ```sh
    cd College-Management-System/frontend
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Create an environment file:**
    Create a `.env` file in the `frontend` directory by copying the sample file:
    ```sh
    cp .env.sample .env
    ```

5.  **Configure the environment variable:**
    Open the `.env` file and set the `REACT_APP_API_BASE_URL` to the URL of your running backend server.
    ```
    REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
    ```

### Available Scripts

In the project directory, you can run:

-   `npm start`: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
-   `npm test`: Launches the test runner in interactive watch mode.
-   `npm run build`: Builds the app for production to the `build` folder.
-   `npm run format`: Formats all source files using Prettier.
-   `npm run lint`: Lints all source files using ESLint.
