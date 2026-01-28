// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service_worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.error("SW registration failed:", err));
}

// DOM elements
const transactionType = document.getElementById("transactionType");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

let feesData = null;

// Load fees.json
fetch("./fees.json") // ./ ensures relative to current HTML file
  .then((response) => response.json())
  .then((data) => {
    feesData = data;
  })
  .catch((err) => console.error("Error loading fees:", err));

// Fee lookup
function getFee(type, amount) {
  if (!feesData || !feesData[type]) return null;
  return feesData[type].find((row) => amount <= row.max)?.fee ?? 0;
}

// Color helper
function getColor(value) {
  if (value <= 50) return "#2ecc71";
  if (value <= 100) return "#f1c40f";
  return "#e74c3c";
}

// Main logic
function calculateFees() {
  const amount = parseFloat(amountInput.value);
  const type = transactionType.value;

  if (!feesData) {
    resultDiv.innerHTML = "<p style='text-align:center;'>Loading fees…</p>";
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML =
      "<p style='color:red;text-align:center;'>Enter a valid amount</p>";
    return;
  }

  const baseFee = getFee(type, amount);
  if (baseFee === null) return;

  // Channel fees (SAFE)
  const agentFee = baseFee + 10;
  const ussdFee = baseFee;
  const appFee = Math.max(baseFee - 2, 0);

  resultDiv.innerHTML = `
    <div class="result-card main-fee">
      <h2>Base Fee: Ksh ${baseFee}</h2>
      <p>Total Deducted: Ksh ${amount + baseFee}</p>
    </div>

    <div class="result-card channels">
      <h3>Channel Breakdown</h3>

      <div class="channel" style="background:${getColor(agentFee)}">
        💰 Agent
        <span>Ksh ${agentFee} (Total: ${amount + agentFee})</span>
      </div>

      <div class="channel" style="background:${getColor(ussdFee)}">
        📱 USSD
        <span>Ksh ${ussdFee} (Total: ${amount + ussdFee})</span>
      </div>

      <div class="channel" style="background:${getColor(appFee)}">
        🖥️ App
        <span>Ksh ${appFee} (Total: ${amount + appFee})</span>
      </div>
    </div>
  `;
}

// Events
amountInput.addEventListener("input", calculateFees);
transactionType.addEventListener("change", calculateFees);
