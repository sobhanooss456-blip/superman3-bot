const MOVIE_COOLDOWN = 10_000;
const AUTO_DELETE_TIME = 20_000;
const MOVIE_PAGE_SIZE = 10;
const USER_PAGE_SIZE = 10;
const HISTORY_TTL = 24 * 60 * 60 * 1000;
const REFERRAL_REWARD = 3;

const CHANNEL_ID = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";

/* =========================================================
   Telegram API
========================================================= */

async function telegram(env, method, data = {}) {
  const token = env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN is missing");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();
  if (!result.ok) console.error("Telegram API error:", method, result);
  return result;
}

/* =========================================================
   Basic helpers / KV
========================================================= */

function now() {
  return Date.now();
}

function randomId() {
  return `${now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function getAdminId(env) {
  return String(env.ADMIN_ID || "");
}

function isMainAdmin(env, userId) {
  return String(userId) === getAdminId(env);
}

async function getJSON(env, key, fallback = null) {
  const value = await env.BOT_DATA.get(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function putJSON(env, key, value) {
  await env.BOT_DATA.put(key, JSON.stringify(value));
}

async function deleteKey(env, key) {
  await env.BOT_DATA.delete(key).catch(() => {});
}

/* =========================================================
   Language
========================================================= */

const LANGUAGE_OPTIONS = [
  { code: "fa", label: "🇮🇷 فارسی" },
  { code: "en", label: "🇬🇧 English" },
  { code: "ar", label: "🇸🇦 العربية" },
  { code: "tr", label: "🇹🇷 Türkçe" },
  { code: "ru", label: "🇷🇺 Русский" },
  { code: "es", label: "🇪🇸 Español" }
];
const LANGUAGE_CODES = new Set(LANGUAGE_OPTIONS.map(item => item.code));

const TEXT = {
  fa: {
    welcome: "🎬 به ربات فیلم خوش آمدید.",
    menuHint: "برای دیدن گزینه‌ها روی «☰ منو» بزنید.",
    menuTitle: "📋 منوی اصلی",
    menuButton: "☰ منو",
    closeMenu: "✖ بستن",
    getMovie: "🎬 فیلم",
    submitMovie: "📤 ارسال",
    requestMovie: "📝 درخواست",
    favorites: "❤️ علاقه‌مندی",
    invite: "👥 دعوت",
    changeLanguage: "🌐 زبان",
    admin: "👑 مدیریت",
    chooseLanguage: "🌐 زبان خود را انتخاب کنید / Choose your language:",
    languageSaved: "✅ زبان با موفقیت انتخاب شد.",
    joinText: "🔒 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",
    join: "📢 عضویت در کانال",
    check: "✅ بررسی عضویت",
    notMember: "❌ هنوز عضو کانال نشده‌اید.",
    movieEmpty: "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد.",
    wait: "⏳ لطفاً {n} ثانیه صبر کنید.",
    sendPrompt: "📤 فیلم خود را ارسال کنید.\n\n🛡️ فیلم قبل از انتشار توسط تیم بررسی می‌شود.",
    movieReceived: "✅ فیلم شما دریافت شد و برای بررسی ارسال شد.",
    requestPrompt: "📝 نام فیلم موردنظر را ارسال کنید.",
    requestSaved: "✅ درخواست فیلم ثبت شد.",
    requestInvalid: "❌ درخواست نامعتبر است.",
    favoritesEmpty: "❤️ هنوز فیلمی به موردعلاقه‌ها اضافه نکرده‌اید.",
    favoritesTitle: "❤️ فیلم‌های موردعلاقه",
    movieNumber: "فیلم شماره",
    addedFavorite: "❤️ به موردعلاقه‌ها اضافه شد.",
    removedFavorite: "💔 از موردعلاقه‌ها حذف شد.",
    addFavorite: "❤️ افزودن به موردعلاقه‌ها",
    removeFavorite: "💔 حذف از موردعلاقه‌ها",
    again: "🔄 ارسال دوباره",
    report: "🚫 گزارش",
    reportTitle: "🚫 دلیل گزارش را انتخاب کنید:",
    reportBroken: "خراب",
    reportWrong: "اطلاعات نادرست",
    reportDuplicate: "تکراری",
    reportOther: "سایر",
    reportSaved: "✅ گزارش شما ثبت شد.",
    rateSaved: "⭐ امتیاز شما ثبت شد.",
    alreadyRated: "⚠️ شما قبلاً برای این فیلم امتیاز ثبت کرده‌اید.",
    deleteNotice: "⏱ این فیلم بعد از ۲۰ ثانیه حذف می‌شود.",
    deleted: "🗑 فیلم حذف شد. برای دریافت دوباره روی دکمه زیر بزنید.",
    resend: "🔄 ارسال مجدد فیلم",
    inviteTitle: "👥 دعوت از دوستان",
    inviteCount: "✅ دعوت‌های موفق: {n}",
    inviteReward: "🎁 با ۳ دعوت موفق، محدودیت دریافت فیلم برداشته می‌شود.",
    inviteUnavailable: "❌ لینک اختصاصی فعلاً قابل دریافت نیست.",
    adminRequestSent: "⏳ درخواست Admin شما برای مدیر اصلی ارسال شد.",
    adminPending: "⏳ درخواست Admin شما قبلاً در حال بررسی است.",
    alreadyAdmin: "✅ شما هم‌اکنون Admin هستید.",
    adminApproved: "👑 درخواست Admin شما تأیید شد.",
    adminRejected: "❌ درخواست Admin شما رد شد.",
    denied: "⛔ دسترسی ندارید.",
    useMenu: "☰ برای مشاهده گزینه‌ها، دکمه منو را بزنید.",
    blocked: "🚫 دسترسی شما به ربات مسدود شده است.",
    menuClosed: "✅ منو بسته شد.",
    alreadyVoted: "⚠️ قبلاً رأی داده‌اید.",
    pendingApproved: "✅ فیلم شما تأیید شد و به آرشیو اضافه شد.",
    pendingRejected: "❌ فیلم شما توسط مدیر رد شد.",
    noMovieRequests: "📭 درخواستی ثبت نشده است.",
    movieRequestsTitle: "📝 درخواست‌های فیلم",
    adminPanelStats: "👑 پنل مدیریت\n\n👥 کاربران: {users}\n🎬 فیلم‌ها: {movies}\n👁 بازدید یکتا: {views}\n⭐ امتیازها: {ratings}\n❤️ موردعلاقه‌ها: {favorites}\n🔥 فعال ۲۴ساعته: {active}\n📥 در انتظار تأیید: {pending}\n👥 دعوت موفق: {invites}",
    adminMoviesButton: "🎬 لیست فیلم‌ها",
    adminPendingButton: "📥 صف فیلم‌ها",
    adminUsersButton: "👥 لیست کاربران",
    adminStatsButton: "📊 آمار",
    adminRequestsButton: "🔐 درخواست‌های Admin",
    adminBackupButton: "💾 Backup",
    adminHealthButton: "🏥 Health",
    adminMovieRequestsButton: "📝 درخواست‌های فیلم",
    backButton: "🔙 بازگشت",
    announcementButton: "📢 ارسال اطلاعیه",
    announcementPrompt: "📢 حالا متن اطلاعیه را به همان زبان انتخاب‌شده بفرستید. اطلاعیه فقط برای کاربرانی ارسال می‌شود که همین زبان را انتخاب کرده‌اند.\nبرای لغو، /cancel را بفرستید.",
    announcementLanguagePrompt: "🌐 زبان مقصد اطلاعیه را انتخاب کنید:",
    announcementTooLong: "❌ متن خیلی طولانی است. لطفاً متن را به ۳۵۰۰ نویسه یا کمتر محدود کنید.",
    announcementTextRequired: "لطفاً متن اطلاعیه را به‌صورت پیام متنی بفرستید؛ برای لغو /cancel را ارسال کنید.",
    announcementCancelled: "✅ ارسال اطلاعیه لغو شد.",
    announcementWorking: "⏳ اطلاعیه در حال ارسال به کاربران زبان انتخاب‌شده است…",
    announcementResult: "✅ ارسال اطلاعیه تمام شد.\n\n🌐 زبان: {language}\n📨 موفق: {success}\n❌ ناموفق: {failed}\n⏭ ردشده (مسدود/غیرفعال یا زبان دیگر): {skipped}"
  },
  en: {
    welcome: "🎬 Welcome to the movie bot.",
    menuHint: "Tap «☰ Menu» to see the options.",
    menuTitle: "📋 Main Menu",
    menuButton: "☰ Menu",
    closeMenu: "✖ Hide",
    getMovie: "🎬 Movie",
    submitMovie: "📤 Send",
    requestMovie: "📝 Request",
    favorites: "❤️ Saved",
    invite: "👥 Invite",
    changeLanguage: "🌐 Language",
    admin: "👑 Admin",
    chooseLanguage: "🌐 Choose your language / زبان خود را انتخاب کنید:",
    languageSaved: "✅ Language saved.",
    joinText: "🔒 Please join our channel first to use the bot.",
    join: "📢 Join Channel",
    check: "✅ Check Membership",
    notMember: "❌ You are not a channel member yet.",
    movieEmpty: "📭 No movies are available right now.",
    wait: "⏳ Please wait {n} seconds.",
    sendPrompt: "📤 Send your movie here.\n\n🛡️ It will be reviewed before publication.",
    movieReceived: "✅ Your movie was received and sent for review.",
    requestPrompt: "📝 Send the movie name you want.",
    requestSaved: "✅ Movie request saved.",
    requestInvalid: "❌ Invalid request.",
    favoritesEmpty: "❤️ Your favorites list is empty.",
    favoritesTitle: "❤️ Favorite Movies",
    movieNumber: "Movie #",
    addedFavorite: "❤️ Added to favorites.",
    removedFavorite: "💔 Removed from favorites.",
    addFavorite: "❤️ Add to Favorites",
    removeFavorite: "💔 Remove from Favorites",
    again: "🔄 Send Again",
    report: "🚫 Report",
    reportTitle: "🚫 Choose a report reason:",
    reportBroken: "Broken",
    reportWrong: "Wrong information",
    reportDuplicate: "Duplicate",
    reportOther: "Other",
    reportSaved: "✅ Report saved.",
         rateSaved: "⭐ Your rating was saved.",
    alreadyRated: "⚠️ You already rated this movie.",
    deleteNotice: "⏱ This movie will be deleted after 20 seconds.",
    deleted: "🗑 Movie deleted. Tap below to receive it again.",
    resend: "🔄 Send Movie Again",
    inviteTitle: "👥 Invite Friends",
    inviteCount: "✅ Successful invites: {n}",
    inviteReward: "🎁 3 successful invites remove the movie cooldown.",
    inviteUnavailable: "❌ Your personal invite link is unavailable right now.",
    adminRequestSent: "⏳ Your Admin request was sent to the main manager.",
    adminPending: "⏳ Your Admin request is already pending.",
    alreadyAdmin: "✅ You are already an Admin.",
    adminApproved: "👑 Your Admin request was approved.",
    adminRejected: "❌ Your Admin request was rejected.",
    denied: "⛔ Access denied.",
    useMenu: "☰ Tap the menu button to see the options.",
    blocked: "🚫 Your access to the bot is blocked.",
    menuClosed: "✅ Menu closed.",
    alreadyVoted: "⚠️ You have already voted.",
    pendingApproved: "✅ Your movie was approved and added to the archive.",
    pendingRejected: "❌ Your movie was rejected by the moderator.",
    noMovieRequests: "📭 No movie requests have been submitted.",
    movieRequestsTitle: "📝 Movie Requests",
    adminPanelStats: "👑 Admin Panel\n\n👥 Users: {users}\n🎬 Movies: {movies}\n👁 Unique views: {views}\n⭐ Ratings: {ratings}\n❤️ Favorites: {favorites}\n🔥 Active 24h: {active}\n📥 Pending: {pending}\n👥 Successful invites: {invites}",
    adminMoviesButton: "🎬 Movies",
    adminPendingButton: "📥 Pending queue",
    adminUsersButton: "👥 Users",
    adminStatsButton: "📊 Stats",
    adminRequestsButton: "🔐 Admin Requests",
    adminBackupButton: "💾 Backup",
    adminHealthButton: "🏥 Health",
    adminMovieRequestsButton: "📝 Movie Requests",
    backButton: "🔙 Back",
    announcementButton: "📢 Send Announcement",
    announcementPrompt: "📢 Now send the announcement text in the selected language. It will only be sent to users who selected that same language.\nSend /cancel to cancel.",
    announcementLanguagePrompt: "🌐 Choose the announcement target language:",
    announcementTooLong: "❌ The text is too long. Please keep it to 3,500 characters or fewer.",
    announcementTextRequired: "Please send the announcement as text. Send /cancel to cancel.",
    announcementCancelled: "✅ Announcement cancelled.",
    announcementWorking: "⏳ Sending the announcement to users of the selected language…",
    announcementResult: "✅ Announcement delivery finished.\n\n🌐 Language: {language}\n📨 Sent: {success}\n❌ Failed: {failed}\n⏭ Skipped (blocked/disabled or another language): {skipped}"
  }
 };

// Static, manually maintained dictionaries. No translation API or external translator is used.
// The common user flow and menu are localized; rare admin-only labels fall back to English.
Object.assign(TEXT, {
  ar: {
    ...TEXT.en,
    welcome: "🎬 أهلاً بك في بوت الأفلام.", menuHint: "اضغط «☰ القائمة» لعرض الخيارات.", menuTitle: "📋 القائمة الرئيسية",
    menuButton: "☰ القائمة", closeMenu: "✖ إخفاء", getMovie: "🎬 فيلم", submitMovie: "📤 إرسال", requestMovie: "📝 طلب",
    favorites: "❤️ المفضلة", invite: "👥 دعوة", changeLanguage: "🌐 اللغة", admin: "👑 الإدارة",
    chooseLanguage: "🌐 اختر لغتك / Choose your language:", languageSaved: "✅ تم حفظ اللغة.",
    joinText: "🔒 يرجى الانضمام إلى قناتنا أولاً لاستخدام البوت.", join: "📢 انضم إلى القناة", check: "✅ تحقق من العضوية",
    notMember: "❌ لم تنضم إلى القناة بعد.", movieEmpty: "📭 لا توجد أفلام حالياً.", wait: "⏳ يرجى الانتظار {n} ثانية.",
    sendPrompt: "📤 أرسل الفيلم هنا.\n\n🛡️ ستتم مراجعته قبل النشر.", movieReceived: "✅ تم استلام الفيلم وإرساله للمراجعة.",
    requestPrompt: "📝 أرسل اسم الفيلم الذي تريده.", requestSaved: "✅ تم حفظ طلب الفيلم.", requestInvalid: "❌ الطلب غير صالح.",
    favoritesEmpty: "❤️ قائمة المفضلة فارغة.", favoritesTitle: "❤️ الأفلام المفضلة", movieNumber: "الفيلم رقم",
    addedFavorite: "❤️ تمت الإضافة إلى المفضلة.", removedFavorite: "💔 تمت الإزالة من المفضلة.",
    addFavorite: "❤️ أضف إلى المفضلة", removeFavorite: "💔 احذف من المفضلة", again: "🔄 إرسال مرة أخرى",
    report: "🚫 إبلاغ", reportTitle: "🚫 اختر سبب الإبلاغ:", reportBroken: "معطّل", reportWrong: "معلومات خاطئة",
    reportDuplicate: "مكرر", reportOther: "أخرى", reportSaved: "✅ تم حفظ البلاغ.", rateSaved: "⭐ تم حفظ تقييمك.",
    alreadyRated: "⚠️ لقد قيّمت هذا الفيلم من قبل.", deleteNotice: "⏱ سيتم حذف هذا الفيلم بعد 20 ثانية.",
    deleted: "🗑 تم حذف الفيلم. اضغط أدناه لاستلامه مجدداً.", resend: "🔄 إعادة إرسال الفيلم", inviteTitle: "👥 دعوة الأصدقاء",
    inviteCount: "✅ الدعوات الناجحة: {n}", inviteReward: "🎁 بعد 3 دعوات ناجحة، يُزال حد انتظار الأفلام.",
    inviteUnavailable: "❌ رابط الدعوة الشخصي غير متاح حالياً.", denied: "⛔ ليس لديك صلاحية.",
    useMenu: "☰ اضغط زر القائمة لعرض الخيارات.", blocked: "🚫 تم حظر وصولك إلى البوت.", menuClosed: "✅ تم إخفاء القائمة.",
    alreadyVoted: "⚠️ لقد صوّت من قبل.", pendingApproved: "✅ تمت الموافقة على فيلمك وإضافته إلى الأرشيف.",
    pendingRejected: "❌ رفض المشرف فيلمك.", noMovieRequests: "📭 لا توجد طلبات أفلام.", movieRequestsTitle: "📝 طلبات الأفلام",
    adminPanelStats: "👑 لوحة الإدارة\n\n👥 المستخدمون: {users}\n🎬 الأفلام: {movies}\n👁 المشاهدات الفريدة: {views}\n⭐ التقييمات: {ratings}\n❤️ المفضلة: {favorites}\n🔥 النشطون خلال 24 ساعة: {active}\n📥 بانتظار المراجعة: {pending}\n👥 الدعوات الناجحة: {invites}",
    announcementButton: "📢 إرسال إعلان", announcementPrompt: "📢 أرسل نص الإعلان باللغة المحددة. سيُرسل فقط للمستخدمين الذين اختاروا اللغة نفسها.\nللإلغاء أرسل /cancel.",
    announcementLanguagePrompt: "🌐 اختر لغة الإعلان:", announcementTooLong: "❌ النص طويل جداً. اجعله 3500 حرف أو أقل.",
    announcementTextRequired: "أرسل الإعلان كنص. للإلغاء أرسل /cancel.", announcementCancelled: "✅ تم إلغاء الإعلان.",
    announcementWorking: "⏳ جارٍ إرسال الإعلان لمستخدمي اللغة المحددة…",
    announcementResult: "✅ انتهى إرسال الإعلان.\n\n🌐 اللغة: {language}\n📨 تم الإرسال: {success}\n❌ فشل: {failed}\n⏭ تم التخطي: {skipped}"
  },
  tr: {
    ...TEXT.en,
    welcome: "🎬 Film botuna hoş geldin.", menuHint: "Seçenekleri görmek için «☰ Menü» düğmesine bas.", menuTitle: "📋 Ana Menü",
    menuButton: "☰ Menü", closeMenu: "✖ Gizle", getMovie: "🎬 Film", submitMovie: "📤 Gönder", requestMovie: "📝 İstek",
    favorites: "❤️ Favori", invite: "👥 Davet", changeLanguage: "🌐 Dil", admin: "👑 Yönetim",
    chooseLanguage: "🌐 Dilini seç / Choose your language:", languageSaved: "✅ Dil kaydedildi.",
    joinText: "🔒 Botu kullanmak için önce kanalımıza katılmalısın.", join: "📢 Kanala katıl", check: "✅ Üyeliği kontrol et",
    notMember: "❌ Henüz kanala katılmadın.", movieEmpty: "📭 Şu anda film yok.", wait: "⏳ Lütfen {n} saniye bekle.",
    sendPrompt: "📤 Filmini buraya gönder.\n\n🛡️ Yayınlanmadan önce incelenecek.", movieReceived: "✅ Filmin alındı ve incelemeye gönderildi.",
    requestPrompt: "📝 İstediğin filmin adını gönder.", requestSaved: "✅ Film isteği kaydedildi.", requestInvalid: "❌ Geçersiz istek.",
    favoritesEmpty: "❤️ Favori listen boş.", favoritesTitle: "❤️ Favori Filmler", movieNumber: "Film #",
    addedFavorite: "❤️ Favorilere eklendi.", removedFavorite: "💔 Favorilerden kaldırıldı.", addFavorite: "❤️ Favorilere ekle", removeFavorite: "💔 Favorilerden kaldır",
    again: "🔄 Tekrar gönder", report: "🚫 Bildir", reportTitle: "🚫 Bildirim nedenini seç:", reportBroken: "Çalışmıyor", reportWrong: "Yanlış bilgi",
    reportDuplicate: "Tekrar", reportOther: "Diğer", reportSaved: "✅ Bildirim kaydedildi.", rateSaved: "⭐ Puanın kaydedildi.",
    alreadyRated: "⚠️ Bu filme zaten puan verdin.", deleteNotice: "⏱ Bu film 20 saniye sonra silinecek.", deleted: "🗑 Film silindi. Yeniden almak için aşağıya bas.",
    resend: "🔄 Filmi tekrar gönder", inviteTitle: "👥 Arkadaşlarını Davet Et", inviteCount: "✅ Başarılı davetler: {n}",
    inviteReward: "🎁 3 başarılı davetten sonra film bekleme sınırı kaldırılır.", inviteUnavailable: "❌ Kişisel davet bağlantın şu anda kullanılamıyor.",
    denied: "⛔ Erişim iznin yok.", useMenu: "☰ Seçenekleri görmek için menü düğmesine bas.", blocked: "🚫 Bot erişimin engellendi.",
    menuClosed: "✅ Menü gizlendi.", alreadyVoted: "⚠️ Zaten oy kullandın.", pendingApproved: "✅ Filmin onaylandı ve arşive eklendi.",
    pendingRejected: "❌ Filmin moderatör tarafından reddedildi.", noMovieRequests: "📭 Film isteği yok.", movieRequestsTitle: "📝 Film İstekleri",
         adminPanelStats: "👑 Yönetim Paneli\n\n👥 Kullanıcılar: {users}\n🎬 Filmler: {movies}\n👁 Tekil görüntüleme: {views}\n⭐ Puanlar: {ratings}\n❤️ Favoriler: {favorites}\n🔥 Son 24 saatte aktif: {active}\n📥 Bekleyen: {pending}\n👥 Başarılı davetler: {invites}",
    announcementButton: "📢 Duyuru Gönder", announcementPrompt: "📢 Duyuru metnini seçilen dilde gönder. Yalnızca aynı dili seçen kullanıcılara gönderilir.\nİptal için /cancel gönder.",
    announcementLanguagePrompt: "🌐 Duyuru dilini seç:", announcementTooLong: "❌ Metin çok uzun. Lütfen 3500 karakter veya daha kısa tut.",
    announcementTextRequired: "Duyuruyu metin olarak gönder. İptal için /cancel gönder.", announcementCancelled: "✅ Duyuru iptal edildi.",
    announcementWorking: "⏳ Duyuru seçilen dildeki kullanıcılara gönderiliyor…",
    announcementResult: "✅ Duyuru gönderimi tamamlandı.\n\n🌐 Dil: {language}\n📨 Gönderildi: {success}\n❌ Başarısız: {failed}\n⏭ Atlandı: {skipped}"
  },
  ru: {
    ...TEXT.en,
    welcome: "🎬 Добро пожаловать в кинобот.", menuHint: "Нажмите «☰ Меню», чтобы увидеть варианты.", menuTitle: "📋 Главное меню",
    menuButton: "☰ Меню", closeMenu: "✖ Скрыть", getMovie: "🎬 Фильм", submitMovie: "📤 Отправить", requestMovie: "📝 Запрос",
    favorites: "❤️ Избранное", invite: "👥 Пригласить", changeLanguage: "🌐 Язык", admin: "👑 Админ",
    chooseLanguage: "🌐 Выберите язык / Choose your language:", languageSaved: "✅ Язык сохранён.",
    joinText: "🔒 Сначала подпишитесь на наш канал, чтобы пользоваться ботом.", join: "📢 Подписаться", check: "✅ Проверить подписку",
    notMember: "❌ Вы ещё не подписаны на канал.", movieEmpty: "📭 Сейчас фильмов нет.", wait: "⏳ Подождите {n} секунд.",
    sendPrompt: "📤 Отправьте сюда фильм.\n\n🛡️ Перед публикацией он будет проверен.", movieReceived: "✅ Фильм получен и отправлен на проверку.",
    requestPrompt: "📝 Отправьте название нужного фильма.", requestSaved: "✅ Запрос фильма сохранён.", requestInvalid: "❌ Неверный запрос.",
    favoritesEmpty: "❤️ Список избранного пуст.", favoritesTitle: "❤️ Избранные фильмы", movieNumber: "Фильм №",
    addedFavorite: "❤️ Добавлено в избранное.", removedFavorite: "💔 Удалено из избранного.", addFavorite: "❤️ В избранное", removeFavorite: "💔 Удалить из избранного",
    again: "🔄 Отправить снова", report: "🚫 Пожаловаться", reportTitle: "🚫 Выберите причину жалобы:", reportBroken: "Не работает", reportWrong: "Неверная информация",
    reportDuplicate: "Дубликат", reportOther: "Другое", reportSaved: "✅ Жалоба сохранена.", rateSaved: "⭐ Ваша оценка сохранена.",
    alreadyRated: "⚠️ Вы уже оценивали этот фильм.", deleteNotice: "⏱ Фильм будет удалён через 20 секунд.", deleted: "🗑 Фильм удалён. Нажмите ниже, чтобы получить его снова.",
    resend: "🔄 Отправить фильм снова", inviteTitle: "👥 Пригласить друзей", inviteCount: "✅ Успешные приглашения: {n}",
    inviteReward: "🎁 После 3 успешных приглашений ограничение ожидания снимается.", inviteUnavailable: "❌ Личная ссылка приглашения сейчас недоступна.",
    denied: "⛔ Нет доступа.", useMenu: "☰ Нажмите кнопку меню, чтобы увидеть варианты.", blocked: "🚫 Ваш доступ к боту заблокирован.",
    menuClosed: "✅ Меню скрыто.", alreadyVoted: "⚠️ Вы уже голосовали.", pendingApproved: "✅ Ваш фильм одобрен и добавлен в архив.",
    pendingRejected: "❌ Модератор отклонил ваш фильм.", noMovieRequests: "📭 Запросов фильмов пока нет.", movieRequestsTitle: "📝 Запросы фильмов",
    adminPanelStats: "👑 Панель администратора\n\n👥 Пользователи: {users}\n🎬 Фильмы: {movies}\n👁 Уникальные просмотры: {views}\n⭐ Оценки: {ratings}\n❤️ Избранное: {favorites}\n🔥 Активны за 24 ч: {active}\n📥 Ожидают: {pending}\n👥 Успешные приглашения: {invites}",
    announcementButton: "📢 Отправить объявление", announcementPrompt: "📢 Отправьте текст объявления на выбранном языке. Оно будет отправлено только пользователям, выбравшим тот же язык.\nДля отмены отправьте /cancel.",
    announcementLanguagePrompt: "🌐 Выберите язык объявления:", announcementTooLong: "❌ Текст слишком длинный. Максимум 3500 символов.",
    announcementTextRequired: "Отправьте объявление текстом. Для отмены отправьте /cancel.", announcementCancelled: "✅ Отправка отменена.",
    announcementWorking: "⏳ Отправка объявления пользователям выбранного языка…",
    announcementResult: "✅ Рассылка завершена.\n\n🌐 Язык: {language}\n📨 Отправлено: {success}\n❌ Ошибки: {failed}\n⏭ Пропущено: {skipped}"
  },
  es: {
    ...TEXT.en,
    welcome: "🎬 Bienvenido al bot de películas.", menuHint: "Pulsa «☰ Menú» para ver las opciones.", menuTitle: "📋 Menú principal",
    menuButton: "☰ Menú", closeMenu: "✖ Ocultar", getMovie: "🎬 Película", submitMovie: "📤 Enviar", requestMovie: "📝 Pedir",
    favorites: "❤️ Favoritos", invite: "👥 Invitar", changeLanguage: "🌐 Idioma", admin: "👑 Admin",
    chooseLanguage: "🌐 Elige tu idioma / Choose your language:", languageSaved: "✅ Idioma guardado.",
    joinText: "🔒 Únete primero a nuestro canal para usar el bot.", join: "📢 Unirse al canal", check: "✅ Comprobar membresía",
    notMember: "❌ Aún no te has unido al canal.", movieEmpty: "📭 No hay películas disponibles ahora.", wait: "⏳ Espera {n} segundos.",
    sendPrompt: "📤 Envía tu película aquí.\n\n🛡️ Se revisará antes de publicarla.", movieReceived: "✅ Película recibida y enviada para revisión.",
    requestPrompt: "📝 Envía el nombre de la película que buscas.", requestSaved: "✅ Solicitud guardada.", requestInvalid: "❌ Solicitud no válida.",
    favoritesEmpty: "❤️ Tu lista de favoritos está vacía.", favoritesTitle: "❤️ Películas favoritas", movieNumber: "Película n.º",
    addedFavorite: "❤️ Añadida a favoritos.", removedFavorite: "💔 Eliminada de favoritos.", addFavorite: "❤️ Añadir a favoritos", removeFavorite: "💔 Quitar de favoritos",
    again: "🔄 Enviar de nuevo", report: "🚫 Reportar", reportTitle: "🚫 Elige el motivo del reporte:", reportBroken: "No funciona", reportWrong: "Información incorrecta",
    reportDuplicate: "Duplicada", reportOther: "Otro", reportSaved: "✅ Reporte guardado.", rateSaved: "⭐ Tu valoración se guardó.",
    alreadyRated: "⚠️ Ya has valorado esta película.", deleteNotice: "⏱ Esta película se eliminará en 20 segundos.", deleted: "🗑 Película eliminada. Pulsa abajo para recibirla otra vez.",
    resend: "🔄 Enviar película otra vez", inviteTitle: "👥 Invitar amigos", inviteCount: "✅ Invitaciones válidas: {n}",
    inviteReward: "🎁 Con 3 invitaciones válidas se elimina la espera para recibir películas.", inviteUnavailable: "❌ Tu enlace personal de invitación no está disponible.",
    denied: "⛔ No tienes permiso.", useMenu: "☰ Pulsa el botón de menú para ver las opciones.", blocked: "🚫 Tu acceso al bot está bloqueado.",
    menuClosed: "✅ Menú oculto.", alreadyVoted: "⚠️ Ya has votado.", pendingApproved: "✅ Tu película fue aprobada y añadida al archivo.",
    pendingRejected: "❌ El moderador rechazó tu película.", noMovieRequests: "📭 No hay solicitudes de películas.", movieRequestsTitle: "📝 Solicitudes de películas",
    adminPanelStats: "👑 Panel de administración\n\n👥 Usuarios: {users}\n🎬 Películas: {movies}\n👁 Vistas únicas: {views}\n⭐ Valoraciones: {ratings}\n❤️ Favoritos: {favorites}\n🔥 Activos en 24 h: {active}\n📥 Pendientes: {pending}\n👥 Invitaciones válidas: {invites}",
    announcementButton: "📢 Enviar anuncio", announcementPrompt: "📢 Envía el texto del anuncio en el idioma seleccionado. Solo se enviará a usuarios que hayan elegido ese mismo idioma.\nEnvía /cancel para cancelar.",
    announcementLanguagePrompt: "🌐 Elige el idioma del anuncio:", announcementTooLong: "❌ El texto es demasiado largo. Máximo 3500 caracteres.",
    announcementTextRequired: "Envía el anuncio como texto. Envía /cancel para cancelar.", announcementCancelled: "✅ Anuncio cancelado.",
    announcementWorking: "⏳ Enviando el anuncio a los usuarios del idioma seleccionado…",
    announcementResult: "✅ Envío del anuncio finalizado.\n\n🌐 Idioma: {language}\n📨 Enviados: {success}\n❌ Fallidos: {failed}\n⏭ Omitidos: {skipped}"
  }
});

function normalizeLanguage(language) {
  const code = String(language || "fa").toLowerCase();
  return LANGUAGE_CODES.has(code) ? code : "fa";
}

function langOf(user) {
  return normalizeLanguage(user?.language);
}

function tr(userOrLang, key) {
     const language = normalizeLanguage(typeof userOrLang === "string" ? userOrLang : langOf(userOrLang));
  return (TEXT[language] && TEXT[language][key]) || TEXT.en[key] || TEXT.fa[key] || key;
}

// Replace {placeholders} in localized messages, for example {n} or {users}.
function replaceText(template, values = {}) {
  return String(template ?? "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match;
  });
}

// Persistent reply keyboard shown at the bottom of Telegram chats.
function bottomMenu(language) {
  return {
    keyboard: [[
      { text: tr(language, "menuButton") },
      { text: tr(language, "closeMenu") }
    ]],
    resize_keyboard: true,
    is_persistent: true
  };
}

// Expanded reply keyboard. Every label is taken from the selected language dictionary.
function expandedMenu(language, isAdmin = false) {
  const rows = [
    [
      { text: tr(language, "getMovie") },
      { text: tr(language, "submitMovie") },
      { text: tr(language, "requestMovie") }
    ],
    [
      { text: tr(language, "favorites") },
      { text: tr(language, "invite") },
      { text: tr(language, "changeLanguage") }
    ]
  ];
  if (isAdmin) rows.push([{ text: tr(language, "admin") }]);
  rows.push([{ text: tr(language, "closeMenu") }]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}

// Automatic translation has been removed. Language dictionaries are maintained manually.
async function ensureLanguageDictionary(_env, _requestedLanguage) {
  return;
}

async function getUser(env, userId) {
  return await getJSON(env, `user:${userId}`, {
    id: String(userId),
    language: "fa",
    language_selected: false,
    blocked: false,
    joined: false,
    created_at: now()
  });
}

async function saveUser(env, user) {
  await putJSON(env, `user:${user.id}`, user);
}

async function ensureUser(env, from) {
  const user = await getUser(env, from.id);
  user.id = String(from.id);
  if (from.username) user.username = from.username;
  if (from.first_name) user.first_name = from.first_name;
  if (from.language_code) user.telegram_language_code = from.language_code;
  user.language = normalizeLanguage(user.language);
  await ensureLanguageDictionary(env, user.language);
  if (!Array.isArray(user.favorites)) user.favorites = [];
  if (!Array.isArray(user.history)) user.history = [];
  if (!Array.isArray(user.invited_users)) user.invited_users = [];
  if (user.movies_received === undefined) user.movies_received = 0;
  if (user.unique_views === undefined) user.unique_views = 0;
  if (user.ratings === undefined) user.ratings = 0;
  if (user.valid_invites === undefined) user.valid_invites = 0;
  if (user.notifications === undefined) user.notifications = true;
  if (!user.created_at) user.created_at = now();
  await saveUser(env, user);
  return user;
}

async function getAllUsers(env) {
  const users = [];
  let cursor;
  do {
    const result = await env.BOT_DATA.list({
      prefix: "user:",
      limit: 1000,
      ...(cursor ? { cursor } : {})
    });
    for (const key of result.keys || []) {
      const user = await getJSON(env, key.name, null);
      if (user) users.push(user);
    }
    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor);
  return users;
}

/* =========================================================
   Membership
========================================================= */

async function checkMembership(env, userId) {
  try {
    const result = await telegram(env, "getChatMember", {
      chat_id: CHANNEL_ID,
      user_id: Number(userId)
    });
    if (!result.ok) return false;
    return ["creator", "administrator", "member"].includes(result.result.status);
  } catch {
    return false;
  }
}

async function sendMembershipMessage(env, chatId, language) {
  const languageSafe = normalizeLanguage(language);
  await ensureLanguageDictionary(env, languageSafe);
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: tr(languageSafe, "joinText"),
    reply_markup: {
      inline_keyboard: [
        [{ text: tr(languageSafe, "join"), url: CHANNEL_LINK }],
        [{ text: tr(languageSafe, "check"), callback_data: "check_membership" }]
      ]
    }
  });
}

/* =========================================================
   Admin access
========================================================= */

async function approvedAdmins(env) {
  const list = await getJSON(env, "admin:approved", []);
  return Array.isArray(list) ? list.map(String) : [];
}

async function isAnyAdmin(env, userId) {
  if (isMainAdmin(env, userId)) return true;
  const list = await approvedAdmins(env);
  return list.includes(String(userId));
}

/* =========================================================
   Menu / start / language
========================================================= */

async function sendMainMenu(env, chatId, user) {
  const language = langOf(user);
  const admin = await isAnyAdmin(env, user.id);
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${tr(user, "welcome")}\n\n${tr(user, "menuHint")}`,
    reply_markup: bottomMenu(language)
  });
  return admin;
}

async function showLanguagePicker(env, chatId) {
  const rows = [];
  for (let index = 0; index < LANGUAGE_OPTIONS.length; index += 3) {
    rows.push(LANGUAGE_OPTIONS.slice(index, index + 3).map(item => ({
      text: item.label,
      callback_data: `lang:${item.code}`
    })));
  }
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: tr("fa", "chooseLanguage"),
    reply_markup: { inline_keyboard: rows }
  });
}

/* =========================================================
   Referral
========================================================= */

async function registerPendingReferral(env, user, parameter, firstStart) {
  if (!firstStart) return;
  const value = String(parameter || "");
  if (!value.startsWith("ref_")) return;
  const inviterId = value.slice(4).trim();
  if (!inviterId || inviterId === String(user.id)) return;
  if (user.pending_referrer || user.referral_completed) return;
  const raw = await env.BOT_DATA.get(`user:${inviterId}`);
  if (!raw) return;
  let inviter;
  try {
    inviter = JSON.parse(raw);
  } catch {
    return;
  }
  if (!inviter || inviter.blocked) return;
  user.pending_referrer = String(inviterId);
  await saveUser(env, user);
}

async function completeReferral(env, user) {
  if (user.referral_completed || !user.pending_referrer) return false;
  const inviterId = String(user.pending_referrer);
  if (inviterId === String(user.id)) return false;

  const creditKey = `ref:credited:${user.id}`;
  if (await env.BOT_DATA.get(creditKey)) {
    user.referral_completed = true;
    user.referrer_id = inviterId;
    delete user.pending_referrer;
    await saveUser(env, user);
    return false;
  }

  const raw = await env.BOT_DATA.get(`user:${inviterId}`);
  if (!raw) return false;
  let inviter;
  try {
    inviter = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!inviter || inviter.blocked) return false;

  inviter.valid_invites = Number(inviter.valid_invites || 0) + 1;
  inviter.invited_users = Array.isArray(inviter.invited_users) ? inviter.invited_users : [];
  if (!inviter.invited_users.includes(String(user.id))) inviter.invited_users.push(String(user.id));
  if (inviter.valid_invites >= REFERRAL_REWARD) inviter.no_cooldown = true;
  await saveUser(env, inviter);

  await env.BOT_DATA.put(creditKey, inviterId);
  user.referral_completed = true;
  user.referrer_id = inviterId;
  delete user.pending_referrer;
  await saveUser(env, user);

  await ensureLanguageDictionary(env, inviter.language);
  const text = `${tr(inviter, "inviteTitle")}\n\n${replaceText(tr(inviter, "inviteCount"), { n: inviter.valid_invites })}`;
  if (inviter.notifications !== false) await telegram(env, "sendMessage", { chat_id: inviter.id, text }).catch(() => {});
  return true;
}

async function showInvite(env, chatId, user) {
  let username = "";
  try {
    const result = await telegram(env, "getMe", {});
    if (result.ok && result.result?.username) username = String(result.result.username);
  } catch {}

  if (!username) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "inviteUnavailable") });
    return;
  }

  const link = `https://t.me/${username}?start=ref_${user.id}`;
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${tr(user, "inviteTitle")}\n\n🔗 ${link}\n\n${replaceText(tr(user, "inviteCount"), { n: user.valid_invites || 0 })}\n${tr(user, "inviteReward")}`
  });
}

/* =========================================================
   Movies
========================================================= */

async function getMovies(env) {
  return await getJSON(env, "movies", []);
}

async function saveMovies(env, movies) {
  await putJSON(env, "movies", movies);
}

async function findMovie(env, movieId) {
  const movies = await getMovies(env);
  return movies.find(movie => String(movie.id) === String(movieId)) || null;
}

async function addMovie(env, movie) {
  const movies = await getMovies(env);
  movie.featured = Boolean(movie.featured);
  movie.views = Number(movie.views || 0);
  movies.push(movie);
  await saveMovies(env, movies);
  return movie;
}

async function deleteMovie(env, movieId) {
  const movies = await getMovies(env);
  await saveMovies(env, movies.filter(movie => String(movie.id) !== String(movieId)));
  await deleteKey(env, `ratings:${movieId}`);
}

async function movieRatingInfo(env, movieId) {
  const list = await getJSON(env, `ratings:${movieId}`, []);
  const ratings = Array.isArray(list) ? list.map(Number).filter(Number.isFinite) : [];
  const count = ratings.length;
  const average = count ? ratings.reduce((a, b) => a + b, 0) / count : 0;
  return { count, average };
}

async function hasRated(env, movieId, userId) {
  return Boolean(await env.BOT_DATA.get(`rating:${movieId}:${userId}`));
}

async function recordUniqueView(env, user, movieId) {
  const key = `view:${movieId}:${user.id}`;
  if (await env.BOT_DATA.get(key)) return false;
  await env.BOT_DATA.put(key, String(now()));

  const movies = await getMovies(env);
     const index = movies.findIndex(movie => String(movie.id) === String(movieId));
  if (index !== -1) {
    movies[index].views = Number(movies[index].views || 0) + 1;
    await saveMovies(env, movies);
  }

  user.unique_views = Number(user.unique_views || 0) + 1;
  await saveUser(env, user);
  return true;
}

async function recordHistory(env, user, movieId) {
  const cutoff = now() - HISTORY_TTL;
  user.history = (Array.isArray(user.history) ? user.history : [])
    .filter(item => Number(item.at || 0) >= cutoff && String(item.movie_id) !== String(movieId));
  user.history.unshift({ movie_id: String(movieId), at: now() });
  user.history = user.history.slice(0, 100);
  user.movies_received = Number(user.movies_received || 0) + 1;
  user.last_active = now();
  await saveUser(env, user);
}

function movieCountry(movie, user) {
  return movie.country || user.country || "Unknown";
}

function countryFlag(country) {
  return ({
    Iran: "🇮🇷", France: "🇫🇷", Germany: "🇩🇪", Turkey: "🇹🇷",
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", India: "🇮🇳",
    Japan: "🇯🇵", China: "🇨🇳", Russia: "🇷🇺", Unknown: "🌍"
  })[country] || "🌍";
}

function cleanMovieCaptionBase(caption) {
  const metadataLine = /^(?:(?:👁\s*)?(?:بازدید|views)\s*[:：]|(?:⭐\s*)?(?:امتیاز|rating)\s*[:：]|(?:👥\s*)?(?:رأی|رای|votes)\s*[:：]|(?:🌍\s*)?(?:کشور|country)\s*[:：]|🌍\s*.+|🆔\s*|📢\s*@Super_Pump2|⏱\s*(?:این فیلم بعد|this movie will be deleted)|🗑\s*(?:فیلم حذف شد|movie deleted))/i;
  return String(caption || "")
    .split(/\r?\n/)
    .filter(line => !metadataLine.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function buildMovieCaption(env, movie, user) {
  const info = await movieRatingInfo(env, movie.id);
  const language = langOf(user);
  const country = movieCountry(movie, user);
  const id = movie.movie_code || movie.id;
  const originalBase = cleanMovieCaptionBase(movie.caption);
  const base = originalBase || (language === "fa" ? "🎬 فیلم" : "🎬 Movie");
  const tail = [
    "",
    "",
    `👁 ${language === "fa" ? "بازدید" : "Views"}: ${Number(movie.views || 0)}`,
    `⭐ ${language === "fa" ? "امتیاز" : "Rating"}: ${info.average ? info.average.toFixed(1) : "0.0"}/5`,
    `👥 ${language === "fa" ? "رأی" : "Votes"}: ${info.count}`,
    `🌍 ${countryFlag(country)} ${country}`,
    `🆔 ${id}`,
    "",
    "📢 @Super_Pump2",
    "",
    tr(user, "deleteNotice")
  ].join("\n");
  // Reserve space for metadata so the four requested stats are never cut off.
  const maxBaseLength = Math.max(0, 1024 - tail.length);
  return `${base.slice(0, maxBaseLength)}${tail}`.slice(0, 1024);
}

async function movieKeyboard(env, user, movieId) {
  const rated = await hasRated(env, movieId, user.id);
  const favorite = user.favorites.map(String).includes(String(movieId));
  const rows = [
    [
      { text: favorite ? tr(user, "removeFavorite") : tr(user, "addFavorite"), callback_data: `movie:fav:${favorite ? "remove" : "add"}:${movieId}` },
      { text: tr(user, "again"), callback_data: `movie:again:${movieId}` }
    ],
    [
      { text: tr(user, "report"), callback_data: `movie:report:${movieId}` }
    ]
  ];
  if (!rated) {
    rows.push([
      { text: "⭐ 1", callback_data: `movie:rate:${movieId}:1` },
      { text: "⭐ 2", callback_data: `movie:rate:${movieId}:2` },
      { text: "⭐ 3", callback_data: `movie:rate:${movieId}:3` },
      { text: "⭐ 4", callback_data: `movie:rate:${movieId}:4` },
      { text: "⭐ 5", callback_data: `movie:rate:${movieId}:5` }
    ]);
  }
  return { inline_keyboard: rows };
}

async function sendRawMovie(env, chatId, movie, replyMarkup = null) {
  const data = {
    chat_id: chatId,
    caption: movie.caption || "🎬 Movie",
    protect_content: false,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {})
  };
  if (movie.type === "document") return await telegram(env, "sendDocument", { ...data, document: movie.file_id });
  return await telegram(env, "sendVideo", { ...data, video: movie.file_id });
}

async function sendUserMovie(env, chatId, movie, user, ctx) {
  if (!movie) return null;
  if (!(await checkMembership(env, user.id))) {
    await sendMembershipMessage(env, chatId, langOf(user));
    return null;
  }

  const caption = await buildMovieCaption(env, movie, user);
  const markup = await movieKeyboard(env, user, movie.id);
  const result = await sendRawMovie(env, chatId, { ...movie, caption }, markup);
  if (!result.ok || !result.result?.message_id) return result;

  await recordHistory(env, user, movie.id);
  await recordUniqueView(env, user, movie.id);

  const messageId = result.result.message_id;
  const refreshedMovie = await findMovie(env, movie.id) || movie;
  const refreshedCaption = await buildMovieCaption(env, refreshedMovie, user);
  await telegram(env, "editMessageCaption", {
    chat_id: chatId,
    message_id: messageId,
    caption: refreshedCaption,
    reply_markup: markup
  }).catch(() => {});

  const removeLater = async () => {
    try {
      await telegram(env, "deleteMessage", { chat_id: chatId, message_id: messageId });
    } catch (error) {
      console.error("Movie delete error:", error);
    }
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "deleted"),
      reply_markup: { inline_keyboard: [[{ text: tr(user, "resend"), callback_data: `movie:again:${movie.id}` }]] }
    }).catch(() => {});
  };

  const timer = new Promise(resolve => {
    setTimeout(async () => {
      await removeLater();
      resolve();
    }, AUTO_DELETE_TIME);
  });
  if (ctx?.waitUntil) ctx.waitUntil(timer);
  return result;
}

async function getMovieForUser(env, chatId, user, ctx) {
  if (!(await checkMembership(env, user.id))) {
    await sendMembershipMessage(env, chatId, langOf(user));
    return;
  }

  const cooldownKey = `cooldown:${user.id}`;
  const last = await env.BOT_DATA.get(cooldownKey);
  const unlimited = isMainAdmin(env, user.id) || Number(user.valid_invites || 0) >= REFERRAL_REWARD;
  if (!unlimited && last) {
    const elapsed = now() - Number(last);
    if (elapsed < MOVIE_COOLDOWN) {
      const remaining = Math.ceil((MOVIE_COOLDOWN - elapsed) / 1000);
      await telegram(env, "sendMessage", { chat_id: chatId, text: replaceText(tr(user, "wait"), { n: remaining }) });
      return;
    }
  }

  const movies = await getMovies(env);
  if (!movies.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "movieEmpty") });
    return;
  }

  const cutoff = now() - HISTORY_TTL;
  user.history = (Array.isArray(user.history) ? user.history : []).filter(item => Number(item.at || 0) >= cutoff);
  const unseen = movies.filter(movie => !user.history.some(item => String(item.movie_id) === String(movie.id)));
  const pool = unseen.length ? unseen : movies;
  const movie = pool[Math.floor(Math.random() * pool.length)];
  const sent = await sendUserMovie(env, chatId, movie, user, ctx);
  if (sent?.ok && !unlimited) {
    await env.BOT_DATA.put(cooldownKey, String(now()), { expirationTtl: Math.ceil(MOVIE_COOLDOWN / 1000) + 5 });
  }
}

async function rateMovie(env, callback, movieId, rating) {
  const user = await ensureUser(env, callback.from);
  const language = langOf(user);
  const movie = await findMovie(env, movieId);
  if (!movie || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌", show_alert: true });
    return;
  }
  const key = `rating:${movieId}:${user.id}`;
  if (await env.BOT_DATA.get(key)) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "alreadyRated"), show_alert: true });
    return;
  }
  await env.BOT_DATA.put(key, String(rating));
  const list = await getJSON(env, `ratings:${movieId}`, []);
  const ratings = Array.isArray(list) ? list : [];
  ratings.push(rating);
  await putJSON(env, `ratings:${movieId}`, ratings);
  user.ratings = Number(user.ratings || 0) + 1;
  await saveUser(env, user);

  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "rateSaved") });
  if (callback.message?.message_id) {
    const markup = await movieKeyboard(env, user, movieId);
    const refreshedMovie = await findMovie(env, movieId) || movie;
    const caption = await buildMovieCaption(env, refreshedMovie, user);
    await telegram(env, "editMessageCaption", {
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      caption,
      reply_markup: markup
    }).catch(() => {});
  }
}

async function addFavorite(env, user, movieId) {
  if (!await findMovie(env, movieId)) return false;
  user.favorites = Array.isArray(user.favorites) ? user.favorites : [];
  if (!user.favorites.map(String).includes(String(movieId))) user.favorites.push(String(movieId));
  await saveUser(env, user);
  return true;
}

async function removeFavorite(env, user, movieId) {
  user.favorites = (Array.isArray(user.favorites) ? user.favorites : []).filter(id => String(id) !== String(movieId));
  await saveUser(env, user);
}

async function showFavorites(env, chatId, user) {
  const movies = await getMovies(env);
  const list = user.favorites.map(id => movies.find(movie => String(movie.id) === String(id))).filter(Boolean);
  if (!list.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "favoritesEmpty") });
    return;
  }
  const rows = list.slice(0, 50).map((movie, index) => ([{
    text: `🎬 ${tr(user, "movieNumber")} ${index + 1}`,
    callback_data: `favorite:view:${movie.id}`
  }]));
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${tr(user, "favoritesTitle")}\n\n📚 ${list.length}`,
    reply_markup: { inline_keyboard: rows }
  });
}

/* =========================================================
   Movie reports
========================================================= */

async function reportMovie(env, callback, movieId, reason) {
  const report = {
    id: randomId(),
    movie_id: String(movieId),
    user_id: String(callback.from.id),
    reason,
         created_at: now(),
    status: "open"
  };
  await putJSON(env, `report:${report.id}`, report);
  const adminId = getAdminId(env);
  if (adminId) {
    await telegram(env, "sendMessage", {
      chat_id: adminId,
      text: `🚫 گزارش فیلم\n\n🎬 ${movieId}\n👤 ${callback.from.id}\n⚠️ ${reason}`
    }).catch(() => {});
  }
  const user = await ensureUser(env, callback.from);
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "reportSaved") });
}

async function showReportMenu(env, callback, movieId) {
  const user = await ensureUser(env, callback.from);
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
  await telegram(env, "sendMessage", {
    chat_id: callback.message.chat.id,
    text: tr(user, "reportTitle"),
    reply_markup: {
      inline_keyboard: [
        [
          { text: `🚫 ${tr(user, "reportBroken")}`, callback_data: `movie:report:${movieId}:broken` },
          { text: `❌ ${tr(user, "reportWrong")}`, callback_data: `movie:report:${movieId}:wrong` }
        ],
        [
          { text: `🔁 ${tr(user, "reportDuplicate")}`, callback_data: `movie:report:${movieId}:duplicate` },
          { text: `⚠️ ${tr(user, "reportOther")}`, callback_data: `movie:report:${movieId}:other` }
        ]
      ]
    }
  });
}

/* =========================================================
   Movie submission / pending queue
========================================================= */

async function getPending(env) {
  const list = await getJSON(env, "pending_movies", []);
  return Array.isArray(list) ? list : [];
}

async function savePending(env, list) {
  await putJSON(env, "pending_movies", list);
}

async function saveSubmittedMovie(env, message, user) {
  let type = null;
  let fileId = null;
  if (message.video) {
    type = "video";
    fileId = message.video.file_id;
  } else if (message.document) {
    type = "document";
    fileId = message.document.file_id;
  }
  if (!fileId) return null;

  const movie = {
    id: randomId(),
    file_id: fileId,
    type,
    caption: message.caption || "🎬 فیلم ارسال‌شده توسط کاربر",
    user_id: String(user.id),
    added_at: new Date().toISOString(),
    views: 0,
    featured: false
  };
  const pending = await getPending(env);
  pending.push(movie);
  await savePending(env, pending);
  return movie;
}

async function sendSubmittedMovieToAdmin(env, adminId, movie) {
  await telegram(env, "sendMessage", {
    chat_id: adminId,
    text: `📥 فیلم جدید برای بررسی\n\n👤 کاربر: ${movie.user_id}\n🕐 ${movie.added_at}`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "👀 مشاهده", callback_data: `pending:view:${movie.id}` }],
        [
          { text: "✅ تأیید", callback_data: `pending:approve:${movie.id}` },
          { text: "❌ رد", callback_data: `pending:reject:${movie.id}` }
        ]
      ]
    }
  });
  await sendRawMovie(env, adminId, movie).catch(() => {});
}

async function handleSubmittedMovie(env, message) {
  const user = await ensureUser(env, message.from);
  if (user.blocked) {
    await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "blocked") });
    return;
  }
  const movie = await saveSubmittedMovie(env, message, user);
  if (!movie) return;
  await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "movieReceived") });
  const adminId = getAdminId(env);
  if (adminId) await sendSubmittedMovieToAdmin(env, adminId, movie);
}

async function approvePending(env, movieId) {
  const list = await getPending(env);
  const index = list.findIndex(movie => String(movie.id) === String(movieId));
  if (index === -1) return null;
  const movie = list[index];
  list.splice(index, 1);
  await savePending(env, list);
  const userId = movie.user_id;
  delete movie.user_id;
  await addMovie(env, movie);
  movie.user_id = userId;
  return movie;
}

async function rejectPending(env, movieId) {
  const list = await getPending(env);
  const index = list.findIndex(movie => String(movie.id) === String(movieId));
  if (index === -1) return null;
  const movie = list[index];
  list.splice(index, 1);
  await savePending(env, list);
  return movie;
}

async function showPendingList(env, chatId) {
  const list = await getPending(env);
  if (!list.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: "📭 فیلمی در انتظار تأیید نیست." });
    return;
  }
  for (const [index, movie] of list.entries()) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: `📥 فیلم شماره ${index + 1}\n\n👤 کاربر: ${movie.user_id}\n🕐 ${movie.added_at || "-"}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "👀 مشاهده", callback_data: `pending:view:${movie.id}` }],
          [
            { text: "✅ تأیید", callback_data: `pending:approve:${movie.id}` },
            { text: "❌ رد", callback_data: `pending:reject:${movie.id}` }
          ]
        ]
      }
    });
  }
}

/* =========================================================
   Admin movie list
========================================================= */

function movieListKeyboard(movies, page) {
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIE_PAGE_SIZE));
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
  const start = safePage * MOVIE_PAGE_SIZE;
  const rows = movies.slice(start, start + MOVIE_PAGE_SIZE).map((movie, index) => ([
    {
      text: `${movie.featured ? "⭐" : "🎬"} فیلم شماره ${start + index + 1}`,
      callback_data: `adminmovie:view:${movie.id}:${safePage}`
    },
    {
      text: "🗑 حذف",
      callback_data: `adminmovie:deleteask:${movie.id}:${safePage}`
    }
  ]));

  const nav = [];
  if (safePage > 0) nav.push({ text: "⬅️ قبلی", callback_data: `adminmovie:list:${safePage - 1}` });
  if (safePage < totalPages - 1) nav.push({ text: "بعدی ➡️", callback_data: `adminmovie:list:${safePage + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: "🔙 پنل مدیریت", callback_data: "admin:panel" }]);
  return { inline_keyboard: rows };
}

async function showAdminMovies(env, chatId, page = 0) {
  const movies = await getMovies(env);
  if (!movies.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: "📭 آرشیو فیلم خالی است." });
    return;
  }
  const totalPages = Math.ceil(movies.length / MOVIE_PAGE_SIZE);
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `🎬 لیست فیلم‌ها\n\nصفحه ${safePage + 1} از ${totalPages}\nتعداد کل: ${movies.length}`,
    reply_markup: movieListKeyboard(movies, safePage)
  });
}

async function showAdminMovie(env, callback, movieId, page) {
  const movie = await findMovie(env, movieId);
  if (!movie) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ فیلم پیدا نشد.", show_alert: true });
    return;
  }
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
  const adminUser = await ensureUser(env, callback.from);
  const caption = await buildMovieCaption(env, movie, adminUser);
  await sendRawMovie(env, callback.message.chat.id, { ...movie, caption }, {
    inline_keyboard: [
      [{ text: "🗑 حذف فیلم", callback_data: `adminmovie:delete:${movie.id}:${page}` }],
      [{ text: movie.featured ? "☆ حذف پیشنهادی" : "⭐ پیشنهادی", callback_data: `adminmovie:featured:${movie.id}:${page}` }],
      [{ text: "🔙 بازگشت", callback_data: `adminmovie:list:${page}` }]
    ]
  });
}

async function askDeleteAdminMovie(env, callback, movieId, page = 0) {
  const chatId = callback.message.chat.id;
  const messageId = callback.message.message_id;
  const movie = await findMovie(env, movieId);
  if (!movie) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "❌ فیلم پیدا نشد.",
      show_alert: true
    });
    return;
  }

  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
  const title = String(movie.caption || `فیلم شماره ${movieId}`).slice(0, 600);
  const markup = {
    inline_keyboard: [
      [{ text: "✅ بله، حذف کن", callback_data: `adminmovie:deleteconfirm:${movieId}:${page}` }],
      [{ text: "❌ لغو", callback_data: `adminmovie:list:${page}` }]
    ]
  };
  const result = await telegram(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: `❗ مطمئنی این فیلم حذف شود؟\n\n🎬 ${title}`,
    reply_markup: markup
  });
  if (!result.ok) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: `❗ مطمئنی این فیلم حذف شود؟\n\n🎬 ${title}`,
      reply_markup: markup
    });
  }
}

async function confirmDeleteAdminMovie(env, callback, movieId, page = 0) {
  const chatId = callback.message.chat.id;
  const messageId = callback.message.message_id;
  const movie = await findMovie(env, movieId);
  const markup = { inline_keyboard: [[{ text: "🎬 بازگشت به لیست فیلم‌ها", callback_data: `adminmovie:list:${page}` }]] };
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });

  if (!movie) {
    const notFound = await telegram(env, "editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text: "❌ فیلم پیدا نشد یا قبلاً حذف شده است.",
      reply_markup: markup
    });
    if (!notFound.ok) await telegram(env, "sendMessage", { chat_id: chatId, text: "❌ فیلم پیدا نشد یا قبلاً حذف شده است.", reply_markup: markup });
    return;
  }

  await deleteMovie(env, movieId);
  await logAction(env, String(callback.from.id), "movie_deleted", { movie_id: String(movieId) });
  const title = String(movie.caption || `شماره ${movieId}`).slice(0, 300);
  const result = await telegram(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
         text: `🗑 فیلم «${title}» حذف شد.`,
    reply_markup: markup
  });
  if (!result.ok) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: `🗑 فیلم «${title}» حذف شد.`,
      reply_markup: markup
    });
  }
}

async function toggleFeatured(env, movieId) {
  const movies = await getMovies(env);
  const movie = movies.find(item => String(item.id) === String(movieId));
  if (!movie) return false;
  movie.featured = !Boolean(movie.featured);
  await saveMovies(env, movies);
  return movie.featured;
}

/* =========================================================
   Movie requests
========================================================= */

async function createMovieRequest(env, user, name) {
  const title = String(name || "").trim();
  if (title.length < 2) return null;
  const list = await getJSON(env, "movie_requests", []);
  const requests = Array.isArray(list) ? list : [];
  let item = requests.find(x => String(x.name).toLowerCase() === title.toLowerCase() && x.status !== "rejected");
  if (!item) {
    item = {
      id: randomId(),
      name: title,
      user_id: String(user.id),
      votes: 1,
      voters: [String(user.id)],
      status: "pending",
      created_at: now()
    };
    requests.push(item);
  } else {
    item.voters = Array.isArray(item.voters) ? item.voters : [];
    if (!item.voters.includes(String(user.id))) {
      item.voters.push(String(user.id));
      item.votes = Number(item.votes || 0) + 1;
    }
  }
  await putJSON(env, "movie_requests", requests);
  return item;
}

async function voteMovieRequest(env, userId, requestId) {
  const list = await getJSON(env, "movie_requests", []);
  const requests = Array.isArray(list) ? list : [];
  const item = requests.find(x => String(x.id) === String(requestId));
  if (!item) return { ok: false, reason: "not_found" };
  item.voters = Array.isArray(item.voters) ? item.voters : [];
  if (item.voters.map(String).includes(String(userId))) return { ok: false, reason: "duplicate" };
  item.voters.push(String(userId));
  item.votes = Number(item.votes || 0) + 1;
  await putJSON(env, "movie_requests", requests);
  return { ok: true, item };
}

async function showMovieRequestList(env, chatId, language) {
  const list = await getJSON(env, "movie_requests", []);
  const pending = (Array.isArray(list) ? list : [])
    .filter(x => x.status === "pending")
    .sort((a, b) => Number(b.votes || 0) - Number(a.votes || 0))
    .slice(0, 20);
  if (!pending.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(language, "noMovieRequests") });
    return;
  }
  const rows = pending.map(item => ([{
    text: `🎬 ${item.name} — 🔥 ${item.votes || 0}`,
    callback_data: `request:vote:${item.id}`
  }]));
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: tr(language, "movieRequestsTitle"),
    reply_markup: { inline_keyboard: rows }
  });
}

/* =========================================================
   Admin requests
========================================================= */

async function submitAdminRequest(env, user) {
  const language = langOf(user);
  if (await isAnyAdmin(env, user.id)) {
    await showAdminPanel(env, user.id, user);
    return;
  }

  const current = await getJSON(env, "admin:requests", []);
  const list = Array.isArray(current) ? current : [];
  if (list.some(item => String(item.user_id) === String(user.id) && item.status === "pending")) {
    await telegram(env, "sendMessage", { chat_id: user.id, text: tr(user, "adminPending") });
    return;
  }

  list.push({ id: randomId(), user_id: String(user.id), status: "pending", created_at: now() });
  await putJSON(env, "admin:requests", list);

  const mainAdmin = getAdminId(env);
  if (mainAdmin) {
    await telegram(env, "sendMessage", {
      chat_id: mainAdmin,
      text: `🔐 درخواست Admin جدید\n\n👤 نام: ${user.first_name || "-"}\n🔖 یوزرنیم: ${user.username ? `@${user.username}` : "-"}\n🆔 ID: ${user.id}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "👤 مشاهده پروفایل", callback_data: `adminrequest:profile:${user.id}` }],
          [
            { text: "✅ تأیید", callback_data: `adminrequest:approve:${user.id}` },
            { text: "❌ رد", callback_data: `adminrequest:reject:${user.id}` }
          ]
        ]
      }
    });
  }

  await telegram(env, "sendMessage", { chat_id: user.id, text: tr(user, "adminRequestSent") });
}

async function reviewAdminRequest(env, callback, action, targetId) {
  if (!isMainAdmin(env, callback.from.id)) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr("fa", "denied"), show_alert: true });
    return;
  }

  const current = await getJSON(env, "admin:requests", []);
  const list = Array.isArray(current) ? current : [];
  const item = list.find(request => String(request.user_id) === String(targetId) && request.status === "pending");
  if (!item) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ درخواست پیدا نشد.", show_alert: true });
    return;
  }

  item.status = action === "approve" ? "approved" : "rejected";
  item.reviewed_at = now();
  item.reviewed_by = String(callback.from.id);
  await putJSON(env, "admin:requests", list);

  if (action === "approve") {
    const admins = await approvedAdmins(env);
    if (!admins.includes(String(targetId))) admins.push(String(targetId));
    await putJSON(env, "admin:approved", admins);
  }

  await logAction(env, callback.from.id, `admin_request_${action}`, { target: String(targetId) });
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: action === "approve" ? "✅" : "❌" });

  const target = await getUser(env, targetId);
  await ensureLanguageDictionary(env, target.language);
  const text = action === "approve" ? tr(target, "adminApproved") : tr(target, "adminRejected");
  await telegram(env, "sendMessage", { chat_id: targetId, text }).catch(() => {});
  if (action === "approve") await sendMainMenu(env, targetId, target).catch(() => {});
}

async function showAdminRequests(env, chatId) {
  if (!isMainAdmin(env, chatId)) return;
  const list = await getJSON(env, "admin:requests", []);
  const pending = (Array.isArray(list) ? list : []).filter(item => item.status === "pending");
  if (!pending.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: "📭 درخواست Admin در انتظار وجود ندارد." });
    return;
  }
  for (const item of pending) {
    const user = await getUser(env, item.user_id);
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: `🔐 درخواست Admin\n\n👤 ${user.first_name || "-"}\n🔖 ${user.username ? `@${user.username}` : "-"}\n🆔 ${user.id}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "👤 مشاهده پروفایل", callback_data: `adminrequest:profile:${user.id}` }],
          [
            { text: "✅ تأیید", callback_data: `adminrequest:approve:${user.id}` },
            { text: "❌ رد", callback_data: `adminrequest:reject:${user.id}` }
          ]
        ]
      }
    });
  }
}

/* =========================================================
   Admin user list / profile
========================================================= */

async function showAdminUsers(env, chatId, page = 0) {
  const users = await getAllUsers(env);
  users.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  const totalPages = Math.max(1, Math.ceil(users.length / USER_PAGE_SIZE));
  const safePage = Math.max(0, Math.min(Number(page) || 0, totalPages - 1));
  const start = safePage * USER_PAGE_SIZE;
  const current = users.slice(start, start + USER_PAGE_SIZE);
  const rows = current.map((user, index) => ([{
    text: `👤 ${start + index + 1}. ${String(user.first_name || user.username || user.id).slice(0, 30)}`,
    callback_data: `adminuser:view:${user.id}:${safePage}`
  }]));
  const nav = [];
  if (safePage > 0) nav.push({ text: "⬅️ قبلی", callback_data: `adminuser:list:${safePage - 1}` });
  if (safePage < totalPages - 1) nav.push({ text: "بعدی ➡️", callback_data: `adminuser:list:${safePage + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: "🔙 پنل مدیریت", callback_data: "admin:panel" }]);

  const text = users.length
    ? `👥 لیست کاربران\n\nصفحه ${safePage + 1} از ${totalPages}\nتعداد کل: ${users.length}`
    : "📭 کاربری ثبت نشده است.";
  await telegram(env, "sendMessage", { chat_id: chatId, text, reply_markup: { inline_keyboard: rows } });
}

async function showUserProfileForAdmin(env, callback, targetId, page = 0) {
  if (!(await isAnyAdmin(env, callback.from.id))) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr("fa", "denied"), show_alert: true });
    return;
  }
  const user = await getUser(env, targetId);
  const admin = await getUser(env, callback.from.id);
  const isAdminUser = await isAnyAdmin(env, targetId);
  const language = langOf(admin);
  const text = language === "fa"
    ? [
        "👤 پروفایل کاربر", "",
        `👤 نام: ${user.first_name || "-"}`,
        `🔖 یوزرنیم: ${user.username ? `@${user.username}` : "-"}`,
        `🆔 ID: ${user.id}`,
        `🌐 زبان: ${langOf(user) === "fa" ? "🇮🇷 فارسی" : "🇬🇧 English"}`,
        `📅 عضویت: ${user.created_at ? new Date(user.created_at).toLocaleString("fa-IR") : "-"}`,
        `🕐 آخرین فعالیت: ${user.last_active ? new Date(user.last_active).toLocaleString("fa-IR") : "-"}`,
        `🎬 فیلم‌های دریافت‌شده: ${user.movies_received || 0}`,
        `👁 بازدید یکتا: ${user.unique_views || 0}`,
        `⭐ امتیازهای ثبت‌شده: ${user.ratings || 0}`,
        `❤️ موردعلاقه‌ها: ${(user.favorites || []).length}`,
        `👥 دعوت موفق: ${user.valid_invites || 0}`,
        `🚫 وضعیت: ${user.blocked ? "بلاک" : "فعال"}`,
        `👑 Admin: ${isAdminUser ? "بله" : "خیر"}`
             ].join("\n")
    : [
        "👤 User Profile", "",
        `👤 Name: ${user.first_name || "-"}`,
        `🔖 Username: ${user.username ? `@${user.username}` : "-"}`,
        `🆔 ID: ${user.id}`,
        `🌐 Language: ${langOf(user) === "fa" ? "🇮🇷 Persian" : "🇬🇧 English"}`,
        `📅 Joined: ${user.created_at ? new Date(user.created_at).toLocaleString("en-GB") : "-"}`,
        `🕐 Last active: ${user.last_active ? new Date(user.last_active).toLocaleString("en-GB") : "-"}`,
        `🎬 Movies received: ${user.movies_received || 0}`,
        `👁 Unique views: ${user.unique_views || 0}`,
        `⭐ Ratings given: ${user.ratings || 0}`,
        `❤️ Favorites: ${(user.favorites || []).length}`,
        `👥 Successful invites: ${user.valid_invites || 0}`,
        `🚫 Status: ${user.blocked ? "Blocked" : "Active"}`,
        `👑 Admin: ${isAdminUser ? "Yes" : "No"}`
      ].join("\n");
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
  await telegram(env, "sendMessage", {
    chat_id: callback.message.chat.id,
    text,
    reply_markup: { inline_keyboard: [[{ text: language === "fa" ? "🔙 بازگشت به لیست کاربران" : "🔙 Back to users", callback_data: `adminuser:list:${page}` }]] }
  });
}

/* =========================================================
   Admin statistics / backup / health / logs
========================================================= */

async function logAction(env, actor, action, details = {}) {
  await putJSON(env, `log:${now()}:${randomId()}`, {
    at: now(), actor: String(actor), action, details
  });
}

async function getStats(env) {
  const users = await getAllUsers(env);
  const movies = await getMovies(env);
  const pending = await getPending(env);
  let ratings = 0;
  for (const movie of movies) ratings += (await movieRatingInfo(env, movie.id)).count;
  const favorites = users.reduce((sum, user) => sum + (Array.isArray(user.favorites) ? user.favorites.length : 0), 0);
  const active = users.filter(user => now() - Number(user.last_active || user.created_at || 0) < 24 * 60 * 60 * 1000).length;
  const views = movies.reduce((sum, movie) => sum + Number(movie.views || 0), 0);
  const invites = users.reduce((sum, user) => sum + Number(user.valid_invites || 0), 0);
  return { users: users.length, movies: movies.length, pending: pending.length, ratings, favorites, active, views, invites };
}

async function createBackup(env) {
  const payload = {
    created_at: now(),
    users: await getAllUsers(env),
    movies: await getMovies(env),
    pending: await getPending(env),
    requests: await getJSON(env, "movie_requests", []),
    admin_requests: await getJSON(env, "admin:requests", []),
    approved_admins: await approvedAdmins(env)
  };
  const key = `backup:${new Date().toISOString().replace(/[:.]/g, "-")}`;
  await putJSON(env, key, payload);
  await env.BOT_DATA.put("backup:last", key);
  return key;
}

async function healthCheck(env) {
  const result = { bot: Boolean(env.BOT_TOKEN), database: false, storage: false, webhook: true, backup: false };
  try {
    await env.BOT_DATA.get("health:test");
    result.database = true;
    result.storage = true;
    result.backup = Boolean(await env.BOT_DATA.get("backup:last"));
  } catch {}
  return result;
}

async function showAdminPanel(env, chatId, user) {
  if (!(await isAnyAdmin(env, user.id))) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "denied") });
    return;
  }
  const stats = await getStats(env);
  const text = replaceText(tr(user, "adminPanelStats"), {
    users: stats.users,
    movies: stats.movies,
    views: stats.views,
    ratings: stats.ratings,
    favorites: stats.favorites,
    active: stats.active,
    pending: stats.pending,
    invites: stats.invites
  });
  const buttons = [
    [
      { text: tr(user, "adminMoviesButton"), callback_data: "admin:movies" },
      { text: tr(user, "adminPendingButton"), callback_data: "admin:pending" }
    ],
    [
      { text: tr(user, "adminUsersButton"), callback_data: "admin:users" },
      { text: tr(user, "adminStatsButton"), callback_data: "admin:stats" }
    ],
    [{ text: tr(user, "adminRequestsButton"), callback_data: "admin:requests" }],
    [
      { text: tr(user, "adminBackupButton"), callback_data: "admin:backup" },
      { text: tr(user, "adminHealthButton"), callback_data: "admin:health" }
    ],
    [{ text: tr(user, "adminMovieRequestsButton"), callback_data: "admin:movie_requests" }],
    [{ text: tr(user, "announcementButton"), callback_data: "admin:announcement" }],
    [{ text: tr(user, "backButton"), callback_data: "menu:open" }]
  ];
  await telegram(env, "sendMessage", { chat_id: chatId, text, reply_markup: { inline_keyboard: buttons } });
  await logAction(env, user.id, "admin_panel_open");
}

/* =========================================================
   Admin announcement / language-targeted broadcast
========================================================= */

function splitTelegramText(value, maxLength = 3900) {
  const source = String(value || "");
  if (!source) return [""];
  const chunks = [];
  let remaining = source;
  while (remaining.length > maxLength) {
    let cut = remaining.lastIndexOf("\n", maxLength);
    if (cut < Math.floor(maxLength * 0.6)) cut = remaining.lastIndexOf(" ", maxLength);
    if (cut < Math.floor(maxLength * 0.6)) cut = maxLength;
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).replace(/^\s+/, "");
  }
  if (remaining || chunks.length === 0) chunks.push(remaining);
  return chunks;
}

async function sendLongTelegramMessage(env, chatId, text) {
  const parts = splitTelegramText(text);
  for (const part of parts) {
    const result = await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: part,
      disable_web_page_preview: true
    });
    if (!result?.ok) return false;
  }
  return true;
}

async function broadcastLanguageAnnouncement(env, adminChatId, adminUser, sourceText, targetLanguage) {
  await telegram(env, "sendMessage", {
    chat_id: adminChatId,
    text: tr(adminUser, "announcementWorking")
  }).catch(() => {});

  const language = normalizeLanguage(targetLanguage);
  const allUsers = await getAllUsers(env);
  const eligible = allUsers.filter(user => user && user.id && !user.blocked && user.notifications !== false);
  const recipients = eligible.filter(user => normalizeLanguage(user.language) === language);
  const skipped = allUsers.length - recipients.length;
  let success = 0;
  let failed = 0;
  const batchSize = 12;
  for (let index = 0; index < recipients.length; index += batchSize) {
    const batch = recipients.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(async user => {
      try {
        return await sendLongTelegramMessage(env, user.id, sourceText);
      } catch (error) {
        console.error("Announcement delivery failed for user:", user.id, error?.message || error);
        return false;
      }
    }));
    for (const ok of results) {
      if (ok) success++;
      else failed++;
    }
  }

  const option = LANGUAGE_OPTIONS.find(item => item.code === language);
  const report = replaceText(tr(adminUser, "announcementResult"), {
    language: option ? option.label : language,
    success,
    failed,
    skipped
  });
  await telegram(env, "sendMessage", { chat_id: adminChatId, text: report });
  await logAction(env, adminUser.id, "announcement_sent", {
    language,
    success,
    failed,
    skipped,
    message_length: sourceText.length
  });
}

/* =========================================================
   Main update handler
========================================================= */

async function handleStart(env, message, user) {
  const firstStart = !user.first_start_at;
  if (firstStart) {
    user.first_start_at = now();
    await saveUser(env, user);
  }
  const parameter = String(message.text || "").split(" ")[1] || "";
  await registerPendingReferral(env, user, parameter, firstStart);

  if (!user.language_selected) {
    await showLanguagePicker(env, message.chat.id);
    return;
  }

  if (!(await checkMembership(env, user.id))) {
    await sendMembershipMessage(env, message.chat.id, langOf(user));
    return;
  }

  user.joined = true;
  await saveUser(env, user);
  await completeReferral(env, user);
  await sendMainMenu(env, message.chat.id, user);
}

async function handleLanguageCallback(env, callback) {
  const user = await ensureUser(env, callback.from);
  const requestedLanguage = String(callback.data || "").split(":")[1];
  user.language = normalizeLanguage(requestedLanguage);
  user.language_selected = true;
  await ensureLanguageDictionary(env, user.language);
  await saveUser(env, user);
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "languageSaved") });

  if (!(await checkMembership(env, user.id))) {
    await sendMembershipMessage(env, callback.message.chat.id, langOf(user));
    return;
  }
  user.joined = true;
  await saveUser(env, user);
  await completeReferral(env, user);
  await sendMainMenu(env, callback.message.chat.id, user);
}

async function handleMembershipCallback(env, callback) {
  const user = await ensureUser(env, callback.from);
  if (!(await checkMembership(env, user.id))) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "notMember"), show_alert: true });
    return;
  }
  user.joined = true;
  await saveUser(env, user);
  await completeReferral(env, user);
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "✅" });
  await sendMainMenu(env, callback.message.chat.id, user);
}

async function handleMenuCallback(env, callback, ctx) {
  const user = await ensureUser(env, callback.from);
  const chatId = callback.message.chat.id;
  const data = callback.data;
  const language = langOf(user);
  const needsMembership = !["menu:open", "menu:language"].includes(data);
  if (needsMembership && !(await isAnyAdmin(env, user.id)) && !(await checkMembership(env, user.id))) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "notMember"), show_alert: true });
         await sendMembershipMessage(env, chatId, language);
    return true;
  }

  if (data === "menu:open") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    const admin = await isAnyAdmin(env, user.id);
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuTitle"),
      reply_markup: expandedMenu(language, admin)
    });
    return true;
  }
  if (data === "menu:get") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await getMovieForUser(env, chatId, user, ctx);
    return true;
  }
  if (data === "menu:submit") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await env.BOT_DATA.put(`state:${user.id}`, "submit");
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "sendPrompt") });
    return true;
  }
  if (data === "menu:request") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await env.BOT_DATA.put(`state:${user.id}`, "request");
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "requestPrompt") });
    return true;
  }
  if (data === "menu:favorites") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showFavorites(env, chatId, user);
    return true;
  }
  if (data === "menu:invite") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showInvite(env, chatId, user);
    return true;
  }
  if (data === "menu:language") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showLanguagePicker(env, chatId);
    return true;
  }
  if (data === "menu:admin") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminPanel(env, chatId, user);
    return true;
  }
  return false;
}

async function handleReplyMenuButton(env, message, user, ctx) {
  if (!message.text) return false;
  const text = message.text.trim();
  const language = langOf(user);
  const chatId = message.chat.id;

  if ([tr(user, "menuButton"), "☰ منو", "☰ Menu"].includes(text)) {
    const admin = await isAnyAdmin(env, user.id);
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuTitle"),
      reply_markup: expandedMenu(language, admin)
    });
    return true;
  }

  if ([tr(user, "closeMenu"), "🔽 بستن منو", "🔽 Hide menu"].includes(text)) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuClosed"),
      reply_markup: bottomMenu(language)
    });
    return true;
  }

  const actions = new Map([
    [tr(user, "getMovie"), "get"],
    [tr(user, "submitMovie"), "submit"],
    [tr(user, "requestMovie"), "request"],
    [tr(user, "favorites"), "favorites"],
    [tr(user, "invite"), "invite"],
    [tr(user, "changeLanguage"), "language"],
    [tr(user, "admin"), "admin"]
  ]);
  const action = actions.get(text);
  if (!action) return false;

  if (action !== "language" && action !== "admin" && !(await isAnyAdmin(env, user.id)) && !(await checkMembership(env, user.id))) {
    await sendMembershipMessage(env, chatId, language);
    return true;
  }
  if (action === "admin" && !(await isAnyAdmin(env, user.id))) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "denied") });
    return true;
  }

  // A menu selection cancels any previous text-input state before setting a new one.
  await deleteKey(env, `state:${user.id}`);

  if (action === "get") {
    await getMovieForUser(env, chatId, user, ctx);
  } else if (action === "submit") {
    await env.BOT_DATA.put(`state:${user.id}`, "submit");
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "sendPrompt") });
  } else if (action === "request") {
    await env.BOT_DATA.put(`state:${user.id}`, "request");
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "requestPrompt") });
  } else if (action === "favorites") {
    await showFavorites(env, chatId, user);
  } else if (action === "invite") {
    await showInvite(env, chatId, user);
  } else if (action === "language") {
    await showLanguagePicker(env, chatId);
  } else if (action === "admin") {
    await showAdminPanel(env, chatId, user);
  }
  return true;
}

async function handleMessage(env, message, ctx) {
  if (!message.from) return;
  const user = await ensureUser(env, message.from);
  user.last_active = now();
  await saveUser(env, user);

  if (user.blocked) {
    await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "blocked") });
    return;
  }

  if (message.text && (message.text === "/start" || message.text.startsWith("/start "))) {
    await handleStart(env, message, user);
    return;
  }

  const activeState = await env.BOT_DATA.get(`state:${user.id}`);
  if (typeof activeState === "string" && activeState.startsWith("admin_announcement_text:")) {
    const targetLanguage = normalizeLanguage(activeState.split(":")[1]);
    if (!(await isAnyAdmin(env, user.id))) {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "denied") });
      return;
    }
    const announcementText = String(message.text || "").trim();
    if (announcementText === "/cancel") {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "announcementCancelled") });
      return;
    }
    if (!message.text) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "announcementTextRequired") });
      return;
    }
    if (announcementText.length > 3500) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "announcementTooLong") });
      return;
    }
    if (!announcementText) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "announcementTextRequired") });
      return;
    }
    await deleteKey(env, `state:${user.id}`);
    await broadcastLanguageAnnouncement(env, message.chat.id, user, announcementText, targetLanguage);
    return;
  }

  if (message.text && /^admin$/i.test(message.text.trim())) {
    await submitAdminRequest(env, user);
    return;
  }

  if (await handleReplyMenuButton(env, message, user, ctx)) return;

  const state = await env.BOT_DATA.get(`state:${user.id}`);

  if (message.video || message.document) {
    if (state !== "submit") {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "sendPrompt") });
      return;
    }
    await deleteKey(env, `state:${user.id}`);
    await handleSubmittedMovie(env, message);
    return;
  }

  if (state === "request" && message.text) {
    await deleteKey(env, `state:${user.id}`);
    const item = await createMovieRequest(env, user, message.text);
    await telegram(env, "sendMessage", { chat_id: message.chat.id, text: item ? tr(user, "requestSaved") : tr(user, "requestInvalid") });
    if (item) {
      const adminId = getAdminId(env);
      if (adminId) await telegram(env, "sendMessage", { chat_id: adminId, text: `📝 درخواست جدید\n\n🎬 ${item.name}\n🔥 ${item.votes}\n👤 ${user.id}` }).catch(() => {});
    }
    return;
  }

  if (message.text === tr(user, "admin")) {
    await showAdminPanel(env, message.chat.id, user);
    return;
  }

  if (message.text) {
    await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "useMenu") });
  }
}

async function handleMovieCallback(env, callback, ctx) {
  const user = await ensureUser(env, callback.from);
  const data = callback.data;

  if (data.startsWith("movie:fav:")) {
    const parts = data.split(":");
    const action = parts[2];
    const movieId = parts[3];
    if (action === "add") {
      await addFavorite(env, user, movieId);
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "addedFavorite") });
    } else {
      await removeFavorite(env, user, movieId);
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr(user, "removedFavorite") });
    }
    return;
  }

  if (data.startsWith("movie:again:")) {
    const movie = await findMovie(env, data.split(":")[2]);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    if (movie) await sendUserMovie(env, callback.message.chat.id, movie, user, ctx);
    return;
  }

  if (data.startsWith("movie:rate:")) {
    const parts = data.split(":");
    await rateMovie(env, callback, parts[2], Number(parts[3]));
    return;
  }

  if (data.startsWith("movie:report:")) {
    const parts = data.split(":");
    if (parts.length === 3) {
      await showReportMenu(env, callback, parts[2]);
    } else {
      const reasons = { broken: tr(user, "reportBroken"), wrong: tr(user, "reportWrong"), duplicate: tr(user, "reportDuplicate"), other: tr(user, "reportOther") };
      await reportMovie(env, callback, parts[2], reasons[parts[3]] || reasons.other);
    }
    return;
  }

  if (data.startsWith("favorite:view:")) {
    const movie = await findMovie(env, data.split(":")[2]);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    if (movie) await sendUserMovie(env, callback.message.chat.id, movie, user, ctx);
    return;
  }

}

async function handleAdminCallback(env, callback) {
  const userId = String(callback.from.id);
  if (!(await isAnyAdmin(env, userId))) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr("fa", "denied"), show_alert: true });
    return;
  }
  const data = callback.data;
  const chatId = callback.message.chat.id;

  if (data === "admin:panel" || data === "admin:back") {
    const user = await ensureUser(env, callback.from);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminPanel(env, chatId, user);
    return;
  }

  if (data === "admin:announcement") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    const adminUser = await ensureUser(env, callback.from);
         const rows = [];
    for (let index = 0; index < LANGUAGE_OPTIONS.length; index += 2) {
      rows.push(LANGUAGE_OPTIONS.slice(index, index + 2).map(item => ({
        text: item.label,
        callback_data: `admin:announcement_lang:${item.code}`
      })));
    }
    await env.BOT_DATA.put(`state:${userId}`, "admin_announcement_choose_language", { expirationTtl: 600 });
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(adminUser, "announcementLanguagePrompt"),
      reply_markup: { inline_keyboard: rows }
    });
    return;
  }

  if (data.startsWith("admin:announcement_lang:")) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    const language = normalizeLanguage(data.split(":")[2]);
    const adminUser = await ensureUser(env, callback.from);
    const option = LANGUAGE_OPTIONS.find(item => item.code === language);
    await env.BOT_DATA.put(`state:${userId}`, `admin_announcement_text:${language}`, { expirationTtl: 600 });
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: `${option ? option.label : language}\n\n${tr(adminUser, "announcementPrompt")}`
    });
    return;
  }

  if (data === "admin:movies") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminMovies(env, chatId, 0);
    return;
  }

  if (data === "admin:pending") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showPendingList(env, chatId);
    return;
  }

  if (data === "admin:users") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminUsers(env, chatId, 0);
    return;
  }

  if (data === "admin:requests") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminRequests(env, chatId);
    return;
  }

  if (data === "admin:movie_requests") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    const adminUser = await ensureUser(env, callback.from);
    await showMovieRequestList(env, chatId, langOf(adminUser));
    return;
  }

  if (data === "admin:stats") {
    const stats = await getStats(env);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await telegram(env, "sendMessage", { chat_id: chatId, text: `📊 آمار\n\n👥 کاربران: ${stats.users}\n🎬 فیلم‌ها: ${stats.movies}\n📥 در انتظار: ${stats.pending}\n👁 بازدید یکتا: ${stats.views}\n⭐ امتیازها: ${stats.ratings}\n❤️ موردعلاقه‌ها: ${stats.favorites}\n🔥 فعال ۲۴ساعته: ${stats.active}\n👥 دعوت موفق: ${stats.invites}` });
    return;
  }

  if (data === "admin:backup") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    try {
      const key = await createBackup(env);
      await logAction(env, userId, "backup_created", { key });
      await telegram(env, "sendMessage", { chat_id: chatId, text: `✅ Backup created.\n${key}` });
    } catch (error) {
      console.error("Backup error:", error);
      await telegram(env, "sendMessage", { chat_id: chatId, text: "❌ Backup failed." });
    }
    return;
  }

  if (data === "admin:health") {
    const health = await healthCheck(env);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await telegram(env, "sendMessage", { chat_id: chatId, text: `🏥 Health\n\n🤖 Bot: ${health.bot ? "✅" : "❌"}\n💾 Database: ${health.database ? "✅" : "❌"}\n🗄️ Storage: ${health.storage ? "✅" : "❌"}\n🌐 Webhook: ${health.webhook ? "✅" : "❌"}\n💾 Backup: ${health.backup ? "✅" : "❌"}` });
    return;
  }

  if (data.startsWith("adminmovie:list:")) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminMovies(env, chatId, Number(data.split(":")[2] || 0));
    return;
  }

  if (data.startsWith("adminmovie:deleteask:")) {
    const parts = data.split(":");
    await askDeleteAdminMovie(env, callback, parts[2], Number(parts[3] || 0));
    return;
  }

  if (data.startsWith("adminmovie:deleteconfirm:")) {
    const parts = data.split(":");
    await confirmDeleteAdminMovie(env, callback, parts[2], Number(parts[3] || 0));
    return;
  }

  if (data.startsWith("adminmovie:view:")) {
    const parts = data.split(":");
    await showAdminMovie(env, callback, parts[2], Number(parts[3] || 0));
    return;
  }

  if (data.startsWith("adminmovie:delete:")) {
    const parts = data.split(":");
    await askDeleteAdminMovie(env, callback, parts[2], Number(parts[3] || 0));
    return;
  }

  if (data.startsWith("adminmovie:featured:")) {
    const parts = data.split(":");
    await toggleFeatured(env, parts[2]);
    await logAction(env, userId, "movie_featured_toggle", { movie_id: parts[2] });
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⭐" });
    await showAdminMovie(env, callback, parts[2], Number(parts[3] || 0));
    return;
  }

  if (data.startsWith("adminuser:list:")) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdminUsers(env, chatId, Number(data.split(":")[2] || 0));
    return;
  }

  if (data.startsWith("adminuser:view:")) {
    const parts = data.split(":");
    await showUserProfileForAdmin(env, callback, parts[2], Number(parts[3] || 0));
    return;
  }
}

async function handlePendingCallback(env, callback) {
  if (!(await isAnyAdmin(env, callback.from.id))) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: tr("fa", "denied"), show_alert: true });
    return;
  }
  const parts = callback.data.split(":");
  const action = parts[1];
  const movieId = parts[2];
  if (action === "approve") {
    const movie = await approvePending(env, movieId);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: movie ? "✅" : "❌" });
    if (movie?.user_id) {
      const targetUser = await getUser(env, movie.user_id);
      await ensureLanguageDictionary(env, targetUser.language);
      await telegram(env, "sendMessage", { chat_id: movie.user_id, text: tr(targetUser, "pendingApproved") }).catch(() => {});
    }
    await logAction(env, callback.from.id, "pending_approved", { movie_id: movieId });
    return;
  }
  if (action === "reject") {
    const movie = await rejectPending(env, movieId);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: movie ? "❌" : "❌" });
    if (movie?.user_id) {
      const targetUser = await getUser(env, movie.user_id);
      await ensureLanguageDictionary(env, targetUser.language);
      await telegram(env, "sendMessage", { chat_id: movie.user_id, text: tr(targetUser, "pendingRejected") }).catch(() => {});
    }
    await logAction(env, callback.from.id, "pending_rejected", { movie_id: movieId });
    return;
  }
  if (action === "view") {
    const list = await getPending(env);
    const movie = list.find(item => String(item.id) === String(movieId));
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    if (movie) await sendRawMovie(env, callback.message.chat.id, movie);
    return;
  }
}

async function handleRequestCallback(env, callback) {
  const user = await ensureUser(env, callback.from);
  const parts = callback.data.split(":");
  if (parts[1] !== "vote") return;
  const result = await voteMovieRequest(env, user.id, parts[2]);
  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callback.id,
    text: result.reason === "duplicate" ? tr(user, "alreadyVoted") : result.ok ? "✅" : "❌"
  });
}

async function handleCallback(env, callback, ctx) {
  const data = callback.data || "";
  try {
    if (data.startsWith("lang:")) return await handleLanguageCallback(env, callback);
    if (data === "check_membership") return await handleMembershipCallback(env, callback);
    if (data.startsWith("menu:")) {
      const handled = await handleMenuCallback(env, callback, ctx);
      if (handled) return;
    }
    if (data.startsWith("movie:")) return await handleMovieCallback(env, callback, ctx);
    if (data.startsWith("favorite:view:")) return await handleMovieCallback(env, callback, ctx);
    if (data.startsWith("request:")) return await handleRequestCallback(env, callback);
    if (data.startsWith("pending:")) return await handlePendingCallback(env, callback);
    if (data.startsWith("adminrequest:")) {
      const parts = data.split(":");
      if (parts[1] === "profile") return await showUserProfileForAdmin(env, callback, parts[2], 0);
      if (parts[1] === "approve" || parts[1] === "reject") return await reviewAdminRequest(env, callback, parts[1], parts[2]);
    }
    if (data.startsWith("admin:") || data.startsWith("adminmovie:") || data.startsWith("adminuser:")) return await handleAdminCallback(env, callback);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
  } catch (error) {
    console.error("Callback error:", error);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ Error.", show_alert: true }).catch(() => {});
  }
}

/* =========================================================
   Worker entry
========================================================= */

async function processUpdate(env, update, ctx) {
  if (update.message) await handleMessage(env, update.message, ctx);
  if (update.callback_query) await handleCallback(env, update.callback_query, ctx);
}

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "GET") return new Response("Film Bot is running.", { status: 200 });
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
      const update = await request.json();
      ctx.waitUntil(processUpdate(env, update, ctx).catch(error => console.error("Update error:", error)));
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("OK", { status: 200 });
    }
  }
};
