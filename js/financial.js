/**
 * Yom-B-YOM Dashboard - Smart Budget & Shared Vault JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  const incomeInput = document.getElementById("monthly-income");
  const billsTotalEl = document.getElementById("total-bills-val");
  const remainingEl = document.getElementById("remaining-money-val");
  const adviceEl = document.getElementById("savings-advice-text");

  const billsList = document.getElementById("bills-list");
  const wishlistContainer = document.getElementById("wishlist-container");
  const sharedList = document.getElementById("shared-items-list");
  const budgetNotes = document.getElementById("budget-notes");

  // Storage Keys
  const BUDGET_DATA_KEY = "yombyom_budget_data_v2";

  // Initial State / Storage
  let state = {
    income: 1000,
    bills: [
      { id: 1, name: "House Rent & Utilities", icon: "🏠", amount: 250 },
      { id: 2, name: "WiFi & Phone Plan", icon: "📶", amount: 50 }
    ],
    wishlist: [
      { id: 1, name: "Cozy Autumn Jacket", amount: 60, bought: false },
      { id: 2, name: "Specialty Coffee Beans", amount: 25, bought: false }
    ],
    shared: [
      { id: 1, name: "Cinema & Coffee Outing", amount: 30, split: true, friend: "Sarah" },
      { id: 2, name: "Maya's Surprise Gift", amount: 45, split: false, friend: "Laila" }
    ],
    notes: ""
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(BUDGET_DATA_KEY);
      if (saved) {
        state = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading budget state:", e);
    }
  }

  function saveState() {
    localStorage.setItem(BUDGET_DATA_KEY, JSON.stringify(state));
  }

  loadState();

  // Initialize UI Values
  if (incomeInput) {
    incomeInput.value = state.income;
    incomeInput.addEventListener("input", () => {
      state.income = parseFloat(incomeInput.value) || 0;
      saveState();
      calculateBudget();
    });
  }

  if (budgetNotes) {
    budgetNotes.value = state.notes || "";
    budgetNotes.addEventListener("input", () => {
      state.notes = budgetNotes.value;
      saveState();
    });
  }

  // 1. Render Fixed Bills
  function renderBills() {
    billsList.innerHTML = "";
    state.bills.forEach((bill) => {
      const item = document.createElement("div");
      item.classList.add("list-item");
      item.dataset.amount = bill.amount;
      item.innerHTML = `
        <div class="item-info">
          <span>${bill.icon || "📄"}</span>
          <span class="item-title">${bill.name}</span>
        </div>
        <div class="item-price-wrapper">
          <span class="item-price">$${bill.amount.toFixed(2)}</span>
          <button class="delete-item-btn" title="Delete bill" data-id="${bill.id}">&times;</button>
        </div>
      `;

      item.querySelector(".delete-item-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        state.bills = state.bills.filter((b) => b.id !== bill.id);
        saveState();
        renderBills();
        calculateBudget();
      });

      billsList.appendChild(item);
    });
  }

  // 2. Render Wishlist Items
  function renderWishlist() {
    wishlistContainer.innerHTML = "";
    state.wishlist.forEach((item) => {
      const el = document.createElement("div");
      el.classList.add("list-item", "wishlist-item");
      if (item.bought) el.classList.add("bought");
      el.dataset.amount = item.amount;

      el.innerHTML = `
        <div class="item-info">
          <div class="custom-check">${item.bought ? "✓" : ""}</div>
          <span class="item-title">${item.name}</span>
        </div>
        <div class="item-price-wrapper">
          <span class="item-price">$${item.amount.toFixed(2)}</span>
          <button class="delete-item-btn" title="Delete item" data-id="${item.id}">&times;</button>
        </div>
      `;

      // Toggle Bought
      el.addEventListener("click", () => {
        item.bought = !item.bought;
        saveState();
        renderWishlist();
        calculateBudget();
      });

      // Delete item
      el.querySelector(".delete-item-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        state.wishlist = state.wishlist.filter((w) => w.id !== item.id);
        saveState();
        renderWishlist();
        calculateBudget();
      });

      wishlistContainer.appendChild(el);
    });
  }

  // 3. Render Shared Activities
  function renderShared() {
    if (!sharedList) return;
    sharedList.innerHTML = "";
    state.shared.forEach((sh) => {
      const el = document.createElement("div");
      el.classList.add("list-item");
      el.style.padding = "8px 12px";
      el.style.fontSize = "12.5px";

      el.innerHTML = `
        <div class="item-info">
          <span>🎟️</span>
          <span>${sh.name}</span>
        </div>
        <div class="item-price-wrapper">
          <span style="font-weight: 700; color: var(--accent-color);">$${sh.amount.toFixed(2)}${sh.split ? " (Split)" : ""}</span>
          <button class="delete-item-btn" title="Delete shared activity" data-id="${sh.id}">&times;</button>
        </div>
      `;

      el.querySelector(".delete-item-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        state.shared = state.shared.filter((s) => s.id !== sh.id);
        saveState();
        renderShared();
      });

      sharedList.appendChild(el);
    });
  }

  // 4. Calculate Budget Live
  function calculateBudget() {
    const income = state.income;

    let totalBills = 0;
    state.bills.forEach((b) => {
      totalBills += Number(b.amount) || 0;
    });

    let totalWishlistSpent = 0;
    state.wishlist.forEach((w) => {
      if (w.bought) {
        totalWishlistSpent += Number(w.amount) || 0;
      }
    });

    const remaining = income - totalBills - totalWishlistSpent;

    if (billsTotalEl) billsTotalEl.textContent = `$${totalBills.toFixed(2)}`;
    if (remainingEl) remainingEl.textContent = `$${remaining.toFixed(2)}`;

    if (adviceEl) {
      if (remaining < 0) {
        if (remainingEl) remainingEl.style.color = "#c76b58";
        adviceEl.textContent = `⚠️ Warning: You've exceeded your budget by $${Math.abs(remaining).toFixed(2)}. Try unchecking some non-essential wishlist items or adjusting bills.`;
      } else {
        if (remainingEl) remainingEl.style.color = "var(--accent-color)";
        const dailyBudget = (remaining / 30).toFixed(2);
        adviceEl.textContent = `After fixed bills & bought items, you have $${remaining.toFixed(2)} left. Safe spending budget is ~$${dailyBudget}/day for the month.`;
      }
    }
  }

  // 5. Add Bill Button Listener
  const addBillBtn = document.getElementById("add-bill-btn");
  if (addBillBtn) {
    addBillBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("bill-name");
      const amountInput = document.getElementById("bill-amount");

      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value);

      if (!name || isNaN(amount) || amount <= 0) return;

      state.bills.push({
        id: Date.now(),
        name,
        icon: "📄",
        amount
      });

      nameInput.value = "";
      amountInput.value = "";

      saveState();
      renderBills();
      calculateBudget();
    });
  }

  // 6. Add Wishlist Item Button Listener
  const addWishBtn = document.getElementById("add-wish-btn");
  if (addWishBtn) {
    addWishBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("wish-name");
      const amountInput = document.getElementById("wish-amount");

      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value);

      if (!name || isNaN(amount) || amount <= 0) return;

      state.wishlist.push({
        id: Date.now(),
        name,
        amount,
        bought: false
      });

      nameInput.value = "";
      amountInput.value = "";

      saveState();
      renderWishlist();
      calculateBudget();
    });
  }

  // 7. Add Shared Outing Button Listener
  const addSharedBtn = document.getElementById("add-shared-btn");
  if (addSharedBtn) {
    addSharedBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("shared-item-name");
      const name = nameInput.value.trim();

      if (!name) return;

      state.shared.push({
        id: Date.now(),
        name,
        amount: 20.00,
        split: true,
        friend: "Sarah"
      });

      nameInput.value = "";
      saveState();
      renderShared();
    });
  }

  // Initial Render
  renderBills();
  renderWishlist();
  renderShared();
  calculateBudget();
});
