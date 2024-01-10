function sortText(arr) {
    arr.sort((a, b) => {
        const numA = Number(a);
        const numB = Number(b);

        // Both are numbers: sort numerically
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }
        // Only A is a number: A comes first
        else if (!isNaN(numA)) {
            return -1;
        }
        // Only B is a number: B comes first
        else if (!isNaN(numB)) {
            return 1;
        }
        // Neither is a number: sort alphabetically
        else {
            return a.localeCompare(b);
        }
    });

    return arr;
}

module.exports = sortText;
