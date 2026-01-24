const minDistance = 80;//اقل مسافه مسموح فيها بين سمكه وسمكه
const avoidStrength = 0.2;// ابتعاد السمك عن بعضها اذا كانو يمشو بنفس الاتجاه
const playerSpeed = 0.02;//سرعه السمكه الي يتحكم فيها اللاعب 
let score=0;
const scoreElment=document.getElementById("score");
let mouseX = 0;
let mouseY = 0;
let gameOver = false;//متغير يجدد جاله اللعبه اذا انتهت او لا

const userControlledFish = document.querySelector('.fish-main');//متغير للسمكه الي يتجكم فيها اللاعب
const bait = document.querySelector('.fish-bait');

// تتبع حركة الماوس
document.addEventListener('mousemove', (e) => {//داله تسمع وقوع حدث تحرك الماوس  تنفذ الكودarrow function
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// كلاس السمكة العشوائية 
class Fish {
    constructor(element) {
        this.element = element;
        this.x = Math.random() * window.innerWidth;
        this.y = 50 + Math.random() * (window.innerHeight - 100);
        this.speed = (Math.random() * 0.4) + 0.5;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.vx = this.direction * this.speed;
        this.vy = 0;

        this.element.style.left = this.x + "px";//يحول المسافه من  الحواف من رقم الى بكسل
        this.element.style.top = this.y + "px";
        this.element.style.transform = this.direction === -1 ? "scaleX(-1)" : "scaleX(-1)";//يخلي السمكه تلف
    }

    computeSeparation(fishes) {//ابتعاد كل سمكه عن السمك الاخرى لتجنب التكدس
        let sepX = 0, sepY = 0;
        fishes.forEach(other => {
            if (other === this) return;
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0 && dist < minDistance) {
                sepX += (dx / dist) * ((minDistance - dist) / minDistance);
                sepY += (dy / dist) * ((minDistance - dist) / minDistance);
            }
        });
        return {sepX, sepY};
    }

    update(fishes) {
        this.vx = (this.direction === 1 ? 1 : -1) * this.speed;
        this.vy = 0;

        const separation = this.computeSeparation(fishes);
        this.vx += separation.sepX * avoidStrength;
        this.vy += separation.sepY * avoidStrength;

        this.x += this.vx;
        this.y += this.vy;

        const margin = 20;
        if (this.x < margin) { this.x = margin; this.vx = Math.abs(this.vx); this.direction = 1; } 
        if (this.x > window.innerWidth - margin) { this.x = window.innerWidth - margin; this.vx = -Math.abs(this.vx); this.direction = -1; }
        if (this.y < margin) { this.y = margin; this.vy = Math.abs(this.vy); } 
        if (this.y > window.innerHeight - margin) { this.y = window.innerHeight - margin; this.vy = -Math.abs(this.vy); }

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        this.element.style.transform = this.direction === -1 ? "scaleX(-1)" : "scaleX(1)";
    }
}

//  إنشاء السمكات العشوائية 
const randomFishElements = document.querySelectorAll('.fish-auto');
let fishes = [];
randomFishElements.forEach(el => { fishes.push(new Fish(el)); });

//  وضع الطعم في مكان عشوائي 
function placeBaitRandomly() {
    const baitWidth = bait.offsetWidth;
    const baitHeight = bait.offsetHeight;
    const marginX = baitWidth/2 + 10;
    const marginY = baitHeight/2 + 10;

    const x = marginX + Math.random() * (window.innerWidth - 2 * marginX);
    const y = marginY + Math.random() * (window.innerHeight - 2 * marginY);

    bait.style.left = x + "px";
    bait.style.top = y + "px";
}

placeBaitRandomly();

// دالة الرسوم المتحركة الرئيسية 
function animate() {
    if (gameOver) return;

    // حركة السمكة الرئيسية
    if (userControlledFish) {
        const fishX = userControlledFish.offsetLeft + userControlledFish.offsetWidth/2;
        const fishY = userControlledFish.offsetTop + userControlledFish.offsetHeight/2;
        const dx = mouseX - fishX;
        const dy = mouseY - fishY;

        userControlledFish.style.left = (userControlledFish.offsetLeft + dx*playerSpeed) + "px";
        userControlledFish.style.top = (userControlledFish.offsetTop + dy*playerSpeed) + "px";
    }

    // تحديث السمكات العشوائية
    fishes.forEach(fish => fish.update(fishes));

    // الاصطدام مع السمكات العشوائية
    fishes.forEach(fish => {
        const mainX = userControlledFish.offsetLeft + userControlledFish.offsetWidth / 2;
        const mainY = userControlledFish.offsetTop + userControlledFish.offsetHeight / 2;
        const dx = mainX - (fish.x + fish.element.offsetWidth / 2);
        const dy = mainY - (fish.y + fish.element.offsetHeight / 2);
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 40) { // مسافة الاصطدام
            document.getElementById("game-over").style.display = "flex";
            gameOver = true;
        }
    });

    // الاصطدام مع الطعم
    if (userControlledFish) {
        const fishRect = userControlledFish.getBoundingClientRect();
        const baitRect = bait.getBoundingClientRect();
        const dx = (fishRect.left + fishRect.width/2) - (baitRect.left + baitRect.width/2);
        const dy = (fishRect.top + fishRect.height/2) - (baitRect.top + baitRect.height/2);
        const distance = Math.sqrt(dx*dx + dy*dy);
        const fishRadius = Math.max(fishRect.width, fishRect.height)/2;
        const baitRadius = Math.max(baitRect.width, baitRect.height)/2;

        if (distance < fishRadius + baitRadius) {
            score++;
            scoreElment.textContent=score;
            placeBaitRandomly(); // السمكة التهمت الطعم
        }

    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

//دوال التحكم 
function restartGame() { window.location.reload(); }
function exitGame() {
    const userConfirmation = confirm("هل تريد الخروج من اللعبة؟");
    if (userConfirmation) {
        if (window.history.length > 1) { window.history.back(); } else { window.close(); }
    }
}

// ربط الأزرار بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    const restartBtn = document.getElementById("restart-btn");
    const exitBtn = document.getElementById("exit-btn");
    if (restartBtn) restartBtn.addEventListener("click", restartGame);
    if (exitBtn) exitBtn.addEventListener("click", exitGame);

    const gameOverScreen = document.getElementById("game-over");
    if (gameOverScreen) gameOverScreen.style.display = "none";
});








