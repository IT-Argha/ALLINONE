import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';

export function initializeGoals() {
    const goalsList = document.getElementById('goalsList');
    const addGoalBtn = document.getElementById('addGoal');
    
    let goals = loadFromCSV('goals.csv');
    updateGoalsList();

    addGoalBtn.addEventListener('click', () => {
        const title = document.getElementById('goalTitle').value.trim();
        const description = document.getElementById('goalDescription').value.trim();
        const deadline = document.getElementById('goalDeadline').value;

        if (title && description && deadline) {
            const goal = {
                id: Date.now(),
                title,
                description,
                deadline,
                completed: false,
                createdAt: new Date().toISOString()
            };

            goals.push(goal);
            saveToCSV('goals.csv', goals);
            updateGoalsList();
            
            document.getElementById('goalTitle').value = '';
            document.getElementById('goalDescription').value = '';
            document.getElementById('goalDeadline').value = '';
        }
    });

    function updateGoalsList() {
        goalsList.innerHTML = '';
        goals.forEach(goal => {
            const item = document.createElement('div');
            item.className = 'goal-item';
            item.innerHTML = `
                <div>
                    <h3>${goal.title}</h3>
                    <p>${goal.description}</p>
                    <p>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                    <button class="${goal.completed ? 'success' : ''}" onclick="toggleGoal(${goal.id})">
                        ${goal.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            item.querySelector('.delete-btn').addEventListener('click', () => {
                goals = goals.filter(g => g.id !== goal.id);
                saveToCSV('goals.csv', goals);
                updateGoalsList();
            });

            goalsList.appendChild(item);
        });
    }
}