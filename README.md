# Chat Application

This is a real-time chat application built using **Next.js 14**, **Socket.IO**, and **MongoDB**. It features user authentication with OTP via WhatsApp, real-time messaging, online/offline status tracking, and a search functionality for messages.

## Features

- **Real-time Messaging**: Powered by Socket.IO for instantaneous chat updates.
- **OTP Authentication**: User authentication is implemented using One-Time Password (OTP) sent via WhatsApp.
- **Message Search**: Users can search through their messages using a global state managed with Zustand.
- **User Online/Offline Status**: Real-time tracking of user presence in the chat application.
- **Responsive UI**: Built using **Tailwind CSS**, the app is optimized for various screen sizes.
- **Performance Optimized**: Includes optimizations for scrolling issues in the chat interface.

## Technologies Used

- **Next.js 14**: React framework for server-side rendering and building APIs.
- **Socket.IO**: WebSocket library for real-time communication between the client and server.
- **MongoDB**: NoSQL database for storing chat messages and user information.
- **Zustand**: A small, fast state-management solution for React.
- **Tailwind CSS**: A utility-first CSS framework for styling the UI.

## Getting Started

### Prerequisites

- Bun installed.
- MongoDB set up and running.
- WhatsApp Business API for OTP verification.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ahmdbnrsl/chat-app.git
    cd chat-app
    ```

2. Install dependencies:
    ```bash
    bun install
    ```

3. Set up environment variables:
    Create a `.env` file and add the following: `.env.example`

4. Run the development server:
    ```bash
    next dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

### Build for Production

To create a Production build:
```bash
next build
next start
```
