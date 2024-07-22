document.addEventListener('DOMContentLoaded', function() {
    // Ensure user_id is defined and available
    let user_id = document.getElementById('user-id').textContent.trim();

    // Existing expenses
    let tableEntries = [];
    try {
        tableEntries = JSON.parse(document.getElementById('expenses-data').textContent);
    } catch (e) {
        console.error("Failed to parse expenses data:", e);
    }

    // Function to format numbers with commas and Naira sign
    function formatCurrency(amount) {
        return "₦" + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Function to update data expense summary
    function updateSummary() {
        let totalIncome = tableEntries.reduce((t, e) => {
            if (e.type === '1') t += parseFloat(e.amount);
            return t;
        }, 0);
        let totalExpense = tableEntries.reduce((ex, e) => {
            if (e.type === '0') ex += parseFloat(e.amount);
            return ex;
        }, 0);
        document.getElementById('updatedInc').innerText = formatCurrency(totalIncome);
        document.getElementById('updatedExp').innerText = formatCurrency(totalExpense);
        document.getElementById('updatedBal').innerText = formatCurrency(totalIncome - totalExpense);
    }

    // Function to add new entry to the dataset and expense table
    window.addItem = function() {
        let type = document.getElementById('itemType').value;
        let name = document.getElementById('name').value;
        let amount = document.getElementById('amount').value;

        // Input validation
        if (name === "" || Number(amount) === 0) {
            return alert("Incorrect Input");
        }
        if (Number(amount) <= 0) {
            return alert("Incorrect amount! Can't add negative");
        }

        // Push new data to database
        fetch('add_expense.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                type: type,
                name: name,
                amount: amount
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                tableEntries.push({
                    id: data.id,
                    user_id: user_id,
                    type: type,
                    name: name,
                    amount: amount
                });
                updateTable();
            } else {
                alert("Error adding expense");
            }
        });

        document.getElementById('name').value = "";
        document.getElementById('amount').value = 0;
    }

    // Function to delete a specific entry
    function deleteExpense(id) {
        fetch('delete_expense.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                tableEntries = tableEntries.filter(e => e.id != id);
                updateTable();
            } else {
                alert("Error deleting expense");
            }
        });
    }

    // Function to load all entry in the expense table
    function loadItems(e, i) {
        let cls;
        let table = document.getElementById('table');
        let row = table.insertRow(i + 1);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let c3 = row.insertCell(3);
        let c4 = row.insertCell(4);

        cell0.innerHTML = i + 1;
        cell1.innerHTML = e.name;
        cell2.innerHTML = formatCurrency(e.amount); // Format here
        c4.innerHTML = '<i class="fas fa-trash-alt"></i>';
        c4.classList.add("zoom");
        c4.addEventListener("click", () => deleteExpense(e.id));
        if (e.type === '0') {
            cls = "red";
            c3.innerHTML = "➚";
        } else {
            cls = "green";
            c3.innerHTML = "➘";
        }
        c3.style.color = cls;
    }

    // Clear the table before updating
    function remove() {
        let table = document.getElementById('table');
        while (table.rows.length > 1) table.deleteRow(-1);
    }

    // To render all entries
    function updateTable() {
        remove();
        tableEntries.map((e, i) => {
            loadItems(e, i);
        });
        updateSummary();
    }

    updateTable();
});
