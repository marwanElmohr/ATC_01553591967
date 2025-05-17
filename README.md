# ATC_01553591967

A full-stack event booking web application built using **React**, **TypeScript**, **Tailwind CSS** for the frontend, and **Node.js** for the backend. Users can register, browse events, book tickets, and admins can manage events through a dedicated admin panel.

---

## Frontend

### Tech Stack

- React
- TypeScript
- Tailwind CSS

### Setup Instructions

1. Go to the frontend directory:
   ```bash
   cd frontend

2. Install dependencies:
    ```bash
    npm install

3. Run the development server:
    ```bash
    npm start


## Backend

### Tech Stack

- Node.js
- Express
- JWT
- MongoDB

### Setup Instructions

1. Go to the backend directory:
   ```bash
   cd backend

2. Install dependencies:
    ```bash
    npm install

3. Run the development server:
    ```bash
    node index.js


## For testing

On your browser, open https://localhost:3000.
For user access, register then view events, view details of a certain event, and book it.
For admin access, register then change the role in the mongo eventbooking database from the users' document to admin for the registered user. Log in with the admin credentials for admin access: events and a dashboard that contains read, update, create, and delete operations for events, and changing users' access from user to admin and vice versa.
