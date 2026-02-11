
import k from "./kaplayCtx.js";
import disclaimer from "./scenes/disclaimer.js";
import game from "./scenes/game.js";
import gameover from "./scenes/gameover.js";
import mainMenu from "./scenes/mainMenu.js";

// Helper to resolve paths relative to this script
const resolvePath = (path) => new URL(path, import.meta.url).href;

k.loadSprite("chemical-bg", resolvePath("./graphics/chemical-bg.png"));
k.loadSprite("platforms", resolvePath("./graphics/platforms.png"));
k.loadSprite("sonic", resolvePath("./graphics/sonic.png"), {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 30 },
    jump: { from: 8, to: 15, loop: true, speed: 100 },
  },
});
k.loadSprite("ring", resolvePath("./graphics/ring.png"), {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});
k.loadSprite("motobug", resolvePath("./graphics/motobug.png"), {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});
k.loadFont("mania", resolvePath("./fonts/mania.ttf"));
k.loadSound("destroy", resolvePath("./sounds/Destroy.wav"));
k.loadSound("hurt", resolvePath("./sounds/Hurt.wav"));
k.loadSound("hyper-ring", resolvePath("./sounds/HyperRing.wav"));
k.loadSound("jump", resolvePath("./sounds/Jump.wav"));
k.loadSound("ring", resolvePath("./sounds/Ring.wav"));
k.loadSound("city", resolvePath("./sounds/city.mp3"));

k.scene("disclaimer", disclaimer);
k.scene("main-menu", mainMenu);
k.scene("game", game);
k.scene("gameover", gameover);

k.go("disclaimer");