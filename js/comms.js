<script>
const apiURL = "https://sheetdb.io/api/v1/cnx2w00xwchqe";

// Fetch Communications on Load
fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    const commList = document.getElementById('communicationList');
    data.forEach(comm => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${comm.Date || ''}</td>
        <td>${comm.Subject || ''}</td>
        <td>${comm.Type || ''}</td>
        <td>${comm.Notes || ''}</td>
      `;
      commList.appendChild(row);
    });
  });

// Search Functionality
document.getElementById('searchInputComm').addEventListener('input', function() {
  const searchValue = this.value.toLowerCase();
  const rows = document.querySelectorAll('#communicationList tr');
  rows.forEach(row => {
    const type = row.children[2].textContent.toLowerCase();
    const subject = row.children[1].textContent.toLowerCase();
    if (type.includes(searchValue) || subject.includes(searchValue)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Open Add Communication Modal
document.getElementById('addCommBtn').addEventListener('click', () => {
  document.getElementById('addCommPopup').style.display = 'block';
});

// Close Modal
function closeAddComm() {
  document.getElementById('addCommPopup').style.display = 'none';
}

// Submit New Communication
document.getElementById('addCommForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const newComm = {
    Date: document.getElementById('commDate').value,
    Subject: document.getElementById('commSubject').value,
    Type: document.getElementById('commType').value,
    Notes: document.getElementById('commNotes').value,
  };

  fetch(apiURL, {
    method: 'POST',
    body: JSON.stringify({ data: [newComm] }),
    headers: { 'Content-Type': 'application/json' },
  }).then(() => {
    location.reload();
  });
});
</script>

</body>
</html>
