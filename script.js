function updateClocks() {
    // Get current UTC time
    const now = new Date();
    
    // Indochina Time (UTC+7)
    const indochinaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    document.getElementById('indochina-time').textContent = formatTime(indochinaTime);
    document.getElementById('indochina-date').textContent = formatDate(indochinaTime);
    
    // New York Time (UTC-4 or UTC-5 depending on DST)
    const nyOffset = isDST(now) ? -4 : -5;
    const nyTime = new Date(now.getTime() + nyOffset * 60 * 60 * 1000);
    document.getElementById('ny-time').textContent = formatTime(nyTime);
    document.getElementById('ny-date').textContent = formatDate(nyTime);
    
    // Calculate and display time difference
    const diffHours = 7 - nyOffset;
    document.getElementById('time-difference').textContent = 
        `Indochina is ${diffHours} hours ahead of New York`;
}

function isDST(date) {
    // Simple DST detection for New York (2nd Sunday March to 1st Sunday November)
    const year = date.getUTCFullYear();
    const march = new Date(Date.UTC(year, 2, 8));
    const november = new Date(Date.UTC(year, 10, 1));
    
    // Find 2nd Sunday in March
    const dstStart = new Date(march);
    dstStart.setDate(8 + (7 - march.getUTCDay()) % 7);
    
    // Find 1st Sunday in November
    const dstEnd = new Date(november);
    dstEnd.setDate(1 + (7 - november.getUTCDay()) % 7);
    
    return date >= dstStart && date < dstEnd;
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour12: false });
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function convertTime() {
    const timeInput = document.getElementById('from-time').value;
    const fromZone = document.getElementById('from-zone').value;
    
    if (!timeInput) {
        document.getElementById('conversion-result').textContent = 'Please select a time';
        return;
    }
    
    const [hours, minutes] = timeInput.split(':').map(Number);
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    let result;
    if (fromZone === 'indochina') {
        // Convert Indochina to New York
        const nyOffset = isDST(date) ? -4 : -5;
        const nyTime = new Date(date.getTime() - (7 - nyOffset) * 60 * 60 * 1000);
        result = `${timeInput} Indochina Time = ${formatTime(nyTime)} New York Time`;
    } else {
        // Convert New York to Indochina
        const nyOffset = isDST(date) ? -4 : -5;
        const indochinaTime = new Date(date.getTime() + (7 - nyOffset) * 60 * 60 * 1000);
        result = `${timeInput} New York Time = ${formatTime(indochinaTime)} Indochina Time`;
    }
    
    document.getElementById('conversion-result').textContent = result;
}

// Update clocks every second
setInterval(updateClocks, 1000);
updateClocks(); // Initial call

// Set up converter button
document.getElementById('convert-btn').addEventListener('click', convertTime);
