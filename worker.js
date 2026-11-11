const MOVIE_COOLDOWN = 10_000;
const AUTO_DELETE_TIME = 20_000;
const MOVIE_PAGE_SIZE = 1;
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
    announcementTextRequired: "أرسل الإعلان كنص. للإلغاء أرسل /cancel.",
    announcementCancelled: "✅ تم إلغاء الإعلان.",
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


// Additional labels and messages for the compact, nested menu and advertisement workflow.
const EXTRA_TEXT = {
  fa: {
    menuOpen: "📋 باز کردن منو", menuHint: "برای نمایش گزینه‌ها دکمه «📋 باز کردن منو» را بزنید.",
    closeMenu: "⚫ بستن منو", backMain: "⚫ بازگشت به منوی اصلی",
    getMovie: "دریافت فیلم", submitMovie: "ارسال فیلم", changeLanguage: "تغییر زبان",
    otherFeatures: "سایر امکانات ربات", otherFeaturesTitle: "سایر امکانات ربات",
    favorites: "علاقه‌مندی‌ها", invite: "دعوت دوستان", requestMovie: "درخواست فیلم", advertise: "تبلیغ",
    adminAdsButton: "📢 مدیریت تبلیغات", adminManageAdminsButton: "👑 مدیریت ادمین‌ها",
    adminMoviesButton: "🎬 فیلم‌ها", adminPendingButton: "📥 صف فیلم‌ها", adminUsersButton: "👥 کاربران", adminStatsButton: "📊 آمار", adminRequestsButton: "🔐 درخواست‌های ادمین", adminBackupButton: "💾 پشتیبان", adminHealthButton: "🏥 وضعیت سیستم", adminMovieRequestsButton: "📝 درخواست‌های فیلم", backButton: "🔙 بازگشت",
    movieViewsLabel: "بازدید", movieRatingLabel: "امتیاز", movieVotesLabel: "رأی", movieDefaultTitle: "فیلم",
    adminMovieEditPrompt: "✏️ متن جدیدی که باید زیر فیلم نمایش داده شود ارسال کن. برای لغو /cancel را بفرست.", adminMovieEditSaved: "✅ متن زیر فیلم با موفقیت ویرایش شد.", adminMovieEditTooLong: "❌ متن زیر فیلم باید حداکثر ۱۰۰۰ نویسه باشد.",
    welcome: "🎬 سلام {name} عزیز! به ربات فیلم خوش آمدی.",
    advertisePrompt: "📢 پیام تبلیغاتی خود را همین‌جا ارسال کنید. متن، عکس، ویدئو یا فایل قابل قبول است. پس از بررسی مدیر، در صورت تأیید برای کاربران ربات ارسال می‌شود. برای لغو /cancel را بفرستید.",
    advertiseReceived: "✅ تبلیغ شما برای بررسی مدیر ارسال شد. پس از تأیید، برای کاربران ربات منتشر می‌شود.",
    advertiseInvalid: "❌ لطفاً یک پیام متنی، عکس، ویدئو یا فایل برای تبلیغ ارسال کنید.",
    advertiseCancelled: "✅ ارسال تبلیغ لغو شد.", advertiseApproved: "✅ تبلیغ شما تأیید و برای کاربران ربات ارسال شد.", advertiseRejected: "❌ تبلیغ شما توسط مدیریت تأیید نشد.",
    adOwnerLabel: "🆔 شناسه تبلیغ‌دهنده: {id}",
    adminAdsTitle: "📢 مدیریت تبلیغات", adminAdsStats: "📊 آمار تبلیغات\n\n⏳ در انتظار: {pending}\n✅ تأییدشده: {approved}\n❌ ردشده: {rejected}\n🗑 حذف‌شده: {deleted}\n📨 مجموع ارسال موفق: {sent}\n⚠️ مجموع ارسال ناموفق: {failed}",
    adminAdsPending: "⏳ تبلیغات در انتظار", adminAdsAll: "📚 همه تبلیغات", adminAdsEmpty: "📭 تبلیغی در این بخش وجود ندارد.",
    adminAdApprove: "✅ تأیید و انتشار", adminAdReject: "❌ رد", adminAdEdit: "✏️ ویرایش", adminAdDelete: "🗑 حذف", adminAdResend: "🔄 ارسال مجدد", adminAdView: "👁 مشاهده",
    adminAdEditPrompt: "✏️ پیام جدید تبلیغ را ارسال کنید. پس از ویرایش، برای انتشار دوباره از دکمه «ارسال مجدد» استفاده کنید. برای لغو /cancel را بفرستید.",
    adminAdUpdated: "✅ محتوای تبلیغ ویرایش شد. برای انتشار نسخه جدید، «ارسال مجدد» را بزنید.", adminAdDeleted: "🗑 تبلیغ حذف شد.",
    adminAdWorking: "⏳ تبلیغ در حال ارسال است…", adminAdSent: "✅ ارسال تبلیغ تمام شد.\n📨 موفق: {success}\n❌ ناموفق: {failed}", adminAdNotFound: "❌ تبلیغ پیدا نشد.",
    adminAdminsTitle: "👑 مدیریت ادمین‌ها\n\nمالک اصلی قابل حذف نیست. برای حذف دسترسی یک ادمین، دکمه کنار نام او را بزنید.", adminAdminsEmpty: "📭 ادمین تأییدشده‌ای وجود ندارد.", adminRemoveAdmin: "🗑 حذف ادمین", adminAdminRemoved: "✅ دسترسی ادمین حذف شد.", adminOwnerOnly: "⛔ این بخش فقط برای مالک اصلی است."
  },
  en: {
    menuOpen: "📋 Open Menu", menuHint: "Tap «📋 Open Menu» to show the options.",
    closeMenu: "⚫ Close Menu", backMain: "⚫ Back to Main Menu",
         getMovie: "Get Movie", submitMovie: "Send Movie", changeLanguage: "Change Language",
    otherFeatures: "Other Features", otherFeaturesTitle: "Other Features",
    favorites: "Favorites", invite: "Invite Friends", requestMovie: "Request Movie", advertise: "Advertise",
    adminAdsButton: "📢 Advertisement Management", adminManageAdminsButton: "👑 Manage Admins",
    adminMoviesButton: "🎬 Movies", adminPendingButton: "📥 Pending queue", adminUsersButton: "👥 Users", adminStatsButton: "📊 Stats", adminRequestsButton: "🔐 Admin Requests", adminBackupButton: "💾 Backup", adminHealthButton: "🏥 Health", adminMovieRequestsButton: "📝 Movie Requests", backButton: "🔙 Back",
    movieViewsLabel: "Views", movieRatingLabel: "Rating", movieVotesLabel: "Votes", movieDefaultTitle: "Movie",
    adminMovieEditPrompt: "✏️ Send the new caption text for this movie. Send /cancel to cancel.", adminMovieEditSaved: "✅ Movie caption updated successfully.", adminMovieEditTooLong: "❌ The movie caption must be 1,000 characters or fewer.",
    welcome: "🎬 Hello {name}! Welcome to the movie bot.",
    advertisePrompt: "📢 Send your advertisement here. Text, photo, video or a file is accepted. It will be published to bot users if an admin approves it. Send /cancel to cancel.",
    advertiseReceived: "✅ Your advertisement was submitted for admin review. It will be published to bot users after approval.",
    advertiseInvalid: "❌ Please send an advertisement as text, photo, video or file.", advertiseCancelled: "✅ Advertisement submission cancelled.", advertiseApproved: "✅ Your advertisement was approved and sent to bot users.", advertiseRejected: "❌ Your advertisement was not approved by the admins.",
    adOwnerLabel: "🆔 Advertiser ID: {id}",
    adminAdsTitle: "📢 Advertisement Management", adminAdsStats: "📊 Advertisement statistics\n\n⏳ Pending: {pending}\n✅ Approved: {approved}\n❌ Rejected: {rejected}\n🗑 Deleted: {deleted}\n📨 Total successful deliveries: {sent}\n⚠️ Total failed deliveries: {failed}",
    adminAdsPending: "⏳ Pending Ads", adminAdsAll: "📚 All Ads", adminAdsEmpty: "📭 There are no ads in this section.",
    adminAdApprove: "✅ Approve & Publish", adminAdReject: "❌ Reject", adminAdEdit: "✏️ Edit", adminAdDelete: "🗑 Delete", adminAdResend: "🔄 Resend", adminAdView: "👁 View",
    adminAdEditPrompt: "✏️ Send the replacement advertisement message. After editing, use «Resend» to publish the new version. Send /cancel to cancel.",
    adminAdUpdated: "✅ Advertisement updated. Press «Resend» to publish the new version.", adminAdDeleted: "🗑 Advertisement deleted.",
    adminAdWorking: "⏳ Sending advertisement…", adminAdSent: "✅ Advertisement delivery finished.\n📨 Successful: {success}\n❌ Failed: {failed}", adminAdNotFound: "❌ Advertisement not found.",
    adminAdminsTitle: "👑 Admin Management\n\nThe owner cannot be removed. Use the button beside an admin to revoke their access.", adminAdminsEmpty: "📭 There are no approved admins.", adminRemoveAdmin: "🗑 Remove Admin", adminAdminRemoved: "✅ Admin access removed.", adminOwnerOnly: "⛔ This section is for the owner only."
  },
  ar: {
    menuOpen: "📋 فتح القائمة", menuHint: "اضغط «📋 فتح القائمة» لعرض الخيارات.", closeMenu: "⚫ إغلاق القائمة", backMain: "⚫ العودة إلى القائمة الرئيسية",
    getMovie: "الحصول على فيلم", submitMovie: "إرسال فيلم", changeLanguage: "تغيير اللغة", otherFeatures: "ميزات أخرى", otherFeaturesTitle: "ميزات أخرى",
    favorites: "المفضلة", invite: "دعوة الأصدقاء", requestMovie: "طلب فيلم", advertise: "إعلان", adminAdsButton: "📢 إدارة الإعلانات", adminManageAdminsButton: "👑 إدارة المشرفين",
    adminMoviesButton: "🎬 الأفلام", adminPendingButton: "📥 قيد المراجعة", adminUsersButton: "👥 المستخدمون", adminStatsButton: "📊 الإحصاءات", adminRequestsButton: "🔐 طلبات المشرفين", adminBackupButton: "💾 نسخة احتياطية", adminHealthButton: "🏥 حالة النظام", adminMovieRequestsButton: "📝 طلبات الأفلام", backButton: "🔙 رجوع",
    movieViewsLabel: "المشاهدات", movieRatingLabel: "التقييم", movieVotesLabel: "الأصوات", movieDefaultTitle: "فيلم",
    adminMovieEditPrompt: "✏️ أرسل النص الجديد الذي سيظهر أسفل الفيلم. للإلغاء أرسل /cancel.", adminMovieEditSaved: "✅ تم تعديل نص الفيلم بنجاح.", adminMovieEditTooLong: "❌ يجب ألا يتجاوز النص 1000 حرف.", adminRequestSent: "⏳ تم إرسال طلب الإدارة إلى المالك الرئيسي.", adminPending: "⏳ طلب الإدارة قيد المراجعة بالفعل.", alreadyAdmin: "✅ أنت مشرف بالفعل.", adminApproved: "👑 تمت الموافقة على طلب الإدارة.", adminRejected: "❌ تم رفض طلب الإدارة.", alreadyVoted: "⚠️ لقد صوّت من قبل.",
    welcome: "🎬 مرحباً {name}! أهلاً بك في بوت الأفلام.", advertisePrompt: "📢 أرسل إعلانك هنا. يُقبل النص أو الصورة أو الفيديو أو الملف. سينشر لمستخدمي البوت بعد موافقة المشرف. للإلغاء أرسل /cancel.",
    advertiseReceived: "✅ تم إرسال إعلانك للمراجعة. سينشر بعد الموافقة.", advertiseInvalid: "❌ أرسل إعلاناً كنص أو صورة أو فيديو أو ملف.", advertiseCancelled: "✅ تم إلغاء إرسال الإعلان.", advertiseApproved: "✅ تمت الموافقة على إعلانك وإرساله للمستخدمين.", advertiseRejected: "❌ لم تتم الموافقة على إعلانك.", adOwnerLabel: "🆔 معرّف المعلن: {id}",
    adminAdsTitle: "📢 إدارة الإعلانات", adminAdsStats: "📊 إحصائيات الإعلانات\n\n⏳ قيد الانتظار: {pending}\n✅ تمت الموافقة: {approved}\n❌ مرفوضة: {rejected}\n🗑 محذوفة: {deleted}\n📨 الإرسالات الناجحة: {sent}\n⚠️ الإرسالات الفاشلة: {failed}",
    adminAdsPending: "⏳ الإعلانات المعلقة", adminAdsAll: "📚 كل الإعلانات", adminAdsEmpty: "📭 لا توجد إعلانات في هذا القسم.", adminAdApprove: "✅ موافقة ونشر", adminAdReject: "❌ رفض", adminAdEdit: "✏️ تعديل", adminAdDelete: "🗑 حذف", adminAdResend: "🔄 إعادة الإرسال", adminAdView: "👁 عرض",
    adminAdEditPrompt: "✏️ أرسل رسالة الإعلان البديلة. بعد التعديل اضغط إعادة الإرسال لنشر النسخة الجديدة. للإلغاء أرسل /cancel.", adminAdUpdated: "✅ تم تعديل الإعلان. اضغط إعادة الإرسال لنشر النسخة الجديدة.", adminAdDeleted: "🗑 تم حذف الإعلان.", adminAdWorking: "⏳ جارٍ إرسال الإعلان…", adminAdSent: "✅ انتهى الإرسال.\n📨 ناجح: {success}\n❌ فاشل: {failed}", adminAdNotFound: "❌ لم يتم العثور على الإعلان.",
    adminAdminsTitle: "👑 إدارة المشرفين\n\nلا يمكن حذف المالك. استخدم الزر بجانب اسم المشرف لإلغاء صلاحياته.", adminAdminsEmpty: "📭 لا يوجد مشرفون معتمدون.", adminRemoveAdmin: "🗑 إزالة المشرف", adminAdminRemoved: "✅ تمت إزالة صلاحية المشرف.", adminOwnerOnly: "⛔ هذا القسم للمالك فقط."
  },
  tr: {
    menuOpen: "📋 Menüyü Aç", menuHint: "Seçenekleri görmek için «📋 Menüyü Aç» düğmesine bas.", closeMenu: "⚫ Menüyü Kapat", backMain: "⚫ Ana Menüye Dön",
    getMovie: "Film Al", submitMovie: "Film Gönder", changeLanguage: "Dili Değiştir", otherFeatures: "Diğer Özellikler", otherFeaturesTitle: "Diğer Özellikler",
    favorites: "Favoriler", invite: "Arkadaşlarını Davet Et", requestMovie: "Film İste", advertise: "Reklam", adminAdsButton: "📢 Reklamları Yönet", adminManageAdminsButton: "👑 Adminleri Yönet",
    adminMoviesButton: "🎬 Filmler", adminPendingButton: "📥 Bekleyenler", adminUsersButton: "👥 Kullanıcılar", adminStatsButton: "📊 İstatistikler", adminRequestsButton: "🔐 Yönetici İstekleri", adminBackupButton: "💾 Yedek", adminHealthButton: "🏥 Sistem Durumu", adminMovieRequestsButton: "📝 Film İstekleri", backButton: "🔙 Geri",
    movieViewsLabel: "Görüntüleme", movieRatingLabel: "Puan", movieVotesLabel: "Oy", movieDefaultTitle: "Film",
    adminMovieEditPrompt: "✏️ Filmin altında görünecek yeni açıklamayı gönder. İptal için /cancel gönder.", adminMovieEditSaved: "✅ Film açıklaması güncellendi.", adminMovieEditTooLong: "❌ Film açıklaması en fazla 1000 karakter olmalı.", adminRequestSent: "⏳ Yönetici isteğin ana sahibine gönderildi.", adminPending: "⏳ Yönetici isteğin zaten inceleniyor.", alreadyAdmin: "✅ Zaten yöneticisin.", adminApproved: "👑 Yönetici isteğin onaylandı.", adminRejected: "❌ Yönetici isteğin reddedildi.", alreadyVoted: "⚠️ Zaten oy kullandın.",
    welcome: "🎬 Merhaba {name}! Film botuna hoş geldin.", advertisePrompt: "📢 Reklamını buraya gönder. Metin, fotoğraf, video veya dosya kabul edilir. Yönetici onaylarsa bot kullanıcılarına yayınlanır. İptal için /cancel gönder.",
    advertiseReceived: "✅ Reklamın yönetici incelemesine gönderildi. Onaylanırsa yayınlanacak.", advertiseInvalid: "❌ Lütfen reklamını metin, fotoğraf, video veya dosya olarak gönder.", advertiseCancelled: "✅ Reklam gönderimi iptal edildi.", advertiseApproved: "✅ Reklamın onaylandı ve bot kullanıcılarına gönderildi.", advertiseRejected: "❌ Reklamın yönetici tarafından onaylanmadı.", adOwnerLabel: "🆔 Reklamveren ID: {id}",
    adminAdsTitle: "📢 Reklam Yönetimi", adminAdsStats: "📊 Reklam istatistikleri\n\n⏳ Bekleyen: {pending}\n✅ Onaylanan: {approved}\n❌ Reddedilen: {rejected}\n🗑 Silinen: {deleted}\n📨 Başarılı gönderimler: {sent}\n⚠️ Başarısız gönderimler: {failed}",
    adminAdsPending: "⏳ Bekleyen Reklamlar", adminAdsAll: "📚 Tüm Reklamlar", adminAdsEmpty: "📭 Bu bölümde reklam yok.", adminAdApprove: "✅ Onayla ve Yayınla", adminAdReject: "❌ Reddet", adminAdEdit: "✏️ Düzenle", adminAdDelete: "🗑 Sil", adminAdResend: "🔄 Yeniden Gönder", adminAdView: "👁 Görüntüle",
    adminAdEditPrompt: "✏️ Yeni reklam mesajını gönder. Düzenledikten sonra yayınlamak için Yeniden Gönder'e bas. İptal için /cancel gönder.", adminAdUpdated: "✅ Reklam düzenlendi. Yeni sürümü yayınlamak için Yeniden Gönder'e bas.", adminAdDeleted: "🗑 Reklam silindi.", adminAdWorking: "⏳ Reklam gönderiliyor…", adminAdSent: "✅ Reklam gönderimi tamamlandı.\n📨 Başarılı: {success}\n❌ Başarısız: {failed}", adminAdNotFound: "❌ Reklam bulunamadı.",
    adminAdminsTitle: "👑 Admin Yönetimi\n\nSahip kaldırılamaz. Yetkisini kaldırmak için adminin yanındaki düğmeye bas.", adminAdminsEmpty: "📭 Onaylanmış admin yok.", adminRemoveAdmin: "🗑 Admini Kaldır", adminAdminRemoved: "✅ Admin yetkisi kaldırıldı.", adminOwnerOnly: "⛔ Bu bölüm yalnızca sahibine açıktır."
  },
  ru: {
    menuOpen: "📋 Открыть меню", menuHint: "Нажмите «📋 Открыть меню», чтобы увидеть варианты.", closeMenu: "⚫ Закрыть меню", backMain: "⚫ В главное меню",
    getMovie: "Получить фильм", submitMovie: "Отправить фильм", changeLanguage: "Изменить язык", otherFeatures: "Другие функции", otherFeaturesTitle: "Другие функции",
    favorites: "Избранное", invite: "Пригласить друзей", requestMovie: "Запросить фильм", advertise: "Реклама", adminAdsButton: "📢 Управление рекламой", adminManageAdminsButton: "👑 Управление админами",
    adminMoviesButton: "🎬 Фильмы", adminPendingButton: "📥 Ожидают", adminUsersButton: "👥 Пользователи", adminStatsButton: "📊 Статистика", adminRequestsButton: "🔐 Запросы админов", adminBackupButton: "💾 Резервная копия", adminHealthButton: "🏥 Состояние", adminMovieRequestsButton: "📝 Запросы фильмов", backButton: "🔙 Назад",
    movieViewsLabel: "Просмотры", movieRatingLabel: "Оценка", movieVotesLabel: "Голоса", movieDefaultTitle: "Фильм",
    adminMovieEditPrompt: "✏️ Отправьте новый текст подписи под фильмом. Для отмены отправьте /cancel.", adminMovieEditSaved: "✅ Подпись фильма обновлена.", adminMovieEditTooLong: "❌ Подпись фильма должна содержать не более 1000 символов.", adminRequestSent: "⏳ Запрос администратора отправлен владельцу.", adminPending: "⏳ Ваш запрос администратора уже рассматривается.", alreadyAdmin: "✅ Вы уже администратор.", adminApproved: "👑 Ваш запрос администратора одобрен.", adminRejected: "❌ Ваш запрос администратора отклонён.", alreadyVoted: "⚠️ Вы уже голосовали.",
    welcome: "🎬 Здравствуйте, {name}! Добро пожаловать в кинобот.", advertisePrompt: "📢 Отправьте сюда рекламу. Можно отправить текст, фото, видео или файл. После одобрения администратором реклама будет опубликована для пользователей бота. Для отмены отправьте /cancel.",
    advertiseReceived: "✅ Реклама отправлена на проверку. После одобрения она будет опубликована.", advertiseInvalid: "❌ Отправьте рекламу текстом, фото, видео или файлом.", advertiseCancelled: "✅ Отправка рекламы отменена.", advertiseApproved: "✅ Ваша реклама одобрена и отправлена пользователям бота.", advertiseRejected: "❌ Ваша реклама не была одобрена.", adOwnerLabel: "🆔 ID рекламодателя: {id}",
    adminAdsTitle: "📢 Управление рекламой", adminAdsStats: "📊 Статистика рекламы\n\n⏳ Ожидают: {pending}\n✅ Одобрено: {approved}\n❌ Отклонено: {rejected}\n🗑 Удалено: {deleted}\n📨 Успешные отправки: {sent}\n⚠️ Неудачные отправки: {failed}",
    adminAdsPending: "⏳ Ожидающая реклама", adminAdsAll: "📚 Вся реклама", adminAdsEmpty: "📭 В этом разделе нет рекламы.", adminAdApprove: "✅ Одобрить и опубликовать", adminAdReject: "❌ Отклонить", adminAdEdit: "✏️ Изменить", adminAdDelete: "🗑 Удалить", adminAdResend: "🔄 Отправить снова", adminAdView: "👁 Просмотр",
    adminAdEditPrompt: "✏️ Отправьте новое рекламное сообщение. После изменения нажмите «Отправить снова», чтобы опубликовать новую версию. Для отмены отправьте /cancel.", adminAdUpdated: "✅ Реклама изменена. Нажмите «Отправить снова», чтобы опубликовать новую версию.", adminAdDeleted: "🗑 Реклама удалена.", adminAdWorking: "⏳ Отправка рекламы…", adminAdSent: "✅ Отправка завершена.\n📨 Успешно: {success}\n❌ Ошибки: {failed}", adminAdNotFound: "❌ Реклама не найдена.",
    adminAdminsTitle: "👑 Управление администраторами\n\nВладельца удалить нельзя. Нажмите кнопку рядом с администратором, чтобы отозвать доступ.", adminAdminsEmpty: "📭 Нет одобренных администраторов.", adminRemoveAdmin: "🗑 Удалить администратора", adminAdminRemoved: "✅ Доступ администратора удалён.", adminOwnerOnly: "⛔ Этот раздел доступен только владельцу."
  },
  es: {
    menuOpen: "📋 Abrir menú", menuHint: "Pulsa «📋 Abrir menú» para ver las opciones.", closeMenu: "⚫ Cerrar menú", backMain: "⚫ Volver al menú principal",
    getMovie: "Obtener película", submitMovie: "Enviar película", changeLanguage: "Cambiar idioma", otherFeatures: "Otras funciones", otherFeaturesTitle: "Otras funciones",
    favorites: "Favoritos", invite: "Invitar amigos", requestMovie: "Solicitar película", advertise: "Anunciar", adminAdsButton: "📢 Gestionar anuncios", adminManageAdminsButton: "👑 Gestionar administradores",
    adminMoviesButton: "🎬 Películas", adminPendingButton: "📥 Pendientes", adminUsersButton: "👥 Usuarios", adminStatsButton: "📊 Estadísticas", adminRequestsButton: "🔐 Solicitudes de admin", adminBackupButton: "💾 Copia de seguridad", adminHealthButton: "🏥 Estado del sistema", adminMovieRequestsButton: "📝 Solicitudes de películas", backButton: "🔙 Volver",
    movieViewsLabel: "Vistas", movieRatingLabel: "Valoración", movieVotesLabel: "Votos", movieDefaultTitle: "Película",
    adminMovieEditPrompt: "✏️ Envía el nuevo texto que aparecerá debajo de la película. Envía /cancel para cancelar.", adminMovieEditSaved: "✅ Texto de la película actualizado.", adminMovieEditTooLong: "❌ El texto de la película debe tener 1000 caracteres o menos.", adminRequestSent: "⏳ Tu solicitud de administrador se envió al propietario.", adminPending: "⏳ Tu solicitud de administrador ya está pendiente.", alreadyAdmin: "✅ Ya eres administrador.", adminApproved: "👑 Tu solicitud de administrador fue aprobada.", adminRejected: "❌ Tu solicitud de administrador fue rechazada.", alreadyVoted: "⚠️ Ya has votado.",
    welcome: "🎬 ¡Hola {name}! Bienvenido al bot de películas.", advertisePrompt: "📢 Envía aquí tu anuncio. Se acepta texto, foto, vídeo o archivo. Si un administrador lo aprueba, se publicará a los usuarios del bot. Envía /cancel para cancelar.",
    advertiseReceived: "✅ Tu anuncio se envió para revisión. Se publicará cuando sea aprobado.", advertiseInvalid: "❌ Envía un anuncio como texto, foto, vídeo o archivo.", advertiseCancelled: "✅ Envío del anuncio cancelado.", advertiseApproved: "✅ Tu anuncio fue aprobado y enviado a los usuarios del bot.", advertiseRejected: "❌ Tu anuncio no fue aprobado por la administración.", adOwnerLabel: "🆔 ID del anunciante: {id}",
    adminAdsTitle: "📢 Gestión de anuncios", adminAdsStats: "📊 Estadísticas de anuncios\n\n⏳ Pendientes: {pending}\n✅ Aprobados: {approved}\n❌ Rechazados: {rejected}\n🗑 Eliminados: {deleted}\n📨 Envíos correctos: {sent}\n⚠️ Envíos fallidos: {failed}",
    adminAdsPending: "⏳ Anuncios pendientes", adminAdsAll: "📚 Todos los anuncios", adminAdsEmpty: "📭 No hay anuncios en esta sección.", adminAdApprove: "✅ Aprobar y publicar", adminAdReject: "❌ Rechazar", adminAdEdit: "✏️ Editar", adminAdDelete: "🗑 Eliminar", adminAdResend: "🔄 Reenviar", adminAdView: "👁 Ver",
    adminAdEditPrompt: "✏️ Envía el nuevo mensaje del anuncio. Después de editarlo, pulsa «Reenviar» para publicar la nueva versión. Envía /cancel para cancelar.", adminAdUpdated: "✅ Anuncio editado. Pulsa «Reenviar» para publicar la nueva versión.", adminAdDeleted: "🗑 Anuncio eliminado.", adminAdWorking: "⏳ Enviando anuncio…", adminAdSent: "✅ Envío finalizado.\n📨 Correctos: {success}\n❌ Fallidos: {failed}", adminAdNotFound: "❌ No se encontró el anuncio.",
    adminAdminsTitle: "👑 Gestión de administradores\n\nEl propietario no se puede eliminar. Usa el botón junto al administrador para quitar su acceso.", adminAdminsEmpty: "📭 No hay administradores aprobados.", adminRemoveAdmin: "🗑 Eliminar administrador", adminAdminRemoved: "✅ Se eliminó el acceso de administrador.", adminOwnerOnly: "⛔ Esta sección es solo para el propietario."
  }
};
for (const [language, values] of Object.entries(EXTRA_TEXT)) Object.assign(TEXT[language], values);

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
    keyboard: [[{ text: tr(language, "menuOpen") }]],
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true
  };
}

// Main menu: exactly four feature entries; the final button hides the menu.
function expandedMenu(language) {
  return {
    keyboard: [
      [
        { text: tr(language, "getMovie") },
        { text: tr(language, "submitMovie") }
      ],
      [
        { text: tr(language, "changeLanguage") },
        { text: tr(language, "otherFeatures") }
      ],
      [{ text: tr(language, "closeMenu") }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
    is_persistent: true
  };
}

function otherFeaturesMenu(language, isAdmin = false) {
  const rows = [
    [
      { text: tr(language, "favorites") },
      { text: tr(language, "invite") }
    ],
    [
      { text: tr(language, "requestMovie") },
      { text: tr(language, "advertise") }
    ]
  ];
  if (isAdmin) rows.push([{ text: tr(language, "admin") }]);
  rows.push([{ text: tr(language, "backMain") }]);
  return { keyboard: rows, resize_keyboard: false, one_time_keyboard: false, is_persistent: true };
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

async function sendWelcomeIfNeeded(env, chatId, user) {
  if (user.welcome_sent_at) return;
  const name = String(user.first_name || (langOf(user) === "fa" ? "دوست" : "Friend"))
    .replace(/[\r\n]+/g, " ").slice(0, 80);
  const result = await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: replaceText(tr(user, "welcome"), { name })
  });
  if (result?.ok) {
    user.welcome_sent_at = now();
    await saveUser(env, user);
  }
}

async function sendMainMenu(env, chatId, user) {
  const language = langOf(user);
  const admin = await isAnyAdmin(env, user.id);
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: tr(user, "menuHint"),
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
    text: "🌐 Please choose your language:",
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
  const country = movieCountry(movie, user);
  const id = movie.movie_code || movie.id;
  const originalBase = cleanMovieCaptionBase(movie.caption);
  const base = originalBase || `🎬 ${tr(user, "movieDefaultTitle")}`;
  const tail = [
    "",
    "",
    `👁 ${tr(user, "movieViewsLabel")}: ${Number(movie.views || 0)}`,
    `⭐ ${tr(user, "movieRatingLabel")}: ${info.average ? info.average.toFixed(1) : "0.0"}/5`,
    `👥 ${tr(user, "movieVotesLabel")}: ${info.count}`,
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
    await env.BOT_DATA.put(cooldownKey, String(now()), { expirationTtl: 60 });
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
      [{ text: "✏️ ادیت", callback_data: `adminmovie:edit:${movie.id}:${page}` }],
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
  const targetLanguage = langOf(user);
  const targetLanguageNameFa = ({
    fa: "فارسی", en: "انگلیسی", ar: "عربی", tr: "ترکی", ru: "روسی", es: "اسپانیایی"
  })[targetLanguage] || targetLanguage;
  const targetLanguageNameEn = ({
    fa: "Persian", en: "English", ar: "Arabic", tr: "Turkish", ru: "Russian", es: "Spanish"
  })[targetLanguage] || targetLanguage;
  const text = language === "fa"
    ? [
        "👤 پروفایل کاربر", "",
        `👤 نام: ${user.first_name || "-"}`,
        `🔖 یوزرنیم: ${user.username ? `@${user.username}` : "-"}`,
        `🆔 ID: ${user.id}`,
        `🌐 زبان: ${targetLanguageNameFa}`,
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
        `🌐 Language: ${targetLanguageNameEn}`,
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
    approved_admins: await approvedAdmins(env),
    advertisements: await getAdvertisements(env)
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
         [
      { text: tr(user, "adminBackupButton"), callback_data: "admin:backup" },
      { text: tr(user, "adminHealthButton"), callback_data: "admin:health" }
    ],
    [{ text: tr(user, "adminMovieRequestsButton"), callback_data: "admin:movie_requests" }],
    [{ text: tr(user, "adminAdsButton"), callback_data: "admin:ads" }],
    [{ text: tr(user, "announcementButton"), callback_data: "admin:announcement" }]
  ];
  if (isMainAdmin(env, user.id)) {
    buttons.splice(2, 0, [{ text: tr(user, "adminRequestsButton"), callback_data: "admin:requests" }]);
    buttons.push([{ text: tr(user, "adminManageAdminsButton"), callback_data: "admin:manage_admins" }]);
  }
  buttons.push([{ text: tr(user, "backButton"), callback_data: "menu:open" }]);
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
   User advertisements / moderation / delivery
========================================================= */

async function getAdvertisements(env) {
  const items = await getJSON(env, "advertisements", []);
  return Array.isArray(items) ? items : [];
}

async function saveAdvertisements(env, items) {
  await putJSON(env, "advertisements", items);
}

async function findAdvertisement(env, adId) {
  const ads = await getAdvertisements(env);
  return ads.find(item => String(item.id) === String(adId)) || null;
}

function isCopyableAdvertisementMessage(message) {
  if (!message || !message.message_id || !message.chat?.id) return false;
  return Boolean(
    message.text || message.caption || message.photo || message.video || message.document ||
    message.animation || message.audio || message.voice || message.video_note || message.sticker ||
    message.contact || message.location || message.venue || message.poll || message.game
  );
}

function advertisementControls(ad, language = "fa") {
  const rows = [];
  if (ad.status === "pending") {
    rows.push([{ text: tr(language, "adminAdApprove"), callback_data: `ad:approve:${ad.id}` }]);
    rows.push([{ text: tr(language, "adminAdReject"), callback_data: `ad:reject:${ad.id}` }]);
  }
  if (ad.status !== "deleted") {
    rows.push([{ text: tr(language, "adminAdEdit"), callback_data: `ad:edit:${ad.id}` }]);
    if (ad.status === "approved") rows.push([{ text: tr(language, "adminAdResend"), callback_data: `ad:resend:${ad.id}` }]);
    rows.push([{ text: tr(language, "adminAdDelete"), callback_data: `ad:delete:${ad.id}` }]);
  }
  rows.push([{ text: tr(language, "backButton"), callback_data: "ad:list:all:0" }]);
  return { inline_keyboard: rows };
}

async function submitAdvertisement(env, message, user) {
  const ad = {
    id: randomId(),
    user_id: String(user.id),
    advertiser_username: user.username ? String(user.username) : null,
    advertiser_name: String(user.first_name || ""),
    source_chat_id: message.chat.id,
    source_message_id: message.message_id,
    status: "pending",
    created_at: now(),
    approved_at: null,
    rejected_at: null,
    edited_at: null,
    last_sent_at: null,
    send_success_count: 0,
    send_failed_count: 0,
    broadcast_count: 0,
    resend_count: 0
  };
  const ads = await getAdvertisements(env);
  ads.push(ad);
  await saveAdvertisements(env, ads);

  const ownerId = getAdminId(env);
  if (ownerId) {
    const admin = await getUser(env, ownerId);
    const source = await telegram(env, "copyMessage", {
      chat_id: ownerId,
      from_chat_id: message.chat.id,
      message_id: message.message_id,
      reply_markup: advertisementControls(ad, langOf(admin))
    }).catch(() => ({ ok: false }));
    if (!source?.ok) {
      await telegram(env, "sendMessage", {
        chat_id: ownerId,
        text: `📢 تبلیغ جدید برای بررسی\n\n🆔 شناسه تبلیغ: ${ad.id}\n👤 فرستنده: ${ad.advertiser_username ? `@${ad.advertiser_username}` : ad.user_id}`,
        reply_markup: advertisementControls(ad, langOf(admin))
      }).catch(() => {});
    } else {
      const advertiserId = ad.advertiser_username ? `@${ad.advertiser_username}` : String(ad.user_id);
      await telegram(env, "sendMessage", {
        chat_id: ownerId,
        text: `🆔 شناسه تبلیغ‌دهنده: ${advertiserId}\nشناسه داخلی تبلیغ: ${ad.id}`
      }).catch(() => {});
    }
  }

  await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "advertiseReceived") });
  await logAction(env, user.id, "advertisement_submitted", { advertisement_id: ad.id });
}

async function sendAdvertisementToUser(env, ad, user) {
  const copied = await telegram(env, "copyMessage", {
    chat_id: user.id,
    from_chat_id: ad.source_chat_id,
    message_id: ad.source_message_id
  });
  if (!copied?.ok) return false;
  const identifier = ad.advertiser_username ? `@${String(ad.advertiser_username).replace(/^@/, "")}` : String(ad.user_id);
  const label = replaceText(tr(user, "adOwnerLabel"), { id: identifier });
  const idMessage = await telegram(env, "sendMessage", { chat_id: user.id, text: label }).catch(() => ({ ok: false }));
  return Boolean(idMessage?.ok);
}

async function broadcastAdvertisement(env, adId, adminChatId, adminUser) {
  const ad = await findAdvertisement(env, adId);
  if (!ad || ad.status !== "approved") {
    await telegram(env, "sendMessage", { chat_id: adminChatId, text: tr(adminUser, "adminAdNotFound") }).catch(() => {});
    return;
  }
  await telegram(env, "sendMessage", { chat_id: adminChatId, text: tr(adminUser, "adminAdWorking") }).catch(() => {});
  const recipients = (await getAllUsers(env)).filter(user => user?.id && !user.blocked && user.notifications !== false);
  let success = 0;
  let failed = 0;
  const batchSize = 5;
  for (let index = 0; index < recipients.length; index += batchSize) {
    const batch = recipients.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(async target => {
      try {
        return await sendAdvertisementToUser(env, ad, target);
      } catch (error) {
        console.error("Advertisement delivery failed:", target.id, error?.message || error);
        return false;
      }
    }));
    for (const result of results) result ? success++ : failed++;
  }

  const ads = await getAdvertisements(env);
  const current = ads.find(item => String(item.id) === String(adId));
  if (current) {
    current.last_sent_at = now();
    current.send_success_count = Number(current.send_success_count || 0) + success;
    current.send_failed_count = Number(current.send_failed_count || 0) + failed;
    current.broadcast_count = Number(current.broadcast_count || 0) + 1;
    await saveAdvertisements(env, ads);
  }
  await telegram(env, "sendMessage", {
    chat_id: adminChatId,
    text: replaceText(tr(adminUser, "adminAdSent"), { success, failed })
  }).catch(() => {});
  await logAction(env, adminUser.id, "advertisement_broadcast", { advertisement_id: adId, success, failed });
}

async function showAdvertisementManagement(env, chatId, adminUser) {
  const ads = await getAdvertisements(env);
  const active = ads.filter(ad => ad.status !== "deleted");
  const stats = {
    pending: active.filter(ad => ad.status === "pending").length,
    approved: active.filter(ad => ad.status === "approved").length,
    rejected: active.filter(ad => ad.status === "rejected").length,
    deleted: ads.filter(ad => ad.status === "deleted").length,
    sent: ads.reduce((sum, ad) => sum + Number(ad.send_success_count || 0), 0),
    failed: ads.reduce((sum, ad) => sum + Number(ad.send_failed_count || 0), 0)
  };
  const text = `${tr(adminUser, "adminAdsTitle")}\n\n${replaceText(tr(adminUser, "adminAdsStats"), stats)}`;
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          { text: tr(adminUser, "adminAdsPending"), callback_data: "ad:list:pending:0" },
          { text: tr(adminUser, "adminAdsAll"), callback_data: "ad:list:all:0" }
        ],
        [{ text: tr(adminUser, "backButton"), callback_data: "admin:panel" }]
      ]
    }
  });
}

async function showAdvertisementList(env, chatId, language, filter = "all", page = 0) {
  const all = await getAdvertisements(env);
  const filtered = all.filter(ad => {
    if (filter === "pending") return ad.status === "pending";
    return true;
  }).sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
  if (!filtered.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(language, "adminAdsEmpty"),
      reply_markup: { inline_keyboard: [[{ text: tr(language, "backButton"), callback_data: "admin:ads" }]] }
    });
    return;
  }
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.max(0, Math.min(Number(page) || 0, totalPages - 1));
  const current = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);
  for (const ad of current) {
    const advertiser = ad.advertiser_username ? `@${ad.advertiser_username}` : String(ad.user_id);
    const summary = `📢 ${ad.status}\n🆔 ${ad.id}\n👤 ${advertiser}\n📅 ${new Date(ad.created_at).toLocaleString("en-GB")}\n📨 ${ad.send_success_count || 0} / ⚠️ ${ad.send_failed_count || 0}`;
    const rows = [[{ text: tr(language, "adminAdView"), callback_data: `ad:detail:${ad.id}` }]];
    if (ad.status === "pending") rows.push([
      { text: tr(language, "adminAdApprove"), callback_data: `ad:approve:${ad.id}` },
      { text: tr(language, "adminAdReject"), callback_data: `ad:reject:${ad.id}` }
    ]);
    if (ad.status !== "deleted") {
      rows.push([{ text: tr(language, "adminAdEdit"), callback_data: `ad:edit:${ad.id}` }]);
      if (ad.status === "approved") rows.push([{ text: tr(language, "adminAdResend"), callback_data: `ad:resend:${ad.id}` }]);
      rows.push([{ text: tr(language, "adminAdDelete"), callback_data: `ad:delete:${ad.id}` }]);
    }
    await telegram(env, "sendMessage", { chat_id: chatId, text: summary, reply_markup: { inline_keyboard: rows } });
  }
  const nav = [];
  if (safePage > 0) nav.push({ text: "⬅️", callback_data: `ad:list:${filter}:${safePage - 1}` });
  if (safePage < totalPages - 1) nav.push({ text: "➡️", callback_data: `ad:list:${filter}:${safePage + 1}` });
  nav.push({ text: tr(language, "backButton"), callback_data: "admin:ads" });
  await telegram(env, "sendMessage", { chat_id: chatId, text: `${safePage + 1}/${totalPages}`, reply_markup: { inline_keyboard: [nav] } });
}

async function showAdvertisementDetail(env, callback, ad) {
  const language = langOf(await ensureUser(env, callback.from));
  const copied = await telegram(env, "copyMessage", {
    chat_id: callback.message.chat.id,
    from_chat_id: ad.source_chat_id,
    message_id: ad.source_message_id,
    reply_markup: advertisementControls(ad, language)
  }).catch(() => ({ ok: false }));
  const advertiser = ad.advertiser_username ? `@${ad.advertiser_username}` : String(ad.user_id);
     await telegram(env, "sendMessage", {
    chat_id: callback.message.chat.id,
    text: `📢 ${ad.status}\n🆔 ${ad.id}\n👤 ${advertiser}\n📨 ${ad.send_success_count || 0} / ⚠️ ${ad.send_failed_count || 0}${copied?.ok ? "" : "\n⚠️ پیام اصلی قابل کپی نیست؛ از فهرست مدیریت استفاده کن."}`,
    reply_markup: advertisementControls(ad, language)
  });
}

async function handleAdCallback(env, callback, ctx) {
  const adminId = String(callback.from.id);
  if (!(await isAnyAdmin(env, adminId))) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⛔", show_alert: true });
    return;
  }
  const parts = String(callback.data || "").split(":");
  const action = parts[1];
  if (action === "list") {
    const admin = await ensureUser(env, callback.from);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdvertisementList(env, callback.message.chat.id, langOf(admin), parts[2] || "all", Number(parts[3] || 0));
    return;
  }
  const adId = parts[2];
  const ad = await findAdvertisement(env, adId);
  if (!ad) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌", show_alert: true });
    return;
  }
  const admin = await ensureUser(env, callback.from);
  if (action === "detail") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await showAdvertisementDetail(env, callback, ad);
    return;
  }
  if (action === "approve") {
    if (ad.status !== "pending") {
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⚠️", show_alert: true });
      return;
    }
    const ads = await getAdvertisements(env);
    const current = ads.find(item => String(item.id) === String(adId));
    current.status = "approved";
    current.approved_at = now();
    current.approved_by = adminId;
    await saveAdvertisements(env, ads);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "✅ Approved" });
    const advertiser = await getUser(env, ad.user_id);
    await telegram(env, "sendMessage", { chat_id: ad.user_id, text: tr(advertiser, "advertiseApproved") }).catch(() => {});
    await logAction(env, adminId, "advertisement_approved", { advertisement_id: adId });
    const task = broadcastAdvertisement(env, adId, callback.message.chat.id, admin);
    if (ctx?.waitUntil) ctx.waitUntil(task);
    else await task;
    return;
  }
  if (action === "reject") {
    const ads = await getAdvertisements(env);
    const current = ads.find(item => String(item.id) === String(adId));
    current.status = "rejected";
    current.rejected_at = now();
    current.rejected_by = adminId;
    await saveAdvertisements(env, ads);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ Rejected" });
    const advertiser = await getUser(env, ad.user_id);
    await telegram(env, "sendMessage", { chat_id: ad.user_id, text: tr(advertiser, "advertiseRejected") }).catch(() => {});
    await logAction(env, adminId, "advertisement_rejected", { advertisement_id: adId });
    return;
  }
  if (action === "edit") {
    await env.BOT_DATA.put(`state:${adminId}`, `admin_ad_edit:${adId}`, { expirationTtl: 600 });
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    await telegram(env, "sendMessage", { chat_id: callback.message.chat.id, text: tr(admin, "adminAdEditPrompt") });
    return;
  }
  if (action === "delete") {
    const ads = await getAdvertisements(env);
    const current = ads.find(item => String(item.id) === String(adId));
    current.status = "deleted";
    current.deleted_at = now();
    current.deleted_by = adminId;
    await saveAdvertisements(env, ads);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "🗑" });
    await telegram(env, "sendMessage", { chat_id: callback.message.chat.id, text: tr(admin, "adminAdDeleted") });
    await logAction(env, adminId, "advertisement_deleted", { advertisement_id: adId });
    return;
  }
  if (action === "resend") {
    if (ad.status !== "approved") {
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⚠️", show_alert: true });
      return;
    }
    const ads = await getAdvertisements(env);
    const current = ads.find(item => String(item.id) === String(adId));
    current.resend_count = Number(current.resend_count || 0) + 1;
    await saveAdvertisements(env, ads);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "🔄" });
    const task = broadcastAdvertisement(env, adId, callback.message.chat.id, admin);
    if (ctx?.waitUntil) ctx.waitUntil(task);
    else await task;
    return;
  }
}

/* =========================================================
   Owner-only admin management
========================================================= */

async function showAdminManagement(env, chatId) {
  const owner = await getUser(env, chatId);
  const admins = await approvedAdmins(env);
  if (!admins.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(owner, "adminAdminsEmpty"), reply_markup: { inline_keyboard: [[{ text: tr(owner, "backButton"), callback_data: "admin:panel" }]] } });
    return;
  }
  const rows = [];
  for (const id of admins) {
    const user = await getUser(env, id);
    const label = user.username ? `@${user.username}` : (user.first_name || id);
    rows.push([{ text: `🗑 ${String(label).slice(0, 40)} (${id})`, callback_data: `admin:remove_admin:${id}` }]);
  }
  rows.push([{ text: tr(owner, "backButton"), callback_data: "admin:panel" }]);
  await telegram(env, "sendMessage", { chat_id: chatId, text: tr(owner, "adminAdminsTitle"), reply_markup: { inline_keyboard: rows } });
}

async function removeApprovedAdmin(env, callback, targetId) {
  if (!isMainAdmin(env, callback.from.id)) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⛔", show_alert: true });
    return;
  }
  if (String(targetId) === getAdminId(env)) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ مالک قابل حذف نیست.", show_alert: true });
    return;
  }
  const admins = await approvedAdmins(env);
  const remaining = admins.filter(id => id !== String(targetId));
  if (remaining.length === admins.length) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "ادمین پیدا نشد.", show_alert: true });
    return;
  }
  await putJSON(env, "admin:approved", remaining);
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "✅" });
  const target = await getUser(env, targetId);
  await telegram(env, "sendMessage", { chat_id: targetId, text: tr(target, "adminAdminRemoved") }).catch(() => {});
  await logAction(env, callback.from.id, "admin_removed", { target: String(targetId) });
  await showAdminManagement(env, callback.message.chat.id);
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
  await sendWelcomeIfNeeded(env, message.chat.id, user);
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
  await sendWelcomeIfNeeded(env, callback.message.chat.id, user);
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
  await sendWelcomeIfNeeded(env, callback.message.chat.id, user);
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
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuTitle"),
      reply_markup: expandedMenu(language)
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

  if ([tr(user, "menuOpen"), "📋 باز کردن منو", "📋 Open Menu"].includes(text)) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuTitle"),
      reply_markup: expandedMenu(language)
    });
    return true;
  }

  if ([tr(user, "closeMenu"), "⚫ بستن منو", "⚫ Close Menu"].includes(text)) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuClosed"),
      reply_markup: bottomMenu(language)
    });
    return true;
  }

  if ([tr(user, "backMain"), "⚫ بازگشت به منوی اصلی", "⚫ Back to Main Menu"].includes(text)) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "menuTitle"),
      reply_markup: expandedMenu(language)
    });
    return true;
  }

  if ([tr(user, "otherFeatures"), tr(user, "otherFeaturesTitle")].includes(text)) {
    const admin = await isAnyAdmin(env, user.id);
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: tr(user, "otherFeaturesTitle"),
      reply_markup: otherFeaturesMenu(language, admin)
    });
    return true;
  }

  const actions = new Map([
    [tr(user, "getMovie"), "get"],
    [tr(user, "submitMovie"), "submit"],
    [tr(user, "changeLanguage"), "language"],
    [tr(user, "favorites"), "favorites"],
    [tr(user, "invite"), "invite"],
    [tr(user, "requestMovie"), "request"],
    [tr(user, "advertise"), "advertise"],
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

  await deleteKey(env, `state:${user.id}`);
  if (action === "get") {
    await getMovieForUser(env, chatId, user, ctx);
  } else if (action === "submit") {
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
  } else if (action === "advertise") {
    await env.BOT_DATA.put(`state:${user.id}`, "advertisement_submit", { expirationTtl: 1800 });
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(user, "advertisePrompt") });
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

  if (typeof activeState === "string" && activeState.startsWith("admin_movie_edit:")) {
    if (!(await isAnyAdmin(env, user.id))) {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "denied") });
      return;
    }
    if (message.text?.trim() === "/cancel") {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: "✅ لغو شد." });
      return;
    }
    const newCaption = String(message.text || "").trim();
    if (!newCaption) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "adminMovieEditPrompt") });
      return;
    }
    if (newCaption.length > 1000) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "adminMovieEditTooLong") });
      return;
    }
    const movieId = activeState.slice("admin_movie_edit:".length);
    const movies = await getMovies(env);
    const movie = movies.find(item => String(item.id) === String(movieId));
    if (!movie) {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: "❌ فیلم پیدا نشد." });
      return;
    }
    movie.caption = newCaption;
    await saveMovies(env, movies);
    await deleteKey(env, `state:${user.id}`);
    await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "adminMovieEditSaved") });
    await logAction(env, user.id, "movie_caption_edited", { movie_id: movieId });
    return;
  }

  if (typeof activeState === "string" && activeState.startsWith("admin_ad_edit:")) {
    if (!(await isAnyAdmin(env, user.id))) {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "denied") });
      return;
    }
    if (message.text?.trim() === "/cancel") {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "advertiseCancelled") });
      return;
    }
    if (!isCopyableAdvertisementMessage(message)) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "advertiseInvalid") });
      return;
    }
    const adId = activeState.slice("admin_ad_edit:".length);
    const ads = await getAdvertisements(env);
    const ad = ads.find(item => String(item.id) === String(adId));
    if (!ad || ad.status === "deleted") {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "adminAdNotFound") });
      return;
    }
    ad.source_chat_id = message.chat.id;
    ad.source_message_id = message.message_id;
    ad.edited_at = now();
    ad.edited_by = String(user.id);
    await saveAdvertisements(env, ads);
    await deleteKey(env, `state:${user.id}`);
    await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "adminAdUpdated") });
    await logAction(env, user.id, "advertisement_edited", { advertisement_id: adId });
    return;
  }

  if (message.text && /^admin$/i.test(message.text.trim())) {
    await submitAdminRequest(env, user);
    return;
  }

  const state = await env.BOT_DATA.get(`state:${user.id}`);

  if (state === "advertisement_submit") {
    if (message.text?.trim() === "/cancel") {
      await deleteKey(env, `state:${user.id}`);
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "advertiseCancelled") });
      return;
    }
    if (!isCopyableAdvertisementMessage(message)) {
      await telegram(env, "sendMessage", { chat_id: message.chat.id, text: tr(user, "advertiseInvalid") });
      return;
    }
    await deleteKey(env, `state:${user.id}`);
    await submitAdvertisement(env, message, user);
    return;
  }

  if (await handleReplyMenuButton(env, message, user, ctx)) return;

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

async function handleAdminCallback(env, callback, ctx) {
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

  if (data === "admin:ads") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    const adminUser = await ensureUser(env, callback.from);
    await showAdvertisementManagement(env, chatId, adminUser);
    return;
  }

  if (data === "admin:manage_admins") {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    if (!isMainAdmin(env, userId)) {
      await telegram(env, "sendMessage", { chat_id: chatId, text: tr(await ensureUser(env, callback.from), "adminOwnerOnly") });
      return;
    }
    await showAdminManagement(env, chatId);
    return;
  }

  if (data.startsWith("admin:remove_admin:")) {
    if (!isMainAdmin(env, userId)) {
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⛔", show_alert: true });
      return;
    }
    const targetId = data.split(":")[2];
    await removeApprovedAdmin(env, callback, targetId);
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
    if (!isMainAdmin(env, userId)) {
      await telegram(env, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: tr(await ensureUser(env, callback.from), "adminOwnerOnly"),
        show_alert: true
      });
      return;
    }
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

  if (data.startsWith("adminmovie:edit:")) {
    const parts = data.split(":");
    const movieId = parts[2];
    const movie = await findMovie(env, movieId);
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    if (!movie) {
      await telegram(env, "sendMessage", { chat_id: chatId, text: "❌ فیلم پیدا نشد." });
      return;
    }
    await env.BOT_DATA.put(`state:${userId}`, `admin_movie_edit:${movieId}`, { expirationTtl: 600 });
    await telegram(env, "sendMessage", { chat_id: chatId, text: tr(await getUser(env, userId), "adminMovieEditPrompt") });
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
    if (data.startsWith("ad:")) return await handleAdCallback(env, callback, ctx);
    if (data.startsWith("admin:") || data.startsWith("adminmovie:") || data.startsWith("adminuser:")) return await handleAdminCallback(env, callback, ctx);
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
   
