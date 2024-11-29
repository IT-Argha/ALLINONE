export function saveToCSV(filename, data) {
    const csvContent = convertToCSV(data);
    localStorage.setItem(filename, csvContent);
}

export function loadFromCSV(filename) {
    const csvContent = localStorage.getItem(filename);
    if (!csvContent) return [];
    return parseCSV(csvContent);
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => 
        headers.map(header => 
            JSON.stringify(obj[header] || '')
        ).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
}

function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        });
        
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}