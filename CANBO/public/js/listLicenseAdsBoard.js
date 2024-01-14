const picker1 = datepicker('#dateExpired', {
    formatter: (input, date, instance) => {
        const value = date.toLocaleDateString();
        input.value = value; // => '1/25/2099'
    },
    overlayPlaceholder: 'Nhập năm',
    customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
});

const picker2 = datepicker('#startContract', {
    formatter: (input, date, instance) => {
        const value = date.toLocaleDateString();
        input.value = value; // => '1/25/2099'
    },
    overlayPlaceholder: 'Nhập năm',
    customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
});

const picker3 = datepicker('#endContract', {
    formatter: (input, date, instance) => {
        const value = date.toLocaleDateString();
        input.value = value; // => '1/25/2099'
    },
    overlayPlaceholder: 'Nhập năm',
    customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
});

