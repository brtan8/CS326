document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('chartCanvas').getContext('2d');
    const chartTypeSelect = document.getElementById('chartType');
    const timeButtons = document.querySelectorAll('.time-buttons button');
    let currentChart;

    let db;
    const request = indexedDB.open('graphDataDB', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('graphEntries')) {
            db.createObjectStore('graphEntries', { keyPath: 'id' });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('GraphData database opened successfully');
        retrieveAllData();
    };
    
    function retrieveAllData() {
        const transaction = db.transaction(['graphEntries'], 'readonly');
        const store = transaction.objectStore('graphEntries');

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function(event) {
            const allData = event.target.result;
            console.log(allData);

            if (allData[0] === undefined) {
                fetch('GraphData.json')
                    .then(response => response.json())
                    .then(data => {
                        const transaction = db.transaction(['graphEntries'], 'readwrite');
                        const store = transaction.objectStore('graphEntries');
                        Object.entries(data).forEach(([key, value]) => {
                            store.put({ id: key, ...value });
                        });
                        renderChartFromDB(5); 
                    })
                    .catch(error => console.error('Error fetching GraphData.json:', error));
            } else {
                renderChartFromDB(5); 
            }
        };
    }

    function renderChartFromDB(days) {
        const transaction = db.transaction(['graphEntries'], 'readonly');
        const store = transaction.objectStore('graphEntries');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function(event) {
            const data = {};
            event.target.result.forEach(item => {
                data[item.id] = item;
            });
            renderChart(days, chartTypeSelect.value, data); 
        };
    }

    function parseDate(dateString) {
        //const parts = dateString.split('/');
        //return new Date(parts[2], parts[0] - 1, parts[1]);
        //const [month, day, year] = dateString.split('/');
        //return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        const parts = dateString.split('/');
        const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }

    function filterDataByDays(days, data) {
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - days);

        return Object.values(data).filter(entry => {
            const entryDate = parseDate(entry.time);
            return entryDate >= cutoffDate;
        });
    }

    function prepareChartData(filteredData, chartType) {
        if (chartType === 'pie') {
            const categoryTotals = {};
            filteredData.forEach(entry => {
                categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + parseFloat(entry.amount);
            });

            return {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(0, 128, 0, 0.6)',
                        'rgba(128, 0, 128, 0.6)',
                        'rgba(0,0,255,0.6)',
                        'rgba(128,128,0,0.6)'
                    ],
                    borderWidth: 1,
                }]
            };
        } else if (chartType === 'bar' || chartType === 'line') {
            const dailyTotals = {};
            filteredData.forEach(entry => {
                const date = entry.time;
                dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(entry.amount);
            });

            const sortedDates = Object.keys(dailyTotals).sort((a, b) => parseDate(a) - parseDate(b));

            return {
                labels: sortedDates,
                datasets: [{
                    label: 'Daily Expenses',
                    data: sortedDates.map(date => dailyTotals[date]),
                    backgroundColor: chartType === 'bar' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(75, 192, 192, 0.6)',
                    borderColor: chartType === 'line' ? 'rgba(75, 192, 192, 1)' : undefined,
                    borderWidth: 1,
                    fill: false
                }]
            };
        }
    }

    function renderChart(days, chartType, data) {
        const filteredData = filterDataByDays(days, data);
        const chartData = prepareChartData(filteredData, chartType);

        if (currentChart) {
            currentChart.destroy();
        }

        currentChart = new Chart(chartCanvas, {
            type: chartType,
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function handleTimeButtonClick(days) {
        renderChartFromDB(days); 
    }

    function handleChartTypeChange() {
        const days = parseInt(document.querySelector('.time-buttons button.active')?.dataset.days || 5);
        renderChartFromDB(days); 
    }

    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            handleTimeButtonClick(parseInt(this.dataset.days));
        });
    });

    chartTypeSelect.addEventListener('change', handleChartTypeChange);
    timeButtons[0].classList.add('active');
});