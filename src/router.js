// router.js - Simplified
export function openGame(gameName) {
    console.log("openGame called with:", gameName);

    let path;
    switch (gameName) {
        case "platform":
            path = "public/platformgame/platformGame.html";
            break;
        case "metrodivaniaMaster":
            path = "public/metrodivaniaMaster/metrodivaniaMaster.html";
            break;
        case "interactive dragon":
            path = "public/DragonSlider/interactive dragon.html";
            break;
        case "pacman":
            path = "public/pacmanmaster/pacman.html";
            break;
        case "Fighting game":
            path = "public/fightinggame/fightingGame.html";
            break;
        default:
            path = "public/Games.html";
    }

    console.log("Path determined:", path);

    // ALWAYS try to use parent's loadPage
    if (window.self !== window.top && window.parent?.loadPage) {
        console.log("Calling parent.loadPage (safe)");
        window.parent.loadPage(path);
    } else {
        console.error("Parent loadPage not available!");
        // Last resort
        if (window.parent && window.parent.document) {
            const iframe = window.parent.document.getElementById("contentFrame");
            if (iframe) {
                console.log("Direct iframe manipulation");
                iframe.src = path;
            }
        }
    }
}