// Use regular expression to find the text between "Phường " and the next comma
function getWardFromAddress(addressString) {
    const match = addressString.match(/Phường ([^,]*)(?=,)/);
    const match2 = addressString.match(/Ward ([^,]*)(?=,)/);

    let wardInfo = '';

    if (match) {
        wardInfo = match[1];
    } else if (match2) {
        wardInfo = match2[1];
    } else {
        const parts = addressString.split(', ');
        for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i + 1].includes('Quận')) {
                wardInfo = parts[i];
                break;
            }
        }
    }
    return wardInfo;
}

// Use regular expression to find the text between "Quận " and the next comma
function getDistrictFromAddress(addressString) {
    const match = addressString.match(/Quận ([^,]*)(?=,)/);
    const match2 = addressString.match(/District ([^,]*)(?=,)/);
    const match3 = addressString.match(/Phường [^,]*, ([^,]*)/);

    let district = '';

    if (match) {
        district = match[1];
    } else if (match2) {
        district = match2[1];
    } else if (match3) {
        district = match3[1];
    }
    return district;
}

export { getWardFromAddress, getDistrictFromAddress };
