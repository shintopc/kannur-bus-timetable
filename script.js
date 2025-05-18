// Bus data with timings in 24-hour format
const busData = {
    "Arivilanjapoyil": {
        "Kannur": ["05:30", "07:15", "09:45", "12:30", "15:15", "18:00", "20:45"],
        "Taliparamba": ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"]
    },
    // ... (other routes - keep your existing data)
};

// Get current time in 24-hour "HH:MM" format
function getCurrentTime24() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Compare two times in "HH:MM" format (returns true if time1 is earlier than time2)
function isEarlier(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h1 < h2 || (h1 === h2 && m1 < m2);
}

document.getElementById('search-btn').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const currentTime = getCurrentTime24();
    
    if (!from) {
        document.getElementById('results').innerHTML = '<p>Please select departure location</p>';
        return;
    }
    
    let resultsHTML = `<div class="current-time">Current time: ${formatDisplayTime(currentTime)}</div>`;
    
    if (to) {
        // Show specific route
        if (busData[from] && busData[from][to]) {
            resultsHTML += `<div class="route-title">${from} to ${to}</div><div class="timings-container">`;
            busData[from][to].forEach(time => {
                const past = isEarlier(time, currentTime);
                resultsHTML += `<span class="timing ${past ? 'past' : 'upcoming'}">${time}</span>`;
            });
            resultsHTML += `</div>`;
        } else {
            resultsHTML += `<p>No buses found from ${from} to ${to}</p>`;
        }
    } else {
        // Show all routes
        if (busData[from]) {
            for (const destination in busData[from]) {
                resultsHTML += `<div class="route-title">${from} to ${destination}</div><div class="timings-container">`;
                busData[from][destination].forEach(time => {
                    const past = isEarlier(time, currentTime);
                    resultsHTML += `<span class="timing ${past ? 'past' : 'upcoming'}">${time}</span>`;
                });
                resultsHTML += `</div>`;
            }
        } else {
            resultsHTML += `<p>No buses found from ${from}</p>`;
        }
    }
    
    document.getElementById('results').innerHTML = resultsHTML;
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
