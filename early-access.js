const SELECTORS = {
    form: '#early-access-form',
    successMessage: '#submit-success',
    errorMessage: '#submit-error',
    submitButton: '.submit-btn',
    valueFields: 'input, textarea'
};

document.addEventListener('DOMContentLoaded', initEarlyAccessForm);

function initEarlyAccessForm() {
    const form = document.querySelector(SELECTORS.form);
    const successMessage = document.querySelector(SELECTORS.successMessage);
    const errorMessage = document.querySelector(SELECTORS.errorMessage);
    const submitButton = form?.querySelector(SELECTORS.submitButton);
    if (!form || !successMessage || !errorMessage || !submitButton) return;

    const fields = Array.from(form.querySelectorAll(SELECTORS.valueFields));
    const defaultButtonText = submitButton.textContent;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearError(errorMessage);
        if (!hasAnyInput(fields)) {
            showError(errorMessage, 'Please enter at least one field before submitting.');
            return;
        }

        setSubmittingState(submitButton, true);

        const payload = getPayload(form);
        const config = normalizeSupabaseConfig(getSupabaseConfig());

        if (!isSupabaseConfigured(config)) {
            showError(errorMessage, 'Supabase is not configured yet.');
            setSubmittingState(submitButton, false, defaultButtonText);
            return;
        }

        try {
            await submitToSupabase(config, payload);
        } catch (error) {
            showError(errorMessage, error.message || 'Submit failed. Please try again.');
            setSubmittingState(submitButton, false, defaultButtonText);
            return;
        }

        form.reset();
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

function getPayload(form) {
    return {
        first_name: getTrimmedOrNull(form.elements.first_name.value),
        last_name: getTrimmedOrNull(form.elements.last_name.value),
        contact: getTrimmedOrNull(form.elements.contact.value),
        message: getTrimmedOrNull(form.elements.message.value)
    };
}

function getSupabaseConfig() {
    return window.EARLY_ACCESS_SUPABASE || {};
}

function normalizeSupabaseConfig(config) {
    const normalized = { ...config };
    normalized.schema = (config.schema || 'public').trim();
    normalized.table = (config.table || '').trim();

    if (normalized.table.includes('.')) {
        const [schemaPart, ...tableParts] = normalized.table.split('.');
        if (tableParts.length > 0) {
            normalized.schema = schemaPart.replace(/"/g, '');
            normalized.table = tableParts.join('.');
        }
    }

    normalized.table = normalized.table.replace(/"/g, '');
    return normalized;
}

function isSupabaseConfigured(config) {
    return Boolean(config.url && config.anonKey && config.table);
}

async function submitToSupabase(config, payload) {
    const baseUrl = config.url.replace(/\/$/, '');
    const endpoint = `${baseUrl}/rest/v1/${encodeURIComponent(config.table)}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Profile': config.schema,
            'Accept-Profile': config.schema,
            apikey: config.anonKey,
            Authorization: `Bearer ${config.anonKey}`,
            Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(await getSupabaseError(response));
    }
}

async function getSupabaseError(response) {
    const fallback = `Supabase insert failed (${response.status}).`;
    const responseText = await response.text();
    if (!responseText) return fallback;

    try {
        const error = JSON.parse(responseText);
        if (error.message && error.details) return `${error.message} ${error.details}`;
        if (error.message) return error.message;
        if (error.error_description) return error.error_description;
        if (error.error) return error.error;
        return fallback;
    } catch {
        return fallback;
    }
}

function setSubmittingState(button, isSubmitting, defaultText = 'Submit') {
    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Submitting...' : defaultText;
}

function getTrimmedOrNull(value) {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function showError(errorMessage, message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('is-visible');
}

function clearError(errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.remove('is-visible');
}
