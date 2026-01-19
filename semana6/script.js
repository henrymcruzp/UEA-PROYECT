document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const form = document.getElementById('registrationForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const edadInput = document.getElementById('edad');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const messageDiv = document.getElementById('message');

    // Objeto para almacenar el estado de validación
    const validationState = {
        nombre: false,
        email: false,
        password: false,
        confirmPassword: false,
        edad: false
    };

    // Expresión regular para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Expresión regular para contraseña (mínimo 8 caracteres, al menos un número y un carácter especial)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    // Función para validar nombre
    function validateNombre() {
        const value = nombreInput.value.trim();
        const errorElement = document.getElementById('errorNombre');
        
        if (value.length < 3) {
            errorElement.textContent = 'El nombre debe tener al menos 3 caracteres';
            nombreInput.classList.remove('valid');
            nombreInput.classList.add('invalid');
            validationState.nombre = false;
        } else {
            errorElement.textContent = '';
            nombreInput.classList.remove('invalid');
            nombreInput.classList.add('valid');
            validationState.nombre = true;
        }
        checkAllValidations();
    }

    // Función para validar email
    function validateEmail() {
        const value = emailInput.value.trim();
        const errorElement = document.getElementById('errorEmail');
        
        if (!emailRegex.test(value)) {
            errorElement.textContent = 'Ingresa un correo electrónico válido (ejemplo@dominio.com)';
            emailInput.classList.remove('valid');
            emailInput.classList.add('invalid');
            validationState.email = false;
        } else {
            errorElement.textContent = '';
            emailInput.classList.remove('invalid');
            emailInput.classList.add('valid');
            validationState.email = true;
        }
        checkAllValidations();
    }

    // Función para validar contraseña
    function validatePassword() {
        const value = passwordInput.value;
        const errorElement = document.getElementById('errorPassword');
        
        if (!passwordRegex.test(value)) {
            errorElement.textContent = 'La contraseña debe tener al menos 8 caracteres, un número y un carácter especial (!@#$%^&*)';
            passwordInput.classList.remove('valid');
            passwordInput.classList.add('invalid');
            validationState.password = false;
        } else {
            errorElement.textContent = '';
            passwordInput.classList.remove('invalid');
            passwordInput.classList.add('valid');
            validationState.password = true;
        }
        
        // Si la confirmación ya tiene valor, validar de nuevo
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        checkAllValidations();
    }

    // Función para validar confirmación de contraseña
    function validateConfirmPassword() {
        const value = confirmPasswordInput.value;
        const passwordValue = passwordInput.value;
        const errorElement = document.getElementById('errorConfirmPassword');
        
        if (value !== passwordValue) {
            errorElement.textContent = 'Las contraseñas no coinciden';
            confirmPasswordInput.classList.remove('valid');
            confirmPasswordInput.classList.add('invalid');
            validationState.confirmPassword = false;
        } else {
            errorElement.textContent = '';
            confirmPasswordInput.classList.remove('invalid');
            confirmPasswordInput.classList.add('valid');
            validationState.confirmPassword = true;
        }
        checkAllValidations();
    }

    // Función para validar edad
    function validateEdad() {
        const value = parseInt(edadInput.value);
        const errorElement = document.getElementById('errorEdad');
        
        if (isNaN(value) || value < 18) {
            errorElement.textContent = 'Debes tener al menos 18 años';
            edadInput.classList.remove('valid');
            edadInput.classList.add('invalid');
            validationState.edad = false;
        } else {
            errorElement.textContent = '';
            edadInput.classList.remove('invalid');
            edadInput.classList.add('valid');
            validationState.edad = true;
        }
        checkAllValidations();
    }

    // Función para verificar si todas las validaciones son correctas
    function checkAllValidations() {
        const allValid = Object.values(validationState).every(state => state === true);
        submitBtn.disabled = !allValid;
    }

    // Función para mostrar mensaje
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
    }

    // Función para reiniciar el formulario
    function resetForm() {
        form.reset();
        
        // Limpiar clases y mensajes de error
        const inputs = [nombreInput, emailInput, passwordInput, confirmPasswordInput, edadInput];
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => {
            error.textContent = '';
        });
        
        // Resetear estado de validación
        Object.keys(validationState).forEach(key => {
            validationState[key] = false;
        });
        
        // Deshabilitar botón de enviar
        submitBtn.disabled = true;
        
        // Ocultar mensaje
        messageDiv.className = 'message';
        messageDiv.textContent = '';
    }

    // Event Listeners para validación en tiempo real
    nombreInput.addEventListener('input', validateNombre);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    edadInput.addEventListener('input', validateEdad);

    // Evento para enviar el formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar validación final
        checkAllValidations();
        
        if (!submitBtn.disabled) {
            showMessage('¡Formulario enviado exitosamente! Todas las validaciones son correctas.', 'success');
            
            // Opcional: Aquí podrías enviar los datos a un servidor
            console.log('Datos del formulario:');
            console.log('Nombre:', nombreInput.value);
            console.log('Email:', emailInput.value);
            console.log('Contraseña:', passwordInput.value);
            console.log('Edad:', edadInput.value);
        }
    });

    // Evento para el botón de reiniciar
    resetBtn.addEventListener('click', resetForm);

    // Inicializar validación
    checkAllValidations();
});