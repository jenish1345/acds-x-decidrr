ACDS (Autonomous Company Diagnostic System) is a SaaS platform designed to help organizations monitor their operational health, detect risks, and analyze business performance using AI-driven insights.

The system collects data from multiple departments such as HR, sales, operations, and finance, then analyzes the information to detect inefficiencies, identify anomalies, and provide actionable recommendations for business improvement.

Project Overview

Many companies rely on dashboards to track metrics, but dashboards often only show what is happening, not why it is happening.

ACDS solves this problem by providing:

automated risk detection

root cause analysis

impact estimation

strategic recommendations

This helps executives and decision-makers quickly identify business issues and take corrective action.

Key Features
Real-Time Company Health Monitoring

ACDS calculates an overall company health score to provide a quick overview of organizational performance.

AI-Driven Anomaly Detection

The system detects unusual patterns in business data using statistical analysis and machine learning techniques.

Root Cause Analysis

When issues are detected, the platform analyzes the data to identify potential causes and contributing factors.

Business Impact Estimation

ACDS estimates how detected problems may affect revenue, operations, and business performance.

Strategic Recommendations

The system suggests actions and improvement strategies that management teams can implement.

Department Risk Heatmap

Visual representation of risk levels across different departments.

Executive Reports

Automatically generated summaries suitable for leadership teams and board meetings.

AI & Data Intelligence

The platform integrates AI models and analytics techniques to improve decision-making.

AI Model Used

Groq Llama 3.3 70B

Capabilities include:

anomaly detection

trend analysis

risk assessment

intelligent recommendations

Technology Stack
Frontend

React 18

TypeScript

Tailwind CSS

Vite

React Router

Backend (Planned / Expandable)

Node.js / API services

MySQL database

AI & Data Processing

Groq Llama 3.3 70B

Statistical anomaly detection

Deployment

Vercel

Netlify

Docker compatible

Database

The system uses MySQL to manage enterprise data including:

company performance metrics

department analytics

alerts and risk reports

recommendations and insights

Installation

Clone the repository

git clone https://github.com/jenish1345/acds_platform.git
cd acds_platform

Install dependencies

npm install

Start development server

npm run dev

Open the project in your browser:

http://localhost:5173
Project Structure
acds_platform
│
├── src
│   ├── components
│   ├── views
│   ├── services
│   ├── ml
│   ├── data
│   └── types
│
├── public
└── docs
Use Cases
CEOs and Executives

Quickly evaluate company health and strategic risks.

CFOs

Analyze financial impact and detect cost anomalies.

COOs

Monitor operational efficiency across departments.

Managers

Track department performance and improvement initiatives.

Development Scripts

Run development server

npm run dev

Build production version

npm run build

Preview production build

npm run preview
Roadmap
Completed

Executive dashboard

Risk alerts system

Department heatmap

Data analysis engine

In Progress

Backend API development

MySQL database integration

Advanced AI analytics

Planned

Mobile app

Predictive analytics

API integrations with enterprise tools

Multi-language support

Contributing

Contributions are welcome.

Steps:

Fork the repository

Create a new branch

Commit your changes

Push the branch

Open a Pull Request

License

This project is licensed under the MIT License.

Author

Jenish

GitHub:
https://github.com/jenish1345

Final Note

ACDS is designed to help organizations move beyond traditional dashboards and adopt AI-driven decision intelligence for better strategic planning and risk management.
