const SELECTORS = {
    form: '#early-access-form',
    successMessage: '#submit-success',
    valueFields: 'input, textarea'
};

document.addEventListener('DOMContentLoaded', initEarlyAccessForm);

function initEarlyAccessForm() {
    const form = document.querySelector(SELECTORS.form);
    const successMessage = document.querySelector(SELECTORS.successMessage);
    if (!form || !successMessage) return;

    const fields = Array.from(form.querySelectorAll(SELECTORS.valueFields));

    form.addEventListener('submit', (event) => {
        // UI-only behavior for now; backend wiring can be added later.
        event.preventDefault();
        if (!hasAnyInput(fields)) return;
        setSuccessState(form, successMessage);
    });
}

function hasAnyInput(fields) {
    return fields.some((field) => field.value.trim().length > 0);
}

function setSuccessState(form, successMessage) {
    form.classList.add('is-success');
    successMessage.classList.add('is-visible');
}
