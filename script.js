// Bus data with timings in 24-hour format
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

// Update clock display
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    document.getElementById('time').textContent = `${hours}:${minutes}`;
    document.getElementById('ampm').textContent = ampm;
    
    return `${String(now.getHours()).padStart(2, '0')}:${minutes}`;
}

// Compare two times in "HH:MM" format
function compareTimes(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    
    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
}

// Display results
function showResults() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const currentTime = updateClock();
    const resultsDiv = document.getElementById('results');
    
    if (!from) {
        resultsDiv.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-compass"></i>
                <p>Please select departure location</p>
            </div>`;
        return;
    }
    
    let html = '';
    let foundNextBus = false;
    
    if (to) {
        // Show specific route
        if (busData[from] && busData[from][to]) {
            html += `
            <div class="route">
                <div class="route-title">
                    <i class="fas fa-route"></i>
                    ${from} to ${to}
                </div>
                <div class="timings">`;
            
            busData[from][to].forEach(time => {
                const comparison = compareTimes(time, currentTime);
                const isPast = comparison < 0;
                const isNext = !foundNextBus && comparison >= 0;
                
                if (isNext) foundNextBus = true;
                
                html += `
                <div class="time-slot ${isPast ? 'past' : isNext ? 'upcoming next' : 'upcoming'}">
                    ${time}
                    ${isNext ? '<i class="fas fa-arrow-right"></i>' : ''}
                </div>`;
            });
            
            html += `</div></div>`;
        } else {
            html = `
            <div class="welcome-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>No buses found from ${from} to ${to}</p>
            </div>`;
        }
    } else {
        // Show all routes
        if (busData[from]) {
            for (const destination in busData[from]) {
                html += `
                <div class="route">
                    <div class="route-title">
                        <i class="fas fa-route"></i>
                        ${from} to ${destination}
                    </div>
                    <div class="timings">`;
                
                busData[from][destination].forEach(time => {
                    const comparison = compareTimes(time, currentTime);
                    const isPast = comparison < 0;
                    const isNext = !foundNextBus && comparison >= 0;
                    
                    if (isNext) foundNextBus = true;
                    
                    html += `
                    <div class="time-slot ${isPast ? 'past' : isNext ? 'upcoming next' : 'upcoming'}">
                        ${time}
                        ${isNext ? '<i class="fas fa-arrow-right"></i>' : ''}
                    </div>`;
                });
                
                html += `</div></div>`;
            }
        } else {
            html = `
            <div class="welcome-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>No buses found from ${from}</p>
            </div>`;
        }
    }
    
    resultsDiv.innerHTML = html;
}

// Initialize
document.getElementById('search').addEventListener('click', showResults);

// Update clock every second
updateClock();
setInterval(updateClock, 1000);

// Initial search
showResults();


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

