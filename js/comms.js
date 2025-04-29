// Load Communications
fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    const commList = document.getElementById('communicationList');
    
    // 🆕 Sort by Date DESCENDING
    data.sort((a, b) => {
      const dateA = new Date(a.Date || '1970-01-01');
      const dateB = new Date(b.Date || '1970-01-01');
      return dateB - dateA; // Newest date first
    });

    // Now add rows
    data.forEach(comm => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${comm.Date || ''}</td>
        <td>${comm.Subject || ''}</td>
        <td>${comm.Type || ''}</td>
        <td class="clickable-note" style="color:blue; text-decoration:underline; cursor:pointer;">${comm.Notes ? (comm.Notes.length > 30 ? comm.Notes.substring(0,30)+'...' : comm.Notes) : ''}</td>
      `;
      row.querySelector('.clickable-note').addEventListener('click', () => {
        openViewComm(comm);
      });
      commList.appendChild(row);
    });
  });
