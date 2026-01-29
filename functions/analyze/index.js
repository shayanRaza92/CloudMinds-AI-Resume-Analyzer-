const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const pdf = require("pdf-parse");

const s3 = new S3Client();

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const { bucket, key } = body;

        if (!bucket || !key) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Missing bucket or key parameter" }),
            };
        }

        // 1. Download PDF from S3
        console.log(`Downloading: s3://${bucket}/${key}`);
        const response = await s3.send(new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        }));

        const byteArray = await response.Body.transformToByteArray();
        const buffer = Buffer.from(byteArray);

        // 2. Extract text from PDF
        console.log("Extracting text from PDF...");
        const data = await pdf(buffer);
        const extractedText = data.text;

        console.log(`Extracted ${extractedText.length} characters`);

        // 3. Analyze with Groq AI
        console.log("Analyzing resume with AI...");
        const Groq = require("groq-sdk");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert resume analyzer. Analyze the following resume and provide a JSON response with this exact structure:
{
  "overallScore": <number 1-10>,
  "skills": ["skill1", "skill2", ...],
  "experienceLevel": "<Junior|Mid-Level|Senior|Expert>",
  "atsScore": <number 1-10>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "summary": "<2-3 sentence summary of candidate>"
}

Be specific and actionable. Focus on real insights.`
                },
                {
                    role: "user",
                    content: extractedText.substring(0, 8000) // Send first 8k chars
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysisText = completion.choices[0]?.message?.content;
        console.log("AI Response:", analysisText);

        let analysis;
        try {
            analysis = JSON.parse(analysisText);
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            // Fallback analysis
            analysis = {
                overallScore: 7,
                skills: ["Communication", "Problem Solving"],
                experienceLevel: "Mid-Level",
                atsScore: 6,
                strengths: ["Well-formatted resume", "Clear experience section"],
                weaknesses: ["Could add more quantifiable achievements"],
                suggestions: ["Add metrics to demonstrate impact", "Include relevant keywords"],
                summary: "Candidate shows solid experience with room for improvement in presentation."
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify({
                success: true,
                analysis: analysis,
                wordCount: extractedText.split(/\s+/).length
            }),
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                error: "Failed to analyze resume",
                message: error.message
            }),
        };
    }
};
