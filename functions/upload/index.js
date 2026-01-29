const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event, null, 2));

    // Handle CORS for browser
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
        // 1. Get filename from Query String (support both filename and fileName)
        const filename = event.queryStringParameters?.filename || event.queryStringParameters?.fileName;

        if (!filename) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing 'filename' or 'fileName' query parameter" }),
            };
        }

        // 2. Define the S3 Key (File path)
        const key = `uploads/${Date.now()}_${filename}`;

        // 3. Generate the Presigned URL
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: "application/pdf", // Enforce PDF for now
        });

        // URL expires in 5 minutes (300 seconds)
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                uploadUrl: signedUrl,
                key: key,
                bucket: BUCKET_NAME
            }),
        };

    } catch (error) {
        console.error("Error generating URL:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Internal Error" }),
        };
    }
};
