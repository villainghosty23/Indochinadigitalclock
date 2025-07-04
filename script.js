let use12HourFormat = true;

function updateClocks() {
    // Get current UTC time
    const now = new Date();
    
    // Indochina Time (UTC+7)
    const indochinaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    updateClock('indochina', indochinaTime);
    
    // New York Time (UTC-4 or UTC-5 depending on DST)
    const nyOffset = isDST(now) ? -4 : -5;
    const nyTime = new Date(now.getTime() + nyOffset * 60 * 60 * 1000);
    updateClock('ny', nyTime);
    
    // Calculate and display time difference
    const diffHours = 7 - nyOffset;
    document.getElementById('time-difference').textContent = 
        `Indochina is ${diffHours} hours ahead of New York`;
}

function updateClock(prefix, date) {
    const timeStr = use12HourFormat 
        ? formatTime12Hour(date)
        : formatTime24Hour(date);
    
    document.getElementById(`${prefix}-time`).querySelector('.time-value').textContent = timeStr.time;
    
    if (use12HourFormat) {
        document.getElementById(`${prefix}-am-pm`).textContent = timeStr.amPm;
    } else {
        document.getElementById(`${prefix}-am-pm`).textContent = '';
    }
    
    document.getElementById(`${prefix}-date`).textContent = formatDate(date);
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

function formatTime12Hour(date) {
    let hours = date.getHours();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return {
        time: `${hours}:${minutes}:${seconds}`,
        amPm: amPm
    };
}

function formatTime24Hour(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return {
        time: `${hours}:${minutes}:${seconds}`,
        amPm: ''
    };
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function convertTime() {
    const timeInput = document.getElementById('from-time').value;
    const fromZone = document.getElementById('from-zone').value;
    const format = document.getElementById('time-format').value;
    
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
        const convertedTime = format === '12' ? formatTime12Hour(nyTime) : formatTime24Hour(nyTime);
        result = `${formatInputTime(timeInput, format)} Indochina Time = ${convertedTime.time} ${convertedTime.amPm || ''} New York Time`;
    } else {
        // Convert New York to Indochina
        const nyOffset = isDST(date) ? -4 : -5;
        const indochinaTime = new Date(date.getTime() + (7 - nyOffset) * 60 * 60 * 1000);
        const convertedTime = format === '12' ? formatTime12Hour(indochinaTime) : formatTime24Hour(indochinaTime);
        result = `${formatInputTime(timeInput, format)} New York Time = ${convertedTime.time} ${convertedTime.amPm || ''} Indochina Time`;
    }
    
    document.getElementById('conversion-result').textContent = result.trim();
}

function formatInputTime(timeStr, format) {
    if (format === '24') return timeStr;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
}

// Update clocks every second
setInterval(updateClocks, 1000);
updateClocks(); // Initial call

// Set up converter button
document.getElementById('convert-btn').addEventListener('click', convertTime);

// Toggle time format
document.getElementById('time-format').addEventListener('change', function() {
    use12HourFormat = this.value === '12';
    updateClocks();
});
