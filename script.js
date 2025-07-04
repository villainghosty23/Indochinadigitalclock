let is24Hour = true;

// Helper function to pad numbers with leading zero
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// Format time based on current format setting
function formatTime(date) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  if (is24Hour) {
    return `${padZero(hours)}:${minutes}:${seconds}`;
  } else {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }
}

// Format time for conversion (without seconds)
function formatTimeForConversion(date) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());

  if (is24Hour) {
    return `${padZero(hours)}:${minutes}`;
  } else {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
}

// Update the clocks and date display
function updateClocks() {
  const now = new Date();

  // Get times in different timezones
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const ict = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

  // Update the display
  document.getElementById("estClock").textContent = formatTime(est);
  document.getElementById("ictClock").textContent = formatTime(ict);
  document.getElementById("dateNow").textContent = now.toDateString();
}

// Convert time between timezones
function convertTime() {
  const input = document.getElementById("inputTime").value;
  const fromZone = document.getElementById("fromZone").value;

  if (!input) {
    alert("Please enter a time to convert");
    return;
  }

  // Parse input time
  const [hours, minutes] = input.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes) {
    alert("Invalid time format. Please use HH:MM");
    return;
  }

  const now = new Date();

  // Create a date object in the source timezone
  let sourceDate;
  if (fromZone === "EST") {
    sourceDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  } else {
    sourceDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  }
  
  // Set the hours and minutes from input
  sourceDate.setHours(hours, minutes, 0);

  // Convert to target timezone
  let targetDate;
  if (fromZone === "EST") {
    targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  } else {
    targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
  }

  const resultTime = formatTimeForConversion(targetDate);
  const resultDate = targetDate.toDateString();
  const toZone = fromZone === "EST" ? "ICT" : "EST";

  document.getElementById("convertedResult").innerHTML = `
    <div>Converted Time in ${toZone}: <strong>${resultTime}</strong></div>
    <div>Date: <strong>${resultDate}</strong></div>
  `;
}

// Toggle between 12-hour and 24-hour format
function toggleFormat() {
  is24Hour = !is24Hour;
  updateClocks();
  
  // Update the toggle button text
  const toggleBtn = document.getElementById("toggleFormatBtn");
  toggleBtn.textContent = is24Hour ? "Switch to 12-hour" : "Switch to 24-hour";
  
  // If there's a conversion result, update it too
  if (document.getElementById("inputTime").value) {
    convertTime();
  }
}

// Initialize the application
function init() {
  // Set up event listeners
  document.getElementById("convertBtn").addEventListener("click", convertTime);
  document.getElementById("toggleFormatBtn").addEventListener("click", toggleFormat);
  
  // Initial update
  updateClocks();
  setInterval(updateClocks, 1000);
}

// Start the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", init);
