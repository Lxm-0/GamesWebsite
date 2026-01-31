// ====== إعدادات اللعبة الرئيسية ======
class AdvancedDiceGame {
    constructor() {
        this.initializeElements();
        this.initializeGameState();
        this.initializeEventListeners();
        this.initializeAudio();
        this.initializeParticles();
        this.loadGameSettings();
        this.showLoadingScreen();
    }

    initializeElements() {
        // شاشات اللعبة
        this.loadingScreen = document.getElementById('loadingScreen');
        this.startScreen = document.getElementById('startScreen');
        this.gameContainer = document.getElementById('gameContainer');
        this.victoryScreen = document.getElementById('victoryScreen');
        this.sidePanel = document.getElementById('sidePanel');
        this.popupMenu = document.getElementById('popupMenu');
        this.tutorialOverlay = document.getElementById('tutorialOverlay');
        this.alertContainer = document.getElementById('alertContainer');

        // عناصر شاشة البداية
        this.modeCards = document.querySelectorAll('.mode-card');
        this.player1NameInput = document.getElementById('player1NameInput');
        this.player2NameInput = document.getElementById('player2NameInput');
        this.player2Group = document.getElementById('player2Group');
        this.targetScoreRange = document.getElementById('targetScoreRange');
        this.targetScoreValue = document.getElementById('targetScoreValue');
        this.difficultyLevel = document.getElementById('difficultyLevel');
        this.diceType = document.getElementById('diceType');
        this.startGameButton = document.getElementById('startGameButton');
        this.settingsButton = document.getElementById('settingsButton');
        this.tutorialButton = document.getElementById('tutorialButton');

        // إحصائيات
        this.totalWins = document.getElementById('totalWins');
        this.totalRolls = document.getElementById('totalRolls');
        this.highestScore = document.getElementById('highestScore');
        this.winRate = document.getElementById('winRate');

        // عناصر اللعبة
        this.turnIndicator = document.getElementById('turnIndicator');
        this.targetScoreDisplay = document.getElementById('targetScoreDisplay');
        this.currentMode = document.getElementById('currentMode');
        this.gameTimer = document.getElementById('gameTimer');
        this.totalGameTime = document.getElementById('totalGameTime');
        this.timeRemaining = document.getElementById('timeRemaining');

        // اللاعب 1
        this.player1Card = document.getElementById('player1Card');
        this.player1NameDisplay = document.getElementById('player1NameDisplay');
        this.score1 = document.getElementById('score1');
        this.progress1 = document.getElementById('progress1');
        this.progressFill1 = document.getElementById('progressFill1');
        this.rollsCount1 = document.getElementById('rollsCount1');
        this.combos1 = document.getElementById('combos1');
        this.timePlayed1 = document.getElementById('timePlayed1');
        this.rollButton1 = document.getElementById('rollButton1');
        this.useAbility1 = document.getElementById('useAbility1');

        // اللاعب 2
        this.player2Card = document.getElementById('player2Card');
        this.player2NameDisplay = document.getElementById('player2NameDisplay');
        this.score2 = document.getElementById('score2');
        this.progress2 = document.getElementById('progress2');
        this.progressFill2 = document.getElementById('progressFill2');
        this.rollsCount2 = document.getElementById('rollsCount2');
        this.combos2 = document.getElementById('combos2');
        this.timePlayed2 = document.getElementById('timePlayed2');
        this.rollButton2 = document.getElementById('rollButton2');
        this.useAbility2 = document.getElementById('useAbility2');

        // النرد والنتائج
        this.diceDisplay = document.getElementById('diceDisplay');
        this.diceFace = document.getElementById('diceFace');
        this.secondaryDiceDisplay = document.getElementById('secondaryDiceDisplay');
        this.rollResult = document.getElementById('rollResult');
        this.resultValue = document.querySelector('.result-value');
        this.comboEffect = document.getElementById('comboEffect');
        this.bonusEffect = document.getElementById('bonusEffect');
        this.comboCounter = document.getElementById('comboCounter');
        this.comboMultiplier = document.getElementById('comboMultiplier');
        this.bonusPoints = document.getElementById('bonusPoints');

        // التحكم
        this.menuButton = document.getElementById('menuButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.quickRestart = document.getElementById('quickRestart');
        this.hintButton = document.getElementById('hintButton');
        this.soundToggle = document.getElementById('soundToggle');
        this.musicToggle = document.getElementById('musicToggle');
        this.fullscreenButton = document.getElementById('fullscreenButton');

        // المعلومات
        this.lastRoll = document.getElementById('lastRoll');
        this.averageRoll = document.getElementById('averageRoll');
        this.gameSpeed = document.getElementById('gameSpeed');
        this.notificationBar = document.getElementById('notificationBar');

        // السجل والإحصائيات
        this.historyList = document.getElementById('historyList');
        this.player1Probability = document.getElementById('player1Probability');
        this.player1ProbabilityValue = document.getElementById('player1ProbabilityValue');
        this.player2Probability = document.getElementById('player2Probability');
        this.player2ProbabilityValue = document.getElementById('player2ProbabilityValue');

        // شاشة الفوز
        this.victoryTitle = document.getElementById('victoryTitle');
        this.winnerName = document.getElementById('winnerName');
        this.winnerScore = document.getElementById('winnerScore');
        this.victoryTime = document.getElementById('victoryTime');
        this.victoryRolls = document.getElementById('victoryRolls');
        this.victoryCombo = document.getElementById('victoryCombo');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.mainMenuButton = document.getElementById('mainMenuButton');
        this.shareButton = document.getElementById('shareButton');

        // التعليمات
        this.tutorialSteps = document.querySelectorAll('.tutorial-step');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.prevTutorial = document.getElementById('prevTutorial');
        this.nextTutorial = document.getElementById('nextTutorial');
        this.skipTutorial = document.getElementById('skipTutorial');
        this.closeMenu = document.getElementById('closeMenu');
        this.closePanel = document.getElementById('closePanel');
    }

    initializeGameState() {
        // حالة اللعبة
        this.gameActive = false;
        this.gamePaused = false;
        this.currentPlayer = 1;
        this.gameMode = 'pvp';
        this.difficulty = 'medium';
        
        // النتائج
        this.player1Score = 0;
        this.player2Score = 0;
        this.targetScore = 50;
        
        // الإحصائيات
        this.player1Rolls = 0;
        this.player2Rolls = 0;
        this.player1Combos = 0;
        this.player2Combos = 0;
        this.currentCombo = 0;
        this.consecutiveRolls = 0;
        
        // المؤقتات
        this.gameStartTime = null;
        this.gameTimerInterval = null;
        this.player1Time = 0;
        this.player2Time = 0;
        this.playerTimerInterval = null;
        
        // القواعد
        this.rules = {
            annoyingOne: true,
            sixBonus: false,
            comboRule: false,
            powerUps: false
        };
        
        // الذكاء الاصطناعي (للوضع ضد الكمبيوتر)
        this.ai = {
            difficulty: 'medium',
            thinkingTime: 1000,
            strategy: 'balanced'
        };
        
        // إعدادات المستخدم
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            animationsEnabled: true,
            fastMode: false,
            showHints: true
        };
        
        // السجل والإحصائيات
        this.rollHistory = [];
        this.rollDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
        this.totalRollsCount = 0;
        
        // الإنجازات
        this.achievements = {
            firstGame: false,
            firstWin: false,
            perfectGame: false,
            speedRun: false,
            comboMaster: false,
            luckyPlayer: false
        };
        
        // الموسيقى والتأثيرات
        this.audioContext = null;
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.diceRollSound = document.getElementById('diceRollSound');
        this.winSound = document.getElementById('winSound');
        
        // الرسوم المتحركة
        this.animationFrame = null;
    }

    initializeEventListeners() {
        // شاشة البداية
        this.modeCards.forEach(card => {
            card.addEventListener('click', () => this.selectGameMode(card.dataset.mode));
        });

        this.player1NameInput.addEventListener('input', () => this.validateStartButton());
        this.player2NameInput.addEventListener('input', () => this.validateStartButton());
        this.targetScoreRange.addEventListener('input', (e) => {
            this.targetScoreValue.textContent = e.target.value;
        });

        this.startGameButton.addEventListener('click', () => this.startGame());
        this.settingsButton.addEventListener('click', () => this.showSettings());
        this.tutorialButton.addEventListener('click', () => this.showTutorial());

        // اختيار الأفاتار
        document.querySelectorAll('.avatar').forEach(avatar => {
            avatar.addEventListener('click', (e) => this.selectAvatar(e.target));
        });

        // قواعد اللعبة
        document.getElementById('annoyingOneRule').addEventListener('change', (e) => {
            this.rules.annoyingOne = e.target.checked;
        });

        document.getElementById('sixBonusRule').addEventListener('change', (e) => {
            this.rules.sixBonus = e.target.checked;
        });

        document.getElementById('comboRule').addEventListener('change', (e) => {
            this.rules.comboRule = e.target.checked;
        });

        document.getElementById('powerUpsRule').addEventListener('change', (e) => {
            this.rules.powerUps = e.target.checked;
        });

        // اللعبة الرئيسية
        this.rollButton1.addEventListener('click', () => this.rollDice(1));
        this.rollButton2.addEventListener('click', () => this.rollDice(2));
        this.useAbility1.addEventListener('click', () => this.useAbility(1));
        this.useAbility2.addEventListener('click', () => this.useAbility(2));

        this.menuButton.addEventListener('click', () => this.toggleMenu());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.quickRestart.addEventListener('click', () => this.quickRestartGame());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        this.musicToggle.addEventListener('click', () => this.toggleMusic());
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());

        // اللوحة الجانبية
        this.closePanel.addEventListener('click', () => this.closeSidePanel());

        // شاشة الفوز
        this.playAgainButton.addEventListener('click', () => this.playAgain());
        this.mainMenuButton.addEventListener('click', () => this.returnToMainMenu());
        this.shareButton.addEventListener('click', () => this.shareResults());

        // التعليمات
        this.prevTutorial.addEventListener('click', () => this.prevTutorialStep());
        this.nextTutorial.addEventListener('click', () => this.nextTutorialStep());
        this.skipTutorial.addEventListener('click', () => this.skipTutorial());

        this.progressSteps.forEach(step => {
            step.addEventListener('click', (e) => this.goToTutorialStep(parseInt(e.target.dataset.step)));
        });

        // القائمة المنبثقة
        this.closeMenu.addEventListener('click', () => this.closePopupMenu());

        // عناصر القائمة
        document.getElementById('saveGame').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveGame();
        });

        document.getElementById('loadGame').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadGame();
        });

        // أحداث لوحة المفاتيح
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // منع سياق القائمة
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // إدارة النافذة
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    initializeAudio() {
        // إنشاء سياق الصوت
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // ضبط حجم الصوت
        this.backgroundMusic.volume = 0.3;
        this.diceRollSound.volume = 0.5;
        this.winSound.volume = 0.7;
        
        // تعطيل الصوت افتراضيًا حتى ينقر المستخدم
        this.backgroundMusic.muted = true;
        this.diceRollSound.muted = true;
        this.winSound.muted = true;
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#3498db" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#3498db",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                }
            });
        }
    }

    async loadGameSettings() {
        try {
            const savedSettings = localStorage.getItem('diceGameSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                // تحميل الإحصائيات
                if (settings.stats) {
                    this.totalWins.textContent = settings.stats.totalWins || 0;
                    this.totalRolls.textContent = settings.stats.totalRolls || 0;
                    this.highestScore.textContent = settings.stats.highestScore || 0;
                    this.winRate.textContent = settings.stats.winRate || '0%';
                }
                
                // تحميل الإنجازات
                if (settings.achievements) {
                    this.achievements = { ...this.achievements, ...settings.achievements };
                    this.updateAchievementsDisplay();
                }
                
                // تحميل الإعدادات
                if (settings.userSettings) {
                    this.settings = { ...this.settings, ...settings.userSettings };
                    this.updateSettingsDisplay();
                }
            }
        } catch (error) {
            console.error('Error loading game settings:', error);
        }
    }

    saveGameSettings() {
        try {
            const settings = {
                stats: {
                    totalWins: parseInt(this.totalWins.textContent),
                    totalRolls: parseInt(this.totalRolls.textContent),
                    highestScore: parseInt(this.highestScore.textContent),
                    winRate: this.winRate.textContent
                },
                achievements: this.achievements,
                userSettings: this.settings
            };
            
            localStorage.setItem('diceGameSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving game settings:', error);
        }
    }

    // ====== شاشة التحميل ======
    async showLoadingScreen() {
        let progress = 0;
        const progressBar = document.querySelector('.loading-progress');
        
        const simulateLoading = () => {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    progress += Math.random() * 10;
                    if (progress > 100) progress = 100;
                    
                    progressBar.style.width = `${progress}%`;
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        setTimeout(resolve, 500);
                    }
                }, 100);
            });
        };
        
        await simulateLoading();
        
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }

    // ====== شاشة البداية ======
    selectGameMode(mode) {
        this.modeCards.forEach(card => card.classList.remove('active'));
        event.target.closest('.mode-card').classList.add('active');
        
        this.gameMode = mode;
        
        // تحديث واجهة المستخدم بناءً على الوضع المختار
        switch (mode) {
            case 'pvp':
                this.player2Group.style.display = 'block';
                this.currentMode.textContent = 'وضع اللاعبين';
                break;
            case 'pvc':
                this.player2Group.style.display = 'none';
                this.currentMode.textContent = 'لاعب ضد الكمبيوتر';
                break;
            case 'online':
                this.player2Group.style.display = 'none';
                this.currentMode.textContent = 'العب عبر الإنترنت';
                this.showNotification('ميزة اللعب عبر الإنترنت قيد التطوير', 'info');
                break;
        }
        
        this.validateStartButton();
    }

    selectAvatar(avatarElement) {
        const container = avatarElement.closest('.avatar-selection');
        container.querySelectorAll('.avatar').forEach(av => av.classList.remove('active'));
        avatarElement.classList.add('active');
    }

    validateStartButton() {
        let isValid = false;
        
        switch (this.gameMode) {
            case 'pvp':
                isValid = this.player1NameInput.value.trim() !== '' && 
                         this.player2NameInput.value.trim() !== '';
                break;
            case 'pvc':
            case 'online':
                isValid = this.player1NameInput.value.trim() !== '';
                break;
        }
        
        this.startGameButton.disabled = !isValid;
    }

    // ====== بدء اللعبة ======
    async startGame() {
        // إعداد اللاعبين
        this.player1Name = this.player1NameInput.value.trim() || 'اللاعب الأول';
        this.player2Name = this.gameMode === 'pvp' 
            ? this.player2NameInput.value.trim() || 'اللاعب الثاني'
            : 'الكمبيوتر';
        
        // إعداد الهدف
        this.targetScore = parseInt(this.targetScoreRange.value);
        this.targetScoreDisplay.textContent = this.targetScore;
        
        // إعداد الصعوبة
        this.difficulty = this.difficultyLevel.value;
        
        // تحديث أسماء اللاعبين
        this.player1NameDisplay.textContent = this.player1Name;
        this.player2NameDisplay.textContent = this.player2Name;
        
        // إعادة تعيين اللعبة
        this.resetGame();
        
        // الانتقال إلى شاشة اللعبة
        this.startScreen.classList.add('hidden');
        
        await this.delay(500);
        
        this.gameContainer.classList.add('visible');
        
        // تشغيل الموسيقى
        if (this.settings.musicEnabled) {
            this.backgroundMusic.muted = false;
            this.backgroundMusic.play().catch(e => console.log('Music autoplay prevented:', e));
        }
        
        // إظهار إشعار ترحيبي
        this.showNotification(`مرحبًا ${this.player1Name}! ابدأ برمي النرد.`, 'info');
        
        // تسجيل إنجاز أول لعبة
        if (!this.achievements.firstGame) {
            this.achievements.firstGame = true;
            this.unlockAchievement('بداية اللعبة', 'أول لعبة لك!');
            this.saveGameSettings();
        }
    }

    // ====== منطق اللعبة ======
    async rollDice(player) {
        if (!this.gameActive || this.gamePaused || player !== this.currentPlayer) return;
        
        // تشغيل صوت الرمية
        if (this.settings.soundEnabled) {
            this.playDiceRollSound();
        }
        
        // تعطيل الأزرار أثناء الرمي
        this.disableRollButtons();
        
        // عرض رسوم متحركة للرمي
        await this.animateDiceRoll();
        
        // توليد نتيجة عشوائية
        const result = this.generateDiceResult();
        
        // عرض النتيجة
        await this.showDiceResult(result);
        
        // معالجة النتيجة
        this.processRollResult(player, result);
        
        // التحقق من نهاية اللعبة
        if (this.checkGameEnd()) {
            this.endGame();
            return;
        }
        
        // تبديل الدور إذا لزم الأمر
        if (this.shouldSwitchPlayer(result)) {
            this.switchPlayer();
        } else {
            // زيادة العداد للرميات المتتالية
            this.consecutiveRolls++;
            if (this.rules.comboRule && this.consecutiveRolls > 1) {
                this.updateCombo();
            }
        }
        
        // تحديث واجهة المستخدم
        this.updateUI();
        
        // إذا كان الوضع ضد الكمبيوتر وكان دور الكمبيوتر
        if (this.gameMode === 'pvc' && this.currentPlayer === 2) {
            await this.delay(this.ai.thinkingTime);
            this.aiMakeMove();
        }
    }

    generateDiceResult() {
        // توليد رقم عشوائي بين 1 و6
        let result = Math.floor(Math.random() * 6) + 1;
        
        // تطبيق تأثير الصعوبة
        if (this.gameMode === 'pvc' && this.currentPlayer === 2) {
            result = this.applyAIDifficulty(result);
        }
        
        // تحديث توزيع الرميات
        this.rollDistribution[result]++;
        this.totalRollsCount++;
        
        return result;
    }

    applyAIDifficulty(baseResult) {
        const rand = Math.random();
        
        switch (this.ai.difficulty) {
            case 'easy':
                // زيادة فرص الحصول على أرقام منخفضة
                if (rand < 0.3) return Math.max(1, baseResult - 2);
                if (rand < 0.6) return Math.max(1, baseResult - 1);
                return baseResult;
                
            case 'medium':
                // توزيع متوازن مع ميل طفيف للأرقام العالية
                if (rand < 0.2) return Math.min(6, baseResult + 1);
                return baseResult;
                
            case 'hard':
                // زيادة فرص الحصول على أرقام عالية
                if (rand < 0.4) return Math.min(6, baseResult + 1);
                if (rand < 0.2) return Math.min(6, baseResult + 2);
                return baseResult;
                
            case 'expert':
                // استراتيجية متقدمة
                const target = this.targetScore;
                const aiScore = this.player2Score;
                const playerScore = this.player1Score;
                const difference = playerScore - aiScore;
                
                if (difference > 20 && rand < 0.5) {
                    // إذا كان الخصم متقدمًا بكثير، حاول الحصول على أرقام عالية
                    return Math.min(6, baseResult + 2);
                } else if (aiScore > target - 10 && rand < 0.3) {
                    // إذا كان قريبًا من الفوز، كن حذرًا
                    return Math.max(1, baseResult - 1);
                } else {
                    // استراتيجية متوازنة
                    return rand < 0.3 ? Math.min(6, baseResult + 1) : baseResult;
                }
        }
        
        return baseResult;
    }

    processRollResult(player, result) {
        let scoreChange = result;
        let isSpecial = false;
        
        // تطبيق قاعدة الـ 1 المزعج
        if (this.rules.annoyingOne && result === 1) {
            scoreChange = 0;
            this.showNotification(`${this.getPlayerName(player)} رمى 1 وخسر دوره!`, 'warning');
            this.consecutiveRolls = 0;
        } 
        // تطبيق قاعدة الـ 6
        else if (result === 6) {
            isSpecial = true;
            if (this.rules.sixBonus) {
                // مكافأة إضافية للرقم 6
                scoreChange += 3;
                this.showNotification(`${this.getPlayerName(player)} رمى 6 وحصل على مكافأة!`, 'success');
            } else {
                this.showNotification(`${this.getPlayerName(player)} رمى 6 ويمكنه الرمي مرة أخرى!`, 'info');
            }
        }
        
        // تطبيق نظام المجموعات
        if (this.rules.comboRule && this.consecutiveRolls > 1) {
            const comboBonus = Math.floor(this.consecutiveRolls / 2);
            scoreChange += comboBonus;
            this.showNotification(`مجموعة ×${this.consecutiveRolls}! +${comboBonus} نقطة إضافية`, 'success');
        }
        
        // تحديث النتيجة
        if (player === 1) {
            this.player1Score += scoreChange;
            this.player1Rolls++;
        } else {
            this.player2Score += scoreChange;
            this.player2Rolls++;
        }
        
        // تحديث تقدم اللاعبين
        this.updateProgressBars();
        
        // إضافة إلى السجل
        this.addToHistory(player, result, scoreChange, isSpecial);
        
        // تحديث الإحصائيات
        this.updateStats();
    }

    shouldSwitchPlayer(result) {
        // في الوضع العادي، يتبادل اللاعبون بعد كل رمية
        // إلا إذا كانت الرمية 6 (في بعض القواعد)
        if (result === 6 && !this.rules.sixBonus) {
            return false;
        }
        
        // في حالة الـ 1 المزعج
        if (this.rules.annoyingOne && result === 1) {
            return true;
        }
        
        // في الوضع ضد الكمبيوتر، يتحكم الكمبيوتر في توقيت التبديل
        if (this.gameMode === 'pvc' && this.currentPlayer === 2) {
            return this.aiShouldSwitch(result);
        }
        
        // في الحالة العادية، التبديل بعد كل رمية
        return true;
    }

    aiShouldSwitch(result) {
        const aiScore = this.player2Score;
        const playerScore = this.player1Score;
        const target = this.targetScore;
        
        // استراتيجيات مختلفة بناءً على الصعوبة
        switch (this.ai.strategy) {
            case 'aggressive':
                // استمرار اللعب حتى يصبح قريبًا جدًا من الفوز
                return aiScore + result >= target || result === 1;
                
            case 'cautious':
                // التوقف مبكرًا لتجنب المخاطر
                return aiScore >= target - 15 || result === 1;
                
            case 'balanced':
            default:
                // استراتيجية متوازنة
                const advantage = aiScore - playerScore;
                
                if (advantage > 20) {
                    // إذا كان متقدمًا بكثير، كن حذرًا
                    return aiScore >= target - 10 || result === 1;
                } else if (advantage < -20) {
                    // إذا كان متأخرًا بكثير، كن عدوانيًا
                    return aiScore + result >= target || (result <= 2 && aiScore < target - 20);
                } else {
                    // حالة متوازنة
                    return aiScore >= target - 15 || result === 1;
                }
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.consecutiveRolls = 0;
        
        // إعادة تعيين المؤقت للاعب الجديد
        this.resetPlayerTimer();
        
        // تحديث واجهة المستخدم
        this.updatePlayerTurnDisplay();
        
        // إظهار إشعار
        this.showNotification(`الآن دور ${this.getPlayerName(this.currentPlayer)}`, 'info');
    }

    // ====== الرسوم المتحركة ======
    async animateDiceRoll() {
        if (!this.settings.animationsEnabled || this.settings.fastMode) {
            return;
        }
        
        return new Promise(resolve => {
            const dice = this.diceDisplay;
            const duration = 1000;
            const startTime = performance.now();
            
            dice.classList.add('rolling');
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // تدوير النرد وتغيير الوجه
                const rotation = progress * 720; // درجتان كاملتان
                dice.style.transform = `rotate(${rotation}deg)`;
                
                // تغيير الوجه بشكل عشوائي أثناء التدوير
                if (Math.floor(elapsed / 100) % 2 === 0) {
                    const randomFace = Math.floor(Math.random() * 6) + 1;
                    this.diceFace.innerHTML = this.getDiceFaceIcon(randomFace);
                }
                
                if (progress < 1) {
                    this.animationFrame = requestAnimationFrame(animate);
                } else {
                    dice.classList.remove('rolling');
                    dice.style.transform = '';
                    resolve();
                }
            };
            
            this.animationFrame = requestAnimationFrame(animate);
        });
    }

    async showDiceResult(result) {
        const diceFace = this.getDiceFaceIcon(result);
        this.diceFace.innerHTML = diceFace;
        this.resultValue.textContent = result;
        
        // عرض تأثير خاص للأرقام العالية
        if (result >= 5) {
            this.diceDisplay.classList.add('pulse');
            setTimeout(() => {
                this.diceDisplay.classList.remove('pulse');
            }, 1000);
        }
        
        // عرض تأثير خاص للرقم 6
        if (result === 6) {
            this.showFireworks(5);
        }
        
        // عرض تأثير خاص للرقم 1 (إذا كانت القاعدة مفعلة)
        if (result === 1 && this.rules.annoyingOne) {
            this.diceDisplay.classList.add('shake');
            setTimeout(() => {
                this.diceDisplay.classList.remove('shake');
            }, 500);
        }
        
        await this.delay(500);
    }

    getDiceFaceIcon(number) {
        const diceIcons = [
            '<i class="fas fa-dice-one"></i>',
            '<i class="fas fa-dice-two"></i>',
            '<i class="fas fa-dice-three"></i>',
            '<i class="fas fa-dice-four"></i>',
            '<i class="fas fa-dice-five"></i>',
            '<i class="fas fa-dice-six"></i>'
        ];
        
        return diceIcons[number - 1] || '<i class="fas fa-dice"></i>';
    }

    // ====== إدارة القدرات الخاصة ======
    useAbility(player) {
        if (!this.gameActive || this.gamePaused) return;
        
        const abilities = {
            double: () => this.useDoublePoints(player),
            shield: () => this.useShield(player),
            steal: () => this.useSteal(player)
        };
        
        const abilityElement = document.querySelector(`#player${player}Abilities .ability.active`);
        if (!abilityElement) return;
        
        const abilityType = abilityElement.dataset.ability;
        
        if (abilities[abilityType]) {
            abilities[abilityType]();
            abilityElement.classList.remove('active');
            this.updateAbilityButtons();
            
            this.showNotification(`${this.getPlayerName(player)} استخدم قدرة خاصة!`, 'success');
        }
    }

    useDoublePoints(player) {
        if (player === 1) {
            this.player1Score *= 2;
        } else {
            this.player2Score *= 2;
        }
        
        this.updateScores();
        this.updateProgressBars();
        
        // عرض تأثير بصري
        this.showScorePopup(player, 'مضاعفة النقاط!');
    }

    useShield(player) {
        // الحماية من خسارة النقاط في الجولة القادمة
        const opponent = player === 1 ? 2 : 1;
        
        // تخزين حالة الدرع
        this.shieldActive = { player, remainingTurns: 1 };
        
        // عرض تأثير بصري
        this.showShieldEffect(player);
    }

    useSteal(player) {
        const opponent = player === 1 ? 2 : 1;
        const stealAmount = Math.floor(this[`player${opponent}Score`] * 0.2); // سرقة 20% من نقاط الخصم
        
        if (stealAmount > 0) {
            this[`player${player}Score`] += stealAmount;
            this[`player${opponent}Score`] -= stealAmount;
            
            this.updateScores();
            this.updateProgressBars();
            
            this.showNotification(`${this.getPlayerName(player)} سرق ${stealAmount} نقطة من ${this.getPlayerName(opponent)}!`, 'warning');
        }
    }

    updateAbilityButtons() {
        // تحديث حالة أزرار القدرات بناءً على شروط التنشيط
        const player1Abilities = document.querySelectorAll('#player1Abilities .ability');
        const player2Abilities = document.querySelectorAll('#player2Abilities .ability');
        
        // تفعيل القدرات عند الوصول إلى عتبات معينة
        player1Abilities.forEach(ability => {
            const shouldActivate = this.checkAbilityActivation(1, ability.dataset.ability);
            ability.classList.toggle('active', shouldActivate);
        });
        
        player2Abilities.forEach(ability => {
            const shouldActivate = this.checkAbilityActivation(2, ability.dataset.ability);
            ability.classList.toggle('active', shouldActivate);
        });
        
        // تحديث حالة أزرار الاستخدام
        this.useAbility1.disabled = !document.querySelector('#player1Abilities .ability.active');
        this.useAbility2.disabled = !document.querySelector('#player2Abilities .ability.active');
    }

    checkAbilityActivation(player, abilityType) {
        const score = player === 1 ? this.player1Score : this.player2Score;
        
        switch (abilityType) {
            case 'double':
                return score >= 30 && score % 10 === 0;
            case 'shield':
                return score >= 20 && this.currentPlayer !== player;
            case 'steal':
                return score >= 40;
            default:
                return false;
        }
    }

    // ====== التحكم في اللعبة ======
    togglePause() {
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.pauseButton.innerHTML = '<i class="fas fa-play"></i><span>استئناف</span>';
            this.pauseGame();
            this.showNotification('اللعبة متوقفة', 'warning');
        } else {
            this.pauseButton.innerHTML = '<i class="fas fa-pause"></i><span>إيقاف</span>';
            this.resumeGame();
            this.showNotification('استئناف اللعبة', 'info');
        }
    }

    pauseGame() {
        // إيقاف المؤقتات
        clearInterval(this.gameTimerInterval);
        clearInterval(this.playerTimerInterval);
        
        // تعطيل أزرار اللعبة
        this.disableGameButtons();
        
        // إيقاف الموسيقى
        this.backgroundMusic.pause();
    }

    resumeGame() {
        // استئناف المؤقتات
        this.startGameTimer();
        this.startPlayerTimer();
        
        // تمكين أزرار اللعبة
        this.enableGameButtons();
        
        // استئناف الموسيقى
        if (this.settings.musicEnabled) {
            this.backgroundMusic.play();
        }
    }

    quickRestartGame() {
        if (confirm('هل تريد إعادة تشغيل اللعبة؟ سيتم فقدان التقدم الحالي.')) {
            this.resetGame();
            this.showNotification('تم إعادة تشغيل اللعبة', 'info');
        }
    }

    showHint() {
        if (!this.settings.showHints) return;
        
        const hints = [
            'حاول الحصول على 6 لتحصل على رمية إضافية!',
            'احذر من الرمية 1 في وضع القاعدة المزعجة.',
            'استخدم القدرات الخاصة في الوقت المناسب.',
            'راقب تقدم خصمك وخطط استراتيجيتك.',
            'المجموعات المتتالية تعطيك نقاط إضافية!'
        ];
        
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        this.showNotification(`💡 تلميح: ${randomHint}`, 'info');
    }

    // ====== الصوت والموسيقى ======
    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        
        if (this.settings.soundEnabled) {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.showNotification('تم تفعيل الصوت', 'success');
        } else {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.showNotification('تم تعطيل الصوت', 'warning');
        }
        
        this.saveGameSettings();
    }

    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        
        if (this.settings.musicEnabled) {
            this.musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            this.backgroundMusic.muted = false;
            this.backgroundMusic.play().catch(e => console.log('Music play prevented'));
            this.showNotification('تم تفعيل الموسيقى', 'success');
        } else {
            this.musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
            this.backgroundMusic.muted = true;
            this.showNotification('تم تعطيل الموسيقى', 'warning');
        }
        
        this.saveGameSettings();
    }

    playDiceRollSound() {
        if (!this.settings.soundEnabled) return;
        
        this.diceRollSound.currentTime = 0;
        this.diceRollSound.play().catch(e => console.log('Sound play prevented'));
    }

    playWinSound() {
        if (!this.settings.soundEnabled) return;
        
        this.winSound.currentTime = 0;
        this.winSound.play().catch(e => console.log('Win sound play prevented'));
    }

    // ====== واجهة المستخدم ======
    updateUI() {
        this.updateScores();
        this.updateProgressBars();
        this.updatePlayerCards();
        this.updatePlayerTurnDisplay();
        this.updateStats();
        this.updateAbilityButtons();
        this.updateRollButtons();
        this.updateProbabilityDisplay();
    }

    updateScores() {
        this.score1.textContent = this.player1Score;
        this.score2.textContent = this.player2Score;
        
        this.rollsCount1.textContent = this.player1Rolls;
        this.rollsCount2.textContent = this.player2Rolls;
        
        this.combos1.textContent = this.player1Combos;
        this.combos2.textContent = this.player2Combos;
    }

    updateProgressBars() {
        const progress1 = Math.min((this.player1Score / this.targetScore) * 100, 100);
        const progress2 = Math.min((this.player2Score / this.targetScore) * 100, 100);
        
        this.progress1.textContent = `${Math.round(progress1)}%`;
        this.progress2.textContent = `${Math.round(progress2)}%`;
        
        this.progressFill1.style.width = `${progress1}%`;
        this.progressFill2.style.width = `${progress2}%`;
        
        // تغيير لون شريط التقدم عند الاقتراب من الفوز
        if (progress1 >= 90) {
            this.progressFill1.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else if (progress1 >= 75) {
            this.progressFill1.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
        } else {
            this.progressFill1.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
        }
        
        if (progress2 >= 90) {
            this.progressFill2.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else if (progress2 >= 75) {
            this.progressFill2.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
        } else {
            this.progressFill2.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
        }
    }

    updatePlayerCards() {
        if (this.currentPlayer === 1) {
            this.player1Card.classList.add('active');
            this.player2Card.classList.remove('active');
        } else {
            this.player1Card.classList.remove('active');
            this.player2Card.classList.add('active');
        }
    }

    updatePlayerTurnDisplay() {
        const playerName = this.getPlayerName(this.currentPlayer);
        this.turnIndicator.innerHTML = `<i class="fas fa-user-clock"></i><span>دور ${playerName}</span>`;
        
        // إضافة مؤشر تفكير للكمبيوتر
        if (this.gameMode === 'pvc' && this.currentPlayer === 2) {
            this.turnIndicator.classList.add('ai-thinking');
        } else {
            this.turnIndicator.classList.remove('ai-thinking');
        }
    }

    updateRollButtons() {
        if (!this.gameActive || this.gamePaused) {
            this.rollButton1.disabled = true;
            this.rollButton2.disabled = true;
            return;
        }
        
        if (this.currentPlayer === 1) {
            this.rollButton1.disabled = false;
            this.rollButton2.disabled = true;
        } else {
            if (this.gameMode === 'pvp') {
                this.rollButton1.disabled = true;
                this.rollButton2.disabled = false;
            } else {
                this.rollButton1.disabled = true;
                this.rollButton2.disabled = true;
            }
        }
    }

    disableRollButtons() {
        this.rollButton1.disabled = true;
        this.rollButton2.disabled = true;
    }

    enableGameButtons() {
        this.updateRollButtons();
        this.useAbility1.disabled = !document.querySelector('#player1Abilities .ability.active');
        this.useAbility2.disabled = !document.querySelector('#player2Abilities .ability.active');
    }

    disableGameButtons() {
        this.rollButton1.disabled = true;
        this.rollButton2.disabled = true;
        this.useAbility1.disabled = true;
        this.useAbility2.disabled = true;
    }

    // ====== المؤقتات ======
    startGameTimer() {
        this.gameStartTime = Date.now();
        
        clearInterval(this.gameTimerInterval);
        this.gameTimerInterval = setInterval(() => {
            const elapsed = Date.now() - this.gameStartTime;
            this.updateGameTimer(elapsed);
        }, 1000);
        
        this.startPlayerTimer();
    }

    startPlayerTimer() {
        clearInterval(this.playerTimerInterval);
        this.playerTimerInterval = setInterval(() => {
            if (this.currentPlayer === 1) {
                this.player1Time++;
                this.timePlayed1.textContent = this.formatTime(this.player1Time);
            } else {
                this.player2Time++;
                this.timePlayed2.textContent = this.formatTime(this.player2Time);
            }
        }, 1000);
    }

    resetPlayerTimer() {
        clearInterval(this.playerTimerInterval);
        this.startPlayerTimer();
    }

    updateGameTimer(elapsed) {
        const totalSeconds = Math.floor(elapsed / 1000);
        this.totalGameTime.textContent = this.formatTime(totalSeconds);
        this.gameTimer.querySelector('span').textContent = this.formatTime(totalSeconds);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // ====== السجل والإحصائيات ======
    addToHistory(player, roll, score, isSpecial = false) {
        const playerName = this.getPlayerName(player);
        const time = new Date().toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let description = '';
        if (this.rules.annoyingOne && roll === 1) {
            description = `❌ ${playerName} رمى 1 وخسر دوره`;
        } else if (isSpecial) {
            description = `🎯 ${playerName} رمى ${roll} (+${score} نقطة)`;
        } else {
            description = `🎲 ${playerName} رمى ${roll} (+${score} نقطة)`;
        }
        
        historyItem.innerHTML = `
            <div class="history-time">${time}</div>
            <div class="history-desc">${description}</div>
        `;
        
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);
        
        // حفظ الرمية في المصفوفة
        this.rollHistory.unshift({
            player,
            roll,
            score,
            time: new Date().toISOString(),
            isSpecial
        });
        
        // تحديد حجم السجل
        if (this.historyList.children.length > 10) {
            this.historyList.removeChild(this.historyList.lastChild);
        }
        
        // تحديث آخر رمية
        this.lastRoll.textContent = roll;
    }

    updateStats() {
        // تحديث متوسط الرمية
        const totalRolls = this.player1Rolls + this.player2Rolls;
        const totalScore = this.player1Score + this.player2Score;
        const average = totalRolls > 0 ? (totalScore / totalRolls).toFixed(1) : '0';
        this.averageRoll.textContent = average;
        
        // تحديث الإحصائيات الرئيسية
        this.totalRolls.textContent = parseInt(this.totalRolls.textContent) + 1;
        
        // تحديث أعلى نتيجة
        const currentHighest = parseInt(this.highestScore.textContent);
        if (this.player1Score > currentHighest) {
            this.highestScore.textContent = this.player1Score;
        }
        if (this.player2Score > currentHighest) {
            this.highestScore.textContent = this.player2Score;
        }
    }

    updateProbabilityDisplay() {
        if (!this.gameActive) return;
        
        const player1Chance = this.calculateWinProbability(1);
        const player2Chance = this.calculateWinProbability(2);
        
        this.player1Probability.style.width = `${player1Chance}%`;
        this.player2Probability.style.width = `${player2Chance}%`;
        
        this.player1ProbabilityValue.textContent = `${player1Chance}%`;
        this.player2ProbabilityValue.textContent = `${player2Chance}%`;
    }

    calculateWinProbability(player) {
        if (!this.gameActive) return 50;
        
        const playerScore = player === 1 ? this.player1Score : this.player2Score;
        const opponentScore = player === 1 ? this.player2Score : this.player1Score;
        
        const playerRemaining = Math.max(0, this.targetScore - playerScore);
        const opponentRemaining = Math.max(0, this.targetScore - opponentScore);
        
        // حساب الاحتمالية بناءً على النقاط المتبقية
        const totalRemaining = playerRemaining + opponentRemaining;
        if (totalRemaining === 0) return 50;
        
        let probability = (opponentRemaining / totalRemaining) * 100;
        
        // تعديل الاحتمالية بناءً على عدد الرميات
        const playerRolls = player === 1 ? this.player1Rolls : this.player2Rolls;
        const opponentRolls = player === 1 ? this.player2Rolls : this.player1Rolls;
        
        if (playerRolls > opponentRolls) {
            probability *= 0.9; // تقليل الاحتمالية إذا كان اللاعب استخدم رميات أكثر
        } else if (playerRolls < opponentRolls) {
            probability *= 1.1; // زيادة الاحتمالية إذا كان اللاعب استخدم رميات أقل
        }
        
        // ضمان أن تكون الاحتمالية بين 1 و99
        probability = Math.max(1, Math.min(99, probability));
        
        return Math.round(probability);
    }

    updateCombo() {
        this.currentCombo++;
        
        // تحديث عرض المجموعة
        this.comboMultiplier.textContent = this.currentCombo;
        this.comboEffect.style.display = 'flex';
        
        // تحديث شريط المجموعة
        const comboFill = this.comboCounter.querySelector('.combo-fill');
        const comboValue = this.comboCounter.querySelector('.combo-value');
        
        const comboPercentage = Math.min((this.currentCombo / 10) * 100, 100);
        comboFill.style.width = `${comboPercentage}%`;
        comboValue.textContent = this.currentCombo;
        
        // مكافآت المجموعات العالية
        if (this.currentCombo >= 5) {
            this.showNotification(`🔥 مجموعة قوية! ×${this.currentCombo}`, 'success');
        }
        
        if (this.currentCombo >= 10) {
            this.showNotification(`🚀 مجموعة أسطورية! ×${this.currentCombo}`, 'success');
            this.unlockAchievement('سيد المجموعات', 'حصلت على مجموعة من 10 رميات متتالية!');
        }
    }

    // ====== نهاية اللعبة ======
    checkGameEnd() {
        return this.player1Score >= this.targetScore || this.player2Score >= this.targetScore;
    }

    endGame() {
        this.gameActive = false;
        
        // إيقاف المؤقتات
        clearInterval(this.gameTimerInterval);
        clearInterval(this.playerTimerInterval);
        
        // تعطيل الأزرار
        this.disableGameButtons();
        
        // تحديد الفائز
        let winner = null;
        let isDraw = false;
        
        if (this.player1Score >= this.targetScore && this.player2Score >= this.targetScore) {
            isDraw = true;
        } else if (this.player1Score >= this.targetScore) {
            winner = 1;
        } else {
            winner = 2;
        }
        
        // تشغيل صوت الفوز
        this.playWinSound();
        
        // عرض شاشة الفوز
        this.showVictoryScreen(winner, isDraw);
        
        // تحديث الإحصائيات
        this.updateGameStats(winner, isDraw);
        
        // تسجيل الإنجازات
        this.recordAchievements(winner);
        
        // عرض الألعاب النارية
        this.showFireworks(20);
    }

    showVictoryScreen(winner, isDraw) {
        if (isDraw) {
            this.victoryTitle.textContent = '🤝 تعادل! 🤝';
            this.winnerName.textContent = 'تعادل';
            this.winnerScore.textContent = `اللاعب 1: ${this.player1Score} | اللاعب 2: ${this.player2Score}`;
        } else {
            const winnerName = this.getPlayerName(winner);
            const winnerScore = winner === 1 ? this.player1Score : this.player2Score;
            
            this.victoryTitle.textContent = '🏆 فوز مذهل! 🏆';
            this.winnerName.textContent = winnerName;
            this.winnerScore.textContent = `النقاط: ${winnerScore}`;
        }
        
        // تحديث إحصائيات الفوز
        const totalSeconds = Math.floor((Date.now() - this.gameStartTime) / 1000);
        this.victoryTime.textContent = this.formatTime(totalSeconds);
        this.victoryRolls.textContent = this.player1Rolls + this.player2Rolls;
        this.victoryCombo.textContent = this.currentCombo;
        
        // عرض شاشة الفوز
        this.victoryScreen.classList.add('active');
    }

    updateGameStats(winner, isDraw) {
        if (!isDraw) {
            // زيادة عدد الانتصارات
            const currentWins = parseInt(this.totalWins.textContent);
            this.totalWins.textContent = currentWins + 1;
            
            // تحديث نسبة الفوز
            const totalGames = parseInt(this.totalRolls.textContent) || 1;
            const winRateValue = Math.round(((currentWins + 1) / totalGames) * 100);
            this.winRate.textContent = `${winRateValue}%`;
        }
        
        // حفظ الإحصائيات
        this.saveGameSettings();
    }

    recordAchievements(winner) {
        // أول فوز
        if (winner === 1 && !this.achievements.firstWin) {
            this.achievements.firstWin = true;
            this.unlockAchievement('الفوز الأول', 'حصلت على أول فوز لك!');
        }
        
        // لعبة مثالية (الفوز بأقل عدد من الرميات)
        const totalRolls = this.player1Rolls + this.player2Rolls;
        if (winner === 1 && totalRolls <= 5) {
            this.achievements.perfectGame = true;
            this.unlockAchievement('لعبة مثالية', 'فزت بأقل من 5 رميات!');
        }
        
        // فوز سريع
        const gameTime = Date.now() - this.gameStartTime;
        if (winner === 1 && gameTime < 60000) { // أقل من دقيقة
            this.achievements.speedRun = true;
            this.unlockAchievement('سباق السرعة', 'فزت في أقل من دقيقة!');
        }
        
        // لاعب محظوظ
        const highRolls = Object.values(this.rollDistribution).slice(4, 6).reduce((a, b) => a + b, 0);
        if (highRolls >= 5) {
            this.achievements.luckyPlayer = true;
            this.unlockAchievement('لاعب محظوظ', 'حصلت على 5 أو أكثر من الرميات العالية!');
        }
        
        this.saveGameSettings();
    }

    unlockAchievement(title, description) {
        // إنشاء عنصر الإنجاز
        const achievement = document.createElement('div');
        achievement.className = 'achievement unlocked';
        achievement.innerHTML = `
            <i class="fas fa-award"></i>
            <div class="achievement-info">
                <span class="achievement-title">${title}</span>
                <span class="achievement-desc">${description}</span>
            </div>
        `;
        
        // إضافة إلى القائمة
        const achievementsList = document.querySelector('.achievements-list');
        achievementsList.appendChild(achievement);
        
        // عرض إشعار
        this.showNotification(`🎉 إنجاز جديد: ${title} - ${description}`, 'success');
        
        // تأثير بصري
        this.showAchievementEffect();
    }

    // ====== إعادة التعيين ======
    resetGame() {
        // إعادة تعيين النتائج
        this.player1Score = 0;
        this.player2Score = 0;
        
        // إعادة تعيين الإحصائيات
        this.player1Rolls = 0;
        this.player2Rolls = 0;
        this.player1Combos = 0;
        this.player2Combos = 0;
        this.currentCombo = 0;
        this.consecutiveRolls = 0;
        
        // إعادة تعيين المؤقتات
        this.player1Time = 0;
        this.player2Time = 0;
        clearInterval(this.gameTimerInterval);
        clearInterval(this.playerTimerInterval);
        
        // إعادة تعيين السجل
        this.rollHistory = [];
        this.rollDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
        this.historyList.innerHTML = '';
        
        // تفعيل اللعبة
        this.gameActive = true;
        this.gamePaused = false;
        this.currentPlayer = 1;
        
        // إعادة تعيين النرد
        this.diceFace.innerHTML = '<i class="fas fa-dice-d20"></i>';
        this.resultValue.textContent = '?';
        
        // إخفاء التأثيرات
        this.comboEffect.style.display = 'none';
        this.bonusEffect.style.display = 'none';
        
        // تحديث واجهة المستخدم
        this.updateUI();
        
        // بدء المؤقتات
        this.startGameTimer();
        
        // إخفاء شاشة الفوز إذا كانت ظاهرة
        this.victoryScreen.classList.remove('active');
    }

    // ====== الذكاء الاصطناعي ======
    async aiMakeMove() {
        if (!this.gameActive || this.gamePaused || this.currentPlayer !== 2) return;
        
        // عرض مؤشر تفكير
        this.turnIndicator.classList.add('thinking');
        
        // انتظار فترة محاكاة للتفكير
        await this.delay(this.ai.thinkingTime);
        
        // إزالة مؤشر التفكير
        this.turnIndicator.classList.remove('thinking');
        
        // اتخاذ قرار الرمي
        this.rollDice(2);
    }

    // ====== التأثيرات البصرية ======
    showFireworks(count) {
        if (!this.settings.animationsEnabled) return;
        
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                // موضع عشوائي
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                // حجم عشوائي
                const size = Math.random() * 10 + 5;
                
                // لون عشوائي
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // تطبيق الأنماط
                firework.style.cssText = `
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    background-color: ${color};
                    box-shadow: 0 0 20px ${color};
                `;
                
                document.body.appendChild(firework);
                
                // إزالة بعد الانتهاء
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 100);
        }
    }

    showScorePopup(player, message) {
        const playerCard = player === 1 ? this.player1Card : this.player2Card;
        
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = message;
        popup.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            font-weight: bold;
            color: #2ecc71;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 100;
            animation: popupAnimation 1s ease-out forwards;
        `;
        
        playerCard.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    showShieldEffect(player) {
        const playerCard = player === 1 ? this.player1Card : this.player2Card;
        
        playerCard.classList.add('shielded');
        
        setTimeout(() => {
            playerCard.classList.remove('shielded');
        }, 2000);
    }

    showAchievementEffect() {
        // تأثير بصري للإنجاز
        const effect = document.createElement('div');
        effect.className = 'achievement-effect';
        effect.innerHTML = '<i class="fas fa-trophy"></i>';
        
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 5rem;
            color: #f39c12;
            z-index: 1000;
            animation: achievementAnimation 2s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }

    // ====== الإشعارات ======
    showNotification(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        
        let icon = 'info-circle';
        switch (type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            case 'error':
                icon = 'times-circle';
                break;
        }
        
        alert.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        this.alertContainer.appendChild(alert);
        
        // إزالة الإشعار بعد 5 ثوانٍ
        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
        
        // إزالة الإشعار عند النقر
        alert.addEventListener('click', () => alert.remove());
    }

    // ====== الأدوات المساعدة ======
    getPlayerName(player) {
        return player === 1 ? this.player1Name : this.player2Name;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            this.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            this.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    toggleMenu() {
        this.popupMenu.classList.toggle('active');
    }

    closePopupMenu() {
        this.popupMenu.classList.remove('active');
    }

    closeSidePanel() {
        this.sidePanel.classList.remove('open');
    }

    showSettings() {
        this.showNotification('الإعدادات المتقدمة قيد التطوير', 'info');
    }

    showTutorial() {
        this.tutorialOverlay.classList.add('active');
        this.currentTutorialStep = 1;
        this.showTutorialStep(1);
    }

    showTutorialStep(step) {
        this.tutorialSteps.forEach(s => s.classList.remove('active'));
        this.progressSteps.forEach(s => s.classList.remove('active'));
        
        const stepElement = document.querySelector(`.tutorial-step[data-step="${step}"]`);
        const progressElement = document.querySelector(`.progress-step[data-step="${step}"]`);
        
        if (stepElement) stepElement.classList.add('active');
        if (progressElement) progressElement.classList.add('active');
        
        // تحديث أزرار التنقل
        this.prevTutorial.disabled = step === 1;
        this.nextTutorial.textContent = step === 4 ? 'إنهاء' : 'التالي';
    }

    nextTutorialStep() {
        if (this.currentTutorialStep < 4) {
            this.currentTutorialStep++;
            this.showTutorialStep(this.currentTutorialStep);
        } else {
            this.skipTutorial();
        }
    }

    prevTutorialStep() {
        if (this.currentTutorialStep > 1) {
            this.currentTutorialStep--;
            this.showTutorialStep(this.currentTutorialStep);
        }
    }

    goToTutorialStep(step) {
        this.currentTutorialStep = step;
        this.showTutorialStep(step);
    }

    skipTutorial() {
        this.tutorialOverlay.classList.remove('active');
    }

    playAgain() {
        this.victoryScreen.classList.remove('active');
        this.resetGame();
    }

    returnToMainMenu() {
        this.victoryScreen.classList.remove('active');
        this.gameContainer.classList.remove('visible');
        this.startScreen.classList.remove('hidden');
        
        // إيقاف الموسيقى
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    shareResults() {
        const message = `🎲 لعبة النرد المتقدمة 🎲
🏆 ${this.winnerName.textContent} فاز!
🎯 النتيجة: ${this.winnerScore.textContent}
⏱️ الوقت: ${this.victoryTime.textContent}
🎲 عدد الرميات: ${this.victoryRolls.textContent}
🔥 أعلى مجموعة: ${this.victoryCombo.textContent}

جرب اللعبة الآن!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'نتيجة لعبة النرد',
                text: message,
                url: window.location.href
            }).catch(error => console.log('Error sharing:', error));
        } else {
            // نسخ إلى الحافظة
            navigator.clipboard.writeText(message).then(() => {
                this.showNotification('تم نسخ النتيجة إلى الحافظة!', 'success');
            }).catch(error => {
                console.log('Error copying to clipboard:', error);
                this.showNotification('تعذر نسخ النتيجة', 'error');
            });
        }
    }

    saveGame() {
        const gameState = {
            player1Score: this.player1Score,
            player2Score: this.player2Score,
            currentPlayer: this.currentPlayer,
            player1Rolls: this.player1Rolls,
            player2Rolls: this.player2Rolls,
            currentCombo: this.currentCombo,
            consecutiveRolls: this.consecutiveRolls,
            gameStartTime: this.gameStartTime,
            player1Time: this.player1Time,
            player2Time: this.player2Time,
            rollHistory: this.rollHistory,
            rollDistribution: this.rollDistribution,
            rules: this.rules,
            gameMode: this.gameMode,
            targetScore: this.targetScore
        };
        
        try {
            localStorage.setItem('diceGameSave', JSON.stringify(gameState));
            this.showNotification('تم حفظ اللعبة بنجاح!', 'success');
        } catch (error) {
            console.error('Error saving game:', error);
            this.showNotification('تعذر حفظ اللعبة', 'error');
        }
    }

    loadGame() {
        try {
            const savedGame = localStorage.getItem('diceGameSave');
            if (!savedGame) {
                this.showNotification('لا توجد لعبة محفوظة', 'warning');
                return;
            }
            
            const gameState = JSON.parse(savedGame);
            
            // تحميل حالة اللعبة
            this.player1Score = gameState.player1Score;
            this.player2Score = gameState.player2Score;
            this.currentPlayer = gameState.currentPlayer;
            this.player1Rolls = gameState.player1Rolls;
            this.player2Rolls = gameState.player2Rolls;
            this.currentCombo = gameState.currentCombo;
            this.consecutiveRolls = gameState.consecutiveRolls;
            this.gameStartTime = gameState.gameStartTime;
            this.player1Time = gameState.player1Time;
            this.player2Time = gameState.player2Time;
            this.rollHistory = gameState.rollHistory;
            this.rollDistribution = gameState.rollDistribution;
            this.rules = gameState.rules;
            this.gameMode = gameState.gameMode;
            this.targetScore = gameState.targetScore;
            
            // تحديث واجهة المستخدم
            this.updateUI();
            this.rebuildHistory();
            this.startGameTimer();
            
            this.showNotification('تم تحميل اللعبة بنجاح!', 'success');
        } catch (error) {
            console.error('Error loading game:', error);
            this.showNotification('تعذر تحميل اللعبة', 'error');
        }
    }

    rebuildHistory() {
        this.historyList.innerHTML = '';
        
        this.rollHistory.forEach(record => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const playerName = this.getPlayerName(record.player);
            const time = new Date(record.time).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            let description = '';
            if (this.rules.annoyingOne && record.roll === 1) {
                description = `❌ ${playerName} رمى 1 وخسر دوره`;
            } else if (record.isSpecial) {
                description = `🎯 ${playerName} رمى ${record.roll} (+${record.score} نقطة)`;
            } else {
                description = `🎲 ${playerName} رمى ${record.roll} (+${record.score} نقطة)`;
            }
            
            historyItem.innerHTML = `
                <div class="history-time">${time}</div>
                <div class="history-desc">${description}</div>
            `;
            
            this.historyList.appendChild(historyItem);
        });
    }

    updateSettingsDisplay() {
        // تحديث أزرار الصوت والموسيقى
        if (this.settings.soundEnabled) {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
        
        if (this.settings.musicEnabled) {
            this.musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            this.musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
        }
        
        // تطبيق إعدادات الموسيقى
        this.backgroundMusic.muted = !this.settings.musicEnabled;
    }

    updateAchievementsDisplay() {
        // هذا سيكون تنفيذ مفصل لعرض الإنجازات
        // يمكن توسيعه ليعرض جميع الإنجازات المحققة
    }

    // ====== معالجة الأحداث ======
    handleKeyPress(event) {
        if (event.key === ' ') { // مفتاح المسافة
            event.preventDefault();
            if (this.gameActive && !this.gamePaused) {
                this.rollDice(this.currentPlayer);
            }
        } else if (event.key === 'Escape') {
            if (this.popupMenu.classList.contains('active')) {
                this.closePopupMenu();
            } else if (this.tutorialOverlay.classList.contains('active')) {
                this.skipTutorial();
            } else if (this.victoryScreen.classList.contains('active')) {
                this.returnToMainMenu();
            } else {
                this.toggleMenu();
            }
        } else if (event.key === 'p' || event.key === 'P') {
            this.togglePause();
        } else if (event.key === 'r' || event.key === 'R') {
            if (event.ctrlKey) {
                this.quickRestartGame();
            }
        } else if (event.key === 'h' || event.key === 'H') {
            this.showHint();
        } else if (event.key === '1') {
            if (this.gameActive && this.currentPlayer === 1) {
                this.rollDice(1);
            }
        } else if (event.key === '2') {
            if (this.gameActive && this.currentPlayer === 2 && this.gameMode === 'pvp') {
                this.rollDice(2);
            }
        }
    }

    handleResize() {
        // إعادة حساب أحجام العناصر إذا لزم الأمر
        if (this.particlesJS) {
            this.particlesJS('particles-js', 'canvas', {
                // إعادة تعيين إعدادات الجسيمات
            });
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // توقف اللعبة تلقائيًا عند ترك الصفحة
            if (this.gameActive && !this.gamePaused) {
                this.pauseGame();
                this.showNotification('توقفت اللعبة تلقائيًا', 'warning');
            }
        }
    }
}

// ====== تهيئة اللعبة عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', () => {
    // إنشاء كائن اللعبة
    const game = new AdvancedDiceGame();
    
    // جعل اللعبة متاحة عالميًا للتصحيح
    window.game = game;
    
    // إضافة أنماط CSS الديناميكية للرسوم المتحركة
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes achievementAnimation {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
            100% { transform: translate(-50%, -150%) scale(0.5); opacity: 0; }
        }
        
        .shielded {
            animation: shieldPulse 2s ease-in-out;
        }
        
        @keyframes shieldPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
            50% { box-shadow: 0 0 0 20px rgba(52, 152, 219, 0); }
        }
        
        .ai-thinking::after {
            content: '...';
            animation: thinkingDots 1.5s infinite;
        }
        
        @keyframes thinkingDots {
            0%, 100% { content: '.'; }
            33% { content: '..'; }
            66% { content: '...'; }
        }
        
        .rolling {
            animation: diceRoll 1s ease-out;
        }
        
        @keyframes diceRoll {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }
    `;
    document.head.appendChild(style);
});
