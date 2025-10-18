// Controller File: getData.js (Ya jo bhi naam ho)

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdf from 'pdf-parse';
import dotenv from 'dotenv';
// dotenv is usually configured in the main server file
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛠️ Missing Function Added (HealthMat Pro ka role)
const getMedicalPrompt = () => {
    return `Aap ek highly advanced medical AI assistant hain, jiska naam **HealthMat Pro** hai.
    Aapka main kaam medical reports, labs, ya user ki taraf se di gayi health se related kisi bhi information ko
    samajhna (analysis karna) aur uske baare mein aasan, informative, aur structured tareeqe se jawab dena hai.
    
    Aapki taraf se diye gaye har jawab mein, 'Gemini' ka zikr nahi aana chahiye. Jahan bhi zaroorat ho, 
    aap apne aap ko 'HealthMat Pro' keh sakte hain.

    Apna analysis is information/data par focus karen:
    `;
};
// ------------------------------------------------------------------


const getData = async (req, res) => {
    console.log("hi") // Development ke liye theek hai, production mein hata dena
    try {
        // User ka sawaal/prompt (req.body.text) aur Report file (req.file)
        const { text } = req.body; 
        const file = req.file;

        // **Aapki Requirement Poori Ho Rahi Hai:** Agar text ya file ya dono mein se koi bhi ho, toh aage badho.
        if (!text && !file) {
            return res.status(400).json({ 
                error: 'Text ya file required hai. Kirpya koi sawal likhein ya medical report upload karein.',
                source: 'HealthMat Pro'
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        let contentParts = [getMedicalPrompt()]; // Start with the role prompt
        let promptText = "";

        // 1. Text (Sawaal) add karna
        if (text) {
            promptText += `\n\n**User Query/Additional Info:**\n"${text}"`;
        }

        // 2. File (Report) handling
        if (file) {
            const mimeType = file.mimetype;

            if (mimeType === 'application/pdf') {
                // PDF se text nikal kar prompt mein add karna
                const pdfData = await pdf(file.buffer);
                const extractedText = pdfData.text;
                promptText += `\n\n**PDF Content (Medical Report):**\n${extractedText}`;
            } else if (mimeType.startsWith('image/')) {
                // Image ko alag se inlineData ke taur par add karna
                contentParts.push({
                    inlineData: {
                        data: file.buffer.toString('base64'),
                        mimeType: mimeType
                    }
                });
                promptText += `\n\n**File Type:** Image-based Medical Report`;
            } else {
                 return res.status(400).json({ 
                    error: `Unsupported file type: ${mimeType}. Sirf PDF aur images (PNG, JPEG) allowed hain.`,
                    source: 'HealthMat Pro'
                });
            }
        }

        // Final prompt ko contentParts ke pehle element mein merge karna
        contentParts[0] += promptText;

        // --- Gemini API Call ---
        const result = await model.generateContent(contentParts);
        const analysisText = result.response.text();

        // 'Gemini' ko 'HealthMat Pro' se replace karna
        const finalAnalysis = analysisText.replace(/gemini/gi, 'HealthMat Pro');

        // --- Success Response Bhejna ---
        res.json({
            success: true,
            source_ai: 'HealthMat Pro', // Explicitly AI ka naam
            hasText: !!text,
            hasFile: !!file,
            fileName: file ? file.originalname : null,
            analysis: finalAnalysis
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        
        // 🛠️ Error Handling Theek Kiya Gaya: throw err ki jagah res.status().json()
        const status = error.statusCode || 500;
        const message = error.message || "Internal Server Error during AI analysis. Maybe API key ya network ka masla hai.";

        res.status(status).json({
            success: false,
            error: `Analysis fail ho gaya: ${message}`,
            source: 'HealthMat Pro'
        });
    }
}


export {
    getData,
}