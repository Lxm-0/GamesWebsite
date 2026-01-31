// router.js - Updated to handle Direct URLs
export function openGame(target, isDirectPath = false) {
    console.log("openGame called with:", target, "isDirectPath:", isDirectPath);
    let path;
    if (isDirectPath) {
        // If it's a dynamic game, use the URL directly from the database
        path = target;
    } else {
        // Original Switch Logic for hardcoded games
        switch (target) {
            case "platform":
                path = "public/MainGames/platformgame/platformGame.html";
                break;
            case "metrodivaniaMaster":
                path = "public/MainGames/metrodivaniaMaster/metrodivaniaMaster.html";
                break;
            case "interactive dragon":
                path = "public/MainGames/DragonSlider/interactive dragon.html";
                break;
            case "pacman":
                path = "public/MainGames/pacmanmaster/pacman.html";
                break;
            case "Fighting game":
                path = "public/MainGames/fightinggame/fightingGame.html";
                break;
            case "tower defense":
                path = "public/MainGames/towerdefensemain/towerdefense.html";
                break;
            case "sounnyland":
                path = "public/MainGames/sunnylandplatformermain/sounnyland.html";
                break;
            case "fishgame":
                path = "public/MainGames/play/fishgame.html";
                break;
            case "piano":
                path = "public/MainGames/Piano/pianoo.html";
                break;
            case "MemoryMatching":
                path = "public/MainGames/Memory Matching/Matching.html";
                break;
            case "Space-Shooter-master":
                path = "public/MainGames/Space-Shooter-master/space_shooter.html";
                break;
            case "Breakout-Game":
                path = "public/MainGames/Breakout-Game/Breakout.html";
                break;
            case "Tic-Tac-Toe":
                path = "public/MainGames/Tic-Tac-Toe/x-o-game.html";
                break;
            case "Car-Race-master":
                path = "public/MainGames/Car-Race-master/Main_menu.html";
                break;
            case "Dice Game":
                path = "public/MainGames/Dice Game/Dice-Game.html";
                break;
            case "Archery-game-master":
                path = "public/MainGames/Archery-game-master/Archery-game.html";
                break;
            case "billionare":
                path = "public/MainGames/Billionare/billionare.html";
                break;
            case "PatientSymptom":
                path = "public/MainGames/PatientSymptom Game/PatientSymptom.html";
                break;  
             case"متسلق الجدران":
             path = "public/MainGames/متسلق الجدران/platformer.html";
             break; 
            case "Ping Pong Game":
            path = "public/MainGames/Pong Game/index.html";
            break;
            default:
                path = "public/Games.html";
        }
    }

    console.log("Final Path determined:", path);

    // Navigation logic
    if (window.self !== window.top && window.parent?.loadPage) {
        window.parent.loadPage(path);
    } else {
        const iframe = window.parent?.document?.getElementById("contentFrame");
        if (iframe) {
            iframe.src = path;
        } else {
            // If all else fails, just navigate the current window
            window.location.href = path;
        }
    }
    }
