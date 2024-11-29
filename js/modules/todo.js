// main.js
import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';
import { formatDate } from '../utils/formatters.js';

/**
 * Initializes the ToDo application.
 */
export function initializeTodo() {
    const todoForm = document.querySelector('.todo-form');
    const todoList = document.getElementById('todoList');

    // Load existing todos from CSV
    let todos = loadFromCSV('todos.csv') || [];

    // Define the form HTML
    const formHTML = `
        <div class="todo-input-group">
            <input type="text" id="todoInput" placeholder="✍️ Add new task" class="todo-text-input" required>
            <select id="todoCategory" class="todo-category">
                <option value="general">📝 General</option>
                <option value="study">📚 Study</option>
                <option value="personal">👤 Personal</option>
                <option value="shopping">🛒 Shopping</option>
            </select>
            <select id="todoPriority" class="todo-priority">
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
            </select>
            <input type="date" id="todoDueDate" class="todo-due-date">
            <button type="button" id="addTodo" class="add-todo-btn">Add Task</button>
        </div>
    `;

    // Insert the form HTML into the todoForm
    todoForm.innerHTML = formHTML;

    // Reassign elements after updating the form
    const todoInput = document.getElementById('todoInput');
    const categorySelect = document.getElementById('todoCategory');
    const prioritySelect = document.getElementById('todoPriority');
    const dueDateInput = document.getElementById('todoDueDate');
    const addTodoBtn = document.getElementById('addTodo');

    // Attach the event listener to the "Add Task" button
    addTodoBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText) {
            const todo = {
                id: Date.now(),
                text: todoText,
                completed: false,
                category: categorySelect.value,
                priority: prioritySelect.value,
                dueDate: dueDateInput.value || null,
                date: new Date().toISOString()
            };

            todos.push(todo);
            saveToCSV('todos.csv', todos);
            updateTodoList();
            // Reset input fields
            todoInput.value = '';
            dueDateInput.value = '';
            categorySelect.value = 'general';
            prioritySelect.value = 'low';
        } else {
            alert('Please enter a task!');
        }
    });

    // Initial rendering of the todo list
    updateTodoList();

    /**
     * Updates the ToDo list display.
     */
    function updateTodoList() {
        todoList.innerHTML = '';

        if (todos.length === 0) {
            todoList.innerHTML = '<p>No tasks added yet.</p>';
            return;
        }

        // Group todos by category
        const groupedTodos = todos.reduce((acc, todo) => {
            if (!acc[todo.category]) {
                acc[todo.category] = [];
            }
            acc[todo.category].push(todo);
            return acc;
        }, {});

        // Sort categories alphabetically
        Object.keys(groupedTodos).sort().forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'todo-category-section';

            const categoryHeader = document.createElement('h3');
            categoryHeader.className = 'todo-category-header';
            categoryHeader.innerHTML = `${getCategoryEmoji(category)} ${formatCategoryName(category)}`;
            categorySection.appendChild(categoryHeader);

            // Sort todos by priority and due date
            const sortedTodos = groupedTodos[category].sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
            });

            sortedTodos.forEach(todo => {
                const item = document.createElement('div');
                item.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;

                const dueDate = todo.dueDate ? `<span class="due-date">Due: ${formatDate(todo.dueDate)}</span>` : '';
                const priorityIndicator = getPriorityIndicator(todo.priority);

                item.innerHTML = `
                    <div class="todo-content">
                        <label class="todo-checkbox">
                            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                            <span class="checkmark"></span>
                        </label>
                        <div class="todo-details">
                            <span class="todo-text">${todo.text}</span>
                            ${dueDate}
                            <span class="priority-badge">${priorityIndicator}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </div>
                `;

                // Handle checkbox toggle
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    todo.completed = checkbox.checked;
                    saveToCSV('todos.csv', todos);
                    updateTodoList();
                });

                // Handle delete button
                const deleteBtn = item.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this task?')) {
                        todos = todos.filter(t => t.id !== todo.id);
                        saveToCSV('todos.csv', todos);
                        updateTodoList();
                    }
                });

                // Handle edit button
                const editBtn = item.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    const newText = prompt('Edit task:', todo.text);
                    if (newText !== null && newText.trim() !== '') {
                        todo.text = newText.trim();
                        saveToCSV('todos.csv', todos);
                        updateTodoList();
                    }
                });

                categorySection.appendChild(item);
            });

            todoList.appendChild(categorySection);
        });
    }

    /**
     * Returns the emoji corresponding to a category.
     * @param {string} category 
     * @returns {string} Emoji representing the category
     */
    function getCategoryEmoji(category) {
        const emojis = {
            general: '📝',
            study: '📚',
            personal: '👤',
            shopping: '🛒'
        };
        return emojis[category] || '📝';
    }

    /**
     * Formats the category name by capitalizing the first letter.
     * @param {string} category 
     * @returns {string} Formatted category name
     */
    function formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Returns the emoji corresponding to a priority level.
     * @param {string} priority 
     * @returns {string} Emoji representing the priority
     */
    function getPriorityIndicator(priority) {
        const indicators = {
            low: '🟢',
            medium: '🟡',
            high: '🔴'
        };
        return indicators[priority] || '🟢';
    }
}

// Initialize the ToDo app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTodo);
