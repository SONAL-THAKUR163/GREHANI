const chatBox =
    document.getElementById("chatBox");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const micButton =
    document.getElementById("micButton");

const clearButton =
    document.getElementById("clearButton");

const status =
    document.getElementById("status");


const imageInput =
    document.getElementById("imageInput");

const imageButton =
    document.getElementById("imageButton");

const imagePreview =
    document.getElementById("imagePreview");

const darkModeButton =
    document.getElementById("darkModeButton");

let selectedImage = null;

async function sendMessage() {

    const message =
        messageInput.value.trim();

    if (message === "" && !selectedImage) {
        return;
    }

    if (selectedImage) {

        addMessage(
            message || "Please analyze this image.",
            "user",
            selectedImage
        );

    } else {

        addMessage(
            message,
            "user"
        );

    }


    messageInput.value = "";


    status.textContent =
        "GREHANI is thinking...";

    const thinking =
        addMessage(
            "Thinking...",
            "ai"
        );

    try {

        const response =
            await fetch(
                "https://grehani-v0nh.onrender.com/api/chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message:
                            message,

                        image:
                            selectedImage

                    })

                }
            );


        const data =
            await response.json();

        thinking.remove();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server error"
            );

        }

        addMessage(
            data.reply,
            "ai"
        );

        speakAnswer(
            data.reply
        );

        clearSelectedImage();


        status.textContent =
            "Ready";


    } catch (error) {

        console.error(
            "Error:",
            error
        );

        thinking.remove();
        addMessage(

            "Sorry, I could not connect to GREHANI.",
            "ai"

        );


        status.textContent =
            "Connection error";

    }

}

function addMessage(
    text,
    sender,
    image = null
) {

    const message =
        document.createElement("div");

    if (sender === "user") {
        message.className =
            "message user-message";
        message.innerHTML = `

            <div class="avatar">
                👤
            </div>

            <div class="message-content">

                <strong>
                    You
                </strong>

                ${image ?
                    `<img
                        src="${image}"
                        class="chat-image"
                    >`
                    :
                    ""
                }

                <p></p>
            </div>
        `;
    } else {

        message.className =
            "message ai-message";

        message.innerHTML = `

            <div class="avatar">
                🤖
            </div>

            <div class="message-content">

                <strong>
                    GREHANI
                </strong>

                <p></p>

            </div>

        `;

    }

    message
        .querySelector("p")
        .textContent = text;

    chatBox.appendChild(
        message
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;

    return message;

}

sendButton.addEventListener(
    "click",
    sendMessage
);

messageInput.addEventListener(
    "keydown",
    function(event) {
        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);

if (imageButton && imageInput) {

    imageButton.addEventListener(
        "click",
        function() {

            imageInput.click();

        }
    );

}

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image."
                );

                return;

            }

            if (
                file.size >
                7 * 1024 * 1024
            ) {

                alert(
                    "Please select an image smaller than 7 MB."
                );

                return;

            }


            const reader =
                new FileReader();

            reader.onload =
                function(e) {

                    selectedImage =
                        e.target.result;


                    if (imagePreview) {

                        imagePreview.src =
                            selectedImage;

                        imagePreview.style.display =
                            "block";

                    }
                };

            reader.readAsDataURL(
                file
            );

        }
    );

}
function clearSelectedImage() {
    selectedImage = null;


    if (imagePreview) {

        imagePreview.src = "";

        imagePreview.style.display =
            "none";

    }

    if (imageInput) {

        imageInput.value = "";

    }

}

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;
if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-IN";
    recognition.continuous =
        false;

    recognition.interimResults =
        false;

    recognition.onstart =
        function() {
            micButton.textContent =
                "🔴";

            status.textContent =
                "Listening...";

        };

    recognition.onresult =
        function(event) {
            const spokenText =
                event.results[0][0]
                    .transcript;

            messageInput.value =
                spokenText;

            sendMessage();

        };

    recognition.onend =
        function() {
            micButton.textContent =
                "🎤";

            status.textContent =
                "Ready";

        };


    recognition.onerror =
        function(event) {

            console.log(
                "Speech error:",
                event.error
            );

            micButton.textContent =
                "🎤";

            status.textContent =
                "Microphone error";

        };

}

micButton.addEventListener(
    "click",
    function() {

        if (!recognition) {

            alert(
                "Voice recognition is not supported. Please use Google Chrome."
            );

            return;

        }

        try {
            recognition.start();

        } catch (error) {

            console.log(error);

        }

    }
);

let availableVoices = [];
function loadVoices() {

    availableVoices =
        speechSynthesis.getVoices();

}
loadVoices();


speechSynthesis.onvoiceschanged =
    function() {

        loadVoices();

    };

function speakAnswer(text) {
    if (
        !window.speechSynthesis
    ) {

        return;

    }

    speechSynthesis.cancel();
    const voices =
        speechSynthesis.getVoices();

    const femaleVoice =
        voices.find(
            voice =>
                /female|zira|samantha|susan|karen|hazel|aria|jenny|libby|sonia/i
                    .test(voice.name)
                &&
                /en/i.test(
                    voice.lang
                )
        );

    const voice =
        new SpeechSynthesisUtterance(
            text
        );

    voice.lang =
        "en-IN";
    if (femaleVoice) {

        voice.voice =
            femaleVoice;

    }

    // Natural voice

    voice.rate =
        1.08;
    voice.pitch =
        1.2;

    voice.volume =
        1.0;

    speechSynthesis.speak(
        voice
    );

}


if (darkModeButton) {
    darkModeButton.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "dark-mode"
            );

            const dark =
                document.body.classList.contains(
                    "dark-mode"
                );

            localStorage.setItem(
                "grehaniDarkMode",
                dark
            );

            darkModeButton.textContent =
                dark
                    ? "☀️"
                    : "🌙";

        }
    );

}

const savedDarkMode =
    localStorage.getItem(
        "grehaniDarkMode"
    );

if (
    savedDarkMode === "true"
) {

    document.body.classList.add(
        "dark-mode"
    );


    if (darkModeButton) {

        darkModeButton.textContent =
            "☀️";

    }

}

clearButton.addEventListener(
    "click",
    function() {
        speechSynthesis.cancel();

        clearSelectedImage();
        chatBox.innerHTML = `

            <div class="message ai-message">

                <div class="avatar">
                    🤖
                </div>

                <div class="message-content">

                    <strong>
                        GREHANI
                    </strong>

                    <p>
                        Hello! 👋
                        How can I help you?
                    </p>

                </div>
            </div>
        `;
        status.textContent =
            "Ready";

    }
);