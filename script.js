// Bus data with timings (24-hour format)
const busData = {
    "Arivilanjapoyil": {
        "Kannur": ["05:30", "07:15", "09:45", "12:30", "15:15", "18:00", "20:45"],
        "Taliparamba": ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"]
    },
    "Udayagiri": {
        "Kannur": ["05:45", "08:00", "10:30", "13:15", "16:00", "18:45", "21:30"],
        "Alakode": ["06:30", "09:15", "12:00", "15:00", "17:45", "20:30"]
    },
    // ... (other routes)
};

// Convert time string "HH:MM" to Date object today
function timeToDate(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

document.getElementById('search-btn').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const now = new Date(); // Current time
    
    if (!from) {
        document.getElementById('results').innerHTML = '<p>Please select departure location</p>';
        return;
    }
    
    // Format current time for display
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let resultsHTML = `<div class="current-time">Current time: ${formatDisplayTime(currentTimeStr)}</div>`;
    
    if (to) {
        // Show specific route
        if (busData[from] && busData[from][to]) {
            resultsHTML += `<div class="route-title">${from} to ${to}</div>`;
            resultsHTML += busData[from][to]
                .map(time => {
                    const busTime = timeToDate(time);
                    const isPast = busTime < now;
                    return `<span class="timing ${isPast ? 'past' : 'upcoming'}">${time}</span>`;
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
                        const busTime = timeToDate(time);
                        const isPast = busTime < now;
                        return `<span class="timing ${isPast ? 'past' : 'upcoming'}">${time}</span>`;
                    })
                    .join('');
            }
        } else {
            resultsHTML += `<p>No buses found from ${from}</p>`;
        }
    }
    
    document.getElementById('results').innerHTML = resultsHTML || '<p>No timings available</p>';
});

// Format 24-hour time to 12-hour display
function formatDisplayTime(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Auto-search on page load
window.onload = function() {
    document.getElementById('search-btn').click();
};
