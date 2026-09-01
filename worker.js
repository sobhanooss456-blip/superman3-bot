import { DurableObject } from "cloudflare:workers";

const CHANNEL = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";
const ARCHIVE_CHAT_ID = "-1004374846750";
const DELETE_AFTER = 20_000;

const LANGS = {
  fa:{n:"🇮🇷 فارسی",w:"🎬 به ربات فیلم خوش آمدید!",j:"⚠️ ابتدا عضو کانال شوید.",g:"🎬 دریافت فیلم",s:"📤 ارسال فیلم",l:"🌐 تغییر زبان"},
  en:{n:"🇬🇧 English",w:"🎬 Welcome!",j:"⚠️ Join the channel first.",g:"🎬 Get Movie",s:"📤 Send Movie",l:"🌐 Change Language"},
  ar:{n:"🇸🇦 العربية",w:"🎬 أهلاً بك!",j:"⚠️ انضم إلى القناة أولاً.",g:"🎬 الحصول على فيلم",s:"📤 إرسال فيلم",l:"🌐 تغيير اللغة"},
  tr:{n:"🇹🇷 Türkçe",w:"🎬 Hoş geldiniz!",j:"⚠️ Önce kanala katılın.",g:"🎬 Film Al",s:"📤 Film Gönder",l:"🌐 Dil Değiştir"},
  de:{n:"🇩🇪 Deutsch",w:"🎬 Willkommen!",j:"⚠️ Bitte zuerst beitreten.",g:"🎬 Film erhalten",s:"📤 Film senden",l:"🌐 Sprache ändern"},
  fr:{n:"🇫🇷 Français",w:"🎬 Bienvenue!",j:"⚠️ Rejoignez d'abord le canal.",g:"🎬 Obtenir un film",s:"📤 Envoyer un film",l:"🌐 Changer la langue"},
  es:{n:"🇪🇸 Español",w:"🎬 ¡Bienvenido!",j:"⚠️ Únete primero al canal.",g:"🎬 Obtener película",s:"📤 Enviar película",l:"🌐 Cambiar idioma"},
  pt:{n:"🇵🇹 Português",w:"🎬 Bem-vindo!",j:"⚠️ Entre primeiro no canal.",g:"🎬 Obter filme",s:"📤 Enviar filme",l:"🌐 Mudar idioma"},
  ru:{n:"🇷🇺 Русский",w:"🎬 Добро пожаловать!",j:"⚠️ Сначала вступите в канал.",g:"🎬 Получить фильм",s:"📤 Отправить фильм",l:"🌐 Изменить язык"},
  uk:{n:"🇺🇦 Українська",w:"🎬 Ласкаво просимо!",j:"⚠️ Спочатку приєднайтесь.",g:"🎬 Отримати фільм",s:"📤 Надіслати фільм",l:"🌐 Змінити мову"},
  hi:{n:"🇮🇳 हिन्दी",w:"🎬 स्वागत है!",j:"⚠️ पहले चैनल से जुड़ें।",g:"🎬 फिल्म प्राप्त करें",s:"📤 फिल्म भेजें",l:"🌐 भाषा बदलें"},
  ur:{n:"🇵🇰 اردو",w:"🎬 خوش آمدید!",j:"⚠️ پہلے چینل میں شامل ہوں۔",g:"🎬 فلم حاصل کریں",s:"📤 فلم بھیجیں",l:"🌐 زبان تبدیل کریں"},
  zh:{n:"🇨🇳 中文",w:"🎬 欢迎!",j:"⚠️ 请先加入频道。",g:"🎬 获取电影",s:"📤 发送电影",l:"🌐 更改语言"},
  ja:{n:"🇯🇵 日本語",w:"🎬 ようこそ!",j:"⚠️ 先にチャンネルへ参加してください。",g:"🎬 映画を取得",s:"📤 映画を送信",l:"🌐 言語を変更"},
  ko:{n:"🇰🇷 한국어",w:"🎬 환영합니다!",j:"⚠️ 먼저 채널에 가입하세요.",g:"🎬 영화 받기",s:"📤 영화 보내기",l:"🌐 언어 변경"},
  it:{n:"🇮🇹 Italiano",w:"🎬 Benvenuto!",j:"⚠️ Prima entra nel canale.",g:"🎬 Ottieni film",s:"📤 Invia film",l:"🌐 Cambia lingua"},
  nl:{n:"🇳🇱 Nederlands",w:"🎬 Welkom!",j:"⚠️ Word eerst lid van het kanaal.",g:"🎬 Film ophalen",s:"📤 Film sturen",l:"🌐 Taal wijzigen"},
  pl:{n:"🇵🇱 Polski",w:"🎬 Witamy!",j:"⚠️ Najpierw dołącz do kanału.",g:"🎬 Pobierz film",s:"📤 Wyślij film",l:"🌐 Zmień język"},
  id:{n:"🇮🇩 Bahasa Indonesia",w:"🎬 Selamat datang!",j:"⚠️ Bergabunglah terlebih dahulu.",g:"🎬 Dapatkan Film",s:"📤 Kirim Film",l:"🌐 Ganti Bahasa"},
  vi:{n:"🇻🇳 Tiếng Việt",w:"🎬 Chào mừng!",j:"⚠️ Hãy tham gia kênh trước.",g:"🎬 Nhận phim",s:"📤 Gửi phim",l:"🌐 Đổi ngôn ngữ"}
};

/* =========================
   پایگاه داده اصلی ربات
========================= */

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
      `INSERT INTO users(id,lang,state,created_at)
       VALUES(?,?,?,?)
       ON CONFLICT(id)
       DO UPDATE SET lang=excluded.lang,state=excluded.state`,
      userId,
      lang,
      state,
      Date.now()
    );
  }

  async getUser(userId) {
    return this.ctx.storage.sql
      .exec(`SELECT * FROM users WHERE id=?`, userId)
      .one();
  }

  async setState(userId, state) {
    this.ctx.storage.sql.exec(
      `UPDATE users SET state=? WHERE id=?`,
      state,
      userId
    );
  }

  async addPending(item) {
    this.ctx.storage.sql.exec(
      `INSERT INTO pending
       (id,file_id,type,user_id,chat_id,created_at)
       VALUES(?,?,?,?,?,?)`,
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
      .exec(`SELECT * FROM pending WHERE id=?`, id)
      .one();
  }

  async deletePending(id) {
    this.ctx.storage.sql.exec(
      `DELETE FROM pending WHERE id=?`,
      id
    );
  }

  async approvePending(id) {
    const item = await this.getPending(id);

    if (!item) return null;

    this.ctx.storage.sql.exec(
      `INSERT OR IGNORE INTO movies
       (id,file_id,type,owner_id,created_at)
       VALUES(?,?,?,?,?)`,
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
    const item = await this.getPending(id);

    if (!item) return null;

    await this.deletePending(id);

    return item;
  }

  async getRandomMovie(userId) {
    let row = this.ctx.storage.sql
      .exec(`
        SELECT m.*
        FROM movies m
        WHERE NOT EXISTS (
          SELECT 1
          FROM history h
          WHERE h.user_id=? AND h.movie_id=m.id
        )
        ORDER BY RANDOM()
        LIMIT 1
      `, userId)
      .one();

    if (row) {
      this.ctx.storage.sql.exec(
        `INSERT OR IGNORE INTO history
         (user_id,movie_id,created_at)
         VALUES(?,?,?)`,
        userId,
        row.id,
        Date.now()
      );

      return row;
    }

    this.ctx.storage.sql.exec(
      `DELETE FROM history WHERE user_id=?`,
      userId
    );

    return this.ctx.storage.sql
      .exec(`SELECT * FROM movies ORDER BY RANDOM() LIMIT 1`)
      .one();
  }

  async rate(movieId, userId, rating) {
    if (rating < 1 || rating > 5) return false;

    this.ctx.storage.sql.exec(
      `INSERT INTO ratings
       (movie_id,user_id,rating,created_at)
       VALUES(?,?,?,?)
       ON CONFLICT(movie_id,user_id)
       DO UPDATE SET
         rating=excluded.rating,
         created_at=excluded.created_at`,
      movieId,
      userId,
      rating,
      Date.now()
    );

    return true;
  }

  async stats() {
    const users = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) AS c FROM users`)
      .one().c;

    const movies = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) AS c FROM movies`)
      .one().c;

    const pending = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) AS c FROM pending`)
      .one().c;

    const ratings = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) AS c FROM ratings`)
      .one().c;

    return { users, movies, pending, ratings };
  }

  async getAllUsers() {
    return this.ctx.storage.sql
      .exec(`SELECT id FROM users`)
      .toArray()
      .map(x => x.id);
  }
}

/* =========================
   Worker اصلی
========================= */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/") {
        return new Response("🎬 FILM BOT ONLINE");
      }

      if (request.method === "GET" && url.pathname === "/setup") {
        const key = url.searchParams.get("key");

        if (!env.SETUP_KEY || key !== env.SETUP_KEY) {
          return new Response("Unauthorized", {
            status: 401
          });
        }

        const result = await tg(env, "setWebhook", {
          url: url.origin + "/",
          allowed_updates: [
            "message",
            "callback_query"
          ]
        });

        return Response.json(result);
      }

      if (request.method !== "POST") {
        return new Response("OK");
      }

      const update = await request.json();

      if (update.message) {
        await handleMessage(update.message, env, ctx);
      }

      if (update.callback_query) {
        await handleCallback(update.callback_query, env, ctx);
      }

      return new Response("OK");

    } catch (err) {
      console.log(err);
      return new Response("OK");
    }
  }
};

/* =========================
   اتصال به FilmBot
========================= */

function db(env) {
  const id = env.FILM_BOT.idFromName("main");
  return env.FILM_BOT.get(id);
}

/* =========================
   پیام‌های کاربر
========================= */

async function handleMessage(m, env, ctx) {
  if (!m.chat) return;

  const userId = m.from?.id || m.chat.id;
  const chatId = m.chat.id;
  const text = m.text || "";

  const object = db(env);

  let user = await object.getUser(userId);

  if (!user) {
    await object.setUser(userId, "fa", "normal");
    user = await object.getUser(userId);
  }

  if (text === "/start") {
    await object.setState(userId, "normal");
    await languageMenu(chatId, env);
    return;
  }

  if (text === "/admin" && isAdmin(userId, env)) {
    await adminMenu(chatId, env);
    return;
  }

  if (text === "👑 پنل مدیریت" && isAdmin(userId, env)) {
    await adminMenu(chatId, env);
    return;
  }

  if (!(await member(userId, env))) {
    await join(chatId, user.lang, env);
    return;
  }

  const lang = LANGS[user.lang]
    ? user.lang
    : "fa";

  const l = LANGS[lang];

  if (text === l.g) {
    await getMovie(chatId, userId, env);
    return;
  }

  if (text === l.s) {
    await object.setState(
      userId,
      "waiting_movie"
    );

    await tg(env, "sendMessage", {
      chat_id: chatId,
      text: "📤 فیلم یا ویدیوی خودت را همینجا ارسال کن."
    });

    return;
  }

  if (text === l.l) {
    await languageMenu(chatId, env);
    return;
  }

  if (m.video || m.photo) {
    const freshUser = await object.getUser(userId);

    if (freshUser?.state !== "waiting_movie") {
      return;
    }

    await receiveMovie(m, env);
  }
}

/* =========================
   دکمه‌های شیشه‌ای
========================= */

async function handleCallback(q, env, ctx) {
  const data = q.data || "";
  const userId = q.from.id;
  const chatId = q.message?.chat?.id;

  const object = db(env);
  const user = await object.getUser(userId);

  const lang = user?.lang || "fa";

  /* انتخاب زبان */

  if (data.startsWith("lang|")) {
    const selected = data.split("|")[1];

    if (!LANGS[selected]) {
      await answer(
        q.id,
        "❌ زبان نامعتبر است.",
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
      "✅ زبان انتخاب شد.",
      env
    );

    await join(
      chatId,
      selected,
      env
    );

    return;
  }

  /* بررسی عضویت */

  if (data.startsWith("check|")) {
    if (!(await member(userId, env))) {
      await answer(
        q.id,
        "❌ هنوز عضو کانال نیستید.",
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
      "✅ عضویت تأیید شد.",
      env
    );

    await tg(env, "sendMessage", {
      chat_id: chatId,
      text: LANGS[lang].w,
      reply_markup: keyboard(
        lang,
        isAdmin(userId, env)
      )
    });

    return;
  }

  /* امتیاز */

  if (data.startsWith("rate|")) {
    const [, movieId, ratingText] =
      data.split("|");

    const rating = Number(ratingText);

    await object.rate(
      movieId,
      userId,
      rating
    );

    await answer(
      q.id,
      `⭐ امتیاز ${rating} ثبت شد.`,
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
                  `⭐ امتیاز شما: ${rating}/5`,
                callback_data: "rated"
              }
            ]]
          }
        }
      );
    }

    return;
  }

  /* تأیید یا رد فیلم */

  if (
    data.startsWith("approve|") ||
    data.startsWith("reject|")
  ) {
    if (!isAdmin(userId, env)) {
      await answer(
        q.id,
        "⛔ دسترسی ندارید.",
        env
      );
      return;
    }

    const approve =
      data.startsWith("approve|");

    const id = data.split("|")[1];

    const item = approve
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

    await tg(env, "sendMessage", {
      chat_id: item.chat_id,
      text: approve
        ? "🎉 فیلم شما تأیید شد و وارد آرشیو شد."
        : "❌ فیلم شما تأیید نشد."
    });

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

  /* پنل مدیریت */

  if (data === "admin") {
    if (!isAdmin(userId, env))
      return;

    await adminMenu(
      chatId,
      env
    );

    await answer(
      q.id,
      "👑 پنل مدیریت",
      env
    );

    return;
  }

  /* آمار */

  if (data === "admin_stats") {
    if (!isAdmin(userId, env))
      return;

    const stats =
      await object.stats();

    await tg(env, "sendMessage", {
      chat_id: chatId,
      text:
`📊 آمار ربات

👥 کاربران: ${stats.users}
🎬 فیلم‌های تأییدشده: ${stats.movies}
📥 درخواست‌های در انتظار: ${stats.pending}
⭐ تعداد امتیازها: ${stats.ratings}`
    });

    await answer(
      q.id,
      "📊 آمار ارسال شد.",
      env
    );

    return;
  }

  /* درخواست‌های در انتظار */

  if (data === "admin_pending") {
    if (!isAdmin(userId, env))
      return;

    await tg(env, "sendMessage", {
      chat_id: chatId,
      text:
        "📥 درخواست‌های فیلم از طریق کانال آرشیو و دکمه‌های تأیید/رد مدیریت می‌شوند."
    });

    await answer(
      q.id,
      "📥",
      env
    );

    return;
  }
}

/* =========================
   منوی زبان
========================= */

async function languageMenu(chatId, env) {
  const keys = Object.keys(LANGS);
  const rows = [];

  for (
    let i = 0;
    i < keys.length;
    i += 2
  ) {
    const row = [{
      text: LANGS[keys[i]].n,
      callback_data:
        "lang|" + keys[i]
    }];

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

  await tg(env, "sendMessage", {
    chat_id: chatId,
    text:
      "🌐 لطفاً زبان خود را انتخاب کنید:",
    reply_markup: {
      inline_keyboard: rows
    }
  });
}

/* =========================
   منوی اصلی
========================= */

function keyboard(lang, admin) {
  const l = LANGS[lang];

  const rows = [
    [
      { text: l.g },
      { text: l.s }
    ],
    [
      { text: l.l }
    ]
  ];

  if (admin) {
    rows.push([
      { text: "👑 پنل مدیریت" }
    ]);
  }

  return {
    keyboard: rows,
    resize_keyboard: true,
    is_persistent: true
  };
}

/* =========================
   پنل مدیریت
========================= */

async function adminMenu(chatId, env) {
  await tg(env, "sendMessage", {
    chat_id: chatId,
    text:
      "👑 پنل مدیریت\n\n" +
      "مدیریت ربات از این قسمت انجام می‌شود.",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📊 آمار",
            callback_data:
              "admin_stats"
          },
          {
            text: "📥 درخواست‌ها",
            callback_data:
              "admin_pending"
          }
        ]
      ]
    }
  });
}

/* =========================
   اجبار عضویت
========================= */

async function join(chatId, lang, env) {
  const l =
    LANGS[lang] || LANGS.fa;

  await tg(env, "sendMessage", {
    chat_id: chatId,
    text: l.j,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text:
              "📢 عضویت در کانال",
            url: CHANNEL_LINK
          }
        ],
        [
          {
            text:
              "✅ بررسی عضویت",
            callback_data:
              "check|" + lang
          }
        ]
      ]
    }
  });
}

/* =========================
   دریافت فیلم
========================= */

async function getMovie(
  chatId,
  userId,
  env
) {
  if (!(await member(
    userId,
    env
  ))) {
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
    await tg(env, "sendMessage", {
      chat_id: chatId,
      text:
        "😕 هنوز فیلمی در آرشیو وجود ندارد."
    });

    return;
  }

  const result = await tg(
    env,
    movie.type === "video"
      ? "sendVideo"
      : "sendPhoto",
    {
      chat_id: chatId,

      [movie.type === "video"
        ? "video"
        : "photo"]:
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

  if (!result.ok) return;

  /*
   * اتصال به Durable Object مخصوص حذف
   */

  const deleteId =
    env.FILM_DELETE.idFromName(
      `delete:${chatId}:${result.result.message_id}`
    );

  const deleteObject =
    env.FILM_DELETE.get(deleteId);

  await deleteObject.scheduleDelete(
    chatId,
    result.result.message_id,
    DELETE_AFTER
  );
}

/* =========================
   دریافت فیلم از کاربر
========================= */

async function receiveMovie(
  m,
  env
) {
  const userId =
    m.from?.id || m.chat.id;

  const chatId = m.chat.id;

  const object = db(env);

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
    fileId = m.video.file_id;
    type = "video";
  } else if (m.photo) {
    fileId =
      m.photo[
        m.photo.length - 1
      ].file_id;

    type = "photo";
  } else {
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

  await tg(
    env,
       type === "video"
      ? "sendVideo"
      : "sendPhoto",
    {
      chat_id: ARCHIVE_CHAT_ID,

      [type === "video"
        ? "video"
        : "photo"]: fileId,

      caption:
        "📥 محتوای جدید برای بررسی\n\n" +
        "👤 کاربر: " + userId + "\n" +
        "🆔 درخواست: " + id,

      reply_markup: {
        inline_keyboard: [[
          {
            text: "✅ تأیید",
            callback_data: "approve|" + id
          },
          {
            text: "❌ رد",
            callback_data: "reject|" + id
          }
        ]]
      }
    }
  );

  await tg(env, "sendMessage", {
    chat_id: chatId,
    text: "✅ فیلم شما برای بررسی مدیر ارسال شد."
  });
}


/*
 * بررسی عضویت کاربر در کانال
 */
async function member(userId, env) {
  try {
    const result = await tg(env, "getChatMember", {
      chat_id: CHANNEL,
      user_id: userId
    });

    return result.ok &&
      [
        "creator",
        "administrator",
        "member",
        "restricted"
      ].includes(result.result.status);

  } catch {
    return false;
  }
}


/*
 * بررسی مدیر بودن کاربر
 */
function isAdmin(userId, env) {
  return String(userId) === String(env.ADMIN_ID);
}


/*
 * پاسخ به دکمه‌های شیشه‌ای
 */
async function answer(id, text, env) {
  await tg(env, "answerCallbackQuery", {
    callback_query_id: id,
    text
  });
}


/*
 * ارتباط با Telegram Bot API
 */
async function tg(env, method, body) {
  if (!env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN missing");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  return response.json();
}


/*
 * Durable Object مخصوص حذف خودکار فیلم
 */
export class FilmMessageDelete extends DurableObject {

  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
  }

  async scheduleDelete(chatId, messageId, delay) {

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
      await this.ctx.storage.get("chatId");

    const messageId =
      await this.ctx.storage.get("messageId");

    if (!chatId || !messageId) {
      return;
    }

    try {

      await tg(
        this.env,
        "deleteMessage",
        {
          chat_id: chatId,
          message_id: messageId
        }
      );

    } catch (error) {

      console.log(
        "Delete message error:",
        error
      );

    }

    await this.ctx.storage.deleteAll();
  }
    }
