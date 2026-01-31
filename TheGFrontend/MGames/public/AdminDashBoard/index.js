
const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const darkMode = document.querySelector('.dark-mode');

const sideLinks = document.querySelectorAll('.sidebar a');
const contentFrame = document.getElementById('content-frame');

if (menuBtn && sideMenu) {
    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    });
}

if (closeBtn && sideMenu) {
    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    });
}

if (darkMode) {
    darkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode-variables');
        
        const icons = darkMode.querySelectorAll('span');
        icons.forEach(icon => icon.classList.toggle('active'));
    });
}

sideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('data-page');
        
        if (page) {
            e.preventDefault(); 
            
            let finalPath = "";

            if (page === "admin" || page === "insert") {
                finalPath = `../CreateUsersGame/${page}.html`;
            } else {

                finalPath = `${page}.html`; 
            }

            console.log("Fetching from path:", finalPath);
            
            contentFrame.src = finalPath;

            sideLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

