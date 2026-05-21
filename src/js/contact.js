/* Contact Form Controller - BeyondCode Studio */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const statusDiv = document.getElementById('form-submit-status');

  // Real-time Event Listeners for Validation
  nameInput.addEventListener('input', () => validateField(nameInput, 'feedback-name', 'Nama minimal 3 karakter', val => val.trim().length >= 3));
  emailInput.addEventListener('input', () => validateField(emailInput, 'feedback-email', 'Masukkan alamat email yang valid', val => validateEmailStr(val)));
  subjectInput.addEventListener('input', () => validateField(subjectInput, 'feedback-subject', 'Subjek minimal 5 karakter', val => val.trim().length >= 5));
  messageInput.addEventListener('input', () => validateField(messageInput, 'feedback-message', 'Pesan minimal 15 karakter', val => val.trim().length >= 15));

  // Form Submit Action
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform final check on all fields
    const isNameValid = validateField(nameInput, 'feedback-name', 'Nama minimal 3 karakter', val => val.trim().length >= 3);
    const isEmailValid = validateField(emailInput, 'feedback-email', 'Masukkan alamat email yang valid', val => validateEmailStr(val));
    const isSubjectValid = validateField(subjectInput, 'feedback-subject', 'Subjek minimal 5 karakter', val => val.trim().length >= 5);
    const isMessageValid = validateField(messageInput, 'feedback-message', 'Pesan minimal 15 karakter', val => val.trim().length >= 15);

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      handleFormSubmit();
    } else {
      // Focus first invalid element
      const firstInvalid = form.querySelector('.form-control.invalid');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // Individual Field Validator
  function validateField(inputEl, feedbackId, errorMessage, validationFn) {
    const feedbackEl = document.getElementById(feedbackId);
    const value = inputEl.value;

    if (validationFn(value)) {
      inputEl.classList.remove('invalid');
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.className = 'form-feedback success';
      }
      return true;
    } else {
      inputEl.classList.add('invalid');
      if (feedbackEl) {
        feedbackEl.textContent = errorMessage;
        feedbackEl.className = 'form-feedback error';
      }
      return false;
    }
  }

  // Regex Email Check
  function validateEmailStr(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Simulated server request handler
  function handleFormSubmit() {
    const submitBtn = document.getElementById('btn-submit-form');
    if (!submitBtn) return;

    // Loading State
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirimkan Permintaan...';
    submitBtn.style.opacity = '0.7';

    // Simulate Network Request delay of 1.5 seconds
    setTimeout(() => {
      // Reset Button State
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';

      // Show success notification banner
      if (statusDiv) {
        statusDiv.textContent = 'Terima kasih! Pesan Anda telah berhasil dikirim. Tim IT Consultant kami akan menghubungi Anda dalam waktu maksimal 24 jam.';
        statusDiv.className = 'form-status success';
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Reset Form fields completely
      form.reset();
      
      // Hide feedback messages
      const feedbacks = form.querySelectorAll('.form-feedback');
      feedbacks.forEach(fb => fb.textContent = '');
      
      // Automatically hide success notification after 7 seconds
      setTimeout(() => {
        if (statusDiv) {
          statusDiv.style.display = 'none';
          statusDiv.className = 'form-status';
        }
      }, 7000);

    }, 1500);
  }
}
