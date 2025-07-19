// Array to store community reports locally
const reports = [];

document.getElementById('reportForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const location = this.location.value.trim();
  const type = this.wasteType.value;
  const desc = this.description.value.trim();

  // Simple validation
  if (!location || !type || !desc) return;

  // Push new report
  reports.unshift({ location, type, desc, date: new Date().toLocaleString() });

  // Reset form
  this.reset();

  // Update displayed reports
  updateReports();
});

function updateReports() {
  const reportsList = document.getElementById('reportsList');
  if (!reports.length) {
    reportsList.innerHTML = "<li>No reports yet. Be the first to submit!</li>";
    return;
  }
  reportsList.innerHTML = reports.map(r => `
    <li>
      <strong>${r.location}</strong> – <em>${r.type.toUpperCase()}</em><br>
      <span>${r.desc}</span><br>
      <small>${r.date}</small>
    </li>
  `).join('');
}

// Initial display
updateReports();
