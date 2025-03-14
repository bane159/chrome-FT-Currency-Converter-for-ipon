document.getElementById("convert").addEventListener("click", () => {
    const amountFT = parseFloat(document.getElementById("amount").value);
    const targetCurrency = document.getElementById("currency").value;

    if (isNaN(amountFT)) {
        document.getElementById("result").textContent = localize("enterValidAmount");
        return;
    }

    const rates = {
        EUR: 0.0025,
        RSD: 0.29
    };

    const converted = amountFT * rates[targetCurrency];

    const resultText = `${amountFT} FT = ${converted.toFixed(2)} ${targetCurrency}`;

    document.getElementById("result").textContent = resultText;

    navigator.clipboard.writeText(resultText).catch(err => {
        console.error("Failed to copy: ", err);
    });
});

const localizationMap = {
    en: {
        "convert": "Convert",
        "showInEuros": "Show in Euros",
        "showInRSD": "Show in RSD",
        "showWithoutTax": "Show Price Without Tax",
        "enterAmount": "Enter amount in FT",
        "enterValidAmount": "Enter a valid amount",
        "euro": "Euro (EUR)",
        "serbianDinar": "Serbian dinar (RSD)",
        "selectCurrency": "Select Currency"
    },
    sr: {
        "convert": "Konvertuj",
        "showInEuros": "Prikaži u evrima",
        "showInRSD": "Prikaži u RSD",
        "showWithoutTax": "Prikaži cenu bez poreza",
        "enterAmount": "Unesite iznos u FT",
        "enterValidAmount": "Unesite validan iznos",
        "euro": "Evro (EUR)",
        "serbianDinar": "Srpski dinar (RSD)",
        "selectCurrency": "Izaberite valutu"
    }
};

let currentLanguage = navigator.language.startsWith('sr') ? 'sr' : 'en';

function localize(key) {
    return localizationMap[currentLanguage][key] || key;
}

function updateLanguageButtons() {
    document.querySelectorAll('.language-button').forEach(button => {
        button.classList.remove('selected');
    });
    document.getElementById(`lang-${currentLanguage}`).classList.add('selected');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-en').addEventListener('click', () => {
        currentLanguage = 'en';
        localizePage();
        updateLanguageButtons();
        localizeResult();
    });

    document.getElementById('lang-sr').addEventListener('click', () => {
        currentLanguage = 'sr';
        localizePage();
        updateLanguageButtons();
        localizeResult();
    });

    updateLanguageButtons();
    localizePage();
});

function localizePage() {
    document.getElementById('convert').textContent = localize('convert');
    document.querySelector('label[for="eurCheckbox"] .label-text').textContent = localize('showInEuros');
    document.querySelector('label[for="rsdCheckbox"] .label-text').textContent = localize('showInRSD');
    document.querySelector('label[for="taxCheckbox"] .label-text').textContent = localize('showWithoutTax');
    document.getElementById('amount').placeholder = localize('enterAmount');
    document.querySelector('option[value="EUR"]').textContent = localize('euro');
    document.querySelector('option[value="RSD"]').textContent = localize('serbianDinar');
    document.getElementById('select-currency-text').textContent = localize('selectCurrency');
}

function localizeResult() {
    const resultDiv = document.getElementById('result');
    const resultText = resultDiv.textContent;
    if (resultText === localizationMap.en.enterValidAmount || resultText === localizationMap.sr.enterValidAmount) {
        resultDiv.textContent = localize('enterValidAmount');
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const storage = getStorageAPI();

    const eurCheckbox = document.getElementById("eurCheckbox");
    const rsdCheckbox = document.getElementById("rsdCheckbox");
    const taxCheckbox = document.getElementById("taxCheckbox");

    storage.get(["showEUR", "showRSD", "showWithTax"], (data) => {
        eurCheckbox.checked = data.showEUR ?? true;
        rsdCheckbox.checked = data.showRSD ?? true;
        taxCheckbox.checked = data.showWithTax ?? true;
    });
    eurCheckbox.addEventListener("change", () => {
        storage.set({ showEUR: eurCheckbox.checked });
        sendUpdateMessage();
    });

    rsdCheckbox.addEventListener("change", () => {
        storage.set({ showRSD: rsdCheckbox.checked });
        sendUpdateMessage();
    });

    taxCheckbox.addEventListener("change", () => {
        storage.set({showWithTax: taxCheckbox.checked });
        sendUpdateMessage();
    });

});

function getStorageAPI() {
    return typeof browser !== "undefined" ? browser.storage.local : chrome.storage.local;
}

function sendUpdateMessage() {
    const eurChecked = document.getElementById("eurCheckbox").checked;
    const rsdChecked = document.getElementById("rsdCheckbox").checked;
    const taxChecked = document.getElementById("taxCheckbox").checked;

    if (typeof browser !== "undefined") {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                type: "updatePrices",
                showEUR: eurChecked,
                showRSD: rsdChecked,
                showWithTax: taxChecked
            });
        });
    } else if (typeof chrome !== "undefined") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "updatePrices",
                showEUR: eurChecked,
                showRSD: rsdChecked,
                showWithTax: taxChecked
            });
        });
    }
}
