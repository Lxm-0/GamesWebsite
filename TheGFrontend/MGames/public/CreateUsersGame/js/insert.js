const form = document.getElementById("gameUploadForm");
const fileInput = document.querySelector('input[name="Gamefile"]');
const imageInput = document.querySelector('input[name="GameImage"]');

function updateInputStyle(input) {
  if (input.files && input.files[0]) {
    input.style.border = "2px solid #007bff"; 
    input.style.backgroundColor = "rgba(0, 123, 255, 0.05)";
    input.style.boxShadow = "0 0 8px rgba(0, 123, 255, 0.2)";
  }
}

fileInput.addEventListener('change', () => updateInputStyle(fileInput));
imageInput.addEventListener('change', () => updateInputStyle(imageInput));

function showStatus(type, title, message) {
  const modal = document.getElementById('statusModal');
  if (!modal) {
    alert(message);
    return;
  }

  const color = (type === 'success') ? '#4ecca3' : '#e94560';
  const icon = (type === 'success') ? 'fa-check-circle' : 'fa-times-circle';

  modal.style.setProperty('--modal-color', color);
  document.getElementById('modalIcon').className = `fas ${icon} status-icon`;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalContent').innerText = message;

  modal.style.display = 'flex';
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!fileInput.files[0] || !imageInput.files[0]) {
    showStatus('error', 'بيانات ناقصة', 'يرجى اختيار صورة الغلاف وملف اللعبة أولاً');
    return; 
  }

  const formData = new FormData(form);

  try {
const res = await fetch("http://localhost/TheGames/TheGBackend/api/upload_game.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.status === 'success') {
      showStatus('success', 'تم الاستلام!', data.message);
      form.reset();
      fileInput.style = "";
      imageInput.style = "";
    } else {
      showStatus('error', 'عذراً.. خطأ', data.message);
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    showStatus('error', 'فشل الاتصال', 'تعذر الوصول إلى السيرفر، تأكد من تشغيل Apache.');
  }
});