// ============================================================
// SUPER MAN BOT
// Part 1 of 5 — Core, Languages, Storage, Telegram API
// Platform: Cloudflare Workers + Workers KV
// ============================================================

const BOT_NAME = "SUPER MAN";
const BOT_USERNAME = "@Superman456";
const BOT_VERSION = "1.0.0";

const LANGUAGES = {
  fa: { name: "فارسی", flag: "🇮🇷" },
  en: { name: "English", flag: "🇬🇧" },
  ru: { name: "Русский", flag: "🇷🇺" },
  ar: { name: "العربية", flag: "🇸🇦" },
  zh: { name: "中文", flag: "🇨🇳" },
  de: { name: "Deutsch", flag: "🇩🇪" }
};

const DEFAULT_SETTINGS = {
  requiredChannel: "@Super_Pump2",
  requiredChannelUrl: "https://t.me/Super_Pump2",
  movieAutoDeleteSeconds: 60,
  requestCooldownSeconds: 20,
  referralsRequired: 3,
  referralsReward: 1,
  defaultLanguage: "en",
  moviesPerPage: 10,
  maxMovieCaptionLength: 900,
  maxReportLength: 500,
  maxRejectReasonLength: 300,
  maintenance: false,
  registrationEnabled: true,
  submissionsEnabled: true,
  ratingsEnabled: true,
  referralsEnabled: true,
  publicBotUsername: BOT_USERNAME
};

const KEY = {
  USER: "user:",
  MOVIE: "movie:",
  MOVIE_IDS: "movies:ids",
  USER_IDS: "users:ids",
  SETTINGS: "settings",
  RATING: "rating:",
  FAVORITES: "favorites:",
  HISTORY: "history:",
  REFERRALS: "referrals:",
  REFERRAL_CODE: "refcode:",
  COOLDOWN: "cooldown:",
  SUBMISSION: "submission:",
  PENDING_IDS: "pending:ids",
  REPORT: "report:",
  REPORT_IDS: "reports:ids",
  BAN: "ban:",
  WARN: "warn:",
  EVENT: "event:",
  EVENT_IDS: "events:ids",
  ACHIEVEMENTS: "achievements:",
  REQUEST: "request:",
  REQUEST_IDS: "requests:ids",
  BROADCAST: "broadcast:",
  BACKUP: "backup:",
  LANGUAGE_STATS: "stats:languages",
  GLOBAL_STATS: "stats:global",
  ADMIN_STATE: "adminstate:",
  USER_STATE: "userstate:",
  MOVIE_VIEWS: "views:",
  MOVIE_COMMENTS: "comments:",
  MOVIE_VOTES: "votes:",
  MOVIE_QUEUE: "moviequeue",
  DAILY_STATS: "stats:daily:"
};

const TEXTS = {
  fa: {
    chooseLanguage: "🌐 زبان خود را انتخاب کنید:",
    languageSaved: "✅ زبان شما با موفقیت تنظیم شد.",
    joinRequired: "🔒 برای استفاده از ربات، ابتدا در کانال زیر عضو شوید.",
    joinChannel: "📢 عضویت در کانال",
    checkMembership: "✅ بررسی عضویت",
    notJoined: "❌ هنوز عضو کانال نشده‌اید. پس از عضویت دوباره بررسی کنید.",
    welcome: "🎬 به ربات SUPER MAN خوش آمدید!",
    mainMenu: "یکی از گزینه‌های زیر را انتخاب کنید:",
    receiveMovie: "📥 دریافت فیلم",
    sendMovie: "📤 ارسال فیلم",
    changeLanguage: "🌐 تغییر زبان",
    profile: "👤 پروفایل",
    favorites: "⭐ علاقه‌مندی‌ها",
    history: "🕘 تاریخچه",
    inviteFriends: "🎁 دعوت از دوستان",
    achievements: "🏆 دستاوردها",
    leaderboard: "🥇 رتبه‌بندی",
    movieRequest: "🎞 درخواست فیلم",
    report: "🚩 گزارش تخلف",
    back: "🔙 بازگشت",
    cancel: "❌ لغو",
    wait: "⏳ لطفاً کمی صبر کنید.",
    cooldown: "⏳ برای درخواست بعدی {seconds} ثانیه صبر کنید.",
    noMovies: "🎬 فعلاً فیلمی برای نمایش وجود ندارد.",
    movieUnavailable: "❌ این فیلم دیگر در دسترس نیست.",
    movieReceived: "✅ فیلم برای شما ارسال شد.",
    sendMoviePrompt:
      "🎬 فیلم موردنظرت رو همین‌جا ارسال کن.\n\n" +
      "🛡️ فیلم شما توسط مدیران ربات بررسی می‌شود و در صورت تأیید، برای کاربران سراسر جهان نمایش داده خواهد شد.\n\n" +
      "📩 بعد از ارسال، منتظر بررسی مدیران باشید.",
    submissionReceived: "✅ فیلم شما برای بررسی ارسال شد.",
    submissionCancelled: "❌ ارسال فیلم لغو شد.",
    onlyVideo: "⚠️ لطفاً فایل ویدیویی یا ویدیوی تلگرامی ارسال کنید.",
    moviePending: "⏳ این فیلم قبلاً برای بررسی ارسال شده است.",
    movieApproved: "✅ فیلم شما تأیید شد.",
    movieRejected: "❌ فیلم شما تأیید نشد.",
    ratingPrompt: "⭐ به این فیلم امتیاز بدهید:",
    ratingSaved: "✅ امتیاز شما ثبت شد.",
    ratingDuplicate: "ℹ️ قبلاً به این فیلم امتیاز داده‌اید.",
    favoriteAdded: "⭐ به علاقه‌مندی‌ها اضافه شد.",
    favoriteRemoved: "☆ از علاقه‌مندی‌ها حذف شد.",
    favoriteEmpty: "⭐ هنوز فیلمی به علاقه‌مندی‌ها اضافه نکرده‌اید.",
    historyEmpty: "🕘 تاریخچه تماشای شما خالی است.",
    profileTitle: "👤 پروفایل شما",
    inviteText:
      "🎁 دوستان خود را دعوت کنید!\n\n" +
      "با دعوت از ۳ کاربر معتبر، یک درخواست اضافه دریافت می‌کنید.\n\n" +
      "لینک دعوت شما:\n{link}\n\n" +
      "👥 دعوت‌های معتبر: {count}",
    referralSelf: "❌ نمی‌توانید از لینک دعوت خودتان استفاده کنید.",
    referralDuplicate: "ℹ️ این دعوت قبلاً ثبت شده است.",
    referralSuccess: "🎉 دعوت شما ثبت شد!",
    referralReward: "🎁 پاداش دعوت برای شما فعال شد.",
    referralInvalid: "❌ لینک دعوت معتبر نیست.",
    requestPrompt: "🎞 نام فیلم موردنظرتان را ارسال کنید.",
    requestReceived: "✅ درخواست فیلم ثبت شد.",
    requestTooLong: "⚠️ متن درخواست بیش از حد طولانی است.",
    reportPrompt: "🚩 دلیل گزارش را بنویسید.",
    reportReceived: "✅ گزارش شما برای بررسی ثبت شد.",
    reportCancelled: "❌ گزارش لغو شد.",
    banned: "⛔ دسترسی شما به ربات مسدود شده است.",
    maintenance: "🛠 ربات موقتاً در حال تعمیر است.",
    error: "❌ خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    adminOnly: "⛔ این بخش مخصوص مدیران است.",
    adminMenu: "🛡 پنل مدیریت SUPER MAN",
    adminStats: "📊 آمار ربات",
    adminPending: "📥 فیلم‌های در انتظار بررسی",
    adminUsers: "👥 مدیریت کاربران",
    adminBroadcast: "📣 ارسال پیام همگانی",
    adminSettings: "⚙️ تنظیمات",
    adminLogs: "📋 گزارش رویدادها",
    adminBackup: "💾 پشتیبان‌گیری",
    approve: "✅ تأیید",
    reject: "❌ رد",
    nextMovie: "🔄 فیلم دیگر",
    addFavorite: "⭐ افزودن به علاقه‌مندی‌ها",
    removeFavorite: "☆ حذف از علاقه‌مندی‌ها",
    views: "👁 بازدید",
    comments: "💬 نظر",
    averageRating: "⭐ میانگین امتیاز",
    submittedBy: "ارسال‌شده از",
    submitted: "ارسال‌شده",
    movieFooter: "🌍 فیلم‌های بیشتر: {bot}",
    unknownCountry: "نامشخص",
    invalidInput: "⚠️ ورودی معتبر نیست.",
    actionDone: "✅ انجام شد.",
    languageChanged: "🌐 زبان تغییر کرد."
  },

  en: {
    chooseLanguage: "🌐 Choose your language:",
    languageSaved: "✅ Your language has been saved.",
    joinRequired: "🔒 Join the channel below to use this bot.",
    joinChannel: "📢 Join channel",
    checkMembership: "✅ Check membership",
    notJoined: "❌ You have not joined the channel yet.",
    welcome: "🎬 Welcome to SUPER MAN!",
    mainMenu: "Choose an option below:",
    receiveMovie: "📥 Get a movie",
    sendMovie: "📤 Submit a movie",
    changeLanguage: "🌐 Change language",
    profile: "👤 Profile",
    favorites: "⭐ Favorites",
    history: "🕘 History",
    inviteFriends: "🎁 Invite friends",
    achievements: "🏆 Achievements",
    leaderboard: "🥇 Leaderboard",
    movieRequest: "🎞 Request a movie",
    report: "🚩 Report",
    back: "🔙 Back",
    cancel: "❌ Cancel",
    wait: "⏳ Please wait.",
    cooldown: "⏳ Wait {seconds} seconds before trying again.",
    noMovies: "🎬 No movies are available right now.",
    movieUnavailable: "❌ This movie is no longer available.",
    movieReceived: "✅ Your movie has been sent.",
    sendMoviePrompt:
      "🎬 Send your movie here.\n\n" +
      "🛡️ Your submission will be reviewed by our moderators. If approved, it may be shown to users worldwide.\n\n" +
      "📩 Please wait for the review result.",
    submissionReceived: "✅ Your movie has been submitted for review.",
    submissionCancelled: "❌ Movie submission cancelled.",
    onlyVideo: "⚠️ Please send a video file or Telegram video.",
    moviePending: "⏳ This movie is already awaiting review.",
    movieApproved: "✅ Your movie has been approved.",
    movieRejected: "❌ Your movie was not approved.",
    ratingPrompt: "⭐ Rate this movie:",
    ratingSaved: "✅ Your rating has been saved.",
    ratingDuplicate: "ℹ️ You have already rated this movie.",
    favoriteAdded: "⭐ Added to favorites.",
    favoriteRemoved: "☆ Removed from favorites.",
    favoriteEmpty: "⭐ Your favorites list is empty.",
    historyEmpty: "🕘 Your watch history is empty.",
    profileTitle: "👤 Your profile",
    inviteText:
      "🎁 Invite your friends!\n\n" +
      "Invite 3 valid users to earn one extra request.\n\n" +
      "Your invite link:\n{link}\n\n" +
      "👥 Valid referrals: {count}",
    referralSelf: "❌ You cannot use your own referral link.",
    referralDuplicate: "ℹ️ This referral has already been recorded.",
    referralSuccess: "🎉 Your referral has been recorded!",
    referralReward: "🎁 Your referral reward is ready.",
    referralInvalid: "❌ Invalid referral link.",
    requestPrompt: "🎞 Send the title of the movie you want.",
    requestReceived: "✅ Your movie request has been recorded.",
    requestTooLong: "⚠️ Your request is too long.",
    reportPrompt: "🚩 Please describe the issue.",
    reportReceived: "✅ Your report has been submitted.",
    reportCancelled: "❌ Report cancelled.",
    banned: "⛔ Your access to this bot is blocked.",
    maintenance: "🛠 The bot is temporarily under maintenance.",
    error: "❌ Something went wrong. Please try again.",
    adminOnly: "⛔ This section is for administrators only.",
    adminMenu: "🛡 SUPER MAN Admin Panel",
    adminStats: "📊 Bot statistics",
    adminPending: "📥 Pending movies",
    adminUsers: "👥 Manage users",
    adminBroadcast: "📣 Broadcast message",
    adminSettings: "⚙️ Settings",
    adminLogs: "📋 Event logs",
    adminBackup: "💾 Backup",
    approve: "✅ Approve",
    reject: "❌ Reject",
    nextMovie: "🔄 Another movie",
    addFavorite: "⭐ Add to favorites",
    removeFavorite: "☆ Remove from favorites",
    views: "👁 Views",
    comments: "💬 Comments",
    averageRating: "⭐ Average rating",
    submittedBy: "Submitted from",
    submitted: "Submitted",
    movieFooter: "🌍 More movies: {bot}",
    unknownCountry: "Unknown",
    invalidInput: "⚠️ Invalid input.",
    actionDone: "✅ Done.",
    languageChanged: "🌐 Language changed."
  },

  ru: {
    chooseLanguage: "🌐 Выберите язык:",
    languageSaved: "✅ Язык сохранён.",
    joinRequired: "🔒 Подпишитесь на канал ниже, чтобы пользоваться ботом.",
    joinChannel: "📢 Подписаться",
    checkMembership: "✅ Проверить подписку",
    notJoined: "❌ Вы ещё не подписались на канал.",
    welcome: "🎬 Добро пожаловать в SUPER MAN!",
    mainMenu: "Выберите действие:",
    receiveMovie: "📥 Получить фильм",
    sendMovie: "📤 Отправить фильм",
    changeLanguage: "🌐 Изменить язык",
    profile: "👤 Профиль",
    favorites: "⭐ Избранное",
    history: "🕘 История",
    inviteFriends: "🎁 Пригласить друзей",
    achievements: "🏆 Достижения",
    leaderboard: "🥇 Рейтинг",
    movieRequest: "🎞 Запросить фильм",
    report: "🚩 Пожаловаться",
    back: "🔙 Назад",
    cancel: "❌ Отмена",
    wait: "⏳ Пожалуйста, подождите.",
    cooldown: "⏳ Подождите {seconds} сек.",
    noMovies: "🎬 Сейчас фильмов нет.",
    movieUnavailable: "❌ Фильм больше недоступен.",
    movieReceived: "✅ Фильм отправлен.",
    sendMoviePrompt: "🎬 Отправьте фильм сюда.\n\n🛡️ Модераторы проверят вашу отправку.\n\n📩 Дождитесь результата проверки.",
    submissionReceived: "✅ Фильм отправлен на проверку.",
    submissionCancelled: "❌ Отправка отменена.",
    onlyVideo: "⚠️ Отправьте видео.",
    moviePending: "⏳ Этот фильм уже ожидает проверки.",
    movieApproved: "✅ Ваш фильм одобрен.",
    movieRejected: "❌ Ваш фильм отклонён.",
    ratingPrompt: "⭐ Оцените фильм:",
    ratingSaved: "✅ Оценка сохранена.",
    ratingDuplicate: "ℹ️ Вы уже оценили этот фильм.",
    favoriteAdded: "⭐ Добавлено в избранное.",
    favoriteRemoved: "☆ Удалено из избранного.",
    favoriteEmpty: "⭐ Список избранного пуст.",
    historyEmpty: "🕘 История просмотров пуста.",
    profileTitle: "👤 Ваш профиль",
    inviteText: "🎁 Приглашайте друзей!\n\nСсылка:\n{link}\n\n👥 Приглашено: {count}",
    referralSelf: "❌ Нельзя использовать собственную ссылку.",
    referralDuplicate: "ℹ️ Приглашение уже записано.",
    referralSuccess: "🎉 Приглашение записано!",
    referralReward: "🎁 Награда за приглашение активирована.",
    referralInvalid: "❌ Недействительная ссылка.",
    requestPrompt: "🎞 Отправьте название фильма.",
    requestReceived: "✅ Запрос сохранён.",
    requestTooLong: "⚠️ Слишком длинный запрос.",
    reportPrompt: "🚩 Опишите проблему.",
    reportReceived: "✅ Жалоба отправлена.",
    reportCancelled: "❌ Жалоба отменена.",
    banned: "⛔ Ваш доступ заблокирован.",
    maintenance: "🛠 Бот временно на обслуживании.",
    error: "❌ Произошла ошибка.",
    adminOnly: "⛔ Только для администраторов.",
    adminMenu: "🛡 Панель администратора",
    adminStats: "📊 Статистика",
    adminPending: "📥 Фильмы на проверке",
    adminUsers: "👥 Пользователи",
    adminBroadcast: "📣 Рассылка",
    adminSettings: "⚙️ Настройки",
    adminLogs: "📋 Журнал событий",
    adminBackup: "💾 Резервная копия",
    approve: "✅ Одобрить",
    reject: "❌ Отклонить",
    nextMovie: "🔄 Другой фильм",
    addFavorite: "⭐ В избранное",
    removeFavorite: "☆ Удалить из избранного",
    views: "👁 Просмотры",
    comments: "💬 Комментарии",
    averageRating: "⭐ Средняя оценка",
    submittedBy: "Отправлено из",
    submitted: "Отправлено",
    movieFooter: "🌍 Другие фильмы: {bot}",
    unknownCountry: "Неизвестно",
    invalidInput: "⚠️ Неверный ввод.",
    actionDone: "✅ Готово.",
    languageChanged: "🌐 Язык изменён."
  },

  ar: {
    chooseLanguage: "🌐 اختر لغتك:",
    languageSaved: "✅ تم حفظ اللغة.",
    joinRequired: "🔒 اشترك في القناة أدناه لاستخدام البوت.",
    joinChannel: "📢 الاشتراك في القناة",
    checkMembership: "✅ التحقق من الاشتراك",
    notJoined: "❌ لم تشترك في القناة بعد.",
    welcome: "🎬 مرحباً بك في SUPER MAN!",
    mainMenu: "اختر أحد الخيارات:",
    receiveMovie: "📥 استلام فيلم",
    sendMovie: "📤 إرسال فيلم",
    changeLanguage: "🌐 تغيير اللغة",
    profile: "👤 الملف الشخصي",
    favorites: "⭐ المفضلة",
    history: "🕘 السجل",
    inviteFriends: "🎁 دعوة الأصدقاء",
    achievements: "🏆 الإنجازات",
    leaderboard: "🥇 المتصدرون",
    movieRequest: "🎞 طلب فيلم",
    report: "🚩 إبلاغ",
    back: "🔙 رجوع",
    cancel: "❌ إلغاء",
    wait: "⏳ يرجى الانتظار.",
    cooldown: "⏳ انتظر {seconds} ثانية.",
    noMovies: "🎬 لا توجد أفلام حالياً.",
    movieUnavailable: "❌ هذا الفيلم غير متاح.",
    movieReceived: "✅ تم إرسال الفيلم.",
    sendMoviePrompt: "🎬 أرسل الفيلم هنا.\n\n🛡️ سيقوم المشرفون بمراجعة الفيلم قبل نشره.",
    submissionReceived: "✅ تم إرسال الفيلم للمراجعة.",
    submissionCancelled: "❌ تم إلغاء الإرسال.",
    onlyVideo: "⚠️ يرجى إرسال فيديو.",
    moviePending: "⏳ هذا الفيلم قيد المراجعة بالفعل.",
    movieApproved: "✅ تمت الموافقة على فيلمك.",
    movieRejected: "❌ لم تتم الموافقة على فيلمك.",
    ratingPrompt: "⭐ قيّم هذا الفيلم:",
    ratingSaved: "✅ تم حفظ تقييمك.",
    ratingDuplicate: "ℹ️ لقد قيّمت هذا الفيلم سابقاً.",
    favoriteAdded: "⭐ تمت الإضافة إلى المفضلة.",
    favoriteRemoved: "☆ تمت الإزالة من المفضلة.",
    favoriteEmpty: "⭐ قائمة المفضلة فارغة.",
    historyEmpty: "🕘 سجل المشاهدة فارغ.",
    profileTitle: "👤 ملفك الشخصي",
    inviteText: "🎁 ادعُ أصدقاءك!\n\nرابط الدعوة:\n{link}\n\n👥 الدعوات: {count}",
    referralSelf: "❌ لا يمكنك استخدام رابطك الخاص.",
    referralDuplicate: "ℹ️ تمت إضافة هذه الدعوة سابقاً.",
    referralSuccess: "🎉 تم تسجيل دعوتك!",
    referralReward: "🎁 تم تفعيل مكافأة الدعوة.",
    referralInvalid: "❌ رابط غير صالح.",
    requestPrompt: "🎞 أرسل اسم الفيلم المطلوب.",
    requestReceived: "✅ تم تسجيل طلبك.",
    requestTooLong: "⚠️ الطلب طويل جداً.",
    reportPrompt: "🚩 اكتب سبب البلاغ.",
    reportReceived: "✅ تم إرسال البلاغ.",
    reportCancelled: "❌ تم إلغاء البلاغ.",
    banned: "⛔ تم حظر وصولك.",
    maintenance: "🛠 البوت تحت الصيانة مؤقتاً.",
    error: "❌ حدث خطأ. حاول مرة أخرى.",
    adminOnly: "⛔ هذا القسم للمشرفين فقط.",
    adminMenu: "🛡 لوحة الإدارة",
    adminStats: "📊 الإحصائيات",
    adminPending: "📥 الأفلام قيد المراجعة",
    adminUsers: "👥 إدارة المستخدمين",
    adminBroadcast: "📣 إرسال جماعي",
    adminSettings: "⚙️ الإعدادات",
    adminLogs: "📋 سجل الأحداث",
    adminBackup: "💾 نسخة احتياطية",
    approve: "✅ موافقة",
    reject: "❌ رفض",
    nextMovie: "🔄 فيلم آخر",
    addFavorite: "⭐ أضف للمفضلة",
    removeFavorite: "☆ إزالة من المفضلة",
    views: "👁 المشاهدات",
    comments: "💬 التعليقات",
    averageRating: "⭐ متوسط التقييم",
    submittedBy: "أُرسل من",
    submitted: "تم الإرسال",
    movieFooter: "🌍 المزيد من الأفلام: {bot}",
    unknownCountry: "غير معروف",
    invalidInput: "⚠️ إدخال غير صالح.",
    actionDone: "✅ تم.",
    languageChanged: "🌐 تم تغيير اللغة."
  },

  zh: {
    chooseLanguage: "🌐 请选择语言：",
    languageSaved: "✅ 语言已保存。",
    joinRequired: "🔒 请先加入下面的频道。",
    joinChannel: "📢 加入频道",
    checkMembership: "✅ 检查订阅",
    notJoined: "❌ 您尚未加入频道。",
    welcome: "🎬 欢迎来到 SUPER MAN！",
    mainMenu: "请选择一个选项：",
    receiveMovie: "📥 获取电影",
    sendMovie: "📤 提交电影",
    changeLanguage: "🌐 更改语言",
    profile: "👤 个人资料",
    favorites: "⭐ 收藏",
    history: "🕘 历史记录",
    inviteFriends: "🎁 邀请好友",
    achievements: "🏆 成就",
    leaderboard: "🥇 排行榜",
    movieRequest: "🎞 请求电影",
    report: "🚩 举报",
    back: "🔙 返回",
    cancel: "❌ 取消",
    wait: "⏳ 请稍候。",
    cooldown: "⏳ 请等待 {seconds} 秒。",
    noMovies: "🎬 暂无可用电影。",
    movieUnavailable: "❌ 该电影已不可用。",
    movieReceived: "✅ 电影已发送。",
    sendMoviePrompt: "🎬 请在这里发送电影。\n\n🛡️ 管理员审核通过后，电影才会向用户展示。",
    submissionReceived: "✅ 电影已提交审核。",
    submissionCancelled: "❌ 已取消提交。",
    onlyVideo: "⚠️ 请发送视频。",
    moviePending: "⏳ 该电影正在审核中。",
    movieApproved: "✅ 您的电影已通过审核。",
    movieRejected: "❌ 您的电影未通过审核。",
    ratingPrompt: "⭐ 请为电影评分：",
    ratingSaved: "✅ 评分已保存。",
    ratingDuplicate: "ℹ️ 您已经评过分了。",
    favoriteAdded: "⭐ 已添加到收藏。",
    favoriteRemoved: "☆ 已从收藏中移除。",
    favoriteEmpty: "⭐ 收藏列表为空。",
    historyEmpty: "🕘 观看记录为空。",
    profileTitle: "👤 您的个人资料",
    inviteText: "🎁 邀请好友！\n\n邀请链接：\n{link}\n\n👥 邀请人数：{count}",
    referralSelf: "❌ 不能使用自己的邀请链接。",
    referralDuplicate: "ℹ️ 该邀请已记录。",
    referralSuccess: "🎉 邀请已记录！",
    referralReward: "🎁 邀请奖励已激活。",
    referralInvalid: "❌ 邀请链接无效。",
    requestPrompt: "🎞 请发送电影名称。",
    requestReceived: "✅ 电影请求已记录。",
    requestTooLong: "⚠️ 请求内容太长。",
    reportPrompt: "🚩 请描述问题。",
    reportReceived: "✅ 举报已提交。",
    reportCancelled: "❌ 举报已取消。",
    banned: "⛔ 您的访问权限已被限制。",
    maintenance: "🛠 机器人正在维护。",
    error: "❌ 出现错误，请重试。",
    adminOnly: "⛔ 仅管理员可使用。",
    adminMenu: "🛡 管理面板",
    adminStats: "📊 机器人统计",
    adminPending: "📥 待审核电影",
    adminUsers: "👥 用户管理",
    adminBroadcast: "📣 群发消息",
    adminSettings: "⚙️ 设置",
    adminLogs: "📋 事件日志",
    adminBackup: "💾 备份",
    approve: "✅ 通过",
    reject: "❌ 拒绝",
    nextMovie: "🔄 下一个电影",
    addFavorite: "⭐ 添加收藏",
    removeFavorite: "☆ 取消收藏",
    views: "👁 浏览量",
    comments: "💬 评论",
    averageRating: "⭐ 平均评分",
    submittedBy: "提交来源",
    submitted: "已提交",
    movieFooter: "🌍 更多电影：{bot}",
    unknownCountry: "未知",
    invalidInput: "⚠️ 输入无效。",
    actionDone: "✅ 完成。",
    languageChanged: "🌐 语言已更改。"
  },

  de: {
    chooseLanguage: "🌐 Wähle deine Sprache:",
    languageSaved: "✅ Deine Sprache wurde gespeichert.",
    joinRequired: "🔒 Tritt dem Kanal bei, um den Bot zu nutzen.",
    joinChannel: "📢 Kanal beitreten",
    checkMembership: "✅ Mitgliedschaft prüfen",
    notJoined: "❌ Du bist dem Kanal noch nicht beigetreten.",
    welcome: "🎬 Willkommen bei SUPER MAN!",
    mainMenu: "Wähle eine Option:",
    receiveMovie: "📥 Film erhalten",
    sendMovie: "📤 Film einreichen",
    changeLanguage: "🌐 Sprache ändern",
    profile: "👤 Profil",
    favorites: "⭐ Favoriten",
    history: "🕘 Verlauf",
    inviteFriends: "🎁 Freunde einladen",
    achievements: "🏆 Erfolge",
    leaderboard: "🥇 Rangliste",
    movieRequest: "🎞 Film anfragen",
    report: "🚩 Melden",
    back: "🔙 Zurück",
    cancel: "❌ Abbrechen",
    wait: "⏳ Bitte warten.",
    cooldown: "⏳ Warte {seconds} Sekunden.",
    noMovies: "🎬 Zurzeit sind keine Filme verfügbar.",
    movieUnavailable: "❌ Dieser Film ist nicht mehr verfügbar.",
    movieReceived: "✅ Dein Film wurde gesendet.",
    sendMoviePrompt: "🎬 Sende deinen Film hier.\n\n🛡️ Moderatoren prüfen deine Einsendung vor der Veröffentlichung.",
    submissionReceived: "✅ Dein Film wurde zur Prüfung eingereicht.",
    submissionCancelled: "❌ Einsendung abgebrochen.",
    onlyVideo: "⚠️ Bitte sende ein Video.",
    moviePending: "⏳ Dieser Film wird bereits geprüft.",
    movieApproved: "✅ Dein Film wurde genehmigt.",
    movieRejected: "❌ Dein Film wurde nicht genehmigt.",
    ratingPrompt: "⭐ Bewerte diesen Film:",
    ratingSaved: "✅ Bewertung gespeichert.",
    ratingDuplicate: "ℹ️ Du hast diesen Film bereits bewertet.",
    favoriteAdded: "⭐ Zu Favoriten hinzugefügt.",
    favoriteRemoved: "☆ Aus Favoriten entfernt.",
    favoriteEmpty: "⭐ Deine Favoritenliste ist leer.",
    historyEmpty: "🕘 Dein Verlauf ist leer.",
    profileTitle: "👤 Dein Profil",
    inviteText: "🎁 Lade Freunde ein!\n\nDein Einladungslink:\n{link}\n\n👥 Einladungen: {count}",
    referralSelf: "❌ Du kannst deinen eigenen Link nicht verwenden.",
    referralDuplicate: "ℹ️ Diese Einladung wurde bereits erfasst.",
    referralSuccess: "🎉 Einladung erfasst!",
    referralReward: "🎁 Deine Einladungsbelohnung ist aktiv.",
    referralInvalid: "❌ Ungültiger Einladungslink.",
    requestPrompt: "🎞 Sende den Filmtitel.",
    requestReceived: "✅ Filmanfrage gespeichert.",
    requestTooLong: "⚠️ Die Anfrage ist zu lang.",
    reportPrompt: "🚩 Beschreibe das Problem.",
    reportReceived: "✅ Meldung gesendet.",
    reportCancelled: "❌ Meldung abgebrochen.",
    banned: "⛔ Dein Zugriff wurde gesperrt.",
    maintenance: "🛠 Der Bot wird vorübergehend gewartet.",
    error: "❌ Ein Fehler ist aufgetreten. Bitte erneut versuchen.",
    adminOnly: "⛔ Nur für Administratoren.",
    adminMenu: "🛡 Admin-Panel",
    adminStats: "📊 Bot-Statistik",
    adminPending: "📥 Ausstehende Filme",
    adminUsers: "👥 Benutzerverwaltung",
    adminBroadcast: "📣 Rundnachricht",
    adminSettings: "⚙️ Einstellungen",
    adminLogs: "📋 Ereignisprotokoll",
    adminBackup: "💾 Sicherung",
    approve: "✅ Genehmigen",
    reject: "❌ Ablehnen",
    nextMovie: "🔄 Nächster Film",
    addFavorite: "⭐ Zu Favoriten",
    removeFavorite: "☆ Aus Favoriten entfernen",
    views: "👁 Aufrufe",
    comments: "💬 Kommentare",
    averageRating: "⭐ Durchschnittsbewertung",
    submittedBy: "Eingereicht aus",
    submitted: "Eingereicht",
    movieFooter: "🌍 Weitere Filme: {bot}",
    unknownCountry: "Unbekannt",
    invalidInput: "⚠️ Ungültige Eingabe.",
    actionDone: "✅ Erledigt.",
    languageChanged: "🌐 Sprache geändert."
  }
};

// ============================================================
// GENERAL UTILITIES
// ============================================================

function now() {
  return Date.now();
}

function makeId(prefix = "id") {
  return ${prefix}_${now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)};
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function validLanguage(language) {
  return Object.prototype.hasOwnProperty.call(LANGUAGES, language)
    ? language
    : DEFAULT_SETTINGS.defaultLanguage;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceVars(template, values = {}) {
  return String(template || "").replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (match, key) =>
      Object.prototype.hasOwnProperty.call(values, key)
        ? String(values[key])
        : match
  );
}

function t(language, key, values = {}) {
  const lang = validLanguage(language);
  const text =
    TEXTS[lang]?.[key] ??
    TEXTS.en?.[key] ??
    key;

  return replaceVars(text, values);
}

function parseJson(value, fallback = null) {
  if (value === null  value === undefined  value === "") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function uniqueNumbers(values = []) {
  return [...new Set(
    values.map(value => String(value))
      .filter(value => /^\d+$/.test(value))
  )];
}

function randomItem(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function paginate(items = [], page = 0, pageSize = 10) {
  const size = Math.max(1, safeNumber(pageSize, 10));
  const currentPage = Math.max(0, safeNumber(page, 0));
  const start = currentPage * size;

  return {
    items: items.slice(start, start + size),
    page: currentPage,
    pageSize: size,
    total: items.length,
    pages: Math.ceil(items.length / size)
  };
}

function normalizeText(value, maxLength = 1000) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function isTelegramId(value) {
  return /^\d{5,15}$/.test(String(value ?? ""));
}

function getTelegramUserId(update) {
  return (
    update?.message?.from?.id ??
    update?.callback_query?.from?.id ??
    update?.edited_message?.from?.id ??
    null
  );
}

function getChatId(update) {
  return (
    update?.message?.chat?.id ??
    update?.callback_query?.message?.chat?.id ??
    update?.edited_message?.chat?.id ??
    null
  );
}

function getMessageText(update) {
  return (
    update?.message?.text ??
    update?.edited_message?.text ??
    ""
  );
}

function getCallbackData(update) {
  return update?.callback_query?.data ?? "";
}

function getUserDisplayName(from = {}) {
  const name = [from.first_name, from.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name  from.username  String(from.id || "User");
}

function makeStartLink(botUsername, payload = "") {
  const username = String(botUsername || BOT_USERNAME)
    .replace(/^@/, "");

  return payload
    ? https://t.me/${username}?start=${encodeURIComponent(payload)}
    : https://t.me/${username};
}

function average(values = []) {
  if (!values.length) return 0;

  const sum = values.reduce(
    (total, value) => total + safeNumber(value, 0),
    0
  );

  return Math.round((sum / values.length) * 100) / 100;
}

// ============================================================
// CLOUDFLARE KV STORAGE
// ============================================================

function getKV(env) {
  if (!env?.SUPER_MAN_KV) {
    throw new Error("Missing Cloudflare KV binding: SUPER_MAN_KV");
  }

  return env.SUPER_MAN_KV;
}

async function dbGet(env, key, fallback = null) {
  const value = await getKV(env).get(key);
  return parseJson(value, fallback);
}

async function dbPut(env, key, value) {
  await getKV(env).put(key, JSON.stringify(value));
  return value;
}

async function dbDelete(env, key) {
  await getKV(env).delete(key);
  return true;
}

async function dbGetText(env, key, fallback = "") {
  const value = await getKV(env).get(key);
  return value === null ? fallback : value;
}

async function dbPutText(env, key, value) {
  await getKV(env).put(key, String(value));
  return value;
    }
async function dbGetList(env, key) {
  const value = await dbGet(env, key, []);
  return Array.isArray(value) ? value : [];
}

async function dbAddUnique(env, key, item) {
  const list = await dbGetList(env, key);
  const normalized = String(item);

  if (!list.some(value => String(value) === normalized)) {
    list.push(item);
    await dbPut(env, key, list);
  }

  return list;
}

async function dbRemoveItem(env, key, item) {
  const normalized = String(item);
  const list = await dbGetList(env, key);
  const updated = list.filter(value => String(value) !== normalized);

  await dbPut(env, key, updated);
  return updated;
}

async function dbIncrement(env, key, amount = 1) {
  const current = safeNumber(await dbGet(env, key, 0), 0);
  const updated = current + amount;

  await dbPut(env, key, updated);
  return updated;
}

async function getSettings(env) {
  const saved = await dbGet(env, KEY.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...(saved || {}) };
}

async function updateSettings(env, changes = {}) {
  const current = await getSettings(env);
  const updated = { ...current, ...changes };

  await dbPut(env, KEY.SETTINGS, updated);
  return updated;
}

// ============================================================
// TELEGRAM BOT API
// ============================================================

function telegramApiUrl(env, method) {
  if (!env?.BOT_TOKEN) {
    throw new Error("Missing BOT_TOKEN secret");
  }

  return https://api.telegram.org/bot${env.BOT_TOKEN}/${method};
}

async function telegramCall(env, method, payload = {}) {
  const response = await fetch(telegramApiUrl(env, method), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => ({
    ok: false,
    description: "Invalid Telegram response"
  }));

  if (!response.ok || !result.ok) {
    const error = new Error(
      result.description || Telegram API error: ${method}
    );

    error.telegramMethod = method;
    error.telegramResponse = result;
    throw error;
  }

  return result.result;
}

async function sendMessage(
  env,
  chatId,
  text,
  options = {}
) {
  return telegramCall(env, "sendMessage", {
    chat_id: chatId,
    text: String(text),
    ...options
  });
}

async function sendHtmlMessage(
  env,
  chatId,
  text,
  options = {}
) {
  return sendMessage(env, chatId, text, {
    parse_mode: "HTML",
    ...options
  });
}

async function editMessageText(
  env,
  chatId,
  messageId,
  text,
  options = {}
) {
  return telegramCall(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: String(text),
    ...options
  });
}

async function deleteMessage(env, chatId, messageId) {
  return telegramCall(env, "deleteMessage", {
    chat_id: chatId,
    message_id: messageId
  });
}

async function answerCallback(
  env,
  callbackQueryId,
  text = "",
  options = {}
) {
  if (!callbackQueryId) return null;

  return telegramCall(env, "answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text: String(text),
    ...options
  });
}

async function sendVideo(
  env,
  chatId,
  video,
  options = {}
) {
  return telegramCall(env, "sendVideo", {
    chat_id: chatId,
    video,
    ...options
  });
}

async function forwardMessage(
  env,
  chatId,
  fromChatId,
  messageId
) {
  return telegramCall(env, "forwardMessage", {
    chat_id: chatId,
    from_chat_id: fromChatId,
    message_id: messageId
  });
}

async function copyMessage(
  env,
  chatId,
  fromChatId,
  messageId,
  options = {}
) {
  return telegramCall(env, "copyMessage", {
    chat_id: chatId,
    from_chat_id: fromChatId,
    message_id: messageId,
    ...options
  });
}

async function getChatMember(env, chatId, userId) {
  return telegramCall(env, "getChatMember", {
    chat_id: chatId,
    user_id: userId
  });
}

async function getBotInfo(env) {
  return telegramCall(env, "getMe");
}

async function setWebhook(env, url, secretToken = "") {
  const payload = { url };
  if (secretToken) {
    payload.secret_token = secretToken;
  }

  return telegramCall(env, "setWebhook", payload);
}

async function getWebhookInfo(env) {
  return telegramCall(env, "getWebhookInfo");
}

async function setCommands(env, commands) {
  return telegramCall(env, "setMyCommands", {
    commands
  });
}

// ============================================================
// INLINE KEYBOARD HELPERS
// ============================================================

function inlineButton(text, callbackData) {
  return {
    text: String(text),
    callback_data: String(callbackData).slice(0, 64)
  };
}

function urlButton(text, url) {
  return {
    text: String(text),
    url: String(url)
  };
}

function inlineKeyboard(rows = []) {
  return {
    inline_keyboard: rows
  };
}

function replyKeyboard(rows = [], options = {}) {
  return {
    keyboard: rows.map(row =>
      row.map(text => ({ text: String(text) }))
    ),
    resize_keyboard: true,
    ...options
  };
}

function removeKeyboard() {
  return { remove_keyboard: true };
}

// ============================================================
// USER RECORDS
// ============================================================

function createUserRecord(from, language = "en", referredBy = null) {
  const userId = String(from.id);

  return {
    id: userId,
    username: from.username || null,
    firstName: from.first_name || "",
    lastName: from.last_name || "",
    language: validLanguage(language),
    country: null,
    joinedAt: now(),
    lastSeenAt: now(),
    referredBy: referredBy ? String(referredBy) : null,
    referralCount: 0,
    referralRewards: 0,
    requestCredits: 0,
    totalMoviesReceived: 0,
    totalMoviesSubmitted: 0,
    totalRatings: 0,
    totalReports: 0,
    totalInvites: 0,
    experience: 0,
    level: 1,
    isBanned: false,
    warnings: 0,
    isAdmin: false,
    isBlocked: false,
    acceptedRules: false
  };
}

async function getUser(env, userId) {
  if (!userId) return null;
  return dbGet(env, ${KEY.USER}${userId}, null);
}

async function saveUser(env, user) {
  if (!user?.id) {
    throw new Error("Cannot save user without an ID");
  }

  user.lastSeenAt = now();

  await dbPut(env, ${KEY.USER}${user.id}, user);
  await dbAddUnique(env, KEY.USER_IDS, String(user.id));

  return user;
}

async function getOrCreateUser(env, from, referralCode = null) {
  const userId = String(from.id);
  let user = await getUser(env, userId);

  if (user) {
    user.username = from.username  user.username  null;
    user.firstName = from.first_name  user.firstName  "";
    user.lastName = from.last_name  user.lastName  "";
    user.lastSeenAt = now();

    await dbPut(env, ${KEY.USER}${userId}, user);
    return { user, created: false };
  }

  let referredBy = null;

  if (referralCode) {
    referredBy = await dbGetText(
      env,
      ${KEY.REFERRAL_CODE}${referralCode},
      ""
    );

    if (
      !referredBy ||
      String(referredBy) === userId ||
      !isTelegramId(referredBy)
    ) {
      referredBy = null;
    }
  }

  user = createUserRecord(from, "en", referredBy);
  await saveUser(env, user);

  return { user, created: true };
}

async function setUserLanguage(env, userId, language) {
  const user = await getUser(env, userId);
  if (!user) return null;

  user.language = validLanguage(language);
  await dbPut(env, ${KEY.USER}${userId}, user);

  const stats = await dbGet(env, KEY.LANGUAGE_STATS, {});
  stats[user.language] = safeNumber(stats[user.language], 0) + 1;
  await dbPut(env, KEY.LANGUAGE_STATS, stats);

  return user;
}

async function updateUser(env, userId, changes = {}) {
  const user = await getUser(env, userId);
  if (!user) return null;

  const updated = { ...user, ...changes, id: String(userId) };
  await dbPut(env, ${KEY.USER}${userId}, updated);

  return updated;
}

async function isAdmin(env, userId) {
  const ids = uniqueNumbers(
    String(env.ADMIN_IDS || "")
      .split(",")
      .map(value => value.trim())
  );

  return ids.includes(String(userId));
  }
async function isBanned(env, userId) {
  const user = await getUser(env, userId);

  if (user?.isBanned) return true;

  return Boolean(
    await dbGet(env, ${KEY.BAN}${userId}, false)
  );
}

// ============================================================
// EVENT LOGGING
// ============================================================

async function logEvent(env, type, data = {}) {
  const event = {
    id: makeId("event"),
    type: String(type),
    data,
    createdAt: now()
  };

  await dbPut(env, ${KEY.EVENT}${event.id}, event);
  await dbAddUnique(env, KEY.EVENT_IDS, event.id);

  return event;
}

async function getRecentEvents(env, limit = 50) {
  const ids = await dbGetList(env, KEY.EVENT_IDS);
  const selected = ids.slice(-Math.max(1, limit)).reverse();
  const events = [];

  for (const id of selected) {
    const event = await dbGet(env, ${KEY.EVENT}${id}, null);
    if (event) events.push(event);
  }

  return events;
}

// ============================================================
// REQUEST STATE
// ============================================================

async function setUserState(env, userId, state) {
  await dbPut(env, ${KEY.USER_STATE}${userId}, {
    ...state,
    updatedAt: now()
  });
}

async function getUserState(env, userId) {
  return dbGet(env, ${KEY.USER_STATE}${userId}, null);
}

async function clearUserState(env, userId) {
  await dbDelete(env, ${KEY.USER_STATE}${userId});
}

async function setAdminState(env, userId, state) {
  await dbPut(env, ${KEY.ADMIN_STATE}${userId}, {
    ...state,
    updatedAt: now()
  });
}

async function getAdminState(env, userId) {
  return dbGet(env, ${KEY.ADMIN_STATE}${userId}, null);
}

async function clearAdminState(env, userId) {
  await dbDelete(env, ${KEY.ADMIN_STATE}${userId});
}

// ============================================================
// END OF PART 1
// Part 2 will append movie management, ratings, favorites,
// referrals, membership checks and the main menus.
// ============================================================
// ============================================================
// SUPER MAN BOT
// Part 2 of 5 — Movies, Menus, Membership, Ratings, Referrals
// ============================================================

// ============================================================
// MEMBERSHIP CHECK
// ============================================================

async function checkMembership(env, userId) {
  const settings = await getSettings(env);
  const channel = settings.requiredChannel;

  if (!channel) return true;

  try {
    const member = await getChatMember(env, channel, userId);
    const status = member?.status;

    return [
      "creator",
      "administrator",
      "member"
    ].includes(status) || (
      status === "restricted" &&
      member?.is_member === true
    );
  } catch (error) {
    await logEvent(env, "membership_check_error", {
      userId: String(userId),
      message: error.message
    });

    return false;
  }
}

async function sendMembershipPrompt(env, chatId, language) {
  const settings = await getSettings(env);

  const keyboard = inlineKeyboard([
    [
      urlButton(
        t(language, "joinChannel"),
        settings.requiredChannelUrl
      )
    ],
    [
      inlineButton(
        t(language, "checkMembership"),
        "membership:check"
      )
    ]
  ]);

  return sendMessage(
    env,
    chatId,
    t(language, "joinRequired"),
    { reply_markup: keyboard }
  );
}

// ============================================================
// MAIN MENUS
// ============================================================

function getMainMenuKeyboard(language, admin = false) {
  const rows = [
    [
      t(language, "receiveMovie"),
      t(language, "sendMovie")
    ],
    [
      t(language, "favorites"),
      t(language, "profile")
    ],
    [
      t(language, "history"),
      t(language, "inviteFriends")
    ],
    [
      t(language, "achievements"),
      t(language, "leaderboard")
    ],
    [
      t(language, "movieRequest"),
      t(language, "report")
    ],
    [
      t(language, "changeLanguage")
    ]
  ];

  if (admin) {
    rows.push([t(language, "adminMenu")]);
  }

  return replyKeyboard(rows, {
    is_persistent: true
  });
}

async function showMainMenu(
  env,
  chatId,
  userId,
  extraText = ""
) {
  const user = await getUser(env, userId);

  if (!user) return null;

  const language = validLanguage(user.language);
  const admin = await isAdmin(env, userId);

  const message = extraText
    ? ${extraText}\n\n${t(language, "mainMenu")}
    : t(language, "mainMenu");

  return sendMessage(env, chatId, message, {
    reply_markup: getMainMenuKeyboard(language, admin)
  });
}

async function showLanguageMenu(
  env,
  chatId,
  callbackMode = false,
  callbackMessage = null
) {
  const rows = [];

  for (const [code, language] of Object.entries(LANGUAGES)) {
    rows.push([
      inlineButton(
        ${language.flag} ${language.name},
        language:set:${code}
      )
    ]);
  }

  const keyboard = inlineKeyboard(rows);
  const text = t("en", "chooseLanguage");

  if (callbackMode && callbackMessage) {
    return editMessageText(
      env,
      chatId,
      callbackMessage.message_id,
      text,
      { reply_markup: keyboard }
    );
  }

  return sendMessage(env, chatId, text, {
    reply_markup: keyboard
  });
}

// ============================================================
// LANGUAGE SELECTION
// ============================================================

async function handleLanguageSelection(
  env,
  chatId,
  userId,
  language
) {
  if (!Object.prototype.hasOwnProperty.call(LANGUAGES, language)) {
    return sendMessage(
      env,
      chatId,
      t("en", "invalidInput")
    );
  }

  let user = await getUser(env, userId);

  if (!user) {
    user = createUserRecord(
      { id: Number(userId) },
      language
    );

    await saveUser(env, user);
  } else {
    user.language = language;
    user.lastSeenAt = now();

    await dbPut(env, ${KEY.USER}${userId}, user);
  }

  await dbAddUnique(env, KEY.USER_IDS, String(userId));

  await logEvent(env, "language_selected", {
    userId: String(userId),
    language
  });

  const member = await checkMembership(env, userId);

  if (!member) {
    await sendMessage(
      env,
      chatId,
      t(language, "languageSaved")
    );

    return sendMembershipPrompt(env, chatId, language);
  }

  return sendMessage(
    env,
    chatId,
    ${t(language, "languageSaved")}\n\n${t(language, "welcome")},
    {
      reply_markup: getMainMenuKeyboard(
        language,
        await isAdmin(env, userId)
      )
    }
  );
}

// ============================================================
// START COMMAND
// ============================================================

function parseStartPayload(text = "") {
  const parts = String(text).trim().split(/\s+/);

  if (parts.length < 2) return null;

  const payload = parts[1].trim();

  if (!payload || payload.length > 100) return null;

  return payload;
}

async function handleStart(env, message) {
  const from = message.from;
  const chatId = message.chat.id;
  const userId = String(from.id);
  const payload = parseStartPayload(message.text || "");

  let referralCode = null;

  if (payload && payload.startsWith("ref_")) {
    referralCode = payload.slice(4);
  }

  const { user, created } = await getOrCreateUser(
    env,
    from,
    referralCode
  );

  const admin = await isAdmin(env, userId);

  if (admin && !user.isAdmin) {
    user.isAdmin = true;
    await dbPut(env, ${KEY.USER}${userId}, user);
  }

  await logEvent(env, created ? "user_registered" : "user_started", {
    userId,
    username: from.username || null
  });
  if (await isBanned(env, userId)) {
    return sendMessage(
      env,
      chatId,
      t(user.language, "banned")
    );
  }

  const settings = await getSettings(env);

  if (settings.maintenance && !admin) {
    return sendMessage(
      env,
      chatId,
      t(user.language, "maintenance")
    );
  }

  // New users must select their language first.
  if (created) {
    return showLanguageMenu(env, chatId);
  }

  // Existing users keep their saved language.
  if (!user.language) {
    return showLanguageMenu(env, chatId);
  }

  const language = validLanguage(user.language);

  // Existing users must still pass the required membership check.
  if (!(await checkMembership(env, userId))) {
    return sendMembershipPrompt(env, chatId, language);
  }

  // Referral processing is implemented below.
  if (referralCode && created) {
    await processReferral(env, userId, referralCode);
  }

  return sendMessage(
    env,
    chatId,
    t(language, "welcome"),
    {
      reply_markup: getMainMenuKeyboard(language, admin)
    }
  );
}

// ============================================================
// MEMBERSHIP CALLBACK
// ============================================================

async function handleMembershipCallback(
  env,
  callbackQuery
) {
  const userId = String(callbackQuery.from.id);
  const chatId = callbackQuery.message?.chat?.id;

  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const member = await checkMembership(env, userId);

  await answerCallback(
    env,
    callbackQuery.id,
    member
      ? t(language, "languageSaved")
      : t(language, "notJoined")
  );

  if (!chatId) return null;

  if (!member) {
    return sendMembershipPrompt(env, chatId, language);
  }

  return showMainMenu(
    env,
    chatId,
    userId,
    t(language, "welcome")
  );
}

// ============================================================
// MOVIE RECORDS
// ============================================================

function createMovieRecord({
  id,
  fileId,
  fileUniqueId = null,
  submittedBy,
  country = null,
  title = "",
  sourceChatId = null,
  sourceMessageId = null
}) {
  return {
    id: String(id || makeId("movie")),
    fileId: String(fileId),
    fileUniqueId,
    submittedBy: String(submittedBy),
    country: country || null,
    title: normalizeText(title, 150),
    sourceChatId: sourceChatId ? String(sourceChatId) : null,
    sourceMessageId: sourceMessageId
      ? String(sourceMessageId)
      : null,
    status: "approved",
    views: 0,
    comments: 0,
    ratings: {},
    ratingAverage: 0,
    ratingCount: 0,
    createdAt: now(),
    approvedAt: now(),
    approvedBy: null,
    deletedAt: null
  };
}

async function getMovie(env, movieId) {
  if (!movieId) return null;

  return dbGet(
    env,
    ${KEY.MOVIE}${movieId},
    null
  );
}

async function saveMovie(env, movie) {
  if (!movie?.id) {
    throw new Error("Movie record requires an ID");
  }

  await dbPut(
    env,
    ${KEY.MOVIE}${movie.id},
    movie
  );

  await dbAddUnique(
    env,
    KEY.MOVIE_IDS,
    String(movie.id)
  );

  return movie;
}

async function getAllMovies(env, options = {}) {
  const ids = await dbGetList(env, KEY.MOVIE_IDS);
  const movies = [];

  for (const id of ids) {
    const movie = await getMovie(env, id);

    if (!movie) continue;
    if (movie.deletedAt) continue;

    if (
      options.status &&
      movie.status !== options.status
    ) {
      continue;
    }

    if (
      options.approvedOnly &&
      movie.status !== "approved"
    ) {
      continue;
    }

    movies.push(movie);
  }

  return movies;
}

async function deleteMovieRecord(env, movieId) {
  const movie = await getMovie(env, movieId);

  if (!movie) return false;

  movie.status = "deleted";
  movie.deletedAt = now();

  await saveMovie(env, movie);

  await logEvent(env, "movie_deleted", {
    movieId: String(movieId)
  });

  return true;
    }
async function getApprovedMovies(env) {
  return getAllMovies(env, {
    status: "approved",
    approvedOnly: true
  });
}

// ============================================================
// MOVIE CAPTIONS
// ============================================================

function calculateMovieRating(movie) {
  const ratings = Object.values(movie?.ratings || {})
    .map(value => safeNumber(value, 0))
    .filter(value => value >= 1 && value <= 5);

  return {
    average: average(ratings),
    count: ratings.length
  };
}

function createMovieCaption(movie, language) {
  const rating = calculateMovieRating(movie);
  const country = movie.country ||
    t(language, "unknownCountry");

  const lines = [
    🎬 <b>${escapeHtml(movie.title || "SUPER MAN")}</b>,
    "",
    ${t(language, "views")}: ${safeNumber(movie.views, 0)},
    ${t(language, "comments")}: ${safeNumber(movie.comments, 0)},
    ${t(language, "averageRating")}: ${rating.average.toFixed(1)} / 5 (${rating.count}),
    🌍 ${t(language, "submittedBy")}: ${escapeHtml(country)},
    "",
    ${t(language, "submitted")},
    🤖 ${BOT_USERNAME}
  ];

  return lines.join("\n");
}

// ============================================================
// MOVIE INLINE KEYBOARD
// ============================================================

async function userRatedMovie(env, movieId, userId) {
  const movie = await getMovie(env, movieId);

  if (!movie) return false;

  return Object.prototype.hasOwnProperty.call(
    movie.ratings || {},
    String(userId)
  );
}

async function userFavoritedMovie(env, userId, movieId) {
  const favorites = await dbGetList(
    env,
    ${KEY.FAVORITES}${userId}
  );

  return favorites.some(
    value => String(value) === String(movieId)
  );
}

async function createMovieKeyboard(
  env,
  movie,
  userId,
  language
) {
  const favorite = await userFavoritedMovie(
    env,
    userId,
    movie.id
  );

  const ratingRow = [
    inlineButton("⭐ 1", rate:${movie.id}:1),
    inlineButton("⭐ 2", rate:${movie.id}:2),
    inlineButton("⭐ 3", rate:${movie.id}:3),
    inlineButton("⭐ 4", rate:${movie.id}:4),
    inlineButton("⭐ 5", rate:${movie.id}:5)
  ];

  const rows = [
    ratingRow,
    [
      inlineButton(
        favorite
          ? t(language, "removeFavorite")
          : t(language, "addFavorite"),
        favorite:toggle:${movie.id}
      )
    ],
    [
      inlineButton(
        t(language, "nextMovie"),
        "movie:next"
      )
    ]
  ];

  return inlineKeyboard(rows);
}

// ============================================================
// MOVIE DELIVERY AND HISTORY
// ============================================================

async function addMovieToHistory(env, userId, movieId) {
  const key = ${KEY.HISTORY}${userId};
  const history = await dbGetList(env, key);

  const filtered = history.filter(
    item => String(item) !== String(movieId)
  );

  filtered.push(String(movieId));

  await dbPut(env, key, filtered.slice(-100));
}

async function incrementMovieViews(env, movieId) {
  const movie = await getMovie(env, movieId);

  if (!movie || movie.status !== "approved") {
    return null;
  }

  movie.views = safeNumber(movie.views, 0) + 1;
  await saveMovie(env, movie);

  return movie;
}

async function chooseRandomMovie(env, userId) {
  const movies = await getApprovedMovies(env);

  if (!movies.length) return null;

  const history = await dbGetList(
    env,
    ${KEY.HISTORY}${userId}
  );

  const previouslySeen = new Set(
    history.map(value => String(value))
  );

  let candidates = movies.filter(
    movie => !previouslySeen.has(String(movie.id))
  );

  // When all available movies have been seen, start a new cycle.
  if (!candidates.length) {
    candidates = movies;
  }

  return randomItem(candidates);
}

async function sendMovieToUser(
  env,
  chatId,
  userId,
  movie
) {
  const user = await getUser(env, userId);

  if (!user) return null;

  const language = validLanguage(user.language);
  if (!movie || movie.status !== "approved") {
    return sendMessage(
      env,
      chatId,
      t(language, "noMovies")
    );
  }

  const updatedMovie = await incrementMovieViews(
    env,
    movie.id
  );

  if (!updatedMovie) {
    return sendMessage(
      env,
      chatId,
      t(language, "movieUnavailable")
    );
  }

  const caption = createMovieCaption(
    updatedMovie,
    language
  );

  const keyboard = await createMovieKeyboard(
    env,
    updatedMovie,
    userId,
    language
  );

  // Send the stored Telegram file ID.
  const sent = await sendVideo(
    env,
    chatId,
    updatedMovie.fileId,
    {
      caption,
      parse_mode: "HTML",
      reply_markup: keyboard,
      supports_streaming: true
    }
  );

  await addMovieToHistory(
    env,
    userId,
    updatedMovie.id
  );

  await updateUser(env, userId, {
    totalMoviesReceived:
      safeNumber(user.totalMoviesReceived, 0) + 1
  });

  await logEvent(env, "movie_delivered", {
    userId: String(userId),
    movieId: String(updatedMovie.id)
  });

  // Store the sent message ID for the timed deletion.
  // Cloudflare's scheduled handler in Part 5 will process
  // deletion tasks safely without blocking this request.
  const deleteAt = now() + 60_000;

  await dbPut(
    env,
    delete_task:${sent.message_id},
    {
      chatId: String(chatId),
      messageId: sent.message_id,
      movieId: String(updatedMovie.id),
      deleteAt
    }
  );

  await dbAddUnique(
    env,
    "delete_tasks:ids",
    String(sent.message_id)
  );

  return sent;
}

async function handleGetMovie(env, chatId, userId) {
  const user = await getUser(env, userId);

  if (!user) {
    return sendMessage(
      env,
      chatId,
      t("en", "error")
    );
  }

  const language = validLanguage(user.language);
  const settings = await getSettings(env);

  if (await isBanned(env, userId)) {
    return sendMessage(
      env,
      chatId,
      t(language, "banned")
    );
  }

  if (settings.maintenance && !(await isAdmin(env, userId))) {
    return sendMessage(
      env,
      chatId,
      t(language, "maintenance")
    );
  }

  const lastRequest = safeNumber(
    await dbGet(
      env,
      ${KEY.COOLDOWN}${userId},
      0
    ),
    0
  );

  const remaining = Math.ceil(
    (
      lastRequest +
      settings.requestCooldownSeconds * 1000 -
      now()
    ) / 1000
  );

  if (
    remaining > 0 &&
    !(await isAdmin(env, userId))
  ) {
    return sendMessage(
      env,
      chatId,
      t(language, "cooldown", {
        seconds: remaining
      })
    );
  }

  await dbPut(
    env,
    ${KEY.COOLDOWN}${userId},
    now()
  );

  const movie = await chooseRandomMovie(env, userId);

  if (!movie) {
    return sendMessage(
      env,
      chatId,
      t(language, "noMovies")
    );
  }

  return sendMovieToUser(
    env,
    chatId,
    userId,
    movie
  );
}

// ============================================================
// MOVIE RATINGS
// ============================================================

async function rateMovie(
  env,
  userId,
  movieId,
  rating
) {
  const score = safeNumber(rating, 0);

  if (!Number.isInteger(score)  score < 1  score > 5) {
    return {
      ok: false,
      reason: "invalid_rating"
    };
  }

  const movie = await getMovie(env, movieId);

  if (!movie || movie.status !== "approved") {
    return {
      ok: false,
      reason: "movie_missing"
    };
  }

  if (!movie.ratings || typeof movie.ratings !== "object") {
    movie.ratings = {};
  }

  const userKey = String(userId);

  if (
    Object.prototype.hasOwnProperty.call(
      movie.ratings,
      userKey
    )
  ) {
    return {
      ok: false,
      reason: "already_rated",
      movie
    };
  }

  movie.ratings[userKey] = score;

  const calculated = calculateMovieRating(movie);

  movie.ratingAverage = calculated.average;
  movie.ratingCount = calculated.count;

  await saveMovie(env, movie);

  const user = await getUser(env, userId);
  if (user) {
    user.totalRatings = safeNumber(user.totalRatings, 0) + 1;
    user.experience = safeNumber(user.experience, 0) + 2;

    await saveUser(env, user);
  }

  await logEvent(env, "movie_rated", {
    userId: String(userId),
    movieId: String(movieId),
    rating: score
  });

  return {
    ok: true,
    movie,
    rating: calculated
  };
}

async function handleRatingCallback(
  env,
  callbackQuery,
  movieId,
  rating
) {
  const userId = String(callbackQuery.from.id);
  const chatId = callbackQuery.message?.chat?.id;

  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const result = await rateMovie(
    env,
    userId,
    movieId,
    rating
  );

  if (!result.ok) {
    const message = result.reason === "already_rated"
      ? t(language, "ratingDuplicate")
      : t(language, "movieUnavailable");

    await answerCallback(
      env,
      callbackQuery.id,
      message
    );

    return null;
  }

  await answerCallback(
    env,
    callbackQuery.id,
    t(language, "ratingSaved")
  );

  if (!chatId) return null;

  // Refresh the caption and keyboard after a successful rating.
  const movie = result.movie;
  const caption = createMovieCaption(movie, language);
  const keyboard = await createMovieKeyboard(
    env,
    movie,
    userId,
    language
  );

  return telegramCall(env, "editMessageCaption", {
    chat_id: chatId,
    message_id: callbackQuery.message.message_id,
    caption,
    parse_mode: "HTML",
    reply_markup: keyboard
  }).catch(async error => {
    await logEvent(env, "movie_caption_update_error", {
      movieId: String(movieId),
      message: error.message
    });

    return null;
  });
}

// ============================================================
// FAVORITES
// ============================================================

async function toggleFavorite(env, userId, movieId) {
  const movie = await getMovie(env, movieId);

  if (!movie || movie.status !== "approved") {
    return {
      ok: false,
      added: false
    };
  }

  const key = ${KEY.FAVORITES}${userId};
  const favorites = await dbGetList(env, key);

  const exists = favorites.some(
    value => String(value) === String(movieId)
  );

  let updated;

  if (exists) {
    updated = favorites.filter(
      value => String(value) !== String(movieId)
    );
  } else {
    updated = [...favorites, String(movieId)];
  }

  await dbPut(env, key, updated);

  await logEvent(env, exists ? "favorite_removed" : "favorite_added", {
    userId: String(userId),
    movieId: String(movieId)
  });

  return {
    ok: true,
    added: !exists,
    favorites: updated
  };
}

async function handleFavoriteCallback(
  env,
  callbackQuery,
  movieId
) {
  const userId = String(callbackQuery.from.id);
  const chatId = callbackQuery.message?.chat?.id;
  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const result = await toggleFavorite(
    env,
    userId,
    movieId
  );

  if (!result.ok) {
    return answerCallback(
      env,
      callbackQuery.id,
      t(language, "movieUnavailable")
    );
  }

  await answerCallback(
    env,
    callbackQuery.id,
    t(
      language,
      result.added ? "favoriteAdded" : "favoriteRemoved"
    )
  );

  if (!chatId) return null;

  const movie = await getMovie(env, movieId);

  if (!movie) return null;

  const caption = createMovieCaption(movie, language);
  const keyboard = await createMovieKeyboard(
    env,
    movie,
    userId,
    language
  );

  return telegramCall(env, "editMessageCaption", {
    chat_id: chatId,
    message_id: callbackQuery.message.message_id,
    caption,
    parse_mode: "HTML",
    reply_markup: keyboard
  }).catch(() => null);
}

async function showFavorites(env, chatId, userId) {
  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const favorites = await dbGetList(
    env,
    ${KEY.FAVORITES}${userId}
  );

  const validMovies = [];
  for (const id of favorites) {
    const movie = await getMovie(env, id);

    if (movie && movie.status === "approved") {
      validMovies.push(movie);
    }
  }

  if (!validMovies.length) {
    return sendMessage(
      env,
      chatId,
      t(language, "favoriteEmpty")
    );
  }

  const rows = validMovies.slice(-20).reverse().map(movie => [
    inlineButton(
      🎬 ${normalizeText(movie.title || movie.id, 45)},
      favorite:open:${movie.id}
    )
  ]);

  return sendMessage(
    env,
    chatId,
    t(language, "favorites"),
    {
      reply_markup: inlineKeyboard(rows)
    }
  );
}

async function showFavoriteMovie(
  env,
  chatId,
  userId,
  movieId
) {
  const movie = await getMovie(env, movieId);

  if (!movie || movie.status !== "approved") {
    const user = await getUser(env, userId);

    return sendMessage(
      env,
      chatId,
      t(validLanguage(user?.language || "en"), "movieUnavailable")
    );
  }

  return sendMovieToUser(env, chatId, userId, movie);
}

// ============================================================
// WATCH HISTORY
// ============================================================

async function showHistory(env, chatId, userId) {
  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const history = await dbGetList(
    env,
    ${KEY.HISTORY}${userId}
  );

  const movies = [];

  for (const id of history.slice(-30).reverse()) {
    const movie = await getMovie(env, id);

    if (movie && movie.status === "approved") {
      movies.push(movie);
    }
  }

  if (!movies.length) {
    return sendMessage(
      env,
      chatId,
      t(language, "historyEmpty")
    );
  }

  const rows = movies.map(movie => [
    inlineButton(
      🎬 ${normalizeText(movie.title || movie.id, 45)},
      history:open:${movie.id}
    )
  ]);

  return sendMessage(
    env,
    chatId,
    t(language, "history"),
    {
      reply_markup: inlineKeyboard(rows)
    }
  );
}

// ============================================================
// USER PROFILE
// ============================================================

function calculateLevel(experience) {
  const xp = Math.max(0, safeNumber(experience, 0));
  const level = Math.floor(Math.sqrt(xp / 25)) + 1;
  const currentLevelXP = Math.pow(level - 1, 2) * 25;
  const nextLevelXP = Math.pow(level, 2) * 25;

  return {
    level,
    experience: xp,
    currentLevelXP,
    nextLevelXP,
    progress: nextLevelXP === currentLevelXP
      ? 100
      : Math.round(
          (
            (xp - currentLevelXP) /
            (nextLevelXP - currentLevelXP)
          ) * 100
        )
  };
}

async function showProfile(env, chatId, userId) {
  const user = await getUser(env, userId);

  if (!user) {
    return sendMessage(
      env,
      chatId,
      t("en", "error")
    );
  }

  const language = validLanguage(user.language);
  const favorites = await dbGetList(
    env,
    ${KEY.FAVORITES}${userId}
  );

  const history = await dbGetList(
    env,
    ${KEY.HISTORY}${userId}
  );

  const referrals = await dbGetList(
    env,
    ${KEY.REFERRALS}${userId}
  );

  const level = calculateLevel(user.experience);

  const text = [
    t(language, "profileTitle"),
    "",
    🆔 ID: ${user.id},
    👤 ${escapeHtml(getUserDisplayName(user))},
    🌐 ${LANGUAGES[language].name},
    🏅 Level: ${level.level},
    ✨ XP: ${level.experience},
    🎬 ${safeNumber(user.totalMoviesReceived, 0)},
    📤 ${safeNumber(user.totalMoviesSubmitted, 0)},
    ⭐ ${favorites.length},
    🕘 ${history.length},
    🎁 ${referrals.length},
    📅 ${new Date(user.joinedAt || now()).toISOString().slice(0, 10)}
  ].join("\n");

  return sendHtmlMessage(
    env,
    chatId,
    text,
    {
      reply_markup: inlineKeyboard([
        [
          inlineButton(
            t(language, "inviteFriends"),
            "menu:invite"
          )
        ],
        [
          inlineButton(
            t(language, "achievements"),
            "menu:achievements"
          )
        ]
      ])
    }
  );
}

// ============================================================
// REFERRALS
// ============================================================

function makeReferralCode(userId) {
  return ref_${String(userId)};
}

async function getOrCreateReferralCode(env, userId) {
  const key = ${KEY.REFERRAL_CODE}${userId};
  let code = await dbGetText(env, key, "");

  if (!code) {
    code = makeReferralCode(userId);

    await dbPutText(
      env,
      ${KEY.REFERRAL_CODE}${code},
      String(userId)
    );

    await dbPutText(env, key, code);
  }

  return code;
}

async function showInvite(env, chatId, userId) {
  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const code = await getOrCreateReferralCode(
    env,
    userId
  );

  const botInfo = await getBotInfo(env);
  const link = makeStartLink(botInfo.username, code);

  const referrals = await dbGetList(
    env,
    ${KEY.REFERRALS}${userId}
  );

  return sendMessage(
    env,
    chatId,
    t(language, "inviteText", {
      link,
      count: referrals.length
    }),
    {
      reply_markup: inlineKeyboard([
        [
          urlButton(
            t(language, "inviteFriends"),
            link
          )
        ]
      ])
    }
  );
}

async function processReferral(
  env,
  newUserId,
  referralCode
) {
  if (!referralCode) return false;

  const settings = await getSettings(env);

  if (!settings.referralsEnabled) {
    return false;
  }

  const referrerId = await dbGetText(
    env,
    ${KEY.REFERRAL_CODE}${referralCode},
    ""
  );

  if (!referrerId || !isTelegramId(referrerId)) {
    return false;
  }

  if (String(referrerId) === String(newUserId)) {
    return false;
  }

  const newUser = await getUser(env, newUserId);
  const referrer = await getUser(env, referrerId);

  if (!newUser || !referrer) return false;

  // Each user may only be attributed to one referrer.
  if (newUser.referredBy) return false;

  const referralsKey = ${KEY.REFERRALS}${referrerId};
  const referrals = await dbGetList(env, referralsKey);

  if (referrals.some(id => String(id) === String(newUserId))) {
    return false;
  }

  referrals.push(String(newUserId));

  await dbPut(env, referralsKey, referrals);

  newUser.referredBy = String(referrerId);
  await dbPut(env, ${KEY.USER}${newUserId}, newUser);

  referrer.referralCount = referrals.length;
  referrer.totalInvites = referrals.length;
  referrer.experience =
    safeNumber(referrer.experience, 0) + 10;

  // Reward one extra request for each complete group
  // of the configured number of valid referrals.
  const required = Math.max(
    1,
    safeNumber(settings.referralsRequired, 3)
  );

  const earnedRewards = Math.floor(
    referrals.length / required
  );

  const existingRewards = safeNumber(
    referrer.referralRewards,
    0
  );

  const newRewards = Math.max(
    0,
    earnedRewards - existingRewards
  );

  if (newRewards > 0) {
    referrer.requestCredits =
      safeNumber(referrer.requestCredits, 0) + newRewards;

    referrer.referralRewards = earnedRewards;
  }

  await dbPut(
    env,
    ${KEY.USER}${referrerId},
    referrer
  );

  await logEvent(env, "referral_registered", {
    newUserId: String(newUserId),
    referrerId: String(referrerId),
    rewardCount: newRewards
  });

  return true;
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first_movie",
    title: "🎬 First Movie",
    description: "Receive your first movie.",
    condition: user =>
      safeNumber(user.totalMoviesReceived, 0) >= 1
  },
  {
    id: "movie_fan",
    title: "🍿 Movie Fan",
    description: "Receive 10 movies.",
    condition: user =>
      safeNumber(user.totalMoviesReceived, 0) >= 10
  },
  {
    id: "movie_expert",
    title: "🏆 Movie Expert",
    description: "Receive 50 movies.",
    condition: user =>
      safeNumber(user.totalMoviesReceived, 0) >= 50
  },
  {
    id: "first_submission",
    title: "📤 First Submission",
    description: "Submit your first movie.",
    condition: user =>
      safeNumber(user.totalMoviesSubmitted, 0) >= 1
  },
  {
    id: "first_rating",
    title: "⭐ First Rating",
    description: "Rate your first movie.",
    condition: user =>
      safeNumber(user.totalRatings, 0) >= 1
  },
  {
    id: "first_invite",
    title: "🎁 First Invite",
    description: "Invite your first valid user.",
    condition: user =>
      safeNumber(user.totalInvites, 0) >= 1
  }
];

async function updateAchievements(env, userId) {
  const user = await getUser(env, userId);

  if (!user) return [];

  const key = ${KEY.ACHIEVEMENTS}${userId};
  const unlocked = await dbGetList(env, key);
  const newlyUnlocked = [];

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    if (unlocked.includes(achievement.id)) continue;

    if (achievement.condition(user)) {
      unlocked.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length) {
    await dbPut(env, key, unlocked);

    await logEvent(env, "achievements_unlocked", {
      userId: String(userId),
      achievementIds: newlyUnlocked.map(item => item.id)
    });
  }

  return newlyUnlocked;
}

async function showAchievements(env, chatId, userId) {
  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  await updateAchievements(env, userId);

  const unlocked = await dbGetList(
    env,
    ${KEY.ACHIEVEMENTS}${userId}
  );

  const lines = [
    t(language, "achievements"),
    ""
  ];

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    const isUnlocked = unlocked.includes(achievement.id);

    lines.push(
      ${isUnlocked ? "✅" : "🔒"} ${achievement.title},
      achievement.description,
      ""
    );
  }

  return sendMessage(
    env,
    chatId,
    lines.join("\n")
  );
}

// ============================================================
// LEADERBOARD
// ============================================================

async function getLeaderboard(env, limit = 10) {
  const userIds = await dbGetList(env, KEY.USER_IDS);
  const users = [];

  for (const userId of userIds) {
    const user = await getUser(env, userId);

    if (!user || user.isBanned) continue;

    users.push(user);
  }

  users.sort((a, b) =>
    safeNumber(b.experience, 0) -
    safeNumber(a.experience, 0)
  );

  return users.slice(0, clamp(limit, 1, 50));
}

async function showLeaderboard(env, chatId, userId) {
  const user = await getUser(env, userId);
  const language = validLanguage(user?.language || "en");

  const leaders = await getLeaderboard(env, 10);

  if (!leaders.length) {
    return sendMessage(
      env,
      chatId,
      t(language, "noMovies")
    );
  }

  const lines = [
    t(language, "leaderboard"),
    ""
  ];

  leaders.forEach((leader, index) => {
    const name = normalizeText(
      leader.firstName  leader.username  leader.id,
      40
    );

    lines.push(
      ${index + 1}. ${name} — ${safeNumber(leader.experience, 0)} XP
    );
  });

  return sendMessage(
    env,
    chatId,
    lines.join("\n")
  );
}

// ============================================================
// END OF PART 2
// Part 3 will add submissions, moderation, reports,
// movie requests and administrator approval workflows.
// ============================================================
/* =========================================================
   SUPER MAN BOT — PART 3 (CORRECTED)
   صف بررسی فیلم‌ها، تأیید و رد، گزارش‌ها و درخواست‌ها
   ========================================================= */


/* =========================================================
   1. صف فیلم‌های در انتظار بررسی
   ========================================================= */

async function getPendingMovies(env) {
  const items = await dbGetList(env, KEY.pendingMovies);
  return Array.isArray(items) ? items : [];
}

async function savePendingMovies(env, movies) {
  return dbPut(env, KEY.pendingMovies, movies);
}

async function getPendingMovie(env, pendingId) {
  const movies = await getPendingMovies(env);
  return movies.find(movie => movie.id === pendingId) || null;
}

async function savePendingMovie(env, movie) {
  const movies = await getPendingMovies(env);
  const index = movies.findIndex(item => item.id === movie.id);

  if (index === -1) {
    movies.push(movie);
  } else {
    movies[index] = movie;
  }

  await savePendingMovies(env, movies);
  return movie;
}

async function removePendingId(env, pendingId) {
  const movies = await getPendingMovies(env);
  const filtered = movies.filter(movie => movie.id !== pendingId);

  await savePendingMovies(env, filtered);
  return filtered.length !== movies.length;
}

async function hasPendingSubmission(env, userId) {
  const movies = await getPendingMovies(env);

  return movies.some(movie =>
    String(movie.userId) === String(userId) &&
    movie.status === "pending"
  );
}


/* =========================================================
   2. تشخیص ویدئو یا فایل ویدئویی
   ========================================================= */

function extractVideoData(message) {
  if (!message) return null;

  if (message.video) {
    return {
      fileId: message.video.file_id,
      fileUniqueId: message.video.file_unique_id || null,
      mediaType: "video",
      fileName: null,
      caption: message.caption || ""
    };
  }

  if (message.document) {
    const doc = message.document;
    const mime = doc.mime_type || "";
    const fileName = doc.file_name || "";

    const isVideo =
      mime.startsWith("video/") ||
      /\.(mp4|mkv|mov|avi|webm)$/i.test(fileName);

    if (isVideo) {
      return {
        fileId: doc.file_id,
        fileUniqueId: doc.file_unique_id || null,
        mediaType: "document",
        fileName,
        caption: message.caption || ""
      };
    }
  }

  return null;
}


/* =========================================================
   3. بررسی شرایط ارسال فیلم
   ========================================================= */

async function canSubmitMovie(env, userId) {
  if (await isBanned(env, userId)) {
    return { allowed: false, reason: "banned" };
  }

  const user = await getUser(env, userId);

  if (!user) {
    return { allowed: false, reason: "user_not_found" };
  }

  if (await hasPendingSubmission(env, userId)) {
    return { allowed: false, reason: "pending_exists" };
  }

  return { allowed: true, user };
}


/* =========================================================
   4. مدیران و ارسال پیام به آن‌ها
   ========================================================= */

function getAdminIds(env) {
  const raw = String(env.ADMIN_IDS || "");

  return uniqueNumbers(
    raw
      .split(",")
      .map(value => Number(value.trim()))
      .filter(value => Number.isSafeInteger(value) && value > 0)
  );
}

async function notifyAdmins(env, message, keyboard) {
  const results = [];

  for (const adminId of getAdminIds(env)) {
    try {
      await sendMessage(env, adminId, message, keyboard);
      results.push({ adminId, ok: true });
    } catch (error) {
      results.push({
        adminId,
        ok: false,
        error: String(error)
      });
    }
  }

  return results;
}


/* =========================================================
   5. ثبت فیلم ارسالی کاربر
   ========================================================= */

async function submitMovie(env, message, userId) {
  const media = extractVideoData(message);
  if (!media) {
    return { ok: false, reason: "invalid_media" };
  }

  const permission = await canSubmitMovie(env, userId);

  if (!permission.allowed) {
    return {
      ok: false,
      reason: permission.reason
    };
  }

  const user = permission.user;

  const pending = {
    id: makeId("pending"),
    userId: Number(userId),
    fileId: media.fileId,
    fileUniqueId: media.fileUniqueId,
    mediaType: media.mediaType,
    fileName: media.fileName,
    caption: media.caption,
    language: validLanguage(user.language) ? user.language : "en",
    status: "pending",
    submittedAt: now(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: ""
  };

  await savePendingMovie(env, pending);

  await logEvent(env, "movie_submitted", {
    pendingId: pending.id,
    userId: Number(userId)
  });

  await notifyAdminsNewMovie(env, pending);

  return { ok: true, movie: pending };
}

async function notifyAdminsNewMovie(env, movie) {
  const keyboard = inlineKeyboard([
    [
      inlineButton("✅ تأیید", admin:approve:${movie.id}),
      inlineButton("❌ رد", admin:reject:${movie.id})
    ],
    [
      inlineButton("🔎 جزئیات", admin:pending_details:${movie.id})
    ]
  ]);

  const user = await getUser(env, movie.userId);

  const text =
    "🎬 فیلم جدید برای بررسی\n\n" +
    🆔 شناسه فیلم: ${movie.id}\n +
    👤 کاربر: ${getUserDisplayName(user)}\n +
    🆔 شناسه کاربر: ${movie.userId}\n +
    🌐 زبان: ${movie.language}\n +
    📅 زمان ارسال: ${new Date(movie.submittedAt).toISOString()}\n\n +
    "برای تأیید یا رد از دکمه‌ها استفاده کن.";

  for (const adminId of getAdminIds(env)) {
    try {
      await sendMessage(env, adminId, text, keyboard);

      if (movie.mediaType === "document") {
        await telegramCall(env, "sendDocument", {
          chat_id: adminId,
          document: movie.fileId,
          caption: "📥 فایل ارسالی برای بررسی"
        });
      } else {
        await sendVideo(
          env,
          adminId,
          movie.fileId,
          "📥 فیلم ارسالی برای بررسی"
        );
      }
    } catch (error) {
      await logEvent(env, "admin_notification_failed", {
        adminId,
        pendingId: movie.id,
        error: String(error)
      });
    }
  }
}


/* =========================================================
   6. تأیید فیلم و افزودن به آرشیو فیلم‌ها
   ========================================================= */

async function approvePendingMovie(env, pendingId, adminId) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const pending = await getPendingMovie(env, pendingId);

  if (!pending || pending.status !== "pending") {
    return { ok: false, reason: "not_pending" };
  }

  const movieId = makeId("movie");

  const movie = {
    id: movieId,
    fileId: pending.fileId,
    fileUniqueId: pending.fileUniqueId,
    mediaType: pending.mediaType,
    fileName: pending.fileName || null,
    caption: pending.caption || "",
    submittedBy: pending.userId,
    language: pending.language,
    status: "approved",
    createdAt: now(),
    approvedAt: now(),
    approvedBy: Number(adminId),
    views: 0,
    comments: 0,
    ratings: {},
    averageRating: 0
  };

  await saveMovie(env, movie);

  pending.status = "approved";
  pending.reviewedAt = now();
  pending.reviewedBy = Number(adminId);

  await savePendingMovie(env, pending);
  await removePendingId(env, pendingId);

  await logEvent(env, "movie_approved", {
    pendingId,
    movieId,
    adminId: Number(adminId),
    userId: pending.userId
  });

  const user = await getUser(env, pending.userId);

  if (user) {
    await sendMessage(
      env,
      pending.userId,
      t(user.language, "movieApproved")
    );
  }

  return { ok: true, movie };
}


/* =========================================================
   7. رد فیلم با امکان ثبت دلیل
   ========================================================= */
async function rejectPendingMovie(
  env,
  pendingId,
  adminId,
  reason = ""
) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const pending = await getPendingMovie(env, pendingId);

  if (!pending || pending.status !== "pending") {
    return { ok: false, reason: "not_pending" };
  }

  pending.status = "rejected";
  pending.reviewedAt = now();
  pending.reviewedBy = Number(adminId);
  pending.rejectionReason = String(reason || "").slice(0, 500);

  await savePendingMovie(env, pending);
  await removePendingId(env, pendingId);

  await logEvent(env, "movie_rejected", {
    pendingId,
    adminId: Number(adminId),
    userId: pending.userId,
    reason: pending.rejectionReason
  });

  const user = await getUser(env, pending.userId);

  if (user) {
    let text = t(user.language, "movieRejected");

    if (pending.rejectionReason) {
      text += \n\n📝 دلیل: ${pending.rejectionReason};
    }

    await sendMessage(env, pending.userId, text);
  }

  return { ok: true, movie: pending };
}


/* =========================================================
   8. نمایش صف بررسی فیلم‌ها
   ========================================================= */

async function showPendingQueue(env, chatId, adminId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  const movies = (await getPendingMovies(env))
    .filter(movie => movie.status === "pending")
    .sort((a, b) => b.submittedAt - a.submittedAt);

  if (movies.length === 0) {
    return sendMessage(
      env,
      chatId,
      "📭 در حال حاضر فیلمی در صف بررسی نیست."
    );
  }

  const rows = movies.slice(0, 20).map(movie => [
    inlineButton(
      🎬 ${movie.id} | ${movie.userId},
      admin:pending_details:${movie.id}
    )
  ]);

  rows.push([
    inlineButton("🔄 تازه‌سازی", "admin:pending")
  ]);

  return sendMessage(
    env,
    chatId,
    📥 صف بررسی فیلم‌ها\n\nتعداد فیلم‌های منتظر: ${movies.length},
    inlineKeyboard(rows)
  );
}

async function showPendingDetails(env, chatId, adminId, pendingId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  const movie = await getPendingMovie(env, pendingId);

  if (!movie) {
    return sendMessage(env, chatId, "❌ فیلم موردنظر پیدا نشد.");
  }

  const user = await getUser(env, movie.userId);

  const text =
    "🎬 جزئیات فیلم\n\n" +
    شناسه: ${movie.id}\n +
    کاربر: ${getUserDisplayName(user)}\n +
    شناسه کاربر: ${movie.userId}\n +
    زبان: ${movie.language}\n +
    نوع فایل: ${movie.mediaType}\n +
    وضعیت: ${movie.status}\n +
    زمان ارسال: ${new Date(movie.submittedAt).toISOString()}\n +
    (movie.fileName ? نام فایل: ${movie.fileName}\n : "") +
    (movie.caption ? \nتوضیح کاربر:\n${movie.caption} : "");

  const keyboard = inlineKeyboard([
    [
      inlineButton("✅ تأیید", admin:approve:${movie.id}),
      inlineButton("❌ رد", admin:reject:${movie.id})
    ],
    [
      inlineButton("⬅️ بازگشت", "admin:pending")
    ]
  ]);

  await sendMessage(env, chatId, text, keyboard);

  if (movie.mediaType === "document") {
    return telegramCall(env, "sendDocument", {
      chat_id: chatId,
      document: movie.fileId
    });
  }

  return sendVideo(env, chatId, movie.fileId);
}

async function startRejectFlow(env, adminId, pendingId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, adminId, "⛔ دسترسی غیرمجاز است.");
  }

  const movie = await getPendingMovie(env, pendingId);

  if (!movie || movie.status !== "pending") {
    return sendMessage(env, adminId, "❌ این فیلم دیگر در صف بررسی نیست.");
  }

  await setAdminState(env, adminId, {
    action: "reject_movie",
    pendingId,
    createdAt: now()
  });

  return sendMessage(
    env,
    adminId,
    "📝 دلیل رد فیلم را در یک پیام بفرست.\n\nاگر نمی‌خواهی دلیل ثبت شود، عبارت «بدون دلیل» را ارسال کن."
  );
}


/* =========================================================
   9. گزارش‌های کاربران
   ========================================================= */
async function getAllReports(env, status = "all") {
  const reports = await dbGetList(env, KEY.reports);
  const list = Array.isArray(reports) ? reports : [];

  if (status === "all") return list;

  return list.filter(report => report.status === status);
}

async function saveReport(env, report) {
  const reports = await getAllReports(env, "all");
  const index = reports.findIndex(item => item.id === report.id);

  if (index === -1) {
    reports.push(report);
  } else {
    reports[index] = report;
  }

  await dbPut(env, KEY.reports, reports);
  return report;
}

async function createReport(env, userId, movieId, reason = "") {
  const report = {
    id: makeId("report"),
    userId: Number(userId),
    movieId: String(movieId),
    reason: String(reason || "").slice(0, 500),
    status: "open",
    createdAt: now(),
    resolvedAt: null,
    resolvedBy: null
  };

  await saveReport(env, report);

  await logEvent(env, "report_created", {
    reportId: report.id,
    userId: Number(userId),
    movieId: String(movieId)
  });

  const keyboard = inlineKeyboard([
    [
      inlineButton("✅ رسیدگی شد", admin:report_done:${report.id})
    ]
  ]);

  await notifyAdmins(
    env,
    "🚩 گزارش جدید\n\n" +
      شناسه گزارش: ${report.id}\n +
      شناسه کاربر: ${report.userId}\n +
      شناسه فیلم: ${report.movieId}\n +
      دلیل: ${report.reason || "ثبت نشده"},
    keyboard
  );

  return report;
}

async function resolveReport(env, reportId, adminId) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const reports = await getAllReports(env, "all");
  const report = reports.find(item => item.id === reportId);

  if (!report) {
    return { ok: false, reason: "not_found" };
  }

  if (report.status !== "open") {
    return { ok: false, reason: "already_resolved" };
  }

  report.status = "resolved";
  report.resolvedAt = now();
  report.resolvedBy = Number(adminId);

  await saveReport(env, report);

  await logEvent(env, "report_resolved", {
    reportId,
    adminId: Number(adminId)
  });

  return { ok: true, report };
}

async function showReports(env, chatId, adminId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  // اصلاح مهم: env باید به تابع داده شود.
  const reports = await getAllReports(env, "open");

  if (!reports.length) {
    return sendMessage(env, chatId, "📭 گزارش بررسی‌نشده‌ای وجود ندارد.");
  }

  const rows = reports.slice(0, 20).map(report => [
    inlineButton(
      🚩 ${report.id} | فیلم ${report.movieId},
      admin:report_details:${report.id}
    )
  ]);

  return sendMessage(
    env,
    chatId,
    🚩 گزارش‌های باز\n\nتعداد: ${reports.length},
    inlineKeyboard(rows)
  );
}

async function showReportDetails(env, chatId, adminId, reportId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  const reports = await getAllReports(env, "all");
  const report = reports.find(item => item.id === reportId);

  if (!report) {
    return sendMessage(env, chatId, "❌ گزارش پیدا نشد.");
  }

  const text =
    "🚩 جزئیات گزارش\n\n" +
    شناسه گزارش: ${report.id}\n +
    کاربر گزارش‌دهنده: ${report.userId}\n +
    شناسه فیلم: ${report.movieId}\n +
    وضعیت: ${report.status}\n +
    دلیل: ${report.reason || "ثبت نشده"}\n +
    زمان ثبت: ${new Date(report.createdAt).toISOString()};

  const keyboard = inlineKeyboard([
    ...(report.status === "open"
      ? [[inlineButton("✅ رسیدگی شد", admin:report_done:${report.id})]]
      : []),
    [inlineButton("⬅️ بازگشت", "admin:reports")]
  ]);

  return sendMessage(env, chatId, text, keyboard);
}


/* =========================================================
   10. درخواست فیلم توسط کاربران
   ========================================================= */

async function getAllMovieRequests(env, status = "all") {
  const requests = await dbGetList(env, KEY.movieRequests);
  const list = Array.isArray(requests) ? requests : [];

  if (status === "all") return list;
  return list.filter(request => request.status === status);
}

async function saveMovieRequest(env, request) {
  const requests = await getAllMovieRequests(env, "all");
  const index = requests.findIndex(item => item.id === request.id);

  if (index === -1) {
    requests.push(request);
  } else {
    requests[index] = request;
  }

  await dbPut(env, KEY.movieRequests, requests);
  return request;
}

async function createMovieRequest(env, userId, title, details = "") {
  const cleanTitle = normalizeText(String(title || "")).slice(0, 150);
  const cleanDetails = normalizeText(String(details || "")).slice(0, 500);

  if (!cleanTitle) {
    return { ok: false, reason: "empty_title" };
  }

  const request = {
    id: makeId("request"),
    userId: Number(userId),
    title: cleanTitle,
    details: cleanDetails,
    status: "open",
    createdAt: now(),
    resolvedAt: null,
    resolvedBy: null
  };

  await saveMovieRequest(env, request);

  await logEvent(env, "movie_request_created", {
    requestId: request.id,
    userId: Number(userId)
  });

  const keyboard = inlineKeyboard([
    [
      inlineButton(
        "✅ انجام شد",
        admin:request_done:${request.id}
      )
    ]
  ]);

  await notifyAdmins(
    env,
    "🎞 درخواست فیلم جدید\n\n" +
      شناسه: ${request.id}\n +
      کاربر: ${request.userId}\n +
      عنوان: ${request.title}\n +
      توضیحات: ${request.details || "ندارد"},
    keyboard
  );

  return { ok: true, request };
}

async function resolveMovieRequest(env, requestId, adminId) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const requests = await getAllMovieRequests(env, "all");
  const request = requests.find(item => item.id === requestId);

  if (!request) {
    return { ok: false, reason: "not_found" };
  }

  if (request.status !== "open") {
    return { ok: false, reason: "already_resolved" };
  }

  request.status = "resolved";
  request.resolvedAt = now();
  request.resolvedBy = Number(adminId);

  await saveMovieRequest(env, request);

  await logEvent(env, "movie_request_resolved", {
    requestId,
    adminId: Number(adminId)
  });

  return { ok: true, request };
}

async function showMovieRequests(env, chatId, adminId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  // اصلاح مهم: env باید به تابع داده شود.
  const requests = await getAllMovieRequests(env, "open");

  if (!requests.length) {
    return sendMessage(env, chatId, "📭 درخواست فیلم بازی وجود ندارد.");
  }

  const rows = requests.slice(0, 20).map(request => [
    inlineButton(
      🎞 ${request.title.slice(0, 30)},
      admin:request_details:${request.id}
    )
  ]);

  return sendMessage(
    env,
    chatId,
    🎞 درخواست‌های باز فیلم\n\nتعداد: ${requests.length},
    inlineKeyboard(rows)
  );
}

async function showMovieRequestDetails(
  env,
  chatId,
  adminId,
  requestId
) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  const requests = await getAllMovieRequests(env, "all");
  const request = requests.find(item => item.id === requestId);

  if (!request) {
    return sendMessage(env, chatId, "❌ درخواست پیدا نشد.");
  }

  const text =
    "🎞 جزئیات درخواست فیلم\n\n" +
    شناسه: ${request.id}\n +
    عنوان: ${request.title}\n +
    کاربر: ${request.userId}\n +
    توضیحات: ${request.details || "ندارد"}\n +
    وضعیت: ${request.status}\n +
    زمان ثبت: ${new Date(request.createdAt).toISOString()};

  const keyboard = inlineKeyboard([
    ...(request.status === "open"
      ? [[inlineButton("✅ انجام شد", admin:request_done:${request.id})]]
      : []),
    [inlineButton("⬅️ بازگشت", "admin:requests")]
  ]);

  return sendMessage(env, chatId, text, keyboard);
}


/* =========================================================
   پایان بخش سوم
   ========================================================= */
/* =========================================================
   SUPER MAN BOT — PART 4
   پنل مدیریت، پردازش دکمه‌ها و مدیریت پیام‌های مدیران
   این قسمت را بعد از بخش سوم قرار بده.
   ========================================================= */


/* =========================================================
   1. ابزارهای پنل مدیریت
   ========================================================= */

function getAdminKeyboard() {
  return inlineKeyboard([
    [
      inlineButton("📥 فیلم‌های در انتظار", "admin:pending"),
    ],
    [
      inlineButton("🚩 گزارش کاربران", "admin:reports"),
      inlineButton("🎞 درخواست فیلم‌ها", "admin:requests")
    ],
    [
      inlineButton("📊 آمار ربات", "admin:stats"),
      inlineButton("📜 رویدادهای اخیر", "admin:logs")
    ],
    [
      inlineButton("📢 ارسال پیام همگانی", "admin:broadcast"),
    ],
    [
      inlineButton("🔄 تازه‌سازی پنل", "admin:home")
    ]
  ]);
}

async function showAdminPanel(env, chatId, adminId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ شما اجازه دسترسی به پنل مدیریت را ندارید.");
  }

  const pending = (await getPendingMovies(env))
    .filter(movie => movie.status === "pending");

  const reports = await getAllReports(env, "open");
  const requests = await getAllMovieRequests(env, "open");

  const text =
    "🛡️ پنل مدیریت SUPER MAN\n\n" +
    📥 فیلم‌های منتظر بررسی: ${pending.length}\n +
    🚩 گزارش‌های باز: ${reports.length}\n +
    🎞 درخواست‌های باز: ${requests.length}\n\n +
    "یکی از بخش‌های زیر را انتخاب کن.";

  return sendMessage(
    env,
    chatId,
    text,
    getAdminKeyboard()
  );
}


/* =========================================================
   2. بررسی دسترسی مدیر
   ========================================================= */

async function requireAdmin(env, chatId, userId) {
  if (!isAdmin(env, userId)) {
    await sendMessage(
      env,
      chatId,
      "⛔ این بخش فقط برای مدیران ربات قابل دسترسی است."
    );

    return false;
  }

  return true;
}


/* =========================================================
   3. نمایش آمار کلی ربات
   توجه: نام کلیدها باید با بخش اول هماهنگ باشد.
   ========================================================= */

async function showAdminStats(env, chatId, adminId) {
  if (!(await requireAdmin(env, chatId, adminId))) return;

  const users = await dbGetList(env, KEY.users);
  const movies = await dbGetList(env, KEY.movies);
  const pending = await getPendingMovies(env);
  const reports = await getAllReports(env, "open");
  const requests = await getAllMovieRequests(env, "open");

  const userList = Array.isArray(users) ? users : [];
  const movieList = Array.isArray(movies) ? movies : [];

  const approvedMovies = movieList.filter(
    movie => movie.status === "approved"
  );

  const totalViews = approvedMovies.reduce(
    (sum, movie) => sum + safeNumber(movie.views),
    0
  );

  const text =
    "📊 آمار ربات SUPER MAN\n\n" +
    👥 کاربران ثبت‌شده: ${userList.length}\n +
    🎬 فیلم‌های تأییدشده: ${approvedMovies.length}\n +
    📥 فیلم‌های منتظر بررسی: ${pending.filter(m => m.status === "pending").length}\n +
    👁 مجموع بازدیدها: ${totalViews}\n +
    🚩 گزارش‌های باز: ${reports.length}\n +
    🎞 درخواست‌های باز: ${requests.length};

  return sendMessage(
    env,
    chatId,
    text,
    inlineKeyboard([
      [inlineButton("🔄 تازه‌سازی", "admin:stats")],
      [inlineButton("⬅️ بازگشت", "admin:home")]
    ])
  );
}


/* =========================================================
   4. نمایش گزارش‌های اخیر ثبت‌شده در لاگ
   ========================================================= */

async function showAdminLogs(env, chatId, adminId) {
  if (!(await requireAdmin(env, chatId, adminId))) return;

  const events = await dbGetList(env, KEY.logs);
  const logs = Array.isArray(events) ? events.slice(-15).reverse() : [];
  if (!logs.length) {
    return sendMessage(
      env,
      chatId,
      "📭 هنوز رویدادی برای نمایش ثبت نشده است.",
      inlineKeyboard([
        [inlineButton("⬅️ بازگشت", "admin:home")]
      ])
    );
  }

  const lines = logs.map((event, index) => {
    const eventName = event.type  event.event  "event";
    const eventTime = event.timestamp  event.createdAt  "";
    const actor = event.userId  event.adminId  "-";

    return (
      ${index + 1}. ${eventName}\n +
         شناسه: ${actor}\n +
         زمان: ${eventTime || "نامشخص"}
    );
  });

  return sendMessage(
    env,
    chatId,
    "📜 آخرین رویدادهای ربات\n\n" + lines.join("\n\n"),
    inlineKeyboard([
      [inlineButton("🔄 تازه‌سازی", "admin:logs")],
      [inlineButton("⬅️ بازگشت", "admin:home")]
    ])
  );
}


/* =========================================================
   5. مدیریت دکمه‌های گزارش و درخواست
   ========================================================= */

async function handleAdminCallback(env, query, action, value) {
  const adminId = query.from.id;
  const chatId = query.message?.chat?.id || adminId;

  if (!isAdmin(env, adminId)) {
    await answerCallback(
      env,
      query.id,
      "⛔ دسترسی غیرمجاز است.",
      true
    );

    return;
  }

  if (action === "home") {
    await answerCallback(env, query.id);
    return showAdminPanel(env, chatId, adminId);
  }

  if (action === "pending") {
    await answerCallback(env, query.id);
    return showPendingQueue(env, chatId, adminId);
  }

  if (action === "pending_details") {
    await answerCallback(env, query.id);
    return showPendingDetails(env, chatId, adminId, value);
  }

  if (action === "approve") {
    const result = await approvePendingMovie(env, value, adminId);

    await answerCallback(
      env,
      query.id,
      result.ok ? "✅ فیلم تأیید شد." : "❌ عملیات انجام نشد.",
      !result.ok
    );

    if (result.ok) {
      await sendMessage(env, chatId, "✅ فیلم با موفقیت تأیید شد.");
    }

    return;
  }

  if (action === "reject") {
    await answerCallback(env, query.id);
    return startRejectFlow(env, adminId, value);
  }

  if (action === "reports") {
    await answerCallback(env, query.id);
    return showReports(env, chatId, adminId);
  }

  if (action === "report_details") {
    await answerCallback(env, query.id);
    return showReportDetails(env, chatId, adminId, value);
  }

  if (action === "report_done") {
    const result = await resolveReport(env, value, adminId);

    await answerCallback(
      env,
      query.id,
      result.ok ? "✅ گزارش رسیدگی شد." : "❌ گزارش پیدا نشد یا قبلاً بررسی شده است.",
      !result.ok
    );

    if (result.ok) {
      await sendMessage(env, chatId, "✅ گزارش به‌عنوان رسیدگی‌شده ثبت شد.");
    }

    return;
  }

  if (action === "requests") {
    await answerCallback(env, query.id);
    return showMovieRequests(env, chatId, adminId);
  }

  if (action === "request_details") {
    await answerCallback(env, query.id);
    return showMovieRequestDetails(env, chatId, adminId, value);
  }

  if (action === "request_done") {
    const result = await resolveMovieRequest(env, value, adminId);

    await answerCallback(
      env,
      query.id,
      result.ok ? "✅ درخواست انجام‌شده ثبت شد." : "❌ درخواست پیدا نشد یا قبلاً بسته شده است.",
      !result.ok
    );

    if (result.ok) {
      await sendMessage(env, chatId, "✅ درخواست فیلم بسته شد.");
    }

    return;
  }

  if (action === "stats") {
    await answerCallback(env, query.id);
    return showAdminStats(env, chatId, adminId);
  }

  if (action === "logs") {
    await answerCallback(env, query.id);
    return showAdminLogs(env, chatId, adminId);
  }

  if (action === "broadcast") {
    await answerCallback(env, query.id);

    await setAdminState(env, adminId, {
      action: "broadcast",
      createdAt: now()
    });

    return sendMessage(
      env,
      chatId,
      "📢 پیام موردنظر برای ارسال همگانی را در یک پیام بفرست.\n\nبرای لغو، /cancel را ارسال کن."
    );
  }
  await answerCallback(
    env,
    query.id,
    "این گزینه شناخته‌شده نیست.",
    true
  );
}


/* =========================================================
   6. مسیریابی callback_query های مدیریتی
   ========================================================= */

async function routeAdminCallback(env, query) {
  const data = String(query.data || "");

  if (!data.startsWith("admin:")) {
    return false;
  }

  const parts = data.split(":");
  const action = parts[1] || "";
  const value = parts.slice(2).join(":");

  await handleAdminCallback(env, query, action, value);
  return true;
}


/* =========================================================
   7. خواندن وضعیت مدیر
   این کلید با setAdminState در بخش اول هماهنگ است.
   اگر آن تابع از کلید دیگری استفاده می‌کند، این قسمت
   باید با همان کلید هماهنگ شود.
   ========================================================= */

function getAdminStateKey(adminId) {
  return admin_state:${adminId};
}

async function getCurrentAdminState(env, adminId) {
  return await dbGet(env, getAdminStateKey(adminId));
}

async function clearCurrentAdminState(env, adminId) {
  if (env.SUPER_MAN_KV) {
    await env.SUPER_MAN_KV.delete(getAdminStateKey(adminId));
  }
}


/* =========================================================
   8. پردازش پیام‌های متنی مدیر
   شامل دلیل رد فیلم و پیام همگانی
   ========================================================= */

async function handleAdminTextMessage(env, message) {
  if (!message  !message.from  !message.chat) {
    return false;
  }

  const adminId = message.from.id;

  if (!isAdmin(env, adminId)) {
    return false;
  }

  const text = String(message.text || "").trim();

  if (text === "/cancel") {
    await clearCurrentAdminState(env, adminId);

    await sendMessage(
      env,
      message.chat.id,
      "لغو شد.",
      getAdminKeyboard()
    );

    return true;
  }

  const state = await getCurrentAdminState(env, adminId);

  if (!state || !state.action) {
    return false;
  }

  if (state.action === "reject_movie") {
    const reason =
      text === "بدون دلیل"
        ? ""
        : text.slice(0, 500);

    const result = await rejectPendingMovie(
      env,
      state.pendingId,
      adminId,
      reason
    );

    await clearCurrentAdminState(env, adminId);

    await sendMessage(
      env,
      message.chat.id,
      result.ok
        ? "❌ فیلم رد شد و نتیجه برای کاربر ارسال شد."
        : "⚠️ رد فیلم انجام نشد؛ ممکن است قبلاً بررسی شده باشد.",
      getAdminKeyboard()
    );

    return true;
  }

  if (state.action === "broadcast") {
    if (!text) {
      await sendMessage(
        env,
        message.chat.id,
        "لطفاً متن پیام همگانی را ارسال کن."
      );

      return true;
    }

    await clearCurrentAdminState(env, adminId);

    const users = await dbGetList(env, KEY.users);
    const userList = Array.isArray(users) ? users : [];

    let success = 0;
    let failed = 0;

    for (const user of userList) {
      if (!user  !user.id  user.banned) {
        continue;
      }

      try {
        await sendMessage(env, user.id, text);
        success++;
      } catch (error) {
        failed++;

        await logEvent(env, "broadcast_send_failed", {
          adminId,
          userId: user.id,
          error: String(error)
        });
      }
    }

    await logEvent(env, "broadcast_completed", {
      adminId,
      success,
      failed
    });

    await sendMessage(
      env,
      message.chat.id,
      "📢 ارسال همگانی تمام شد.\n\n" +
      ✅ ارسال موفق: ${success}\n +
      ❌ ارسال ناموفق: ${failed},
      getAdminKeyboard()
    );

    return true;
  }

  return false;
}


/* =========================================================
   9. فرمان ورود به پنل مدیریت
   ========================================================= */

async function handleAdminCommand(env, message) {
  if (!message  !message.from  !message.chat) {
    return false;
  }

  const text = String(message.text || "").trim();

  if (text !== "/admin") {
    return false;
  }
  const adminId = message.from.id;

  if (!isAdmin(env, adminId)) {
    await sendMessage(
      env,
      message.chat.id,
      "⛔ شما اجازه دسترسی به پنل مدیریت را ندارید."
    );

    return true;
  }

  await showAdminPanel(env, message.chat.id, adminId);
  return true;
}


/* =========================================================
   10. اتصال این بخش به پردازشگر اصلی
   این توابع را در بخش اصلی دریافت آپدیت صدا بزن.
   ========================================================= */

async function handlePart4Update(env, update) {
  if (update.callback_query) {
    const handled = await routeAdminCallback(
      env,
      update.callback_query
    );

    if (handled) return true;
  }

  if (update.message) {
    const handledCommand = await handleAdminCommand(
      env,
      update.message
    );

    if (handledCommand) return true;

    const handledText = await handleAdminTextMessage(
      env,
      update.message
    );

    if (handledText) return true;
  }

  return false;
}


/* ===================== پایان بخش چهارم ===================== */

/* =========================================================
   SUPER MAN BOT — PART 5
   مدیریت کاربران، پشتیبان‌گیری و پردازش نهایی آپدیت‌ها
   ========================================================= */


/* =========================================================
   1. مدیریت فهرست کاربران مسدودشده
   ========================================================= */

async function getBannedUsers(env) {
  const users = await dbGetList(env, KEY.bannedUsers);
  return Array.isArray(users) ? users : [];
}

async function saveBannedUsers(env, users) {
  return dbPut(env, KEY.bannedUsers, users);
}

async function banUser(env, adminId, targetUserId, reason = "") {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const id = Number(targetUserId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, reason: "invalid_user_id" };
  }

  if (isAdmin(env, id)) {
    return { ok: false, reason: "cannot_ban_admin" };
  }

  const banned = await getBannedUsers(env);

  if (banned.some(item => Number(item.userId) === id)) {
    return { ok: false, reason: "already_banned" };
  }

  banned.push({
    userId: id,
    reason: String(reason || "").slice(0, 500),
    bannedBy: Number(adminId),
    bannedAt: now()
  });

  await saveBannedUsers(env, banned);

  await logEvent(env, "user_banned", {
    adminId: Number(adminId),
    userId: id,
    reason: String(reason || "").slice(0, 500)
  });

  try {
    const user = await getUser(env, id);

    if (user) {
      await sendMessage(
        env,
        id,
        t(user.language || "en", "banned")
      );
    }
  } catch (_) {
    // مسدودسازی باید حتی در صورت ناموفق بودن پیام ادامه پیدا کند.
  }

  return { ok: true, userId: id };
}


async function unbanUser(env, adminId, targetUserId) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const id = Number(targetUserId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, reason: "invalid_user_id" };
  }

  const banned = await getBannedUsers(env);
  const updated = banned.filter(
    item => Number(item.userId) !== id
  );

  if (updated.length === banned.length) {
    return { ok: false, reason: "not_banned" };
  }

  await saveBannedUsers(env, updated);

  await logEvent(env, "user_unbanned", {
    adminId: Number(adminId),
    userId: id
  });

  try {
    await sendMessage(env, id, "✅ محدودیت حساب شما برداشته شد.");
  } catch (_) {
    // ممکن است کاربر هنوز ربات را شروع نکرده باشد.
  }

  return { ok: true, userId: id };
}


/* =========================================================
   2. بررسی وضعیت مسدودی
   ========================================================= */

async function isUserBanned(env, userId) {
  const banned = await getBannedUsers(env);

  return banned.some(
    item => Number(item.userId) === Number(userId)
  );
}
/* =========================================================
   3. نمایش فهرست کاربران مسدودشده
   ========================================================= */

async function showBannedUsers(env, chatId, adminId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  const banned = await getBannedUsers(env);

  if (!banned.length) {
    return sendMessage(
      env,
      chatId,
      "📭 هیچ کاربری مسدود نشده است."
    );
  }

  const lines = banned.slice(-30).reverse().map((item, index) => {
    return (
      ${index + 1}. شناسه: ${item.userId}\n +
      دلیل: ${item.reason || "ثبت نشده"}\n +
      زمان: ${item.bannedAt || "نامشخص"}
    );
  });

  return sendMessage(
    env,
    chatId,
    "🚫 کاربران مسدودشده\n\n" + lines.join("\n\n"),
    inlineKeyboard([
      [inlineButton("⬅️ پنل مدیریت", "admin:home")]
    ])
  );
}


/* =========================================================
   4. تهیه نسخه پشتیبان از اطلاعات ربات
   ========================================================= */

async function createBackup(env, adminId) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  const keys = [
    KEY.users,
    KEY.movies,
    KEY.pendingMovies,
    KEY.reports,
    KEY.movieRequests,
    KEY.bannedUsers,
    KEY.logs
  ];

  const backup = {
    app: "SUPER MAN",
    formatVersion: 1,
    createdAt: now(),
    createdBy: Number(adminId),
    data: {}
  };

  for (const key of keys) {
    backup.data[key] = await dbGet(env, key);
  }

  await logEvent(env, "backup_created", {
    adminId: Number(adminId),
    createdAt: backup.createdAt
  });

  return {
    ok: true,
    backup
  };
}


/* =========================================================
   5. ارسال نسخه پشتیبان به مدیر
   ========================================================= */

async function sendBackupToAdmin(env, chatId, adminId) {
  if (!isAdmin(env, adminId)) {
    return sendMessage(env, chatId, "⛔ دسترسی غیرمجاز است.");
  }

  const result = await createBackup(env, adminId);

  if (!result.ok) {
    return sendMessage(env, chatId, "❌ ساخت نسخه پشتیبان ناموفق بود.");
  }

  const json = JSON.stringify(result.backup, null, 2);

  // تلگرام برای متن پیام محدودیت طول دارد.
  // فایل پشتیبان از طریق sendDocument ارسال می‌شود.
  const blob = new Blob(
    [json],
    { type: "application/json" }
  );

  const form = new FormData();

  form.append("chat_id", String(chatId));
  form.append(
    "document",
    blob,
    super-man-backup-${Date.now()}.json
  );
  form.append(
    "caption",
    "🗄 نسخه پشتیبان SUPER MAN\nاین فایل حاوی اطلاعات ذخیره‌شده ربات است."
  );

  const response = await fetch(
    https://api.telegram.org/bot${env.BOT_TOKEN}/sendDocument,
    {
      method: "POST",
      body: form
    }
  );

  const resultJson = await response.json();

  if (!resultJson.ok) {
    await logEvent(env, "backup_send_failed", {
      adminId: Number(adminId),
      description: resultJson.description || "Unknown error"
    });

    return sendMessage(
      env,
      chatId,
      "❌ ارسال نسخه پشتیبان ناموفق بود."
    );
  }

  await logEvent(env, "backup_sent", {
    adminId: Number(adminId)
  });

  return true;
}


/* =========================================================
   6. اعتبارسنجی و بازیابی نسخه پشتیبان
   فقط مدیر مجاز است.
   ========================================================= */

async function restoreBackup(env, adminId, backup) {
  if (!isAdmin(env, adminId)) {
    return { ok: false, reason: "not_admin" };
  }

  if (
    !backup ||
    backup.app !== "SUPER MAN" ||
    backup.formatVersion !== 1 ||
    !backup.data ||
    typeof backup.data !== "object"
  ) {
    return { ok: false, reason: "invalid_backup" };
  }

  const allowedKeys = [
    KEY.users,
    KEY.movies,
    KEY.pendingMovies,
    KEY.reports,
    KEY.movieRequests,
    KEY.bannedUsers,
    KEY.logs
  ];
  // قبل از تغییر اطلاعات، ساختار داده‌ها بررسی می‌شود.
  for (const key of allowedKeys) {
    if (
      Object.prototype.hasOwnProperty.call(backup.data, key) &&
      !Array.isArray(backup.data[key]) &&
      backup.data[key] !== null
    ) {
      return {
        ok: false,
        reason: "invalid_data",
        key
      };
    }
  }

  // ابتدا نسخه فعلی تهیه می‌شود تا امکان بازگشت وجود داشته باشد.
  const previousData = {};

  for (const key of allowedKeys) {
    previousData[key] = await dbGet(env, key);
  }

  try {
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(backup.data, key)) {
        await dbPut(env, key, backup.data[key]);
      }
    }
  } catch (error) {
    // در صورت خطا تلاش می‌کنیم اطلاعات قبلی را برگردانیم.
    for (const key of allowedKeys) {
      try {
        if (previousData[key] !== null &&
            previousData[key] !== undefined) {
          await dbPut(env, key, previousData[key]);
        }
      } catch (_) {
        // خطای بازگردانی در لاگ ثبت می‌شود.
      }
    }

    await logEvent(env, "backup_restore_failed", {
      adminId: Number(adminId),
      error: String(error)
    });

    return { ok: false, reason: "restore_failed" };
  }

  await logEvent(env, "backup_restored", {
    adminId: Number(adminId),
    backupCreatedAt: backup.createdAt || null
  });

  return { ok: true };
}


/* =========================================================
   7. دریافت فایل JSON پشتیبان از تلگرام
   ========================================================= */

async function readTelegramDocument(env, fileId) {
  const fileInfo = await telegramCall(env, "getFile", {
    file_id: fileId
  });

  if (!fileInfo || !fileInfo.file_path) {
    throw new Error("Telegram file path not found");
  }

  const url =
    https://api.telegram.org/file/bot${env.BOT_TOKEN}/ +
    fileInfo.file_path;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to download backup file");
  }

  const textContent = await response.text();

  if (textContent.length > 5_000_000) {
    throw new Error("Backup file is too large");
  }

  return JSON.parse(textContent);
}


/* =========================================================
   8. فرمان‌های مدیریتی کاربران
   /ban USER_ID reason
   /unban USER_ID
   /banned
   /backup
   ========================================================= */

async function handlePart5AdminCommand(env, message) {
  if (!message?.from || !message?.chat) return false;

  const adminId = message.from.id;
  const text = String(message.text || "").trim();

  if (!text.startsWith("/")) return false;

  const [commandRaw, ...args] = text.split(/\s+/);
  const command = commandRaw.split("@")[0].toLowerCase();

  if (
    ![
      "/ban",
      "/unban",
      "/banned",
      "/backup"
    ].includes(command)
  ) {
    return false;
  }

  if (!isAdmin(env, adminId)) {
    await sendMessage(env, message.chat.id, "⛔ دسترسی غیرمجاز است.");
    return true;
  }

  if (command === "/ban") {
    const userId = Number(args[0]);
    const reason = args.slice(1).join(" ");

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      await sendMessage(
        env,
        message.chat.id,
        "فرمت درست:\n/ban USER_ID دلیل"
      );

      return true;
    }

    const result = await banUser(env, adminId, userId, reason);

    const messages = {
      not_admin: "⛔ دسترسی غیرمجاز است.",
      invalid_user_id: "شناسه کاربر معتبر نیست.",
      cannot_ban_admin: "نمی‌توان مدیر ربات را مسدود کرد.",
      already_banned: "این کاربر از قبل مسدود شده است."
    };

    await sendMessage(
      env,
      message.chat.id,
      result.ok
        ? 🚫 کاربر ${userId} مسدود شد.
        : (messages[result.reason] || "عملیات ناموفق بود.")
    );

    return true;
  }

  if (command === "/unban") {
    const userId = Number(args[0]);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      await sendMessage(
        env,
        message.chat.id,
        "فرمت درست:\n/unban USER_ID"
      );

      return true;
    }
    const result = await unbanUser(env, adminId, userId);

    await sendMessage(
      env,
      message.chat.id,
      result.ok
        ? ✅ محدودیت کاربر ${userId} برداشته شد.
        : result.reason === "not_banned"
          ? "این کاربر در فهرست مسدودشده‌ها نیست."
          : "عملیات ناموفق بود."
    );

    return true;
  }

  if (command === "/banned") {
    await showBannedUsers(env, message.chat.id, adminId);
    return true;
  }

  if (command === "/backup") {
    await sendBackupToAdmin(env, message.chat.id, adminId);
    return true;
  }

  return false;
}


/* =========================================================
   9. پردازش فایل پشتیبان ارسالی مدیر
   برای بازیابی، فایل JSON را همراه فرمان /restore بفرست.
   ========================================================= */

async function handleRestoreDocument(env, message) {
  if (!message?.from || !message?.document) return false;

  const adminId = message.from.id;

  if (!isAdmin(env, adminId)) return false;

  const caption = String(message.caption || "").trim();

  if (!caption.startsWith("/restore")) return false;

  const fileName = String(message.document.file_name || "");

  if (!fileName.toLowerCase().endsWith(".json")) {
    await sendMessage(
      env,
      message.chat.id,
      "❌ فایل باید JSON باشد."
    );

    return true;
  }

  try {
    const backup = await readTelegramDocument(
      env,
      message.document.file_id
    );

    const result = await restoreBackup(env, adminId, backup);

    await sendMessage(
      env,
      message.chat.id,
      result.ok
        ? "✅ بازیابی نسخه پشتیبان انجام شد."
        : ❌ بازیابی ناموفق بود: ${result.reason}
    );
  } catch (error) {
    await logEvent(env, "backup_file_read_failed", {
      adminId: Number(adminId),
      error: String(error)
    });

    await sendMessage(
      env,
      message.chat.id,
      "❌ فایل پشتیبان خوانده نشد یا ساختار آن معتبر نیست."
    );
  }

  return true;
}


/* =========================================================
   10. پردازشگر نهایی آپدیت
   این تابع باید از fetch اصلی Worker فراخوانی شود.
   ========================================================= */

async function handleSuperManUpdate(env, update) {
  try {
    if (update.callback_query) {
      const handled = await handlePart4Update(env, update);

      if (handled) return true;
    }

    const message = update.message;

    if (message) {
      // فرمان‌های مدیریتی
      const adminCommandHandled =
        await handlePart5AdminCommand(env, message);

      if (adminCommandHandled) return true;

      // دریافت فایل بازیابی
      const restoreHandled =
        await handleRestoreDocument(env, message);

      if (restoreHandled) return true;

      // پردازش فرمان‌ها و پیام‌های دیگر
      // باید به پردازشگر اصلی بخش‌های ۱ و ۲ متصل شود.
      if (typeof handleMainUpdate === "function") {
        return await handleMainUpdate(env, update);
      }
    }

    return true;
  } catch (error) {
    await logEvent(env, "update_handler_error", {
      updateId: update?.update_id || null,
      error: String(error)
    });

    return true;
  }
}


/* ===================== پایان بخش پنجم ===================== */
