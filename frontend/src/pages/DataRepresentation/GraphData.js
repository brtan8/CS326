document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('chartCanvas').getContext('2d');
    const chartTypeSelect = document.getElementById('chartType');
    const timeButtons = document.querySelectorAll('.time-buttons button');
    let currentChart;
    const savedChartsList = document.getElementById('savedChartsList');
    const saveChartButton = document.getElementById('saveChartButton');

    function parseDate(dateString) {
        const parts = dateString.split('/');
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }

    function filterDataByDays(days, data) {
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - days);

        return data.filter(entry => {
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
        } else {
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
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function fetchDataAndRenderChart(days, chartType) {
        fetch('/routes/Graph')
            .then(response => response.json())
            .then(data => renderChart(days, chartType, data))
            .catch(error => console.error('Error:', error));
    }

    function saveChart() {
        if (!currentChart) return;

        const chartData = currentChart.config.data;
        const canvas = currentChart.canvas;
        const options = {
            width: canvas.width,
            height: canvas.height
        };

        fetch('/routes/Graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chartData, options })
        })
            .then(response => response.json())
            .then(() => displaySavedCharts())
            .catch(error => console.error('Error saving chart:', error));
    }

    function displaySavedCharts() {
        fetch('/routes/Graph')
            .then(response => response.json())
            .then(data => {
                const savedCharts = data.savedCharts || [];
                savedChartsList.innerHTML = '';
                savedCharts.forEach((url, i) => {
                    const filename = url.split('/').pop();
                    const li = document.createElement('li');
                    li.innerHTML = `Chart ${i + 1} - <a href="${url}" target="_blank">${filename}</a>`;
                    const delBtn = document.createElement('button');
                    delBtn.textContent = 'Delete';
                    delBtn.classList.add('delete-button');
                    delBtn.dataset.filename = filename;
                    li.appendChild(delBtn);
                    savedChartsList.appendChild(li);
                });
            });
    }

    savedChartsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const filename = e.target.dataset.filename;
            fetch(`/routes/Graph/${filename}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(() => displaySavedCharts())
                .catch(err => console.error('Delete failed:', err));
        }
    });

    timeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelector('.time-buttons .active')?.classList.remove('active');
            this.classList.add('active');
            const days = parseInt(this.dataset.days);
            fetchDataAndRenderChart(days, chartTypeSelect.value);
        });
    });

    chartTypeSelect.addEventListener('change', () => {
        const activeBtn = document.querySelector('.time-buttons .active');
        const days = parseInt(activeBtn?.dataset.days || 5);
        fetchDataAndRenderChart(days, chartTypeSelect.value);
    });

    saveChartButton.addEventListener('click', saveChart);

    const defaultDays = 5;
    const initialButton = document.querySelector(`.time-buttons button[data-days="${defaultDays}"]`);
    if (initialButton) {
        initialButton.classList.add('active');
    }
    fetchDataAndRenderChart(defaultDays, chartTypeSelect.value);
    displaySavedCharts();
});
