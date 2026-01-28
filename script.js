// Register service worker for offline support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.log("Service Worker registration failed:", err));
}

// DOM elements
const transactionType = document.getElementById("transactionType");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

// Fees JSON storage
let feesData = {};

// Fetch fees.json
fetch("fees.json") // Make sure fees.json is in the same folder as index.html
  .then((response) => response.json())
  .then((data) => {
    feesData = data;
    console.log("Fees data loaded:", feesData); // For debugging
  })
  .catch((err) => console.error("Error loading fees:", err));

// Function to get fee from JSON
function getFeeFromJSON(type, amount) {
  const table = feesData[type];
  if (!table) return 0;

  for (let i = 0; i < table.length; i++) {
    if (amount <= table[i].max) return table[i].fee;
  }
  return table[table.length - 1].fee;
}

// Function to determine color
function getFeeColor(fee) {
  if (fee <= 50)
    return "#28a745"; // green
  else if (fee <= 100)
    return "#ffc107"; // yellow
  else return "#dc3545"; // red
}

// Main calculation function
function calculateFees() {
  const type = transactionType.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML =
      "<p style='color:red;text-align:center;'>Enter a valid amount!</p>";
    return;
  }

  const fee = getFeeFromJSON(type, amount);
  const total = amount + fee;

  // Channel fees
  const agentFee = fee + (type === "send" ? 5 : 10);
  const ussdFee = fee;
  const appFee = fee > 0 ? fee - 2 : 0;

  // Generate color-coded HTML
  resultDiv.innerHTML = `
    <div class="result-card main-fee" style="background:${getFeeColor(fee)}">
      <h2>Fee: Ksh ${fee}</h2>
      <p>Total Deducted: Ksh ${total}</p>
    </div>

    <div class="result-card channels">
      <h3>Channel Comparison</h3>
      <div class="channel" style="background:${getFeeColor(agentFee)};">💰 Agent <span>Ksh ${agentFee}</span></div>
      <div class="channel" style="background:${getFeeColor(ussdFee)};">📱 USSD <span>Ksh ${ussdFee}</span></div>
      <div class="channel" style="background:${getFeeColor(appFee)};">🖥️ App <span>Ksh ${appFee}</span></div>
    </div>
  `;

  // Animate cards
  const cards = document.querySelectorAll(".result-card");
  cards.forEach((card) => setTimeout(() => card.classList.add("slide-in"), 50));
}

// Event listeners
amountInput.addEventListener("input", calculateFees);
transactionType.addEventListener("change", calculateFees);
