/* Telegram Movie Bot for Cloudflare Workers
 * Required bindings: BOT_TOKEN (Secret), ADMIN_ID (Variable), BOT_DATA (KV Namespace)
 * Optional: WEBHOOK_SECRET (Secret), BOT_USERNAME (Variable), CHANNEL_ID, CHANNEL_LINK
 * No anti-spam system and no automatic movie deletion are implemented.
 */

const PAGE_SIZE = 8;
const LANGUAGES = ['fa', 'en', 'ar', 'ru', 'zh', 'de'];
const DEFAULT_CHANNEL_ID = '@Super_Pump2';
const DEFAULT_CHANNEL_LINK = 'https://t.me/Super_Pump2';

const TEXT = {
  fa: {
    choose:'🌐 زبان را انتخاب کنید', welcome:'🎬 به ربات فیلم خوش آمدید', menu:'یک گزینه را انتخاب کنید',
    get:'🎬 دریافت فیلم', send:'📤 ارسال فیلم', request:'📝 درخواست فیلم', favorites:'❤️ علاقه‌مندی‌ها',
    invite:'👥 دعوت دوستان', language:'🌐 تغییر زبان', admin:'👑 پنل مدیریت', back:'🔙 بازگشت',
    next:'بعدی ➡️', prev:'⬅️ قبلی', empty:'📭 موردی وجود ندارد', joinRequired:'🔒 ابتدا عضو کانال شوید',
    joinChannel:'📢 عضویت در کانال', checkJoin:'✅ بررسی عضویت', blocked:'🚫 دسترسی شما مسدود شده است',
    sendMovie:'🎬 لطفاً ویدیو یا فایل ویدیویی فیلم را ارسال کنید', movieReceived:'✅ فیلم برای بررسی ارسال شد',
    noMovies:'📭 آرشیو فیلم خالی است', requestAsk:'📝 نام فیلم موردنظر را بفرستید', requestSaved:'✅ درخواست شما ثبت شد',
    pending:'📥 فیلم‌های در انتظار بررسی', requests:'📝 درخواست‌های فیلم', users:'👥 کاربران', admins:'👑 مدیریت ادمین‌ها',
    archive:'🎞 مدیریت آرشیو', approve:'✅ تأیید', reject:'❌ رد کردن', watch:'▶️ مشاهده', delete:'🗑 حذف از آرشیو',
    deleted:'✅ فیلم از آرشیو حذف شد', duplicate:'⚠️ این فیلم قبلاً ثبت شده یا در انتظار بررسی است',
    missing:'❌ این مورد پیدا نشد', notAdmin:'⛔ شما دسترسی مدیریت ندارید', adminAdded:'✅ ادمین اضافه شد',
    adminRemoved:'✅ ادمین حذف شد', adminIdAsk:'🆔 آیدی عددی کاربر را بفرستید', numericId:'❌ آیدی باید فقط شامل عدد باشد',
    ratingSaved:'⭐ امتیاز شما ثبت شد', alreadyRated:'⚠️ شما قبلاً به این فیلم امتیاز داده‌اید',
    favAdded:'❤️ به علاقه‌مندی‌ها اضافه شد', favRemoved:'💔 از علاقه‌مندی‌ها حذف شد', done:'✅ انجام شد',
    requestDeleted:'🗑 درخواست حذف شد', invited:'👥 لینک دعوت شما', inviteCount:'دعوت‌های ثبت‌شده',
    approvedUser:'✅ فیلم ارسالی شما تأیید شد', rejectedUser:'❌ فیلم ارسالی شما تأیید نشد',
    requestReviewed:'✅ درخواست فیلم شما بررسی شد', cancelled:'عملیات لغو شد', cancelHint:'برای لغو، /cancel را بفرستید',
    emptyFavorites:'❤️ هنوز فیلمی به علاقه‌مندی‌ها اضافه نکرده‌اید', userBlocked:'🚫 کاربر مسدود شد', userUnblocked:'✅ مسدودیت کاربر برداشته شد',
    noPending:'📭 فیلمی در انتظار بررسی نیست', noRequests:'📭 درخواست بازی وجود ندارد', userDetails:'👤 اطلاعات کاربر',
    statusBlocked:'مسدود', statusActive:'فعال', views:'بازدید', rating:'امتیاز', country:'کشور',
    adminPanel:'👑 پنل مدیریت', archiveCount:'فیلم‌های آرشیو', pendingCount:'در انتظار بررسی', requestCount:'درخواست‌های باز',
    addAdmin:'➕ افزودن ادمین', removeAdmin:'➖ حذف ادمین', mainAdminOnly:'⛔ این کار فقط توسط ادمین اصلی انجام می‌شود',
    invalidMedia:'❌ لطفاً ویدیو یا یک فایل ویدیویی معتبر ارسال کنید', duplicateRequest:'⚠️ این درخواست قبلاً ثبت شده است',
    chooseAction:'یک عملیات را انتخاب کنید', page:'صفحه', languageSaved:'✅ زبان ذخیره شد',
    archiveMovie:'فیلم آرشیو', pendingMovie:'فیلم در انتظار', requestTitle:'عنوان', userId:'آیدی کاربر', username:'نام کاربری',
    sendError:'❌ ارسال پیام به تلگرام ناموفق بود. تنظیمات ربات را بررسی کنید.', unsupported:'این گزینه پشتیبانی نمی‌شود',
    referralSelf:'نمی‌توانید خودتان را دعوت کنید', referralSuccess:'🎁 یک دعوت جدید ثبت شد',
    confirmDelete:'برای حذف دستی این فیلم از آرشیو تأیید کنید', yesDelete:'🗑 بله، حذف شود', noKeep:'↩️ خیر، نگه دار',
    deletedPending:'فیلم از فهرست بررسی حذف شد', noUsers:'هنوز کاربری ثبت نشده است', noAdmins:'ادمین اضافی ثبت نشده است',
    currentlyAdmins:'ادمین‌های فعلی', mainAdminLabel:'ادمین اصلی', userNotFound:'کاربر پیدا نشد'
    },
  en: {
    choose:'🌐 Choose a language', welcome:'🎬 Welcome to the Movie Bot', menu:'Choose an option',
    get:'🎬 Get a Movie', send:'📤 Submit a Movie', request:'📝 Request a Movie', favorites:'❤️ Favorites',
    invite:'👥 Invite Friends', language:'🌐 Change Language', admin:'👑 Admin Panel', back:'🔙 Back',
    next:'Next ➡️', prev:'⬅️ Previous', empty:'📭 Nothing found', joinRequired:'🔒 Please join the channel first',
    joinChannel:'📢 Join Channel', checkJoin:'✅ Check Membership', blocked:'🚫 Your access is blocked',
    sendMovie:'🎬 Please send a movie video or video file', movieReceived:'✅ Movie submitted for review',
    noMovies:'📭 The movie archive is empty', requestAsk:'📝 Send the requested movie title', requestSaved:'✅ Your request was saved',
    pending:'📥 Pending Movies', requests:'📝 Movie Requests', users:'👥 Users', admins:'👑 Admin Management',
    archive:'🎞 Manage Archive', approve:'✅ Approve', reject:'❌ Reject', watch:'▶️ Watch', delete:'🗑 Delete from Archive',
    deleted:'✅ Movie deleted from archive', duplicate:'⚠️ This movie already exists or is pending review',
    missing:'❌ Item not found', notAdmin:'⛔ Admin access required', adminAdded:'✅ Admin added',
    adminRemoved:'✅ Admin removed', adminIdAsk:'🆔 Send the user numeric ID', numericId:'❌ ID must contain digits only',
    ratingSaved:'⭐ Your rating was saved', alreadyRated:'⚠️ You have already rated this movie',
    favAdded:'❤️ Added to favorites', favRemoved:'💔 Removed from favorites', done:'✅ Done',
    requestDeleted:'🗑 Request deleted', invited:'👥 Your invite link', inviteCount:'Recorded invites',
    approvedUser:'✅ Your submitted movie was approved', rejectedUser:'❌ Your submitted movie was not approved',
    requestReviewed:'✅ Your movie request was reviewed', cancelled:'Operation cancelled', cancelHint:'Send /cancel to cancel',
    emptyFavorites:'❤️ You have no favorite movies yet', userBlocked:'🚫 User blocked', userUnblocked:'✅ User unblocked',
    noPending:'📭 No movies are pending review', noRequests:'📭 No open requests', userDetails:'👤 User Details',
    statusBlocked:'Blocked', statusActive:'Active', views:'Views', rating:'Rating', country:'Country',
    adminPanel:'👑 Admin Panel', archiveCount:'Archived movies', pendingCount:'Pending review', requestCount:'Open requests',
    addAdmin:'➕ Add Admin', removeAdmin:'➖ Remove Admin', mainAdminOnly:'⛔ Only the main admin can do this',
    invalidMedia:'❌ Send a video or a valid video file', duplicateRequest:'⚠️ This request has already been submitted',
    chooseAction:'Choose an action', page:'Page', languageSaved:'✅ Language saved',
    archiveMovie:'Archived movie', pendingMovie:'Pending movie', requestTitle:'Title', userId:'User ID', username:'Username',
    sendError:'❌ Telegram send failed. Check the bot settings.', unsupported:'This option is not supported',
    referralSelf:'You cannot invite yourself', referralSuccess:'🎁 A new invite was recorded',
    confirmDelete:'Confirm manual deletion of this movie from the archive', yesDelete:'🗑 Yes, delete', noKeep:'↩️ No, keep it',
    deletedPending:'Movie removed from review queue', noUsers:'No users have been recorded yet', noAdmins:'No additional admins',
    currentlyAdmins:'Current admins', mainAdminLabel:'Main admin', userNotFound:'User not found'
  },
  ar: {
    choose:'🌐 اختر اللغة', welcome:'🎬 أهلاً بك في بوت الأفلام', menu:'اختر خياراً', get:'🎬 احصل على فيلم',
    send:'📤 إرسال فيلم', request:'📝 طلب فيلم', favorites:'❤️ المفضلة', invite:'👥 دعوة الأصدقاء', language:'🌐 تغيير اللغة',
    admin:'👑 لوحة الإدارة', back:'🔙 رجوع', next:'التالي ➡️', prev:'⬅️ السابق', empty:'📭 لا توجد نتائج',
    joinRequired:'🔒 انضم إلى القناة أولاً', joinChannel:'📢 الانضمام للقناة', checkJoin:'✅ التحقق من العضوية',
    blocked:'🚫 تم حظر الوصول', sendMovie:'🎬 أرسل الفيديو أو ملف الفيديو', movieReceived:'✅ أُرسل الفيلم للمراجعة',
    noMovies:'📭 أرشيف الأفلام فارغ', requestAsk:'📝 أرسل اسم الفيلم المطلوب', requestSaved:'✅ تم حفظ طلبك',
    pending:'📥 أفلام قيد المراجعة', requests:'📝 طلبات الأفلام', users:'👥 المستخدمون', admins:'👑 إدارة المشرفين',
    archive:'🎞 إدارة الأرشيف', approve:'✅ موافقة', reject:'❌ رفض', watch:'▶️ مشاهدة', delete:'🗑 حذف من الأرشيف',
    deleted:'✅ تم حذف الفيلم من الأرشيف', duplicate:'⚠️ الفيلم موجود أو قيد المراجعة', missing:'❌ العنصر غير موجود',
    notAdmin:'⛔ صلاحية الإدارة مطلوبة', adminAdded:'✅ تمت إضافة المشرف', adminRemoved:'✅ تمت إزالة المشرف',
    adminIdAsk:'🆔 أرسل المعرّف الرقمي للمستخدم', numericId:'❌ يجب أن يتكون المعرّف من أرقام فقط',
    ratingSaved:'⭐ تم حفظ تقييمك', alreadyRated:'⚠️ قيّمت هذا الفيلم مسبقاً', favAdded:'❤️ أضيف إلى المفضلة',
    favRemoved:'💔 أزيل من المفضلة', done:'✅ تم', requestDeleted:'🗑 تم حذف الطلب', invited:'👥 رابط الدعوة الخاص بك',
    inviteCount:'الدعوات المسجلة', approvedUser:'✅ تمت الموافقة على الفيلم الذي أرسلته', rejectedUser:'❌ لم تتم الموافقة على الفيلم',
    requestReviewed:'✅ تمت مراجعة طلب الفيلم', cancelled:'تم إلغاء العملية', cancelHint:'أرسل /cancel للإلغاء',
    emptyFavorites:'❤️ لا توجد أفلام في المفضلة بعد', userBlocked:'🚫 تم حظر المستخدم', userUnblocked:'✅ تم إلغاء حظر المستخدم',
    noPending:'📭 لا توجد أفلام قيد المراجعة', noRequests:'📭 لا توجد طلبات مفتوحة', userDetails:'👤 معلومات المستخدم',
    statusBlocked:'محظور', statusActive:'نشط', views:'المشاهدات', rating:'التقييم', country:'البلد',
    adminPanel:'👑 لوحة الإدارة', archiveCount:'الأفلام المؤرشفة', pendingCount:'قيد المراجعة', requestCount:'الطلبات المفتوحة',
    addAdmin:'➕ إضافة مشرف', removeAdmin:'➖ حذف مشرف', mainAdminOnly:'⛔ هذه العملية للمدير الرئيسي فقط',
    invalidMedia:'❌ أرسل فيديو أو ملف فيديو صالحاً', duplicateRequest:'⚠️ تم إرسال هذا الطلب مسبقاً', chooseAction:'اختر عملية',
    page:'صفحة', languageSaved:'✅ تم حفظ اللغة', archiveMovie:'فيلم مؤرشف', pendingMovie:'فيلم قيد الانتظار', requestTitle:'العنوان',
    userId:'معرّف المستخدم', username:'اسم المستخدم', sendError:'❌ فشل الإرسال إلى تيليجرام. تحقق من الإعدادات.',
    unsupported:'هذا الخيار غير مدعوم', referralSelf:'لا يمكنك دعوة نفسك', referralSuccess:'🎁 تم تسجيل دعوة جديدة',
    confirmDelete:'أكد الحذف اليدوي للفيلم من الأرشيف', yesDelete:'🗑 نعم، احذف', noKeep:'↩️ لا، احتفظ به',
    deletedPending:'تم حذف الفيلم من قائمة المراجعة', noUsers:'لم يتم تسجيل مستخدمين بعد', noAdmins:'لا يوجد مشرفون إضافيون',
    currentlyAdmins:'المشرفون الحاليون', mainAdminLabel:'المدير الرئيسي', userNotFound:'المستخدم غير موجود'
  },
  ru: {
    choose:'🌐 Выберите язык', welcome:'🎬 Добро пожаловать в кино-бот', menu:'Выберите действие', get:'🎬 Получить фильм',
    send:'📤 Отправить фильм', request:'📝 Запросить фильм', favorites:'❤️ Избранное', invite:'👥 Пригласить друзей',
    language:'🌐 Сменить язык', admin:'👑 Панель администратора', back:'🔙 Назад', next:'Далее ➡️', prev:'⬅️ Назад',
    empty:'📭 Ничего не найдено', joinRequired:'🔒 Сначала подпишитесь на канал', joinChannel:'📢 Подписаться на канал',
    checkJoin:'✅ Проверить подписку', blocked:'🚫 Доступ заблокирован', sendMovie:'🎬 Отправьте видео или видеофайл',
    movieReceived:'✅ Фильм отправлен на проверку', noMovies:'📭 Архив фильмов пуст', requestAsk:'📝 Отправьте название фильма',
    requestSaved:'✅ Запрос сохранён', pending:'📥 Фильмы на проверке', requests:'📝 Запросы фильмов', users:'👥 Пользователи',
    admins:'👑 Управление администраторами', archive:'🎞 Управление архивом', approve:'✅ Одобрить', reject:'❌ Отклонить',
    watch:'▶️ Смотреть', delete:'🗑 Удалить из архива', deleted:'✅ Фильм удалён из архива',
    duplicate:'⚠️ Фильм уже есть или ожидает проверки', missing:'❌ Элемент не найден', notAdmin:'⛔ Нужны права администратора',
    adminAdded:'✅ Администратор добавлен', adminRemoved:'✅ Администратор удалён', adminIdAsk:'🆔 Отправьте числовой ID',
    numericId:'❌ ID должен содержать только цифры', ratingSaved:'⭐ Оценка сохранена', alreadyRated:'⚠️ Вы уже оценили этот фильм',
    favAdded:'❤️ Добавлено в избранное', favRemoved:'💔 Удалено из избранного', done:'✅ Готово', requestDeleted:'🗑 Запрос удалён',
    invited:'👥 Ваша ссылка приглашения', inviteCount:'Учтённые приглашения', approvedUser:'✅ Ваш фильм одобрен',
    rejectedUser:'❌ Ваш фильм не был одобрен', requestReviewed:'✅ Ваш запрос рассмотрен', cancelled:'Операция отменена',
    cancelHint:'Отправьте /cancel для отмены', emptyFavorites:'❤️ В избранном пока нет фильмов', userBlocked:'🚫 Пользователь заблокирован',
    userUnblocked:'✅ Блокировка снята', noPending:'📭 Нет фильмов на проверке', noRequests:'📭 Нет открытых запросов',
    userDetails:'👤 Данные пользователя', statusBlocked:'Заблокирован', statusActive:'Активен', views:'Просмотры', rating:'Оценка', country:'Страна',
    adminPanel:'👑 Панель администратора', archiveCount:'Фильмы в архиве', pendingCount:'На проверке', requestCount:'Открытые запросы',
    addAdmin:'➕ Добавить администратора', removeAdmin:'➖ Удалить администратора', mainAdminOnly:'⛔ Только главный администратор может это сделать',
    invalidMedia:'❌ Отправьте видео или корректный видеофайл', duplicateRequest:'⚠️ Запрос уже отправлен', chooseAction:'Выберите действие',
    page:'Страница', languageSaved:'✅ Язык сохранён', archiveMovie:'Фильм в архиве', pendingMovie:'Фильм на проверке', requestTitle:'Название',
    userId:'ID пользователя', username:'Имя пользователя', sendError:'❌ Ошибка отправки в Telegram. Проверьте настройки.',
    unsupported:'Этот вариант не поддерживается', referralSelf:'Нельзя пригласить себя', referralSuccess:'🎁 Новое приглашение учтено',
    confirmDelete:'Подтвердите ручное удаление фильма из архива', yesDelete:'🗑 Да, удалить', noKeep:'↩️ Нет, оставить',
    deletedPending:'Фильм удалён из очереди проверки', noUsers:'Пользователи ещё не зарегистрированы', noAdmins:'Нет дополнительных администраторов',
    currentlyAdmins:'Текущие администраторы', mainAdminLabel:'Главный администратор', userNotFound:'Пользователь не найден'
  },
  zh: {
    choose:'🌐 请选择语言', welcome:'🎬 欢迎使用电影机器人', menu:'请选择一个选项', get:'🎬 获取电影', send:'📤 提交电影',
    request:'📝 请求电影', favorites:'❤️ 收藏', invite:'👥 邀请朋友', language:'🌐 更改语言', admin:'👑 管理面板',
    back:'🔙 返回', next:'下一页 ➡️', prev:'⬅️ 上一页', empty:'📭 没有内容', joinRequired:'🔒 请先加入频道',
    joinChannel:'📢 加入频道', checkJoin:'✅ 检查加入状态', blocked:'🚫 访问受限', sendMovie:'🎬 请发送电影视频或视频文件',
    movieReceived:'✅ 电影已提交审核', noMovies:'📭 片库为空', requestAsk:'📝 发送电影名称', requestSaved:'✅ 请求已保存',
    pending:'📥 待审核电影', requests:'📝 电影请求', users:'👥 用户', admins:'👑 管理员管理', archive:'🎞 管理片库',
    approve:'✅ 通过', reject:'❌ 拒绝', watch:'▶️ 观看', delete:'🗑 从片库删除', deleted:'✅ 电影已从片库删除',
    duplicate:'⚠️ 电影已存在或正在审核', missing:'❌ 未找到项目', notAdmin:'⛔ 需要管理员权限', adminAdded:'✅ 管理员已添加',
    adminRemoved:'✅ 管理员已移除', adminIdAsk:'🆔 发送用户数字 ID', numericId:'❌ ID 只能包含数字', ratingSaved:'⭐ 评分已保存',
    alreadyRated:'⚠️ 你已经评价过这部电影', favAdded:'❤️ 已加入收藏', favRemoved:'💔 已从收藏移除', done:'✅ 完成',
    requestDeleted:'🗑 请求已删除', invited:'👥 你的邀请链接', inviteCount:'已记录邀请', approvedUser:'✅ 你提交的电影已通过审核',
    rejectedUser:'❌ 你提交的电影未获通过', requestReviewed:'✅ 你的电影请求已审核', cancelled:'操作已取消', cancelHint:'发送 /cancel 取消操作',
    emptyFavorites:'❤️ 还没有收藏电影', userBlocked:'🚫 用户已封禁', userUnblocked:'✅ 用户已解除封禁', noPending:'📭 没有待审核电影',
    noRequests:'📭 没有未处理请求', userDetails:'👤 用户信息', statusBlocked:'已封禁', statusActive:'正常', views:'观看量', rating:'评分', country:'国家',
    adminPanel:'👑 管理面板', archiveCount:'片库电影', pendingCount:'待审核', requestCount:'未处理请求', addAdmin:'➕ 添加管理员',
    removeAdmin:'➖ 删除管理员', mainAdminOnly:'⛔ 只有主管理员可以执行此操作', invalidMedia:'❌ 请发送视频或有效视频文件',
    duplicateRequest:'⚠️ 此请求已提交', chooseAction:'选择操作', page:'页', languageSaved:'✅ 语言已保存', archiveMovie:'片库电影',
    pendingMovie:'待审核电影', requestTitle:'标题', userId:'用户 ID', username:'用户名', sendError:'❌ Telegram 发送失败，请检查机器人设置。',
    unsupported:'不支持此选项', referralSelf:'不能邀请自己', referralSuccess:'🎁 已记录新的邀请', confirmDelete:'确认从片库手动删除此电影',
    yesDelete:'🗑 是，删除', noKeep:'↩️ 否，保留', deletedPending:'电影已从审核队列移除', noUsers:'尚无注册用户', noAdmins:'没有其他管理员',
    currentlyAdmins:'当前管理员', mainAdminLabel:'主管理员', userNotFound:'未找到用户'
  },
  de: {
    choose:'🌐 Sprache auswählen', welcome:'🎬 Willkommen beim Film-Bot', menu:'Wähle eine Option', get:'🎬 Film erhalten',
    send:'📤 Film einreichen', request:'📝 Film anfragen', favorites:'❤️ Favoriten', invite:'👥 Freunde einladen', language:'🌐 Sprache ändern',
    admin:'👑 Admin-Panel', back:'🔙 Zurück', next:'Weiter ➡️', prev:'⬅️ Zurück', empty:'📭 Keine Einträge',
    joinRequired:'🔒 Bitte tritt zuerst dem Kanal bei', joinChannel:'📢 Kanal beitreten', checkJoin:'✅ Mitgliedschaft prüfen',
    blocked:'🚫 Zugriff gesperrt', sendMovie:'🎬 Sende ein Video oder eine Videodatei', movieReceived:'✅ Film zur Prüfung eingereicht',
    noMovies:'📭 Das Filmarchiv ist leer', requestAsk:'📝 Sende den gewünschten Filmtitel', requestSaved:'✅ Anfrage gespeichert',
    pending:'📥 Filme zur Prüfung', requests:'📝 Filmanfragen', users:'👥 Nutzer', admins:'👑 Admins verwalten', archive:'🎞 Archiv verwalten',
    approve:'✅ Genehmigen', reject:'❌ Ablehnen', watch:'▶️ Ansehen', delete:'🗑 Aus Archiv löschen', deleted:'✅ Film aus Archiv gelöscht',
    duplicate:'⚠️ Film ist bereits vorhanden oder wird geprüft', missing:'❌ Eintrag nicht gefunden', notAdmin:'⛔ Admin-Berechtigung erforderlich',
    adminAdded:'✅ Admin hinzugefügt', adminRemoved:'✅ Admin entfernt', adminIdAsk:'🆔 Numerische Nutzer-ID senden', numericId:'❌ ID darf nur Ziffern enthalten',
    ratingSaved:'⭐ Bewertung gespeichert', alreadyRated:'⚠️ Du hast diesen Film bereits bewertet', favAdded:'❤️ Zu Favoriten hinzugefügt',
    favRemoved:'💔 Aus Favoriten entfernt', done:'✅ Erledigt', requestDeleted:'🗑 Anfrage gelöscht', invited:'👥 Dein Einladungslink',
    inviteCount:'Erfasste Einladungen', approvedUser:'✅ Dein eingereichter Film wurde genehmigt', rejectedUser:'❌ Dein Film wurde nicht genehmigt',
    requestReviewed:'✅ Deine Filmanfrage wurde geprüft', cancelled:'Vorgang abgebrochen', cancelHint:'Zum Abbrechen /cancel senden',
    emptyFavorites:'❤️ Noch keine Favoriten vorhanden', userBlocked:'🚫 Nutzer gesperrt', userUnblocked:'✅ Sperre aufgehoben',
    noPending:'📭 Keine Filme zur Prüfung', noRequests:'📭 Keine offenen Anfragen', userDetails:'👤 Nutzerdetails', statusBlocked:'Gesperrt',
    statusActive:'Aktiv', views:'Aufrufe', rating:'Bewertung', country:'Land', adminPanel:'👑 Admin-Panel', archiveCount:'Archivierte Filme',
    pendingCount:'Zur Prüfung', requestCount:'Offene Anfragen', addAdmin:'➕ Admin hinzufügen', removeAdmin:'➖ Admin entfernen',
    mainAdminOnly:'⛔ Nur der Hauptadmin darf dies tun', invalidMedia:'❌ Sende ein Video oder eine gültige Videodatei',
    duplicateRequest:'⚠️ Diese Anfrage wurde bereits eingereicht', chooseAction:'Wähle eine Aktion', page:'Seite', languageSaved:'✅ Sprache gespeichert',
    archiveMovie:'Archivfilm', pendingMovie:'Film in Prüfung', requestTitle:'Titel', userId:'Nutzer-ID', username:'Benutzername',
    sendError:'❌ Telegram-Versand fehlgeschlagen. Bitte Bot-Einstellungen prüfen.', unsupported:'Diese Option wird nicht unterstützt',
    referralSelf:'Du kannst dich nicht selbst einladen', referralSuccess:'🎁 Neue Einladung erfasst', confirmDelete:'Bestätige das manuelle Löschen aus dem Archiv',
    yesDelete:'🗑 Ja, löschen', noKeep:'↩️ Nein, behalten', deletedPending:'Film aus der Prüfliste entfernt', noUsers:'Noch keine Nutzer erfasst',
    noAdmins:'Keine zusätzlichen Admins', currentlyAdmins:'Aktuelle Admins', mainAdminLabel:'Hauptadmin', userNotFound:'Nutzer nicht gefunden'
  }
};

const t = (lang, key) => (TEXT[LANGUAGES.includes(lang) ? lang : 'fa'][key]  TEXT.en[key]  key);
const uid = () => crypto.randomUUID().replace(/-/g, '').slice(0, 16);
const now = () => Date.now();
const channelId = env => env.CHANNEL_ID || DEFAULT_CHANNEL_ID;
const channelLink = env => env.CHANNEL_LINK || DEFAULT_CHANNEL_LINK;

async function kvGet(env, key, fallback) {
  const raw = await env.BOT_DATA.get(key);
  if (raw == null) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
async function kvPut(env, key, value) {
  await env.BOT_DATA.put(key, JSON.stringify(value));
}
async function tg(env, method, payload = {}) {
  if (!env.BOT_TOKEN) throw new Error('BOT_TOKEN is not configured');
  const response = await fetch(https://api.telegram.org/bot${env.BOT_TOKEN}/${method}, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) throw new Error(Telegram ${method} failed: ${data.description || response.status});
  return data.result;
}
async function safeTg(env, method, payload = {}) {
  try { return await tg(env, method, payload); }
  catch (err) { console.error(Telegram ${method}:, err.message); return null; }
}
async function reply(env, chatId, text, extra = {}) {
  return safeTg(env, 'sendMessage', { chat_id: chatId, text: String(text).slice(0, 4000), ...extra });
}
async function callbackAnswer(env, callbackId, text = '') {
  if (!callbackId) return;
  await safeTg(env, 'answerCallbackQuery', { callback_query_id: callbackId, text: String(text).slice(0, 180) });
}
async function getUser(env, id) {
  return kvGet(env, user:${id}, {
    id: String(id), first_name: '', username: '', language: 'fa', language_selected: false,
    blocked: false, favorites: [], valid_invites: 0, created_at: now()
  });
}
async function saveUser(env, user) { await kvPut(env, user:${user.id}, user); }
async function ensureUser(env, from) {
  const u = await getUser(env, from.id);
  u.id = String(from.id); u.first_name = from.first_name  u.first_name  '';
  u.username = from.username  u.username  '';
  await saveUser(env, u);
  const ids = await kvGet(env, 'users:index', []);
  if (!ids.map(String).includes(u.id)) { ids.push(u.id); await kvPut(env, 'users:index', ids); }
  return u;
}
const isMainAdmin = (env, id) => String(env.ADMIN_ID || '') === String(id);
async function getAdmins(env) { return (await kvGet(env, 'admin:approved', [])).map(String); }
async function isAdmin(env, id) { return isMainAdmin(env, id) || (await getAdmins(env)).includes(String(id)); }
async function hasJoined(env, id) {
  try {
    const r = await tg(env, 'getChatMember', { chat_id: channelId(env), user_id: Number(id) });
    return ['creator', 'administrator', 'member'].includes(r.status);
  } catch (err) { console.error('Membership check:', err.message); return false; }
}
async function requireAccess(env, user) { if (await isAdmin(env, user.id)) return true; return hasJoined(env, user.id); }

function mainKeyboard(lang, admin = false) {
  const rows = [
    [{ text: t(lang, 'get') }, { text: t(lang, 'send') }],
    [{ text: t(lang, 'request') }, { text: t(lang, 'favorites') }],
    [{ text: t(lang, 'invite') }, { text: t(lang, 'language') }]
  ];
  if (admin) rows.push([{ text: t(lang, 'admin') }]);
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}
async function showMenu(env, chatId, user) {
  await reply(env, chatId, ${t(user.language, 'welcome')}\n\n${t(user.language, 'menu')}, {
    reply_markup: mainKeyboard(user.language, await isAdmin(env, user.id))
  });
}
async function showLanguagePicker(env, chatId) {
  const labels = [['🇮🇷 فارسی', 'fa'], ['🇬🇧 English', 'en'], ['🇸🇦 العربية', 'ar'], ['🇷🇺 Русский', 'ru'], ['🇨🇳 中文', 'zh'], ['🇩🇪 Deutsch', 'de']];
  const rows = [[{ text: labels[0][0], callback_data: 'lang:fa' }, { text: labels[1][0], callback_data: 'lang:en' }],
    [{ text: labels[2][0], callback_data: 'lang:ar' }, { text: labels[3][0], callback_data: 'lang:ru' }],
    [{ text: labels[4][0], callback_data: 'lang:zh' }, { text: labels[5][0], callback_data: 'lang:de' }]];
  await reply(env, chatId, ${t('fa', 'choose')} / ${t('en', 'choose')}, { reply_markup: { inline_keyboard: rows } });
}
async function showJoinPrompt(env, chatId, lang) {
  await reply(env, chatId, t(lang, 'joinRequired'), { reply_markup: { inline_keyboard: [
    [{ text: t(lang, 'joinChannel'), url: channelLink(env) }],
    [{ text: t(lang, 'checkJoin'), callback_data: 'membership:check' }]
  ] } });
}

async function listMovies(env) { return kvGet(env, 'movies:index', []); }
async function getMovie(env, id) { return kvGet(env, movie:${id}, null); }
async function saveMovie(env, movie) {
  await kvPut(env, movie:${movie.id}, movie);
  const index = await listMovies(env);
  if (!index.includes(String(movie.id))) { index.unshift(String(movie.id)); await kvPut(env, 'movies:index', index); }
}
async function allMovies(env) {
  const ids = await listMovies(env), result = [];
  for (const id of ids) { const m = await getMovie(env, id); if (m) result.push(m); }
  return result;
}
function sameMedia(a, b) {
  if (a.file_unique_id && b.file_unique_id && a.file_unique_id === b.file_unique_id) return true;
  return !!(a.file_id && b.file_id && a.file_id === b.file_id);
}
async function hasDuplicate(env, movie, skipPendingId = null) {
  for (const m of await allMovies(env)) if (sameMedia(m, movie)) return true;
  const pending = await kvGet(env, 'movies:pending', []);
  return pending.some(p => String(p.id) !== String(skipPendingId || '') && sameMedia(p, movie));
}
async function removeMovie(env, id) {
  const movie = await getMovie(env, id);
  if (!movie) return false;
  await env.BOT_DATA.delete(movie:${id});
  await kvPut(env, 'movies:index', (await listMovies(env)).filter(x => String(x) !== String(id)));
  await env.BOT_DATA.delete(ratings:${id});
  return true;
}
async function getRatingInfo(env, movieId) {
  const stored = await kvGet(env, ratings:${movieId}, []);
  const ratings = Array.isArray(stored) ? stored.map(x => Number(typeof x === 'object' && x !== null ? x.value : x)).filter(x => Number.isFinite(x) && x >= 1 && x <= 5) : [];
  return { count: ratings.length, average: ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : 0 };
}
function movieButtons(lang, movie, isFavorite, env) {
  return { inline_keyboard: [
    [{ text: isFavorite ? t(lang, 'favRemoved') : t(lang, 'favAdded'), callback_data: fav:${isFavorite ? 'remove' : 'add'}:${movie.id} }],
    [1, 2, 3, 4, 5].map(n => ({ text: ⭐ ${n}, callback_data: rate:${movie.id}:${n} }))
  ] };
}
async function sendMovie(env, chatId, movie, user) {
  if (!movie) return reply(env, chatId, t(user.language, 'missing'));
  const info = await getRatingInfo(env, movie.id);
  const caption = ${movie.caption || '🎬'}\n\n👁 ${t(user.language, 'views')}: ${movie.views || 0}\n⭐ ${t(user.language, 'rating')}: ${info.average.toFixed(1)}/5 (${info.count})\n🌍 ${t(user.language, 'country')}: ${movie.country || '—'}\n\n📢 ${channelLink(env)}.slice(0, 1000);
  const isFav = (user.favorites || []).map(String).includes(String(movie.id));
  const payload = { chat_id: chatId, caption, reply_markup: movieButtons(user.language, movie, isFav, env) };
  payload[movie.type === 'document' ? 'document' : 'video'] = movie.file_id;
  const result = await safeTg(env, movie.type === 'document' ? 'sendDocument' : 'sendVideo', payload);
  if (result) {
    movie.views = (movie.views || 0) + 1;
    await saveMovie(env, movie);
  }
}
async function getRandomMovie(env, chatId, user) {
  const movies = await allMovies(env);
  if (!movies.length) return reply(env, chatId, t(user.language, 'noMovies'));
  return sendMovie(env, chatId, movies[Math.floor(Math.random() * movies.length)], user);
}

async function changeFavorite(env, user, id, action) {
  const movie = await getMovie(env, id); if (!movie) return { ok: false, reason: 'missing' };
  const favs = (user.favorites || []).map(String);
  if (action === 'add' && !favs.includes(String(id))) favs.push(String(id));
  if (action === 'remove') user.favorites = favs.filter(x => x !== String(id));
  else user.favorites = favs;
  await saveUser(env, user); return { ok: true };
}
async function showFavorites(env, chatId, user, page = 0, editMessageId = null) {
  const favIds = (user.favorites || []).map(String), movies = (await allMovies(env)).filter(m => favIds.includes(String(m.id)));
  if (!movies.length) return reply(env, chatId, t(user.language, 'emptyFavorites'));
  const pages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE)); page = Math.max(0, Math.min(page, pages - 1));
  const slice = movies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rows = slice.map((m, i) => [{ text: ${page * PAGE_SIZE + i + 1}. ${(m.caption || 'Movie').replace(/\n/g, ' ').slice(0, 45)}, callback_data: fav:open:${m.id} }]);
  const nav = [];
  if (page > 0) nav.push({ text: t(user.language, 'prev'), callback_data: fav:page:${page - 1} });
  if (page < pages - 1) nav.push({ text: t(user.language, 'next'), callback_data: fav:page:${page + 1} });
  if (nav.length) rows.push(nav);
rows.push([{ text: t(user.language, 'back'), callback_data: 'menu:back' }]);
  const payload = { chat_id: chatId, text: ${t(user.language, 'favorites')} — ${t(user.language, 'page')} ${page + 1}/${pages}, reply_markup: { inline_keyboard: rows } };
  if (editMessageId) return safeTg(env, 'editMessageText', { ...payload, message_id: editMessageId });
  return reply(env, chatId, payload.text, { reply_markup: payload.reply_markup });
}
async function notifyAdmins(env, text, replyMarkup = undefined) {
  const ids = [...new Set([String(env.ADMIN_ID || ''), ...(await getAdmins(env))])].filter(Boolean);
  await Promise.all(ids.map(id => reply(env, id, text, replyMarkup ? { reply_markup: replyMarkup } : {})));
}
async function receiveMovie(env, message, user) {
  const media = message.video || message.document;
  if (!media  (message.document && !/^video\//i.test(media.mime_type  '') && !/\.(mp4|mkv|mov|avi|webm|m4v)$/i.test(media.file_name || ''))) {
    return reply(env, message.chat.id, t(user.language, 'invalidMedia'));
  }
  const candidate = { type: message.video ? 'video' : 'document', file_id: media.file_id, file_unique_id: media.file_unique_id  '', caption: message.caption  '🎬 Movie' };
  if (await hasDuplicate(env, candidate)) return reply(env, message.chat.id, t(user.language, 'duplicate'));
  const pending = await kvGet(env, 'movies:pending', []);
  const movie = { ...candidate, id: uid(), user_id: String(user.id), first_name: user.first_name, username: user.username, created_at: now() };
  pending.unshift(movie); await kvPut(env, 'movies:pending', pending);
  await reply(env, message.chat.id, t(user.language, 'movieReceived'));
  await notifyAdmins(env, 📥 ${t('en', 'pendingMovie')}\n${movie.caption}\n👤 ${movie.first_name || '-'}\n🆔 ${movie.user_id}, {
    inline_keyboard: [[{ text: t('en', 'watch'), callback_data: pending:watch:${movie.id} }], [{ text: t('en', 'approve'), callback_data: pending:approve:${movie.id} }, { text: t('en', 'reject'), callback_data: pending:reject:${movie.id} }]]
  });
}
async function approvePending(env, chatId, id) {
  const pending = await kvGet(env, 'movies:pending', []), i = pending.findIndex(x => String(x.id) === String(id));
  if (i < 0) return reply(env, chatId, t('fa', 'missing'));
  const p = pending[i];
  if (await hasDuplicate(env, p, p.id)) {
    pending.splice(i, 1); await kvPut(env, 'movies:pending', pending);
    await reply(env, chatId, t('fa', 'duplicate'));
    if (p.user_id) await reply(env, p.user_id, t('fa', 'duplicate'));
    return;
  }
  const movie = { id: uid(), type: p.type, file_id: p.file_id, file_unique_id: p.file_unique_id, caption: p.caption, country: p.country || '—', views: 0, added_at: now() };
  await saveMovie(env, movie);
  pending.splice(i, 1); await kvPut(env, 'movies:pending', pending);
  await reply(env, chatId, '✅ Approved and archived');
  if (p.user_id) await reply(env, p.user_id, t('fa', 'approvedUser'));
}
async function rejectPending(env, chatId, id) {
  const pending = await kvGet(env, 'movies:pending', []), p = pending.find(x => String(x.id) === String(id));
  if (!p) return reply(env, chatId, t('fa', 'missing'));
  await kvPut(env, 'movies:pending', pending.filter(x => String(x.id) !== String(id)));
  await reply(env, chatId, '❌ Rejected');
  if (p.user_id) await reply(env, p.user_id, t('fa', 'rejectedUser'));
}
async function showPendingList(env, chatId, page = 0) {
  const arr = await kvGet(env, 'movies:pending', []); if (!arr.length) return reply(env, chatId, t('fa', 'noPending'));
  const pages = Math.ceil(arr.length / PAGE_SIZE); page = Math.max(0, Math.min(page, pages - 1));
  const start = page * PAGE_SIZE, rows = arr.slice(start, start + PAGE_SIZE).map((m, i) => [{ text: ${start + i + 1}. ${(m.caption || 'Movie').replace(/\n/g, ' ').slice(0, 42)}, callback_data: pending:view:${m.id}:${page} }]);
  const nav = []; if (page) nav.push({ text: '⬅️', callback_data: pending:list:${page - 1} }); if (page < pages - 1) nav.push({ text: '➡️', callback_data: pending:list:${page + 1} }); if (nav.length) rows.push(nav);
  rows.push([{ text: t('fa', 'back'), callback_data: 'admin:home' }]);
  return reply(env, chatId, 📥 Pending ${page + 1}/${pages}, { reply_markup: { inline_keyboard: rows } });
}
async function showPendingDetail(env, chatId, id, page = 0) {
  const p = (await kvGet(env, 'movies:pending', [])).find(x => String(x.id) === String(id));
  if (!p) return reply(env, chatId, t('fa', 'missing'));
  return reply(env, chatId, ${p.caption || '🎬'}\n👤 ${p.first_name || '-'} · ${p.user_id}, { reply_markup: { inline_keyboard: [
    [{ text: t('en', 'watch'), callback_data: pending:watch:${p.id} }],
    [{ text: t('en', 'approve'), callback_data: pending:approve:${p.id} }, { text: t('en', 'reject'), callback_data: pending:reject:${p.id} }],
    [{ text: t('en', 'back'), callback_data: pending:list:${page} }]
  ] } });
}
async function watchPending(env, chatId, id) {
  const p = (await kvGet(env, 'movies:pending', [])).find(x => String(x.id) === String(id)); if (!p) return reply(env, chatId, t('fa', 'missing'));
  const payload = { chat_id: chatId, caption: (p.caption || '🎬').slice(0, 1000), reply_markup: { inline_keyboard: [[{ text: '✅ Approve', callback_data: pending:approve:${p.id} }, { text: '❌ Reject', callback_data: pending:reject:${p.id} }]] } };
  payload[p.type === 'document' ? 'document' : 'video'] = p.file_id;
  return safeTg(env, p.type === 'document' ? 'sendDocument' : 'sendVideo', payload);
                                                                                 }
async function showArchiveList(env, chatId, page = 0) {
  const arr = await allMovies(env); if (!arr.length) return reply(env, chatId, t('fa', 'empty'));
  const pages = Math.ceil(arr.length / PAGE_SIZE); page = Math.max(0, Math.min(page, pages - 1));
  const start = page * PAGE_SIZE, rows = arr.slice(start, start + PAGE_SIZE).map((m, i) => [{ text: ${start + i + 1}. ${(m.caption || 'Movie').replace(/\n/g, ' ').slice(0, 42)}, callback_data: archive:view:${m.id}:${page} }]);
  const nav = []; if (page) nav.push({ text: '⬅️', callback_data: archive:list:${page - 1} }); if (page < pages - 1) nav.push({ text: '➡️', callback_data: archive:list:${page + 1} }); if (nav.length) rows.push(nav);
  rows.push([{ text: t('fa', 'back'), callback_data: 'admin:home' }]);
  return reply(env, chatId, 🎞 Archive ${page + 1}/${pages}, { reply_markup: { inline_keyboard: rows } });
}
async function showArchiveDetail(env, chatId, id, page = 0) {
  const m = await getMovie(env, id); if (!m) return reply(env, chatId, t('fa', 'missing'));
  const ri = await getRatingInfo(env, id);
  return reply(env, chatId, 🎬 ${m.caption || ''}\nID: ${m.id}\n👁 ${m.views || 0}\n⭐ ${ri.average.toFixed(1)}/5 (${ri.count}), { reply_markup: { inline_keyboard: [
    [{ text: '▶️ Watch', callback_data: archive:watch:${m.id} }],
    [{ text: t('en', 'delete'), callback_data: archive:confirm-delete:${m.id}:${page} }],
    [{ text: '🔙 Back', callback_data: archive:list:${page} }]
  ] } });
}
async function showAdminPanel(env, chatId) {
  const movies = await listMovies(env), pending = await kvGet(env, 'movies:pending', []), requests = (await kvGet(env, 'movie:requests', [])).filter(r => r.status === 'pending');
  const rows = [
    [{ text: ${t('fa', 'archive')} (${movies.length}), callback_data: 'archive:list:0' }],
    [{ text: ${t('fa', 'pending')} (${pending.length}), callback_data: 'pending:list:0' }],
    [{ text: ${t('fa', 'requests')} (${requests.length}), callback_data: 'requests:list:0' }],
    [{ text: t('fa', 'users'), callback_data: 'users:list:0' }]
  ];
  if (isMainAdmin(env, chatId)) rows.push([{ text: t('fa', 'admins'), callback_data: 'admins:home' }]);
  rows.push([{ text: t('fa', 'back'), callback_data: 'menu:back' }]);
  return reply(env, chatId, ${t('fa', 'adminPanel')}\n🎞 ${movies.length} · 📥 ${pending.length} · 📝 ${requests.length}, { reply_markup: { inline_keyboard: rows } });
}

async function showRequests(env, chatId, page = 0) {
  const arr = (await kvGet(env, 'movie:requests', [])).filter(x => x.status === 'pending'); if (!arr.length) return reply(env, chatId, t('fa', 'noRequests'));
  const pages = Math.ceil(arr.length / PAGE_SIZE); page = Math.max(0, Math.min(page, pages - 1));
  const start = page * PAGE_SIZE, rows = arr.slice(start, start + PAGE_SIZE).map((r, i) => [{ text: ${start + i + 1}. ${r.name.slice(0, 42)}, callback_data: requests:view:${r.id}:${page} }]);
  const nav = []; if (page) nav.push({ text: '⬅️', callback_data: requests:list:${page - 1} }); if (page < pages - 1) nav.push({ text: '➡️', callback_data: requests:list:${page + 1} }); if (nav.length) rows.push(nav);
  rows.push([{ text: '🔙 Back', callback_data: 'admin:home' }]);
  return reply(env, chatId, 📝 Requests ${page + 1}/${pages}, { reply_markup: { inline_keyboard: rows } });
}
async function showRequestDetail(env, chatId, id, page = 0) {
  const r = (await kvGet(env, 'movie:requests', [])).find(x => String(x.id) === String(id)); if (!r) return reply(env, chatId, t('fa', 'missing'));
  return reply(env, chatId, 📝 ${r.name}\n👤 ${r.first_name || '-'}\n🆔 ${r.user_id}, { reply_markup: { inline_keyboard: [
    [{ text: '✅ Done', callback_data: requests:done:${id} }, { text: '🗑 Delete', callback_data: requests:delete:${id}:${page} }],
                                                                                    [{ text: '🔙 Back', callback_data: requests:list:${page} }]
  ] } });
}
async function showUsers(env, chatId, page = 0) {
  const ids = await kvGet(env, 'users:index', []); if (!ids.length) return reply(env, chatId, t('fa', 'noUsers'));
  const pages = Math.ceil(ids.length / PAGE_SIZE); page = Math.max(0, Math.min(page, pages - 1));
  const start = page * PAGE_SIZE, rows = [];
  for (const [i, id] of ids.slice(start, start + PAGE_SIZE).entries()) {
    const u = await getUser(env, id); rows.push([{ text: ${start + i + 1}. ${(u.first_name || u.username || u.id).slice(0, 42)}, callback_data: users:view:${u.id}:${page} }]);
  }
  const nav = []; if (page) nav.push({ text: '⬅️', callback_data: users:list:${page - 1} }); if (page < pages - 1) nav.push({ text: '➡️', callback_data: users:list:${page + 1} }); if (nav.length) rows.push(nav);
  rows.push([{ text: '🔙 Back', callback_data: 'admin:home' }]);
  return reply(env, chatId, 👥 Users ${page + 1}/${pages}, { reply_markup: { inline_keyboard: rows } });
}
async function showUserDetail(env, chatId, id, page = 0) {
  const u = await getUser(env, id); if (!u) return reply(env, chatId, t('fa', 'userNotFound'));
  return reply(env, chatId, 👤 ${u.first_name || '-'}\n🆔 ${u.id}\n@${u.username || '-'}\nLanguage: ${u.language}\nFavorites: ${(u.favorites || []).length}\nStatus: ${u.blocked ? 'Blocked' : 'Active'}, { reply_markup: { inline_keyboard: [
    [{ text: u.blocked ? '✅ Unblock' : '🚫 Block', callback_data: users:toggle:${id}:${page} }],
    [{ text: '🔙 Back', callback_data: users:list:${page} }]
  ] } });
}
async function showAdmins(env, chatId) {
  const a = await getAdmins(env);
  return reply(env, chatId, ${t('fa', 'mainAdminLabel')}: ${env.ADMIN_ID}\n${t('fa', 'currentlyAdmins')}:\n${a.join('\n') || t('fa', 'noAdmins')}, { reply_markup: { inline_keyboard: [
    [{ text: t('fa', 'addAdmin'), callback_data: 'admins:add' }],
    [{ text: t('fa', 'removeAdmin'), callback_data: 'admins:remove' }],
    [{ text: t('fa', 'back'), callback_data: 'admin:home' }]
  ] } });
}
async function createRequest(env, user, name) {
  const requests = await kvGet(env, 'movie:requests', []);
  if (requests.some(r => r.status === 'pending' && r.user_id === String(user.id) && r.name.toLowerCase() === name.toLowerCase())) return null;
  const request = { id: uid(), name: name.slice(0, 150), user_id: String(user.id), first_name: user.first_name, username: user.username, status: 'pending', created_at: now() };
  requests.unshift(request); await kvPut(env, 'movie:requests', requests); return request;
}
async function inviteInfo(env, chatId, user) {
  let name = env.BOT_USERNAME;
  if (!name) { try { name = (await tg(env, 'getMe')).username; } catch { name = ''; } }
  if (!name) return reply(env, chatId, t(user.language, 'sendError'));
  return reply(env, chatId, ${t(user.language, 'invited')}:\nhttps://t.me/${name}?start=ref_${user.id}\n${t(user.language, 'inviteCount')}: ${user.valid_invites || 0});
    }
async function startCommand(env, message) {
  const user = await ensureUser(env, message.from), chat = message.chat.id;
  const ref = (message.text || '').match(/^\/start(?:@\w+)?\s+ref_(\d+)/)?.[1];
  if (ref && ref !== user.id && !user.referral_parent) {
    user.referral_parent = ref; await saveUser(env, user);
    const inviter = await getUser(env, ref); inviter.valid_invites = (inviter.valid_invites || 0) + 1; await saveUser(env, inviter);
    await reply(env, ref, t(inviter.language, 'referralSuccess'));
  }
  if (user.blocked) return reply(env, chat, t(user.language, 'blocked'));
  if (!user.language_selected) return showLanguagePicker(env, chat);
  if (!(await requireAccess(env, user))) return showJoinPrompt(env, chat, user.language);
  return showMenu(env, chat, user);
}
function buttonAction(text) {
  const keys = ['get', 'send', 'request', 'favorites', 'invite', 'language', 'admin'];
  for (const key of keys) for (const lang of LANGUAGES) if (text === TEXT[lang][key]) return key;
  return null;
}
async function handleText(env, message, user) {
  const text = (message.text || '').trim(), chatId = message.chat.id, stateKey = state:${user.id};
  const state = await kvGet(env, stateKey, null);
  if (text === '/cancel' || text === 'لغو') {
    await env.BOT_DATA.delete(stateKey); return reply(env, chatId, t(user.language, 'cancelled'));
  }
  if (state?.type === 'add_admin' || state?.type === 'remove_admin') {
    if (!isMainAdmin(env, user.id)) { await env.BOT_DATA.delete(stateKey); return reply(env, chatId, t(user.language, 'mainAdminOnly')); }
    if (!/^\d{3,25}$/.test(text)) return reply(env, chatId, t(user.language, 'numericId'));
    if (state.type === 'add_admin') {
      const admins = await getAdmins(env); if (!admins.includes(text) && !isMainAdmin(env, text)) { admins.push(text); await kvPut(env, 'admin:approved', admins); }
      await reply(env, chatId, t(user.language, 'adminAdded')); await reply(env, text, 👑 ${t('en', 'admin')});
    } else {
      await kvPut(env, 'admin:approved', (await getAdmins(env)).filter(x => x !== text));
      await reply(env, chatId, t(user.language, 'adminRemoved'));
    }
    await env.BOT_DATA.delete(stateKey); return;
  }
  if (state?.type === 'request') {
    if (!text) return reply(env, chatId, t(user.language, 'requestAsk'));
    const req = await createRequest(env, user, text);
    await env.BOT_DATA.delete(stateKey);
    if (!req) return reply(env, chatId, t(user.language, 'duplicateRequest'));
    await reply(env, chatId, t(user.language, 'requestSaved'));
    await notifyAdmins(env, 📝 New movie request: ${req.name}\nUser: ${user.id}, { inline_keyboard: [[{ text: 'View requests', callback_data: 'requests:list:0' }]] }); return;
  }
  const action = buttonAction(text);
  if (action === 'get') return getRandomMovie(env, chatId, user);
  if (action === 'send') return reply(env, chatId, ${t(user.language, 'sendMovie')}\n${t(user.language, 'cancelHint')});
  if (action === 'request') { await kvPut(env, stateKey, { type: 'request' }); return reply(env, chatId, ${t(user.language, 'requestAsk')}\n${t(user.language, 'cancelHint')}); }
  if (action === 'favorites') return showFavorites(env, chatId, user);
  if (action === 'invite') return inviteInfo(env, chatId, user);
  if (action === 'language') return showLanguagePicker(env, chatId);
  if (action === 'admin') return isAdmin(env, user.id) ? showAdminPanel(env, chatId) : reply(env, chatId, t(user.language, 'notAdmin'));
}
async function handleCallback(env, query) {
  const data = query.data  '', user = await ensureUser(env, query.from), chatId = query.message?.chat?.id  query.from.id;
  await callbackAnswer(env, query.id);
  if (data.startsWith('lang:')) {
    const lang = data.slice(5); user.language = LANGUAGES.includes(lang) ? lang : 'fa'; user.language_selected = true; await saveUser(env, user);
    await reply(env, chatId, t(user.language, 'languageSaved'));
    if (user.blocked) return reply(env, chatId, t(user.language, 'blocked'));
    if (!(await requireAccess(env, user))) return showJoinPrompt(env, chatId, user.language);
    return showMenu(env, chatId, user);
  }
  if (data === 'membership:check') {
    if (await requireAccess(env, user)) return showMenu(env, chatId, user);
    return showJoinPrompt(env, chatId, user.language);
  }
  if (user.blocked && !isAdmin(env, user.id)) return reply(env, chatId, t(user.language, 'blocked'));
  if (!(await requireAccess(env, user))) return showJoinPrompt(env, chatId, user.language);

  if (data.startsWith('fav:')) {
    const p = data.split(':');
    if (p[1] === 'page') return showFavorites(env, chatId, user, Number(p[2]) || 0, query.message?.message_id);
    if (p[1] === 'open') return sendMovie(env, chatId, await getMovie(env, p[2]), user);
    if (p[1] === 'add' || p[1] === 'remove') {
      const r = await changeFavorite(env, user, p[2], p[1]);
      return reply(env, chatId, r.ok ? t(user.language, p[1] === 'add' ? 'favAdded' : 'favRemoved') : t(user.language, 'missing'));
    }
  }
  if (data.startsWith('rate:')) {
    const [, movieId, val] = data.split(':'), score = Number(val);
    if (!Number.isInteger(score)  score < 1  score > 5) return reply(env, chatId, t(user.language, 'unsupported'));
    if (!(await getMovie(env, movieId))) return reply(env, chatId, t(user.language, 'missing'));
    const key = rating:${movieId}:${user.id};
    if (await env.BOT_DATA.get(key)) return reply(env, chatId, t(user.language, 'alreadyRated'));
    await env.BOT_DATA.put(key, String(score));
    const ratings = await kvGet(env, ratings:${movieId}, []); ratings.push({ user_id: user.id, value: score }); await kvPut(env, ratings:${movieId}, ratings);
    return reply(env, chatId, t(user.language, 'ratingSaved'));
  }
  const adminCallback = /^(admin:|archive:|pending:|requests:|users:|admins:)/.test(data);
  if (adminCallback && !(await isAdmin(env, user.id))) return reply(env, chatId, t(user.language, 'notAdmin'));
  if (data.startsWith('admins:') && !isMainAdmin(env, user.id)) return reply(env, chatId, t(user.language, 'mainAdminOnly'));
  if (data === 'menu:back') return showMenu(env, chatId, user);
  if (data === 'admin:home') return showAdminPanel(env, chatId);
  if (data.startsWith('pending:list:')) return showPendingList(env, chatId, Number(data.split(':')[2]) || 0);
  if (data.startsWith('pending:view:')) { const p = data.split(':'); return showPendingDetail(env, chatId, p[2], Number(p[3]) || 0); }
  if (data.startsWith('pending:watch:')) return watchPending(env, chatId, data.split(':')[2]);
  if (data.startsWith('pending:approve:')) return approvePending(env, chatId, data.split(':')[2]);
  if (data.startsWith('pending:reject:')) return rejectPending(env, chatId, data.split(':')[2]);
  if (data.startsWith('archive:list:')) return showArchiveList(env, chatId, Number(data.split(':')[2]) || 0);
  if (data.startsWith('archive:view:')) { const p = data.split(':'); return showArchiveDetail(env, chatId, p[2], Number(p[3]) || 0); }
  if (data.startsWith('archive:watch:')) return sendMovie(env, chatId, await getMovie(env, data.split(':')[2]), user);
  if (data.startsWith('archive:confirm-delete:')) {
    const p = data.split(':'); return reply(env, chatId, t(user.language, 'confirmDelete'), { reply_markup: { inline_keyboard: [
      [{ text: t(user.language, 'yesDelete'), callback_data: archive:delete:${p[2]}:${p[3]} }, { text: t(user.language, 'noKeep'), callback_data: archive:view:${p[2]}:${p[3]} }]
    ] } });
  }
  if (data.startsWith('archive:delete:')) {
    const p = data.split(':'), ok = await removeMovie(env, p[2]);
    return ok ? (await reply(env, chatId, t(user.language, 'deleted')), showArchiveList(env, chatId, Number(p[3]) || 0)) : reply(env, chatId, t(user.language, 'missing'));
  }
  if (data.startsWith('requests:list:')) return showRequests(env, chatId, Number(data.split(':')[2]) || 0);
  if (data.startsWith('requests:view:')) { const p = data.split(':'); return showRequestDetail(env, chatId, p[2], Number(p[3]) || 0); }
  if (data.startsWith('requests:done:')) {
    const id = data.split(':')[2], arr = await kvGet(env, 'movie:requests', []), r = arr.find(x => String(x.id) === String(id));
    if (!r) return reply(env, chatId, t(user.language, 'missing'));
    r.status = 'done'; r.reviewed_at = now(); await kvPut(env, 'movie:requests', arr);
    await reply(env, chatId, t(user.language, 'done')); await reply(env, r.user_id, t((await getUser(env, r.user_id)).language, 'requestReviewed')); return;
      }
if (data.startsWith('requests:delete:')) {
    const p = data.split(':'), arr = await kvGet(env, 'movie:requests', []); await kvPut(env, 'movie:requests', arr.filter(x => String(x.id) !== String(p[2])));
    await reply(env, chatId, t(user.language, 'requestDeleted')); return showRequests(env, chatId, Number(p[3]) || 0);
  }
  if (data.startsWith('users:list:')) return showUsers(env, chatId, Number(data.split(':')[2]) || 0);
  if (data.startsWith('users:view:')) { const p = data.split(':'); return showUserDetail(env, chatId, p[2], Number(p[3]) || 0); }
  if (data.startsWith('users:toggle:')) {
    const p = data.split(':'), target = await getUser(env, p[2]); target.blocked = !target.blocked; await saveUser(env, target);
    await reply(env, chatId, t(user.language, target.blocked ? 'userBlocked' : 'userUnblocked')); return showUserDetail(env, chatId, p[2], Number(p[3]) || 0);
  }
  if (data === 'admins:home') return showAdmins(env, chatId);
  if (data === 'admins:add' || data === 'admins:remove') {
    await kvPut(env, state:${user.id}, { type: data === 'admins:add' ? 'add_admin' : 'remove_admin' });
    return reply(env, chatId, ${t(user.language, 'adminIdAsk')}\n${t(user.language, 'cancelHint')});
  }
}

async function handleUpdate(env, update) {
  if (update.callback_query) return handleCallback(env, update.callback_query);
  const message = update.message || update.edited_message;
  if (!message?.from || !message.chat) return;
  const user = await ensureUser(env, message.from), chatId = message.chat.id;
  if (message.text?.startsWith('/start')) return startCommand(env, message);
  if (message.text?.startsWith('/cancel')) { await env.BOT_DATA.delete(state:${user.id}); return reply(env, chatId, t(user.language, 'cancelled')); }
  if (user.blocked && !(await isAdmin(env, user.id))) return reply(env, chatId, t(user.language, 'blocked'));
  const state = await kvGet(env, state:${user.id}, null);
  // Membership is checked on every ordinary update; an old pending state must not bypass it.
  if (!(await requireAccess(env, user))) return showJoinPrompt(env, chatId, user.language);
  if (message.video || message.document) return receiveMovie(env, message, user);
  if (message.text) return handleText(env, message, user);
}

export default {
  async fetch(request, env) {
    if (request.method === 'GET') return new Response('Movie Bot Worker is running.', { status: 200 });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    if (!env.BOT_DATA) return new Response('Missing BOT_DATA KV binding', { status: 500 });
    if (!env.BOT_TOKEN || !env.ADMIN_ID) return new Response('Missing BOT_TOKEN or ADMIN_ID configuration', { status: 500 });
    if (env.WEBHOOK_SECRET) {
      const supplied = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (supplied !== env.WEBHOOK_SECRET) return new Response('Unauthorized', { status: 401 });
    }
    try { await handleUpdate(env, await request.json()); }
    catch (err) { console.error('Update handler failed:', err?.stack || err); }
    // Always acknowledge Telegram updates after processing so Telegram does not retry indefinitely.
    return new Response('OK', { status: 200 });
  }
};
if (data.startsWith('requests:delete:')) {
    const p = data.split(':'), arr = await kvGet(env, 'movie:requests', []); await kvPut(env, 'movie:requests', arr.filter(x => String(x.id) !== String(p[2])));
    await reply(env, chatId, t(user.language, 'requestDeleted')); return showRequests(env, chatId, Number(p[3]) || 0);
  }
  if (data.startsWith('users:list:')) return showUsers(env, chatId, Number(data.split(':')[2]) || 0);
  if (data.startsWith('users:view:')) { const p = data.split(':'); return showUserDetail(env, chatId, p[2], Number(p[3]) || 0); }
  if (data.startsWith('users:toggle:')) {
    const p = data.split(':'), target = await getUser(env, p[2]); target.blocked = !target.blocked; await saveUser(env, target);
    await reply(env, chatId, t(user.language, target.blocked ? 'userBlocked' : 'userUnblocked')); return showUserDetail(env, chatId, p[2], Number(p[3]) || 0);
  }
  if (data === 'admins:home') return showAdmins(env, chatId);
  if (data === 'admins:add' || data === 'admins:remove') {
    await kvPut(env, state:${user.id}, { type: data === 'admins:add' ? 'add_admin' : 'remove_admin' });
    return reply(env, chatId, ${t(user.language, 'adminIdAsk')}\n${t(user.language, 'cancelHint')});
  }
}

async function handleUpdate(env, update) {
  if (update.callback_query) return handleCallback(env, update.callback_query);
  const message = update.message || update.edited_message;
  if (!message?.from || !message.chat) return;
  const user = await ensureUser(env, message.from), chatId = message.chat.id;
  if (message.text?.startsWith('/start')) return startCommand(env, message);
  if (message.text?.startsWith('/cancel')) { await env.BOT_DATA.delete(state:${user.id}); return reply(env, chatId, t(user.language, 'cancelled')); }
  if (user.blocked && !(await isAdmin(env, user.id))) return reply(env, chatId, t(user.language, 'blocked'));
  const state = await kvGet(env, state:${user.id}, null);
  // Membership is checked on every ordinary update; an old pending state must not bypass it.
  if (!(await requireAccess(env, user))) return showJoinPrompt(env, chatId, user.language);
  if (message.video || message.document) return receiveMovie(env, message, user);
  if (message.text) return handleText(env, message, user);
}

export default {
  async fetch(request, env) {
    if (request.method === 'GET') return new Response('Movie Bot Worker is running.', { status: 200 });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    if (!env.BOT_DATA) return new Response('Missing BOT_DATA KV binding', { status: 500 });
    if (!env.BOT_TOKEN || !env.ADMIN_ID) return new Response('Missing BOT_TOKEN or ADMIN_ID configuration', { status: 500 });
    if (env.WEBHOOK_SECRET) {
      const supplied = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (supplied !== env.WEBHOOK_SECRET) return new Response('Unauthorized', { status: 401 });
    }
    try { await handleUpdate(env, await request.json()); }
    catch (err) { console.error('Update handler failed:', err?.stack || err); }
    // Always acknowledge Telegram updates after processing so Telegram does not retry indefinitely.
    return new Response('OK', { status: 200 });
  }
};
