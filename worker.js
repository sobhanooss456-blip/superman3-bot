// ======================================================
// Telegram Movie Bot
// Cloudflare Workers + Telegram Bot API + KV
//
// Required:
//   env.BOT_TOKEN
//   env.ADMIN_ID
//   env.BOT_DATA  -> Cloudflare KV binding
//
// Optional:
//   env.BOT_USERNAME -> username without @
//
// No Mini App / no Web App
// Languages: fa, en, ar, zh, de, ru
// ======================================================

const CHANNEL_USERNAME = "@Super_Pump2";
const CHANNEL_URL = "https://t.me/Super_Pump2";

const LANGUAGES = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
  zh: "简体中文",
  de: "Deutsch",
  ru: "Русский"
};

// ------------------------------------------------------
// Translations
// ------------------------------------------------------

const TEXT = {
  fa: {
    start: "سلام! به ربات فیلم خوش آمدی.",
    joinText: "برای استفاده از ربات ابتدا در کانال زیر عضو شو و سپس روی «بررسی عضویت» بزن.",
    join: "عضویت در کانال",
    checkJoin: "بررسی عضویت",
    menu: "از منوی زیر استفاده کن.",
    getMovie: "🎬 دریافت فیلم",
    submitMovie: "📤 ارسال فیلم",
    requestMovie: "🔎 درخواست فیلم",
    favorites: "⭐ علاقه‌مندی‌ها",
    inviteFriends: "👥 دعوت از دوستان",
    language: "🌐 تغییر زبان",
    adminPanel: "🛠 پنل مدیریت",
    back: "🔙 بازگشت",
    chooseLanguage: "زبان موردنظر را انتخاب کن:",
    askMovie: "ویدئو یا فایل فیلم را همراه با کپشن ارسال کن. خط اول کپشن باید نام فیلم باشد.",
    askRequest: "نام فیلم موردنظرت را در یک پیام بنویس.",
    captionTip: "برای ثبت فیلم، ارسال ویدئو یا فایل همراه با کپشن و نام فیلم الزامی است.",
    submitted: "فیلمت برای بررسی مدیر ارسال شد.",
    adminSaved: "فیلم با موفقیت به آرشیو اضافه شد.",
    noMovies: "هنوز فیلمی در آرشیو ثبت نشده است.",
    blocked: "دسترسی حساب کاربری تو به ربات محدود شده است.",
    panelTitle: "پنل مدیریت",
    addMovie: "➕ افزودن فیلم",
    pending: "📥 بررسی فیلم‌های ارسالی",
    requests: "📨 درخواست‌های فیلم",
    users: "👤 کاربران",
    deleteMovies: "🗑 حذف فیلم",
    manageAdmins: "🔐 مدیریت مدیران",
    primaryOnly: "این عملیات فقط برای مدیر اصلی فعال است.",
    cancelled: "عملیات لغو شد.",
    confirmDelete: "آیا از حذف این فیلم مطمئنی؟ این کار قابل بازگشت نیست.",
    deleted: "فیلم حذف شد.",
    approve: "✅ تأیید",
    reject: "❌ رد",
    markDone: "✔ رسیدگی شد",
    noFavorites: "هنوز فیلمی را به علاقه‌مندی‌ها اضافه نکرده‌ای.",
    requestSaved: "درخواست فیلم ثبت شد.",
    requestPriority: "درخواستت با اولویت ثبت شد؛ بابت دعوت از دوستان ممنونیم.",
    inviteReward: "تبریک! با دعوت از سه کاربر جدید، یک اعتبار درخواست اولویت‌دار دریافت کردی.",
    notFound: "مورد موردنظر پیدا نشد.",
    addAdminPrompt: "شناسه عددی تلگرام کاربر را بفرست تا به مدیران اضافه شود.",
    adminAdded: "مدیر جدید اضافه شد.",
    adminRemoved: "دسترسی مدیر حذف شد.",
    blockedDone: "کاربر مسدود شد.",
    unblockedDone: "مسدودی کاربر برداشته شد.",
    mediaOnly: "لطفاً یک ویدئو یا فایل ارسال کن.",
    ratingSaved: "امتیازت ثبت شد. ممنون!",
    alreadyRated: "قبلاً برای این فیلم امتیاز ثبت کرده‌ای.",
    movieCaption: "🎬 {title}\n👁 بازدید: {views}\n⭐ میانگین امتیاز: {rating}",
    newSubmission: "فیلم جدید برای بررسی ارسال شده است.",
    newRequest: "درخواست جدید فیلم",
    next: "⏭ فیلم دیگر",
    toggleFavorite: "⭐ افزودن/حذف علاقه‌مندی",
    addedFavorite: "به علاقه‌مندی‌ها اضافه شد.",
    removedFavorite: "از علاقه‌مندی‌ها حذف شد.",
    pendingEmpty: "فیلمی برای بررسی وجود ندارد.",
    requestsEmpty: "درخواستی ثبت نشده است.",
    usersEmpty: "کاربری ثبت نشده است.",
    deletedEmpty: "فیلمی برای حذف وجود ندارد.",
    adminUsage: "این بخش فقط برای مدیران است.",
    languageSet: "زبان ربات تغییر کرد.",
    joinRequired: "ابتدا باید عضو کانال شوی.",
    approvedNotice: "فیلم ارسالی تو تأیید شد و به آرشیو اضافه شد.",
    rejectedNotice: "متأسفانه فیلم ارسالی تو تأیید نشد.",
    userInfo: "اطلاعات کاربر",
    addMovieHint: "ویدئو یا فایل فیلم را با کپشن ارسال کن. خط اول کپشن نام فیلم است.",
    requestProcessed: "درخواست فیلمت توسط مدیر بررسی شد.",
    inviteIntro: "لینک دعوت اختصاصی تو:\n{link}\n\nپس از شروع کاربر جدید با لینک تو، دعوت ثبت می‌شود. با هر سه دعوت، یک اعتبار درخواست اولویت‌دار می‌گیری."
  },

  en: {
    start: "Hello! Welcome to the movie bot.",
    joinText: "Join the channel below, then press Check Membership.",
    join: "Join Channel",
    checkJoin: "Check Membership",
    menu: "Choose an option below.",
    getMovie: "🎬 Get a Movie",
    submitMovie: "📤 Submit a Movie",
    requestMovie: "🔎 Request a Movie",
    favorites: "⭐ Favorites",
    inviteFriends: "👥 Invite Friends",
    language: "🌐 Change Language",
    adminPanel: "🛠 Admin Panel",
    back: "🔙 Back",
    chooseLanguage: "Choose your language:",
    askMovie: "Send a video or movie file with a caption. The first caption line must be the movie title.",
    askRequest: "Send the title of the movie you want.",
    captionTip: "A video/file and a caption containing the movie title are required.",
    submitted: "Your movie was submitted for admin review.",
    adminSaved: "The movie was added to the archive.",
    noMovies: "There are no movies in the archive yet.",
    blocked: "Your access to this bot has been restricted.",
    panelTitle: "Admin Panel",
    addMovie: "➕ Add Movie",
    pending: "📥 Review Submissions",
    requests: "📨 Movie Requests",
    users: "👤 Users",
    deleteMovies: "🗑 Delete Movie",
    manageAdmins: "🔐 Manage Admins",
    primaryOnly: "Only the primary admin can perform this action.",
    cancelled: "Operation cancelled.",
    confirmDelete: "Are you sure you want to delete this movie? This cannot be undone.",
    deleted: "Movie deleted.",
    approve: "✅ Approve",
    reject: "❌ Reject",
    markDone: "✔ Mark Reviewed",
    noFavorites: "You have not added any favorites yet.",
    requestSaved: "Your movie request was saved.",
    requestPriority: "Your request was marked as priority. Thanks for inviting friends!",
    inviteReward: "Congratulations! You earned one priority-request credit for inviting three new users.",
    notFound: "The requested item was not found.",
    addAdminPrompt: "Send the user's numeric Telegram ID to add them as an admin.",
    adminAdded: "Admin added.",
    adminRemoved: "Admin access removed.",
    blockedDone: "User blocked.",
    unblockedDone: "User unblocked.",
    mediaOnly: "Please send a video or a document.",
    ratingSaved: "Your rating was saved. Thank you!",
    alreadyRated: "You have already rated this movie.",
    movieCaption: "🎬 {title}\n👁 Views: {views}\n⭐ Average rating: {rating}",
    newSubmission: "A new movie submission needs review.",
    newRequest: "New movie request",
    next: "⏭ Next Movie",
    toggleFavorite: "⭐ Toggle Favorite",
    addedFavorite: "Added to favorites.",
    removedFavorite: "Removed from favorites.",
    pendingEmpty: "There are no submissions to review.",
    requestsEmpty: "There are no movie requests.",
    usersEmpty: "No users have been registered.",
    deletedEmpty: "There are no movies to delete.",
    adminUsage: "This section is for admins only.",
    languageSet: "Bot language updated.",
    joinRequired: "You must join the channel first.",
    approvedNotice: "Your submitted movie was approved and added to the archive.",
    rejectedNotice: "Unfortunately, your submitted movie was not approved.",
    userInfo: "User information",
    addMovieHint: "Send the video or file with a caption. The first caption line is the title.",
    requestProcessed: "An admin has reviewed your movie request.",
    inviteIntro: "Your personal invitation link:\n{link}\n\nNew users are counted when they start the bot using your link. Every three invites earn one priority-request credit."
  },
  ar: {
    start: "مرحبًا! أهلاً بك في بوت الأفلام.",
    joinText: "اشترك في القناة أدناه، ثم اضغط على «التحقق من الاشتراك».",
    join: "الاشتراك في القناة",
    checkJoin: "التحقق من الاشتراك",
    menu: "اختر أحد الخيارات أدناه.",
    getMovie: "🎬 الحصول على فيلم",
    submitMovie: "📤 إرسال فيلم",
    requestMovie: "🔎 طلب فيلم",
    favorites: "⭐ المفضلة",
    inviteFriends: "👥 دعوة الأصدقاء",
    language: "🌐 تغيير اللغة",
    adminPanel: "🛠 لوحة الإدارة",
    back: "🔙 رجوع",
    chooseLanguage: "اختر لغتك:",
    askMovie: "أرسل فيديو أو ملف الفيلم مع وصف. يجب أن يكون اسم الفيلم في السطر الأول.",
    askRequest: "أرسل اسم الفيلم الذي تريده.",
    captionTip: "يجب إرسال الفيديو أو الملف مع وصف يحتوي على اسم الفيلم.",
    submitted: "تم إرسال الفيلم للمراجعة من قبل الإدارة.",
    adminSaved: "تمت إضافة الفيلم إلى الأرشيف.",
    noMovies: "لا توجد أفلام في الأرشيف حتى الآن.",
    blocked: "تم تقييد وصولك إلى هذا البوت.",
    panelTitle: "لوحة الإدارة",
    addMovie: "➕ إضافة فيلم",
    pending: "📥 مراجعة الأفلام المرسلة",
    requests: "📨 طلبات الأفلام",
    users: "👤 المستخدمون",
    deleteMovies: "🗑 حذف فيلم",
    manageAdmins: "🔐 إدارة المشرفين",
    primaryOnly: "هذا الإجراء متاح للمشرف الرئيسي فقط.",
    cancelled: "تم إلغاء العملية.",
    confirmDelete: "هل تريد بالتأكيد حذف هذا الفيلم؟ لا يمكن التراجع عن ذلك.",
    deleted: "تم حذف الفيلم.",
    approve: "✅ موافقة",
    reject: "❌ رفض",
    markDone: "✔ تمت المراجعة",
    noFavorites: "لم تضف أي فيلم إلى المفضلة بعد.",
    requestSaved: "تم تسجيل طلب الفيلم.",
    requestPriority: "تم تسجيل طلبك كطلب ذي أولوية. شكرًا لدعوة أصدقائك!",
    inviteReward: "تهانينا! حصلت على رصيد لطلب ذي أولوية بعد دعوة ثلاثة مستخدمين جدد.",
    notFound: "العنصر المطلوب غير موجود.",
    addAdminPrompt: "أرسل معرّف تيليجرام الرقمي للمستخدم لإضافته مشرفًا.",
    adminAdded: "تمت إضافة المشرف.",
    adminRemoved: "تم حذف صلاحية المشرف.",
    blockedDone: "تم حظر المستخدم.",
    unblockedDone: "تم إلغاء حظر المستخدم.",
    mediaOnly: "يرجى إرسال فيديو أو ملف.",
    ratingSaved: "تم حفظ تقييمك، شكرًا لك!",
    alreadyRated: "لقد قيّمت هذا الفيلم من قبل.",
    movieCaption: "🎬 {title}\n👁 المشاهدات: {views}\n⭐ متوسط التقييم: {rating}",
    newSubmission: "يوجد فيلم جديد بانتظار المراجعة.",
    newRequest: "طلب فيلم جديد",
    next: "⏭ الفيلم التالي",
    toggleFavorite: "⭐ إضافة/إزالة من المفضلة",
    addedFavorite: "تمت الإضافة إلى المفضلة.",
    removedFavorite: "تمت الإزالة من المفضلة.",
    pendingEmpty: "لا توجد أفلام بانتظار المراجعة.",
    requestsEmpty: "لا توجد طلبات أفلام.",
    usersEmpty: "لا يوجد مستخدمون مسجلون.",
    deletedEmpty: "لا توجد أفلام لحذفها.",
    adminUsage: "هذا القسم للمشرفين فقط.",
    languageSet: "تم تغيير لغة البوت.",
    joinRequired: "يجب الاشتراك في القناة أولاً.",
    approvedNotice: "تمت الموافقة على الفيلم الذي أرسلته وإضافته إلى الأرشيف.",
    rejectedNotice: "للأسف، لم تتم الموافقة على الفيلم الذي أرسلته.",
    userInfo: "معلومات المستخدم",
    addMovieHint: "أرسل الفيديو أو الملف مع وصف. السطر الأول هو اسم الفيلم.",
    requestProcessed: "راجع المشرف طلب الفيلم الخاص بك.",
    inviteIntro: "رابط دعوتك الخاص:\n{link}\n\nيُحتسب المستخدم الجديد عند بدء البوت عبر رابطك. كل ثلاث دعوات تمنحك رصيدًا لطلب ذي أولوية."
  },

  zh: {
    start: "你好！欢迎使用电影机器人。",
    joinText: "请先加入下面的频道，然后点击“检查订阅”。",
    join: "加入频道",
    checkJoin: "检查订阅",
    menu: "请选择一个选项。",
    getMovie: "🎬 获取电影",
    submitMovie: "📤 提交电影",
    requestMovie: "🔎 请求电影",
    favorites: "⭐ 收藏",
    inviteFriends: "👥 邀请朋友",
    language: "🌐 更改语言",
    adminPanel: "🛠 管理面板",
    back: "🔙 返回",
    chooseLanguage: "请选择语言：",
    askMovie: "发送电影视频或文件，并添加说明。说明第一行必须是电影名称。",
    askRequest: "请发送你想要的电影名称。",
    captionTip: "必须发送带有电影名称说明的视频或文件。",
    submitted: "电影已提交，等待管理员审核。",
    adminSaved: "电影已添加到存档。",
    noMovies: "存档中还没有电影。",
    blocked: "你的机器人使用权限已被限制。",
    panelTitle: "管理面板",
    addMovie: "➕ 添加电影",
    pending: "📥 审核提交",
    requests: "📨 电影请求",
    users: "👤 用户",
    deleteMovies: "🗑 删除电影",
    manageAdmins: "🔐 管理管理员",
    primaryOnly: "此操作仅限主管理员使用。",
    cancelled: "操作已取消。",
    confirmDelete: "确定删除这部电影吗？此操作无法撤销。",
    deleted: "电影已删除。",
    approve: "✅ 批准",
    reject: "❌ 拒绝",
    markDone: "✔ 标记为已处理",
    noFavorites: "你还没有收藏电影。",
    requestSaved: "电影请求已保存。",
    requestPriority: "你的请求已标记为优先请求。感谢邀请朋友！",
    inviteReward: "恭喜！邀请三位新用户后，你获得了一次优先请求额度。",
    notFound: "找不到该项目。",
    addAdminPrompt: "请发送用户的 Telegram 数字 ID，以添加为管理员。",
    adminAdded: "管理员已添加。",
    adminRemoved: "管理员权限已移除。",
    blockedDone: "用户已封禁。",
    unblockedDone: "已解除用户封禁。",
    mediaOnly: "请发送视频或文件。",
    ratingSaved: "评分已保存，谢谢！",
    alreadyRated: "你已经评价过这部电影。",
    movieCaption: "🎬 {title}\n👁 播放量：{views}\n⭐ 平均评分：{rating}",
    newSubmission: "有一部新电影等待审核。",
    newRequest: "新的电影请求",
    next: "⏭ 下一部电影",
    toggleFavorite: "⭐ 添加/移除收藏",
    addedFavorite: "已添加到收藏。",
    removedFavorite: "已从收藏中移除。",
    pendingEmpty: "没有待审核的电影。",
    requestsEmpty: "没有电影请求。",
    usersEmpty: "没有注册用户。",
    deletedEmpty: "没有可删除的电影。",
    adminUsage: "此区域仅供管理员使用。",
    languageSet: "机器人语言已更新。",
    joinRequired: "请先加入频道。",
    approvedNotice: "你提交的电影已获批准并添加到存档。",
    rejectedNotice: "很遗憾，你提交的电影未获批准。",
    userInfo: "用户信息",
    addMovieHint: "发送带说明的视频或文件，第一行写电影名称。",
    requestProcessed: "管理员已处理你的电影请求。",
    inviteIntro: "你的专属邀请链接：\n{link}\n\n新用户通过该链接启动机器人后会计入邀请。每邀请三人即可获得一次优先请求额度。"
  },

  de: {
    start: "Hallo! Willkommen beim Film-Bot.",
    joinText: "Tritt zuerst dem Kanal bei und tippe danach auf „Mitgliedschaft prüfen“.",
    join: "Kanal beitreten",
    checkJoin: "Mitgliedschaft prüfen",
    menu: "Wähle eine Option aus.",
    getMovie: "🎬 Film erhalten",
    submitMovie: "📤 Film senden",
    requestMovie: "🔎 Film anfragen",
    favorites: "⭐ Favoriten",
    inviteFriends: "👥 Freunde einladen",
    language: "🌐 Sprache ändern",
    adminPanel: "🛠 Adminbereich",
    back: "🔙 Zurück",
    chooseLanguage: "Wähle deine Sprache:",
    askMovie: "Sende ein Video oder eine Filmdatei mit einer Beschreibung. Die erste Zeile muss den Filmtitel enthalten.",
    askRequest: "Sende den Titel des gewünschten Films.",
    captionTip: "Ein Video oder eine Datei mit Filmtitel in der Beschreibung ist erforderlich.",
    submitted: "Der Film wurde zur Prüfung eingereicht.",
    adminSaved: "Der Film wurde zum Archiv hinzugefügt.",
    noMovies: "Das Archiv enthält noch keine Filme.",
    blocked: "Dein Zugriff auf diesen Bot wurde eingeschränkt.",
    panelTitle: "Adminbereich",
    addMovie: "➕ Film hinzufügen",
    pending: "📥 Einsendungen prüfen",
    requests: "📨 Filmanfragen",
    users: "👤 Benutzer",
    deleteMovies: "🗑 Film löschen",
    manageAdmins: "🔐 Administratoren verwalten",
    primaryOnly: "Diese Aktion ist nur dem Hauptadministrator erlaubt.",
    cancelled: "Vorgang abgebrochen.",
    confirmDelete: "Möchtest du diesen Film wirklich löschen? Dies kann nicht rückgängig gemacht werden.",
    deleted: "Film gelöscht.",
    approve: "✅ Genehmigen",
    reject: "❌ Ablehnen",
    markDone: "✔ Als erledigt markieren",
    noFavorites: "Du hast noch keine Favoriten gespeichert.",
    requestSaved: "Deine Filmanfrage wurde gespeichert.",
    requestPriority: "Deine Anfrage wurde priorisiert. Danke fürs Einladen von Freunden!",
    inviteReward: "Glückwunsch! Für drei neue Einladungen hast du ein Guthaben für eine priorisierte Anfrage erhalten.",
    notFound: "Der gewünschte Eintrag wurde nicht gefunden.",
    addAdminPrompt: "Sende die numerische Telegram-ID des Benutzers, um ihn als Admin hinzuzufügen.",
    adminAdded: "Admin hinzugefügt.",
    adminRemoved: "Adminrechte entfernt.",
    blockedDone: "Benutzer gesperrt.",
    unblockedDone: "Benutzersperre aufgehoben.",
    mediaOnly: "Bitte sende ein Video oder eine Datei.",
    ratingSaved: "Deine Bewertung wurde gespeichert. Danke!",
    alreadyRated: "Du hast diesen Film bereits bewertet.",
    movieCaption: "🎬 {title}\n👁 Aufrufe: {views}\n⭐ Durchschnittsbewertung: {rating}",
    newSubmission: "Eine neue Filmeinsendung wartet auf Prüfung.",
    newRequest: "Neue Filmanfrage",
    next: "⏭ Nächster Film",
    toggleFavorite: "⭐ Favorit hinzufügen/entfernen",
    addedFavorite: "Zu Favoriten hinzugefügt.",
    removedFavorite: "Aus Favoriten entfernt.",
    pendingEmpty: "Keine Einsendungen zur Prüfung vorhanden.",
    requestsEmpty: "Keine Filmanfragen vorhanden.",
    usersEmpty: "Keine Benutzer registriert.",
    deletedEmpty: "Keine Filme zum Löschen vorhanden.",
    adminUsage: "Dieser Bereich ist nur für Admins.",
    languageSet: "Botsprache aktualisiert.",
    joinRequired: "Du musst zuerst dem Kanal beitreten.",
    approvedNotice: "Dein eingereichter Film wurde genehmigt und zum Archiv hinzugefügt.",
    rejectedNotice: "Dein eingereichter Film wurde leider nicht genehmigt.",
    userInfo: "Benutzerinformationen",
    addMovieHint: "Sende das Video oder die Datei mit Beschreibung. Die erste Zeile ist der Filmtitel.",
    requestProcessed: "Ein Admin hat deine Filmanfrage bearbeitet.",
    inviteIntro: "Dein persönlicher Einladungslink:\n{link}\n\nNeue Benutzer zählen, sobald sie den Bot über deinen Link starten. Je drei Einladungen bringen ein Guthaben für eine priorisierte Anfrage."
  },

  ru: {
    start: "Привет! Добро пожаловать в бот фильмов.",
    joinText: "Сначала вступи в канал, затем нажми «Проверить подписку».",
    join: "Вступить в канал",
    checkJoin: "Проверить подписку",
    menu: "Выбери нужный пункт.",
    getMovie: "🎬 Получить фильм",
    submitMovie: "📤 Отправить фильм",
    requestMovie: "🔎 Запросить фильм",
    favorites: "⭐ Избранное",
    inviteFriends: "👥 Пригласить друзей",
    language: "🌐 Изменить язык",
    adminPanel: "🛠 Панель администратора",
    back: "🔙 Назад",
    chooseLanguage: "Выбери язык:",
    askMovie: "Отправь видео или файл фильма с подписью. В первой строке должно быть название фильма.",
    askRequest: "Отправь название нужного фильма.",
    captionTip: "Необходимо отправить видео или файл с подписью, содержащей название фильма.",
    submitted: "Фильм отправлен на проверку администратору.",
    adminSaved: "Фильм добавлен в архив.",
    noMovies: "В архиве пока нет фильмов.",
    blocked: "Доступ к боту для твоего аккаунта ограничен.",
    panelTitle: "Панель администратора",
    addMovie: "➕ Добавить фильм",
    pending: "📥 Проверить отправленные фильмы",
    requests: "📨 Запросы фильмов",
    users: "👤 Пользователи",
    deleteMovies: "🗑 Удалить фильм",
    manageAdmins: "🔐 Управление администраторами",
    primaryOnly: "Это действие доступно только главному администратору.",
    cancelled: "Действие отменено.",
    confirmDelete: "Точно удалить этот фильм? Это действие нельзя отменить.",
    deleted: "Фильм удалён.",
    approve: "✅ Одобрить",
    reject: "❌ Отклонить",
    markDone: "✔ Отметить обработанным",
    noFavorites: "В избранном пока нет фильмов.",
    requestSaved: "Запрос фильма сохранён.",
    requestPriority: "Твой запрос отмечен как приоритетный. Спасибо за приглашение друзей!",
    inviteReward: "Поздравляем! За приглашение трёх новых пользователей ты получил кредит на приоритетный запрос.",
    notFound: "Элемент не найден.",
    addAdminPrompt: "Отправь числовой Telegram ID пользователя, чтобы добавить его в администраторы.",
    adminAdded: "Администратор добавлен.",
    adminRemoved: "Права администратора удалены.",
    blockedDone: "Пользователь заблокирован.",
    unblockedDone: "Блокировка пользователя снята.",
    mediaOnly: "Отправь видео или файл.",
    ratingSaved: "Твоя оценка сохранена. Спасибо!",
    alreadyRated: "Ты уже оценивал этот фильм.",
    movieCaption: "🎬 {title}\n👁 Просмотры: {views}\n⭐ Средний рейтинг: {rating}",
    newSubmission: "Новый фильм ожидает проверки.",
    newRequest: "Новый запрос фильма",
    next: "⏭ Следующий фильм",
    toggleFavorite: "⭐ Добавить/убрать из избранного",
    addedFavorite: "Добавлено в избранное.",
    removedFavorite: "Удалено из избранного.",
    pendingEmpty: "Нет фильмов для проверки.",
    requestsEmpty: "Запросов фильмов нет.",
    usersEmpty: "Зарегистрированных пользователей нет.",
    deletedEmpty: "Нет фильмов для удаления.",
    adminUsage: "Этот раздел доступен только администраторам.",
    languageSet: "Язык бота изменён.",
    joinRequired: "Сначала вступи в канал.",
    approvedNotice: "Твой фильм одобрен и добавлен в архив.",
    rejectedNotice: "К сожалению, твой фильм не был одобрен.",
    userInfo: "Информация о пользователе",
    addMovieHint: "Отправь видео или файл с подписью. Первая строка — название фильма.",
    requestProcessed: "Администратор рассмотрел твой запрос фильма.",
    inviteIntro: "Твоя персональная ссылка для приглашений:\n{link}\n\nНовые пользователи учитываются после запуска бота по твоей ссылке. Каждые три приглашения дают кредит на приоритетный запрос."
  }
};

// ------------------------------------------------------
// General helpers
// ------------------------------------------------------

function t(user, key, replacements = {}) {
  const lang = user && TEXT[user.lang] ? user.lang : "fa";
  let value = TEXT[lang][key] ?? TEXT.en[key] ?? key;

  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replaceAll({${name}}, String(replacement));
  }

  return value;
}

function newId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 6)
  );
}

async function readJSON(env, key, fallback) {
  const raw = await env.BOT_DATA.get(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJSON(env, key, value) {
  await env.BOT_DATA.put(key, JSON.stringify(value));
}

async function telegram(env, method, payload = {}) {
  const response = await fetch(
    https://api.telegram.org/bot${env.BOT_TOKEN}/${method},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const result = await response.json().catch(() => ({
    ok: false,
    description: "Invalid Telegram API response"
  }));

  if (!response.ok || !result.ok) {
    console.error("Telegram API error:", method, result.description);
  }

  return result;
}

async function sendText(env, chatId, text, extra = {}) {
  return telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    ...extra
  });
}

async function answerCallback(env, callbackId, text = "") {
  return telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackId,
    text
  });
}

async function getUser(env, userId) {
  return readJSON(env, user:${userId}, null);
}

async function saveUser(env, user) {
  await writeJSON(env, user:${user.id}, user);
}

async function ensureUser(env, from) {
  const id = String(from.id);
  let user = await getUser(env, id);
  const isNew = !user;

  if (!user) {
    user = {
      id,
      name: from.first_name || "User",
      username: from.username || "",
      lang: "fa",
      blocked: false,
      state: null,
      favorites: [],
      views: 0,
      invites: 0,
      priorityCredits: 0,
      referralRewards: 0,
      referredBy: null,
      createdAt: Date.now()
    };

    const index = await readJSON(env, "users:index", []);
    if (!index.includes(id)) {
      index.push(id);
      await writeJSON(env, "users:index", index);
    }
  } else {
    user.name = from.first_name  user.name  "User";
    user.username = from.username  user.username  "";
  }

  user.id = id;
  user.lang = TEXT[user.lang] ? user.lang : "fa";
  user.favorites = Array.isArray(user.favorites) ? user.favorites : [];

  await saveUser(env, user);

  return {
    user,
    isNew
  };
}

async function getMovies(env) {
  const movies = await readJSON(env, "movies", []);
  return Array.isArray(movies) ? movies : [];
}

async function saveMovies(env, movies) {
  await writeJSON(env, "movies", movies);
}

async function getPending(env) {
  const list = await readJSON(env, "movie:pending", []);
  return Array.isArray(list) ? list : [];
}

async function savePending(env, list) {
  await writeJSON(env, "movie:pending", list);
}

async function getRequests(env) {
  const list = await readJSON(env, "movie:requests", []);
  return Array.isArray(list) ? list : [];
}

async function saveRequests(env, list) {
  await writeJSON(env, "movie:requests", list);
}

async function isPrimaryAdmin(env, userId) {
  return String(env.ADMIN_ID || "") === String(userId);
}

async function isAdmin(env, userId) {
  if (await isPrimaryAdmin(env, userId)) {
    return true;
  }

  const admins = await readJSON(env, "admin:approved", []);
  return Array.isArray(admins) &&
    admins.map(String).includes(String(userId));
}

async function getAllUsers(env) {
  const ids = await readJSON(env, "users:index", []);
  const users = [];

  for (const id of ids) {
    const user = await getUser(env, id);

    if (user) {
      users.push(user);
    }
  }

  return users;
}

// ------------------------------------------------------
// Channel membership
// ------------------------------------------------------

async function isChannelMember(env, userId) {
  const result = await telegram(env, "getChatMember", {
    chat_id: CHANNEL_USERNAME,
    user_id: Number(userId)
  });

  if (!result.ok || !result.result) {
    return false;
  }

  const status = result.result.status;

  return [
    "creator",
    "administrator",
    "member"
  ].includes(status) ||
    (
      status === "restricted" &&
      result.result.is_member === true
    );
}

async function showJoinPrompt(env, chatId, user) {
  await sendText(env, chatId, t(user, "joinText"), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t(user, "join"),
            url: CHANNEL_URL
          }
        ],
        [
          {
            text: t(user, "checkJoin"),
            callback_data: "join:check"
          }
        ]
      ]
    }
  });
}

// ------------------------------------------------------
// Reply keyboard: no Mini App buttons
// ------------------------------------------------------

function mainKeyboard(user, admin) {
  const rows = [
    [
      { text: t(user, "getMovie") },
      { text: t(user, "favorites") }
    ],
    [
      { text: t(user, "submitMovie") },
      { text: t(user, "requestMovie") }
    ],
    [
      { text: t(user, "inviteFriends") },
      { text: t(user, "language") }
    ]
  ];

  if (admin) {
    rows.push([
      { text: t(user, "adminPanel") }
    ]);
  }

  return {
    keyboard: rows,
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true
  };
}

async function showMain(env, chatId, user) {
  const admin = await isAdmin(env, user.id);

  await sendText(env, chatId, t(user, "menu"), {
    reply_markup: mainKeyboard(user, admin)
  });
}

async function showLanguagePicker(env, chatId, user) {
  const rows = [];

  for (const [code, name] of Object.entries(LANGUAGES)) {
    rows.push([
      {
        text: name,
        callback_data: lang:${code}
      }
    ]);
  }

  await sendText(env, chatId, t(user, "chooseLanguage"), {
    reply_markup: {
      inline_keyboard: rows
    }
  });
       }
// ------------------------------------------------------
// Referrals
// Every three new referrals grant one priority request.
// ------------------------------------------------------

async function processReferral(env, user, startParameter) {
  const match = /^ref_(\d+)$/.exec(startParameter || "");

  if (!match) {
    return;
  }

  const referrerId = String(match[1]);

  if (
    referrerId === String(user.id) ||
    user.referredBy
  ) {
    return;
  }

  const referrer = await getUser(env, referrerId);

  if (!referrer) {
    return;
  }

  let referrals = await readJSON(
    env,
    referrals:${referrerId},
    []
  );

  if (!Array.isArray(referrals)) {
    referrals = [];
  }

  if (referrals.includes(String(user.id))) {
    return;
  }

  referrals.push(String(user.id));

  user.referredBy = referrerId;
  await saveUser(env, user);

  await writeJSON(
    env,
    referrals:${referrerId},
    referrals
  );

  referrer.invites = referrals.length;

  if (referrals.length % 3 === 0) {
    referrer.priorityCredits =
      Number(referrer.priorityCredits || 0) + 1;

    referrer.referralRewards =
      Number(referrer.referralRewards || 0) + 1;

    await sendText(
      env,
      referrerId,
      t(referrer, "inviteReward")
    );
  }

  await saveUser(env, referrer);
}

async function getBotUsername(env) {
  const configured = String(env.BOT_USERNAME || "")
    .replace(/^@/, "")
    .trim();

  if (configured) {
    return configured;
  }

  const cached = await env.BOT_DATA.get("bot:username");

  if (cached) {
    return cached;
  }

  const result = await telegram(env, "getMe", {});

  if (result.ok && result.result && result.result.username) {
    const username = result.result.username;

    await env.BOT_DATA.put("bot:username", username);

    return username;
  }

  return null;
}

async function sendInviteLink(env, chatId, user) {
  const username = await getBotUsername(env);

  if (!username) {
    await sendText(
      env,
      chatId,
      "BOT_USERNAME را در تنظیمات Worker تنظیم کن."
    );
    return;
  }

  const link =
    https://t.me/${username}?start=ref_${user.id};

  await sendText(env, chatId, t(user, "inviteIntro", { link }));
}

// ------------------------------------------------------
// Movie delivery and ratings
// ------------------------------------------------------

function findMovie(movies, movieId) {
  return movies.find(
    movie => String(movie.id) === String(movieId)
  );
}

async function sendMovie(env, chatId, user, movie) {
  if (!movie) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  const movies = await getMovies(env);
  const storedMovie = findMovie(movies, movie.id);

  if (!storedMovie) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  storedMovie.views = Number(storedMovie.views || 0) + 1;
  user.views = Number(user.views || 0) + 1;

  await saveMovies(env, movies);
  await saveUser(env, user);

  const ratingCount = Number(storedMovie.ratingCount || 0);
  const ratingSum = Number(storedMovie.ratingSum || 0);

  const average = ratingCount > 0
    ? (ratingSum / ratingCount).toFixed(1)
    : "—";

  const caption = t(user, "movieCaption", {
    title: storedMovie.title,
    views: storedMovie.views,
    rating: average
  });

  const alreadyRated = await env.BOT_DATA.get(
    rating:${storedMovie.id}:${user.id}
  );

  const rows = [];

  if (!alreadyRated) {
    rows.push([
      { text: "⭐ 1", callback_data: rate:${storedMovie.id}:1 },
      { text: "⭐ 2", callback_data: rate:${storedMovie.id}:2 },
      { text: "⭐ 3", callback_data: rate:${storedMovie.id}:3 },
      { text: "⭐ 4", callback_data: rate:${storedMovie.id}:4 },
      { text: "⭐ 5", callback_data: rate:${storedMovie.id}:5 }
    ]);
  }

  rows.push([
    {
      text: t(user, "toggleFavorite"),
      callback_data: fav:toggle:${storedMovie.id}
    }
  ]);

  rows.push([
    {
      text: t(user, "next"),
      callback_data: "movie:random"
    }
  ]);

  const replyMarkup = {
    inline_keyboard: rows
  };
if (storedMovie.type === "document") {
    await telegram(env, "sendDocument", {
      chat_id: chatId,
      document: storedMovie.fileId,
      caption,
      reply_markup: replyMarkup
    });
  } else {
    await telegram(env, "sendVideo", {
      chat_id: chatId,
      video: storedMovie.fileId,
      caption,
      reply_markup: replyMarkup
    });
  }
}

async function sendRandomMovie(env, chatId, user) {
  const movies = await getMovies(env);

  if (movies.length === 0) {
    await sendText(env, chatId, t(user, "noMovies"));
    return;
  }

  const movie = movies[Math.floor(Math.random() * movies.length)];

  await sendMovie(env, chatId, user, movie);
}

async function showFavorites(env, chatId, user) {
  const movies = await getMovies(env);

  const favoriteIds = new Set(
    (user.favorites || []).map(String)
  );

  const favorites = movies.filter(
    movie => favoriteIds.has(String(movie.id))
  );

  if (favorites.length === 0) {
    await sendText(env, chatId, t(user, "noFavorites"));
    return;
  }

  const buttons = favorites.map(movie => [
    {
      text: ⭐ ${String(movie.title).slice(0, 50)},
      callback_data: fav:open:${movie.id}
    }
  ]);

  buttons.push([
    {
      text: t(user, "back"),
      callback_data: "ui:menu"
    }
  ]);

  await sendText(env, chatId, t(user, "favorites"), {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

async function toggleFavorite(env, chatId, user, movieId) {
  const movies = await getMovies(env);
  const movie = findMovie(movies, movieId);

  if (!movie) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  const favorites = new Set(
    (user.favorites || []).map(String)
  );

  if (favorites.has(String(movieId))) {
    favorites.delete(String(movieId));
    await sendText(env, chatId, t(user, "removedFavorite"));
  } else {
    favorites.add(String(movieId));
    await sendText(env, chatId, t(user, "addedFavorite"));
  }

  user.favorites = Array.from(favorites);

  await saveUser(env, user);
}

async function saveRating(env, chatId, user, movieId, score) {
  const value = Number(score);

  if (!Number.isInteger(value)  value < 1  value > 5) {
    return;
  }

  const movieKey = rating:${movieId}:${user.id};
  const existing = await env.BOT_DATA.get(movieKey);

  if (existing) {
    await sendText(env, chatId, t(user, "alreadyRated"));
    return;
  }

  const movies = await getMovies(env);
  const movie = findMovie(movies, movieId);

  if (!movie) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  await env.BOT_DATA.put(movieKey, String(value));

  movie.ratingSum = Number(movie.ratingSum || 0) + value;
  movie.ratingCount = Number(movie.ratingCount || 0) + 1;

  await saveMovies(env, movies);

  await sendText(env, chatId, t(user, "ratingSaved"));
}

// ------------------------------------------------------
// Media processing
// ------------------------------------------------------

function getMedia(message) {
  if (message.video && message.video.file_id) {
    return {
      fileId: message.video.file_id,
      type: "video"
    };
  }

  if (message.document && message.document.file_id) {
    return {
      fileId: message.document.file_id,
      type: "document"
    };
  }

  return null;
}

function getTitleFromCaption(caption) {
  if (!caption) {
    return null;
  }

  const lines = caption.trim().split(/\r?\n/);
  const title = (lines.shift() || "").trim();

  return title ? title.slice(0, 100) : null;
}

async function processIncomingMedia(env, chatId, message, user) {
  const media = getMedia(message);

  if (!media) {
    await sendText(env, chatId, t(user, "mediaOnly"));
    return;
  }

  const title = getTitleFromCaption(message.caption);

  if (!title) {
    await sendText(env, chatId, t(user, "captionTip"));
    return;
  }

  const description = String(message.caption || "")
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .join("\n")
    .slice(0, 900);
  if (user.state === "await_admin_movie") {
    if (!(await isAdmin(env, user.id))) {
      user.state = null;
      await saveUser(env, user);
      await sendText(env, chatId, t(user, "adminUsage"));
      return;
    }

    const movies = await getMovies(env);

    movies.push({
      id: newId(),
      title,
      description,
      fileId: media.fileId,
      type: media.type,
      addedBy: String(user.id),
      addedAt: Date.now(),
      views: 0,
      ratingSum: 0,
      ratingCount: 0
    });

    await saveMovies(env, movies);

    user.state = null;
    await saveUser(env, user);

    await sendText(env, chatId, t(user, "adminSaved"));
    return;
  }

  if (user.state === "await_user_movie") {
    const pending = await getPending(env);

    const item = {
      id: newId(),
      title,
      description,
      fileId: media.fileId,
      type: media.type,
      userId: String(user.id),
      createdAt: Date.now()
    };

    pending.push(item);
    await savePending(env, pending);

    user.state = null;
    await saveUser(env, user);

    await sendText(env, chatId, t(user, "submitted"));

    const adminIds = new Set(
      (await readJSON(env, "admin:approved", [])).map(String)
    );

    if (env.ADMIN_ID) {
      adminIds.add(String(env.ADMIN_ID));
    }

    for (const adminId of adminIds) {
      await sendText(
        env,
        adminId,
        ${t({ lang: user.lang }, "newSubmission")}\n\n🎬 ${title},
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: t(user, "approve"),
                  callback_data: adm:approve:${item.id}
                },
                {
                  text: t(user, "reject"),
                  callback_data: adm:reject:${item.id}
                }
              ]
            ]
          }
        }
      );
    }

    return;
  }

  await sendText(env, chatId, t(user, "useButtons"));
}

// ------------------------------------------------------
// Admin panel
// ------------------------------------------------------

async function showAdminPanel(env, chatId, user) {
  if (!(await isAdmin(env, user.id))) {
    await sendText(env, chatId, t(user, "adminUsage"));
    return;
  }

  const rows = [
    [
      { text: t(user, "addMovie"), callback_data: "adm:add" }
    ],
    [
      { text: t(user, "pending"), callback_data: "adm:pending" },
      { text: t(user, "requests"), callback_data: "adm:requests" }
    ],
    [
      { text: t(user, "users"), callback_data: "adm:users" }
    ],
    [
      { text: t(user, "deleteMovies"), callback_data: "adm:delete" }
    ]
  ];

  if (await isPrimaryAdmin(env, user.id)) {
    rows.push([
      {
        text: t(user, "manageAdmins"),
        callback_data: "adm:admins"
      }
    ]);
  }

  rows.push([
    {
      text: t(user, "back"),
      callback_data: "ui:menu"
    }
  ]);

  await sendText(env, chatId, t(user, "panelTitle"), {
    reply_markup: {
      inline_keyboard: rows
    }
  });
}

async function showPending(env, chatId, user) {
  const pending = await getPending(env);

  if (pending.length === 0) {
    await sendText(env, chatId, t(user, "pendingEmpty"));
    return;
  }

  for (const item of pending.slice(0, 30)) {
    await sendText(
      env,
      chatId,
      🎬 ${item.title}\n👤 User ID: ${item.userId},
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: t(user, "approve"),
                callback_data: adm:approve:${item.id}
              },
              {
                text: t(user, "reject"),
                callback_data: adm:reject:${item.id}
              }
            ]
          ]
        }
      }
    );
  }
}

async function approveSubmission(env, chatId, user, submissionId) {
  const pending = await getPending(env);
  const index = pending.findIndex(
    item => String(item.id) === String(submissionId)
  );

  if (index === -1) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }
  const item = pending[index];
  const movies = await getMovies(env);

  movies.push({
    id: newId(),
    title: item.title,
    description: item.description || "",
    fileId: item.fileId,
    type: item.type,
    addedBy: String(item.userId),
    addedAt: Date.now(),
    views: 0,
    ratingSum: 0,
    ratingCount: 0
  });

  await saveMovies(env, movies);

  pending.splice(index, 1);
  await savePending(env, pending);

  await sendText(env, chatId, t(user, "adminSaved"));

  const submittedUser = await getUser(env, item.userId);

  if (submittedUser) {
    await sendText(
      env,
      item.userId,
      t(submittedUser, "approvedNotice")
    );
  }
}

async function rejectSubmission(env, chatId, user, submissionId) {
  const pending = await getPending(env);
  const index = pending.findIndex(
    item => String(item.id) === String(submissionId)
  );

  if (index === -1) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  const item = pending[index];

  pending.splice(index, 1);
  await savePending(env, pending);

  await sendText(env, chatId, t(user, "cancelled"));

  const submittedUser = await getUser(env, item.userId);

  if (submittedUser) {
    await sendText(
      env,
      item.userId,
      t(submittedUser, "rejectedNotice")
    );
  }
}

async function showRequests(env, chatId, user) {
  const requests = await getRequests(env);

  if (requests.length === 0) {
    await sendText(env, chatId, t(user, "requestsEmpty"));
    return;
  }

  for (const request of requests.slice(0, 30)) {
    const priority = request.priority ? "⚡ " : "";
    const text =
      ${t(user, "newRequest")}\n +
      ${priority}${request.title}\n +
      User ID: ${request.userId};

    await sendText(env, chatId, text, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: t(user, "markDone"),
              callback_data: adm:reqdone:${request.id}
            }
          ]
        ]
      }
    });
  }
}

async function markRequestDone(env, chatId, user, requestId) {
  const requests = await getRequests(env);
  const index = requests.findIndex(
    item => String(item.id) === String(requestId)
  );

  if (index === -1) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  const request = requests[index];

  requests.splice(index, 1);
  await saveRequests(env, requests);

  const requester = await getUser(env, request.userId);

  if (requester) {
    await sendText(
      env,
      request.userId,
      t(requester, "requestProcessed")
    );
  }

  await sendText(env, chatId, t(user, "cancelled"));
}

async function showUsers(env, chatId, user) {
  const users = await getAllUsers(env);

  if (users.length === 0) {
    await sendText(env, chatId, t(user, "usersEmpty"));
    return;
  }

  // The user-management screen displays the 20 most recent users.
  const recent = users.slice(-20).reverse();

  const rows = recent.map(item => [{
    text:
      ${item.blocked ? "🚫" : "👤"}  +
      ${String(item.name || item.id).slice(0, 25)} (${item.id}),
    callback_data: adm:user:${item.id}
  }]);

  rows.push([
    {
      text: t(user, "back"),
      callback_data: "adm:panel"
    }
  ]);

  await sendText(
    env,
    chatId,
    ${t(user, "users")}\n${users.length} registered users.,
    {
      reply_markup: {
        inline_keyboard: rows
      }
    }
  );
}

async function showUserDetails(env, chatId, user, targetId) {
  const target = await getUser(env, targetId);

  if (!target) {
    await sendText(env, chatId, t(user, "notFound"));
    return;
  }

  const rows = [];

  if (target.blocked) {
    rows.push([
      {
        text: "✅ Unblock",
        callback_data: adm:unblock:${target.id}
      }
    ]);
  } else {
    rows.push([
      {
        text: "🚫 Block",
        callback_data: adm:block:${target.id}
      }
    ]);
  }

  rows.push([
    {
      text: t(user, "back"),
      callback_data: "adm:users"
    }
  ]);
await sendText(
    env,
    chatId,
    ${t(user, "userInfo")}\n\n +
    ID: ${target.id}\n +
    Name: ${target.name || "—"}\n +
    Username: ${target.username ? "@" + target.username : "—"}\n +
    Blocked: ${target.blocked ? "Yes" : "No"}\n +
    Views: ${Number(target.views || 0)}\n +
    Invites: ${Number(target.invites || 0)},
    {
      reply_markup: {
        inline_keyboard: rows
      }
    }
  );
}

async function showDeletableMovies(env, chatId, user) {
  const movies = await getMovies(env);

  if (movies.length === 0) {
    await sendText(env, chatId, t(user, "deletedEmpty"));
    return;
  }

  const rows = movies.slice(0, 50).map(movie => [
    {
      text: 🗑 ${String(movie.title).slice(0, 45)},
      callback_data: adm:del:${movie.id}
    }
  ]);

  rows.push([
    {
      text: t(user, "back"),
      callback_data: "adm:panel"
    }
  ]);

  await sendText(env, chatId, t(user, "deleteMovies"), {
    reply_markup: {
      inline_keyboard: rows
    }
  });
}

async function deleteKVPrefix(env, prefix) {
  let cursor = undefined;

  do {
    const page = await env.BOT_DATA.list({
      prefix,
      limit: 1000,
      ...(cursor ? { cursor } : {})
    });

    await Promise.all(
      page.keys.map(key => env.BOT_DATA.delete(key.name))
    );

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
}

async function deleteMovieSafely(env, movieId) {
  const movies = await getMovies(env);
  const exists = findMovie(movies, movieId);

  if (!exists) {
    return false;
  }

  const updatedMovies = movies.filter(
    movie => String(movie.id) !== String(movieId)
  );

  await saveMovies(env, updatedMovies);

  // Remove individual user-rating records for this movie.
  await deleteKVPrefix(env, rating:${movieId}:);

  // Remove the deleted movie from users' favorites.
  const users = await getAllUsers(env);

  for (const user of users) {
    const before = user.favorites || [];

    user.favorites = before.filter(
      id => String(id) !== String(movieId)
    );

    if (user.favorites.length !== before.length) {
      await saveUser(env, user);
    }
  }

  return true;
}

async function showAdminList(env, chatId, user) {
  if (!(await isPrimaryAdmin(env, user.id))) {
    await sendText(env, chatId, t(user, "primaryOnly"));
    return;
  }

  const admins = await readJSON(env, "admin:approved", []);
  const rows = [];

  for (const id of admins) {
    rows.push([
      {
        text: ❌ Remove admin ${id},
        callback_data: adm:adminrm:${id}
      }
    ]);
  }

  rows.push([
    {
      text: "➕ Add admin",
      callback_data: "adm:adminadd"
    }
  ]);

  rows.push([
    {
      text: t(user, "back"),
      callback_data: "adm:panel"
    }
  ]);

  await sendText(env, chatId, t(user, "manageAdmins"), {
    reply_markup: {
      inline_keyboard: rows
    }
  });
}

// ------------------------------------------------------
// Message handler
// ------------------------------------------------------

async function handleMessage(env, message) {
  if (!message  !message.from  !message.chat) {
    return;
  }

  const chatId = message.chat.id;
  const { user, isNew } = await ensureUser(env, message.from);

  const text = String(message.text || "").trim();

  // Commands
  if (text.startsWith("/start")) {
    const match = text.match(/^\/start(?:@\w+)?(?:\s+(.+))?$/);
    const parameter = match ? String(match[1] || "").trim() : "";

    user.state = null;
    await saveUser(env, user);

    if (isNew && parameter) {
      await processReferral(env, user, parameter);
    }

    await sendText(env, chatId, t(user, "start"));

    if (
      !(await isAdmin(env, user.id)) &&
      !(await isChannelMember(env, user.id))
    ) {
      await showJoinPrompt(env, chatId, user);
    }

    await showMain(env, chatId, user);
    return;
  }

  if (text === "/menu") {
    user.state = null;
    await saveUser(env, user);
    await showMain(env, chatId, user);
    return;
        }
  if (text === "/admin") {
    if (!(await isAdmin(env, user.id))) {
      await sendText(env, chatId, t(user, "adminUsage"));
      return;
    }

    await showAdminPanel(env, chatId, user);
    return;
  }

  if (user.blocked && !(await isAdmin(env, user.id))) {
    await sendText(env, chatId, t(user, "blocked"));
    return;
  }

  // Language selection is available even before channel membership.
  if (text === t(user, "language")) {
    await showLanguagePicker(env, chatId, user);
    return;
  }

  const admin = await isAdmin(env, user.id);

  if (!admin && !(await isChannelMember(env, user.id))) {
    await showJoinPrompt(env, chatId, user);
    return;
  }

  // Process admin states before normal menu options.
  if (user.state === "await_admin_add") {
    if (!(await isPrimaryAdmin(env, user.id))) {
      user.state = null;
      await saveUser(env, user);
      await sendText(env, chatId, t(user, "primaryOnly"));
      return;
    }

    if (!/^\d+$/.test(text)) {
      await sendText(env, chatId, t(user, "adminUsage"));
      return;
    }

    const newAdminId = String(text);

    if (newAdminId === String(env.ADMIN_ID)) {
      user.state = null;
      await saveUser(env, user);
      await sendText(env, chatId, t(user, "adminAdded"));
      return;
    }

    const admins = await readJSON(env, "admin:approved", []);

    if (!admins.map(String).includes(newAdminId)) {
      admins.push(newAdminId);
    }

    await writeJSON(env, "admin:approved", admins);

    user.state = null;
    await saveUser(env, user);

    await sendText(env, chatId, t(user, "adminAdded"));
    return;
  }

  if (user.state === "await_request_title") {
    if (!text) {
      await sendText(env, chatId, t(user, "askRequest"));
      return;
    }

    const priority = Number(user.priorityCredits || 0) > 0;

    if (priority) {
      user.priorityCredits = Number(user.priorityCredits) - 1;
    }

    const requests = await getRequests(env);

    const request = {
      id: newId(),
      userId: String(user.id),
      title: text.slice(0, 200),
      priority,
      createdAt: Date.now()
    };

    requests.push(request);
    await saveRequests(env, requests);

    user.state = null;
    await saveUser(env, user);

    await sendText(
      env,
      chatId,
      priority
        ? t(user, "requestPriority")
        : t(user, "requestSaved")
    );

    const adminIds = new Set(
      (await readJSON(env, "admin:approved", [])).map(String)
    );

    if (env.ADMIN_ID) {
      adminIds.add(String(env.ADMIN_ID));
    }

    for (const adminId of adminIds) {
      await sendText(
        env,
        adminId,
        ${t(user, "newRequest")}\n +
        ${priority ? "⚡ " : ""}${request.title}\n +
        User ID: ${user.id},
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: t(user, "markDone"),
                  callback_data: adm:reqdone:${request.id}
                }
              ]
            ]
          }
        }
      );
    }

    return;
  }

  if (user.state === "await_user_movie" || user.state === "await_admin_movie") {
    if (getMedia(message)) {
      await processIncomingMedia(env, chatId, message, user);
    } else {
      await sendText(
        env,
        chatId,
        user.state === "await_admin_movie"
          ? t(user, "addMovieHint")
          : t(user, "askMovie")
      );
    }

    return;
  }

  // Main menu
  if (text === t(user, "getMovie")) {
    await sendRandomMovie(env, chatId, user);
    return;
  }

  if (text === t(user, "favorites")) {
    await showFavorites(env, chatId, user);
    return;
  }

  if (text === t(user, "submitMovie")) {
    user.state = "await_user_movie";
    await saveUser(env, user);
    await sendText(env, chatId, t(user, "askMovie"));
    return;
  }

  if (text === t(user, "requestMovie")) {
    user.state = "await_request_title";
    await saveUser(env, user);
    await sendText(env, chatId, t(user, "askRequest"));
    return;
  }
if (text === t(user, "inviteFriends")) {
    await sendInviteLink(env, chatId, user);
    return;
  }

  if (text === t(user, "adminPanel")) {
    if (!(await isAdmin(env, user.id))) {
      await sendText(env, chatId, t(user, "adminUsage"));
      return;
    }

    await showAdminPanel(env, chatId, user);
    return;
  }

  if (text === t(user, "back")) {
    user.state = null;
    await saveUser(env, user);
    await showMain(env, chatId, user);
    return;
  }

  // A received video/document without selecting a menu option.
  if (getMedia(message)) {
    await sendText(env, chatId, t(user, "useButtons"));
    return;
  }

  await sendText(env, chatId, t(user, "menu"), {
    reply_markup: mainKeyboard(user, admin)
  });
}

// ------------------------------------------------------
// Callback handler
// ------------------------------------------------------

async function handleCallback(env, query) {
  const from = query.from;
  const chatId = query.message?.chat?.id || from.id;
  const data = String(query.data || "");

  const { user } = await ensureUser(env, from);
  const admin = await isAdmin(env, user.id);

  await answerCallback(env, query.id);

  if (user.blocked && !admin) {
    await sendText(env, chatId, t(user, "blocked"));
    return;
  }

  // Language buttons work independently of channel membership.
  if (data.startsWith("lang:")) {
    const lang = data.slice(5);

    if (!TEXT[lang]) {
      return;
    }

    user.lang = lang;
    user.state = null;

    await saveUser(env, user);
    await sendText(env, chatId, t(user, "languageSet"));
    await showMain(env, chatId, user);
    return;
  }

  // Membership check
  if (data === "join:check") {
    if (admin || await isChannelMember(env, user.id)) {
      await sendText(env, chatId, t(user, "menu"));
      await showMain(env, chatId, user);
    } else {
      await showJoinPrompt(env, chatId, user);
    }

    return;
  }

  if (!admin && !(await isChannelMember(env, user.id))) {
    await sendText(env, chatId, t(user, "joinRequired"));
    await showJoinPrompt(env, chatId, user);
    return;
  }

  // User interface
  if (data === "ui:menu") {
    user.state = null;
    await saveUser(env, user);
    await showMain(env, chatId, user);
    return;
  }

  if (data === "movie:random") {
    await sendRandomMovie(env, chatId, user);
    return;
  }

  if (data.startsWith("fav:toggle:")) {
    const movieId = data.slice("fav:toggle:".length);
    await toggleFavorite(env, chatId, user, movieId);
    return;
  }

  if (data.startsWith("fav:open:")) {
    const movieId = data.slice("fav:open:".length);
    const movies = await getMovies(env);
    const movie = findMovie(movies, movieId);

    if (!movie) {
      await sendText(env, chatId, t(user, "notFound"));
      return;
    }

    await sendMovie(env, chatId, user, movie);
    return;
  }

  if (data.startsWith("rate:")) {
    const parts = data.split(":");

    if (parts.length === 3) {
      await saveRating(
        env,
        chatId,
        user,
        parts[1],
        Number(parts[2])
      );
    }

    return;
  }

  // All admin callbacks are protected here.
  if (data.startsWith("adm:")) {
    if (!admin) {
      await sendText(env, chatId, t(user, "adminUsage"));
      return;
    }

    if (data === "adm:panel") {
      await showAdminPanel(env, chatId, user);
      return;
    }

    if (data === "adm:add") {
      user.state = "await_admin_movie";
      await saveUser(env, user);

      await sendText(env, chatId, t(user, "addMovieHint"));
      return;
    }

    if (data === "adm:pending") {
      await showPending(env, chatId, user);
      return;
    }

    if (data === "adm:requests") {
      await showRequests(env, chatId, user);
      return;
    }

    if (data === "adm:users") {
      await showUsers(env, chatId, user);
      return;
    }

    if (data === "adm:delete") {
      await showDeletableMovies(env, chatId, user);
      return;
    }

    if (data === "adm:admins") {
      await showAdminList(env, chatId, user);
      return;
    }
    if (data === "adm:adminadd") {
      if (!(await isPrimaryAdmin(env, user.id))) {
        await sendText(env, chatId, t(user, "primaryOnly"));
        return;
      }

      user.state = "await_admin_add";
      await saveUser(env, user);

      await sendText(env, chatId, t(user, "addAdminPrompt"));
      return;
    }

    if (data.startsWith("adm:adminrm:")) {
      if (!(await isPrimaryAdmin(env, user.id))) {
        await sendText(env, chatId, t(user, "primaryOnly"));
        return;
      }

      const targetId = data.slice("adm:adminrm:".length);

      if (targetId === String(env.ADMIN_ID)) {
        await sendText(env, chatId, t(user, "primaryOnly"));
        return;
      }

      const admins = await readJSON(env, "admin:approved", []);

      await writeJSON(
        env,
        "admin:approved",
        admins.filter(id => String(id) !== String(targetId))
      );

      await sendText(env, chatId, t(user, "adminRemoved"));
      await showAdminList(env, chatId, user);
      return;
    }

    if (data.startsWith("adm:approve:")) {
      await approveSubmission(
        env,
        chatId,
        user,
        data.slice("adm:approve:".length)
      );
      return;
    }

    if (data.startsWith("adm:reject:")) {
      await rejectSubmission(
        env,
        chatId,
        user,
        data.slice("adm:reject:".length)
      );
      return;
    }

    if (data.startsWith("adm:reqdone:")) {
      await markRequestDone(
        env,
        chatId,
        user,
        data.slice("adm:reqdone:".length)
      );
      return;
    }

    if (data.startsWith("adm:user:")) {
      await showUserDetails(
        env,
        chatId,
        user,
        data.slice("adm:user:".length)
      );
      return;
    }

    if (data.startsWith("adm:block:")) {
      const targetId = data.slice("adm:block:".length);
      const target = await getUser(env, targetId);

      if (!target) {
        await sendText(env, chatId, t(user, "notFound"));
        return;
      }

      target.blocked = true;
      await saveUser(env, target);

      await sendText(env, chatId, t(user, "blockedDone"));
      await showUserDetails(env, chatId, user, targetId);
      return;
    }

    if (data.startsWith("adm:unblock:")) {
      const targetId = data.slice("adm:unblock:".length);
      const target = await getUser(env, targetId);

      if (!target) {
        await sendText(env, chatId, t(user, "notFound"));
        return;
      }

      target.blocked = false;
      await saveUser(env, target);

      await sendText(env, chatId, t(user, "unblockedDone"));
      await showUserDetails(env, chatId, user, targetId);
      return;
    }

    if (data.startsWith("adm:delok:")) {
      const movieId = data.slice("adm:delok:".length);
      const success = await deleteMovieSafely(env, movieId);

      if (success) {
        await sendText(env, chatId, t(user, "deleted"));
      } else {
        await sendText(env, chatId, t(user, "notFound"));
      }

      await showAdminPanel(env, chatId, user);
      return;
    }

    if (data.startsWith("adm:del:")) {
      const movieId = data.slice("adm:del:".length);
      const movies = await getMovies(env);
      const movie = findMovie(movies, movieId);

      if (!movie) {
        await sendText(env, chatId, t(user, "notFound"));
        return;
      }

      await sendText(
        env,
        chatId,
        ${t(user, "confirmDelete")}\n\n🎬 ${movie.title},
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: t(user, "deleted"),
                  callback_data: adm:delok:${movie.id}
                }
              ],
              [
                {
                  text: t(user, "back"),
                  callback_data: "adm:delcancel"
                }
              ]
            ]
          }
        }
      );

      return;
    }
  if (data === "adm:delcancel") {
      await sendText(env, chatId, t(user, "cancelled"));
      await showAdminPanel(env, chatId, user);
      return;
    }
  }
}

// ------------------------------------------------------
// Cloudflare Worker entry point
// ------------------------------------------------------

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response(
        "Telegram Movie Bot is running.",
        { status: 200 }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!env.BOT_TOKEN) {
      return new Response("BOT_TOKEN is missing.", { status: 500 });
    }

    if (!env.BOT_DATA) {
      return new Response("BOT_DATA KV binding is missing.", { status: 500 });
    }

    if (!env.ADMIN_ID) {
      return new Response("ADMIN_ID is missing.", { status: 500 });
    }

    try {
      const update = await request.json();

      if (update.message) {
        await handleMessage(env, update.message);
      } else if (update.callback_query) {
        await handleCallback(env, update.callback_query);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Worker error:", error);

      // Return 200 to avoid repeated delivery of a malformed update.
      return new Response("OK", { status: 200 });
    }
  }
};
