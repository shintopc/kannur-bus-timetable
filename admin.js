// DOM Elements
const fromSelect = document.getElementById('admin-from');
const toSelect = document.getElementById('admin-to');
const toNewInput = document.getElementById('admin-to-new');
const timeInput = document.getElementById('admin-time');
const addTimeBtn = document.getElementById('add-time');
const timeList = document.getElementById('time-list');
const saveRouteBtn = document.getElementById('save-route');
const deleteRouteBtn = document.getElementById('delete-route');
const routesList = document.getElementById('routes-list');
const currentRouteSpan = document.getElementById('current-route');

// State
let currentTimes = [];
let currentFrom = '';
let currentTo = '';

// Initialize the app
function init() {
    populateLocationSelects();
    renderAllRoutes();
    setupEventListeners();
}

// Populate from and to selects with unique locations
function populateLocationSelects() {
    const allLocations = new Set();
    
    // Get all unique locations
    for (const from in busData) {
        allLocations.add(from);
        for (const to in busData[from]) {
            allLocations.add(to);
        }
    }
    
    // Convert to array and sort
    const sortedLocations = Array.from(allLocations).sort();
    
    // Populate selects
    sortedLocations.forEach(location => {
        const option1 = document.createElement('option');
        option1.value = location;
        option1.textContent = location;
        fromSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = location;
        option2.textContent = location;
        toSelect.appendChild(option2);
    });
    
    // Add change listeners
    fromSelect.addEventListener('change', handleLocationChange);
    toSelect.addEventListener('change', handleLocationChange);
    toNewInput.addEventListener('input', handleNewToInput);
}

// Handle location selection changes
function handleLocationChange() {
    currentFrom = fromSelect.value;
    const toValue = toSelect.value || toNewInput.value.trim();
    
    if (currentFrom && toValue) {
        loadRouteTimes(currentFrom, toValue);
    } else {
        clearTimeList();
        currentRouteSpan.textContent = '[select route]';
    }
}

// Handle new destination input
function handleNewToInput() {
    if (toNewInput.value.trim()) {
        toSelect.value = '';
        handleLocationChange();
    }
}

// Load times for a specific route
function loadRouteTimes(from, to) {
    currentFrom = from;
    currentTo = to;
    currentRouteSpan.textContent = `${from} → ${to}`;
    
    // Check if this route exists
    if (busData[from] && busData[from][to]) {
        currentTimes = [...busData[from][to]].sort();
    } else {
        currentTimes = [];
    }
    
    renderTimeList();
}

// Clear the time list
function clearTimeList() {
    currentTimes = [];
    renderTimeList();
}

// Render the time list
function renderTimeList() {
    timeList.innerHTML = '';
    
    if (currentTimes.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No times added yet';
        li.style.color = '#666';
        li.style.fontStyle = 'italic';
        timeList.appendChild(li);
        return;
    }
    
    currentTimes.forEach(time => {
        const li = document.createElement('li');
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'time-value';
        timeSpan.textContent = time;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-time';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener('click', () => {
            currentTimes = currentTimes.filter(t => t !== time);
            renderTimeList();
        });
        
        li.appendChild(timeSpan);
        li.appendChild(deleteBtn);
        timeList.appendChild(li);
    });
}

// Add a new time to the current list
function addNewTime() {
    const time = timeInput.value.trim();
    
    // Validate time format (HH:MM)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        alert('Please enter a valid time in HH:MM format (24-hour)');
        return;
    }
    
    if (!currentTimes.includes(time)) {
        currentTimes.push(time);
        currentTimes.sort();
        renderTimeList();
        timeInput.value = '';
    } else {
        alert('This time already exists for the selected route');
    }
}

// Save the current route
function saveRoute() {
    if (!currentFrom || (!currentTo && !toNewInput.value.trim())) {
        alert('Please select both "From" and "To" locations');
        return;
    }
    
    const to = currentTo || toNewInput.value.trim();
    
    // Initialize if not exists
    if (!busData[currentFrom]) {
        busData[currentFrom] = {};
    }
    
    // Save times
    busData[currentFrom][to] = [...currentTimes];
    
    // If this was a new destination, update selects
    if (!currentTo && toNewInput.value.trim()) {
        addNewLocation(to);
        toSelect.value = to;
        currentTo = to;
        toNewInput.value = '';
    }
    
    alert('Route saved successfully!');
    renderAllRoutes();
    
    // TODO: In a real app, you would save this to a database or file
    console.log('Updated busData:', busData);
}

// Delete the current route
function deleteRoute() {
    if (!currentFrom || (!currentTo && !toNewInput.value.trim())) {
        alert('Please select a route to delete');
        return;
    }
    
    const to = currentTo || toNewInput.value.trim();
    
    if (confirm(`Are you sure you want to delete the route ${currentFrom} → ${to}?`)) {
        if (busData[currentFrom] && busData[currentFrom][to]) {
            delete busData[currentFrom][to];
            
            // If no more routes from this location, remove it
            if (Object.keys(busData[currentFrom]).length === 0) {
                delete busData[currentFrom];
            }
            
            alert('Route deleted successfully!');
            clearTimeList();
            currentRouteSpan.textContent = '[select route]';
            renderAllRoutes();
            
            // TODO: In a real app, you would save this to a database or file
            console.log('Updated busData:', busData);
        } else {
            alert('Route not found');
        }
    }
}

// Add a new location to the selects
function addNewLocation(location) {
    // Check if already exists
    const exists = Array.from(fromSelect.options).some(opt => opt.value === location);
    if (exists) return;
    
    const option1 = document.createElement('option');
    option1.value = location;
    option1.textContent = location;
    fromSelect.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = location;
    option2.textContent = location;
    toSelect.appendChild(option2);
}

// Render all routes in the right panel
function renderAllRoutes() {
    routesList.innerHTML = '';
    
    if (Object.keys(busData).length === 0) {
        routesList.innerHTML = '<p>No routes added yet</p>';
        return;
    }
    
    for (const from in busData) {
        for (const to in busData[from]) {
            const routeCard = document.createElement('div');
            routeCard.className = 'route-card';
            
            const title = document.createElement('h3');
            title.innerHTML = `${from} → ${to} <span class="route-edit" data-from="${from}" data-to="${to}">Edit</span>`;
            
            const timesContainer = document.createElement('div');
            timesContainer.className = 'route-times';
            
            // Show up to 5 times, with "..." if more
            const timesToShow = busData[from][to].slice(0, 5);
            timesToShow.forEach(time => {
                const timeSpan = document.createElement('span');
                timeSpan.className = 'route-time';
                timeSpan.textContent = time;
                timesContainer.appendChild(timeSpan);
            });
            
            if (busData[from][to].length > 5) {
                const moreSpan = document.createElement('span');
                moreSpan.className = 'route-time';
                moreSpan.textContent = `+${busData[from][to].length - 5} more`;
                timesContainer.appendChild(moreSpan);
            }
            
            routeCard.appendChild(title);
            routeCard.appendChild(timesContainer);
            routesList.appendChild(routeCard);
        }
    }
    
    // Add edit click handlers
    document.querySelectorAll('.route-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const from = this.getAttribute('data-from');
            const to = this.getAttribute('data-to');
            
            fromSelect.value = from;
            toSelect.value = to;
            toNewInput.value = '';
            loadRouteTimes(from, to);
            
            // Scroll to form
            document.querySelector('.route-form').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Set up event listeners
function setupEventListeners() {
    addTimeBtn.addEventListener('click', addNewTime);
    timeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewTime();
    });
    saveRouteBtn.addEventListener('click', saveRoute);
    deleteRouteBtn.addEventListener('click', deleteRoute);
}

// Initialize the app
init();
