# FT Currency Converter for ipon | iponcomp

[Chrome Web Store](https://chromewebstore.google.com/detail/ft-currency-converter-for/onmfnonfcdfemifednnolgdmhakjaglf?utm_source=ext_app_menu)

A Chrome extension that automatically converts Hungarian Forint (FT) prices to EUR or RSD on iponcomp.com. **Currently used by real users and published on the 
[Chrome Web Store](https://chromewebstore.google.com/detail/ft-currency-converter-for/onmfnonfcdfemifednnolgdmhakjaglf?utm_source=ext_app_menu)!**

##  Features

- **Automatic Price Conversion**: Instantly displays EUR and/or RSD equivalents alongside HUF prices on iponcomp.com
- **Manual Converter**: Built-in popup calculator for quick currency conversions
- **Flexible Display Options**: Toggle between showing EUR, RSD, or both currencies
- **Tax Calculation**: Option to display prices with or without tax
- **Real-time Updates**: Automatically updates converted prices when browsing the site



##  Installation


Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/ft-currency-converter-for/onmfnonfcdfemifednnolgdmhakjaglf?utm_source=ext_app_menu) and click "Add to Chrome".

### Manual Installation (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

##  How to Use

### Automatic Conversion on iponcomp.com

1. Simply visit any product page on iponcomp.com
2. The extension automatically converts all FT prices to your selected currencies
3. Converted prices appear directly on the page next to the original prices

### Manual Conversion

1. Click the extension icon in your Chrome toolbar
2. Enter the amount in Hungarian Forint (FT)
3. Select your target currency (EUR or RSD)
4. Click "Convert" to see the result and copy it to clipboard

### Customization Options

Open the extension popup to configure:
- **Show in Euros**: Toggle EUR price display
- **Show in RSD**: Toggle RSD price display
- **Show Price Without Tax**: Display prices excluding tax

##  Supported Websites

- iponcomp.com/shop/product/* (Product pages)
- iponcomp.com/search/* (Search results)
- iponcomp.com/* (All iponcomp pages)

##  Exchange Rates

The exchange rates were served by an api https://api.exchangerate-api.com/v4/latest/HUF.


##  Technical Details

### Technologies Used

- **Manifest Version**: 3 (Chrome Extension Manifest V3)
- **JavaScript**: Vanilla JS (no frameworks)
- **Storage API**: Chrome Storage Local API
- **Content Scripts**: Automatic price injection and conversion


### Permissions

- `storage`: Store user preferences (currency display settings)
- `activeTab`: Access to the current tab for price conversion


##  Developer

Developed for the community of users shopping on iponcomp.com and needing quick currency conversions.

##  License

This project is available for personal and educational use.



**Note**: This extension is independently developed and is not officially affiliated with iponcomp.com.
