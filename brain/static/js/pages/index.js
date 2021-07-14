window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

const commandsBox = document.getElementById("commands");
let listening = false;

recognition.addEventListener("result", (e) => {
    const text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

    if (e.results[0].isFinal) {
        printOurMessageToUser(text);
        computeRequest(text);
    }
});

const listenButton = document.getElementById("listen-button");
listenButton.addEventListener("click", () => {
    if (listening) {
        listening = false;
        recognition.stop();
    } else {
        listening = true;
        recognition.start();
    }
});
recognition.addEventListener("end", () => {
    if (!listening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});
// Started listening
recognition.addEventListener("audiostart", () => {
    if (listening) {
        document.querySelector("#microphone-svg").classList.add("listening");
        document.querySelector(".microphone-container").classList.add("listening");
    }
});
recognition.addEventListener("audioend", () => {
    if (!listening) {
        document.querySelector("#microphone-svg").classList.remove("listening");
        document.querySelector(".microphone-container").classList.remove("listening");
    }
});

// Active talking
recognition.addEventListener("soundstart", () => {
    document.querySelector(".microphone-container").classList.add("hearing");
});
recognition.addEventListener("soundend", () => {
    document.querySelector(".microphone-container").classList.remove("hearing");
});
document.querySelector("#command-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = document.getElementById("command-input").value;
    document.getElementById("command-input").value = "";
    printOurMessageToUser(value);
    computeRequest(value)
});

function actionCommand(command) {
    console.log("Actioning ", command);
}
function respondToUser(response, div, p) {
    if (response === "") {
        div.remove();
    } else {
        p.innerHTML = "";
        p.innerText = response;
    }
}
function printOurMessageToUser(message) {
    let p = document.createElement("p");
    let div = document.createElement("div");
    div.appendChild(p);
    p.innerText = message;
    commandsBox.appendChild(div);
}
function loaderIcon() {
    let loader = document.createElement("div");
    let span = document.createElement("span");
    loader.classList.add("spinner-border");
    loader.classList.add("text-dark");
    span.innerText = "Loading...";
    span.classList.add("visually-hidden");
    loader.appendChild(span);
    return loader;
}
function computeRequest(text) {
    let div  = document.createElement("div");
    let p = document.createElement("p");
    p.classList.add("reply");
    div.classList.add("div-reply-wrapper");
    p.append(loaderIcon());
    div.appendChild(p);
    commandsBox.appendChild(div);
    const csrftoken = document.cookie.split("=")[1];
    fetch("/command/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
            body: text
        })
    }).then(request => request.json())
    .then((response) => {
        if (response.code === 200) {
            respondToUser(response.message, div, p)
            actionCommand(response.message);
        }
    })
}
