document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('chartCanvas');
    const chartCanvasContext = chartCanvas.getContext('2d');
    const chartTypeSelect = document.getElementById('chartType');
    const timeButtons = document.querySelectorAll('.time-buttons button');
    const saveImageBtn = document.getElementById('saveImageBtn');
    const savedImageList = document.getElementById('savedImageList');
    const filterTypeSelect = document.getElementById('filterType'); // Get the filter dropdown
    let currentChart;

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
        const apiUrl = `http://localhost:3000/routes/Expenses?userId=${userId}`;
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                allExpenseData = data.Expense;
                renderChartWithFilteredData(5, chartTypeSelect.value, allExpenseData);
            })
            .catch(error => console.error('Error fetching all expense data:', error));
    }

    function filterExpensesByDays(days, expenses) {
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - days);

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date); // Assuming your date is in a format that Date() can parse
            return expenseDate >= cutoffDate;
        });
    }

    function processExpenseDataForChart(expenses, chartType, days) {
        if (chartType === 'pie') {
            const categoryTotals = {};
            expenses.forEach(entry => {
                categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + parseFloat(entry.amount);
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
                const date = new Date(entry.date).toLocaleDateString();
                dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(entry.amount);
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
        if (currentChart) {
            currentChart.destroy();
        }
        currentChart = new Chart(chartCanvasContext, {
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

    function renderChartWithFilteredData(days, chartType, expenses) {
        const filteredExpenses = filterExpensesByDays(days, expenses);
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
                fetchSavedGraphs(filterTypeSelect.value || null);
            })
            .catch(error => console.error('Error saving graph:', error));
        } else {
            alert('No chart data to save!');
        }
    }

    function fetchSavedGraphs(filterType = null) {
        const userId = sessionStorage.getItem("userToken");
        let url = `http://localhost:3000/routes/Graphs?userId=${userId}`;
        if (filterType) {
            url += `&type=${filterType}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displaySavedGraphs(data.graphs);
            })
            .catch(error => console.error('Error fetching saved graphs:', error));
    }

    function displaySavedGraphs(graphs) {
        savedImageList.innerHTML = '';
        graphs.forEach(graph => {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.src = graph.url;
            img.alt = graph.fileName;
            img.style.maxWidth = '200px';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
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
                fetchSavedGraphs(filterTypeSelect.value || null);
            } else {
                console.error('Error deleting graph.');
            }
        })
        .catch(error => console.error('Error deleting graph:', error));
    }

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

    // Initial data fetch
    fetchAllExpenseData();
    // Initial fetch of saved graphs
    fetchSavedGraphs();
});