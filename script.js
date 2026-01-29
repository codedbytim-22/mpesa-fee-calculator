// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.log("SW registration failed:", err));
}

// DOM elements
const transactionType = document.getElementById("transactionType");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

// Fees storage
let feesData = {};

// Load fees.json
fetch("fees.json")
  .then((response) => response.json())
  .then((data) => {
    feesData = data;
  })
  .catch((err) => console.error("Failed to load fees:", err));

// Get fee
function getFee(type, amount) {
  const table = feesData[type];
  if (!table) return 0;

  for (let row of table) {
    if (amount <= row.max) return row.fee;
  }
  return table[table.length - 1].fee;
}

// Color helper
function getColor(fee) {
  if (fee <= 50) return "#2ecc71";
  if (fee <= 100) return "#f1c40f";
  return "#e74c3c";
}

// Main calculation
function calculateFees() {
  const amount = parseFloat(amountInput.value);
  const type = transactionType.value;

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML =
      "<p style='color:red;text-align:center;'>Enter a valid amount</p>";
    return;
  }

  const fee = getFee(type, amount);
  const total = amount + fee;

  const agentFee = fee + 10;
  const ussdFee = fee;
  const appFee = Math.max(fee - 2, 0);

  resultDiv.innerHTML = `
    <div class="result-card main-fee">
      <h2>Fee: Ksh ${fee}</h2>
      <p>Total Deducted: Ksh ${total}</p>
    </div>

    <div class="result-card channels">
      <h3>Channel Breakdown</h3>

      <div class="channel" style="background:${getColor(agentFee)}">
        💰 Agent <span>Ksh ${agentFee}</span>
      </div>

      <div class="channel" style="background:${getColor(ussdFee)}">
        📱 USSD <span>Ksh ${ussdFee}</span>
      </div>

      <div class="channel" style="background:${getColor(appFee)}">
        🖥️ App <span>Ksh ${appFee}</span>
      </div>
    </div>
  `;
}

// Events
amountInput.addEventListener("input", calculateFees);
transactionType.addEventListener("change", calculateFees);
