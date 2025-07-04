let is24Hour = true;

function padZero(num) {
  return num.toString().padStart(2, '0');
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  if (is24Hour) {
    return `${padZero(hours)}:${minutes}:${seconds}`;
  } else {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${padZero(hours)}:${minutes}:${seconds} ${ampm}`;
  }
}

function updateClocks() {
  const now = new Date();

  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const ict = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

  document.getElementById("estClock").textContent = formatTime(est);
  document.getElementById("ictClock").textContent = formatTime(ict);
  document.getElementById("dateNow").textContent = now.toDateString();
}

function convertTime() {
  const input = document.getElementById("inputTime").value;
  const fromZone = document.getElementById("fromZone").value;

  if (!input) return;

  const [hours, minutes] = input.split(":").map(Number);
  const now = new Date();

  const inputDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hours,
    minutes
  ));

  let offsetHours;
  if (fromZone === "EST") {
    offsetHours = 7 + 4; // EST to UTC, then UTC to ICT
  } else {
    offsetHours = -7 - 4; // ICT to UTC, then UTC to EST
  }

  inputDate.setUTCHours(inputDate.getUTCHours() + offsetHours);

  const result = formatTime(inputDate);
  const toZone = fromZone === "EST" ? "ICT" : "EST";

  document.getElementById("convertedResult").textContent =
    `Converted Time in ${toZone}: ${result}`;
}

function toggleFormat() {
  is24Hour = !is24Hour;
  updateClocks();
}

// Run clock every second
updateClocks();
setInterval(updateClocks, 1000);
