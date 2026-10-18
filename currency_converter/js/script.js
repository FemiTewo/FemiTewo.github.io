const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "GBP" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})

// Rates come from the free open endpoint of ExchangeRate-API (no API key needed).
// They update once a day, so each base currency is fetched once per visit.
const ratesCache = {};

function fetchRates(base){
    if(!ratesCache[base]){
        // keep the request itself so two clicks at once share one network call
        ratesCache[base] = fetch(`https://open.er-api.com/v6/latest/${base}`)
            .then(response => {
                if(!response.ok) throw new Error("Rate service returned " + response.status);
                return response.json();
            })
            .then(data => {
                if(data.result !== "success") throw new Error("Rate service error");
                return data.rates;
            })
            .catch(error => {
                delete ratesCache[base]; // allow a retry after a failure
                throw error;
            });
    }
    return ratesCache[base];
}

async function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = Number(amount.value);
    if(!amountVal || amountVal < 0){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.textContent = "Getting exchange rate...";
    try {
        const rates = await fetchRates(fromCurrency.value);
        const exchangeRate = rates[toCurrency.value];
        if(exchangeRate === undefined) throw new Error("Currency not available");
        const total = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.textContent = `${amountVal} ${fromCurrency.value} = ${total} ${toCurrency.value}`;
    } catch(error) {
        exchangeRateTxt.textContent = "Could not get the exchange rate. Please try again in a moment.";
    }
}

document.querySelector('.time-stamp').textContent = new Date().toLocaleString();