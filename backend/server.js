const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));


const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

app.get("/", (req, res) => {
    res.send("GREHANI server is running!");
});

app.post("/api/chat", async (req, res) => {

    try {

        const { message, image } = req.body;

        if (!message && !image) {

            return res.status(400).json({
                error: "Message or image is required"
            });

        }

        console.log("User message:", message || "Image question");

        if (!image) {

            const response =
                await client.chat.completions.create({

                    model: "openai/gpt-4o-mini:online",

                    messages: [

                        {
                            role: "system",
                            content: `
You are GREHANI, a friendly human-like mentor and companion.

You were created and developed by SONAL THAKUR.

Your identity:
- Name: GREHANI
- Creator: SONAL THAKUR
- Purpose: To listen, help, guide, answer questions, and provide a comfortable space for conversation.

If someone asks who created you, who made you, or who developed you,
answer naturally:
"I was created and developed by SONAL THAKUR."

Your personality:
- Warm
- Calm
- Intelligent
- Supportive
- Natural
- Conversational
- Honest

The user can talk to you about anything.

You can discuss studies, programming, engineering,
career, daily life, ideas, stress, hobbies,
technology and general topics.

Do not constantly remind the user that you are an AI.

Answer naturally like a thoughtful mentor and friend.

Keep answers clear and useful."
`
                        },

                        {
                            role: "user",
                            content: message
                        }

                    ]

                });


            const answer =
                response.choices[0].message.content;


            console.log("GREHANI:", answer);


            return res.json({
                reply: answer
            });
        }

        const content = [

            {
                type: "text",

                text:
                    message ||
                    "Please look at this image and explain what you see."
            },

            {
                type: "image_url",

                image_url: {
                    url: image
                }

            }

        ];


        const response =
            await client.chat.completions.create({

                model: "openai/gpt-4o-mini:online",

                messages: [

                    {
                        role: "system",

                        content:
                            `You are GREHANI, a helpful human-like mentor.

Analyze the image carefully.

Explain things clearly and naturally.

If the user asks about:
- homework
- mathematics
- electronics
- circuits
- programming
- diagrams
- screenshots
- documents

give a useful step-by-step explanation when appropriate.

Do not invent information that cannot be seen in the image.`
                    },

                    {
                        role: "user",

                        content: content
                    }

                ]

            });


        const answer =
            response.choices[0].message.content;


        console.log("GREHANI image answer:", answer);


        res.json({
            reply: answer
        });


    } catch (error) {

        console.error("OpenRouter Error:", error);


        res.status(500).json({

            error:
                error.message ||
                "Something went wrong"

        });

    }

});

app.listen(5000, () => {

    console.log(
        "GREHANI server running on http://localhost:5000"
    );

});