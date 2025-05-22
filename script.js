// Remove the busData constant from script.js
// Just use window.busData directly in your code

document.getElementById('search-btn').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const currentTime = updateClock();
    
    if (!from) {
        document.getElementById('results').innerHTML = '<p>Please select departure location</p>';
        return;
    }
    
    let html = '';
    
    // Use window.busData instead of busData
    if (to) {
        if (window.busData[from] && window.busData[from][to]) {
            // ... rest of your existing code
        }
    } else {
        if (window.busData[from]) {
            for (const destination in window.busData[from]) {
                // ... rest of your existing code
            }
        }
    }
    
    document.getElementById('results').innerHTML = html;
});
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


// Add this to your existing script.js
document.getElementById('swap').addEventListener('click', function() {
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const tempValue = fromSelect.value;
    
    fromSelect.value = toSelect.value;
    toSelect.value = tempValue;
    
    // Trigger search if both fields have values
    if (fromSelect.value && toSelect.value) {
        showResults();
    }
});

// Add this at the bottom of your script.js
if ('serviceWorker' in navigator) {
  let refreshing;
  
  // Detect when new service worker is waiting
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  // Check for updates periodically
  setInterval(() => {
    navigator.serviceWorker.ready.then(registration => {
      registration.update().then(() => {
        console.log('Checked for updates');
      });
    });
  }, 60 * 60 * 1000); // Check every hour
}

// Add this function to prompt user about updates
function showUpdateUI(registration) {
  const updateDialog = document.createElement('div');
  updateDialog.className = 'update-dialog';
  updateDialog.innerHTML = `
    <div class="update-content">
      <h3>Update Available</h3>
      <p>A new version of the app is available. Refresh to update?</p>
      <button id="refresh-btn">Refresh Now</button>
    </div>
  `;
  document.body.appendChild(updateDialog);
  
  document.getElementById('refresh-btn').addEventListener('click', () => {
    registration.waiting.postMessage({action: 'skipWaiting'});
  });
}




