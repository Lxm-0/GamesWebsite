// router.js - Handles paths for both Local(Apache) and Production(Vite Build)
export function openGame(target, isDirectPath = false) {
    console.log("openGame called with:", target, "isDirectPath:", isDirectPath);

    // Detect Environment
    // In Local Apache: window.IS_PRODUCTION is undefined.
    // In Prod Build: Vite replaces it with true.
    const isProd = (typeof window.IS_PRODUCTION !== 'undefined' && window.IS_PRODUCTION === true);

    // Path Prefixes relative to index.html (the parent frame)
    // Local: Legacy games are in 'public/', Module games in 'src/'
    // Prod: All games are flattened to root or 'assets/' depending on build, 
    // BUT 'public' folder contents are strictly copied to root.
    // Platform game (from src) might be in 'assets' or root depending on config.
    // Let's assume standard Vite behavior: public -> root.

    // Legacy Games (from public)
    // Local: "public/MainGames/..."
    // Prod: "MainGames/..."
    const legacyPrefix = isProd ? "" : "public/";

    // Module Games (from src)
    // Local: "src/MainGames/..."
    // Prod: Look depends on build. If output is "src/MainGames/...", prefix is "src/".
    // If output is flattened, prefix is "". 
    // Based on previous build check, 'platformGame.html' ended up deep.
    // Let's stick to "src/" for local. For Prod, we need to match the output.
    // The previous build output indicated: dist/src/MainGames/...
    // So Prod prefix is ALSO "src/" unless we flattened it.
    // Wait, Vite copies 'public' to root. 'src' files are built to 'dist/src' usually unless flattened.
    // Let's try matching the folder structure.
    const srcPrefix = "src/";

    let path;
    if (isDirectPath) {
        path = target;
    } else {
        switch (target) {
            // Module Games (Inside src)
            case "platform":
                path = srcPrefix + "MainGames/platformgame/platformGame.html";
                break;
            case "متسلق الجدران": // Assuming this was moved to src? No, moved to public. check list.
                // Actually I moved almost everything to public except platform.
                // Let's treat it as legacy if it's in public.
                path = legacyPrefix + "MainGames/متسلق الجدران/platformer.html";
                break;

            // Legacy Games (Inside public)
            case "metrodivaniaMaster":
                path = legacyPrefix + "MainGames/metrodivaniaMaster/metrodivaniaMaster.html";
                break;
            case "interactive dragon":
                path = legacyPrefix + "MainGames/DragonSlider/interactive dragon.html";
                break;
            case "pacman":
                path = legacyPrefix + "MainGames/pacmanmaster/pacman.html";
                break;
            case "Fighting game":
                path = legacyPrefix + "MainGames/fightinggame/fightingGame.html";
                break;
            case "tower defense":
                path = legacyPrefix + "MainGames/towerdefensemain/towerdefense.html";
                break;
            case "sounnyland":
                path = legacyPrefix + "MainGames/sunnylandplatformermain/sounnyland.html";
                break;
            case "fishgame":
                path = legacyPrefix + "MainGames/play/fishgame.html";
                break;
            case "piano":
                path = legacyPrefix + "MainGames/Piano/pianoo.html";
                break;
            case "MemoryMatching":
                path = legacyPrefix + "MainGames/Memory Matching/Matching.html";
                break;
            case "Space-Shooter-master":
                path = legacyPrefix + "MainGames/Space-Shooter-master/space_shooter.html";
                break;
            case "Breakout-Game":
                path = legacyPrefix + "MainGames/Breakout-Game/Breakout.html";
                break;
            case "Tic-Tac-Toe":
                path = legacyPrefix + "MainGames/Tic-Tac-Toe/x-o-game.html";
                break;
            case "Car-Race-master":
                path = legacyPrefix + "MainGames/Car-Race-master/Main_menu.html";
                break;
            case "Dice Game":
                path = legacyPrefix + "MainGames/Dice Game/Dice-Game.html";
                break;
            case "Archery-game-master":
                path = legacyPrefix + "MainGames/Archery-game-master/Archery-game.html";
                break;
            case "billionare":
                path = legacyPrefix + "MainGames/Billionare/billionare.html";
                break;
            case "PatientSymptom":
                path = legacyPrefix + "MainGames/PatientSymptom Game/PatientSymptom.html";
                break;
            case "Ping Pong Game":
                path = legacyPrefix + "MainGames/Pong Game/index.html";
                break;
            case "Vikning Game":
                path = legacyPrefix + "MainGames/Vikning Game/vikning_game.html";
                break;
            default:
                // Default fallback
                path = srcPrefix + "Games.html";
        }
    }

    console.log("Final Path determined:", path, "IsProd:", isProd);

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
