function updateTotals() {
    let gTotals = [];
    let cTotals = Array.from(document.querySelectorAll('#headerRow th')).slice(1, -1).map(() => 0);
    let grandTotal = 0;

    document.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
        if (rowIndex < document.querySelectorAll('tbody tr').length - 1) {
            let gTotal = 0;
            row.querySelectorAll('input[type="number"]').forEach((input, colIndex) => {
                let value = parseInt(input.value);
                gTotal += value;
                cTotals[colIndex] += value;
            });
            row.querySelector('.gTotal').textContent = gTotal;
            gTotals.push(gTotal);
            grandTotal += gTotal;
        }
    });

    document.querySelectorAll('.cTotal').forEach((cell, index) => {
        cell.textContent = cTotals[index];
    });

    document.getElementById('grandTotal').textContent = grandTotal;
}

function addCategory() {
    let headerRow = document.getElementById('headerRow');
    let newCategoryIndex = headerRow.children.length - 2;

    let newTh = document.createElement('th');
    newTh.textContent = `Category ${newCategoryIndex + 1}`;
    headerRow.insertBefore(newTh, headerRow.children[newCategoryIndex + 1]);

    document.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
        if (rowIndex < document.querySelectorAll('tbody tr').length - 1) {
            let newTd = document.createElement('td');
            let newInput = document.createElement('input');
            newInput.type = 'number';
            newInput.min = '0';
            newInput.value = '0';
            newInput.className = `g${rowIndex + 1}c`;
            newInput.addEventListener('input', updateTotals);
            newTd.appendChild(newInput);
            row.insertBefore(newTd, row.children[newCategoryIndex + 1]);
        } else {
            let newTd = document.createElement('td');
            newTd.className = 'cTotal';
            newTd.textContent = '0';
            row.insertBefore(newTd, row.children[newCategoryIndex + 1]);
        }
    });

    updateTotals();
}

function removeCategory() {
    let headerRow = document.getElementById('headerRow');
    if (headerRow.children.length > 4) {  // Change to ensure at least 2 categories remain
        headerRow.removeChild(headerRow.children[headerRow.children.length - 2]);

        document.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
            if (rowIndex < document.querySelectorAll('tbody tr').length - 1) {
                row.removeChild(row.children[row.children.length - 2]);
            } else {
                row.removeChild(row.children[row.children.length - 2]);
            }
        });

        updateTotals();
    }
}

function addGroup() {
    let tbody = document.querySelector('tbody');
    let newGroupIndex = tbody.children.length - 1;

    let newTr = document.createElement('tr');
    let newTh = document.createElement('th');
    newTh.style.borderLeft = 'none';
    newTh.textContent = `Group ${newGroupIndex + 1}`;
    newTr.appendChild(newTh);

    let categoryCount = document.querySelectorAll('#headerRow th').length - 2;

    for (let i = 0; i < categoryCount; i++) {
        let newTd = document.createElement('td');
        let newInput = document.createElement('input');
        newInput.type = 'number';
        newInput.min = '0';
        newInput.value = '0';
        newInput.className = `g${newGroupIndex + 1}c`;
        newInput.addEventListener('input', updateTotals);
        newTd.appendChild(newInput);
        newTr.appendChild(newTd);
    }

    let newTdTotal = document.createElement('td');
    newTdTotal.className = 'gTotal';
    newTdTotal.textContent = '0';
    newTr.appendChild(newTdTotal);

    tbody.insertBefore(newTr, tbody.children[newGroupIndex]);

    updateTotals();
}

function removeGroup() {
    let tbody = document.querySelector('tbody');
    if (tbody.children.length > 3) {
        tbody.removeChild(tbody.children[tbody.children.length - 2]);
        updateTotals();
    }
}

function calculateChiSquare() {
    updateTotals();

    let observed = [];
    let expected = [];
    let chiSquare = 0;

    let rowCount = document.querySelectorAll('tbody tr').length - 1;
    let colCount = document.querySelectorAll('#headerRow th').length - 2;

    for (let i = 0; i < rowCount; i++) {
        observed[i] = [];
        let gTotal = parseInt(document.querySelectorAll('.gTotal')[i].textContent);

        for (let j = 0; j < colCount; j++) {
            let oValue = parseInt(document.querySelectorAll(`.g${i + 1}c`)[j].value);
            let cTotal = parseInt(document.querySelectorAll('.cTotal')[j].textContent);
            let grandTotal = parseInt(document.getElementById('grandTotal').textContent);

            let eValue = (gTotal * cTotal) / grandTotal;
            chiSquare += ((oValue - eValue) ** 2) / eValue;

            observed[i][j] = oValue;
            expected.push(eValue);
        }
    }

    document.getElementById('result').textContent = 'Chi-Square Value: ' + chiSquare.toFixed(2);
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', updateTotals);
});

updateTotals();
