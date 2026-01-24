

const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuItems = document.getElementById('menuItems');

if (hamburgerBtn && menuItems) {
    hamburgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menuItems.style.display === 'block') {
            menuItems.style.display = 'none';
            hamburgerBtn.classList.remove('active');
        } else {
            menuItems.style.display = 'block';
            hamburgerBtn.classList.add('active');
        }
    });

    document.addEventListener('click', function () {
        menuItems.style.display = 'none';
        hamburgerBtn.classList.remove('active');
    });

    menuItems.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}


let divdelete = document.getElementById("Welcome");
let mainFrame = document.getElementById("contentFrame");
let pageLoader = document.getElementById("pageloader");


window.loadPage = function (page) {

    const isInIframe = window.self !== window.top;


    if (divdelete) {
        divdelete.style.display = 'none';
    }

    if (pageLoader) {
        pageLoader.style.display = "flex";
    }


    if (mainFrame) {
        mainFrame.style.display = "none";
    }


    if (mainFrame) {
        mainFrame.src = page;


        localStorage.setItem("currentPage", page);
        localStorage.setItem("welcomeHidden", "true");


        mainFrame.onload = function () {
            console.log("Iframe loaded:", page);

            setTimeout(function () {
                if (pageLoader) {
                    pageLoader.style.display = 'none';
                }
                if (mainFrame) {
                    mainFrame.style.display = 'block';
                }
                try {
                    mainFrame.contentWindow.dispatchEvent(new Event('resize'));
                } catch (e) {
                    console.log("Cross-origin prevented manual resize trigger, but local files should be fine.");
                }
            }, 500);
        };


        mainFrame.onerror = function () {
            console.error("Failed to load iframe:", page);
            if (pageLoader) {
                pageLoader.style.display = 'none';
            }
            alert("Failed to load the page. Please check the file path.");
        };
    }
}


const startButton = document.querySelector('.button-main');
if (startButton) {
    startButton.addEventListener('click', () => {
        console.log("Start button clicked");
        loadPage("public/Games.html");
    });
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");

    // Make sure welcome screen is visible initially
    if (divdelete) {
        divdelete.style.display = 'flex';
    }

    // Hide loader initially
    if (pageLoader) {
        pageLoader.style.display = 'none';
    }

    // Hide iframe initially
    if (mainFrame) {
        mainFrame.style.display = 'none';
    }

    // Check saved state after a small delay
    setTimeout(() => {
        const savedPage = localStorage.getItem("currentPage");
        const welcomeHidden = localStorage.getItem("welcomeHidden");

        console.log("Saved state:", { savedPage, welcomeHidden });
const isInIframe=false;
        if (!isInIframe && savedPage && welcomeHidden === "true") {
            loadPage(savedPage);
        } else {
            console.log("Showing welcome screen");
            if (divdelete) {
                divdelete.style.display = 'flex';
            }
        }
    }, 100);
});