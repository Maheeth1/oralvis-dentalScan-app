# OralVis Healthcare 🦷

OralVis Healthcare is a comprehensive full-stack web application designed to streamline the workflow between dental technicians and dentists. The platform provides a secure, role-based system where Technicians can upload patient dental scans, and Dentists can view, manage, and generate reports for these scans.

This project demonstrates key full-stack development concepts including secure authentication with `HttpOnly` cookies, cloud media management, role-based access control, and a modern, responsive user interface.

**Live Demo:** [Link to your hosted application]

---

## ✨ Key Features

-   **Secure Role-Based Authentication**: Distinct login and dashboard experiences for **Technicians** and **Dentists**. The system utilizes JWT (JSON Web Tokens) stored in secure `HttpOnly` cookies for enhanced security.
-   **"Smart" Sidebar Navigation**: The UI is context-aware, showing only the relevant navigation links based on the logged-in user's role.
-   **Technician Scan Upload**: An intuitive, modern form for uploading patient scan images (JPG/PNG) with associated data (patient name, ID, region).
-   **Cloud Image Storage**: All images are seamlessly and securely uploaded to **Cloudinary**, not stored on the server.
-   **Dentist Scan Viewer**: A dynamic, animated dashboard for viewing all patient scans. Each scan card displays patient info, scan details, an image thumbnail, and the upload date.
-   **PDF Report Generation**: On-the-fly generation of downloadable PDF reports for each scan, containing all relevant patient/scan details and the embedded scan image.
-   **Modern & Responsive UI**: A professional and clean user interface built with **Tailwind CSS**, animated with **Framer Motion**, and featuring **Heroicons** for a premium feel.

---

## 📸 Screenshots

| Login Page                                     | Technician Dashboard                               | Dentist Dashboard                                  |
| ---------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
|  |  |  |

*(You should replace the bracketed text above with actual images of your application.)*

---

## 🛠️ Technology Stack

| Category         | Technologies                                               |
| ---------------- | ---------------------------------------------------------- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Axios, Heroicons |
| **Backend** | Node.js, Express.js                                        |
| **Database** | SQLite                                                     |
| **Authentication** | JSON Web Tokens (JWT), `HttpOnly` Cookies, bcrypt.js, cookie-parser |
| **Image Storage** | Cloudinary SDK, Multer                                     |

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or newer)
-   npm (or yarn/pnpm)
-   A free Cloudinary account to get API keys.

### 1. Clone the Repository

```bash
git clone https://github.com/Maheeth1/oralvis-dentalScan.git
cd oralvis-dentalScan
```

### 2. Backend Setup

```
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create the .env file (see "Environment Variables" section below)
cp .env.example .env

# Start the backend server
node index.js
```
The backend will start on http://localhost:5000. It will automatically create a db.sqlite file with the default users.

### 3. Frontend Setup

```
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Create the .env file (see "Environment Variables" section below)
cp .env.example .env

# Start the frontend development server
npm run dev
```
The frontend will start on http://localhost:5173.

---

### 🔑 Environment Variables

You need to create a .env file in both the frontend and backend directories.

#### Backend (backend/.env)
```
JWT_SECRET=your_super_secret_key_for_jwt
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (frontend/.env)
```
VITE_API_URL=http://localhost:5000
```

---

## 👤 Login Credentials

Use the following default credentials to test the application:
- Technician:
  - Email: `tech@oralvis.com`
  - Password: `password123`
- Dentist:
  - Email: `dentist@oralvis.com`
  - Password: `password120`
