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
    "Karthikapurm": {
        "Kannur": ["06:15", "08:45", "11:30", "14:15", "17:00", "19:45"],
        "Cherupuzha": ["07:00", "10:00", "13:00", "16:00", "19:00"]
    },
    "Cherupuzha": {
        "Kannur": ["05:15", "07:45", "10:15", "13:00", "15:45", "18:30", "21:15"],
        "Taliparamba": ["06:45", "09:30", "12:15", "15:15", "18:00", "20:45"]
    },
    "Alakode": {
        "Kannur": ["05:00", "07:30", "10:00", "12:45", "15:30", "18:15", "21:00"],
        "Udayagiri": ["06:15", "09:00", "11:45", "14:45", "17:30", "20:15"]
    },
    "Taliparamba": {
        "Kannur": ["05:45", "08:15", "10:45", "13:30", "16:15", "19:00", "21:45"],
        "Arivilanjapoyil": ["06:30", "09:15", "12:00", "15:00", "17:45", "20:30"]
    },
    "Kannur": {
        "Arivilanjapoyil": ["06:00", "08:30", "11:00", "13:45", "16:30", "19:15", "22:00"],
        "Udayagiri": ["05:30", "08:00", "10:30", "13:15", "16:00", "18:45", "21:30"]
    }
};

document.getElementById('search-btn').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    let searchTime = document.getElementById('search-time').value;
    
    // If no time selected, use current time
    if (!searchTime) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        searchTime = `${hours}:${minutes}`;
    } else {
        // Convert HH:MM to 24-hour format
        searchTime = searchTime.substring(0, 5);
    }
    
    if (!from) {
        document.getElementById('results').innerHTML = '<p>Please select departure location</p>';
        return;
    }
    
    let resultsHTML = `<div class="current-time">Showing buses relative to: ${formatTimeForDisplay(searchTime)}</div>`;
    
    if (to) {
        // Show specific route
        if (busData[from] && busData[from][to]) {
            resultsHTML += `<div class="route-title">${from} to ${to}</div>`;
            resultsHTML += busData[from][to]
                .map(time => createTimingElement(time, searchTime))
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
                    .map(time => createTimingElement(time, searchTime))
                    .join('');
            }
        } else {
            resultsHTML += `<p>No buses found from ${from}</p>`;
        }
    }
    
    document.getElementById('results').innerHTML = resultsHTML || '<p>No timings available</p>';
});

function createTimingElement(time, searchTime) {
    const isPast = compareTimes(time, searchTime) < 0;
    const className = isPast ? 'past' : 'upcoming';
    return `<span class="timing ${className}">${time}</span>`;
}

// Compare two times in "HH:MM" format
function compareTimes(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    
    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
}

// Format time for display (convert 24-hour to 12-hour with AM/PM)
function formatTimeForDisplay(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Set default time to current time
window.onload = function() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('search-time').value = `${hours}:${minutes}`;
};
