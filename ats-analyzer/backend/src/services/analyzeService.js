const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const { GoogleGenAI } = require('@google/genai');

const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE';
const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_KEY_HERE';

const isMockMode = !hasOpenAI && !hasGemini;

const openai = hasOpenAI ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;

const ai = hasGemini ? new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
}) : null;

async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (e) {
        console.warn('Failed to delete file:', filePath, e);
    }
}

async function extractPdfText(pdfPath) {
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
}

/**
 * Helper to call Gemini specifically with structured JSON output instructions
 */
async function callGeminiFallback(systemPrompt, userPrompt) {
    try {
        const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
        // The new SDK uses gemini-2.5-flash as the default standard model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                systemInstruction: "You strictly output JSON only. No markdown formatting, no code blocks (like ```json). Just the raw JSON object.",
                temperature: 0.1,
            }
        });

        let text = response.text;
        // Clean up markdown block if the model outputs it accidentally
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Fallback Error:", error);
        throw new Error("Both OpenAI and Gemini requests failed. Please check your API keys and quotas.");
    }
}


/**
 * Page 1: General ATS Resume Checker (No JD)
 */
exports.processGeneralResume = async (pdfPath) => {
    let resumeText = '';
    try {
        resumeText = await extractPdfText(pdfPath);
    } catch (error) {
        throw new Error("Could not read the PDF file. It might be corrupted or in an unsupported format.");
    } finally {
        await deleteFile(pdfPath);
    }

    if (isMockMode) {
        await new Promise(r => setTimeout(r, 1500));
        return {
            "ats_score": 75,
            "strengths": ["Strong action verbs", "Clear formatting", "Good summary"],
            "weaknesses": ["Lacks quantified achievements", "Missing some buzzwords"],
            "missing_best_practices": ["Links to GitHub/Portfolio missing", "Dates not consistent"],
            "improvement_guidance": ["Add more numbers to highlight your impact.", "Tailor specific skills to the job description."],
            "quantified_achievement_suggestions": ["Increased sales by X%", "Managed team of Y people", "Reduced load time by Z seconds"],
            "ats_friendly_rewrite": "This is a mocked ATS-friendly rewrite of your resume.\n\n[MOCK MODE ACTIVE] Please provide a valid OpenAI API Key in your backend .env file to see genuine AI-generated results for your resume."
        };
    }

    const systemPrompt = `
You are an expert Applicant Tracking System (ATS) evaluator and career coach.
Analyze the provided resume text and return ONLY a JSON object evaluating its general ATS-readiness.

1. Evaluate formatting, keyword usage, measurable achievements, and missing sections.
2. Rewrite the resume text into a clean, highly ATS-compatible format suitable for plain text rendering.

Return ONLY a JSON object matching this schema:
{
  "ats_score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "missing_best_practices": string[],
  "improvement_guidance": string[],
  "quantified_achievement_suggestions": string[],
  "ats_friendly_rewrite": string
}
`;

    const userPrompt = `
Resume Text:
"""${resumeText}"""
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (e) {
        console.warn("OpenAI Error caught, falling back to Gemini:", e.message);
        return await callGeminiFallback(systemPrompt, userPrompt);
    }
};

/**
 * Page 2: JD-Based ATS Optimizer (Tailored)
 */
exports.processTailoredResume = async (pdfPath, jobDescription) => {
    let resumeText = '';
    try {
        resumeText = await extractPdfText(pdfPath);
    } catch (error) {
        throw new Error("Could not read the PDF file. It might be corrupted or in an unsupported format.");
    } finally {
        await deleteFile(pdfPath);
    }

    if (isMockMode) {
        await new Promise(r => setTimeout(r, 1500));
        return {
            "match_score": 82,
            "matched_keywords": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
            "missing_keywords": ["Docker", "Kubernetes", "AWS CI/CD"],
            "priority_missing_skills": ["Docker", "AWS"],
            "tailored_summary": "[MOCK SUMMARY] A seasoned developer with strong frontend skills and emerging backend capability. Please provide a valid OpenAI API Key for real results.",
            "optimized_resume": "[MOCK OPTIMIZED RESUME]\n\nJane Doe\nSoftware Engineer\njane@example.com\n\nExperience:\n- Built web applications\n\nPlease provide an OpenAI Key in the .env file for real AI optimization.",
            "keyword_density_analysis": ["React (high)", "Node (medium)", "Docker (missing)"],
            "resume_data": {
                "name": "Jane Doe (Mock Data)",
                "title": "Software Engineer",
                "phone": "+1 234 567 8900",
                "email": "jane.doe@example.com",
                "location": "San Francisco, CA",
                "linkedin": "linkedin.com/in/janedoe",
                "github": "github.com/janedoe",
                "summary": "Software Engineer with 5 years experience.",
                "skills": ["JavaScript", "React", "Node.js", "CSS"],
                "experience": [{ "title": "Frontend Developer", "company": "Tech Corp", "dates": "2020-2023", "description": "Built scalable web platforms and optimized performance." }],
                "education": [{ "degree": "B.S. Computer Science", "school": "State University", "dates": "2016-2020", "details": "Graduated with Honors." }],
                "projects": [{ "name": "Portfolio App", "description": "Personal site with React", "technologies": ["React", "Vite"] }],
                "references": ["John Smith, Manager - jsmith@techcorp.com", "Available upon request"],
                "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position..."
            }
        };
    }

    const systemPrompt = `
You are an expert ATS optimizer.
Compare the applicant's resume against the target Job Description.

1. Perform keyword gap analysis (extract technical/soft skills from JD, find what's missing in resume).
2. Calculate a realistic ATS match percentage.
3. Rewrite the resume to be fully optimized for this JD, ensuring keywords are inserted naturally.
4. Also extract structural "resume_data" to render the optimized resume in visual templates. Ensure you extract education, and references if they exist. Do NOT include an objective.

Return ONLY a JSON object matching this schema:
{
  "match_score": number (0-100),
  "matched_keywords": string[],
  "missing_keywords": string[], // CRITICAL: You must explicitly list important technical and soft skills present in the JD but completely missing in the resume text.
  "priority_missing_skills": string[], // CRITICAL: Top 2-3 most fatal missing skills that the candidate must add to pass ATS.
  "tailored_summary": string,
  "optimized_resume": string,
  "keyword_density_analysis": string[],
  "resume_data": {
    "name": string,
    "summary": string,
    "skills": string[],
    "experience": [{"title":string, "company":string, "dates":string, "description":string}],
    "education": [{"degree":string, "school":string, "dates":string, "details":string}],
    "projects": [{"name":string, "description":string, "technologies":string[]}],
    "references": string[],
    "cover_letter": string
  }
}
`;

    const userPrompt = `
Resume Text:
"""${resumeText}"""

Job Description:
"""${jobDescription}"""
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (e) {
        console.warn("OpenAI Error caught, falling back to Gemini:", e.message);
        return await callGeminiFallback(systemPrompt, userPrompt);
    }
};
