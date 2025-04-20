// Generate a unique registration ID with IMSEC prefix
function generateRegistrationId() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return `IMSEC/${year}/${random}`.toUpperCase();
}

// Format student ID to 10-digit format
function formatStudentId(input) {
    let value = input.value;
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    input.value = value;
    validateInput(input);
    animateLabel(input);
}

// Animate label when input is focused or has value
function animateLabel(input) {
    const label = input.previousElementSibling;
    if (input.value.length > 0) {
        label.classList.add('active');
    } else {
        label.classList.remove('active');
    }
}

// Smart validation with helpful messages
function validateInput(input) {
    const validationMessage = input.nextElementSibling.nextElementSibling;
    let isValid = true;
    let message = '';

    switch(input.id) {
        case 'fullName':
            if (input.value.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters long';
            } else if (!/^[A-Za-z ]+$/.test(input.value)) {
                isValid = false;
                message = 'Name should only contain letters and spaces';
            } else if (input.value.length > 50) {
                isValid = false;
                message = 'Name should not exceed 50 characters';
            }
            break;

        case 'studentId':
            if (!/^\d{10}$/.test(input.value)) {
                isValid = false;
                message = 'Admission number must be exactly 10 digits';
            }
            break;

        case 'department':
            if (!input.value) {
                isValid = false;
                message = 'Please select your department';
            }
            break;
    }

    if (isValid) {
        validationMessage.textContent = '';
        validationMessage.classList.remove('error');
        input.classList.remove('shake');
        input.classList.add('valid');
    } else {
        validationMessage.textContent = message;
        validationMessage.classList.add('error');
        input.classList.remove('valid');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    return isValid;
}

// Autosave with visual feedback
let autosaveTimeout;
function autoSave() {
    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => {
        const formData = {
            fullName: document.getElementById('fullName').value,
            studentId: document.getElementById('studentId').value,
            department: document.getElementById('department').value
        };
        localStorage.setItem('formAutosave', JSON.stringify(formData));
        
        const status = document.getElementById('autosaveStatus');
        status.innerHTML = '<i class="fas fa-save"></i> Changes saved';
        status.classList.add('visible');
        setTimeout(() => status.classList.remove('visible'), 2000);
    }, 500);
}

// Clear form with confirmation
function clearForm() {
    if (confirm('Are you sure you want to clear the form? All entered data will be lost.')) {
        document.getElementById('registrationForm').reset();
        localStorage.removeItem('formAutosave');
        document.querySelectorAll('.validation-message').forEach(msg => {
            msg.textContent = '';
            msg.classList.remove('error');
        });
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid', 'shake');
            animateLabel(input);
        });
    }
}

// Load autosaved data and set up input listeners
window.onload = function() {
    // Set up input listeners
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            const help = input.nextElementSibling;
            help.style.opacity = '1';
            help.style.transform = 'translateY(0)';
        });

        input.addEventListener('blur', () => {
            const help = input.nextElementSibling;
            help.style.opacity = '0';
            help.style.transform = 'translateY(-10px)';
            animateLabel(input);
        });

        input.addEventListener('input', () => {
            validateInput(input);
            autoSave();
        });
    });

    // Load autosaved data
    const savedData = localStorage.getItem('formAutosave');
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach(key => {
            const input = document.getElementById(key);
            if (input && formData[key]) {
                input.value = formData[key];
                validateInput(input);
                animateLabel(input);
            }
        });
    }
}

// Handle form submission with animation
function handleSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    const form = event.target;
    const inputs = form.querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
            input.classList.add('shake');
        }
    });
    
    if (!isValid) {
        return;
    }
    
    // Animate submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Registering...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        studentId: document.getElementById('studentId').value,
        department: document.getElementById('department').value,
        registrationId: generateRegistrationId(),
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage and redirect with animation
    localStorage.setItem('registrationData', JSON.stringify(formData));
    
    setTimeout(() => {
        form.style.opacity = '0';
        form.style.transform = 'scale(0.9)';
        setTimeout(() => {
            window.location.href = 'success.html';
        }, 500);
    }, 1000);
}
