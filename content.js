window.onload = () => {
    main();
    observeNewProducts();
};

if (typeof browser !== "undefined") {
    browser.runtime.onMessage.addListener(async (message) => {
        if (message.type === "updatePrices") {
            const showEUR = message.showEUR;
            const showRSD = message.showRSD;
            const showWithTax = message.showWithTax;
            main(showEUR, showRSD);
        }
    });
} else if (typeof chrome !== "undefined") {
    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.type === "updatePrices") {
            const showEUR = message.showEUR;
            const showRSD = message.showRSD;
            const showWithTax = message.showWithTax;
            main(showEUR, showRSD);
        }
    });
}

function observeNewProducts() {
    const observer = new MutationObserver((mutations) => {
        const newPriceEls = new Set();
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                if (node.classList?.contains('product-price') && !node.hasAttribute('data-converted')) {
                    newPriceEls.add(node);
                }
                node.querySelectorAll?.('.product-price:not([data-converted])').forEach(el => newPriceEls.add(el));
            }
        }
        if (newPriceEls.size > 0) {
            processNewPriceElements([...newPriceEls]);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

async function processNewPriceElements(elements) {
    const rates = await getConversionRates();
    const storage = getStorageAPI();
    storage.get(["showEUR", "showRSD", "showWithTax"], (data) => {
        const showEUR = data.showEUR ?? true;
        const showRSD = data.showRSD ?? true;
        const showWithTax = data.showWithTax ?? true;
        injectPrices(elements, showEUR, showRSD, showWithTax, rates);
    });
}

async function main(showEUR = null, showRSD = null, showWithTax = null) {
    let rates = await getConversionRates();

    if (showEUR === null || showRSD === null || showWithTax === null) {
        const storage = typeof browser !== "undefined" ? browser.storage.local : chrome.storage.local;

        storage.get(["showEUR", "showRSD", "showWithTax"], (data) => {
            const showEUR = data.showEUR ?? true;
            const showRSD = data.showRSD ?? true;
            const showWithTax = data.showWithTax ?? true;

            updatePrices(showEUR, showRSD, showWithTax, rates);
        });
    } else {
        updatePrices(showEUR, showRSD, showWithTax, rates);
    }
}

function updatePrices(showEUR, showRSD, showWithTax, rates) {
    const elements = document.querySelectorAll('.product-price');
    injectPrices([...elements], showEUR, showRSD, showWithTax, rates);
}

function injectPrices(elements, showEUR, showRSD, showWithTax, rates) {
    elements.forEach(el => {
        // Remove any existing conversions
        el.parentNode.querySelectorAll('[data-conversion]').forEach(c => c.remove());

        const ftValue = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
        if (!isNaN(ftValue)) {
            if (showEUR) {
                const eurDiv = createEl("div", `${formatNumber(Math.round(ftValue * rates.eur))} € ${showWithTax ? " | " + formatNumber(getWithNoTax(ftValue * rates.eur)) +  " €" : ""}`);
                eurDiv.setAttribute('data-conversion', 'eur');
                el.parentNode.insertBefore(eurDiv, el.nextSibling);
            }
            if (showRSD) {
                const rsdDiv = createEl("div", `${formatNumber(Math.round(ftValue * rates.rsd))} RSD ${showWithTax ? " | " + formatNumber(getWithNoTax(ftValue * rates.rsd)) + " RSD" : ""}`);
                rsdDiv.setAttribute('data-conversion', 'rsd');
                el.parentNode.appendChild(rsdDiv);
            }
            el.setAttribute('data-converted', 'true');
        }
    });
}

function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
}

function createEl(elType, textContent) {
    const el = document.createElement(elType);
    el.style.marginLeft = "5px";
    el.style.fontWeight = "600";
    el.style.fontSize = !checkUrl("https://iponcomp.com/shop/product") ? "15px" : "20px";
    el.textContent = textContent;
    return el;
}

function checkUrl(url) {
    return window.location.href.startsWith(url);
}

async function getConversionRates() {
    let storage = getStorageAPI();
    let storedData;
    await storage.get("rates", data => {storedData = data});
    if(storedData){
        return storedData;
    }

    try {
        let response = await fetch("https://api.exchangerate-api.com/v4/latest/HUF");
        let data = await response.json();
        storage.set("rates", {rates: data});
        return { eur: data.rates.EUR, rsd: data.rates.RSD };
    } catch (error) {
        return { eur: 0.0025, rsd: 0.29 };
    }
}

function getStorageAPI() {
    return typeof browser !== "undefined" ? browser.storage.local : chrome.storage.local;
}

function getWithNoTax(value){
    return Math.round(value * 0.8);
}










