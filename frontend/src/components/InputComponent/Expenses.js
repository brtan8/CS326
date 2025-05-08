let entry = 0;

document.addEventListener("DOMContentLoaded", () => {
    function nav(id) {
        document.querySelectorAll(".view").forEach(view =>{
            view.style.display ='none';
        });
        console.log("we out here");
        console.log((sessionStorage.getItem("userToken")));
        document.getElementById(id).style.display = "block";
    }
    function logout() {
        window.location.href = "../LoginComponent/LoginPage.html";
        sessionStorage.setItem("userToken", null);
    }

    document.getElementById('expPage').addEventListener("click", ()=> nav("expView"));
    document.getElementById('disPage').addEventListener("click", ()=> 
        window.location.href = "../../pages/DataRepresentation/Graphs.html");
    document.getElementById("logPage").addEventListener("click", ()=> logout());

    nav("expView");
});

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

        if (allData[0].date === undefined) {
            document.getElementById('date').value = '';
        }
        else {
            document.getElementById('date').value = allData[0].date;
        }
    };
}

function add() {
    itemID++;
    console.log(sessionStorage.getItem("userToken"));
    let amountInput = document.getElementById('amount').value;
    let currencyInput = document.getElementById('currency').value;
    let categoryInput = document.getElementById('category').value;
    let descriptionInput = document.getElementById('description').value;
    let dateInput = document.getElementById('date').value;

    if (amountInput.trim() !== "" && currencyInput.trim() !== "" && categoryInput.trim() !== "" && descriptionInput.trim() !== "" && dateInput.trim() !== "") {
        let itemDiv = document.createElement('div');
        itemDiv.id = itemID;
        let amountDiv = document.createElement('div');
        let currencyDiv = document.createElement('div');
        let categoryDiv = document.createElement('div');
        let descriptionDiv = document.createElement('div');
        let dateDiv = document.createElement('div');
        let delDiv = document.createElement('div');

        let a = parseFloat(amountInput);

        if (currencyInput === 'Yen') {
            currencyInput = 'USD';
            a = Math.round(a * .0069 * 100) / 100;
        }
        else if (currencyInput === 'Canadian') {
            currencyInput = 'USD';
            a = Math.round(a * .72 * 100) / 100;
        } 
        else if (currencyInput === 'Pesos') {
            currencyInput = 'USD';
            a = Math.round(a * .051 * 100) / 100;
        }
        else if (currencyInput === 'Euros') {
            currencyInput = 'USD';
            a = Math.round(a * 1.13 * 100) / 100;
        }

        if (!a.toString().includes('.')) {
            a = a + '.00';
        }
        
        amountDiv.textContent = a;
        amountDiv.classList.add('row');
        currencyDiv.textContent = currencyInput;
        currencyDiv.classList.add('row');
        categoryDiv.textContent = categoryInput;
        categoryDiv.classList.add('row');
        descriptionDiv.textContent = descriptionInput;
        descriptionDiv.classList.add('row');
        dateDiv.textContent = dateInput; // Set the date value
        dateDiv.classList.add('row');

        if (parseFloat(amountInput) > 0) {
            amountDiv.style.backgroundColor = 'lightgreen';
            currencyDiv.style.backgroundColor = 'lightgreen';
            categoryDiv.style.backgroundColor = 'lightgreen';
            descriptionDiv.style.backgroundColor = 'lightgreen';
            dateDiv.style.backgroundColor = 'lightgreen';
        }
        else {
            amountDiv.style.backgroundColor = '#FF7F7F';
            currencyDiv.style.backgroundColor = '#FF7F7F';
            categoryDiv.style.backgroundColor = '#FF7F7F';
            descriptionDiv.style.backgroundColor = '#FF7F7F';
            dateDiv.style.backgroundColor = '#FF7F7F';
        }

        delDiv.textContent = 'Delete';
        delDiv.classList.add('delButton');

        itemDiv.classList.add('item');   

        itemDiv.appendChild(currencyDiv);
        itemDiv.appendChild(amountDiv);
        itemDiv.appendChild(categoryDiv);
        itemDiv.appendChild(descriptionDiv);
        itemDiv.appendChild(dateDiv); // Append the date div

        fetch('http://localhost:3000/routes/Expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: sessionStorage.getItem("userToken") + '-' + itemID.toString(), currency: currencyInput, amount: a, category: categoryInput, description: descriptionInput })
        });

        delDiv.addEventListener('click', function() {
            itemDiv.remove();
            fetch('http://localhost:3000/routes/Expenses?id=' + sessionStorage.getItem("userToken") + '-' + item.id.toString(), {
                method: 'DELETE'
            });
        });

        itemDiv.appendChild(delDiv);

        document.getElementById('expenseList').appendChild(itemDiv);

        document.getElementById('amount').value = '';
        document.getElementById('currency').value = '';
        document.getElementById('category').value = '';
        document.getElementById('description').value = '';
        document.getElementById('date').value = '';
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
        console.log(data);
        entryCount = data.Expense.length;
        for (let i = 0; i < data.Expense.length; i++) {
            if (data.Expense[i].userId !== null) {
                if (sessionStorage.getItem("userToken") === data.Expense[i].userId.split('-')[0]) {
                    const user = data.Expense[i].userId.split('-')[0];
                    const Did = data.Expense[i].userId.split('-')[1];
                    itemID = Did;
                    let item = document.createElement('div');
                    item.id = Did;

                    let amountDiv = document.createElement('div');
                    let currencyDiv = document.createElement('div');
                    let categoryDiv = document.createElement('div');
                    let descriptionDiv = document.createElement('div');
                    let dateDiv = document.createElement('div');
                    let delDiv = document.createElement('div');

                    let amountInput = data.Expense[i].amount.toString();

                    if (!amountInput.includes('.')) {
                        amountInput = amountInput + '.00';
                    }

                    amountDiv.textContent = amountInput;
                    amountDiv.classList.add('row');
                    currencyDiv.textContent = data.Expense[i].currency;
                    currencyDiv.classList.add('row');
                    categoryDiv.textContent = data.Expense[i].category;
                    categoryDiv.classList.add('row');
                    descriptionDiv.textContent = data.Expense[i].description;
                    descriptionDiv.classList.add('row');
                    dateDiv.textContent = data.Expense[i].date ? new Date(data.Expense[i].date).toLocaleDateString() : ''; // Format the date for display
                    dateDiv.classList.add('row');

                    if (parseFloat(data.Expense[i].amount) > 0) {
                        amountDiv.style.backgroundColor = 'lightgreen';
                        currencyDiv.style.backgroundColor = 'lightgreen';
                        categoryDiv.style.backgroundColor = 'lightgreen';
                        descriptionDiv.style.backgroundColor = 'lightgreen';
                        dateDiv.style.backgroundColor = 'lightgreen';
                    }
                    else {
                        amountDiv.style.backgroundColor = '#FF7F7F';
                        currencyDiv.style.backgroundColor = '#FF7F7F';
                        categoryDiv.style.backgroundColor = '#FF7F7F';
                        descriptionDiv.style.backgroundColor = '#FF7F7F';
                        dateDiv.style.backgroundColor = '#FF7F7F';
                    }

                    delDiv.textContent = 'Delete';
                    delDiv.classList.add('delButton');

                    item.classList.add('item');   

                    item.appendChild(currencyDiv);
                    item.appendChild(amountDiv);
                    item.appendChild(categoryDiv);
                    item.appendChild(descriptionDiv);
                    item.appendChild(dateDiv);

                    delDiv.addEventListener('click', function() {
                        item.remove();
                        fetch('http://localhost:3000/routes/Expenses?id=' + sessionStorage.getItem("userToken") + '-' + item.id.toString(), {
                            method: 'DELETE'
                        });
                    });

                    item.appendChild(delDiv);

                    document.getElementById('expenseList').appendChild(item);
                }
            }
        }
    })
    .catch(error => {
        console.error('Fetch operation Error:', error);
    });
}

window.onload = addData;