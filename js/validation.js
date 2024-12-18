export class FormValidation {
	selectors = {
		form: '[data-js-form]',
		fieldErrors: '[data-field-errors]',
		password: '[data-password]',
		confirmPassword: '[data-confirm-password]',
		birthday: '[data-birthday]',
		email: '[data-email]',
		button: '[data-button-submit]',
	}

	constructor() {
		this.bindEvents()
	}

	manageErrors(fieldInputElement, errorMessages) {
		const fieldErrorsElement = fieldInputElement.parentElement.querySelector(
			this.selectors.fieldErrors
		)

		if (!fieldErrorsElement) {
			f
		}

		fieldErrorsElement.innerHTML = errorMessages
			.map(message => `<span class="field__error">${message} </span>`)
			.join('')
	}

	errorMessages = {
		valueMissing: () => 'Пожалуйста, заполните это поле',
		patternMismatch: ({ title }) => title || 'Данные не соответствуют формату',
		tooShort: ({ minLength }) =>
			`Слишком короткое значение, минимум символов - ${minLength}`,
		tooLong: ({ maxLength }) =>
			`Слишком длинное значение, ограничение символов - ${maxLength}`,
		passwordMismatch: () => 'Пароли не совпадают',
		invalidEmail: () =>
			'введите корректный email. Допустимый формат: имя user@example.com',
		notIsFullAge: () => 'Вы должны быть старше 18 лет для регистрации',
	}

	validateField(fieldInputElement) {
		const errors = fieldInputElement.validity
		const errorMessages = []

		Object.entries(this.errorMessages).forEach(
			([errorType, getErrorMessage]) => {
				if (errors[errorType]) {
					errorMessages.push(getErrorMessage(fieldInputElement))
				}
			}
		)

		if (fieldInputElement.matches(this.selectors.birthday)) {
			if (!this.isFullAge(fieldInputElement.value)) {
				errorMessages.push(this.errorMessages.notIsFullAge())
			}
		}

		if (fieldInputElement.matches(this.selectors.email)) {
			if (!this.isValidEmail(fieldInputElement.value)) {
				errorMessages.push(this.errorMessages.invalidEmail())
			}
		}

		if (fieldInputElement.matches(this.selectors.confirmPassword)) {
			const passwordElement = document.querySelector(this.selectors.password)

			if (fieldInputElement.value !== passwordElement.value) {
				errorMessages.push(this.errorMessages.passwordMismatch())
			}
		}

		this.manageErrors(fieldInputElement, errorMessages)

		const isValid = errorMessages.length === 0
		fieldInputElement.ariaInvalid = !isValid

		return isValid
	}

	onBlur(event) {
		const { target } = event
		const isFormField = target.closest(this.selectors.form)
		const isRequired = target.required

		if (isFormField && isRequired) {
			this.validateField(target)
		}
	}

	isValidEmail(email) {
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		return emailRegex.test(email)
	}

	isFullAge(birthDate) {
		const userDate = new Date(birthDate)
		const today = new Date()
		const age = today.getFullYear() - userDate.getFullYear()

		const isBirthdayPassed =
			today.getMonth() > userDate.getMonth() ||
			(today.getMonth() === userDate.getMonth() &&
				today.getDate() >= userDate.getDate())

		return age > 18 || (age === 18 && isBirthdayPassed)
	}

	onSubmit(event) {
		const isFormElement = event.target.matches(this.selectors.form)
		let firstInvalidFieldInput = null

		if (!isFormElement) {
			return
		}

		const requiredInputElements = [...event.target.elements].filter(
			element => element.required
		)
		let isFormValid = true

		requiredInputElements.forEach(element => {
			const isFieldValid = this.validateField(element)

			if (!isFieldValid) {
				isFormValid = false

				if (!firstInvalidFieldInput) {
					firstInvalidFieldInput = element
				}
			}
		})

		if (!isFormValid) {
			event.preventDefault()
			firstInvalidFieldInput.focus()
			// event.target.closest('form__button').disabled = false
		}
	}

	bindEvents() {
		document.addEventListener(
			'blur',
			event => {
				this.onBlur(event)
			},
			{ capture: true }
		)
		document.addEventListener('submit', event => this.onSubmit(event))
	}
}
