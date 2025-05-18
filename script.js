// Bus data with timings
const busData = {
    "Arivilanjapoyil": {
        "Kannur": ["05:30", "07:15", "09:45", "12:30", "15:15", "18:00", "20:45"],
        "Taliparamba": ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"]
    },
    // ... (keep all your existing bus data)
};

// Get current time in minutes since midnight
function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// Convert HH:MM to minutes since midnight
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

document.getElementById('search-btn').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const currentMinutes = getCurrentMinutes();
    
    if (!from) {
        document.getElementById('results').innerHTML = '<p>Please select departure location</p>';
        return;
    }
    
    // Format current time for display
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let resultsHTML = `<div class="current-time">Current time: ${formatDisplayTime(currentTime)}</div>`;
    
    if (to) {
        // Show specific route
        if (busData[from] && busData[from][to]) {
            resultsHTML += `<div class="route-title">${from} to ${to}</div>`;
            resultsHTML += busData[from][to]
                .map(time => {
                    const busMinutes = timeToMinutes(time);
                    const isPast = busMinutes < currentMinutes;
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
                        const busMinutes = timeToMinutes(time);
                        const isPast = busMinutes < currentMinutes;
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

// Format time for display (12-hour with AM/PM)
function formatDisplayTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Initialize on page load
window.onload = function() {
    document.getElementById('search-btn').click(); // Auto-search with current time
};
