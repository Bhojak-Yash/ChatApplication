var stompClient = null;
var username = ""; // Variable to store the username temporarily during the session

// Function to send a message
function sendMessage() {
    let jsonOb = {
        name: username, // Use the stored username
        content: $("#message-value").val() // Get the message content
    }

    stompClient.send("/app/message", {}, JSON.stringify(jsonOb));

    // Clear the message input field
    $("#message-value").val("");
}

// Function to establish a WebSocket connection
function connect() {
    let socket = new SockJS("/server1");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log("Connected : " + frame)
        $("#name-from").addClass('d-none');
        $("#chat-room").removeClass('d-none');

        // Subscribe to the messaging topic
        stompClient.subscribe("/topic/return-to", function (response) {
            showMessage(JSON.parse(response.body));
        });
    });
}

// Function to clear the whole chat room
function clearChat() {
    $("#message-container-table").empty(); // Clear the message container
}

$(document).ready(() => {
    // ...

    // Logout button click event
    $("#logout").click(() => {
        username = ""; // Clear the username variable
        if (stompClient !== null) {
            stompClient.disconnect();
            clearChat(); // Clear the chat messages
            $("#name-from").removeClass('d-none');
            $("#chat-room").addClass('d-none');
            console.log(stompClient);
        }
    });
});

// Function to display a message in the chat
function showMessage(message) {
    let messageContainer = $("#message-container-table");
    let messageContent = "";

    // Add a class to the message container for left alignment
    messageContent = `<tr><td class="left-aligned-message"><b>${message.name}:</b> ${message.content}</td></tr>`;

    messageContainer.prepend(messageContent);
}


$(document).ready(() => {
    // Listen for "Enter" key press in the name input field
    $("#name-value").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            username = $("#name-value").val(); // Set the username variable
            $("#name-title").html(`Welcome, <b>${username}</b>`);
            connect();
        }
    });

    // Listen for "Enter" key press in the message input field
    $("#message-value").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    // Login button click event
    $("#login").click(() => {
        username = $("#name-value").val(); // Set the username variable
        $("#name-title").html(`Welcome, <b>${username}</b>`);
        connect();
    });

    // Send button click event
    $("#send-btn").click(() => {
        sendMessage();
    });

    // Logout button click event
    $("#logout").click(() => {
        username = ""; // Clear the username variable
        if (stompClient !== null) {
            stompClient.disconnect();
            $("#name-from").removeClass('d-none');
            $("#chat-room").addClass('d-none');
            console.log(stompClient);
        }
    });
});