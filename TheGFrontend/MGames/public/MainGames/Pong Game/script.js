const over_in = document.getElementById("overlay_in");
const mod_in = document.getElementById("model_in");
const btu_in = document.getElementById("btn_in");
const open_in = document.getElementById("open_info");
const informat = document.getElementById("statsOverlay");

open_in.addEventListener("click", () =>{
    over_in.style.display = "inline";
    informat.style.display = "inline";

});

over_in.addEventListener("click", () =>{
    over_in.style.display = "none";
    informat.style.display = "none";
});
mod_in.addEventListener("click", (e) =>{
e.stopPropagation();
});
btu_in.addEventListener("click", () =>{
    over_in.style.display = "none";
    informat.style.display = "none";
});



// ========== JavaScript الكامل للعبة مع التحسينات المطلوبة ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pong Evolution - جاهز للعب!');

    // ==============================================
    // 1. نظام إعادة تدوير الجسيمات (Particle Pooling)
    // ==============================================
    class ParticlePool {
        constructor(maxParticles = 200) {
            this.maxParticles = maxParticles;
            this.pool = [];
            this.activeParticles = [];
            this.init();
        }

        init() {
            // إنشاء مخزن من الجسيمات مسبقاً
            for (let i = 0; i < this.maxParticles; i++) {
                this.pool.push({
                    x: 0,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    radius: 0,
                    color: '#ffffff',
                    life: 0,
                    decay: 0,
                    type: 'circle',
                    active: false,
                    rotation: 0,
                    scale: 1,
                    alpha: 1
                });
            }
        }

        getParticle() {
            // البحث عن جسيم غير نشط في المخزن
            for (let particle of this.pool) {
                if (!particle.active) {
                    return particle;
                }
            }
            
            // إذا لم توجد جسيمات متاحة، نعيد آخر جسيم من القائمة النشطة
            if (this.activeParticles.length > 0) {
                const recycled = this.activeParticles.shift();
                recycled.active = false;
                return recycled;
            }
            
            return null;
        }

        createParticle(x, y, vx, vy, radius, color, type = 'circle', life = 1.0, decay = 0.02) {
            const particle = this.getParticle();
            if (!particle) return null;

            Object.assign(particle, {
                x, y, vx, vy, radius, color, type, life, decay,
                active: true,
                rotation: Math.random() * Math.PI * 2,
                scale: 1,
                alpha: 1
            });

            this.activeParticles.push(particle);
            return particle;
        }

        update(deltaTime) {
            const normalDelta = deltaTime / 16.67; // تطبيع إلى 60fps
            
            for (let i = this.activeParticles.length - 1; i >= 0; i--) {
                const p = this.activeParticles[i];
                
                // تحديث الموقع
                p.x += p.vx * normalDelta;
                p.y += p.vy * normalDelta;
                
                // تطبيق الجاذبية الخفيفة
                p.vy += 0.1 * normalDelta;
                
                // تقليل الحياة
                p.life -= p.decay * normalDelta;
                p.alpha = Math.max(0, p.life);
                p.scale = Math.max(0, p.life);
                
                // تدوير الجسيمات النجمية
                if (p.type === 'star') {
                    p.rotation += 0.05 * normalDelta;
                }
                
                // إزالة الجسيمات الميتة
                if (p.life <= 0) {
                    p.active = false;
                    this.activeParticles.splice(i, 1);
                }
            }
        }

        draw(ctx) {
            ctx.save();
            
            for (const p of this.activeParticles) {
                if (!p.active || p.alpha <= 0) continue;
                
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.scale(p.scale, p.scale);
                
                if (p.type === 'star') {
                    ctx.rotate(p.rotation);
                    this.drawStar(ctx, 0, 0, p.radius, p.radius * 0.5, 5);
                } else if (p.type === 'explosion') {
                    this.drawExplosion(ctx, 0, 0, p.radius);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            }
            
            ctx.restore();
        }

        drawStar(ctx, cx, cy, outerRadius, innerRadius, points) {
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * Math.PI) / points;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }

        drawExplosion(ctx, cx, cy, radius) {
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const x = cx + Math.cos(angle) * radius * 2;
                const y = cy + Math.sin(angle) * radius * 2;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }

        clear() {
            for (const p of this.activeParticles) {
                p.active = false;
            }
            this.activeParticles = [];
        }

        getCount() {
            return this.activeParticles.length;
        }
    }

    // ==============================================
    // 2. تحسين حلقة اللعبة وإدارة الوقت
    // ==============================================
    class GameLoop {
        constructor() {
            this.lastTime = 0;
            this.deltaTime = 0;
            this.accumulator = 0;
            this.fixedDelta = 1000 / 60; // 60fps ثابت للفيزياء
            this.fps = 60;
            this.frameCount = 0;
            this.lastFpsUpdate = 0;
            this.isRunning = false;
            this.callbacks = {
                update: null,
                draw: null
            };
        }

        start(updateCallback, drawCallback) {
            this.callbacks.update = updateCallback;
            this.callbacks.draw = drawCallback;
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.loop.bind(this));
        }

        stop() {
            this.isRunning = false;
        }

        loop(currentTime) {
            if (!this.isRunning) return;

            // حساب deltaTime مع الحماية من القيم العالية
            this.deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // منع القيم العالية جداً (مثل عندما تنتقل اللعبة إلى الخلفية)
            if (this.deltaTime > 100) {
                this.deltaTime = this.fixedDelta;
            }

            // تراكم الوقت لتحديث الفيزياء
            this.accumulator += this.deltaTime;

            // تحديث الفيزياء بوتيرة ثابتة
            while (this.accumulator >= this.fixedDelta) {
                if (this.callbacks.update) {
                    this.callbacks.update(this.fixedDelta);
                }
                this.accumulator -= this.fixedDelta;
            }

            // حساب FPS
            this.updateFPS(currentTime);

            // الرسم (باستخدام الوقت المتبقي)
            if (this.callbacks.draw) {
                const alpha = this.accumulator / this.fixedDelta;
                this.callbacks.draw(alpha);
            }

            requestAnimationFrame(this.loop.bind(this));
        }

        updateFPS(currentTime) {
            this.frameCount++;
            
            if (currentTime - this.lastFpsUpdate >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
                this.frameCount = 0;
                this.lastFpsUpdate = currentTime;
                
                // تحديث عداد FPS في الواجهة
                const fpsCounter = document.getElementById('fpsCounter');
                if (fpsCounter) {
                    fpsCounter.textContent = `${this.fps} FPS`;
                    fpsCounter.style.color = this.fps > 50 ? '#59CE8F' : this.fps > 30 ? '#FFB740' : '#FF1E00';
                }
                
                const frameRateElement = document.getElementById('frameRate');
                if (frameRateElement) {
                    frameRateElement.textContent = this.fps;
                }
            }
        }
    }

    // ==============================================
    // 3. تأثير الإمالة ثلاثي الأبعاد لواجهة المستخدم
    // ==============================================
    class TiltEffect3D {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.isEnabled = true;
            this.rotationX = 0;
            this.rotationY = 0;
            this.targetX = 0;
            this.targetY = 0;
            this.smoothness = 0.1;
            this.maxRotation = 5; // درجات
            this.initialize();
        }

        initialize() {
            if (!this.container) return;

            // إضافة مستمعات الأحداث للماوس
            this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            this.container.addEventListener('mouseenter', this.handleMouseEnter.bind(this));

            // إضافة مستمعات الأحداث لللمس
            this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
            this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });

            // بدء حلقة التحديث
            this.updateLoop();
        }

        handleMouseMove(e) {
            if (!this.isEnabled) return;

            const rect = this.container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // حساب المسافة النسبية من المركز
            const relX = (e.clientX - centerX) / (rect.width / 2);
            const relY = (e.clientY - centerY) / (rect.height / 2);
            
            this.targetY = relX * this.maxRotation;
            this.targetX = -relY * this.maxRotation;
        }

        handleTouchMove(e) {
            if (!this.isEnabled || !e.touches[0]) return;
            
            const touch = e.touches[0];
            const rect = this.container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const relX = (touch.clientX - centerX) / (rect.width / 2);
            const relY = (touch.clientY - centerY) / (rect.height / 2);
            
            this.targetY = relX * this.maxRotation;
            this.targetX = -relY * this.maxRotation;
        }

        handleTouchStart(e) {
            if (!this.isEnabled || !e.touches[0]) return;
            
            const touch = e.touches[0];
            const rect = this.container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const relX = (touch.clientX - centerX) / (rect.width / 2);
            const relY = (touch.clientY - centerY) / (rect.height / 2);
            
            this.targetY = relX * this.maxRotation;
            this.targetX = -relY * this.maxRotation;
        }

        handleMouseLeave() {
            this.targetX = 0;
            this.targetY = 0;
        }

        handleMouseEnter() {
            // لا شيء خاص
        }

        updateLoop() {
            // تطبيق التمهيد اللطيف
            this.rotationX += (this.targetX - this.rotationX) * this.smoothness;
            this.rotationY += (this.targetY - this.rotationY) * this.smoothness;

            // تطبيق التحويل
            if (this.container) {
                this.container.style.transform = `
                    perspective(1000px)
                    rotateX(${this.rotationX}deg)
                    rotateY(${this.rotationY}deg)
                    translateZ(0)
                `;
            }

            requestAnimationFrame(this.updateLoop.bind(this));
        }

        enable() {
            this.isEnabled = true;
        }

        disable() {
            this.isEnabled = false;
            this.targetX = 0;
            this.targetY = 0;
        }
    }

    // ==============================================
    // 4. نظام الاهتزازات للأجهزة المحمولة
    // ==============================================
    class HapticFeedback {
        constructor() {
            this.isSupported = 'vibrate' in navigator;
            this.enabled = true;
        }

        vibrate(pattern) {
            if (!this.isSupported || !this.enabled) return;
            
            try {
                if (Array.isArray(pattern)) {
                    navigator.vibrate(pattern);
                } else {
                    navigator.vibrate(pattern);
                }
            } catch (e) {
                console.warn('فشل تفعيل الاهتزاز:', e);
            }
        }

        ballHit() {
            this.vibrate(50);
        }

        score() {
            this.vibrate([100, 50, 100]);
        }

        powerup() {
            this.vibrate([30, 30, 30, 30]);
        }

        levelUp() {
            this.vibrate([100, 30, 100, 30, 100]);
        }

        gameOver(win) {
            if (win) {
                this.vibrate([100, 50, 100, 50, 200]);
            } else {
                this.vibrate([200, 100, 200]);
            }
        }

        enable() {
            this.enabled = true;
        }

        disable() {
            this.enabled = false;
            this.vibrate(0); // إيقاف أي اهتزاز جاري
        }
    }

    // ==============================================
    // 5. نظام الصوت المحسن
    // ==============================================
    class AudioManager {
        constructor() {
            this.sounds = {};
            this.masterVolume = 0.7;
            this.enabled = true;
            this.initializeSounds();
        }

        initializeSounds() {
            const soundFiles = {
                hit: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
                score: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
                powerup: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
                levelUp: 'https://assets.mixkit.co/sfx/preview/mixkit-game-show-wrong-answer-buzz-950.mp3'
            };

            for (const [key, url] of Object.entries(soundFiles)) {
                const audio = new Audio();
                audio.src = url;
                audio.preload = 'auto';
                audio.volume = this.masterVolume;
                this.sounds[key] = audio;
            }
        }

        play(key, options = {}) {
            if (!this.enabled || !this.sounds[key]) return;

            const audio = this.sounds[key];
            
            // إعادة تعيين الصوت
            audio.currentTime = 0;
            audio.volume = options.volume || this.masterVolume;
            
            // معالجة الأخطاء
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('فشل تشغيل الصوت:', error);
                });
            }
        }

        playHit() {
            this.play('hit', { volume: 0.5 });
        }

        playScore() {
            this.play('score');
        }

        playPowerup() {
            this.play('powerup');
        }

        playLevelUp() {
            this.play('levelUp');
        }

        setVolume(volume) {
            this.masterVolume = Math.max(0, Math.min(1, volume));
            Object.values(this.sounds).forEach(audio => {
                audio.volume = this.masterVolume;
            });
        }

        enable() {
            this.enabled = true;
        }

        disable() {
            this.enabled = false;
        }
    }

    // ==============================================
    // 6. إدارة الذاكرة والأداء المحسنة
    // ==============================================
    class MemoryManager {
        constructor() {
            this.powerups = [];
            this.maxPowerups = 10;
            this.ballTrails = [];
            this.maxBallTrails = 50;
            this.cleanupInterval = null;
            this.memoryCheckInterval = null;
            this.lastCleanup = 0;
        }

        init() {
            // تنظيف الذاكرة كل 10 ثوان
            this.cleanupInterval = setInterval(() => {
                this.cleanup();
            }, 10000);
            
            // مراقبة استخدام الذاكرة كل 2 ثانية
            this.memoryCheckInterval = setInterval(() => {
                this.updateMemoryStats();
            }, 2000);
        }

        addPowerup(powerup) {
            if (this.powerups.length >= this.maxPowerups) {
                const removed = this.powerups.shift();
                if (removed && removed.onRemove) {
                    removed.onRemove();
                }
            }
            this.powerups.push(powerup);
        }

        addBallTrail(trail) {
            this.ballTrails.push(trail);
            if (this.ballTrails.length > this.maxBallTrails) {
                this.ballTrails.shift();
            }
        }

        cleanup() {
            const now = Date.now();
            
            // تنظيف القدرات المجمعة
            this.powerups = this.powerups.filter(p => !p.collected && !p.shouldRemove);
            
            // تنظيف آثار الكرات القديمة
            if (this.ballTrails.length > 30) {
                this.ballTrails = this.ballTrails.slice(-30);
            }
            
            this.lastCleanup = now;
        }

        updateMemoryStats() {
            const memoryUsage = document.getElementById('memoryUsage');
            const particleCount = document.getElementById('particleCount');
            
            if (memoryUsage) {
                // تقدير استخدام الذاكرة (تقدير مبسط)
                const particleCount = window.particlePool ? window.particlePool.getCount() : 0;
                const estimatedMemory = (
                    particleCount * 0.1 +
                    this.powerups.length * 0.5 +
                    this.ballTrails.length * 0.05
                ).toFixed(1);
                memoryUsage.textContent = `${estimatedMemory} MB`;
            }
            
            if (particleCount) {
                const count = window.particlePool ? window.particlePool.getCount() : 0;
                particleCount.textContent = count;
            }
        }

        clearAll() {
            this.powerups = [];
            this.ballTrails = [];
            if (window.particlePool) {
                window.particlePool.clear();
            }
        }

        destroy() {
            if (this.cleanupInterval) clearInterval(this.cleanupInterval);
            if (this.memoryCheckInterval) clearInterval(this.memoryCheckInterval);
            this.clearAll();
        }
    }

    // ==============================================
    // 7. تهيئة عناصر DOM
    // ==============================================
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // عناصر القائمة
    const mainMenu = document.getElementById('mainMenu');
    const levelsMenu = document.getElementById('levelsMenu');
    const instructionsMenu = document.getElementById('instructionsMenu');
    const gameScreen = document.getElementById('gameScreen');
    const challengesMenu = document.getElementById('challengesMenu');
    const storeMenu = document.getElementById('storeMenu');
    const statsMenu = document.getElementById('statsMenu');
    const gameContainer = document.getElementById('gameContainer');
    
    // أزرار القائمة
    const playBtn = document.getElementById('playBtn');
    const levelsBtn = document.getElementById('levelsBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const challengesBtn = document.getElementById('challengesBtn');
    const storeBtn = document.getElementById('storeBtn');
    const statsBtn = document.getElementById('statsBtn');
    const backFromLevelsBtn = document.getElementById('backFromLevelsBtn');
    const backFromInstructionsBtn = document.getElementById('backFromInstructionsBtn');
    const backFromChallengesBtn = document.getElementById('backFromChallengesBtn');
    const backFromStoreBtn = document.getElementById('backFromStoreBtn');
    const backFromStatsBtn = document.getElementById('backFromStatsBtn');
    
    // عناصر اللعبة
    const playerScoreElement = document.getElementById('playerScore');
    const computerScoreElement = document.getElementById('computerScore');
    const currentLevelElement = document.getElementById('currentLevel');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const menuBtn = document.getElementById('menuBtn');
    const pauseOverlay = document.getElementById('pauseOverlay');
    const resumeBtn = document.getElementById('resumeBtn');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameResult = document.getElementById('gameResult');
    const finalLevel = document.getElementById('finalLevel');
    const finalScore = document.getElementById('finalScore');
    const finalTime = document.getElementById('finalTime');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const levelStartOverlay = document.getElementById('levelStartOverlay');
    const levelNumber = document.getElementById('levelNumber');
    const levelDescription = document.getElementById('levelDescription');
    const countdown = document.getElementById('countdown');
    const gameTimeElement = document.getElementById('gameTime');
    const highScoreElement = document.getElementById('highScore');
    const highestLevelElement = document.getElementById('highestLevel');
    const gamesPlayedElement = document.getElementById('gamesPlayed');
    const winRateElement = document.getElementById('winRate');
    const playerLevelElement = document.getElementById('playerLevel');
    const playerCoinsElement = document.getElementById('playerCoins');
    const xpFillElement = document.getElementById('xpFill');
    const xpTextElement = document.getElementById('xpText');
    
    // القدرات
    const powerupSlow = document.getElementById('powerupSlow');
    const powerupBig = document.getElementById('powerupBig');
    const powerupFast = document.getElementById('powerupFast');
    const powerupMultiBall = document.getElementById('powerupMultiBall');
    
    // عناصر إضافية
    const mobileControls = document.getElementById('mobileControls');
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const pauseBtnMobile = document.getElementById('pauseBtnMobile');
    const powerupBtn = document.getElementById('powerupBtn');
    const claimAllBtn = document.getElementById('claimAllBtn');
    const paddleStoreGrid = document.getElementById('paddleStoreGrid');
    const storeCoinsElement = document.getElementById('storeCoins');
    const currentPaddleNameElement = document.getElementById('currentPaddleName');
    
    // إعدادات Canvas
    canvas.width = 800;
    canvas.height = 500;

    // ==============================================
    // 8. الأنظمة المساعدة
    // ==============================================
    const particlePool = new ParticlePool(300);
    const gameLoop = new GameLoop();
    const tiltEffect = new TiltEffect3D('gameContainer');
    const haptic = new HapticFeedback();
    const audio = new AudioManager();
    const memoryManager = new MemoryManager();
    
    // جعل الأنظمة متاحة عالمياً للتصحيح
    window.particlePool = particlePool;
    window.gameLoop = gameLoop;
    window.haptic = haptic;
    window.audio = audio;//will be add soon

    // ==============================================
    // 9. نظام التحديات اليومية
    // ==============================================
    class DailyChallenges {
        constructor() {
            this.challenges = [
                { 
                    id: 1, 
                    title: "سجل 10 نقاط متتالية", 
                    description: "احصل على 10 نقاط دون أن يسجل الخصم",
                    type: "streak", 
                    target: 10,
                    progress: 0,
                    completed: false,
                    reward: { coins: 50, xp: 100 },
                    icon: "🔥"
                },
                { 
                    id: 2, 
                    title: "استخدم 3 قدرات في مباراة واحدة", 
                    description: "تفعيل 3 قدرات مختلفة في مباراة واحدة",
                    type: "powerups", 
                    target: 3,
                    progress: 0,
                    completed: false,
                    reward: { coins: 30, xp: 75 },
                    icon: "⚡"
                },
                { 
                    id: 3, 
                    title: "اهزم الكمبيوتر بفارق 5 نقاط", 
                    description: "افوز على الكمبيوتر بفارق 5 نقاط على الأقل",
                    type: "winMargin", 
                    target: 5,
                    progress: 0,
                    completed: false,
                    reward: { coins: 75, xp: 150 },
                    icon: "👑"
                },
                { 
                    id: 4, 
                    title: "العب 5 مباريات", 
                    description: "أكمل 5 مباريات (الفوز أو الخسارة)",
                    type: "gamesPlayed", 
                    target: 5,
                    progress: 0,
                    completed: false,
                    reward: { coins: 25, xp: 50 },
                    icon: "🎮"
                },
                { 
                    id: 5, 
                    title: "احصل على كومبو 5x", 
                    description: "احصل على ضربات متتالية تصل إلى 5x",
                    type: "combo", 
                    target: 5,
                    progress: 0,
                    completed: false,
                    reward: { coins: 40, xp: 100 },
                    icon: "💥"
                }
            ];
            
            this.lastResetDate = this.getTodayDate();
            this.resetTimer = null;
            this.loadProgress();
            this.startResetTimer();
        }

        getTodayDate() {
            const today = new Date();
            return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        }

        getTimeUntilReset() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const diff = tomorrow - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            return {
                hours: hours.toString().padStart(2, '0'),
                minutes: minutes.toString().padStart(2, '0'),
                seconds: seconds.toString().padStart(2, '0')
            };
        }

        startResetTimer() {
            this.updateResetTimer();
            this.resetTimer = setInterval(() => {
                this.updateResetTimer();
                
                // التحقق من إذا كان اليوم قد تغير
                if (this.getTodayDate() !== this.lastResetDate) {
                    this.resetProgress();
                    this.lastResetDate = this.getTodayDate();
                }
            }, 1000);
        }

        updateResetTimer() {
            const resetTimeElement = document.getElementById('resetTime');
            if (resetTimeElement) {
                const time = this.getTimeUntilReset();
                resetTimeElement.textContent = `${time.hours}:${time.minutes}:${time.seconds}`;
            }
        }

        loadProgress() {
            const saved = localStorage.getItem('dailyChallenges');
            const savedDate = localStorage.getItem('challengesResetDate');
            
            if (saved && savedDate === this.getTodayDate()) {
                const parsed = JSON.parse(saved);
                this.challenges = this.challenges.map(challenge => {
                    const savedChallenge = parsed.find(c => c.id === challenge.id);
                    return savedChallenge ? { ...challenge, ...savedChallenge } : challenge;
                });
            } else {
                this.resetProgress();
            }
        }

        saveProgress() {
            localStorage.setItem('dailyChallenges', JSON.stringify(this.challenges));
            localStorage.setItem('challengesResetDate', this.getTodayDate());
        }

        resetProgress() {
            this.challenges.forEach(challenge => {
                challenge.progress = 0;
                challenge.completed = false;
            });
            this.saveProgress();
            this.updateUI();
            this.showNotification("تم تحديث التحديات اليومية! 🎉");
        }

        updateChallenge(type, amount = 1) {
            const challenge = this.challenges.find(c => c.type === type);
            if (challenge && !challenge.completed) {
                challenge.progress += amount;
                
                if (challenge.progress >= challenge.target) {
                    challenge.completed = true;
                    this.completeChallenge(challenge);
                }
                
                this.saveProgress();
                this.updateUI();
            }
        }

        completeChallenge(challenge) {
            console.log(`🎉 أكملت التحدي: ${challenge.title}`);
            
            // تحديث إحصائيات اللاعب
            gameState.coins += challenge.reward.coins;
            gameState.xp += challenge.reward.xp;
            
            // حفظ العملات والخبرة
            savePlayerData();
            
            // تشغيل الصوت
            audio.playScore();
            
            // تفعيل الاهتزاز
            haptic.powerup();
            
            // عرض إشعار
            this.showNotification(
                `أكملت التحدي "${challenge.title}"! +${challenge.reward.coins} عملات`
            );
            
            // تحديث مستوى اللاعب
            checkLevelUp();
            
            // تحديث الواجهة
            this.updateUI();
            updatePlayerInfo();
        }

        showNotification(message) {
            // إنشاء عنصر الإشعار
            const notification = document.createElement('div');
            notification.className = 'challenge-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-trophy"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // إظهار الإشعار
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // إخفاء الإشعار بعد 3 ثوان
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        updateUI() {
            // تحديث واجهة التحديات
            const challengesElement = document.getElementById('dailyChallengesList');
            if (challengesElement) {
                challengesElement.innerHTML = this.challenges.map(challenge => `
                    <div class="challenge-item ${challenge.completed ? 'completed' : ''}">
                        <div class="challenge-icon">${challenge.icon}</div>
                        <div class="challenge-info">
                            <h4>${challenge.title}</h4>
                            <p>${challenge.description}</p>
                            <div class="challenge-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${Math.min(100, (challenge.progress / challenge.target) * 100)}%"></div>
                                </div>
                                <span>${challenge.progress}/${challenge.target}</span>
                            </div>
                        </div>
                        <div class="challenge-reward">
                            <span class="coins">${challenge.reward.coins} <i class="fas fa-coins"></i></span>
                            <span class="xp">${challenge.reward.xp} XP</span>
                        </div>
                    </div>
                `).join('');
            }
            
            // تحديث الإحصائيات
            const completedCount = this.getCompletedCount();
            const totalRewards = this.getTotalRewards();
            const completionRate = Math.round((completedCount / this.challenges.length) * 100);
            
            const completedChallengesElement = document.getElementById('completedChallenges');
            const totalCoinsElement = document.getElementById('totalCoins');
            const totalXPElement = document.getElementById('totalXP');
            const completionRateElement = document.getElementById('completionRate');
            
            if (completedChallengesElement) {
                completedChallengesElement.textContent = `${completedCount}/${this.challenges.length}`;
            }
            if (totalCoinsElement) {
                totalCoinsElement.textContent = totalRewards.coins;
            }
            if (totalXPElement) {
                totalXPElement.textContent = totalRewards.xp;
            }
            if (completionRateElement) {
                completionRateElement.textContent = `${completionRate}%`;
            }
        }

        getCompletedCount() {
            return this.challenges.filter(c => c.completed).length;
        }

        getTotalRewards() {
            return this.challenges
                .filter(c => c.completed)
                .reduce((total, challenge) => ({
                    coins: total.coins + challenge.reward.coins,
                    xp: total.xp + challenge.reward.xp
                }), { coins: 0, xp: 0 });
        }

        claimAllRewards() {
            const unclaimedChallenges = this.challenges.filter(c => c.completed);
            let totalCoins = 0;
            let totalXP = 0;
            
            unclaimedChallenges.forEach(challenge => {
                totalCoins += challenge.reward.coins;
                totalXP += challenge.reward.xp;
            });
            
            if (totalCoins > 0) {
                gameState.coins += totalCoins;
                gameState.xp += totalXP;
                savePlayerData();
                
                // تشغيل الصوت
                audio.playPowerup();
                
                // تفعيل الاهتزاز
                haptic.powerup();
                
                this.showNotification(
                    `استلمت جميع المكافآت! +${totalCoins} عملات و +${totalXP} خبرة`
                );
                
                updatePlayerInfo();
                checkLevelUp();
            } else {
                this.showNotification("لا توجد مكافآت للاستلام حالياً");
            }
        }

        destroy() {
            if (this.resetTimer) {
                clearInterval(this.resetTimer);
            }
        }
    }

    const dailyChallenges = new DailyChallenges();

    // ==============================================
    // 10. مستويات اللاعب والخبرة
    // ==============================================
    const playerLevels = [
        { level: 1, xpNeeded: 0, rewards: ["مضرب كلاسيكي"] },
        { level: 2, xpNeeded: 100, rewards: ["قدرة سريعة"] },
        { level: 3, xpNeeded: 300, rewards: ["مضرب نيون"] },
        { level: 4, xpNeeded: 600, rewards: ["قدرة قوية"] },
        { level: 5, xpNeeded: 1000, rewards: ["مضرب ناري", "لقب المحترف"] },
        { level: 6, xpNeeded: 1500, rewards: ["قدرة متعددة"] },
        { level: 7, xpNeeded: 2100, rewards: ["مضرب ذهبي"] },
        { level: 8, xpNeeded: 2800, rewards: ["قدرة فريدة"] },
        { level: 9, xpNeeded: 3600, rewards: ["مضرب أسطوري"] },
        { level: 10, xpNeeded: 4500, rewards: ["كل القدرات", "لقب الأسطورة"] }
    ];

    // ==============================================
    // 11. متجر المضارب
    // ==============================================
    const paddleSkins = [
        { 
            id: 1, 
            name: "كلاسيكي", 
            price: 0, 
            color: "#3AB0FF", 
            effect: "لا يوجد",
            unlocked: true,
            selected: true 
        },
        { 
            id: 2, 
            name: "ناري", 
            price: 100, 
            color: "#FF1E00", 
            effect: "جسيمات نار عند الاصطدام",
            unlocked: false,
            selected: false 
        },
        { 
            id: 3, 
            name: "نيون", 
            price: 200, 
            color: "#00FF9D", 
            effect: "توهج أثناء الحركة",
            unlocked: false,
            selected: false 
        },
        { 
            id: 4, 
            name: "ذهبي", 
            price: 300, 
            color: "#FFB740", 
            effect: "عملات إضافية عند الفوز",
            unlocked: false,
            selected: false 
        },
        { 
            id: 5, 
            name: "أرجواني", 
            price: 150, 
            color: "#9D4EDD", 
            effect: "مضرب أسرع بنسبة 10%",
            unlocked: false,
            selected: false 
        },
        { 
            id: 6, 
            name: "فضي", 
            price: 250, 
            color: "#C0C0C0", 
            effect: "مضرب أطول بنسبة 20%",
            unlocked: false,
            selected: false 
        },
        { 
            id: 7, 
            name: "قوس قزح", 
            price: 500, 
            color: "linear-gradient(90deg, #FF1E00, #FFB740, #59CE8F, #3AB0FF, #9D4EDD)", 
            effect: "ألوان متغيرة + جميع المزايا",
            unlocked: false,
            selected: false 
        }
    ];

    // ==============================================
    // 12. مستويات اللعبة
    // ==============================================
    const levels = [
        { 
            speed: 4.5, 
            computerSpeed: 3.5, 
            name: "مبتدئ", 
            color: "#3AB0FF",
            description: "سرعة بطيئة - خصم سهل",
            accuracy: 0.6,
            personality: "defensive"
        },
        { 
            speed: 5.5, 
            computerSpeed: 4.5, 
            name: "متوسط", 
            color: "#59CE8F",
            description: "سرعة متوسطة - خصم متوسط",
            accuracy: 0.7,
            personality: "balanced"
        },
        { 
            speed: 6.5, 
            computerSpeed: 5.5, 
            name: "متقدم", 
            color: "#FFB740",
            description: "سرعة عالية - خصم صعب",
            accuracy: 0.8,
            personality: "aggressive"
        },
        { 
            speed: 7.5, 
            computerSpeed: 6.5, 
            name: "محترف", 
            color: "#FF1E00",
            description: "سرعة عالية جداً - خصم ذكي",
            accuracy: 0.9,
            personality: "tricky"
        },
        { 
            speed: 8.5, 
            computerSpeed: 7.5, 
            name: "بطل", 
            color: "#FFB740",
            description: "سرعة فائقة - خصم لا يُهزم",
            accuracy: 1.0,
            personality: "master"
        }
    ];

    // شخصيات الكمبيوتر
    const computerPersonalities = {
        defensive: {
            name: "دفاعي",
            reactionSpeed: 0.06,
            attackChance: 0.1,
            errorRange: 50,
            description: "يركز على الدفاع وينتظر الفرص"
        },
        balanced: {
            name: "متوازن",
            reactionSpeed: 0.08,
            attackChance: 0.3,
            errorRange: 30,
            description: "متوازن بين الهجوم والدفاع"
        },
        aggressive: {
            name: "مهاجم",
            reactionSpeed: 0.1,
            attackChance: 0.6,
            errorRange: 20,
            description: "يهاجم باستمرار ويضغط على الخصم"
        },
        tricky: {
            name: "مخادع",
            reactionSpeed: 0.09,
            attackChance: 0.4,
            errorRange: 40,
            description: "يستخدم حيلاً غير متوقعة"
        },
        master: {
            name: "سيد",
            reactionSpeed: 0.12,
            attackChance: 0.8,
            errorRange: 10,
            description: "لا يرتكب أخطاء تقريباً"
        }
    };

    // ==============================================
    // 13. متغيرات اللعبة
    // ==============================================
    let gameState = {
        playerScore: 0,
        computerScore: 0,
        currentLevel: 1,
        isPaused: false,
        isGameOver: false,
        gameTime: 0,
        speedMultiplier: 1.0,
        powerups: {
            slow: { 
                active: false, 
                timeLeft: 0, 
                originalSpeed: 0,
                cooldown: 0,
                maxCooldown: 20
            },
            big: { 
                active: false, 
                timeLeft: 0, 
                originalHeight: 0,
                cooldown: 0,
                maxCooldown: 15
            },
            fast: { 
                active: false, 
                timeLeft: 0, 
                originalSpeed: 0,
                cooldown: 0,
                maxCooldown: 15
            },
            multiBall: {
                active: false,
                timeLeft: 0,
                cooldown: 0,
                maxCooldown: 25,
                balls: []
            }
        },
        highScore: 0,
        highestLevel: 1,
        selectedLevel: 1,
        usingMouse: true,
        lastSpeedIncrease: 0,
        combo: 0,
        lastHitTime: 0,
        coins: 0,
        xp: 0,
        level: 1,
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        totalTime: 0,
        bestCombo: 0,
        powerupsUsed: 0,
        totalHits: 0,
        successfulHits: 0,
        fastestReaction: Infinity,
        heatmapPoints: []
    };
    
    // ==============================================
    // 14. تهيئة الكائنات
    // ==============================================
    let balls = [
        {
            id: 1,
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 3,
            color: '#ffffff',
            active: true,
            trail: [],
            glowRadius: 15,
            glowColor: 'rgba(255, 255, 255, 0.3)'
        }
    ];

    let playerPaddle = {
        x: 20,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        speed: 8,
        color: '#3AB0FF',
        originalHeight: 100,
        originalSpeed: 8,
        targetY: canvas.height / 2 - 50,
        smoothFactor: 0.15, // تم تحسين عامل التنعيم
        selectedSkin: 1,
        glow: false,
        glowColor: 'rgba(58, 176, 255, 0.3)'
    };
    
    let computerPaddle = {
        x: canvas.width - 30,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        speed: 5,
        color: '#FF1E00',
        originalSpeed: 5,
        reactionSpeed: 0.08,
        targetY: canvas.height / 2 - 50,
        difficulty: 0.6,
        personality: computerPersonalities.defensive,
        attackMode: false,
        attackCooldown: 0,
        lastShotPosition: canvas.height / 2
    };

    let keysPressed = {};
    let gameTimerInterval = null;
    let mouseY = canvas.height / 2;
    let currentLevelData = levels[0];

    // ==============================================
    // 15. وظائف المساعدة
    // ==============================================
    
    function createParticles(x, y, count, color, type = 'circle') {
        for (let i = 0; i < count; i++) {
            particlePool.createParticle(
                x,
                y,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                Math.random() * 4 + 2,
                color,
                type,
                1.0,
                0.02 + Math.random() * 0.03
            );
        }
    }
    
    function createBallGlow(ball) {
        // إضافة إضاءة للكرة
        particlePool.createParticle(
            ball.x,
            ball.y,
            0,
            0,
            ball.glowRadius,
            ball.glowColor,
            'circle',
            0.3,
            0.05
        );
    }
    
    function spawnRandomPowerup() {
        if (Math.random() < 0.001) {
            const x = Math.random() * (canvas.width - 100) + 50;
            const y = Math.random() * (canvas.height - 100) + 50;
            const types = ['slow', 'big', 'fast', 'multiBall'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            const powerup = {
                x: x,
                y: y,
                radius: 15,
                type: type,
                color: getPowerupColor(type),
                rotation: 0,
                collected: false,
                pulse: 0,
                pulseSpeed: 0.05,
                life: 1.0,
                shouldRemove: false
            };
            
            memoryManager.addPowerup(powerup);
        }
    }
    
    function getPowerupColor(type) {
        switch(type) {
            case 'slow': return '#3AB0FF';
            case 'big': return '#59CE8F';
            case 'fast': return '#FF1E00';
            case 'multiBall': return '#FFB740';
            default: return '#ffffff';
        }
    }
    
    function getPowerupIcon(type) {
        switch(type) {
            case 'slow': return '⏱️';
            case 'big': return '📏';
            case 'fast': return '⚡';
            case 'multiBall': return '🎾';
            default: return '✨';
        }
    }
    
    function collectPowerup(powerup) {
        if (powerup.collected) return;
        
        powerup.collected = true;
        powerup.shouldRemove = true;
        createParticles(powerup.x, powerup.y, 25, powerup.color, 'star');
        
        // تشغيل الصوت
        audio.playPowerup();
        
        // تفعيل الاهتزاز
        haptic.powerup();
        
        // تفعيل القدرة إذا كانت متاحة
        if (canActivatePowerup(powerup.type)) {
            activatePowerup(powerup.type);
        }
    }
    
    function savePlayerData() {
        const data = {
            coins: gameState.coins,
            xp: gameState.xp,
            level: gameState.level,
            highScore: gameState.highScore,
            highestLevel: gameState.highestLevel,
            gamesPlayed: gameState.gamesPlayed,
            gamesWon: gameState.gamesWon,
            totalScore: gameState.totalScore,
            totalTime: gameState.totalTime,
            bestCombo: gameState.bestCombo,
            powerupsUsed: gameState.powerupsUsed,
            totalHits: gameState.totalHits,
            successfulHits: gameState.successfulHits,
            fastestReaction: gameState.fastestReaction,
            selectedPaddle: playerPaddle.selectedSkin,
            unlockedPaddles: paddleSkins.map(p => p.unlocked),
            heatmapPoints: gameState.heatmapPoints
        };
        
        localStorage.setItem('pongPlayerData', JSON.stringify(data));
        localStorage.setItem('pongPaddleSkins', JSON.stringify(paddleSkins));
    }
    
    function loadPlayerData() {
        const savedData = localStorage.getItem('pongPlayerData');
        const savedSkins = localStorage.getItem('pongPaddleSkins');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(gameState, data);
            
            // تحديث المضرب المختار
            const selectedSkin = paddleSkins.find(p => p.id === data.selectedPaddle);
            if (selectedSkin) {
                playerPaddle.selectedSkin = data.selectedPaddle;
                playerPaddle.color = typeof selectedSkin.color === 'string' ? 
                    selectedSkin.color : '#3AB0FF';
            }
            
            // تحديث المضارب المفتوحة
            if (savedSkins) {
                const unlockedSkins = JSON.parse(savedSkins);
                unlockedSkins.forEach((skin, index) => {
                    if (paddleSkins[index]) {
                        paddleSkins[index].unlocked = skin.unlocked;
                        paddleSkins[index].selected = skin.selected;
                    }
                });
            }
        }
        
        updatePlayerInfo();
        updateStatsUI();
    }
    
    function updatePlayerInfo() {
        if (playerLevelElement) {
            playerLevelElement.textContent = gameState.level;
        }
        
        if (playerCoinsElement) {
            playerCoinsElement.textContent = gameState.coins;
        }
        
        if (storeCoinsElement) {
            storeCoinsElement.textContent = gameState.coins;
        }
        
        if (currentPaddleNameElement) {
            const selectedSkin = paddleSkins.find(p => p.id === playerPaddle.selectedSkin);
            currentPaddleNameElement.textContent = selectedSkin ? selectedSkin.name : "كلاسيكي";
        }
        
        // تحديث شريط الخبرة
        const currentLevelData = playerLevels.find(l => l.level === gameState.level);
        const nextLevelData = playerLevels.find(l => l.level === gameState.level + 1);
        
        if (currentLevelData && nextLevelData && xpFillElement && xpTextElement) {
            const xpInCurrentLevel = gameState.xp - currentLevelData.xpNeeded;
            const xpNeededForNext = nextLevelData.xpNeeded - currentLevelData.xpNeeded;
            const percentage = Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100);
            
            xpFillElement.style.width = `${percentage}%`;
            xpTextElement.textContent = `${xpInCurrentLevel}/${xpNeededForNext} XP`;
        }
        
        // تحديث الإحصائيات في القائمة الرئيسية
        if (highScoreElement) {
            highScoreElement.textContent = gameState.highScore;
        }
        
        if (highestLevelElement) {
            highestLevelElement.textContent = gameState.highestLevel;
        }
        
        if (gamesPlayedElement) {
            gamesPlayedElement.textContent = gameState.gamesPlayed;
        }
        
        if (winRateElement) {
            const winRate = gameState.gamesPlayed > 0 ? 
                Math.round((gameState.gamesWon / gameState.gamesPlayed) * 100) : 0;
            winRateElement.textContent = `${winRate}%`;
        }
    }
    
    function checkLevelUp() {
        const nextLevelData = playerLevels.find(l => l.level === gameState.level + 1);
        
        if (nextLevelData && gameState.xp >= nextLevelData.xpNeeded) {
            gameState.level++;
            
            // تشغيل الصوت
            audio.playLevelUp();
            
            // تفعيل الاهتزاز
            haptic.levelUp();
            
            // مكافآت المستوى
            const rewards = nextLevelData.rewards;
            dailyChallenges.showNotification(
                `🎉 وصلت للمستوى ${gameState.level}! المكافآت: ${rewards.join(', ')}`
            );
            
            // إذا كان المستوى 5 أو 10، فتح مضارب جديدة
            if (gameState.level === 5) {
                unlockPaddle(2); // فتح المضرب الناري
            } else if (gameState.level === 10) {
                unlockPaddle(7); // فتح مضرب قوس قزح
            }
            
            updatePlayerInfo();
        }
    }
    
    function unlockPaddle(paddleId) {
        const paddle = paddleSkins.find(p => p.id === paddleId);
        if (paddle && !paddle.unlocked) {
            paddle.unlocked = true;
            savePlayerData();
            updateStoreUI();
            dailyChallenges.showNotification(`🔓 فتحت مضرب ${paddle.name} الجديد!`);
        }
    }

    // ==============================================
    // 16. نظام القدرات
    // ==============================================
    function canActivatePowerup(powerupName) {
        const powerup = gameState.powerups[powerupName];
        return !powerup.active && powerup.cooldown <= 0;
    }

    function activatePowerup(powerupName) {
        if (!gameState.powerups[powerupName]) return;
        if (!canActivatePowerup(powerupName)) return;
        
        const powerup = gameState.powerups[powerupName];
        powerup.active = true;
        powerup.timeLeft = powerupName === 'multiBall' ? 15 : 10;
        
        const powerupElement = document.getElementById(`powerup${powerupName.charAt(0).toUpperCase() + powerupName.slice(1)}`);
        if (powerupElement) {
            powerupElement.classList.add('active');
            powerupElement.classList.remove('cooldown');
            const timerElement = powerupElement.querySelector('.powerup-timer');
            if (timerElement) {
                timerElement.classList.remove('hidden');
                timerElement.textContent = powerup.timeLeft;
            }
        }
        
        // تحديث الإحصائيات
        gameState.powerupsUsed++;
        
        // تحديث التحديات
        dailyChallenges.updateChallenge('powerups');
        
        // تشغيل الصوت
        audio.playPowerup();
        
        // تفعيل الاهتزاز
        haptic.powerup();
        
        // تأثيرات مرئية عند التفعيل
        createParticles(canvas.width / 2, canvas.height / 2, 30, getPowerupColor(powerupName), 'star');
        
        // تطبيق تأثيرات القدرات
        switch(powerupName) {
            case 'slow':
                powerup.originalSpeed = computerPaddle.speed;
                computerPaddle.speed *= 0.4;
                computerPaddle.reactionSpeed = 0.03;
                balls.forEach(ball => {
                    ball.speedX *= 0.5;
                    ball.speedY *= 0.5;
                });
                break;
            case 'big':
                powerup.originalHeight = playerPaddle.height;
                playerPaddle.height *= 2.0;
                playerPaddle.glow = true;
                playerPaddle.glowColor = 'rgba(89, 206, 143, 0.5)';
                break;
            case 'fast':
                powerup.originalSpeed = playerPaddle.speed;
                playerPaddle.speed *= 2.0;
                playerPaddle.glow = true;
                playerPaddle.glowColor = 'rgba(255, 30, 0, 0.5)';
                balls.forEach(ball => {
                    ball.speedX *= 1.5;
                    ball.speedY *= 1.5;
                });
                break;
            case 'multiBall':
                // إضافة كرتين إضافيتين
                addExtraBall();
                addExtraBall();
                break;
        }
    }

    function updatePowerups(deltaTime) {
        const normalDelta = deltaTime / 16.67;
        
        Object.keys(gameState.powerups).forEach(powerupName => {
            const powerup = gameState.powerups[powerupName];
            
            // تحديث التبريد
            if (powerup.cooldown > 0) {
                powerup.cooldown -= normalDelta;
                const powerupElement = document.getElementById(`powerup${powerupName.charAt(0).toUpperCase() + powerupName.slice(1)}`);
                if (powerupElement && !powerup.active) {
                    powerupElement.classList.add('cooldown');
                    const timerElement = powerupElement.querySelector('.powerup-timer');
                    if (timerElement) {
                        timerElement.textContent = Math.ceil(powerup.cooldown / 60);
                    }
                }
            }
            
            // تحديث القدرات النشطة
            if (powerup.active) {
                powerup.timeLeft -= normalDelta;
                
                const powerupElement = document.getElementById(`powerup${powerupName.charAt(0).toUpperCase() + powerupName.slice(1)}`);
                if (powerupElement) {
                    const timerElement = powerupElement.querySelector('.powerup-timer');
                    if (timerElement) {
                        timerElement.textContent = Math.ceil(powerup.timeLeft);
                    }
                }
                
                if (powerup.timeLeft <= 0) {
                    deactivatePowerup(powerupName);
                }
            }
        });
    }

    function deactivatePowerup(powerupName) {
        if (!gameState.powerups[powerupName]) return;
        
        const powerup = gameState.powerups[powerupName];
        powerup.active = false;
        powerup.cooldown = powerup.maxCooldown * 60;
        
        const powerupElement = document.getElementById(`powerup${powerupName.charAt(0).toUpperCase() + powerupName.slice(1)}`);
        if (powerupElement) {
            powerupElement.classList.remove('active');
            const timerElement = powerupElement.querySelector('.powerup-timer');
            if (timerElement) {
                timerElement.textContent = Math.ceil(powerup.cooldown / 60);
            }
        }
        
        // إلغاء تأثيرات القدرات
        switch(powerupName) {
            case 'slow':
                if (powerup.originalSpeed) {
                    computerPaddle.speed = currentLevelData.computerSpeed * gameState.speedMultiplier;
                }
                computerPaddle.reactionSpeed = computerPaddle.personality.reactionSpeed;
                balls.forEach(ball => {
                    ball.speedX = Math.sign(ball.speedX) * Math.abs(ball.speedX) * 2;
                    ball.speedY = Math.sign(ball.speedY) * Math.abs(ball.speedY) * 2;
                });
                break;
            case 'big':
                if (powerup.originalHeight) {
                    playerPaddle.height = powerup.originalHeight;
                }
                playerPaddle.glow = false;
                break;
            case 'fast':
                if (powerup.originalSpeed) {
                    playerPaddle.speed = 8;
                }
                playerPaddle.glow = false;
                balls.forEach(ball => {
                    ball.speedX = Math.sign(ball.speedX) * Math.abs(ball.speedX) / 1.5;
                    ball.speedY = Math.sign(ball.speedY) * Math.abs(ball.speedY) / 1.5;
                });
                break;
            case 'multiBall':
                // إزالة الكرات الإضافية
                balls = balls.filter(ball => ball.id <= 1);
                break;
        }
    }

    // ==============================================
    // 17. وظائف اللعبة الأساسية
    // ==============================================
    
    function addExtraBall() {
        const newBallId = balls.length + 1;
        const newBall = {
            id: newBallId,
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            speedX: (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 2) * gameState.speedMultiplier,
            speedY: (Math.random() * 4 - 2) * gameState.speedMultiplier,
            color: getRandomColor(),
            active: true,
            trail: [],
            glowRadius: 15,
            glowColor: 'rgba(255, 255, 255, 0.3)'
        };
        balls.push(newBall);
        createParticles(canvas.width / 2, canvas.height / 2, 20, '#FFB740', 'circle');
    }
    
    function getRandomColor() {
        const colors = ['#FF1E00', '#3AB0FF', '#59CE8F', '#FFB740', '#9D4EDD'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function resetBall(ball) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = (Math.random() > 0.5 ? 1 : -1) * currentLevelData.speed * gameState.speedMultiplier;
        ball.speedY = (Math.random() * 4 - 2) * gameState.speedMultiplier;
        ball.color = '#ffffff';
        ball.trail = [];
        ball.glowColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    function updateLevel() {
        // زيادة مستوى اللاعب بناءً على النقاط
        let newLevel = 1;
        if (gameState.playerScore >= 20) newLevel = 5;
        else if (gameState.playerScore >= 15) newLevel = 4;
        else if (gameState.playerScore >= 10) newLevel = 3;
        else if (gameState.playerScore >= 5) newLevel = 2;
        
        if (newLevel > gameState.currentLevel) {
            gameState.currentLevel = newLevel;
            levelUp();
        }
        
        // تحديث بيانات المستوى الحالي
        currentLevelData = levels[gameState.currentLevel - 1] || levels[0];
        
        // تحديث صعوبة الكمبيوتر
        computerPaddle.difficulty = currentLevelData.accuracy;
        computerPaddle.speed = currentLevelData.computerSpeed * gameState.speedMultiplier;
        computerPaddle.personality = computerPersonalities[currentLevelData.personality];
        
        // تحديث الواجهة
        if (currentLevelElement) {
            currentLevelElement.textContent = gameState.currentLevel;
            currentLevelElement.style.color = currentLevelData.color;
        }
        
        // تحديث شخصية الكمبيوتر في الواجهة
        const computerPersonalityElement = document.getElementById('computerPersonality');
        if (computerPersonalityElement) {
            computerPersonalityElement.textContent = computerPaddle.personality.name;
        }
    }
    
    function levelUp() {
        createParticles(canvas.width / 2, canvas.height / 2, 50, currentLevelData.color, 'star');
        showLevelStart(gameState.currentLevel);
        updateHighScores();
        
        // تشغيل الصوت
        audio.playLevelUp();
        
        // تفعيل الاهتزاز
        haptic.levelUp();
        
        // زيادة صعوبة اللعبة
        gameState.speedMultiplier += 0.1;
        
        // زيادة عدد الكرات في وضع multi-ball
        if (gameState.powerups.multiBall.active) {
            addExtraBall();
        }
    }
    
    function increaseSpeedOverTime(deltaTime) {
        const normalDelta = deltaTime / 16.67;
        const currentTime = Date.now();
        if (currentTime - gameState.lastSpeedIncrease > 6000) {
            gameState.speedMultiplier += 0.05;
            gameState.lastSpeedIncrease = currentTime;
            
            // تحديث سرعة جميع الكرات
            balls.forEach(ball => {
                ball.speedX = Math.sign(ball.speedX) * Math.abs(ball.speedX) * gameState.speedMultiplier;
                ball.speedY = Math.sign(ball.speedY) * Math.abs(ball.speedY) * gameState.speedMultiplier;
            });
            
            // تحديث سرعة الكمبيوتر
            computerPaddle.speed = currentLevelData.computerSpeed * gameState.speedMultiplier;
            
            // تحديث الواجهة
            const speedMultiplierElement = document.getElementById('speedMultiplier');
            const speedIndicatorElement = document.getElementById('speedIndicator');
            if (speedMultiplierElement) {
                speedMultiplierElement.textContent = `×${gameState.speedMultiplier.toFixed(2)}`;
            }
            if (speedIndicatorElement) {
                speedIndicatorElement.querySelector('span').textContent = gameState.speedMultiplier.toFixed(2);
            }
        }
    }
    
    function updateComputerAI(deltaTime) {
        const normalDelta = deltaTime / 16.67;
        
        // اختيار الكرة الأقرب
        let targetBall = balls[0];
        let minDistance = Infinity;
        
        balls.forEach(ball => {
            if (ball.active) {
                const distance = Math.abs(ball.x - computerPaddle.x);
                if (distance < minDistance && ball.speedX > 0) {
                    minDistance = distance;
                    targetBall = ball;
                }
            }
        });
        
        if (!targetBall || targetBall.speedX < 0) {
            computerPaddle.targetY = canvas.height / 2 - computerPaddle.height / 2;
        } else {
            // حساب وقت وصول الكرة
            const timeToReach = (computerPaddle.x - targetBall.x) / targetBall.speedX;
            
            // توقع موقع الكرة المستقبلي
            let predictedY = targetBall.y + targetBall.speedY * timeToReach;
            
            // جعل الكمبيوتر يخطأ قليلاً بناءً على الصعوبة
            const errorRange = computerPaddle.personality.errorRange * (1 - computerPaddle.difficulty);
            predictedY += (Math.random() * errorRange - errorRange / 2);
            
            // جعل الكمبيوتر يسدد في أماكن مختلفة
            if (computerPaddle.attackCooldown <= 0 && Math.random() < computerPaddle.personality.attackChance) {
                computerPaddle.attackMode = true;
                computerPaddle.attackCooldown = 120;
                computerPaddle.lastShotPosition = predictedY;
            }
            
            if (computerPaddle.attackMode) {
                const attackPoints = [
                    playerPaddle.y + 10,
                    playerPaddle.y + playerPaddle.height - 10,
                    playerPaddle.y + playerPaddle.height / 2
                ];
                
                const targetPoint = attackPoints[Math.floor(Math.random() * attackPoints.length)];
                computerPaddle.targetY = targetPoint - computerPaddle.height / 2;
                
                if (Math.abs(computerPaddle.y - computerPaddle.targetY) < 5) {
                    computerPaddle.attackMode = false;
                }
            } else {
                computerPaddle.targetY = predictedY - computerPaddle.height / 2;
            }
            
            computerPaddle.attackCooldown -= normalDelta;
        }
        
        // حركة سلسة نحو الهدف
        const dy = computerPaddle.targetY - computerPaddle.y;
        computerPaddle.y += dy * computerPaddle.reactionSpeed * gameState.speedMultiplier * normalDelta;
    }
    
    function checkBallCollision(ball) {
        // اصطدام مع الجدران العلوية والسفلية
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.speedY = -Math.abs(ball.speedY) * 0.95;
            createParticles(ball.x, canvas.height, 8, ball.color, 'circle');
            
            // تشغيل الصوت
            audio.playHit();
            
            // تفعيل الاهتزاز
            haptic.ballHit();
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.speedY = Math.abs(ball.speedY) * 0.95;
            createParticles(ball.x, 0, 8, ball.color, 'circle');
            
            // تشغيل الصوت
            audio.playHit();
            
            // تفعيل الاهتزاز
            haptic.ballHit();
        }
        
        // اصطدام مع مضرب اللاعب
        if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
            ball.x + ball.radius > playerPaddle.x &&
            ball.y > playerPaddle.y &&
            ball.y < playerPaddle.y + playerPaddle.height) {
            
            // حساب نقطة الاصطدام
            const hitPoint = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
            
            // تغيير الاتجاه
            ball.speedX = Math.abs(ball.speedX);
            
            // تأثير الانعكاس بناءً على نقطة الاصطدام
            ball.speedY = hitPoint * 8 * gameState.speedMultiplier;
            
            // زيادة السرعة قليلاً
            ball.speedX *= 1.05;
            
            // إضافة أثر
            memoryManager.addBallTrail({x: ball.x, y: ball.y});
            
            // حفظ النقطة في الخريطة الحرارية
            gameState.heatmapPoints.push({
                x: ball.x,
                y: ball.y,
                intensity: 1
            });
            
            // جسيمات الاصطدام
            createParticles(ball.x, ball.y, 12, playerPaddle.color, 'circle');
            
            // تشغيل الصوت
            audio.playHit();
            
            // تفعيل الاهتزاز
            haptic.ballHit();
            
            // تحديث الإحصائيات
            gameState.totalHits++;
            gameState.successfulHits++;
            
            // زيادة الكومبو
            gameState.combo++;
            gameState.lastHitTime = Date.now();
            if (gameState.combo > gameState.bestCombo) {
                gameState.bestCombo = gameState.combo;
            }
            
            // تحديث التحديات
            dailyChallenges.updateChallenge('streak', 1);
            if (gameState.combo >= 5) {
                dailyChallenges.updateChallenge('combo', 1);
            }
            
            // منع الالتصاق
            ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
            
            return true;
        }
        
        // اصطدام مع مضرب الكمبيوتر
        if (ball.x + ball.radius > computerPaddle.x &&
            ball.x - ball.radius < computerPaddle.x + computerPaddle.width &&
            ball.y > computerPaddle.y &&
            ball.y < computerPaddle.y + computerPaddle.height) {
            
            // حساب نقطة الاصطدام
            const hitPoint = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
            
            // تغيير الاتجاه
            ball.speedX = -Math.abs(ball.speedX);
            
            // تأثير الانعكاس
            ball.speedY = hitPoint * 8 * gameState.speedMultiplier;
            
            // إضافة أثر
            memoryManager.addBallTrail({x: ball.x, y: ball.y});
            
            // جسيمات الاصطدام
            createParticles(ball.x, ball.y, 12, computerPaddle.color, 'circle');
            
            // تشغيل الصوت
            audio.playHit();
            
            // تفعيل الاهتزاز
            haptic.ballHit();
            
            // منع الالتصاق
            ball.x = computerPaddle.x - ball.radius;
            
            return true;
        }
        
        return false;
    }
    
    function updateGame(deltaTime) {
        if (gameState.isPaused || gameState.isGameOver) return;
        
        const normalDelta = deltaTime / 16.67;
        
        // زيادة السرعة مع الوقت
        increaseSpeedOverTime(deltaTime);
        
        // تحديث موقع الكرات
        balls.forEach(ball => {
            if (!ball.active) return;
            
            ball.x += ball.speedX * normalDelta;
            ball.y += ball.speedY * normalDelta;
            
            // تحديث إضاءة الكرة
            createBallGlow(ball);
            
            // تغيير لون الكرة بناءً على السرعة
            const speed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
            if (speed > 12) {
                ball.color = '#FF1E00';
                ball.glowColor = 'rgba(255, 30, 0, 0.5)';
                ball.glowRadius = 20;
            } else if (speed > 8) {
                ball.color = '#FFB740';
                ball.glowColor = 'rgba(255, 183, 64, 0.4)';
                ball.glowRadius = 18;
            } else if (speed > 5) {
                ball.color = '#59CE8F';
                ball.glowColor = 'rgba(89, 206, 143, 0.4)';
                ball.glowRadius = 16;
            } else {
                ball.color = '#3AB0FF';
                ball.glowColor = 'rgba(58, 176, 255, 0.3)';
                ball.glowRadius = 15;
            }
            
            // التحقق من الاصطدامات
            checkBallCollision(ball);
            
            // تسجيل النقاط
            if (ball.x - ball.radius < 0) {
                gameState.computerScore++;
                updateScores();
                gameState.combo = 0;
                resetBall(ball);
                createParticles(0, ball.y, 25, '#FF1E00', 'explosion');
                
                // تشغيل الصوت
                audio.playScore();
                
                // تفعيل الاهتزاز
                haptic.score();
            } else if (ball.x + ball.radius > canvas.width) {
                gameState.playerScore++;
                updateScores();
                updateLevel();
                resetBall(ball);
                createParticles(canvas.width, ball.y, 25, '#59CE8F', 'explosion');
                
                // تشغيل الصوت
                audio.playScore();
                
                // تفعيل الاهتزاز
                haptic.score();
            }
        });
        
        // توليد قدرات عشوائية
        spawnRandomPowerup();
        
        // تحريك مضرب اللاعب
        if (gameState.usingMouse) {
            playerPaddle.targetY = mouseY - playerPaddle.height / 2;
        } else {
            // التحكم بلوحة المفاتيح
            if (keysPressed['arrowup'] || keysPressed['w']) {
                playerPaddle.targetY -= playerPaddle.speed * normalDelta;
            }
            if (keysPressed['arrowdown'] || keysPressed['s']) {
                playerPaddle.targetY += playerPaddle.speed * normalDelta;
            }
        }
        
        // حركة سلسة للمضرب
        const dy = playerPaddle.targetY - playerPaddle.y;
        playerPaddle.y += dy * playerPaddle.smoothFactor;
        
        // التحكم الذكي للكمبيوتر
        updateComputerAI(deltaTime);
        
        // الحدود للمضارب
        playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y));
        playerPaddle.targetY = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.targetY));
        
        computerPaddle.y = Math.max(0, Math.min(canvas.height - computerPaddle.height, computerPaddle.y));
        
        // تحديث القدرات
        updatePowerups(deltaTime);
        
        // تحديث القدرات العائمة
        updateFloatingPowerups(deltaTime);
        
        // تحديث الجسيمات
        particlePool.update(deltaTime);
        
        // تحديث الكومبو
        updateCombo();
        
        // التحقق من نهاية اللعبة
        if (gameState.playerScore >= 20 || gameState.computerScore >= 20) {
            endGame();
        }
    }
    
    function updateFloatingPowerups(deltaTime) {
        const normalDelta = deltaTime / 16.67;
        
        memoryManager.powerups.forEach(powerup => {
            if (!powerup.collected) {
                powerup.rotation += 0.02 * normalDelta;
                powerup.pulse += powerup.pulseSpeed * normalDelta;
                powerup.life -= 0.001 * normalDelta;
                
                // التحقق من التصادم مع المضرب
                const dx = powerup.x - playerPaddle.x;
                const dy = powerup.y - (playerPaddle.y + playerPaddle.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < powerup.radius + playerPaddle.width) {
                    collectPowerup(powerup);
                }
                
                // إزالة القدرات القديمة
                if (powerup.life <= 0) {
                    powerup.shouldRemove = true;
                }
            }
        });
        
        // إزالة القدرات القديمة
        memoryManager.powerups = memoryManager.powerups.filter(p => !p.collected && !p.shouldRemove);
    }
    
    function updateCombo() {
        // إعادة تعيين الكومبو بعد 3 ثوان
        if (Date.now() - gameState.lastHitTime > 3000) {
            gameState.combo = 0;
        }
        
        // تحديث واجهة الكومبو
        const comboElement = document.getElementById('playerCombo');
        if (comboElement) {
            if (gameState.combo > 1) {
                comboElement.textContent = `${gameState.combo}x كومبو!`;
                comboElement.classList.add('active');
            } else {
                comboElement.classList.remove('active');
            }
        }
        
        const pauseComboElement = document.getElementById('pauseCombo');
        if (pauseComboElement) {
            pauseComboElement.textContent = `${gameState.combo}x`;
        }
    }

    // ==============================================
    // 18. الرسم والتأثيرات البصرية
    // ==============================================
    
    function drawGame(alpha) {
        // مسح الشاشة بخلفية متدرجة
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(10, 10, 40, 0.95)');
        gradient.addColorStop(0.5, 'rgba(20, 20, 60, 0.95)');
        gradient.addColorStop(1, 'rgba(10, 10, 40, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم الخط المنقط في المنتصف
        drawCenterLine();
        
        // رسم الجسيمات
        particlePool.draw(ctx);
        
        // رسم القدرات العائمة
        drawFloatingPowerups();
        
        // رسم أثر الكرات
        drawBallTrails();
        
        // رسم المضارب
        drawPaddle(playerPaddle);
        drawPaddle(computerPaddle);
        
        // رسم الكرات
        balls.forEach(ball => {
            if (ball.active) {
                drawBall(ball);
            }
        });
        
        // رسم الواجهة
        drawUI();
    }
    
    function drawPaddle(paddle) {
        // رسم تأثير التوهج إذا كان نشطاً
        if (paddle.glow) {
            ctx.save();
            ctx.shadowColor = paddle.glowColor;
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        // رسم المضرب مع تأثير التدرج
        if (paddle === playerPaddle) {
            const selectedSkin = paddleSkins.find(p => p.id === playerPaddle.selectedSkin);
            let color = paddle.color;
            
            if (selectedSkin && typeof selectedSkin.color === 'string' && selectedSkin.color.includes('gradient')) {
                const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
                const colors = selectedSkin.color.match(/#[0-9A-F]{6}/gi);
                if (colors) {
                    colors.forEach((col, index) => {
                        gradient.addColorStop(index / (colors.length - 1), col);
                    });
                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = color;
                }
            } else {
                ctx.fillStyle = color;
            }
        } else {
            ctx.fillStyle = paddle.color;
        }
        
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        // إضافة حدود لامعة
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        if (paddle.glow) {
            ctx.restore();
        }
    }
    
    function drawBall(ball) {
        // رسم تأثير الإضاءة حول الكرة
        const glow = ctx.createRadialGradient(
            ball.x, ball.y, ball.radius,
            ball.x, ball.y, ball.glowRadius
        );
        glow.addColorStop(0, ball.glowColor);
        glow.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // تدرج للكرة
        const gradient = ctx.createRadialGradient(
            ball.x - ball.radius / 3, ball.y - ball.radius / 3, 0,
            ball.x, ball.y, ball.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, ball.color);
        gradient.addColorStop(1, ball.color + '66');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // تأثير لامع
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function drawFloatingPowerups() {
        memoryManager.powerups.forEach(p => {
            if (p.collected || p.life <= 0) return;
            
            ctx.save();
            
            // تأثير النبض
            const pulseSize = 1 + Math.sin(p.pulse) * 0.2;
            
            // جسم القدرة
            ctx.fillStyle = p.color + '80';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // حدود متحركة
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * pulseSize, 0, Math.PI * 2);
            ctx.stroke();
            
            // أيقونة القدرة
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(getPowerupIcon(p.type), p.x, p.y);
            
            ctx.restore();
        });
    }
    
    function drawBallTrails() {
        if (memoryManager.ballTrails.length > 1) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(memoryManager.ballTrails[0].x, memoryManager.ballTrails[0].y);
            
            for (let i = 1; i < memoryManager.ballTrails.length; i++) {
                ctx.lineTo(memoryManager.ballTrails[i].x, memoryManager.ballTrails[i].y);
            }
            
            ctx.stroke();
            ctx.restore();
        }
    }
    
    function drawCenterLine() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    function drawUI() {
        // رسم الدرجات
        drawText(`اللاعب: ${gameState.playerScore}`, 30, 40, '28px', playerPaddle.color);
        drawText(`الخصم: ${gameState.computerScore}`, canvas.width - 30, 40, '28px', computerPaddle.color, 'right');
        
        // رسم مستوى الصعوبة
        drawText(`${currentLevelData.name}`, canvas.width / 2, 40, '24px', currentLevelData.color, 'center');
        
        // رسم الكومبو
        if (gameState.combo > 1) {
            drawText(`✕${gameState.combo}`, canvas.width / 2, 70, '22px', '#FFB740', 'center');
        }
        
        // رسم سرعة اللعبة
        drawText(`السرعة: ×${gameState.speedMultiplier.toFixed(2)}`, canvas.width / 2, canvas.height - 30, '18px', '#59CE8F', 'center');
        
        // رسم تعليمات التحكم
        drawText(`التحكم: ${gameState.usingMouse ? 'ماوس' : 'أسهم أو WASD'}`, canvas.width / 2, 95, '16px', '#FFB740', 'center');
        drawText(`اضغط M للتبديل`, canvas.width / 2, 115, '14px', '#ffffff80', 'center');
        
        // رسم القدرات النشطة
        let powerupY = 140;
        Object.keys(gameState.powerups).forEach(powerupName => {
            const powerup = gameState.powerups[powerupName];
            if (powerup.active) {
                let powerupText = '';
                let color = '#FFB740';
                switch(powerupName) {
                    case 'slow': powerupText = '⏱️ إبطاء'; color = '#3AB0FF'; break;
                    case 'big': powerupText = '📏 مضرب كبير'; color = '#59CE8F'; break;
                    case 'fast': powerupText = '⚡ سرعة'; color = '#FF1E00'; break;
                    case 'multiBall': powerupText = '🎾 كرات متعددة'; color = '#FFB740'; break;
                }
                drawText(`${powerupText}: ${Math.ceil(powerup.timeLeft)}ث`, canvas.width / 2, powerupY, '18px', color, 'center');
                powerupY += 25;
            }
        });
    }
    
    function drawText(text, x, y, fontSize = '20px', color = '#fff', align = 'left') {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontSize} 'Cairo', Arial`;
        ctx.textAlign = align;
        
        // تأثير الظل
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    // ==============================================
    // 19. إدارة الشاشات والأحداث
    // ==============================================
    
    function hideAllScreens() {
        const screens = [mainMenu, levelsMenu, instructionsMenu, gameScreen, 
                        challengesMenu, storeMenu, statsMenu];
        screens.forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
    }
    
    function showScreen(screenElement) {
        hideAllScreens();
        if (screenElement) {
            screenElement.classList.remove('hidden');
        }
    }
    
    function showMainMenu() {
        showScreen(mainMenu);
        
        if (gameTimerInterval) {
            clearInterval(gameTimerInterval);
            gameTimerInterval = null;
        }
        
        // إيقاف حلقة اللعبة
        gameLoop.stop();
        
        updatePlayerInfo();
        dailyChallenges.updateUI();
    }
    
    function showGameScreen() {
        showScreen(gameScreen);
    }
    
    function showChallengesMenu() {
        showScreen(challengesMenu);
        dailyChallenges.updateUI();
    }
    
    function showStoreMenu() {
        showScreen(storeMenu);
        updateStoreUI();
    }
    
    function showStatsMenu() {
        showScreen(statsMenu);
        updateStatsUI();
    }
    
    function updateStoreUI() {
        if (!paddleStoreGrid) return;
        
        paddleStoreGrid.innerHTML = paddleSkins.map(paddle => `
            <div class="paddle-item ${paddle.selected ? 'selected' : ''} ${!paddle.unlocked ? 'locked' : ''}" 
                 data-id="${paddle.id}">
                <div class="paddle-preview">
                    <div class="paddle-color" style="background: ${paddle.color}"></div>
                </div>
                <div class="paddle-name">${paddle.name}</div>
                ${!paddle.unlocked ? 
                    `<div class="paddle-price">
                        ${paddle.price} <i class="fas fa-coins"></i>
                    </div>` : 
                    `<div class="paddle-price">
                        ${paddle.selected ? 'محدد' : 'متاح'}
                    </div>`
                }
                <div class="paddle-effect">${paddle.effect}</div>
            </div>
        `).join('');
        
        // إضافة أحداث للمضارب
        document.querySelectorAll('.paddle-item').forEach(item => {
            item.addEventListener('click', () => {
                const paddleId = parseInt(item.dataset.id);
                const paddle = paddleSkins.find(p => p.id === paddleId);
                
                if (paddle.unlocked) {
                    // تحديد المضرب
                    paddleSkins.forEach(p => p.selected = false);
                    paddle.selected = true;
                    playerPaddle.selectedSkin = paddleId;
                    playerPaddle.color = typeof paddle.color === 'string' ? 
                        paddle.color : '#3AB0FF';
                    
                    savePlayerData();
                    updateStoreUI();
                    updatePlayerInfo();
                    
                    // تشغيل الصوت
                    audio.playPowerup();
                } else if (gameState.coins >= paddle.price) {
                    // شراء المضرب
                    gameState.coins -= paddle.price;
                    paddle.unlocked = true;
                    paddle.selected = true;
                    
                    // إلغاء تحديد بقية المضارب
                    paddleSkins.filter(p => p.id !== paddleId).forEach(p => p.selected = false);
                    
                    playerPaddle.selectedSkin = paddleId;
                    playerPaddle.color = typeof paddle.color === 'string' ? 
                        paddle.color : '#3AB0FF';
                    
                    savePlayerData();
                    updateStoreUI();
                    updatePlayerInfo();
                    
                    // تشغيل الصوت
                    audio.playPowerup();
                    
                    // تفعيل الاهتزاز
                    haptic.powerup();
                    
                    dailyChallenges.showNotification(
                        `🎉 اشتريت مضرب ${paddle.name} بـ ${paddle.price} عملة!`
                    );
                } else {
                    dailyChallenges.showNotification("لا تملك عملات كافية لشراء هذا المضرب");
                }
            });
        });
    }
    
    function updateStatsUI() {
        // تحديث الإحصائيات العامة
        document.getElementById('statGamesPlayed').textContent = gameState.gamesPlayed;
        
        const winRate = gameState.gamesPlayed > 0 ? 
            Math.round((gameState.gamesWon / gameState.gamesPlayed) * 100) : 0;
        document.getElementById('statWinRate').textContent = `${winRate}%`;
        
        document.getElementById('statHighScore').textContent = gameState.highScore;
        
        const avgScore = gameState.gamesPlayed > 0 ? 
            Math.round(gameState.totalScore / gameState.gamesPlayed) : 0;
        document.getElementById('statAvgScore').textContent = avgScore;
        
        document.getElementById('statBestCombo').textContent = gameState.bestCombo;
        document.getElementById('statTotalTime').textContent = Math.round(gameState.totalTime / 60);
        
        // تحديث التفاصيل
        document.getElementById('statPowerupsUsed').textContent = gameState.powerupsUsed;
        
        const accuracy = gameState.totalHits > 0 ? 
            Math.round((gameState.successfulHits / gameState.totalHits) * 100) : 0;
        document.getElementById('statAccuracy').textContent = `${accuracy}%`;
        
        const reactionTime = gameState.fastestReaction === Infinity ? 
            '0' : `${gameState.fastestReaction}ms`;
        document.getElementById('statReactionTime').textContent = reactionTime;
        
        document.getElementById('statTotalXP').textContent = gameState.xp;
        
        // تحديث الخريطة الحرارية
        updateHeatmap();
    }
    
    function updateHeatmap() {
        const heatmap = document.getElementById('heatmap');
        if (!heatmap) return;
        
        heatmap.innerHTML = '';
        
        // إضافة نقاط الخريطة الحرارية
        gameState.heatmapPoints.forEach(point => {
            const heatPoint = document.createElement('div');
            heatPoint.className = 'heatmap-point';
            heatPoint.style.left = `${(point.x / canvas.width) * 100}%`;
            heatPoint.style.top = `${(point.y / canvas.height) * 100}%`;
            heatPoint.style.opacity = point.intensity;
            heatmap.appendChild(heatPoint);
        });
    }

    // ==============================================
    // 20. التحكم والإدخال
    // ==============================================
    
    function handleMouseMove(e) {
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
        
        // تحديث التحكم تلقائياً عند تحريك الماوس
        gameState.usingMouse = true;
    }
    
    function handleKeyDown(e) {
        const key = e.key.toLowerCase();
        keysPressed[key] = true;
        
        // تبديل التحكم تلقائياً عند استخدام لوحة المفاتيح
        if (['arrowup', 'arrowdown', 'w', 's'].includes(key)) {
            gameState.usingMouse = false;
        }
        
        // اختصارات لوحة المفاتيح
        if (key === ' ' || key === 'spacebar') {
            e.preventDefault();
            if (gameScreen && !gameScreen.classList.contains('hidden')) {
                if (gameState.isPaused) {
                    resumeGame();
                } else if (!gameState.isGameOver) {
                    pauseGame();
                }
            }
        }
        
        if (key === 'r') {
            e.preventDefault();
            if (!gameState.isGameOver && gameScreen && !gameScreen.classList.contains('hidden')) {
                startGame();
            }
        }
        
        if (key === 'escape') {
            e.preventDefault();
            if (gameScreen && !gameScreen.classList.contains('hidden')) {
                showMainMenu();
            } else if (!mainMenu.classList.contains('hidden')) {
                showMainMenu();
            }
        }
        
        // اختصارات القدرات (1, 2, 3, 4)
        if (key === '1' && !gameState.isPaused && !gameState.isGameOver && gameScreen && !gameScreen.classList.contains('hidden')) {
            e.preventDefault();
            activatePowerup('slow');
        }
        if (key === '2' && !gameState.isPaused && !gameState.isGameOver && gameScreen && !gameScreen.classList.contains('hidden')) {
            e.preventDefault();
            activatePowerup('big');
        }
        if (key === '3' && !gameState.isPaused && !gameState.isGameOver && gameScreen && !gameScreen.classList.contains('hidden')) {
            e.preventDefault();
            activatePowerup('fast');
        }
        if (key === '4' && !gameState.isPaused && !gameState.isGameOver && gameScreen && !gameScreen.classList.contains('hidden')) {
            e.preventDefault();
            activatePowerup('multiBall');
        }
        
        // تبديل بين الماوس ولوحة المفاتيح (M)
        if (key === 'm') {
            e.preventDefault();
            gameState.usingMouse = !gameState.usingMouse;
            createParticles(canvas.width / 2, canvas.height / 2, 20, 
                           gameState.usingMouse ? '#3AB0FF' : '#FFB740', 'star');
            
            // تشغيل الصوت
            audio.playPowerup();
        }
    }
    
    function handleKeyUp(e) {
        keysPressed[e.key.toLowerCase()] = false;
    }
    
    function setupMobileControls() {
        if (!upBtn || !downBtn || !pauseBtnMobile || !powerupBtn) return;
        
        let upPressed = false;
        let downPressed = false;
        
        upBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            upPressed = true;
            gameState.usingMouse = false;
        });
        
        upBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            upPressed = false;
        });
        
        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            downPressed = true;
            gameState.usingMouse = false;
        });
        
        downBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            downPressed = false;
        });
        
        pauseBtnMobile.addEventListener('click', () => {
            if (gameState.isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        });
        
        powerupBtn.addEventListener('click', () => {
            // تفعيل قدرة عشوائية
            const availablePowerups = Object.keys(gameState.powerups)
                .filter(p => canActivatePowerup(p));
            
            if (availablePowerups.length > 0) {
                const randomPowerup = availablePowerups[Math.floor(Math.random() * availablePowerups.length)];
                activatePowerup(randomPowerup);
            }
        });
        
        // تحديث حالة أزرار التحكم
        function updateMobileControls() {
            if (upPressed) {
                playerPaddle.targetY -= playerPaddle.speed * 0.016;
            }
            if (downPressed) {
                playerPaddle.targetY += playerPaddle.speed * 0.016;
            }
        }
    }

    // ==============================================
    // 21. تهيئة اللعبة
    // ==============================================
    
    function initialize() {
        console.log('Initializing Pong Evolution...');
        
        // تهيئة الأنظمة
        memoryManager.init();
        loadPlayerData();
        
        // تهيئة الأحداث
        initializeEvents();
        
        // تهيئة التحكم المحمول
        setupMobileControls();
        
        // عرض القائمة الرئيسية
        showMainMenu();
        
        // إظهار الحاوية بعد التحميل
        if (gameContainer) {
            gameContainer.style.opacity = '1';
        }
        
        console.log('Pong Evolution initialized successfully!');
    }
    
    function initializeEvents() {
        // أحداث أزرار القائمة
        if (playBtn) playBtn.addEventListener('click', () => {
            gameState.selectedLevel = 1;
            startGame();
        });

        if (levelsBtn) levelsBtn.addEventListener('click', () => {
            showScreen(levelsMenu);
            updateLevelLocks();
        });

        if (challengesBtn) challengesBtn.addEventListener('click', showChallengesMenu);
        if (storeBtn) storeBtn.addEventListener('click', showStoreMenu);
        if (statsBtn) statsBtn.addEventListener('click', showStatsMenu);
        if (instructionsBtn) instructionsBtn.addEventListener('click', () => {
            showScreen(instructionsMenu);
        });

        if (backFromLevelsBtn) backFromLevelsBtn.addEventListener('click', showMainMenu);
        if (backFromInstructionsBtn) backFromInstructionsBtn.addEventListener('click', showMainMenu);
        if (backFromChallengesBtn) backFromChallengesBtn.addEventListener('click', showMainMenu);
        if (backFromStoreBtn) backFromStoreBtn.addEventListener('click', showMainMenu);
        if (backFromStatsBtn) backFromStatsBtn.addEventListener('click', showMainMenu);

        if (pauseBtn) pauseBtn.addEventListener('click', pauseGame);
        if (resumeBtn) resumeBtn.addEventListener('click', resumeGame);
        if (restartBtn) restartBtn.addEventListener('click', startGame);
        if (menuBtn) menuBtn.addEventListener('click', showMainMenu);
        if (playAgainBtn) playAgainBtn.addEventListener('click', startGame);
        if (mainMenuBtn) mainMenuBtn.addEventListener('click', showMainMenu);
        
        if (claimAllBtn) {
            claimAllBtn.addEventListener('click', () => {
                dailyChallenges.claimAllRewards();
            });
        }

        // أحداث المستويات
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.dataset.locked === "false") {
                    const selectedLevel = parseInt(card.dataset.level);
                    gameState.selectedLevel = selectedLevel;
                    startGame();
                }
            });
        });

        // أحداث القدرات
        [powerupSlow, powerupBig, powerupFast, powerupMultiBall].forEach((powerup, index) => {
            const powerupNames = ['slow', 'big', 'fast', 'multiBall'];
            if (powerup) {
                powerup.addEventListener('click', () => {
                    if (!gameState.isPaused && !gameState.isGameOver) {
                        activatePowerup(powerupNames[index]);
                    }
                });
            }
        });

        // أحداث الماوس
        if (canvas) {
            canvas.addEventListener('mousemove', handleMouseMove);
            
            canvas.addEventListener('mouseenter', () => {
                document.addEventListener('mousemove', handleMouseMove);
            });
            
            canvas.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', handleMouseMove);
            });
        }

        // أحداث لوحة المفاتيح
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        // منع السلوك الافتراضي للمفاتيح المهمة
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        // تحكم اللمس للشاشات المحمولة
        if (canvas) {
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    const rect = canvas.getBoundingClientRect();
                    mouseY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
                    gameState.usingMouse = true;
                }
            }, { passive: false });
            
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    const rect = canvas.getBoundingClientRect();
                    mouseY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
                    gameState.usingMouse = true;
                }
            }, { passive: false });
        }
    }
    
    function updateLevelLocks() {
        const highestLevel = gameState.highestLevel;
        document.querySelectorAll('.level-card').forEach(card => {
            const level = parseInt(card.dataset.level);
            const lockElement = card.querySelector('.level-lock');
            if (lockElement) {
                if (level <= highestLevel) {
                    card.dataset.locked = "false";
                    lockElement.innerHTML = '<i class="fas fa-lock-open"></i>';
                    lockElement.style.color = "#59CE8F";
                } else {
                    card.dataset.locked = "true";
                    lockElement.innerHTML = '<i class="fas fa-lock"></i>';
                    lockElement.style.color = "#FF1E00";
                }
            }
        });
    }

    // ==============================================
    // 22. وظائف اللعبة الرئيسية
    // ==============================================
    
    function startGame() {
        // إيقاف حلقة اللعبة الحالية
        gameLoop.stop();
        
        // تنظيف الفواصل الزمنية القديمة
        if (gameTimerInterval) {
            clearInterval(gameTimerInterval);
        }
        
        // إعادة تعيين حالة اللعبة
        gameState.playerScore = 0;
        gameState.computerScore = 0;
        gameState.currentLevel = gameState.selectedLevel;
        gameState.isPaused = false;
        gameState.isGameOver = false;
        gameState.gameTime = 0;
        gameState.speedMultiplier = 1.0;
        gameState.lastSpeedIncrease = Date.now();
        gameState.combo = 0;
        gameState.lastHitTime = Date.now();
        
        // إعادة تعيين القدرات
        Object.keys(gameState.powerups).forEach(powerupName => {
            deactivatePowerup(powerupName);
            gameState.powerups[powerupName].cooldown = 0;
        });
        
        // إعادة تعيين الكرات
        balls = [{
            id: 1,
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 3,
            color: '#ffffff',
            active: true,
            trail: [],
            glowRadius: 15,
            glowColor: 'rgba(255, 255, 255, 0.3)'
        }];
        
        // تنظيف الأنظمة
        memoryManager.clearAll();
        particlePool.clear();
        
        // تحديث واجهة المستخدم
        updateScores();
        currentLevelData = levels[gameState.currentLevel - 1] || levels[0];
        if (currentLevelElement) {
            currentLevelElement.textContent = gameState.currentLevel;
            currentLevelElement.style.color = currentLevelData.color;
        }
        
        // تحديث شخصية الكمبيوتر
        computerPaddle.personality = computerPersonalities[currentLevelData.personality];
        const computerStyleElement = document.getElementById('computerStyle');
        if (computerStyleElement) {
            computerStyleElement.textContent = computerPaddle.personality.name;
        }
        
        // إعادة تعيين المواضع
        playerPaddle.y = canvas.height / 2 - playerPaddle.height / 2;
        playerPaddle.targetY = playerPaddle.y;
        computerPaddle.y = canvas.height / 2 - computerPaddle.height / 2;
        computerPaddle.targetY = computerPaddle.y;
        
        // إعادة تعيين سرعة الكمبيوتر
        computerPaddle.speed = currentLevelData.computerSpeed;
        computerPaddle.originalSpeed = currentLevelData.computerSpeed;
        computerPaddle.difficulty = currentLevelData.accuracy;
        computerPaddle.reactionSpeed = computerPaddle.personality.reactionSpeed;
        computerPaddle.attackMode = false;
        computerPaddle.attackCooldown = 0;
        
        // إعادة تعيين سرعة اللاعب
        playerPaddle.speed = 8;
        playerPaddle.originalSpeed = 8;
        
        // إعادة تعيين حجم المضرب
        playerPaddle.height = 100;
        playerPaddle.originalHeight = 100;
        playerPaddle.glow = false;
        
        // بدء مؤقت اللعبة
        gameTimerInterval = setInterval(() => {
            if (!gameState.isPaused && !gameState.isGameOver) {
                gameState.gameTime++;
                if (gameTimeElement) {
                    gameTimeElement.textContent = `الوقت: ${formatTime(gameState.gameTime)}`;
                }
            }
        }, 1000);
        
        // بدء حلقة اللعبة
        gameLoop.start(updateGame, drawGame);
        
        // عرض شاشة بداية المستوى
        showLevelStart(gameState.currentLevel);
        showGameScreen();
        
        // إخفاء شاشات التوقف
        if (pauseOverlay) pauseOverlay.classList.add('hidden');
        if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
        
        // تحديث معلومات اللعبة
        const gameCoinsElement = document.getElementById('gameCoins');
        const gameXPElement = document.getElementById('gameXP');
        if (gameCoinsElement) gameCoinsElement.textContent = gameState.coins;
        if (gameXPElement) gameXPElement.textContent = gameState.xp;
        
        // جسيمات البداية
        createParticles(canvas.width / 2, canvas.height / 2, 100, currentLevelData.color, 'star');
    }
    
    function showLevelStart(level) {
        if (!levelStartOverlay) return;
        
        levelStartOverlay.classList.remove('hidden');
        if (levelNumber) levelNumber.textContent = level;
        
        const levelData = levels[level - 1] || levels[0];
        if (levelDescription) levelDescription.textContent = levelData.description;
        
        let count = 3;
        if (countdown) countdown.textContent = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                if (countdown) countdown.textContent = count;
            } else {
                clearInterval(countdownInterval);
                if (countdown) countdown.textContent = "ابدأ!";
                setTimeout(() => {
                    levelStartOverlay.classList.add('hidden');
                }, 500);
            }
        }, 1000);
    }
    
    function pauseGame() {
        if (gameState.isGameOver) return;
        
        gameState.isPaused = true;
        if (pauseOverlay) {
            pauseOverlay.classList.remove('hidden');
            
            const pauseCoinsElement = document.getElementById('pauseCoins');
            const pauseComboElement = document.getElementById('pauseCombo');
            
            if (pauseCoinsElement) {
                pauseCoinsElement.textContent = gameState.coins;
            }
            if (pauseComboElement) {
                pauseComboElement.textContent = `${gameState.combo}x`;
            }
        }
    }
    
    function resumeGame() {
        gameState.isPaused = false;
        if (pauseOverlay) {
            pauseOverlay.classList.add('hidden');
        }
    }
    
    function endGame() {
        gameState.isGameOver = true;
        gameLoop.stop();
        
        // تحديث إحصائيات اللاعب
        gameState.gamesPlayed++;
        gameState.totalScore += gameState.playerScore;
        gameState.totalTime += gameState.gameTime;
        
        const playerWins = gameState.playerScore > gameState.computerScore;
        
        if (playerWins) {
            gameState.gamesWon++;
            
            // تحديث التحديات
            const winMargin = gameState.playerScore - gameState.computerScore;
            if (winMargin >= 5) {
                dailyChallenges.updateChallenge('winMargin');
            }
            
            // مكافآت الفوز
            const coinsEarned = Math.floor(gameState.playerScore * 5 + winMargin * 10);
            const xpEarned = Math.floor(gameState.playerScore * 10 + winMargin * 20);
            
            gameState.coins += coinsEarned;
            gameState.xp += xpEarned;
            
            // تحديث أعلى مستوى
            if (gameState.currentLevel > gameState.highestLevel) {
                gameState.highestLevel = gameState.currentLevel;
            }
            
            // تحديث أعلى نتيجة
            if (gameState.playerScore > gameState.highScore) {
                gameState.highScore = gameState.playerScore;
            }
            
            // تحديث التحديات
            dailyChallenges.updateChallenge('gamesPlayed');
            
            // تحديث واجهة النهاية
            if (gameOverTitle) gameOverTitle.textContent = "🎉 فوز رائع!";
            if (gameResult) {
                gameResult.textContent = `فزت بنتيجة ${gameState.playerScore} - ${gameState.computerScore}`;
                gameResult.className = "game-result win-result";
            }
            
            // تشغيل الصوت
            audio.playScore();
            
            // تفعيل الاهتزاز
            haptic.gameOver(true);
            
            if (finalCoins) finalCoins.textContent = `+${coinsEarned}`;
            if (finalXP) finalXP.textContent = `+${xpEarned}`;
        } else {
            // تحديث واجهة النهاية
            if (gameOverTitle) gameOverTitle.textContent = " انتهت اللعبة";
            if (gameResult) {
                gameResult.textContent = `خسرت بنتيجة ${gameState.playerScore} - ${gameState.computerScore}`;
                gameResult.className = "game-result lose-result";
            }
            
            // القليل من المكافآت حتى في الخسارة
            const coinsEarned = Math.floor(gameState.playerScore * 2);
            const xpEarned = Math.floor(gameState.playerScore * 5);
            
            gameState.coins += coinsEarned;
            gameState.xp += xpEarned;
            
            // تشغيل الصوت
            audio.playLevelUp();
            
            // تفعيل الاهتزاز
            haptic.gameOver(false);
            
            if (finalCoins) finalCoins.textContent = `+${coinsEarned}`;
            if (finalXP) finalXP.textContent = `+${xpEarned}`;
            
            // تحديث التحديات
            dailyChallenges.updateChallenge('gamesPlayed');
        }
        
        // تحديث المعلومات
        if (finalLevel) finalLevel.textContent = gameState.currentLevel;
        if (finalScore) finalScore.textContent = `${gameState.playerScore} - ${gameState.computerScore}`;
        if (finalTime) finalTime.textContent = formatTime(gameState.gameTime);
        
        // حفظ البيانات
        savePlayerData();
        
        // تحديث معلومات اللاعب
        updatePlayerInfo();
        checkLevelUp();
        
        // عرض شاشة النهاية
        if (gameOverOverlay) {
            gameOverOverlay.classList.remove('hidden');
        }
        
        // تحديث الإحصائيات
        updateStatsUI();
        
        // جسيمات النهاية
        createParticles(canvas.width / 2, canvas.height / 2, 100, 
                       playerWins ? '#59CE8F' : '#FF1E00', 'explosion');
    }
    
    function updateScores() {
        if (playerScoreElement) {
            playerScoreElement.textContent = gameState.playerScore;
            playerScoreElement.style.color = gameState.playerScore > gameState.computerScore ? '#59CE8F' : '#FFFFFF';
        }
        
        if (computerScoreElement) {
            computerScoreElement.textContent = gameState.computerScore;
            computerScoreElement.style.color = gameState.computerScore > gameState.playerScore ? '#FF1E00' : '#FFFFFF';
        }
        
        if (speedMultiplier) {
            speedMultiplier.textContent = `×${gameState.speedMultiplier.toFixed(2)}`;
        }
    }
    
    function updateHighScores() {
        if (gameState.playerScore > gameState.highScore) {
            gameState.highScore = gameState.playerScore;
        }
        
        if (gameState.currentLevel > gameState.highestLevel) {
            gameState.highestLevel = gameState.currentLevel;
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // ==============================================
    // 23. تهيئة اللعبة عند التحميل
    // ==============================================
    
    initialize();
    
    // جعل اللعبة متاحة عالمياً للتصحيح
    window.game = {
        state: gameState,
        start: startGame,
        pause: pauseGame,
        resume: resumeGame,
        particlePool: particlePool,
        memoryManager: memoryManager,
        dailyChallenges: dailyChallenges,
        audio: audio,// will be inhanced soon
        haptic: haptic
    };
});