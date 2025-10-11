# PolicyMe

A modern web application for browsing, searching, and tracking government policies and legislative issues. PolicyMe provides an intuitive interface to explore trending policy topics, making it easier for citizens to stay informed about important issues affecting their communities.

## Overview

PolicyMe is a full-stack application designed to help users discover and understand government policies across various categories including healthcare reform, climate policy, tax legislation, education funding, and immigration policy. The platform features trending issue tracking, policy search functionality, and detailed policy information.

## Features

- 🔍 **Policy Search** - Search and filter through policies by topic, category, or keyword
- 📊 **Trending Issues** - Stay updated with the most discussed policy topics
- 📖 **Policy Details** - View comprehensive information about specific policies
- 🗂️ **Browse & Archive** - Navigate through current and archived policies
- 🎨 **Modern UI** - Clean, responsive design built with modern web technologies

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI, Lucide React icons

### Backend
- **Framework**: Spring Boot (Java)
- **Build Tool**: Maven

## Project Structure

```
PolicyMe/
├── front-end/policy-me-frontend/    # Next.js frontend application
│   ├── src/
│   │   ├── app/                     # Next.js app directory
│   │   ├── components/              # React components
│   │   │   ├── layout/              # Header, Footer
│   │   │   ├── policy/              # Policy-related components
│   │   │   └── ui/                  # Reusable UI components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API integration services
│   │   └── types/                   # TypeScript type definitions
│   └── package.json
└── back-end/Policyme/               # Spring Boot backend
    └── src/main/java/com/policyme/
        └── Policyme/
            ├── controller/          # REST API endpoints
            ├── service/             # Business logic
            ├── entity/              # Data models
            ├── dto/                 # Data transfer objects
            ├── config/              # Application configuration
            ├── security/            # Security configuration
            └── filter/              # Request/response filters
```

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- Java JDK (v11 or higher)
- Maven

### Frontend Setup

```bash
cd front-end/policy-me-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd back-end/Policyme
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8080`

## Development

- Frontend uses Turbopack for fast development builds
- Backend follows Spring Boot best practices with layered architecture
- API services are separated for maintainability
- Type-safe development with TypeScript on the frontend

## Contributing

This is a work in progress. More features and documentation coming soon!

## Developers

Muhammad Hashir, Nilesh Gupta, Danial Khurshid, Orhan Koylu
