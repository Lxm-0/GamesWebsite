/**
 * محاكي الطوارئ الطبية المتقدم v2.1 (النسخة المصححة والمحسنة)
 * نظام محاكاة ديناميكي مع 21 حالة طارئة
 */

// 1. قاعدة بيانات الحالات الطارئة (21 حالة)
const medicalCases = [
    {
        id: 1,
        name: "سالم أحمد",
        age: 45,
        gender: "ذكر",
        diagnosis: "نوبة قلبية حادة (STEMI)",
        difficulty: "متوسط",
        vitals: { bp: "140/90", hr: 110, o2: 92, temp: 37.2 },
        symptoms: ["ألم ضاغط في الصدر", "تعرق بارد", "ضيق تنفس", "ألم يمتد للفك"],
        correctActions: ["ecg", "aspirin", "oxygen", "nitroglycerin", "cath-lab"],
        feedback: "التدخل السريع في حالات احتشاء العضلة القلبية ينقذ الأنسجة من التلف الدائم."
    },
    {
        id: 2,
        name: "ليلى محمود",
        age: 28,
        gender: "أنثى",
        diagnosis: "صدمة تحسسية (Anaphylaxis)",
        difficulty: "صعب",
        vitals: { bp: "85/50", hr: 130, o2: 88, temp: 37.0 },
        symptoms: ["تورم في الوجه", "تزيير بالصدر", "طفح جلدي مفاجئ", "هبوط حاد بالضغط"],
        correctActions: ["epinephrine", "oxygen", "iv-fluids", "steroids", "antihistamine"],
        feedback: "الأدرينالين هو الخط الأول والمنقذ للحياة في الصدمة التحسسية."
    },
    {
        id: 3,
        name: "خالد العتيبي",
        age: 65,
        gender: "ذكر",
        diagnosis: "سكتة دماغية إقفارية (Stroke)",
        difficulty: "صعب",
        vitals: { bp: "180/110", hr: 85, o2: 96, temp: 36.8 },
        symptoms: ["تدلي في جانب الوجه", "ضعف في الذراع الأيمن", "صعوبة في النطق", "صداع مفاجئ"],
        correctActions: ["neuro-exam", "ct-scan", "glucose-check", "tpa", "neuro-consult"],
        feedback: "الوقت هو الدماغ (Time is Brain)؛ كل دقيقة تأخير تعني فقدان ملايين الخلايا العصبية."
    },
    {
        id: 4,
        name: "ياسين عمر",
        age: 12,
        gender: "ذكر",
        diagnosis: "نوبة ربو حادة (Acute Asthma)",
        difficulty: "سهل",
        vitals: { bp: "110/70", hr: 125, o2: 89, temp: 37.2 },
        symptoms: ["صعوبة شديدة في الزفير", "استخدام العضلات المساعدة", "سعال جاف", "قلق شديد"],
        correctActions: ["nebulizer", "oxygen", "steroids", "lung-auscultation", "peak-flow"],
        feedback: "موسعات الشعب الهوائية سريعة المفعول هي المفتاح لفتح الممرات الهوائية."
    },
    {
        id: 5,
        name: "فاطمة الزهراء",
        age: 34,
        gender: "أنثى",
        diagnosis: "حماض كيتوني سكري (DKA)",
        difficulty: "متوسط",
        vitals: { bp: "100/60", hr: 115, o2: 98, temp: 37.5 },
        symptoms: ["رائحة فم تشبه الفاكهة", "تنفس سريع وعميق", "جفاف شديد", "ألم في البطن"],
        correctActions: ["iv-fluids", "insulin-drip", "potassium-check", "blood-gas", "glucose-monitor"],
        feedback: "التعويض التدريجي للسوائل والأنسولين يصحح الخلل الكيميائي في الدم."
    },
    {
        id: 6,
        name: "عبد الله محمد",
        age: 50,
        gender: "ذكر",
        diagnosis: "انسداد رئوي (Pulmonary Embolism)",
        difficulty: "صعب",
        vitals: { bp: "90/60", hr: 120, o2: 85, temp: 37.4 },
        symptoms: ["ألم حاد عند التنفس", "نفث دموي بسيط", "تورم في الساق اليسرى", "تسارع نبض مفاجئ"],
        correctActions: ["oxygen", "ct-angio", "heparin", "iv-fluids", "d-dimer"],
        feedback: "الاشتباه السريري العالي ضروري لتشخيص الجلطة الرئوية القاتلة."
    },
    {
        id: 7,
        name: "سارة علي",
        age: 22,
        gender: "أنثى",
        diagnosis: "تسمم بالباراسيتامول (Paracetamol Toxicity)",
        difficulty: "متوسط",
        vitals: { bp: "120/80", hr: 95, o2: 99, temp: 36.5 },
        symptoms: ["غثيان وقيء", "ألم في المراق الأيمن", "يرقان بسيط", "خمول"],
        correctActions: ["n-acetylcysteine", "activated-charcoal", "liver-enzymes", "toxicology-screen", "gastric-lavage"],
        feedback: "الـ NAC هو الترياق النوعي الذي يحمي الكبد من الفشل الحاد."
    },
    {
        id: 8,
        name: "يوسف حسن",
        age: 40,
        gender: "ذكر",
        diagnosis: "نزيف هضمي علوي (Upper GI Bleed)",
        difficulty: "متوسط",
        vitals: { bp: "80/40", hr: 140, o2: 94, temp: 36.2 },
        symptoms: ["قيء دموي (مثل القهوة)", "براز أسود", "شحوب شديد", "دوخة عند الوقوف"],
        correctActions: ["iv-fluids", "blood-transfusion", "ppi-iv", "endoscopy", "ng-tube"],
        feedback: "استقرار الحالة الهيموديناميكية يسبق دائماً إجراء المنظار."
    },
    {
        id: 9,
        name: "مريم إبراهيم",
        age: 29,
        gender: "أنثى",
        diagnosis: "تسمم الحمل (Eclampsia)",
        difficulty: "صعب",
        vitals: { bp: "170/110", hr: 105, o2: 95, temp: 37.1 },
        symptoms: ["تشنجات عامة", "صداع شديد", "زغللة في العين", "حامل في الشهر الثامن"],
        correctActions: ["magnesium-sulfate", "hydralazine", "airway-protection", "fetal-monitor", "urgent-delivery"],
        feedback: "كبريتات المغنيسيوم هي العلاج الأمثل لمنع وتدبير تشنجات تسمم الحمل."
    },
    {
        id: 10,
        name: "فهد سليمان",
        age: 19,
        gender: "ذكر",
        diagnosis: "استرواح الصدر الضاغط (Tension Pneumothorax)",
        difficulty: "صعب",
        vitals: { bp: "70/40", hr: 150, o2: 80, temp: 36.9 },
        symptoms: ["انحراف الرغامي", "غياب أصوات التنفس في جهة واحدة", "انتفاخ أوردة الرقبة", "صدمة دورانية"],
        correctActions: ["needle-decompression", "chest-tube", "oxygen", "iv-fluids", "chest-xray"],
        feedback: "تنفيس الصدر بالإبرة هو إجراء إسعافي فوري قبل حتى صورة الأشعة."
    },
    {
        id: 11,
        name: "نورة جاسم",
        age: 72,
        gender: "أنثى",
        diagnosis: "إنتان دموي (Sepsis)",
        difficulty: "متوسط",
        vitals: { bp: "85/55", hr: 118, o2: 91, temp: 39.2 },
        symptoms: ["ارتباك ذهني", "حمى ورعشة", "قلة تبول", "التهاب مسالك سابق"],
        correctActions: ["iv-fluids", "antibiotics-iv", "blood-culture", "lactate-level", "foley-catheter"],
        feedback: "ساعة الإنتان الذهبية تتطلب سوائل ومضادات حيوية واسعة الطيف فوراً."
    },
    {
        id: 12,
        name: "منصور زايد",
        age: 55,
        gender: "ذكر",
        diagnosis: "وذمة رئوية حادة (Acute Pulmonary Edema)",
        difficulty: "متوسط",
        vitals: { bp: "190/100", hr: 110, o2: 82, temp: 37.0 },
        symptoms: ["ضيق تنفس عند الاستلقاء", "بلغم وردي رغوي", "خراخر في الرئتين", "تعب شديد"],
        correctActions: ["furosemide", "nitroglycerin-iv", "cpap", "morphine", "ecg"],
        feedback: "مدرات البول وتخفيف الحمل الراجع يقللان من احتقان الرئتين."
    },
    {
        id: 13,
        name: "حمدان سعيد",
        age: 25,
        gender: "ذكر",
        diagnosis: "جرعة زائدة من الأفيونات (Opioid Overdose)",
        difficulty: "سهل",
        vitals: { bp: "100/60", hr: 55, o2: 75, temp: 36.0 },
        symptoms: ["حدقات دبوسية", "تنفس بطيء جداً", "زرقة في الشفاه", "فقدان وعي"],
        correctActions: ["naloxone", "bag-valve-mask", "airway-adjunct", "oxygen", "toxicology-screen"],
        feedback: "النالكسون يعيد الوعي والتنفس بشكل دراماتيكي في حالات التسمم بالأفيون."
    },
    {
        id: 14,
        name: "ريم خالد",
        age: 42,
        gender: "أنثى",
        diagnosis: "انسداد الأمعاء الحاد (Acute Bowel Obstruction)",
        difficulty: "متوسط",
        vitals: { bp: "110/70", hr: 105, o2: 97, temp: 37.8 },
        symptoms: ["إمساك وتوقف غازات", "قيء برازي", "انتفاخ شديد في البطن", "ألم مغصي"],
        correctActions: ["ng-tube", "iv-fluids", "abdominal-xray", "surgical-consult", "npo-status"],
        feedback: "أنبوب الأنف المعدي (NG Tube) يريح الأمعاء ويمنع الاستنشاق الرئوي."
    },
    {
        id: 15,
        name: "سلطان ناصر",
        age: 31,
        gender: "ذكر",
        diagnosis: "التهاب السحايا الجرثومي (Bacterial Meningitis)",
        difficulty: "صعب",
        vitals: { bp: "115/75", hr: 110, o2: 96, temp: 39.8 },
        symptoms: ["صلابة نقرة (رقبة)", "رهاب الضوء", "صداع انفجاري", "طفح فرفري"],
        correctActions: ["lumbar-puncture", "antibiotics-iv", "steroids", "ct-head", "isolation"],
        feedback: "البزل القطني ضروري للتشخيص، لكن لا تؤخر المضادات إذا كان هناك تأخير."
    },
    {
        id: 16,
        name: "هيا محمد",
        age: 60,
        gender: "أنثى",
        diagnosis: "انفصال الشبكية الحاد (Retinal Detachment)",
        difficulty: "سهل",
        vitals: { bp: "130/85", hr: 80, o2: 98, temp: 36.7 },
        symptoms: ["ستارة سوداء تغطي الرؤية", "ومضات ضوئية", "أجسام عائمة", "فقدان رؤية مفاجئ غير مؤلم"],
        correctActions: ["eye-patch", "ophthalmo-consult", "bed-rest", "visual-acuity", "fundoscopy"],
        feedback: "حالة طارئة في طب العيون تتطلب تثبيت المريض واستشارة جراحية فورية."
    },
    {
        id: 17,
        name: "بدر جابر",
        age: 48,
        gender: "ذكر",
        diagnosis: "التهاب البنكرياس الحاد (Acute Pancreatitis)",
        difficulty: "متوسط",
        vitals: { bp: "105/65", hr: 115, o2: 94, temp: 38.2 },
        symptoms: ["ألم بطني يمتد للظهر", "قيء مستمر", "تاريخ حصوات مرارية", "ألم يخف عند الانحناء للأمام"],
        correctActions: ["iv-fluids-aggressive", "analgesia", "amylase-lipase", "ultrasound", "npo-status"],
        feedback: "التعويض الكثيف للسوائل هو حجر الزاوية في علاج التهاب البنكرياس."
    },
    {
        id: 18,
        name: "أمل يوسف",
        age: 26,
        gender: "أنثى",
        diagnosis: "حمل خارج الرحم متمزق (Ruptured Ectopic Pregnancy)",
        difficulty: "صعب",
        vitals: { bp: "80/50", hr: 135, o2: 95, temp: 36.4 },
        symptoms: ["ألم حوضي حاد", "نزيف مهبلي بسيط", "إغماء", "تأخر الدورة الشهرية"],
        correctActions: ["iv-fluids", "pregnancy-test", "ultrasound-fast", "surgical-consult", "cross-match-blood"],
        feedback: "أي امرأة في سن الإنجاب تعاني من صدمة هي حالة حمل خارج الرحم حتى يثبت العكس."
    },
    {
        id: 19,
        name: "فيصل فهد",
        age: 52,
        gender: "ذكر",
        diagnosis: "تسلخ الأبهر (Aortic Dissection)",
        difficulty: "صعب",
        vitals: { bp: "210/120", hr: 100, o2: 96, temp: 36.8 },
        symptoms: ["ألم تمزيقي في الظهر", "اختلاف الضغط بين الذراعين", "نبض ضعيف في الساق", "قلق الموت"],
        correctActions: ["beta-blocker-iv", "ct-aorta", "pain-control", "surgical-consult", "blood-pressure-control"],
        feedback: "السيطرة الصارمة على الضغط والنبض تمنع توسع التسلخ القاتل."
    },
    {
        id: 20,
        name: "سعدون علي",
        age: 38,
        gender: "ذكر",
        diagnosis: "ضربة شمس (Heat Stroke)",
        difficulty: "متوسط",
        vitals: { bp: "100/60", hr: 130, o2: 95, temp: 41.5 },
        symptoms: ["جلد جاف وحار", "توهان وهذيان", "تشنجات", "تاريخ تعرض للشمس"],
        correctActions: ["evaporative-cooling", "iv-fluids-cool", "internal-temp-monitor", "electrolyte-check", "oxygen"],
        feedback: "التبريد السريع والفعال هو الإجراء الوحيد الذي يقلل الوفيات في ضربة الشمس."
    },
    {
        id: 21,
        name: "جاسم حمد",
        age: 44,
        gender: "ذكر",
        diagnosis: "انسداد مجرى الهواء بجسم غريب (FBAO)",
        difficulty: "سهل",
        vitals: { bp: "120/80", hr: 120, o2: 70, temp: 37.0 },
        symptoms: ["عدم القدرة على الكلام", "إمساك الرقبة (علامة الاختناق)", "زرقة وجه", "سعال غير فعال"],
        correctActions: ["heimlich-maneuver", "back-blows", "oxygen", "visual-inspection", "cricothyroidotomy-prep"],
        feedback: "مناورة هيمليك هي الإجراء الفوري لإنقاذ المختنق قبل فقدان الوعي."
    }
];

// 2. قائمة الإجراءات المتاحة
const allActions = [
    { id: "ecg", name: "رسم قلب (ECG)", icon: "fas fa-heartbeat" },
    { id: "aspirin", name: "إعطاء أسبرين", icon: "fas fa-pills" },
    { id: "oxygen", name: "أكسجين", icon: "fas fa-lungs" },
    { id: "nitroglycerin", name: "نيتروجليسرين", icon: "fas fa-syringe" },
    { id: "cath-lab", name: "قسطرة قلبية", icon: "fas fa-hospital" },
    { id: "epinephrine", name: "أدرينالين (IM)", icon: "fas fa-syringe" },
    { id: "iv-fluids", name: "سوائل وريدية", icon: "fas fa-tint" },
    { id: "steroids", name: "كورتيزون", icon: "fas fa-vial" },
    { id: "antihistamine", name: "مضاد هيستامين", icon: "fas fa-pills" },
    { id: "neuro-exam", name: "فحص عصبي", icon: "fas fa-brain" },
    { id: "ct-scan", name: "أشعة مقطعية", icon: "fas fa-x-ray" },
    { id: "glucose-check", name: "قياس السكر", icon: "fas fa-droplet" },
    { id: "tpa", name: "مذيب جلطات (tPA)", icon: "fas fa-biohazard" },
    { id: "neuro-consult", name: "استشارة أعصاب", icon: "fas fa-user-md" },
    { id: "nebulizer", name: "جلسة بخار", icon: "fas fa-wind" },
    { id: "lung-auscultation", name: "فحص الصدر", icon: "fas fa-stethoscope" },
    { id: "peak-flow", name: "قياس تدفق الهواء", icon: "fas fa-gauge" },
    { id: "insulin-drip", name: "أنسولين وريدي", icon: "fas fa-syringe" },
    { id: "potassium-check", name: "فحص البوتاسيوم", icon: "fas fa-flask" },
    { id: "blood-gas", name: "غازات الدم", icon: "fas fa-vial" },
    { id: "glucose-monitor", name: "مراقبة السكر", icon: "fas fa-display" },
    { id: "ct-angio", name: "أشعة مقطعية بالصبغة", icon: "fas fa-microscope" },
    { id: "heparin", name: "هيبارين", icon: "fas fa-syringe" },
    { id: "d-dimer", name: "فحص D-Dimer", icon: "fas fa-vial" },
    { id: "n-acetylcysteine", name: "ترياق NAC", icon: "fas fa-prescription" },
    { id: "activated-charcoal", name: "فحم نشط", icon: "fas fa-mortar-pestle" },
    { id: "liver-enzymes", name: "إنزيمات كبد", icon: "fas fa-flask" },
    { id: "toxicology-screen", name: "مسح سموم", icon: "fas fa-vial" },
    { id: "gastric-lavage", name: "غسيل معدة", icon: "fas fa-hose" },
    { id: "blood-transfusion", name: "نقل دم", icon: "fas fa-droplet" },
    { id: "ppi-iv", name: "مثبط بروتون وريدي", icon: "fas fa-pills" },
    { id: "endoscopy", name: "منظار هضمي", icon: "fas fa-camera" },
    { id: "ng-tube", name: "أنبوب أنفي معدي", icon: "fas fa-lines-leaning" },
    { id: "magnesium-sulfate", name: "كبريتات مغنيسيوم", icon: "fas fa-flask" },
    { id: "hydralazine", name: "مخفض ضغط وريدي", icon: "fas fa-syringe" },
    { id: "airway-protection", name: "تأمين مجرى الهواء", icon: "fas fa-mask-ventilator" },
    { id: "fetal-monitor", name: "تخطيط قلب الجنين", icon: "fas fa-baby" },
    { id: "urgent-delivery", name: "توليد عاجل", icon: "fas fa-person-pregnant" },
    { id: "needle-decompression", name: "تنفيس بالإبرة", icon: "fas fa-syringe" },
    { id: "chest-tube", name: "أنبوب صدري", icon: "fas fa-pipe-valve" },
    { id: "chest-xray", name: "أشعة صدر", icon: "fas fa-x-ray" },
    { id: "antibiotics-iv", name: "مضاد حيوي وريدي", icon: "fas fa-vial-virus" },
    { id: "blood-culture", name: "مزرعة دم", icon: "fas fa-microscope" },
    { id: "lactate-level", name: "مستوى اللاكتات", icon: "fas fa-flask" },
    { id: "foley-catheter", name: "قسطرة بولية", icon: "fas fa-faucet" },
    { id: "furosemide", name: "مدر بول (لازيكس)", icon: "fas fa-droplet-slash" },
    { id: "nitroglycerin-iv", name: "نيترو وريدي", icon: "fas fa-syringe" },
    { id: "cpap", name: "جهاز تنفس CPAP", icon: "fas fa-mask-ventilator" },
    { id: "morphine", name: "مورفين", icon: "fas fa-pills" },
    { id: "naloxone", name: "نالكسون", icon: "fas fa-syringe" },
    { id: "bag-valve-mask", name: "تهوية بالحقيبة", icon: "fas fa-lungs" },
    { id: "airway-adjunct", name: "أنبوب هوائي", icon: "fas fa-mask-face" },
    { id: "abdominal-xray", name: "أشعة بطن", icon: "fas fa-x-ray" },
    { id: "surgical-consult", name: "استشارة جراحة", icon: "fas fa-user-doctor" },
    { id: "npo-status", name: "منع الأكل والشرب", icon: "fas fa-ban" },
    { id: "lumbar-puncture", name: "بزل قطني", icon: "fas fa-syringe" },
    { id: "ct-head", name: "أشعة مقطعية للرأس", icon: "fas fa-brain" },
    { id: "isolation", name: "عزل طبي", icon: "fas fa-door-closed" },
    { id: "eye-patch", name: "غطاء عين", icon: "fas fa-eye-slash" },
    { id: "ophthalmo-consult", name: "استشارة عيون", icon: "fas fa-eye" },
    { id: "bed-rest", name: "راحة تامة", icon: "fas fa-bed" },
    { id: "visual-acuity", name: "فحص حدة النظر", icon: "fas fa-eye" },
    { id: "fundoscopy", name: "فحص قاع العين", icon: "fas fa-magnifying-glass" },
    { id: "iv-fluids-aggressive", name: "سوائل وريدية مكثفة", icon: "fas fa-droplet" },
    { id: "analgesia", name: "مسكنات قوية", icon: "fas fa-pills" },
    { id: "amylase-lipase", name: "إنزيمات بنكرياس", icon: "fas fa-flask" },
    { id: "ultrasound", name: "أشعة تلفزيونية", icon: "fas fa-wave-square" },
    { id: "pregnancy-test", name: "تحليل حمل", icon: "fas fa-vial" },
    { id: "ultrasound-fast", name: "أشعة FAST", icon: "fas fa-wave-square" },
    { id: "cross-match-blood", name: "تطابق دم", icon: "fas fa-droplet" },
    { id: "beta-blocker-iv", name: "حاصر بيتا وريدي", icon: "fas fa-syringe" },
    { id: "ct-aorta", name: "أشعة مقطعية للأبهر", icon: "fas fa-x-ray" },
    { id: "pain-control", name: "التحكم بالألم", icon: "fas fa-pills" },
    { id: "blood-pressure-control", name: "ضبط الضغط", icon: "fas fa-gauge" },
    { id: "evaporative-cooling", name: "تبريد بالتبخير", icon: "fas fa-snowflake" },
    { id: "iv-fluids-cool", name: "سوائل مبردة", icon: "fas fa-droplet" },
    { id: "internal-temp-monitor", name: "مراقبة حرارة داخلية", icon: "fas fa-thermometer" },
    { id: "electrolyte-check", name: "فحص أملاح الدم", icon: "fas fa-flask" },
    { id: "heimlich-maneuver", name: "مناورة هيمليك", icon: "fas fa-person-rays" },
    { id: "back-blows", name: "ضربات الظهر", icon: "fas fa-hand-back-fist" },
    { id: "visual-inspection", name: "فحص بصري للحلق", icon: "fas fa-magnifying-glass" },
    { id: "cricothyroidotomy-prep", name: "تجهيز شق حنجري", icon: "fas fa-kit-medical" }
];

// 3. حالة اللعبة
let state = {
    currentCaseIndex: 0,
    score: 0,
    timeLeft: 1200, // 20 دقيقة لـ 21 حالة لضمان وقت كافٍ
    timerInterval: null,
    selectedActions: [],
    history: [],
    casesCompleted: 0,
    isGameOver: false,
    vitalsInterval: null
};

// 4. عناصر DOM
const dom = {
    timer: document.getElementById('timer'),
    score: document.getElementById('score'),
    patientName: document.getElementById('patient-name'),
    patientAge: document.getElementById('patient-age'),
    patientGender: document.getElementById('patient-gender'),
    patientAvatar: document.getElementById('patient-avatar'),
    difficulty: document.getElementById('case-difficulty'),
    bp: document.getElementById('blood-pressure'),
    hr: document.getElementById('heart-rate'),
    o2: document.getElementById('oxygen-saturation'),
    temp: document.getElementById('temperature'),
    symptoms: document.getElementById('symptoms-list'),
    actions: document.getElementById('actions-container'),
    history: document.getElementById('action-history'),
    progressFill: document.getElementById('progress-fill'),
    progressPercent: document.getElementById('progress-percent'),
    search: document.getElementById('action-search'),
    tabs: document.querySelectorAll('.tab-btn'),
    submitBtn: document.getElementById('submit-btn'),
    resetBtn: document.getElementById('reset-btn'),
    resultsModal: document.getElementById('results-modal'),
    finalModal: document.getElementById('final-modal'),
    nextCaseBtn: document.getElementById('next-case-btn'),
    restartBtn: document.getElementById('restart-btn')
};

// 5. وظائف اللعبة الأساسية
function init() {
    state.currentCaseIndex = 0;
    state.score = 0;
    state.casesCompleted = 0;
    state.isGameOver = false;
    state.timeLeft = 1200;
    loadCase(0);
    startGlobalTimer();
    setupEventListeners();
}

function loadCase(index) {
    const medicalCase = medicalCases[index];
    state.selectedActions = [];
    state.history = [];
    
    dom.patientName.textContent = medicalCase.name;
    dom.patientAge.textContent = medicalCase.age;
    dom.patientGender.textContent = medicalCase.gender;
    dom.difficulty.textContent = medicalCase.difficulty;
    dom.patientAvatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(medicalCase.name)}`;
    
    updateVitalsUI(medicalCase.vitals);
    startDynamicVitals(medicalCase.vitals);
    
    dom.symptoms.innerHTML = medicalCase.symptoms.map(s => `<span class="symptom-tag">${s}</span>`).join('');
    
    renderActions();
    updateProgress();
    renderHistory();
    
    dom.resultsModal.style.display = 'none';
}

function renderActions(filter = "") {
    dom.actions.innerHTML = allActions
        .filter(a => a.name.includes(filter))
        .map(a => `
            <div class="action-card ${state.selectedActions.includes(a.id) ? 'selected' : ''}" onclick="toggleAction('${a.id}')">
                <i class="${a.icon}"></i>
                <span>${a.name}</span>
            </div>
        `).join('');
}

function toggleAction(id) {
    if (state.isGameOver) return;
    
    const index = state.selectedActions.indexOf(id);
    const action = allActions.find(a => a.id === id);
    
    if (index === -1) {
        state.selectedActions.push(id);
        state.history.push({ 
            id, 
            name: action.name, 
            time: new Date().toLocaleTimeString('ar-SA', { minute: '2-digit', second: '2-digit' }) 
        });
        simulateVitalChange(id);
    } else {
        state.selectedActions.splice(index, 1);
        state.history = state.history.filter(h => h.id !== id);
    }
    
    renderActions(dom.search.value);
    renderHistory();
    updateProgress();
}

function simulateVitalChange(actionId) {
    // محاكاة استجابة العلامات الحيوية للإجراءات
    if (actionId === 'oxygen') {
        let currentO2 = parseInt(dom.o2.textContent);
        if (currentO2 < 98) dom.o2.textContent = Math.min(99, currentO2 + 5);
    }
    if (actionId === 'iv-fluids' || actionId === 'epinephrine') {
        let hr = parseInt(dom.hr.textContent);
        dom.hr.textContent = Math.max(60, hr - 10);
    }
}

function updateProgress() {
    const currentCase = medicalCases[state.currentCaseIndex];
    const correctCount = state.selectedActions.filter(a => currentCase.correctActions.includes(a)).length;
    const percent = Math.round((correctCount / currentCase.correctActions.length) * 100);
    dom.progressFill.style.width = `${percent}%`;
    dom.progressPercent.textContent = `${percent}%`;
}

function renderHistory() {
    if (state.history.length === 0) {
        dom.history.innerHTML = '<p class="empty-msg">لا توجد إجراءات متخذة بعد</p>';
        return;
    }
    dom.history.innerHTML = state.history.map(h => `
        <div class="timeline-item">
            <div class="time-stamp">${h.time}</div>
            <div class="action-name">${h.name}</div>
        </div>
    `).reverse().join('');
}

function startGlobalTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        const mins = Math.floor(state.timeLeft / 60);
        const secs = state.timeLeft % 60;
        dom.timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            endGame();
        }
    }, 1000);
}

function startDynamicVitals(vitals) {
    if (state.vitalsInterval) clearInterval(state.vitalsInterval);
    state.vitalsInterval = setInterval(() => {
        // تذبذب طبيعي بسيط في العلامات الحيوية
        const hrVar = Math.floor(Math.random() * 3) - 1;
        const tempVar = (Math.random() * 0.2 - 0.1).toFixed(1);
        
        let currentHR = parseInt(dom.hr.textContent);
        let currentTemp = parseFloat(dom.temp.textContent);
        
        if (!isNaN(currentHR)) dom.hr.textContent = currentHR + hrVar;
        if (!isNaN(currentTemp)) dom.temp.textContent = (currentTemp + parseFloat(tempVar)).toFixed(1);
    }, 3000);
}

function updateVitalsUI(vitals) {
    dom.bp.textContent = vitals.bp;
    dom.hr.textContent = vitals.hr;
    dom.o2.textContent = vitals.o2;
    dom.temp.textContent = vitals.temp;
}

function submitCase() {
    const currentCase = medicalCases[state.currentCaseIndex];
    const correctActions = currentCase.correctActions;
    const userActions = state.selectedActions;
    
    let correctCount = 0;
    let mistakes = [];
    
    userActions.forEach(a => {
        if (correctActions.includes(a)) {
            correctCount++;
        } else {
            mistakes.push(allActions.find(action => action.id === a).name);
        }
    });
    
    const accuracy = Math.round((correctCount / Math.max(correctActions.length, userActions.length)) * 100) || 0;
    state.score += accuracy;
    dom.score.textContent = state.score;
    
    showResults(accuracy, currentCase, mistakes);
}

function showResults(accuracy, medicalCase, mistakes) {
    dom.resultsModal.style.display = 'flex';
    document.getElementById('case-diagnosis').textContent = medicalCase.diagnosis;
    document.getElementById('score-text').textContent = `${accuracy}%`;
    document.getElementById('score-circle-fill').style.strokeDasharray = `${accuracy}, 100`;
    document.getElementById('feedback-text').textContent = medicalCase.feedback;
    
    // المقاييس
    document.getElementById('accuracy-metric').style.width = `${accuracy}%`;
    document.getElementById('speed-metric').style.width = `${Math.min(100, (state.timeLeft / 1200) * 100)}%`;
    
    // النجوم
    const starCount = Math.ceil(accuracy / 20);
    document.getElementById('star-rating').innerHTML = '<i class="fas fa-star"></i>'.repeat(starCount) + '<i class="far fa-star"></i>'.repeat(5 - starCount);
    
    // القوائم
    document.getElementById('correct-path-list').innerHTML = medicalCase.correctActions.map(a => `<li>${allActions.find(action => action.id === a).name}</li>`).join('');
    document.getElementById('mistakes-list').innerHTML = mistakes.length > 0 ? mistakes.map(m => `<li>${m}</li>`).join('') : '<li>لا توجد أخطاء</li>';
}

function nextCase() {
    state.currentCaseIndex++;
    state.casesCompleted++;
    
    if (state.currentCaseIndex < medicalCases.length) {
        loadCase(state.currentCaseIndex);
    } else {
        endGame();
    }
}

function endGame() {
    state.isGameOver = true;
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.vitalsInterval) clearInterval(state.vitalsInterval);
    
    dom.finalModal.style.display = 'flex';
    document.getElementById('final-score').textContent = state.score;
    document.getElementById('final-cases-count').textContent = state.casesCompleted;
    
    let rank = "طبيب مقيم";
    if (state.score > 1800) rank = "استشاري أول";
    else if (state.score > 1200) rank = "أخصائي";
    document.getElementById('final-rank').textContent = rank;
}

function setupEventListeners() {
    // إزالة المستمعين القدامى لتجنب التكرار
    const newSearch = dom.search.cloneNode(true);
    dom.search.parentNode.replaceChild(newSearch, dom.search);
    dom.search = newSearch;
    
    dom.search.addEventListener('input', (e) => renderActions(e.target.value));
    
    dom.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            dom.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${target}-tab`).classList.add('active');
        });
    });
    
    dom.submitBtn.onclick = submitCase;
    dom.resetBtn.onclick = () => {
        state.selectedActions = [];
        state.history = [];
        renderActions();
        renderHistory();
        updateProgress();
    };
    
    dom.nextCaseBtn.onclick = nextCase;
    dom.restartBtn.onclick = () => {
        dom.finalModal.style.display = 'none';
        init();
    };
}

// تشغيل اللعبة
window.onload = init;