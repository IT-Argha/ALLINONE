import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';

export function initializeDiary() {
    const diaryEntries = document.getElementById('diaryEntries');
    const saveDiaryBtn = document.getElementById('saveDiary');
    
    let entries = loadFromCSV('diary.csv');
    updateDiaryEntries();

    saveDiaryBtn.addEventListener('click', () => {
        const date = document.getElementById('diaryDate').value;
        const content = document.getElementById('diaryEntry').value.trim();

        if (date && content) {
            const entry = {
                id: Date.now(),
                date,
                content,
                createdAt: new Date().toISOString()
            };

            entries.push(entry);
            saveToCSV('diary.csv', entries);
            updateDiaryEntries();
            
            document.getElementById('diaryDate').value = '';
            document.getElementById('diaryEntry').value = '';
        }
    });

    function updateDiaryEntries() {
        diaryEntries.innerHTML = '';
        entries.slice().reverse().forEach(entry => {
            const item = document.createElement('div');
            item.className = 'diary-item';
            item.innerHTML = `
                <div>
                    <h3>${new Date(entry.date).toLocaleDateString()}</h3>
                    <p>${entry.content}</p>
                </div>
                <button class="delete-btn">Delete</button>
            `;

            item.querySelector('.delete-btn').addEventListener('click', () => {
                entries = entries.filter(e => e.id !== entry.id);
                saveToCSV('diary.csv', entries);
                updateDiaryEntries();
            });

            diaryEntries.appendChild(item);
        });
    }
}