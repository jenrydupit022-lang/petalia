
export function updateSale(updatedSale: Sale) {
  const sales = getSales().map((sale) =>
    sale.id === updatedSale.id ? updatedSale : sale
  );

  localStorage.setItem("sales", JSON.stringify(sales));
}
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
  cost: number;
};

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

  const updatedInventory = inventory.map((i) => {
    if (
      i.item.toLowerCase() ===
      sale.bouquet.toLowerCase().replace(" bouquet", "")
    ) {
      return {
        ...i,
        stock: i.stock - sale.quantity,
      };
    }

    return i;
  });

  localStorage.setItem(
    "inventory",
    JSON.stringify(updatedInventory)
  );

  window.dispatchEvent(
    new Event("inventoryUpdated")
  );

  localStorage.setItem(
    "sales",
    JSON.stringify(sales)
  );
}




export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("expenses") || "[]");
}

export function saveExpense(expense: Expense) {
  const expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
export function deleteSale(id: number) {
  const sales = getSales().filter((sale) => sale.id !== id);
  localStorage.setItem("sales", JSON.stringify(sales));
}

export function deleteExpense(id: number) {
  const expenses = getExpenses().filter((expense) => expense.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
export type Inventory = {
  id: number;
  item: string;
  stock: number;
};

export function getInventory(): Inventory[] {
  return JSON.parse(localStorage.getItem("inventory") || "[]");
}

export function saveInventory(item: Inventory) {
  const inventory = getInventory();

  const existing = inventory.find(
    (i) =>
      i.item.toLowerCase() === item.item.toLowerCase()
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
}

export function deleteInventory(id: number) {
  const inventory = getInventory().filter((i) => i.id !== id);
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

export function updateInventory(updated: Inventory) {
  const inventory = getInventory().map((i) =>
    i.id === updated.id ? updated : i
  );

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  window.dispatchEvent(
    new Event("inventoryUpdated")
  );
}



