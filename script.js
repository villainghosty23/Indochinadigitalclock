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

// Format time for conversion result (without seconds)
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

// Get current EST time with timezone label (EST or EDT)
function getESTTimeWithLabel(now) {
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const estLabel = est.toLocaleTimeString("en-US", { timeZone: "America/New_York", timeZoneName: "short" }).split(' ')[2] || "EST";
  return { est, estLabel };
}

// Update the clocks and date display
function updateClocks() {
  const now = new Date();

  // Get times in different timezones
  const { est, estLabel } = getESTTimeWithLabel(now);
  const ict = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const ictLabel = "ICT";

  // Update the display
  document.getElementById("estClock").textContent = `${formatTime(est)} ${estLabel}`;
  document.getElementById("ictClock").textContent = `${formatTime(ict)} ${ictLabel}`;
  document.getElementById("dateNow").textContent = now.toDateString();
}

// Convert time between timezones
function convertTime() {
  const input = document.getElementById("inputTime").value.trim();
  const fromZone = document.getElementById("fromZone").value;

  if (!input) {
    alert("Please enter a time to convert");
    return;
  }

  // Support input in HH:MM or HH:MM AM/PM format
  const timeRegex = /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i;
  const match = input.match(timeRegex);

  if (!match) {
    alert("Invalid time format. Please use HH:MM or HH:MM AM/PM");
    return;
  }

  let [, rawHours, rawMinutes, ampm] = match;
  let hours = parseInt(rawHours, 10);
  const minutes = parseInt(rawMinutes, 10);

  if (minutes < 0 || minutes > 59 || hours < 1 || hours > 12 && ampm) {
    alert("Invalid time. Hours should be 1-12 and minutes 00-59 for 12-hour format.");
    return;
  }

  if (isNaN(hours) || isNaN(minutes)) {
    alert("Invalid time format. Please use HH:MM");
    return;
  }

  if (ampm) {
    ampm = ampm.toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  } else if (!is24Hour) {
    // If input is in 12-hour format but no AM/PM given, assume AM (you can change this logic)
    if (hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23) {
    alert("Invalid hour value after conversion");
    return;
  }

  const now = new Date();

  // Create a date object in the source timezone with today's date and input time
  let sourceDate;
  if (fromZone === "EST") {
    sourceDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  } else {
    sourceDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  }
  sourceDate.setHours(hours, minutes, 0, 0);

  // Convert to target timezone
  let targetDate;
  if (fromZone === "EST") {
    targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  } else {
    targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
  }

  const resultTime = formatTimeForConversion(targetDate);
  const resultDate = targetDate.toDateString();
  const toZone = fromZone === "EST" ? "Indochina Time (ICT)" : "Eastern Time (EST/EDT)";

  document.getElementById("convertedResult").innerHTML = `
    <div>Converted to <strong>${toZone}</strong>:</div>
    <div class="result-time">${resultTime}</div>
    <div class="result-date">${resultDate}</div>
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
  if (document.getElementById("inputTime").value.trim()) {
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
