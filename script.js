async function fetchEntries() {
    const response = await fetch('fetch_entries.php');
    const data = await response.json();
    return data;
}

async function addItem() {
    let type = document.getElementById("itemType").value;
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;

    if (name === "" || Number(amount) === 0) return alert("Incorrect Input");
    if (Number(amount) <= 0) return alert("Incorrect amount! can't add negative");

    const formData = new FormData();
    formData.append('type', type);
    formData.append('name', name);
    formData.append('amount', amount);

    await fetch('add_entry.php', {
        method: 'POST',
        body: formData
    });

    updateTable();
}

function loadItems(entries) {
    const table = document.getElementById("table");
    while (table.rows.length > 1) table.deleteRow(1);
    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach((entry, index) => {
        let row = table.insertRow(index + 1);
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = entry.name;
        row.insertCell(2).innerText = entry.amount;

        let typeCell = row.insertCell(3);
        typeCell.innerText = entry.type == 0 ? "Expense" : "Income";
        typeCell.style.color = entry.type == 0 ? "red" : "green";

        let deleteCell = row.insertCell(4);
        deleteCell.innerHTML = "☒";
        deleteCell.classList.add("zoom");
        deleteCell.onclick = () => deleteItem(entry.id);

        if (entry.type == 1) totalIncome += parseFloat(entry.amount);
        else totalExpense += parseFloat(entry.amount);
    });

    document.getElementById("updatedInc").innerText = totalIncome;
    document.getElementById("updatedExp").innerText = totalExpense;
    document.getElementById("updatedBal").innerText = totalIncome - totalExpense;
}

async function updateTable() {
    const entries = await fetchEntries();
    loadItems(entries);
}

async function deleteItem(id) {
    const formData = new FormData();
    formData.append('id', id);

    await fetch('delete_entry.php', {
        method: 'POST',
        body: formData
    });

    updateTable();
}

updateTable();