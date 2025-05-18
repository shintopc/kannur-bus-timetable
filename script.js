// Sample bus data
const busData = [
    {
        number: "KL-59-A-1234",
        from: "Arivilanjapoyil",
        to: "Kannur",
        timings: ["05:30 AM", "07:15 AM", "09:45 AM", "12:30 PM", "03:15 PM", "06:00 PM", "08:45 PM"],
        type: "ordinary"
    },
    {
        number: "KL-59-B-5678",
        from: "Arivilanjapoyil",
        to: "Taliparamba",
        timings: ["06:00 AM", "08:30 AM", "11:00 AM", "02:00 PM", "04:30 PM", "07:00 PM"],
        type: "express"
    },
    {
        number: "KL-59-C-9012",
        from: "Udayagiri",
        to: "Kannur",
        timings: ["05:45 AM", "08:00 AM", "10:30 AM", "01:15 PM", "04:00 PM", "06:45 PM", "09:30 PM"],
        type: "superfast"
    },
    {
        number: "KL-59-D-3456",
        from: "Udayagiri",
        to: "Alakode",
        timings: ["06:30 AM", "09:15 AM", "12:00 PM", "03:00 PM", "05:45 PM", "08:30 PM"],
        type: "ordinary"
    },
    {
        number: "KL-59-E-7890",
        from: "Karthikapurm",
        to: "Kannur",
        timings: ["06:15 AM", "08:45 AM", "11:30 AM", "02:15 PM", "05:00 PM", "07:45 PM"],
        type: "express"
    },
    {
        number: "KL-59-F-2345",
        from: "Karthikapurm",
        to: "Cherupuzha",
        timings: ["07:00 AM", "10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
        type: "ordinary"
    },
    {
        number: "KL-59-G-6789",
        from: "Cherupuzha",
        to: "Kannur",
        timings: ["05:15 AM", "07:45 AM", "10:15 AM", "01:00 PM", "03:45 PM", "06:30 PM", "09:15 PM"],
        type: "superfast"
    },
    {
        number: "KL-59-H-0123",
        from: "Cherupuzha",
        to: "Taliparamba",
        timings: ["06:45 AM", "09:30 AM", "12:15 PM", "03:15 PM", "06:00 PM", "08:45 PM"],
        type: "express"
    },
    {
        number: "KL-59-J-4567",
        from: "Alakode",
        to: "Kannur",
        timings: ["05:00 AM", "07:30 AM", "10:00 AM", "12:45 PM", "03:30 PM", "06:15 PM", "09:00 PM"],
        type: "ordinary"
    },
    {
        number: "KL-59-K-8901",
        from: "Alakode",
        to: "Udayagiri",
        timings: ["06:15 AM", "09:00 AM", "11:45 AM", "02:45 PM", "05:30 PM", "08:15 PM"],
        type: "express"
    },
    {
        number: "KL-59-L-2345",
        from: "Taliparamba",
        to: "Kannur",
        timings: ["05:45 AM", "08:15 AM", "10:45 AM", "01:30 PM", "04:15 PM", "07:00 PM", "09:45 PM"],
        type: "superfast"
    },
    {
        number: "KL-59-M-6789",
        from: "Taliparamba",
        to: "Arivilanjapoyil",
        timings: ["06:30 AM", "09:15 AM", "12:00 PM", "03:00 PM", "05:45 PM", "08:30 PM"],
        type: "ordinary"
    },
    {
        number: "KL-59-N-0123",
        from: "Kannur",
        to: "Arivilanjapoyil",
        timings: ["06:00 AM", "08:30 AM", "11:00 AM", "01:45 PM", "04:30 PM", "07:15 PM", "10:00 PM"],
        type: "express"
    },
    {
        number: "KL-59-P-4567",
        from: "Kannur",
        to: "Udayagiri",
        timings: ["05:30 AM", "08:00 AM", "10:30 AM", "01:15 PM", "04:00 PM", "06:45 PM", "09:30 PM"],
        type: "ordinary"
    }
];

// DOM elements
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');
const resultsTitle = document.getElementById('results-title');

// Event listeners
searchBtn.addEventListener('click', searchBuses);

// Search buses function
function searchBuses() {
    const fromLocation = fromSelect.value;
    const toLocation = toSelect.value;
    
    if (!fromLocation) {
        showNoResults("Please select a departure location");
        return;
    }
    
    let filteredBuses = busData.filter(bus => bus.from === fromLocation);
    
    if (toLocation) {
        filteredBuses = filteredBuses.filter(bus => bus.to === toLocation);
    }
    
    if (filteredBuses.length === 0) {
        showNoResults("No buses found for the selected route");
        return;
    }
    
    displayResults(filteredBuses, fromLocation, toLocation);
}

// Display results function
function displayResults(buses, from, to) {
    resultsTitle.textContent = `Buses from ${from}${to ? ` to ${to}` : ''}`;
    
    resultsContainer.innerHTML = '';
    
    buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        
        const typeClass = bus.type === 'ordinary' ? 'ordinary' : 
                         bus.type === 'express' ? 'express' : 'superfast';
        
        busCard.innerHTML = `
            <div class="bus-route">
                <div class="bus-number">${bus.number}</div>
                <div>From <span>${bus.from}</span> to <span>${bus.to}</span></div>
                <div class="bus-timings">
                    ${bus.timings.map(time => `<div class="timing">${time}</div>`).join('')}
                </div>
            </div>
            <div class="bus-type ${typeClass}">${bus.type}</div>
        `;
        
        resultsContainer.appendChild(busCard);
    });
}

// Show no results function
function showNoResults(message) {
    resultsTitle.textContent = "Search Results";
    resultsContainer.innerHTML = `
        <div class="no-results">
            <i class="fas fa-bus-slash"></i>
            <p>${message}</p>
        </div>
    `;
}
