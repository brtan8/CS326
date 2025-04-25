let entry = 0;

let db;
const request = indexedDB.open('db', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('inputs')) {
        db.createObjectStore('inputs', { keyPath: 'id' });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Database opened successfully');
    retrieveAllData();
};

document.addEventListener("DOMContentLoaded", () => {
    function nav(id) {
        document.querySelectorAll(".view").forEach(view =>{
            view.style.display ='none';
        });
    
        document.getElementById(id).style.display = "block";
    }

    document.getElementById('expPage').addEventListener("click", ()=> nav("expView"));
    document.getElementById('disPage').addEventListener("click", ()=> nav("disView"));

    nav("expView");
});

function saveData() {
    const currency = document.getElementById('currency').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (currency || amount || category || description) {
        const inputData = {
            id: 1,
            currency: currency,
            amount: amount,
            category: category,
            description: description
        };

        const transaction = db.transaction(['inputs'], 'readwrite');
        const store = transaction.objectStore('inputs');
        
        store.put(inputData);
    }
}

let itemID = 0;

function retrieveAllData() {
    const transaction = db.transaction(['inputs'], 'readonly');
    const store = transaction.objectStore('inputs');

    const request = store.getAll();

    request.onsuccess = function(event) {
        const allData = event.target.result;
        console.log(allData);
        if (allData[0].currency === undefined) {
            document.getElementById('currency').value = '';
        }
        else {
            document.getElementById('currency').value = allData[0].currency;
        }

        if (allData[0].amount === undefined) {
            document.getElementById('amount').value = '';
        }
        else {
            document.getElementById('amount').value = allData[0].amount;
        }

        if (allData[0].category === undefined) {
            document.getElementById('category').value = '';
        }
        else {
            document.getElementById('category').value = allData[0].category;
        }

        if (allData[0].description === undefined) {
            document.getElementById('description').value = '';
        }
        else {
            document.getElementById('description').value = allData[0].description;
        }
    };
}

function add() {
    itemID++;
    let amountInput = document.getElementById('amount').value;
    let currencyInput = document.getElementById('currency').value;
    let categoryInput = document.getElementById('category').value;
    let descriptionInput = document.getElementById('description').value;

    if (amountInput.trim() !== "" && currencyInput.trim() !== "" && categoryInput.trim() !== "" && descriptionInput.trim() !== "") {
        let itemDiv = document.createElement('div');
        itemDiv.id = itemID;
        let amountDiv = document.createElement('div');
        let currencyDiv = document.createElement('div');
        let categoryDiv = document.createElement('div');
        let descriptionDiv = document.createElement('div');
        let delDiv = document.createElement('div');

        if (!amountInput.includes('.')) {
            amountInput = amountInput + '.00';
        }
        
        amountDiv.textContent = amountInput;
        amountDiv.classList.add('row');
        currencyDiv.textContent = currencyInput;
        currencyDiv.classList.add('row');
        categoryDiv.textContent = categoryInput;
        categoryDiv.classList.add('row');
        descriptionDiv.textContent = descriptionInput;
        descriptionDiv.classList.add('row');

        if (parseFloat(amountInput) > 0) {
            amountDiv.style.backgroundColor = 'lightgreen';
            currencyDiv.style.backgroundColor = 'lightgreen';
            categoryDiv.style.backgroundColor = 'lightgreen';
            descriptionDiv.style.backgroundColor = 'lightgreen';
        }
        else {
            amountDiv.style.backgroundColor = '#FF7F7F';
            currencyDiv.style.backgroundColor = '#FF7F7F';
            categoryDiv.style.backgroundColor = '#FF7F7F';
            descriptionDiv.style.backgroundColor = '#FF7F7F';
        }

        delDiv.textContent = 'Delete';
        delDiv.classList.add('delButton');

        itemDiv.classList.add('item');   

        itemDiv.appendChild(currencyDiv);
        itemDiv.appendChild(amountDiv);
        itemDiv.appendChild(categoryDiv);
        itemDiv.appendChild(descriptionDiv);

        fetch('http://localhost:3000/routes/Expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currency: currencyInput, amount: amountInput, category: categoryInput, description: descriptionInput })
        });

        delDiv.addEventListener('click', function() {
            itemDiv.remove();
            console.log(itemID);
            fetch('http://localhost:3000/routes/Expenses?id=' + itemDiv.id.toString(), {
                method: 'DELETE'
            });
        });

        itemDiv.appendChild(delDiv);

        document.getElementById('expenseList').appendChild(itemDiv);

        document.getElementById('amount').value = '';
        document.getElementById('currency').value = '';
        document.getElementById('category').value = '';
        document.getElementById('description').value = '';
    } else {
        alert('All fields MUST be filled out!');
    }
}

function addData() {
    fetch('http://localhost:3000/routes/Expenses')
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  
    })
    .then(data => {
        entry = Object.keys(data).length;
        for (let i = 0; i < Object.keys(data).length; i++) {
            itemID++;
            let item = document.createElement('div');
            item.id = itemID;

            let amountDiv = document.createElement('div');
            let currencyDiv = document.createElement('div');
            let categoryDiv = document.createElement('div');
            let descriptionDiv = document.createElement('div');
            let delDiv = document.createElement('div');

            amountDiv.textContent = data[Object.keys(data)[i]].amount;
            amountDiv.classList.add('row');
            currencyDiv.textContent = data[Object.keys(data)[i]].currency;
            currencyDiv.classList.add('row');
            categoryDiv.textContent = data[Object.keys(data)[i]].category;
            categoryDiv.classList.add('row');
            descriptionDiv.textContent = data[Object.keys(data)[i]].description;
            descriptionDiv.classList.add('row');

            if (parseFloat(data[Object.keys(data)[i]].amount) > 0) {
                amountDiv.style.backgroundColor = 'lightgreen';
                currencyDiv.style.backgroundColor = 'lightgreen';
                categoryDiv.style.backgroundColor = 'lightgreen';
                descriptionDiv.style.backgroundColor = 'lightgreen';
            }
            else {
                amountDiv.style.backgroundColor = '#FF7F7F';
                currencyDiv.style.backgroundColor = '#FF7F7F';
                categoryDiv.style.backgroundColor = '#FF7F7F';
                descriptionDiv.style.backgroundColor = '#FF7F7F';
            }

            delDiv.textContent = 'Delete';
            delDiv.classList.add('delButton');

            item.classList.add('item');   

            item.appendChild(currencyDiv);
            item.appendChild(amountDiv);
            item.appendChild(categoryDiv);
            item.appendChild(descriptionDiv);

            delDiv.addEventListener('click', function() {
                item.remove();
                fetch('http://localhost:3000/routes/Expenses?id=' + item.id.toString(), {
                    method: 'DELETE'
                });
            });

            item.appendChild(delDiv);

            document.getElementById('expenseList').appendChild(item);
        }
    })
    .catch(error => {
        console.error('Fetch operation Error:', error);
    });
}

window.onload = addData;