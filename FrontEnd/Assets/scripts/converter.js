const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");

// Exchange rates (static example, can later integrate API)
const rates = {
  USD: 1,
  KES: 147, // example: 1 USD = 147 KES
  EUR: 0.91,
  GBP: 0.79,
};

function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML =
      "<p style='color:red;text-align:center;'>Enter a valid amount!</p>";
    return;
  }

  // Conversion formula
  const converted = (amount / rates[from]) * rates[to];
  resultDiv.innerHTML = `
    <div class="result-card main-fee">
      <h2>${amount} ${from} = ${converted.toFixed(2)} ${to}</h2>
    </div>
  `;
}

convertBtn.addEventListener("click", convertCurrency);
