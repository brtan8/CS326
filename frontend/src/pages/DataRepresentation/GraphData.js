document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('chartCanvas');
    const chartCanvasContext = chartCanvas.getContext('2d');
    const chartTypeSelect = document.getElementById('chartType');
    const timeButtons = document.querySelectorAll('.time-buttons button');
    const saveImageBtn = document.getElementById('saveImageBtn');
    const savedImageList = document.getElementById('savedImageList');
    const filterTypeSelect = document.getElementById('filterType'); // Get the filter dropdown
    let currentChart;
    let allExpenseData = []; // Initialize allExpenseData

    const expensesPageButton = document.getElementById('expPage');
    const displaysPageButton = document.getElementById('disPage');
    const logoutButton = document.getElementById('logPage');

    if (expensesPageButton) {
        expensesPageButton.addEventListener('click', () => {
            window.location.href = "../../components/InputComponent/ExpensesPage.html";
        });
    }

    if (displaysPageButton) {
        displaysPageButton.addEventListener('click', () => {
            window.location.href = "Graphs.html"; // Staying on the same page
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => { // Add an event listener for the click
         window.location.href = "../../components/LoginComponent/LoginPage.html"; // Assuming LoginComponent is at the root of frontend
         sessionStorage.setItem("userToken", null);
        });
    }

    function fetchAllExpenseData() {
        const userId = sessionStorage.getItem("userToken");
        if (!userId || userId === "null") {
            console.error("No user token found. Please log in.");
            return Promise.reject("No user token");
        }

        const apiUrl = `http://localhost:3000/routes/Expenses?userId=${userId}`;
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched expense data:", data);
                if (data && data.Expense) {
                    allExpenseData = data.Expense;
                    // Activate the first time button by default
                    const defaultButton = document.querySelector('.time-buttons button');
                    if (defaultButton) {
                        defaultButton.classList.add('active');
                        const days = parseInt(defaultButton.dataset.days || 5);
                        renderChartWithFilteredData(days, chartTypeSelect.value, allExpenseData);
                    } else {
                        renderChartWithFilteredData(5, chartTypeSelect.value, allExpenseData);
                    }
                } else {
                    console.error("No expense data returned from API");
                }
            })
            .catch(error => {
                console.error('Error fetching all expense data:', error);
                // Still render an empty chart
                renderChartWithFilteredData(5, chartTypeSelect.value, []);
            });
    }

    function filterExpensesByDays(days, expenses) {
        if (!expenses || expenses.length === 0) {
            return [];
        }

        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - days);

        return expenses.filter(expense => {
            // Check if date exists and is valid
            if (!expense.date) {
                console.log("Expense missing date field:", expense);
                return false; // Skip expenses without dates
            }
            
            const expenseDate = new Date(expense.date);
            if (isNaN(expenseDate.getTime())) {
                console.log("Invalid date format:", expense.date);
                return false; // Skip expenses with invalid dates
            }
            
            return expenseDate >= cutoffDate;
        });
    }

    function processExpenseDataForChart(expenses, chartType) {
        console.log("Processing data for chart:", chartType, "with expenses:", expenses);
        
        if (!expenses || expenses.length === 0) {
            console.log("No expenses to process");
            // Return empty chart data
            return {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 1,
                }]
            };
        }

        if (chartType === 'pie') {
            const categoryTotals = {};
            expenses.forEach(entry => {
                if (!entry.category) {
                    entry.category = 'Uncategorized';
                }
                categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + parseFloat(entry.amount || 0);
            });
            
            return {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: ['rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(0, 128, 0, 0.6)',
                        'rgba(128, 0, 128, 0.6)',
                        'rgba(0,0,255,0.6)',
                        'rgba(128,128,0,0.6)'],
                    borderWidth: 1,
                }]
            };
        } else if (chartType === 'bar' || chartType === 'line') {
            const dailyTotals = {};
            expenses.forEach(entry => {
                if (!entry.date) {
                    return; // Skip entries without dates
                }
                
                const date = new Date(entry.date);
                if (isNaN(date.getTime())) {
                    return; // Skip invalid dates
                }
                
                const dateString = date.toLocaleDateString();
                dailyTotals[dateString] = (dailyTotals[dateString] || 0) + parseFloat(entry.amount || 0);
            });
            
            const sortedDates = Object.keys(dailyTotals).sort((a, b) => new Date(a) - new Date(b));
            
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
        return null;
    }

    function renderChart(chartData, chartType) {
        console.log("Rendering chart with data:", chartData);
        
        if (currentChart) {
            currentChart.destroy();
        }
        
        // Set default options based on chart type
        let options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            }
        };
        
        // Add scales for bar and line charts
        if (chartType === 'bar' || chartType === 'line') {
            options.scales = {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            };
        }
        
        currentChart = new Chart(chartCanvasContext, {
            type: chartType,
            data: chartData,
            options: options
        });
    }

    function renderChartWithFilteredData(days, chartType, expenses) {
        console.log(`Rendering chart with ${days} days of data, chart type: ${chartType}`);
        const filteredExpenses = filterExpensesByDays(days, expenses);
        console.log(`Filtered expenses (${filteredExpenses.length}):`, filteredExpenses);
        const chartData = processExpenseDataForChart(filteredExpenses, chartType);
        renderChart(chartData, chartType);
    }

    function handleTimeButtonClick(days) {
        renderChartWithFilteredData(days, chartTypeSelect.value, allExpenseData);
    }

    function handleChartTypeChange() {
        const days = parseInt(document.querySelector('.time-buttons button.active')?.dataset.days || 5);
        renderChartWithFilteredData(days, chartTypeSelect.value, allExpenseData);
    }

    function handleSaveImage() {
        if (currentChart && currentChart.data.datasets.some(dataset => dataset.data.length > 0)) {
            const chartType = chartTypeSelect.value;
            const activeDaysButton = document.querySelector('.time-buttons button.active');
            const days = activeDaysButton ? activeDaysButton.dataset.days : 'all';
            const fileName = `${chartType}-${days}-days.png`;
            const dataURL = chartCanvas.toDataURL('image/png');
            const userId = sessionStorage.getItem("userToken");

            const graphData = { userId, url: dataURL, type: chartType, fileName };

            fetch('http://localhost:3000/routes/Graphs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(graphData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Graph saved:', data);
                fetchSavedGraphs(filterTypeSelect?.value || null);
            })
            .catch(error => console.error('Error saving graph:', error));
        } else {
            alert('No chart data to save!');
        }
    }

    function fetchSavedGraphs(filterType = null) {
        const userId = sessionStorage.getItem("userToken");
        if (!userId || userId === "null") {
            console.error("No user token found for fetching saved graphs");
            return;
        }
        
        let url = `http://localhost:3000/routes/Graphs?userId=${userId}`;
        if (filterType) {
            url += `&type=${filterType}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched saved graphs:", data);
                if (data && data.graphs) {
                    displaySavedGraphs(data.graphs);
                } else {
                    console.error("No graphs data returned from API");
                    displaySavedGraphs([]);
                }
            })
            .catch(error => {
                console.error('Error fetching saved graphs:', error);
                displaySavedGraphs([]);
            });
    }

    function displaySavedGraphs(graphs) {
        savedImageList.innerHTML = '';
        
        if (!graphs || graphs.length === 0) {
            const noGraphsMsg = document.createElement('p');
            noGraphsMsg.textContent = 'No saved graphs found.';
            savedImageList.appendChild(noGraphsMsg);
            return;
        }
        
        graphs.forEach(graph => {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.src = graph.url;
            img.alt = graph.fileName;
            img.style.maxWidth = '200px';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.addEventListener('click', () => deleteSavedGraph(graph.id));

            listItem.appendChild(img);
            listItem.appendChild(deleteButton);
            savedImageList.appendChild(listItem);
        });
    }

    function deleteSavedGraph(graphId) {
        fetch(`http://localhost:3000/routes/Graphs?id=${graphId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log(`Graph with ID ${graphId} deleted.`);
                fetchSavedGraphs(filterTypeSelect?.value || null);
            } else {
                console.error('Error deleting graph.');
            }
        })
        .catch(error => console.error('Error deleting graph:', error));
    }

    // Set up event listeners
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            handleTimeButtonClick(parseInt(this.dataset.days));
        });
    });

    chartTypeSelect.addEventListener('change', handleChartTypeChange);
    saveImageBtn.addEventListener('click', handleSaveImage);

    if (filterTypeSelect) {
        filterTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            fetchSavedGraphs(selectedType || null);
        });
    }

    // Initialize - activate first time button
    const firstTimeButton = timeButtons[0];
    if (firstTimeButton) {
        firstTimeButton.classList.add('active');
    }

    // Initial data fetch
    fetchAllExpenseData();
    
    // Initial fetch of saved graphs
    fetchSavedGraphs();
});