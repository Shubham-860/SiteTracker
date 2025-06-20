# SiteTracker (Frontend)

> **Note:** This frontend works with the [SiteTracker\_backend API](https://github.com/Shubham-860/SiteTracker_backend). Run the backend first.

## Project Overview

SiteTracker is a React app that monitors website uptime and response times, displaying real-time status and historical data.

## Demo / Screenshots

<p align="center">
  <img src="./src/assects/img/Login.png" alt="Login Screen" width="150" />
  <img src="./src/assects/img/Sidebar.png" alt="Sidebar Screen" width="150" />
  <img src="./src/assects/img/Picture3.png" alt="Add Record Screen" width="150" />
  <img src="./src/assects/img/Picture5.png" alt="All Records Screen" width="150" />
</p>


## Features

* User registration and authentication
* Add, edit, delete monitored sites
* Real-time status checks
* Historical uptime graphs
* Alert notifications via email or webhook

## Tech Stack

* React (Create React App)
* Axios
* Tailwind CSS

## Getting Started

### Prerequisites

* Node.js ≥ 14
* npm 
* Running SiteTracker\_backend API

### Installation & Run

```bash
git clone https://github.com/Shubham-860/SiteTracker.git
cd SiteTracker
npm install
# Create .env:
# REACT_APP_API_URL=http://localhost:4000/api
npm start
```

Visit `http://localhost:3000`.

## Project Structure

```text
SiteTracker/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   └── App.jsx
└── package.json
```

## Contributing

1. Fork the repo
2. `git checkout -b feature/YourFeature`
3. \`git commit -m "Add feature"
4. `git push origin feature/YourFeature`
5. Open a PR

---
