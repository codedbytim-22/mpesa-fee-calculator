/* ================= MPESA FEES ================= */

const transactionType = document.getElementById("transactionType");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

let feesData = {};

fetch("fees.json")
  .then((res) => res.json())
  .then((data) => (feesData = data));

function getFee(type, amount) {
  const table = feesData[type];
  if (!table) return 0;
  return table.find((row) => amount <= row.max)?.fee ?? 0;
}

function calculateFees() {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) return;

  const fee = getFee(transactionType.value, amount);

  resultDiv.innerHTML = `
    <div class="result-card">
      <h3>Fee: KES ${fee}</h3>
      <p>Total: KES ${amount + fee}</p>
    </div>
  `;
}

amountInput.addEventListener("input", calculateFees);
transactionType.addEventListener("change", calculateFees);

/* ================= CURRENCY CONVERTER ================= */

const fxAmount = document.getElementById("fxAmount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const fxResult = document.getElementById("fxResult");

const API = "https://api.exchangerate.host/symbols";

fetch(API)
  .then((res) => res.json())
  .then((data) => {
    const symbols = data.symbols;
    for (let code in symbols) {
      fromCurrency.innerHTML += `<option value="${code}">${code}</option>`;
      toCurrency.innerHTML += `<option value="${code}">${code}</option>`;
    }
    fromCurrency.value = "USD";
    toCurrency.value = "KES";
  });

convertBtn.addEventListener("click", async () => {
  const amount = fxAmount.value;
  if (!amount) return;

  fxResult.innerHTML = "Converting...";

  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${fromCurrency.value}&to=${toCurrency.value}&amount=${amount}`,
    );
    const data = await res.json();

    fxResult.innerHTML = `
      <div class="result-card">
        <h3>${amount} ${fromCurrency.value}</h3>
        <p>= ${data.result.toFixed(2)} ${toCurrency.value}</p>
      </div>
    `;
  } catch {
    fxResult.innerHTML = "Conversion failed.";
  }
});
