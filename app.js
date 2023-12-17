// Your Firebase configuration comes here
var firebaseConfig = {
apiKey: "AIzaSyCKuoLKspUfEKdkexgO7HD9yb0C32lFI9I",
authDomain: "esp-location-56ece.firebaseapp.com",
databaseURL: "https://esp-location-56ece-default-rtdb.firebaseio.com",
projectId: "esp-location-56ece",
storageBucket: "esp-location-56ece.appspot.com",
messagingSenderId: "415169225788",
appId: "1:415169225788:web:0780c061338be738b8cf39",
measurementId: "G-NP5SHD0WWD"
};

firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Realtime Database
var database = firebase.database();
var messagesRef = database.ref('messages');

// Function to get the user's name from storage or prompt
function getStudentName() {
    // Try to retrieve the unique identifier and name from localStorage
    var storedIdentifier = localStorage.getItem('studentIdentifier');
    var storedName = localStorage.getItem('studentName');

    // If the unique identifier is not stored, generate a random one
    if (!storedIdentifier) {
        storedIdentifier = Math.random().toString(36).substr(2, 5); // Generate a random string (5 characters)
        
        // Save the unique identifier in localStorage for future use
        localStorage.setItem('studentIdentifier', storedIdentifier);
    }

    // If the name is not stored, prompt the user to enter it
    if (!storedName) {
        storedName = prompt("Enter the name you want to be called:") || "Anonymous";

        // Save the name in localStorage for future use
        localStorage.setItem('studentName', storedName);
    }

    // Combine the name and unique identifier to create a unique user identifier
    return storedName + '-' + storedIdentifier;
}

function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var messageText = messageInput.value.trim();

    if (messageText !== '') {
        var sender = getStudentName();
        var timestamp = firebase.database.ServerValue.TIMESTAMP;

        messagesRef.push({
            sender: sender,
            message: messageText,
            timestamp: timestamp,
            status: 'Unread'
        });

        messageInput.value = '';
    }
}

messagesRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayMessage(message.sender, message.message, message.timestamp, message.status, snapshot.key);
});

function displayMessage(sender, message, timestamp, status, messageId) {
    var chatMessages = document.getElementById('chatMessages');
    var messageElement = document.createElement('div');
    messageElement.className = 'message';

    // Determine the alignment based on the sender
    var alignment = sender === 'Anonymous Student' ? 'right' : 'left';

    messageElement.innerHTML = `<p class="${alignment}"><strong>${sender}:</strong> ${message}</p>`;
    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add a separate element for the sparkling effect
    var sparkleElement = document.createElement('div');
    sparkleElement.className = 'sparkle';
    chatMessages.appendChild(sparkleElement);

    setTimeout(function () {
        // Remove the sparkle element after a short delay
        chatMessages.removeChild(sparkleElement);
    }, 2000); // Adjust the duration (in milliseconds) based on your preference

    messagesRef.child(messageId).update({
        status: 'Read'
    });
}