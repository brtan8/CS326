const SETTINGS_KEYS = {
    CURRENCY: 'currency', // 'USD', 'EUR', etc. (string currency codes)
    CUSTOM_CURRENCIES: 'customCurrencies', // array of custom currencies: { code, name } objects
    THEME: 'theme', // dark | light
  };
  
  const DB_STORE = {
    SETTINGS: 'settings',
  };
  
  const DB_STORE_FIELDS = {
    SETTINGS: {
      KEY: 'key',
      VALUE: 'value',
    },
  };
  
  const DB_NAME = 'financeOptions';
  const DB_VERSION = 1;
  let db;
  
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  
  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(DB_STORE.SETTINGS)) {
      db.createObjectStore(DB_STORE.SETTINGS, { keyPath: DB_STORE_FIELDS.SETTINGS.KEY });
    }
  };
  
  request.onsuccess = (e) => {
    db = e.target.result;
    loadTheUI();
  };
  
  request.onerror = (e) => {
    console.error('There was an error with indexedDB', e);
  };
  
  /*
   * update a setting with a new value
   */
  const saveSetting = (key, value) => {
    return db
      .transaction(DB_STORE.SETTINGS, 'readwrite')
      .objectStore(DB_STORE.SETTINGS)
      .put({ key, value });
  };
  
  
  /*
   get a setting object by key (theme, currency, etc.)
   */
  
  const getSetting = (key) =>
    new Promise((resolve) => {
      const request = db.transaction(DB_STORE.SETTINGS, 'readonly')
      .objectStore(DB_STORE.SETTINGS)
      .get(key);
  
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => resolve(undefined);
    });
  
  /*
    Get a list of the users custom currencies from the database
   returns array of objects with { code, name } properties
   */
  async function getCustomCurrencies() {
    const currencies = await getSetting(SETTINGS_KEYS.CUSTOM_CURRENCIES);
    if (!currencies) return []
    else
    return currencies;
  }
  
  /*
    save a new list of custom currencies
   */
  const saveCustomCurrencies = (currencyList) =>
    saveSetting(SETTINGS_KEYS.CUSTOM_CURRENCIES, currencyList);

  //Load the entire UI
  async function loadTheUI() {
  
    const currencySelect = document.getElementById('currency-select');
    const darkModeToggle = document.getElementById('dark-toggle');
    const status = document.getElementById('status');
    const currencyCodeInput = document.getElementById('custom-currency-code');
    const currencyNameInput = document.getElementById('custom-currency-name');
    const addCurrButton = document.getElementById('add-currency-button');
    
    function addNewCurrencyOption(code, name) {
      const newCurOption = new Option(`${code} – ${name}`, code);
      currencySelect.appendChild(newCurOption);
    }
  
  //fetch and add some pre built currencies from the json file as options
    try {
      const fetchedCurrencies = await fetch('currencies.json');
      const builtInCurrencies = await fetchedCurrencies.json();
  
      builtInCurrencies.forEach(({ code, name }) => {
        addNewCurrencyOption(code, name);
      });
  
    } catch (error) {
      console.error('The currencies json file had an error', error);
    }
  
    //Add the users custom currencies from indexedDB to the options
    let customList = await getCustomCurrencies();
    customList.forEach(({ code, name }) => {
      addNewCurrencyOption(code, name);
    });
  
    const savedCurrency = await getSetting(SETTINGS_KEYS.CURRENCY);
    if (savedCurrency) {
      currencySelect.value = savedCurrency;
    }
  
    const savedTheme = await getSetting(SETTINGS_KEYS.THEME);
    if (savedTheme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
      darkModeToggle.checked = true;
    }
  
  //change the default currency when the user wants
    currencySelect.addEventListener('change', () => {
      saveSetting(SETTINGS_KEYS.CURRENCY, currencySelect.value);
      sendTempStatusMessage('Default currency saved');
    });
    
    // Toggle dark mode on/off
    darkModeToggle.addEventListener('change', () => {
      const theme = darkModeToggle.checked ? 'dark' : 'light';
      if (theme === 'dark') {
        document.documentElement.dataset.theme = 'dark';
      } else {
        delete document.documentElement.dataset.theme;
      }
      saveSetting(SETTINGS_KEYS.THEME, theme);
      sendTempStatusMessage('New Theme is saved');
    });
  
    addCurrButton.addEventListener('click', async () => {
      //user gives their custom currency with its code and name
      const code = currencyCodeInput.value; 
      const name = currencyNameInput.value;
      if (!code || !name) {
        sendTempStatusMessage('You need to add both a currency code and name');
        return;
      }
  
      addNewCurrencyOption(code, name);
      currencySelect.value = code;
      //when user adds a new currency it is default automatically
      saveSetting(SETTINGS_KEYS.CURRENCY, code);
  
      const updated = [...customList, { code, name }];
      await saveCustomCurrencies(updated);
      customList = updated;     
  
      
      currencyCodeInput.value = '';
      currencyNameInput.value = '';
  
      sendTempStatusMessage('Your new custom currency is now saved!');
    });
  
  // let the user know that they changed a setting/something is wrong
    function sendTempStatusMessage(message) {
      status.textContent = message;
      setTimeout(() => (status.textContent = ''), 2000);
    }
  
  }
  