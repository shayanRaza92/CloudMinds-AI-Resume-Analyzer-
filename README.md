# CloudMinds - AI Resume Analyzer

Hi! This is **CloudMinds**, a project I built to help people check their resumes using AI. Instead of just a random score, it actually reads the resume and gives specific advice on how to improve it.

I built this to learn how to connect a modern React frontend with a fully serverless AWS backend.

## The Tech Stack & How I Built It

Here is a look under the hood at what tools I used and exactly where they fit into the project.

### 1. **Infrastructure as Code (AWS CDK)**
Instead of clicking buttons in the AWS console, I wrote code to create all my servers and databases.
- **Where:** [`lib/cloud-minds-stack.ts`](lib/cloud-minds-stack.ts)
- **How:** This file is the "blueprint". I defined my **S3 buckets** (for storing resumes), **Lambda functions** (the code that runs), and **API Gateway** (the front door for requests) all in TypeScript.

### 2. **The Brain (Groq AI & Llama 3)**
This is the core intelligence. I used Groq because it is incredibly fast at running the Llama 3 AI model.
- **Where:** [`functions/analyze/index.js`](functions/analyze/index.js)
- **How:** Inside the `handler` function, I take the text from the PDF and send it to Groq with a custom prompt. I tell the AI: *"You are an expert resume analyzer,"* and it sends back a JSON response with scores, skills, and advice.

### 3. **Serverless Backend (AWS Lambda)**
I didn't want to manage a server that runs 24/7, so I used Lambda functions that only run when someone uses the site.
- **Upload Function** ([`functions/upload/index.js`](functions/upload/index.js)): This generates a secure "presigned URL" so the frontend can upload the PDF directly to S3 safely.
- **Analyze Function** ([`functions/analyze/index.js`](functions/analyze/index.js)): This triggers after the upload. It downloads the file, reads the text using `pdf-parse`, and talks to the AI.

### 4. **Frontend (React + Vite)**
The website itself is built with React.
- **Where:** [`frontend/src/App.jsx`](frontend/src/App.jsx)
- **How:** This file handles everything the user sees.
    - `handleAnalyze()`: This function ties it all together. First, it asks the backend for a safe upload link, uploads the file, and then asks the analysis Lambda to process it.
    - **Visuals:** I used `recharts` for the score gauges and `lucide-react` for the icons to make it look clean and modern.

### 5. **Hosting (AWS S3 & CloudFront)**
- **Where:** Configured in [`lib/cloud-minds-stack.ts`](lib/cloud-minds-stack.ts)
- **How:** The React code is turned into static files and stored in an S3 bucket. CloudFront then distributes it globally so the site loads fast for everyone, no matter where they are.

---

## How to Run It

1. **Install Dependencies:** `npm install`
2. **Build Frontend:** `cd frontend && npm install && npm run build`
3. **Deploy:** `npx cdk deploy`

---

## Contact Me
If you have questions about the code or just want to chat:
- **Email:** [shayanraza2333@gmail.com](mailto:shayanraza2333@gmail.com)
- **LinkedIn:** [Connect with me](https://www.linkedin.com/in/shayan-raza-0402472a5/)

---
