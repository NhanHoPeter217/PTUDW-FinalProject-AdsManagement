document.addEventListener("DOMContentLoaded", function() {
    const valueSpan = document.querySelector('#buttonName');
    if (valueSpan) {
        const text = valueSpan.textContent;
        const uppercaseText = text.toUpperCase();
        valueSpan.textContent = uppercaseText;
    }
});