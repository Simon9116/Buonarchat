const messagesContainer = document.querySelector("#messages");

const socket = io("/chat");
socket.on("connect", () => {
    console.log("Connected to server with id: " + socket.id);
});

socket.emit("joinRoom", chatId);

socket.on("message", (msg) => {
    let parsedMessage = JSON.parse(msg);
    messagesContainer.innerHTML += "<li>" + parsedMessage.text + "</li>";
})

const form = document.querySelector("#send-message-form");
form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    socket.emit("message", JSON.stringify(data));
    console.log("Sent: ", data);

    form.reset();
})