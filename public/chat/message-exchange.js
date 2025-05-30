const messagesContainer = document.querySelector("#chat-container #messages-container");

const socket = io("/chat");
socket.on("connect", () => {
    console.log("Connected to server with id: " + socket.id);
});

socket.emit("joinRoom", chatId);

socket.on("message", (msg) => {
    let parsedMessage = JSON.parse(msg);
    messagesContainer.innerHTML += "<div class='message received'>" + parsedMessage.text + "</div>";

})

const form = document.querySelector("#send-message-form");
form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.sender = userId;

    messagesContainer.innerHTML += "<div class='message sent'>" + data.text + "</div>";

    socket.emit("message", JSON.stringify(data));
    console.log("Sent: ", data);

    form.reset();
});


const root = document.querySelector(":root");
const applyButton = document.querySelector("#settings-panel button");
const settingsButton = document.querySelector(".settings-button");

applyButton.addEventListener("click", () => {
    root.style.setProperty('--sent-color', document.querySelector('#sent-color').value);
    root.style.setProperty('--received-color', document.querySelector('#received-color').value);
    root.style.setProperty('--chat-bg', document.querySelector('#chat-bg').value);
});

settingsButton.addEventListener("click", () => {
    const panel = document.querySelector('#settings-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
})