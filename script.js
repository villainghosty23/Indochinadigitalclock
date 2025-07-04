function convertTime() {
  const input = document.getElementById("inputTime").value;
  const fromZone = document.getElementById("fromZone").value;

  if (!input) return;

  const [hours, minutes] = input.split(":").map(Number);
  const now = new Date();

  // Create a date object in the source timezone
  let sourceDate;
  if (fromZone === "EST") {
    sourceDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  } else {
    sourceDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  }
  
  // Set the hours and minutes from input
  sourceDate.setHours(hours, minutes);

  // Convert to target timezone
  let targetDate;
  if (fromZone === "EST") {
    targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  } else {
    targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
  }

  const resultTime = formatTime(targetDate);
  const resultDate = targetDate.toDateString();
  const toZone = fromZone === "EST" ? "ICT" : "EST";

  document.getElementById("convertedResult").textContent =
    `Converted Time in ${toZone}: ${resultTime} on ${resultDate}`;
}
