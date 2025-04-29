const apiURL = "https://sheetdb.io/api/v1/cnx2w00xwchqe";

// Load Communications
fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    const commList = document.getElementById('communicationList');

    // 🆕 Sort by Date DESCENDING
    data.sort((a, b) => {
      const dateA = new Date(a.Date || '1970-01-01');
      const dateB = new Date(b.Date || '1970-01-01');
      return dateB - dateA; // Newest first
    });

    // Populate the table
    data.forEach(comm => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${comm.Date || ''}</td>
        <td>${comm.Subject || ''}</td>
        <td>${comm.Type || ''}</td>
        <td class="clickable-note" style="color:blue; text-decoration:underline; cursor:pointer;">
          ${comm.Notes ? (comm.Notes.length > 30 ? comm.Notes.substring(0, 30) + '...' : comm.Notes) : ''}
        </td>
      `;
      row.querySelector('.clickable-note').addEventListener('click', () => {
        openViewComm(comm);
      });
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

// Close Add Communication Modal
document.getElementById('cancelAddComm').addEventListener('click', () => {
  document.getElementById('addCommPopup').style.display = 'none';
});

// Save New Communication
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

// Open View Communication Memo
function openViewComm(comm) {
  document.getElementById('viewDate').innerText = comm.Date || '';
  document.getElementById('viewSubject').innerText = comm.Subject || '';
  document.getElementById('viewType').innerText = comm.Type || '';
  document.getElementById('viewNotes').innerText = comm.Notes || '';
  document.getElementById('viewCommPopup').style.display = 'block';
}

// Close View Communication Memo
document.getElementById('closeViewComm').addEventListener('click', () => {
  document.getElementById('viewCommPopup').style.display = 'none';
});
