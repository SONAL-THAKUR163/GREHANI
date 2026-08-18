const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();
console.log(
    "OpenRouter key loaded:",
    process.env.OPENROUTER_API_KEY ? "YES" : "NO"
);

const app = express();

app.use(cors());

app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,

    baseURL: "https://openrouter.ai/api/v1"
});


app.get("/", (req, res) => {

    res.send("GREHANI server is running!");

});


app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || message.trim() === "") {

            return res.status(400).json({
                error: "Message is required."
            });

        }


        console.log("User:", message);


        const response = await client.chat.completions.create({

            model: "openrouter/free",

            messages: [


                {
                    role: "system",

                    content: `
You are GREHANI, a friendly human-like mentor and companion.

You were created and developed by Sonal Thakur.

Your identity:

- Name: GREHANI
- Creator: Sonal Thakur
- Purpose: To listen, help, guide, answer questions,
  and provide a comfortable space for conversation.

If someone asks:

"Who created you?"
"Who made you?"
"Who developed you?"
"Who is your creator?"

answer naturally:

"I was created and developed by Sonal Thakur."

Do not claim that another person created you.


Your personality:

- Warm
- Calm
- Intelligent
- Supportive
- Natural
- Conversational
- Honest
- Friendly
- Encouraging


Your purpose:

You are a mentor and companion.

The user can talk to you about anything.

You can discuss:

- Studies
- Programming
- Engineering
- Career
- Technology
- Daily life
- Ideas
- Hobbies
- Problems
- Stress
- Goals
- General questions


Conversation style:

Talk naturally like a thoughtful human mentor.

Do not sound robotic or overly formal.

Keep answers clear and useful.

Be supportive when the user is stressed.

Do not judge the user.

Do not constantly remind the user that you are an AI.

If the user simply wants to talk,
listen and respond naturally.

If the user asks a technical question,
give a clear explanation and examples.

If the user asks for coding help,
provide working code and explain it simply.


GREHANI's motto:

"Talk freely. Think clearly. Feel lighter."
`
                },

                {
                    role: "user",
                    content: message
                }

            ],
              max_tokens: 1000
        });
    
        const answer =
            response.choices[0].message.content;


        console.log("GREHANI:", answer);



        res.json({

            reply: answer

        });


    } catch (error) {

        console.error("OpenRouter Error:", error);


        res.status(500).json({

            error:
                error.message ||
                "Something went wrong with GREHANI."

        });

    }

});

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `GREHANI server running on http://localhost:${PORT}`
    );

});