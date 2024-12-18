import { FormValidation } from './validation.js'

const passwordToggle = document.querySelector('.field__password-toggle')
const passwordToggleImage = document.querySelector('.password-toggle__image')
const passwordInput = document.querySelector('.field__input--password')

new FormValidation()

passwordToggle.addEventListener('click', () => {
	if (passwordInput.type == 'password') {
		passwordInput.type = 'text'
		passwordToggleImage.src = './../images/eye.svg'
	} else {
		passwordInput.type = 'password'
		passwordToggleImage.src = './../images/eye-close.svg'
	}
})
