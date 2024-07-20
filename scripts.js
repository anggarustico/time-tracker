document.addEventListener('DOMContentLoaded', () => {
    let mainTimerDisplay = document.getElementById('main-timer-display');
    let freeTimeDisplay = document.getElementById('free-time-display');
    let productiveTimeDisplay = document.getElementById('productive-time-display');
    let timeComparisonDisplay = document.getElementById('time-comparison-display');
    let activeTdlTitle = document.getElementById('active-tdl-title');
    let todoList = document.getElementById('todo-list');
    let newTodoInput = document.getElementById('new-todo-input');
    let addTodoBtn = document.getElementById('add-todo-btn');
    let activeTodo = null;
    let mainTimer;
    let mainTimerSeconds = 0;
    let freeTimeSeconds = 0;
    let productiveTimeSeconds = 0;

    // Initialize Chart.js
    const ctx = document.getElementById('time-chart').getContext('2d');
    const timeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Free Time', 'Productive Time'],
            datasets: [{
                data: [freeTimeSeconds, productiveTimeSeconds],
                backgroundColor: ['#FF6384', '#36A2EB'],
                borderColor: ['#FF6384', '#36A2EB'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${formatTime(tooltipItem.raw)}`;
                        }
                    }
                }
            }
        }
    });

    function startMainTimer() {
        mainTimer = setInterval(() => {
            if (activeTodo) {
                mainTimerSeconds++;
                activeTodo.timerSeconds++;
                mainTimerDisplay.textContent = formatTime(mainTimerSeconds);
                activeTodo.querySelector('.todo-timer').textContent = formatTime(activeTodo.timerSeconds);
                productiveTimeSeconds++;
                productiveTimeDisplay.textContent = formatTime(productiveTimeSeconds);
            } else {
                mainTimerSeconds++;
                freeTimeSeconds++;
                mainTimerDisplay.textContent = formatTime(mainTimerSeconds);
                freeTimeDisplay.textContent = formatTime(freeTimeSeconds);
            }
            updateTimeComparison();
            updateChart();
        }, 1000);
    }

    function stopMainTimer() {
        clearInterval(mainTimer);
    }

    function formatTime(seconds) {
        let hrs = Math.floor(seconds / 3600);
        let mins = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function addTodo() {
        let todoText = newTodoInput.value.trim();
        if (todoText === '') return;
        
        let todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        
        let todoContent = document.createElement('span');
        todoContent.textContent = todoText;
        
        let todoTimer = document.createElement('div');
        todoTimer.className = 'todo-timer';
        todoTimer.textContent = '00:00:00';
        todoItem.timerSeconds = 0;
        
        let playButton = document.createElement('button');
        playButton.textContent = 'Play';
        
        playButton.addEventListener('click', () => {
            if (playButton.textContent === 'Play') {
                if (activeTodo) {
                    activeTodo.querySelector('button').textContent = 'Play';
                }
                activeTodo = todoItem;
                activeTdlTitle.textContent = todoText;
                mainTimerSeconds = 0;
                playButton.textContent = 'Stop';
                stopMainTimer();
                startMainTimer();
            } else {
                playButton.textContent = 'Play';
                activeTdlTitle.textContent = 'Free Time';
                activeTodo = null;
                mainTimerSeconds = 0;
                stopMainTimer();
                startMainTimer();
                updateChart();
            }
        });
        
        todoItem.appendChild(todoContent);
        todoItem.appendChild(playButton);
        todoItem.appendChild(todoTimer);
        todoList.appendChild(todoItem);
        newTodoInput.value = '';
    }

    addTodoBtn.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    startMainTimer();
    updateChart();
    
    function updateTimeComparison() {
        let totalTime = freeTimeSeconds + productiveTimeSeconds;
        let freeTimePercent = totalTime ? (freeTimeSeconds / totalTime * 100).toFixed(2) : 0;
        let productiveTimePercent = totalTime ? (productiveTimeSeconds / totalTime * 100).toFixed(2) : 0;
        timeComparisonDisplay.textContent = `${freeTimePercent}% / ${productiveTimePercent}%`;
    }
    
    function updateChart() {
        timeChart.data.datasets[0].data = [freeTimeSeconds, productiveTimeSeconds];
        timeChart.update();
    }
});
