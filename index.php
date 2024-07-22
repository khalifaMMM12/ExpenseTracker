<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$name = $_SESSION['name'];

// Fetch expenses from database
$sql = "SELECT * FROM expenses WHERE user_id = $user_id";
$result = $conn->query($sql);
$expenses = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $expenses[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
    <title>Expense Tracker</title>
</head>
<body>
    <div>
        <h1 style="color: green;">Expense Tracker</h1>
        <h3>Hello <?php echo htmlspecialchars($name); ?>, These are your expenses</h3>
        <a href="logout.php" class="btn btn-danger" style="float: right;">Logout</a>
    </div>
    <div class="summary">
        <div>
            <h1>Balance: <span id="updatedBal">0</span></h1>
        </div>
        <br />
        <div class="total">
            <div>
                Total Income:
                <div>
                    <h2 style="color: green;" id="updatedInc">0</h2>
                </div>
            </div>
            <hr class="vertical" />
            <div>
                Total Expenses:
                <div>
                    <h2 style="color: red;" id="updatedExp">0</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="root">
        <div id="items">
            <h2>Expenses</h2>
            <table id="table">
                <tr class="titles">
                    <th>S.no.</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Delete</th>
                </tr>
                <?php foreach ($expenses as $index => $expense): ?>
                <tr>
                    <td><?php echo $index + 1; ?></td>
                    <td><?php echo htmlspecialchars($expense['name']); ?></td>
                    <td><?php echo htmlspecialchars($expense['amount']); ?></td>
                    <td><?php echo $expense['type'] == 1 ? 'Income' : 'Expense'; ?></td>
                    <td><i class="fas fa-trash-alt" onclick="deleteExpense(<?php echo $expense['id']; ?>)"></i></td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
        <hr class="vertical" />
        <div id="new">
            <h2>Add new</h2>
            <div class="inputs">
                <div class="inputitem">
                    <p style="width: 9rem">Entry type:</p>
                    <select id="itemType">
                        <option value="0">Expense</option>
                        <option value="1">Income</option>
                    </select>
                </div>
                <div class="inputitem">
                    <p style="width: 9rem">Name:</p>
                    <input id="name" type="text" value="" placeholder="name" />
                </div>
                <div class="inputitem">
                    <p style="width: 9rem">Amount:</p>
                    <input value="0" id="amount" name="mod" type="number" placeholder="amount" />
                </div>
            </div>
            <button onclick="addItem()">Add Expense</button>
        </div>
    </div>
    <!-- For storing user_id -->
    <span id="user-id" style="display: none;"><?php echo htmlspecialchars($user_id); ?></span>

    <!-- For storing expenses data -->
    <span id="expenses-data" style="display: none;"><?php echo htmlspecialchars(json_encode($expenses), ENT_QUOTES, 'UTF-8'); ?></span>

    <script src="script.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"></script>
</body>
</html>
