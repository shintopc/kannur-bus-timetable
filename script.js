// DOM Elements
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const timeDisplay = document.getElementById('time');
const ampmDisplay = document.getElementById('ampm');

// Initialize the app
function initApp() {
  // Set up event listeners
  searchBtn.addEventListener('click', showResults);
  
  // Populate dropdowns
  populateDropdowns();
  
  // Initialize clock
  updateClock();
  setInterval(updateClock, 1000);
  
  // Perform initial search
  showResults();
}

// Populate dropdown menus
function populateDropdowns() {
  const locations = [
    "Arivilanjapoyil", 
    "Udayagiri", 
    "Karthikapurm", 
    "Cherupuzha", 
    "Alakode", 
    "Taliparamba", 
    "Kannur"
  ];
  
  locations.forEach(location => {
    fromSelect.add(new Option(location, location));
    toSelect.add(new Option(location, location));
  });
}

// Update clock display
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  
  timeDisplay.textContent = `${hours}:${minutes}`;
  ampmDisplay.textContent = ampm;
  
  return `${String(now.getHours()).padStart(2, '0')}:${minutes}`;
}

// Show results based on user selection
function showResults() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const currentTime = updateClock();
  
  if (!from) {
    showWelcomeMessage();
    return;
  }
  
  let html = '';
  
  if (to) {
    // Show specific route
    const timings = getBusTimings(from, to);
    if (timings) {
      html = createRouteHtml(from, to, timings, currentTime);
    } else {
      html = createNoResultsHtml(from, to);
    }
  } else {
    // Show all routes from selected location
    const allRoutes = getAllRoutes(from);
    if (allRoutes.length > 0) {
      allRoutes.forEach(route => {
        html += createRouteHtml(from, route.destination, route.timings, currentTime);
      });
    } else {
      html = createNoLocationHtml(from);
    }
  }
  
  resultsDiv.innerHTML = html || createWelcomeHtml();
}

// Get bus timings for specific route
function getBusTimings(from, to) {
  // This would be replaced with actual data fetching
  // For now using mock data structure
  const mockData = {
    "Arivilanjapoyil": {
      "Kannur": ["05:30", "07:15", "09:45", "12:30", "15:15", "18:00", "20:45"],
      "Taliparamba": ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"]
    },
    // ... other routes would be defined here
  };
  
  return mockData[from]?.[to];
}

// Get all routes from a location
function getAllRoutes(from) {
  // This would be replaced with actual data fetching
  // For now using mock data structure
  const mockData = {
    "Arivilanjapoyil": {
      "Kannur": ["05:30", "07:15", "09:45", "12:30", "15:15", "18:00", "20:45"],
      "Taliparamba": ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"]
    },
    // ... other routes would be defined here
  };
  
  const routes = [];
  if (mockData[from]) {
    for (const destination in mockData[from]) {
      routes.push({
        destination,
        timings: mockData[from][destination]
      });
    }
  }
  return routes;
}

// Create HTML for a route
function createRouteHtml(from, to, timings, currentTime) {
  let timingsHtml = '';
  let foundNextBus = false;
  
  timings.forEach(time => {
    const isPast = compareTimes(time, currentTime) < 0;
    const isNext = !foundNextBus && !isPast;
    
    if (isNext) foundNextBus = true;
    
    timingsHtml += `
      <span class="timing ${isPast ? 'past' : isNext ? 'upcoming next' : 'upcoming'}">
        ${time}
        ${isNext ? '<i class="fas fa-arrow-right"></i>' : ''}
      </span>`;
  });
  
  return `
    <div class="route">
      <div class="route-title">
        <i class="fas fa-route"></i>
        ${from} to ${to}
      </div>
      <div class="timings">${timingsHtml}</div>
    </div>`;
}

// Compare two times in "HH:MM" format
function compareTimes(time1, time2) {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  if (h1 !== h2) return h1 - h2;
  return m1 - m2;
}

// Create HTML for no results found
function createNoResultsHtml(from, to) {
  return `
    <div class="welcome-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>No buses found from ${from} to ${to}</p>
    </div>`;
}

// Create HTML for no location found
function createNoLocationHtml(from) {
  return `
    <div class="welcome-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>No buses found from ${from}</p>
    </div>`;
}

// Create welcome HTML
function createWelcomeHtml() {
  return `
    <div class="welcome-message">
      <i class="fas fa-compass"></i>
      <p>Select locations to see bus timings</p>
    </div>`;
}

// Show welcome message
function showWelcomeMessage() {
  resultsDiv.innerHTML = createWelcomeHtml();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);
