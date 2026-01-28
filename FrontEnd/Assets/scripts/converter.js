const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML =
      "<p style='color:red;text-align:center;'>Enter a valid amount</p>";
    return;
  }

  resultDiv.innerHTML = "<p style='text-align:center;'>Converting…</p>";

  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`,
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    resultDiv.innerHTML = `
      <div class="result-card main-fee">
        <h2>${amount} ${from} = ${data.result.toFixed(2)} ${to}</h2>
        <p>Rate: ${data.info.rate.toFixed(4)}</p>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML =
      "<p style='color:red;text-align:center;'>Conversion failed. Try again.</p>";
  }
}

convertBtn.addEventListener("click", convertCurrency);
