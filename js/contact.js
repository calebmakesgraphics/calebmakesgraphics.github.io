/* ================================================================
   js/contact.js — Contact form validation + EmailJS submission
   Used only by contact.html.

   HOW TO SET UP EMAIL DELIVERY (EmailJS — free, no backend needed):
   ─────────────────────────────────────────────────────────────────
   1. Create a free account at https://www.emailjs.com
   2. Dashboard → Email Services → Add New Service
      Connect your Gmail / Outlook / etc. and copy the Service ID.
   3. Dashboard → Email Templates → Create New Template
      Design the email you want to receive. Use these variables in
      the template body (they map to the form fields):
        {{from_name}}    — sender's name
        {{from_email}}   — sender's email address
        {{subject}}      — selected project type
        {{budget}}       — selected budget range
        {{message}}      — the message body
        {{to_email}}     — YOUR email address (set below)
      Set "To Email" in the template to {{to_email}} so the value
      comes from this JS file — that way you only edit one place.
   4. Dashboard → Account → copy your Public Key.
   5. Fill in the three constants below and you're done!
   ================================================================ */

/* ──────────────────────────────────────────────────────────────────
   ★  CONFIGURATION — Edit these three values
────────────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'eLwI7gbPF_NTK2zWv';       // from EmailJS → Account
const EMAILJS_SERVICE_ID  = 'service_rkm421x';       // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'template_ulf6m05';      // from EmailJS → Email Templates
/* const EMAILJS_AUTOREPLY_ID = 'template_hwf6tcu';      // (optional) an auto-reply template you set up in EmailJS */
const RECIPIENT_EMAIL     = 'caleb.makes.graphics@gmail.com';     // ← YOUR email address here
/* ────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* Initialise the EmailJS SDK with your public key.
     The SDK script is loaded in contact.html's <head>.          */
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.warn('EmailJS SDK not loaded. Check the <script> tag in contact.html.');
  }

});

/* ------------------------------------------------------------------
   submitForm()
   Called by the "Send Message" button's onclick handler.
   1. Reads and validates form values
   2. Sends via EmailJS
   3. Shows success screen on success, or an error on failure
------------------------------------------------------------------ */
async function submitForm() {
  // Gather values
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const budget  = document.getElementById('cf-budget').value;
  const message = document.getElementById('cf-message').value.trim();
  const errorEl = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');

  /* --- Client-side validation --- */
  if (!name || !email || !message) {
    showError(errorEl, 'Please fill in your name, email, and message.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(errorEl, 'Please enter a valid email address.');
    return;
  }
  errorEl.style.display = 'none';

  /* --- Disable button and show loading state --- */
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  /* --- Build the template parameters object.
         Key names must match the {{variables}} in your EmailJS template. --- */
  const templateParams = {
    from_name:  name,
    from_email: email,
    subject:    subject  || 'General Enquiry',
    budget:     budget   || 'Not specified',
    message:    message,
    to_email:   RECIPIENT_EMAIL,     // routes the email to your address
  };

  try {
    /* Send via EmailJS. Returns a promise that resolves on success. */
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    /* Send auto-reply to the person who submitted the form
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, {
      from_name:  name,
      from_email: email,
    }); */

    // Show the thank-you screen
    document.getElementById('formFields').style.display  = 'none';
    document.getElementById('formSuccess').style.display = 'block';

  } catch (err) {
    /* If the send fails, show the error and re-enable the button */
    console.error('EmailJS error:', err);
    showError(
      errorEl,
      'Something went wrong sending your message. Please try again or email directly.'
    );
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message →';
  }
}

/* ------------------------------------------------------------------
   resetForm() — Clears the form and returns to the input view
------------------------------------------------------------------ */
function resetForm() {
  ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('cf-subject').value = '';
  document.getElementById('cf-budget').value  = '';

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled    = false;
  submitBtn.textContent = 'Send Message →';

  document.getElementById('formFields').style.display  = 'block';
  document.getElementById('formSuccess').style.display = 'none';
}

/* ------------------------------------------------------------------
   Helper — shows an error message in the given element
------------------------------------------------------------------ */
function showError(el, msg) {
  el.textContent    = msg;
  el.style.display  = 'block';
}
