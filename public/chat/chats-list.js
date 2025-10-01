const chats = document.querySelectorAll("#chats-list div");
chats.forEach(chat => {
    chat.addEventListener("click", () => {
        window.location.href = "/chat/" + chat.dataset.chatId;
    })
})