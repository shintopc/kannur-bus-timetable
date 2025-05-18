// Simplified bus data (only timings)
const busData = {
    "Arivilanjapoyil": {
        "Kannur": ["05:30", "07:15", "09:45", "12:30", "15:15", "18:00", "20:45"],
        "Taliparamba": ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"]
    },
    "Udayagiri": {
        "Kannur": ["05:45", "08:00", "10:30", "13:15", "16:00", "18:45", "21:30"],
        "Alakode": ["06:30", "09:15", "12:00", "15:00", "17:45", "20:30"]
    },
    // ... (keep all your existing bus data)
};

// Get current time in HH:MM format (24-hour)
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Compare two times in "HH:MM" format (24-hour)
function isTimePast(busTime, currentTime) {
    const [busH, busM] = busTime.split(':').map(Number);
    const [currH, currM] = currentTime.split(':').map(Number);
    
    if (busH < currH) return true;
    if (busH === currH && busM < currM) return true;
    return false;
}

document.getElementById('search-btn').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const currentTime = getCurrentTime();
    
    if (!from) {
        document.getElementById('results').innerHTML = '<p>Please select departure location</p>';
        return;
    }
    
    let resultsHTML = `<div class="current-time">Current time: ${formatDisplayTime(currentTime)}</div>`;
    
    if (to) {
        // Show specific route
        if (busData[from] && busData[from][to]) {
            resultsHTML += `<div class="route-title">${from} to ${to}</div>`;
            resultsHTML += busData[from][to]
                .map(time => {
                    const past = isTimePast(time, currentTime);
                    return `<span class="timing ${past ? 'past' : 'upcoming'}">${time}</span>`;
                })
                .join('');
        } else {
            resultsHTML += `<p>No buses found from ${from} to ${to}</p>`;
        }
    } else {
        // Show all routes from selected location
        if (busData[from]) {
            for (const destination in busData[from]) {
                resultsHTML += `<div class="route-title">${from} to ${destination}</div>`;
                resultsHTML += busData[from][destination]
                    .map(time => {
                        const past = isTimePast(time, currentTime);
                        return `<span class="timing ${past ? 'past' : 'upcoming'}">${time}</span>`;
                    })
                    .join('');
            }
        } else {
            resultsHTML += `<p>No buses found from ${from}</p>`;
        }
    }
    
    document.getElementById('results').innerHTML = resultsHTML || '<p>No timings available</p>';
});

// Format time for display (convert 24-hour to 12-hour with AM/PM)
function formatDisplayTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Initialize with current time
window.onload = function() {
    const currentTime = getCurrentTime();
    document.getElementById('search-time').value = currentTime;
};
