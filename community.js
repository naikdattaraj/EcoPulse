// Store challenge signups in session
const signups = [];

document.getElementById('challengeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value.trim();
  const email = this.querySelector('input[type="email"]').value.trim();
  if (!name || !email) return;

  // Save the new signup
  signups.unshift({ name, email });

  // Show confirmation
  document.getElementById('confirmationMsg').innerText =
    "Thank you for joining! Check your email for event details.";

  // Clear the form
  this.reset();

  // Update visible signup list
  updateSignups();
});

// Display all signups in the responses list
function updateSignups() {
  const signupList = document.getElementById('signupResponses');
  if (!signups.length) {
    signupList.innerHTML = "<li>No participants yet. Be the first to join!</li>";
    return;
  }
  signupList.innerHTML = signups
    .map(s => `<li><strong>${s.name}</strong> – <em>${s.email}</em></li>`)
    .join('');
}

// Initialize view
updateSignups();
