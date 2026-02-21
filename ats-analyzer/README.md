# AI-Powered ATS Resume Analyzer & JD Optimizer

An intelligent, full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The platform uses AI to analyze resumes against general ATS standards or specific Job Descriptions, providing actionable feedback, matching scores, and a live real-time resume editor to instantly build and download a perfectly formatted, ATS-compliant PDF resume.

## 🚀 Features

- **ATS Resume Checker**: Upload your resume to get a general ATS score, identifying fundamental formatting issues and overall readability.
- **JD-Based ATS Optimizer**: Compare your resume against a specific Job Description (JD). The AI engine identifies matched keywords, missing critical skills, and provides a customized improvement plan.
- **Live Real-Time Editor**: Edit your resume content within the app and instantly see the results in a beautiful, classic Professional Template.
- **1-Click PDF Export**: Download your newly optimized resume as a clean, A4-sized PDF that is perfectly formatted and recruiter-friendly.
- **Dual AI Integration**: Leverages both OpenAI and Google Gemini APIs for highly accurate semantic parsing and gap analysis.
- **Continuous Deployment Setup**: Includes PM2 configuration (`ecosystem.config.js`) for seamless deployment and background process management.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Styled Components (for modular CSS styling)
- React Router (for SPA navigation)
- React Circular Progressbar & React Icons
- html2pdf.js (for high-quality PDF generation)

**Backend:**
- Node.js & Express.js
- Multer (for robust file upload handling)
- PDF-Parse (for extracting text from uploaded resumes)
- OpenAI API & Google Gemini API (for AI analysis)
- CORS & Helmet (for security)
- PM2 (Process Manager)

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js installed on your machine.
- API keys from [OpenAI](https://platform.openai.com/) and [Google Gemini](https://aistudio.google.com/).

### 2. Clone the repository
```bash
git clone https://github.com/your-username/ats-analyzer.git
cd ats-analyzer
```

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` directory and add your API keys:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

### 5. Running the Application (Development)
You will need to run both the frontend and backend servers.
- **Backend:** `cd backend && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend:** `cd frontend && npm run dev` (Runs on `http://localhost:5173`)

## ⚡ Running in Production (PM2)
The project includes a PM2 `ecosystem.config.js` file to run both services simultaneously in the background.

```bash
# Install PM2 globally if you haven't already
npm install -g pm2

# From the root directory or inside the backend directory, run:
pm2 start ecosystem.config.js

# Helpful PM2 Commands
pm2 logs      # View live logs for both frontend and backend
pm2 list      # List running processes
pm2 stop all  # Stop the servers
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
