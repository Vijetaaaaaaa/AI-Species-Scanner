const URL = "./";

let model, webcam, labelContainer, maxPredictions;

// Prevents flickering
let lastPrediction = "";

const scannerMessages = [
    "Scanning subject...",
    "Running species analysis...",
    "Checking for waddling patterns...",
    "Analyzing fluff density..."
];

// Funny human verdicts
const humanVerdicts = [
    "🕵️ May secretly be a penguin.",
    "🚶 Suspicious amount of waddling detected.",
    "✅ Appears harmless. Continue observation.",
    "❄ Definitely not from Antarctica."
];

// Funny penguin verdicts
const penguinVerdicts = [
    "🐟 Certified professional waddler.",
    "🧊 CEO of Antarctica.",
    "🐧 Wanted for stealing fish.",
    "🏆 Olympic waddling champion."
];

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;

    webcam = new tmImage.Webcam(250, 250, flip);

    await webcam.setup();
    await webcam.play();

    window.requestAnimationFrame(loop);

    document
        .getElementById("webcam-container")
        .appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
}

async function loop() {

    webcam.update();

    await predict();

    window.requestAnimationFrame(loop);

}

async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let bestPrediction = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > bestPrediction.probability) {
            bestPrediction = prediction[i];
        }
    }

    // Don't redraw if nothing changed
    if (bestPrediction.className === lastPrediction) return;

    lastPrediction = bestPrediction.className;

    const confidence = (bestPrediction.probability * 100).toFixed(1);

    if (bestPrediction.className === "Penguin") {

        const penguinVerdicts = [
            "🐟 Certified professional waddler.",
            "🧊 CEO of Antarctica.",
            "🏆 Olympic waddling champion.",
            "🚨 Wanted for stealing fish.",
            "🧭 Iceberg navigation expert.",
            "🐧 Possesses elite waddling abilities."
        ];

        const verdict =
            penguinVerdicts[Math.floor(Math.random() * penguinVerdicts.length)];

        labelContainer.innerHTML = `
        <div class="card penguin">

        <h4>🛰 AI SPECIES IDENTIFICATION PORTAL</h4>

        <hr>

        <h2>🐧 Identity Confirmed</h2>

        <p><strong>Species:</strong> Penguin</p>

        <p><strong>Confidence:</strong> ${confidence}%</p>

        <p>🪶 Fluff Index : 100%</p>

        <p>🚶 Waddle Probability : 99%</p>

        <p>🐟 Fish Affinity : 100%</p>

        <p>❄ Habitat : Antarctica</p>

        <p><strong>Threat Level:</strong> 🟢 Harmless</p>

        <h3>AI Notes</h3>

        <p>${verdict}</p>

        </div>
        `;

    } else {

        const humanVerdicts = [
            "🕵️ May secretly be a penguin.",
            "🚶 Suspicious amount of waddling detected.",
            "✅ Appears harmless. Continue observation.",
            "❄ Definitely not from Antarctica.",
            "🐧 Penguin DNA not detected.",
            "☕ Safe to consume coffee unsupervised.",
            "💻 Cleared to operate a laptop."
        ];

        const fluff = Math.floor(Math.random() * 20) + 5;
        const waddle = Math.floor(Math.random() * 35) + 5;
        const fish = Math.floor(Math.random() * 15) + 1;

        const verdict =
            humanVerdicts[Math.floor(Math.random() * humanVerdicts.length)];

        labelContainer.innerHTML = `
        <div class="card human">

        <h4>🛰 AI SPECIES IDENTIFICATION PORTAL</h4>

        <hr>

        <h2>🧑 Identity Confirmed</h2>

        <p><strong>Species:</strong> Homo sapiens</p>

        <p><strong>Confidence:</strong> ${confidence}%</p>

        <p>🪶 Fluff Index : ${fluff}%</p>

        <p>🚶 Waddle Probability : ${waddle}%</p>

        <p>🐟 Fish Affinity : ${fish}%</p>

        <p>❄ Penguin DNA : 0.03%</p>

        <p><strong>Threat Level:</strong> 🟢 Low</p>

        <h3>AI Notes</h3>

        <p>${verdict}</p>

        </div>
        `;

    }

}