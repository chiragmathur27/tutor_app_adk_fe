# Tutor Chatbot Frontend

A modern, responsive React-based frontend application for the AI Tutor Chatbot system.

## Overview

This frontend application provides a user-friendly interface for interacting with the AI tutor chatbot. It's built using React and styled with Tailwind CSS, offering a clean and intuitive chat interface for users to engage with the AI tutor.


Deployed URL = [Link](https://tutor-app-adk-fe.vercel.app/)

## Features

- Modern, responsive chat interface
- Real-time message display
- User-friendly input system
- Loading states and error handling
- Integration with backend API
- Beautiful UI with Tailwind CSS

## Tech Stack

- Framework: React 19.1.0
- Styling: Tailwind CSS 3.4.17
- Icons: React Feather
- Development Tools: React Scripts 5.0.1

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chiragmathur27/tutor_app_adk_fe
cd tutor-chatbot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm run build`

Builds the app for production to the `build` folder. The build is minified and the filenames include the hashes.

#### `npm test`

Launches the test runner in interactive watch mode.

#### `npm run eject`

Note: this is a one-way operation. Once you `eject`, you can't go back!

## Project Structure

```
tutor-chatbot/
├── public/              # Static files
├── src/
│   ├── App.css         # Main component styles
│   ├── App.js          # Main application component
│   ├── index.css       # Global styles
│   └── index.js        # Entry point
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md          # Project documentation
```

## Development

### Running in Development

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Building for Production

To create a production build:
```bash
npm run build
```

The build will be created in the `build` folder and can be served using any static file server.

### Styling

The application uses Tailwind CSS for styling. Customize the theme by modifying the `tailwind.config.js` file.

## Deployment

The application is ready for deployment after running `npm run build`. The build output is in the `build` folder and can be deployed to any static hosting service.
