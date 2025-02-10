const DB_NAME = "CostManagerDB";
const DB_VERSION = 1;
const STORE_NAME = "expenses";

// Open the database
const openDB = () => {
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
};

// Add a new expense
export const addExpense = async (expense) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.add(expense);
  return tx.complete;
};


// Get expenses by month and year
export const getExpensesByMonthYear = async (month = null, year = null) => {
    const db = await openDB();
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
  };
  

// Delete an expense (optional)
export const deleteExpense = async (id) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(id);
  return tx.complete;
};

// Update an existing expense
export const updateExpense = async (updatedExpense) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(updatedExpense);
    return tx.complete;
  };
  