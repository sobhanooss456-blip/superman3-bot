import { DurableObject } from "cloudflare:workers";

const CHANNEL = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";
const ARCHIVE_CHAT_ID = "-1004374846750";
const DELETE_AFTER = 20_000;

const LANGS = {
  fa: {
    n:"🇮🇷 فارسی",
    w:"🎬 به ربات فیلم خوش آمدید!",
    j:"⚠️ ابتدا عضو کانال شوید.",
    g:"🎬 دریافت فیلم",
    s:"📤 ارسال فیلم",
    l:"🌐 تغییر زبان",
    menu:"☰ منو",
    title:"📋 منوی اصلی",
    prompt:"📤 فیلم یا ویدیوی خودت را همینجا ارسال کن.",
    empty:"🎬 فیلم جدیدی برای شما باقی نمانده است.\n📤 می‌توانید فیلم‌های خودتان را ارسال کنید تا به گسترش آرشیو ربات کمک کنید.",
    selected:"✅ زبان انتخاب شد.",
    notMember:"❌ هنوز عضو کانال نیستید.",
    memberOk:"✅ عضویت تأیید شد.",
    admin:"👑 پنل مدیریت",
    stats:"📊 آمار",
    pending:"📥 درخواست‌ها",
    back:"🔙 بازگشت",
    sent:"✅ فیلم شما برای بررسی مدیر ارسال شد."
  },

  en: {
    n:"🇬🇧 English",
    w:"🎬 Welcome to the movie bot!",
    j:"⚠️ Please join the channel first.",
    g:"🎬 Get Movie",
    s:"📤 Send Movie",
    l:"🌐 Change Language",
    menu:"☰ Menu",
    title:"📋 Main Menu",
    prompt:"📤 Send your movie or video here.",
    empty:"🎬 There are no new movies left for you.\n📤 You can send your own movies to help expand the bot archive.",
    selected:"✅ Language selected.",
    notMember:"❌ You have not joined the channel yet.",
    memberOk:"✅ Membership confirmed.",
    admin:"👑 Admin Panel",
    stats:"📊 Statistics",
    pending:"📥 Requests",
    back:"🔙 Back",
    sent:"✅ Your movie was sent to the admin for review."
  },

  ar: {
    n:"🇸🇦 العربية",
    w:"🎬 أهلاً بك في بوت الأفلام!",
    j:"⚠️ انضم إلى القناة أولاً.",
    g:"🎬 الحصول على فيلم",
    s:"📤 إرسال فيلم",
    l:"🌐 تغيير اللغة",
    menu:"☰ القائمة",
    title:"📋 القائمة الرئيسية",
    prompt:"📤 أرسل الفيلم أو الفيديو هنا.",
    empty:"🎬 لا توجد أفلام جديدة متبقية لك.\n📤 يمكنك إرسال أفلامك للمساعدة في توسيع أرشيف البوت.",
    selected:"✅ تم اختيار اللغة.",
    notMember:"❌ لم تنضم إلى القناة بعد.",
    memberOk:"✅ تم تأكيد العضوية.",
    admin:"👑 لوحة الإدارة",
    stats:"📊 الإحصائيات",
    pending:"📥 الطلبات",
    back:"🔙 رجوع",
    sent:"✅ تم إرسال فيلمك إلى المدير للمراجعة."
  },

  tr: {
    n:"🇹🇷 Türkçe",
    w:"🎬 Film botuna hoş geldiniz!",
    j:"⚠️ Önce kanala katılın.",
    g:"🎬 Film Al",
    s:"📤 Film Gönder",
    l:"🌐 Dil Değiştir",
    menu:"☰ Menü",
    title:"📋 Ana Menü",
    prompt:"📤 Filminizi veya videonuzu buraya gönderin.",
    empty:"🎬 Sizin için yeni film kalmadı.\n📤 Kendi filmlerinizi göndererek arşivin büyümesine yardımcı olabilirsiniz.",
    selected:"✅ Dil seçildi.",
    notMember:"❌ Henüz kanala katılmadınız.",
    memberOk:"✅ Üyelik doğrulandı.",
    admin:"👑 Yönetici Paneli",
    stats:"📊 İstatistikler",
    pending:"📥 İstekler",
    back:"🔙 Geri",
    sent:"✅ Filminiz yöneticiye inceleme için gönderildi."
  },

  de: {
    n:"🇩🇪 Deutsch",
    w:"🎬 Willkommen beim Film-Bot!",
    j:"⚠️ Bitte zuerst dem Kanal beitreten.",
    g:"🎬 Film erhalten",
    s:"📤 Film senden",
    l:"🌐 Sprache ändern",
    menu:"☰ Menü",
    title:"📋 Hauptmenü",
    prompt:"📤 Senden Sie Ihren Film oder Ihr Video hier.",
    empty:"🎬 Es sind keine neuen Filme mehr für Sie vorhanden.\n📤 Sie können eigene Filme senden, um das Archiv zu erweitern.",
    selected:"✅ Sprache ausgewählt.",
    notMember:"❌ Sie sind dem Kanal noch nicht beigetreten.",
    memberOk:"✅ Mitgliedschaft bestätigt.",
    admin:"👑 Admin-Panel",
    stats:"📊 Statistiken",
    pending:"📥 Anfragen",
    back:"🔙 Zurück",
    sent:"✅ Ihr Film wurde zur Überprüfung an den Administrator gesendet."
  },

  fr: {
    n:"🇫🇷 Français",
    w:"🎬 Bienvenue sur le bot de films !",
    j:"⚠️ Rejoignez d'abord le canal.",
    g:"🎬 Obtenir un film",
    s:"📤 Envoyer un film",
    l:"🌐 Changer la langue",
    menu:"☰ Menu",
    title:"📋 Menu principal",
    prompt:"📤 Envoyez votre film ou vidéo ici.",
    empty:"🎬 Il ne reste aucun nouveau film pour vous.\n📤 Vous pouvez envoyer vos propres films pour aider à développer l'archive.",
    selected:"✅ Langue sélectionnée.",
    notMember:"❌ Vous n'avez pas encore rejoint le canal.",
    memberOk:"✅ Adhésion confirmée.",
    admin:"👑 Panneau admin",
    stats:"📊 Statistiques",
    pending:"📥 Demandes",
    back:"🔙 Retour",
    sent:"✅ Votre film a été envoyé à l'administrateur pour vérification."
  },

  es: {
    n:"🇪🇸 Español",
    w:"🎬 ¡Bienvenido al bot de películas!",
    j:"⚠️ Únete primero al canal.",
    g:"🎬 Obtener película",
    s:"📤 Enviar película",
    l:"🌐 Cambiar idioma",
    menu:"☰ Menú",
    title:"📋 Menú principal",
    prompt:"📤 Envía tu película o vídeo aquí.",
    empty:"🎬 No quedan películas nuevas para ti.\n📤 Puedes enviar tus propias películas para ayudar a ampliar el archivo.",
    selected:"✅ Idioma seleccionado.",
    notMember:"❌ Aún no te has unido al canal.",
    memberOk:"✅ Membresía confirmada.",
    admin:"👑 Panel de administración",
    stats:"📊 Estadísticas",
    pending:"📥 Solicitudes",
    back:"🔙 Volver",
    sent:"✅ Tu película fue enviada al administrador para su revisión."
  },

  pt: {
    n:"🇵🇹 Português",
    w:"🎬 Bem-vindo ao bot de filmes!",
    j:"⚠️ Entre primeiro no canal.",
    g:"🎬 Obter filme",
    s:"📤 Enviar filme",
    l:"🌐 Mudar idioma",
    menu:"☰ Menu",
    title:"📋 Menu principal",
    prompt:"📤 Envie seu filme ou vídeo aqui.",
    empty:"🎬 Não há mais filmes novos para você.\n📤 Você pode enviar seus próprios filmes para ajudar a expandir o arquivo.",
    selected:"✅ Idioma selecionado.",
    notMember:"❌ Você ainda não entrou no canal.",
    memberOk:"✅ Associação confirmada.",
    admin:"👑 Painel de administração",
    stats:"📊 Estatísticas",
    pending:"📥 Solicitações",
    back:"🔙 Voltar",
    sent:"✅ Seu filme foi enviado ao administrador para análise."
  },

  ru: {
    n:"🇷🇺 Русский",
    w:"🎬 Добро пожаловать в бот фильмов!",
    j:"⚠️ Сначала вступите в канал.",
    g:"🎬 Получить фильм",
    s:"📤 Отправить фильм",
    l:"🌐 Изменить язык",
    menu:"☰ Меню",
    title:"📋 Главное меню",
    prompt:"📤 Отправьте фильм или видео сюда.",
    empty:"🎬 Для вас больше нет новых фильмов.\n📤 Вы можете отправить свои фильмы, чтобы помочь расширить архив.",
    selected:"✅ Язык выбран.",
    notMember:"❌ Вы ещё не вступили в канал.",
    memberOk:"✅ Участие подтверждено.",
    admin:"👑 Панель администратора",
    stats:"📊 Статистика",
    pending:"📥 Запросы",
    back:"🔙 Назад",
    sent:"✅ Ваш фильм отправлен администратору на проверку."
  },

  uk: {
    n:"🇺🇦 Українська",
    w:"🎬 Ласкаво просимо до бота фільмів!",
    j:"⚠️ Спочатку приєднайтесь до каналу.",
    g:"🎬 Отримати фільм",
    s:"📤 Надіслати фільм",
    l:"🌐 Змінити мову",
    menu:"☰ Меню",
    title:"📋 Головне меню",
    prompt:"📤 Надішліть свій фільм або відео сюди.",
    empty:"🎬 Для вас більше не залишилося нових фільмів.\n📤 Ви можете надсилати власні фільми, щоб допомогти розширити архів.",
    selected:"✅ Мову вибрано.",
    notMember:"❌ Ви ще не приєдналися до каналу.",
    memberOk:"✅ Участь підтверджено.",
    admin:"👑 Панель адміністратора",
    stats:"📊 Статистика",
    pending:"📥 Запити",
    back:"🔙 Назад",
    sent:"✅ Ваш фільм надіслано адміністратору на перевірку."
  },

  hi: {
    n:"🇮🇳 हिन्दी",
    w:"🎬 फिल्म बॉट में आपका स्वागत है!",
    j:"⚠️ पहले चैनल से जुड़ें।",
    g:"🎬 फिल्म प्राप्त करें",
    s:"📤 फिल्म भेजें",
    l:"🌐 भाषा बदलें",
    menu:"☰ मेनू",
    title:"📋 मुख्य मेनू",
    prompt:"📤 अपनी फिल्म या वीडियो यहाँ भेजें।",
    empty:"🎬 आपके लिए कोई नई फिल्म बाकी नहीं है।\n📤 आप अपनी फिल्में भेजकर बॉट के संग्रह को बढ़ाने में मदद कर सकते हैं।",
    selected:"✅ भाषा चुनी गई।",
    notMember:"❌ आप अभी तक चैनल से नहीं जुड़े हैं।",
    memberOk:"✅ सदस्यता सत्यापित हुई।",
    admin:"👑 एडमिन पैनल",
    stats:"📊 आँकड़े",
    pending:"📥 अनुरोध",
    back:"🔙 वापस",
    sent:"✅ आपकी फिल्म समीक्षा के लिए एडमिन को भेज दी गई है।"
  },

  ur: {
    n:"🇵🇰 اردو",
    w:"🎬 فلم بوٹ میں خوش آمدید!",
    j:"⚠️ پہلے چینل میں شامل ہوں۔",
    g:"🎬 فلم حاصل کریں",
    s:"📤 فلم بھیجیں",
    l:"🌐 زبان تبدیل کریں",
    menu:"☰ مینو",
    title:"📋 مین مینو",
    prompt:"📤 اپنی فلم یا ویڈیو یہاں بھیجیں۔",
    empty:"🎬 آپ کے لیے کوئی نئی فلم باقی نہیں رہی۔\n📤 آپ اپنی فلمیں بھیج کر بوٹ کے آرکائیو کو بڑھانے میں مدد کر سکتے ہیں۔",
    selected:"✅ زبان منتخب ہو گئی۔",
    notMember:"❌ آپ ابھی چینل میں شامل نہیں ہوئے۔",
    memberOk:"✅ رکنیت کی تصدیق ہو گئی۔",
    admin:"👑 ایڈمن پینل",
    stats:"📊 اعداد و شمار",
    pending:"📥 درخواستیں",
    back:"🔙 واپس",
    sent:"✅ آپ کی فلم جائزے کے لیے ایڈمن کو بھیج دی گئی ہے۔"
  },

  zh: {
    n:"🇨🇳 中文",
    w:"🎬 欢迎使用电影机器人！",
    j:"⚠️ 请先加入频道。",
    g:"🎬 获取电影",
    s:"📤 发送电影",
    l:"🌐 更改语言",
    menu:"☰ 菜单",
    title:"📋 主菜单",
    prompt:"📤 请在这里发送您的电影或视频。",
    empty:"🎬 没有更多新电影了。\n📤 您可以发送自己的电影来帮助扩展机器人档案。",
    selected:"✅ 已选择语言。",
    notMember:"❌ 您还没有加入频道。",
    memberOk:"✅ 已确认加入。",
    admin:"👑 管理面板",
    stats:"📊 统计",
    pending:"📥 请求",
    back:"🔙 返回",
    sent:"✅ 您的电影已发送给管理员审核。"
  },

  ja: {
    n:"🇯🇵 日本語",
    w:"🎬 映画ボットへようこそ！",
    j:"⚠️ 先にチャンネルへ参加してください。",
    g:"🎬 映画を取得",
    s:"📤 映画を送信",
    l:"🌐 言語を変更",
    menu:"☰ メニュー",
    title:"📋 メインメニュー",
    prompt:"📤 映画または動画をここに送信してください。",
    empty:"🎬 新しい映画は残っていません。\n📤 自分の映画を送信してアーカイブの拡大に協力できます。",
    selected:"✅ 言語が選択されました。",
    notMember:"❌ まだチャンネルに参加していません。",
    memberOk:"✅ 参加を確認しました。",
    admin:"👑 管理パネル",
    stats:"📊 統計",
    pending:"📥 リクエスト",
    back:"🔙 戻る",
    sent:"✅ 映画を管理者に送信しました。"
  },

  ko: {
    n:"🇰🇷 한국어",
    w:"🎬 영화 봇에 오신 것을 환영합니다!",
    j:"⚠️ 먼저 채널에 가입하세요.",
    g:"🎬 영화 받기",
    s:"📤 영화 보내기",
    l:"🌐 언어 변경",
    menu:"☰ 메뉴",
    title:"📋 메인 메뉴",
    prompt:"📤 영화 또는 동영상을 여기로 보내주세요.",
    empty:"🎬 새로운 영화가 더 이상 없습니다.\n📤 직접 영화를 보내 봇의 보관함을 확장하는 데 도움을 줄 수 있습니다.",
    selected:"✅ 언어가 선택되었습니다.",
    notMember:"❌ 아직 채널에 가입하지 않았습니다.",
    memberOk:"✅ 가입이 확인되었습니다.",
    admin:"👑 관리자 패널",
    stats:"📊 통계",
    pending:"📥 요청",
    back:"🔙 뒤로",
    sent:"✅ 영화가 관리자에게 검토를 위해 전송되었습니다."
  },

  it: {
    n:"🇮🇹 Italiano",
    w:"🎬 Benvenuto nel bot dei film!",
    j:"⚠️ Prima entra nel canale.",
    g:"🎬 Ottieni film",
    s:"📤 Invia film",
    l:"🌐 Cambia lingua",
    menu:"☰ Menu",
    title:"📋 Menu principale",
    prompt:"📤 Invia qui il tuo film o video.",
    empty:"🎬 Non ci sono più nuovi film per te.\n📤 Puoi inviare i tuoi film per aiutare ad ampliare l'archivio.",
    selected:"✅ Lingua selezionata.",
    notMember:"❌ Non hai ancora aderito al canale.",
    memberOk:"✅ Iscrizione confermata.",
    admin:"👑 Pannello amministratore",
    stats:"📊 Statistiche",
    pending:"📥 Richieste",
    back:"🔙 Indietro",
    sent:"✅ Il tuo film è stato inviato all'amministratore per la revisione."
  },

  nl: {
    n:"🇳🇱 Nederlands",
    w:"🎬 Welkom bij de filmbot!",
    j:"⚠️ Word eerst lid van het kanaal.",
    g:"🎬 Film ophalen",
    s:"📤 Film sturen",
    l:"🌐 Taal wijzigen",
    menu:"☰ Menu",
    title:"📋 Hoofdmenu",
    prompt:"📤 Stuur hier je film of video.",
    empty:"🎬 Er zijn geen nieuwe films meer voor je.\n📤 Je kunt je eigen films sturen om het archief uit te breiden.",
    selected:"✅ Taal geselecteerd.",
    notMember:"❌ Je bent nog geen lid van het kanaal.",
    memberOk:"✅ Lidmaatschap bevestigd.",
    admin:"👑 Beheerderspaneel",
    stats:"📊 Statistieken",
    pending:"📥 Verzoeken",
    back:"🔙 Terug",
    sent:"✅ Je film is naar de beheerder gestuurd voor controle."
  },

  pl: {
    n:"🇵🇱 Polski",
    w:"🎬 Witamy w bocie filmowym!",
    j:"⚠️ Najpierw dołącz do kanału.",
    g:"🎬 Pobierz film",
    s:"📤 Wyślij film",
    l:"🌐 Zmień język",
    menu:"☰ Menu",
    title:"📋 Menu główne",
    prompt:"📤 Wyślij tutaj swój film lub wideo.",
    empty:"🎬 Nie ma już dla Ciebie nowych filmów.\n📤 Możesz wysyłać własne filmy, aby pomóc rozszerzyć archiwum.",
    selected:"✅ Wybrano język.",
    notMember:"❌ Nie dołączyłeś jeszcze do kanału.",
    memberOk:"✅ Członkostwo potwierdzone.",
    admin:"👑 Panel administratora",
    stats:"📊 Statystyki",
    pending:"📥 Żądania",
    back:"🔙 Wstecz",
    sent:"✅ Twój film został wysłany administratorowi do sprawdzenia."
  },

  id: {
    n:"🇮🇩 Bahasa Indonesia",
    w:"🎬 Selamat datang di bot film!",
    j:"⚠️ Bergabunglah dengan saluran terlebih dahulu.",
    g:"🎬 Dapatkan Film",
    s:"📤 Kirim Film",
    l:"🌐 Ganti Bahasa",
    menu:"☰ Menu",
    title:"📋 Menu Utama",
    prompt:"📤 Kirim film atau video Anda di sini.",
    empty:"🎬 Tidak ada film baru yang tersisa untuk Anda.\n📤 Anda dapat mengirim film sendiri untuk membantu memperluas arsip bot.",
    selected:"✅ Bahasa dipilih.",
    notMember:"❌ Anda belum bergabung dengan saluran.",
    memberOk:"✅ Keanggotaan dikonfirmasi.",
    admin:"👑 Panel Admin",
    stats:"📊 Statistik",
    pending:"📥 Permintaan",
    back:"🔙 Kembali",
    sent:"✅ Film Anda dikirim ke admin untuk ditinjau."
  },

  vi: {
    n:"🇻🇳 Tiếng Việt",
    w:"🎬 Chào mừng bạn đến với bot phim!",
    j:"⚠️ Hãy tham gia kênh trước.",
    g:"🎬 Nhận phim",
    s:"📤 Gửi phim",
    l:"🌐 Đổi ngôn ngữ",
    menu:"☰ Menu",
    title:"📋 Menu chính",
    prompt:"📤 Gửi phim hoặc video của bạn tại đây.",
    empty:"🎬 Không còn phim mới cho bạn.\n📤 Bạn có thể gửi phim của mình để giúp mở rộng kho lưu trữ.",
    selected:"✅ Đã chọn ngôn ngữ.",
    notMember:"❌ Bạn chưa tham gia kênh.",
    memberOk:"✅ Đã xác nhận thành viên.",
    admin:"👑 Bảng quản trị",
    stats:"📊 Thống kê",
    pending:"📥 Yêu cầu",
    back:"🔙 Quay lại",
    sent:"✅ Phim của bạn đã được gửi cho quản trị viên để xem xét."
  }
};
export class FilmBot extends DurableObject {

  constructor(ctx, env) {
    super(ctx, env);

    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        lang TEXT NOT NULL DEFAULT 'fa',
        state TEXT NOT NULL DEFAULT 'normal',
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS movies (
        id TEXT PRIMARY KEY,
        file_id TEXT NOT NULL,
        type TEXT NOT NULL,
        owner_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pending (
        id TEXT PRIMARY KEY,
        file_id TEXT NOT NULL,
        type TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        chat_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS history (
        user_id INTEGER NOT NULL,
        movie_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY(user_id, movie_id)
      );

      CREATE TABLE IF NOT EXISTS ratings (
        movie_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY(movie_id, user_id)
      );
    `);
  }

  async setUser(userId, lang, state = "normal") {
    this.ctx.storage.sql.exec(
      `INSERT INTO users
       (id, lang, state, created_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id)
       DO UPDATE SET
         lang = excluded.lang,
         state = excluded.state`,
      userId,
      lang,
      state,
      Date.now()
    );
  }

  async getUser(userId) {
    const rows = this.ctx.storage.sql
      .exec(
        `SELECT *
         FROM users
         WHERE id = ?`,
        userId
      )
      .toArray();

    return rows.length > 0
      ? rows[0]
      : null;
  }

  async setState(userId, state) {
    this.ctx.storage.sql.exec(
      `UPDATE users
       SET state = ?
       WHERE id = ?`,
      state,
      userId
    );
  }

  async addPending(item) {
    this.ctx.storage.sql.exec(
      `INSERT INTO pending
       (id, file_id, type, user_id, chat_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      item.id,
      item.fileId,
      item.type,
      item.userId,
      item.chatId,
      Date.now()
    );
  }

  async getPending(id) {
    return this.ctx.storage.sql
      .exec(
        `SELECT *
         FROM pending
         WHERE id = ?`,
        id
      )
      .one();
  }

  async deletePending(id) {
    this.ctx.storage.sql.exec(
      `DELETE FROM pending
       WHERE id = ?`,
      id
    );
  }

  async approvePending(id) {
    const item =
      await this.getPending(id);

    if (!item) {
      return null;
    }

    this.ctx.storage.sql.exec(
      `INSERT OR IGNORE INTO movies
       (id, file_id, type, owner_id, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      item.id,
      item.file_id,
      item.type,
      item.user_id,
      Date.now()
    );

    await this.deletePending(id);

    return item;
  }

  async rejectPending(id) {
    const item =
      await this.getPending(id);

    if (!item) {
      return null;
    }

    await this.deletePending(id);

    return item;
  }
    async getRandomMovie(userId) {
    const row = this.ctx.storage.sql
      .exec(
        `SELECT m.*
         FROM movies m
         WHERE NOT EXISTS (
           SELECT 1 FROM history h
           WHERE h.user_id = ?
           AND h.movie_id = m.id
         )
         ORDER BY RANDOM()
         LIMIT 1`,
        userId
      )
      .one();

    if (row) {
      this.ctx.storage.sql.exec(
        `INSERT OR IGNORE INTO history
         (user_id, movie_id, created_at)
         VALUES (?, ?, ?)`,
        userId,
        row.id,
        Date.now()
      );

      return row;
    }

    this.ctx.storage.sql.exec(
      `DELETE FROM history
       WHERE user_id = ?`,
      userId
    );

    return this.ctx.storage.sql
      .exec(
        `SELECT *
         FROM movies
         ORDER BY RANDOM()
         LIMIT 1`
      )
      .one();
  }

  async rate(movieId, userId, rating) {
    if (rating < 1 || rating > 5) {
      return false;
    }

    this.ctx.storage.sql.exec(
      `INSERT INTO ratings
       (movie_id, user_id, rating, created_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(movie_id, user_id)
       DO UPDATE SET
         rating = excluded.rating,
         created_at = excluded.created_at`,
      movieId,
      userId,
      rating,
      Date.now()
    );

    return true;
  }

  async stats() {
    const users = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c
         FROM users`
      )
      .one().c;

    const movies = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c
         FROM movies`
      )
      .one().c;

    const pending = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c
         FROM pending`
      )
      .one().c;

    const ratings = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c
         FROM ratings`
      )
      .one().c;

    return {
      users,
      movies,
      pending,
      ratings
    };
  }
}
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (
        request.method === "GET" &&
        url.pathname === "/"
      ) {
        return new Response(
          "🎬 FILM BOT ONLINE"
        );
      }

      if (
        request.method === "GET" &&
        url.pathname === "/setup"
      ) {
        const key =
          url.searchParams.get("key");

        if (
          !env.SETUP_KEY ||
          key !== env.SETUP_KEY
        ) {
          return new Response(
            "Unauthorized",
            { status: 401 }
          );
        }

        const result = await tg(
          env,
          "setWebhook",
          {
            url: url.origin + "/",
            allowed_updates: [
              "message",
              "callback_query"
            ]
          }
        );

        return Response.json(result);
      }

      if (request.method !== "POST") {
        return new Response("OK");
      }

      const update =
        await request.json();

      if (update.message) {
        await handleMessage(
          update.message,
          env,
          ctx
        );
      }

      if (update.callback_query) {
        await handleCallback(
          update.callback_query,
          env,
          ctx
        );
      }

      return new Response("OK");

    } catch (error) {
      console.log(
        "WORKER ERROR:",
        error
      );

      return new Response("OK");
    }
  }
};

function db(env) {
  const id =
    env.FILM_BOT.idFromName("main");

  return env.FILM_BOT.get(id);
}
async function handleMessage(m, env, ctx) {
  if (!m.chat) return;

  const userId =
    m.from?.id || m.chat.id;

  const chatId = m.chat.id;
  const text = m.text || "";
  const object = db(env);

  let user =
    await object.getUser(userId);

  if (!user) {
    await object.setUser(
      userId,
      "fa",
      "normal"
    );

    user =
      await object.getUser(userId);
  }

  if (text === "/start") {
    await object.setState(
      userId,
      "normal"
    );

    await languageMenu(
      chatId,
      env
    );

    return;
  }

  if (
    text === "/admin" &&
    isAdmin(userId, env)
  ) {
    await adminMenu(
      chatId,
      env
    );

    return;
  }

  if (
    text === "👑 پنل مدیریت" &&
    isAdmin(userId, env)
  ) {
    await adminMenu(
      chatId,
      env
    );

    return;
  }

  const lang =
    LANGS[user.lang]
      ? user.lang
      : "fa";

  const l = LANGS[lang];

  if (text === l.menu) {
    await mainMenu(
      chatId,
      userId,
      env
    );
    return;
  }

  if (
    !(await member(userId, env))
  ) {
    await join(
      chatId,
      lang,
      env
    );
    return;
  }

  if (text === l.g) {
    await getMovie(
      chatId,
      userId,
      env
    );
    return;
  }

  if (text === l.s) {
    await object.setState(
      userId,
      "waiting_movie"
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text: l.prompt
      }
    );

    return;
  }

  if (text === l.l) {
    await languageMenu(
      chatId,
      env
    );
    return;
  }

  if (m.video || m.photo) {
    const freshUser =
      await object.getUser(userId);

    if (
      freshUser?.state !==
      "waiting_movie"
    ) {
      return;
    }

    await receiveMovie(
      m,
      env
    );
  }
}
async function handleCallback(q, env, ctx) {
  const data = q.data || "";
  const userId = q.from.id;
  const chatId = q.message?.chat?.id;
  const object = db(env);

  const user =
    await object.getUser(userId);

  const lang =
    user?.lang || "fa";

  const l =
    LANGS[lang] || LANGS.fa;

  if (data.startsWith("lang|")) {
    const selected =
      data.split("|")[1];

    if (!LANGS[selected]) {
      await answer(
        q.id,
        "❌ Invalid language.",
        env
      );
      return;
    }

    await object.setUser(
      userId,
      selected,
      "normal"
    );

    await answer(
      q.id,
      LANGS[selected].selected,
      env
    );

    await join(
      chatId,
      selected,
      env
    );

    return;
  }

  if (data === "menu") {
    await mainMenu(
      chatId,
      userId,
      env
    );

    await answer(
      q.id,
      "",
      env
    );

    return;
  }

  if (data === "close_menu") {
    await answer(
      q.id,
      "",
      env
    );

    if (q.message) {
      await tg(
        env,
        "deleteMessage",
        {
          chat_id: chatId,
          message_id:
            q.message.message_id
        }
      );
    }

    return;
  }

  if (data.startsWith("check|")) {
    if (
      !(await member(
        userId,
        env
      ))
    ) {
      await answer(
        q.id,
        l.notMember,
        env
      );

      await join(
        chatId,
        lang,
        env
      );

      return;
    }

    await answer(
      q.id,
      l.memberOk,
      env
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text: l.w,
        reply_markup:
          keyboard(
            lang,
            isAdmin(
              userId,
              env
            )
          )
      }
    );

    return;
  }

  if (data.startsWith("rate|")) {
    const [
      ,
      movieId,
      ratingText
    ] = data.split("|");

    const rating =
      Number(ratingText);

    await object.rate(
      movieId,
      userId,
      rating
    );

    await answer(
      q.id,
      `⭐ ${rating}/5`,
      env
    );

    if (q.message) {
      await tg(
        env,
        "editMessageReplyMarkup",
        {
          chat_id: chatId,
          message_id:
            q.message.message_id,
          reply_markup: {
            inline_keyboard: [[
              {
                text:
                  `⭐ ${rating}/5`,
                callback_data:
                  "rated"
              }
            ]]
          }
        }
      );
    }

    return;
  }
    if (
    data.startsWith("approve|") ||
    data.startsWith("reject|")
  ) {
    if (
      !isAdmin(
        userId,
        env
      )
    ) {
      await answer(
        q.id,
        "⛔ دسترسی ندارید.",
        env
      );
      return;
    }

    const approve =
      data.startsWith("approve|");

    const id =
      data.split("|")[1];

    const item =
      approve
        ? await object.approvePending(id)
        : await object.rejectPending(id);

    if (!item) {
      await answer(
        q.id,
        "❌ درخواست پیدا نشد.",
        env
      );
      return;
    }

    await answer(
      q.id,
      approve
        ? "✅ فیلم تأیید شد."
        : "❌ فیلم رد شد.",
      env
    );

    const targetLang =
      (await object.getUser(
        item.user_id
      ))?.lang || "fa";

    const target =
      LANGS[targetLang] ||
      LANGS.fa;

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          item.chat_id,

        text:
          approve
            ? `🎉 ${target.sent}`
            : "❌ فیلم شما تأیید نشد."
      }
    );

    if (q.message) {
      await tg(
        env,
        "editMessageReplyMarkup",
        {
          chat_id:
            q.message.chat.id,

          message_id:
            q.message.message_id,

          reply_markup: {
            inline_keyboard: []
          }
        }
      );
    }

    return;
  }

  if (data === "admin") {
    if (
      !isAdmin(
        userId,
        env
      )
    ) {
      return;
    }

    await adminMenu(
      chatId,
      env
    );

    await answer(
      q.id,
      "👑",
      env
    );

    return;
  }

  if (data === "admin_stats") {
    if (
      !isAdmin(
        userId,
        env
      )
    ) {
      return;
    }

    const stats =
      await object.stats();

    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,

        text:
`📊 آمار ربات

👥 کاربران: ${stats.users}
🎬 فیلم‌های تأییدشده: ${stats.movies}
📥 درخواست‌های در انتظار: ${stats.pending}
⭐ تعداد امتیازها: ${stats.ratings}`
      }
    );

    await answer(
      q.id,
      "📊",
      env
    );

    return;
  }

  if (data === "admin_pending") {
    if (
      !isAdmin(
        userId,
        env
      )
    ) {
      return;
    }

    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "📥 فیلم‌های ارسالی کاربران در آرشیو مدیر با دکمه‌های تأیید و رد نمایش داده می‌شوند."
      }
    );

    await answer(
      q.id,
      "📥",
      env
    );
  }
}
async function languageMenu(chatId, env) {
  const keys = Object.keys(LANGS);
  const rows = [];

  for (let i = 0; i < keys.length; i += 2) {
    const row = [
      {
        text: LANGS[keys[i]].n,
        callback_data:
          "lang|" + keys[i]
      }
    ];

    if (keys[i + 1]) {
      row.push({
        text:
          LANGS[keys[i + 1]].n,
        callback_data:
          "lang|" + keys[i + 1]
      });
    }

    rows.push(row);
  }

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text:
        "🌐 لطفاً زبان خود را انتخاب کنید:",
      reply_markup: {
        inline_keyboard: rows
      }
    }
  );
}

function keyboard(lang, admin) {
  const l =
    LANGS[lang] || LANGS.fa;

  const rows = [
    [
      {
        text: l.menu
      }
    ]
  ];

  if (admin) {
    rows.push([
      {
        text: l.admin
      }
    ]);
  }

  return {
    keyboard: rows,
    resize_keyboard: true,
    is_persistent: true
  };
}

async function mainMenu(
  chatId,
  userId,
  env
) {
  const user =
    await db(env).getUser(userId);

  const lang =
    user?.lang || "fa";

  const l =
    LANGS[lang] || LANGS.fa;

  const buttons = [
    [
      {
        text: l.g,
        callback_data: "get_movie"
      }
    ],
    [
      {
        text: l.s,
        callback_data: "send_movie"
      }
    ],
    [
      {
        text: l.l,
        callback_data: "change_language"
      }
    ]
  ];

  if (isAdmin(userId, env)) {
    buttons.push([
      {
        text: l.admin,
        callback_data: "admin"
      }
    ]);
  }

  buttons.push([
    {
      text: l.back,
      callback_data: "close_menu"
    }
  ]);

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: l.title,
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  );
}
async function join(chatId, lang, env) {
  const l =
    LANGS[lang] || LANGS.fa;

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: l.j,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📢 " +
                (lang === "fa"
                  ? "عضویت در کانال"
                  : "Join Channel"),
              url: CHANNEL_LINK
            }
          ],
          [
            {
              text:
                "✅ " +
                (lang === "fa"
                  ? "بررسی عضویت"
                  : "Check Membership"),
              callback_data:
                "check|" + lang
            }
          ]
        ]
      }
    }
  );
}

async function getMovie(
  chatId,
  userId,
  env
) {
  if (
    !(await member(
      userId,
      env
    ))
  ) {
    const user =
      await db(env)
        .getUser(userId);

    await join(
      chatId,
      user?.lang || "fa",
      env
    );

    return;
  }

  const movie =
    await db(env)
      .getRandomMovie(userId);

  if (!movie) {
    const user =
      await db(env)
        .getUser(userId);

    const l =
      LANGS[user?.lang] ||
      LANGS.fa;

    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text: l.empty
      }
    );

    return;
  }

  const method =
    movie.type === "video"
      ? "sendVideo"
      : "sendPhoto";

  const mediaField =
    movie.type === "video"
      ? "video"
      : "photo";

  const result =
    await tg(
      env,
      method,
      {
        chat_id: chatId,

        [mediaField]:
          movie.file_id,

        caption:
          "🎬 فیلم برای شما ارسال شد.\n\n" +
          "⏳ این پیام بعد از ۲۰ ثانیه حذف می‌شود.\n" +
          "⭐ امتیاز خودت را انتخاب کن:",

        reply_markup: {
          inline_keyboard: [[
            {
              text: "⭐ 1",
              callback_data:
                `rate|${movie.id}|1`
            },
            {
              text: "⭐ 2",
              callback_data:
                `rate|${movie.id}|2`
            },
            {
              text: "⭐ 3",
              callback_data:
                `rate|${movie.id}|3`
            },
            {
              text: "⭐ 4",
              callback_data:
                `rate|${movie.id}|4`
            },
            {
              text: "⭐ 5",
              callback_data:
                `rate|${movie.id}|5`
            }
          ]]
        }
      }
    );

  if (!result.ok) {
    console.log(
      "Send movie error:",
      result
    );
    return;
  }

  const deleteId =
    env.FILM_DELETE.idFromName(
      `delete:${chatId}:${result.result.message_id}`
    );

  const deleteObject =
    env.FILM_DELETE.get(
      deleteId
    );

  await deleteObject.scheduleDelete(
    chatId,
    result.result.message_id,
    DELETE_AFTER
  );
}
async function receiveMovie(m, env) {
  const userId =
    m.from?.id || m.chat.id;

  const chatId =
    m.chat.id;

  const object =
    db(env);

  const user =
    await object.getUser(userId);

  if (
    !user ||
    user.state !== "waiting_movie"
  ) {
    return;
  }

  let fileId;
  let type;

  if (m.video) {
    fileId =
      m.video.file_id;
    type = "video";
  } else if (m.photo) {
    fileId =
      m.photo[
        m.photo.length - 1
      ].file_id;
    type = "photo";
  } else {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "❌ فقط فیلم یا عکس ارسال کنید."
      }
    );
    return;
  }

  const id =
    Date.now() +
    "_" +
    userId +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8);

  await object.addPending({
    id,
    fileId,
    type,
    userId,
    chatId
  });

  await object.setState(
    userId,
    "normal"
  );

  const result =
    await tg(
      env,
      type === "video"
        ? "sendVideo"
        : "sendPhoto",
      {
        chat_id:
          ARCHIVE_CHAT_ID,

        [type === "video"
          ? "video"
          : "photo"]:
          fileId,

        caption:
          "📥 محتوای جدید برای بررسی\n\n" +
          "👤 کاربر: " +
          userId +
          "\n" +
          "🆔 درخواست: " +
          id,

        reply_markup: {
          inline_keyboard: [[
            {
              text: "✅ تأیید",
              callback_data:
                "approve|" + id
            },
            {
              text: "❌ رد",
              callback_data:
                "reject|" + id
            }
          ]]
        }
      }
    );

  if (!result.ok) {
    console.log(
      "Archive send error:",
      result
    );

    await object.deletePending(id);

    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "❌ ارسال فیلم برای مدیر انجام نشد. دوباره تلاش کنید."
      }
    );

    return;
  }

  const lang =
    user.lang || "fa";

  const l =
    LANGS[lang] || LANGS.fa;

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: l.sent
    }
  );
}
async function member(userId, env) {
  try {
    const result =
      await tg(
        env,
        "getChatMember",
        {
          chat_id: CHANNEL,
          user_id: userId
        }
      );

    return (
      result.ok &&
      [
        "creator",
        "administrator",
        "member",
        "restricted"
      ].includes(
        result.result.status
      )
    );

  } catch {
    return false;
  }
}

function isAdmin(userId, env) {
  return (
    String(userId) ===
    String(env.ADMIN_ID)
  );
}

async function answer(
  id,
  text,
  env
) {
  await tg(
    env,
    "answerCallbackQuery",
    {
      callback_query_id: id,
      text: text
    }
  );
}

async function tg(
  env,
  method,
  body
) {
  if (!env.BOT_TOKEN) {
    throw new Error(
      "BOT_TOKEN missing"
    );
  }

  const response =
    await fetch(
      `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(body)
      }
    );

  return response.json();
}
export class FilmMessageDelete
  extends DurableObject {

  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
  }

  async scheduleDelete(
    chatId,
    messageId,
    delay
  ) {
    await this.ctx.storage.put(
      "chatId",
      chatId
    );

    await this.ctx.storage.put(
      "messageId",
      messageId
    );

    await this.ctx.storage.setAlarm(
      Date.now() + delay
    );
  }

  async alarm() {
    const chatId =
      await this.ctx.storage.get(
        "chatId"
      );

    const messageId =
      await this.ctx.storage.get(
        "messageId"
      );

    if (
      chatId === undefined ||
      messageId === undefined
    ) {
      return;
    }

    try {
      const result =
        await tg(
          this.env,
          "deleteMessage",
          {
            chat_id: chatId,
            message_id: messageId
          }
        );

      if (!result.ok) {
        console.log(
          "Delete message failed:",
          result
        );
      }

    } catch (error) {
      console.log(
        "Delete message error:",
        error
      );
    }

    await this.ctx.storage.deleteAllگ();
  }
  }
