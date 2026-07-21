export type Sale = {
  id: number;
  date: string;
  bouquet: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
};

export type Expense = {
  id: number;
  date: string;
  category: string;
  item: string;
  quantity: number;
  cost: number;
};

export type Inventory = {
  id: number;
  item: string;
  stock: number;
};

// ====================== SALES ======================

export function getSales(): Sale[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("sales") || "[]");
}

export function saveSale(sale: Sale) {
  const inventory = getInventory();

  const item = inventory.find(
    (i) =>
      i.item.toLowerCase() ===
      sale.bouquet.toLowerCase().replace(" bouquet", "")
  );

  if (!item) {
    alert("❌ Material not found in inventory.");
    return;
  }

  if (item.stock < sale.quantity) {
    alert(`❌ Not enough stock!\nAvailable: ${item.stock}`);
    return;
  }

  const sales = getSales();
  sales.push(sale);

  const updatedInventory = inventory.map((i) =>
    i.item.toLowerCase() ===
    sale.bouquet.toLowerCase().replace(" bouquet", "")
      ? {
          ...i,
          stock: i.stock - sale.quantity,
        }
      : i
  );

  localStorage.setItem(
    "inventory",
    JSON.stringify(updatedInventory)
  );

  localStorage.setItem(
    "sales",
    JSON.stringify(sales)
  );

  window.dispatchEvent(new Event("inventoryUpdated"));
}

export function updateSale(updatedSale: Sale) {
  const sales = getSales().map((sale) =>
    sale.id === updatedSale.id ? updatedSale : sale
  );

  localStorage.setItem("sales", JSON.stringify(sales));
}

export function deleteSale(id: number) {
  const sales = getSales().filter((sale) => sale.id !== id);
  localStorage.setItem("sales", JSON.stringify(sales));
}

// ====================== EXPENSES ======================

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("expenses") || "[]");
}

export function saveExpense(expense: Expense) {
  const expenses = getExpenses();
  expenses.push(expense);

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );

  if (expense.category === "Inventory") {
    const inventory = getInventory();

    const existing = inventory.find(
      (i) =>
        i.item.toLowerCase() ===
        expense.item.toLowerCase()
    );

    if (existing) {
      existing.stock += expense.quantity;
    } else {
      inventory.push({
        id: Date.now(),
        item: expense.item,
        stock: expense.quantity,
      });
    }

    localStorage.setItem(
      "inventory",
      JSON.stringify(inventory)
    );

    window.dispatchEvent(new Event("inventoryUpdated"));
  }
}

export function deleteExpense(id: number) {
  const expenses = getExpenses().filter(
    (expense) => expense.id !== id
  );

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );
}

// ====================== INVENTORY ======================

export function getInventory(): Inventory[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("inventory") || "[]");
}

export function saveInventory(item: Inventory) {
  const inventory = getInventory();

  const existing = inventory.find(
    (i) =>
      i.item.toLowerCase() ===
      item.item.toLowerCase()
  );

  if (existing) {
    existing.stock += item.stock;
  } else {
    inventory.push(item);
  }

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  window.dispatchEvent(new Event("inventoryUpdated"));
}

export function deleteInventory(id: number) {
  const inventory = getInventory().filter(
    (i) => i.id !== id
  );

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  window.dispatchEvent(new Event("inventoryUpdated"));
}

export function updateInventory(updated: Inventory) {
  const inventory = getInventory().map((i) =>
    i.id === updated.id ? updated : i
  );

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  window.dispatchEvent(new Event("inventoryUpdated"));
}