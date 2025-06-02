# Buonarchat - Real-Time Chat Application

Buonarchat is a modern, self-hostable real-time chat application built with Node.js, Express.js, WebSockets, and MySQL. Designed with security and responsiveness in mind.

## Features

- **Real-time messaging** powered by WebSockets
- **Fully dockerized** for easy deployment
- **Self-hostable** - maintain complete control over your data
- **Responsive web interface** works on all devices
- **Security-focused**:
  - Protection against XSS (Cross-Site Scripting)
  - Prevention of SQL injection attacks
  - Secure authentication
- **MySQL database** for reliable data storage


## Technologies

- **Backend**: Node.js, Express.js
- **Real-time**: WebSockets (Socket.io)
- **Database**: MySQL
- **Containerization**: Docker
- **Frontend**: HTML5, CSS3, JavaScript

## Getting Started

### Prerequisites

- Docker (version 20.10.0+)
- Docker Compose (version 1.29.0+)

### Installation

```bash
git clone https://github.com/yourusername/buonarchat.git
cd buonarchat
# Edit .env files with your settings
docker-compose up -d
```
The application should now be running at `http://localhost:5000` (or the port you specified in `docker-compose.yml`).

## Usage

1. Access the web interface at `http://your-server-address:5000`
2. Register a new account or log in if you already have one
3. Start chatting in real-time!
