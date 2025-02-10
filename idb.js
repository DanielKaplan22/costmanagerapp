const DB_NAME = "CostManagerDB";
const DB_VERSION = 1;
const STORE_NAME = "expenses";

// Open the database
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                store.createIndex("date", "date", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Add a new expense
function addExpense(expense) {
    return openDB().then(db => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.add(expense);
        return tx.complete;
    });
}

// Get expenses by month and year
function getExpensesByMonthYear(month = null, year = null) {
    return openDB().then(db => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const index = store.index("date");

        return new Promise((resolve) => {
            const expenses = [];
            index.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const expenseDate = new Date(cursor.value.date);
                    const matchesMonth = month ? expenseDate.getMonth() + 1 === month : true;
                    const matchesYear = year ? expenseDate.getFullYear() === year : true;

                    if (matchesMonth && matchesYear) {
                        expenses.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(expenses);
                }
            };
        });
    });
}

// Delete an expense
function deleteExpense(id) {
    return openDB().then(db => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        return tx.complete;
    });
}

// Update an expense
function updateExpense(updatedExpense) {
    return openDB().then(db => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(updatedExpense);
        return tx.complete;
    });
}

// Attach functions to `window` so `idb-test.html` can access them
window.addExpense = addExpense;
window.getExpensesByMonthYear = getExpensesByMonthYear;
window.deleteExpense = deleteExpense;
window.updateExpense = updateExpense;
