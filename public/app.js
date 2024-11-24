const messagesContainer = document.querySelector(".chat-container .messages");

const socket = io("/");
socket.on("connect", () => {
    console.log("Connected to server with id: " + socket.id);
});

socket.on("message", (msg) => {
    let parsedMessage = JSON.parse(msg);
    if(parsedMessage.sender !== socket.id) {
        messagesContainer.innerHTML += "<div class='message received'>" + parsedMessage.text + "</div>";
    }

})

const form = document.querySelector("#send-message-form");
form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.sender = socket.id;

    messagesContainer.innerHTML += "<div class='message sent'>" + data.text + "</div>";

    socket.emit("message", JSON.stringify(data));
    console.log("Sent: ", data);

    form.reset();
});