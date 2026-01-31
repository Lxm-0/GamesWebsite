
async function loadGames() {
  const res = await fetch("http://localhost/TheGames/TheGBackend/api/get_pending_games.php");
  const games = await res.json();

  document.getElementById("count").innerText = games.length;

  const table = document.getElementById("gamesTable");
  table.innerHTML = "";

  games.forEach(game => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td><img src="${game.game_image_path}" class="thumb"></td>
    <td><strong>${game.title}</strong></td>
    <td>${game.description.substring(0, 50)}...</td>
    <td class="action-btns">
        <a href="http://localhost/TheGames/TheGBackend${game.game_file_path.replace('../', '')}" target="_blank" class="btn btn-view">معاينة</a>
        <button onclick="processGame(${game.id}, 'accept')" class="btn btn-accept">قبول ونشر</button>
        <button onclick="processGame(${game.id}, 'reject')" class="btn btn-reject">رفض</button>
    </td>
`;

    table.appendChild(row);
  });
}

async function processGame(id, action) {
  const res = await fetch(`http://localhost/TheGames/TheGBackend/api/process_game.php?action=${action}&id=${id}`);
  const data = await res.json();
  alert(data.message);
  loadGames();
}
function showStatus(type, title, message) {
  const modal = document.getElementById('statusModal');
  const color = (type === 'success') ? '#4ecca3' : '#e94560';
  const icon = (type === 'success') ? 'fa-check-circle' : 'fa-times-circle';

  // تحديث المحتوى
  document.documentElement.style.setProperty('--msg-color', color);
  document.getElementById('modalIcon').className = `fas ${icon} icon`;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalContent').innerText = message;

  // إظهار النافذة
  modal.style.display = 'flex';
}
loadGames();
