import { initializeFinance } from './modules/finance.js';
import { initializeTodo } from './modules/todo.js';
import { initializeGoals } from './modules/goals.js';
import { initializeDiary } from './modules/diary.js';
import { setupNavigation } from './modules/navigation.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    initializeFinance();
    initializeTodo();
    initializeGoals();
    initializeDiary();
});