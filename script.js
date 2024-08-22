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

    function deleteExpense(id) {
        // Confirm deletion with a Yes/No prompt
        if (confirm("Are you sure you want to delete this expense?")) {
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
                    alert("Expense deleted successfully.");
                } else {
                    alert("Error deleting expense.");
                }
            });
        }
    }

    // Function to load all entries in the expense table
    function loadItems(e, i) {
        let cls;
        let table = document.getElementById('table');
        let row = table.insertRow(i + 1);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let c3 = row.insertCell(3);
        let c4 = row.insertCell(4);
        let c5 = row.insertCell(5); // New column for the edit button

        cell0.innerHTML = i + 1;
        cell1.innerHTML = e.name;
        cell2.innerHTML = formatCurrency(e.amount);
        c4.innerHTML = '<i class="fas fa-trash-alt"></i>';
        c4.classList.add("zoom");
        c4.addEventListener("click", () => deleteExpense(e.id));

        c5.innerHTML = '<i class="fas fa-edit"></i>'; // Add edit icon
        c5.classList.add("zoom");
        c5.addEventListener("click", () => editExpense(e.id)); // Attach edit handler

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

    // Get the modal
    var modal = document.getElementById("editModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Function to open the edit modal with the expense data
    window.editExpense = function(id) {
        const expense = tableEntries.find(exp => exp.id == id);

        document.getElementById("editItemType").value = expense.type;
        document.getElementById("editName").value = expense.name;
        document.getElementById("editAmount").value = expense.amount;
        document.getElementById("editId").value = expense.id;

        modal.style.display = "block";
    }

    // Function to open the edit modal and populate it with existing data
    function editExpense(id) {
        const expense = tableEntries.find(exp => exp.id == id);

        if (expense) {
            // Set form values with the existing expense data
            document.getElementById('editId').value = expense.id;
            document.getElementById('editItemType').value = expense.type;
            document.getElementById('editName').value = expense.name;
            document.getElementById('editAmount').value = expense.amount;

            // Show the modal
            document.getElementById('editModal').style.display = "block";
        }
    }

    // Function to save the edited expense
        function saveEdit(event) {
            event.preventDefault();

            // Collect form data
            const id = document.getElementById("editId").value;
            const type = document.getElementById("editItemType").value;
            const name = document.getElementById("editName").value;
            const amount = document.getElementById("editAmount").value;

            // Validate form data
            if (name === "" || amount === "" || isNaN(amount) || amount <= 0) {
                alert("Please fill all fields correctly.");
                return;
            }

            // Send the updated expense to the backend
            fetch('update_expense.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    type: type,
                    name: name,
                    amount: amount
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Find the updated expense in the table and update it locally
                    const index = tableEntries.findIndex(exp => exp.id == id);
                    if (index !== -1) {
                        tableEntries[index].type = type;
                        tableEntries[index].name = name;
                        tableEntries[index].amount = amount;
                        
                        // Refresh the table display
                        updateTable();
                    }

                    // Close the modal
                    document.getElementById("editModal").style.display = "none";
                } else {
                    alert("Error saving changes: " + data.error);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while updating the expense.");
            });
        }

        // Event listener for closing the modal
        document.querySelector('.close').onclick = function() {
            document.getElementById("editModal").style.display = "none";
        };

        // Close modal if clicked outside of it
        window.onclick = function(event) {
            const modal = document.getElementById("editModal");
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

    
});
