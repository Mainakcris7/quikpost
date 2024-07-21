(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

// Custom
let retype_password = document.querySelector("#conf-password")
let password = document.querySelector("#password")
let signup_btn = document.querySelector("#signup-form-btn")

password_check_fn = () => {
    if (password.value && (password.value !== retype_password.value)) {
        retype_password.classList.add('is-invalid')
        retype_password.classList.remove('is-valid')
        signup_btn.style.cursor = 'not-allowed'
        signup_btn.disabled = true
    } else if (password.value && (password.value === retype_password.value)) {
        retype_password.classList.remove('is-invalid')
        retype_password.classList.add('is-valid')
        signup_btn.style.cursor = 'pointer'
        signup_btn.disabled = false
    }
}

retype_password.addEventListener("input", password_check_fn)
password.addEventListener("input", password_check_fn)