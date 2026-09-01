import { DurableObject } from "cloudflare:workers";

const CHANNEL = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";
const ARCHIVE_CHAT_ID = "-1004374846750";
const DELETE_AFTER = 20_000;

const LANGS = {
  fa: {
    n: "🇮🇷 فارسی",
    w: "🎬 به ربات فیلم خوش آمدید!",
    j: "⚠️ ابتدا عضو کانال شوید.",
    g: "🎬 دریافت فیلم",
    s: "📤 ارسال فیلم",
    l: "🌐 تغییر زبان"
  },
  en: {
    n: "🇬🇧 English",
    w: "🎬 Welcome!",
    j: "⚠️ Join the channel first.",
    g: "🎬 Get Movie",
    s: "📤 Send Movie",
    l: "🌐 Change Language"
  },
  ar: {
    n: "🇸🇦 العربية",
    w: "🎬 أهلاً بك!",
    j: "⚠️ انضم إلى القناة أولاً.",
    g: "🎬 الحصول على فيلم",
    s: "📤 إرسال فيلم",
    l: "🌐 تغيير اللغة"
  },
  tr: {
    n: "🇹🇷 Türkçe",
    w: "🎬 Hoş geldiniz!",
    j: "⚠️ Önce kanala katılın.",
    g: "🎬 Film Al",
    s: "📤 Film Gönder",
    l: "🌐 Dil Değiştir"
  },
  de: {
    n: "🇩🇪 Deutsch",
    w: "🎬 Willkommen!",
    j: "⚠️ Bitte zuerst beitreten.",
    g: "🎬 Film erhalten",
    s: "📤 Film senden",
    l: "🌐 Sprache ändern"
  },
  fr: {
    n: "🇫🇷 Français",
    w: "🎬 Bienvenue!",
    j: "⚠️ Rejoignez d'abord le canal.",
    g: "🎬 Obtenir un film",
    s: "📤 Envoyer un film",
    l: "🌐 Changer la langue"
  },
  es: {
    n: "🇪🇸 Español",
    w: "🎬 ¡Bienvenido!",
    j: "⚠️ Únete primero al canal.",
    g: "🎬 Obtener película",
    s: "📤 Enviar película",
    l: "🌐 Cambiar idioma"
  },
  pt: {
    n: "🇵🇹 Português",
    w: "🎬 Bem-vindo!",
    j: "⚠️ Entre primeiro no canal.",
    g: "🎬 Obter filme",
    s: "📤 Enviar filme",
    l: "🌐 Mudar idioma"
  },
  ru: {
    n: "🇷🇺 Русский",
    w: "🎬 Добро пожаловать!",
    j: "⚠️ Сначала вступите в канал.",
    g: "🎬 Получить фильм",
    s: "📤 Отправить фильм",
    l: "🌐 Изменить язык"
  },
  uk: {
    n: "🇺🇦 Українська",
    w: "🎬 Ласкаво просимо!",
    j: "⚠️ Спочатку приєднайтесь.",
    g: "🎬 Отримати фільм",
    s: "📤 Надіслати фільм",
    l: "🌐 Змінити мову"
  },
  hi: {
    n: "🇮🇳 हिन्दी",
    w: "🎬 स्वागत है!",
    j: "⚠️ पहले चैनल से जुड़ें।",
    g: "🎬 फिल्म प्राप्त करें",
    s: "📤 फिल्म भेजें",
    l: "🌐 भाषा बदलें"
  },
  ur: {
    n: "🇵🇰 اردو",
    w: "🎬 خوش آمدید!",
    j: "⚠️ پہلے چینل میں شامل ہوں۔",
    g: "🎬 فلم حاصل کریں",
    s: "📤 فلم بھیجیں",
    l: "🌐 زبان تبدیل کریں"
  },
  zh: {
    n: "🇨🇳 中文",
    w: "🎬 欢迎!",
    j: "⚠️ 请先加入频道。",
    g: "🎬 获取电影",
    s: "📤 发送电影",
    l: "🌐 更改语言"
  },
  ja: {
    n: "🇯🇵 日本語",
    w: "🎬 ようこそ!",
    j: "⚠️ 先にチャンネルへ参加してください。",
    g: "🎬 映画を取得",
    s: "📤 映画を送信",
    l: "🌐 言語を変更"
  },
  ko: {
    n: "🇰🇷 한국어",
    w: "🎬 환영합니다!",
    j: "⚠️ 먼저 채널에 가입하세요.",
    g: "🎬 영화 받기",
    s: "📤 영화 보내기",
    l: "🌐 언어 변경"
  },
  it: {
    n: "🇮🇹 Italiano",
    w: "🎬 Benvenuto!",
    j: "⚠️ Prima entra nel canale.",
    g: "🎬 Ottieni film",
    s: "📤 Invia film",
    l: "🌐 Cambia lingua"
  },
  nl: {
    n: "🇳🇱 Nederlands",
    w: "🎬 Welkom!",
    j: "⚠️ Word eerst lid van het kanaal.",
    g: "🎬 Film ophalen",
    s: "📤 Film sturen",
    l: "🌐 Taal wijzigen"
  },
  pl: {
    n: "🇵🇱 Polski",
    w: "🎬 Witamy!",
    j: "⚠️ Najpierw dołącz do kanału.",
    g: "🎬 Pobierz film",
    s: "📤 Wyślij film",
    l: "🌐 Zmień język"
  },
  id: {
    n: "🇮🇩 Bahasa Indonesia",
    w: "🎬 Selamat datang!",
    j: "⚠️ Bergabunglah terlebih dahulu.",
    g: "🎬 Dapatkan Film",
    s: "📤 Kirim Film",
    l: "🌐 Ganti Bahasa"
  },
  vi: {
    n: "🇻🇳 Tiếng Việt",
    w: "🎬 Chào mừng!",
    j: "⚠️ Hãy tham gia kênh trước.",
    g: "🎬 Nhận phim",
    s: "📤 Gửi phim",
    l: "🌐 Đổi ngôn ngữ"
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
      `INSERT INTO users(id, lang, state, created_at)
       VALUES(?,?,?,?)
       ON CONFLICT(id)
       DO UPDATE SET
         lang=excluded.lang,
         state=excluded.state`,
      userId,
      lang,
      state,
      Date.now()
    );
  }

  async getUser(userId) {
    return this.ctx.storage.sql
      .exec(
        `SELECT * FROM users WHERE id=?`,
        userId
      )
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
      .exec(
        `SELECT * FROM pending WHERE id=?`,
        id
      )
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

    if (!item) {
      return null;
    }

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
           SELECT 1
           FROM history h
           WHERE h.user_id=?
           AND h.movie_id=m.id
         )
         ORDER BY RANDOM()
         LIMIT 1`,
        userId
      )
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
      .exec(
        `SELECT * FROM movies
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
      .exec(
        `SELECT COUNT(*) AS c FROM users`
      )
      .one().c;

    const movies = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c FROM movies`
      )
      .one().c;

    const pending = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c FROM pending`
      )
      .one().c;

    const ratings = this.ctx.storage.sql
      .exec(
        `SELECT COUNT(*) AS c FROM ratings`
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

      // صفحه اصلی برای تست
      if (
        request.method === "GET" &&
        url.pathname === "/"
      ) {
        return new Response("🎬 FILM BOT ONLINE");
      }

      // تنظیم Webhook
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

      // فقط POST از طرف تلگرام
      if (request.method !== "POST") {
        return new Response("OK");
      }

      const update =
        await request.json();

      // پیام معمولی
      if (update.message) {
        await handleMessage(
          update.message,
          env,
          ctx
        );
      }

      // دکمه‌های شیشه‌ای
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


// اتصال به Durable Object اصلی
function db(env) {
  const id =
    env.FILM_BOT.idFromName("main");

  return env.FILM_BOT.get(id);
}
export class FilmMessageDelete extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
  }

  async scheduleDelete(chatId, messageId, delay) {
    await this.ctx.storage.put("chatId", chatId);
    await this.ctx.storage.put("messageId", messageId);

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
function isAdmin(userId, env) {
  return String(userId) === String(env.ADMIN_ID);
}

async function answer(id, text, env) {
  await tg(env, "answerCallbackQuery", {
    callback_query_id: id,
    text: text
  });
}

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

  const data = await response.json();

  if (!data.ok) {
    console.log(
      "Telegram API error:",
      data
    );
  }

  return data;
}
async function languageMenu(chatId, env) {
  const keys = Object.keys(LANGS);
  const rows = [];

  for (let i = 0; i < keys.length; i += 2) {
    const row = [
      {
        text: LANGS[keys[i]].n,
        callback_data: "lang|" + keys[i]
      }
    ];

    if (keys[i + 1]) {
      row.push({
        text: LANGS[keys[i + 1]].n,
        callback_data: "lang|" + keys[i + 1]
      });
    }

    rows.push(row);
  }

  await tg(env, "sendMessage", {
    chat_id: chatId,
    text: "🌐 لطفاً زبان خود را انتخاب کنید:",
    reply_markup: {
      inline_keyboard: rows
    }
  });
}


function keyboard(lang, admin) {
  const l = LANGS[lang] || LANGS.fa;

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
            callback_data: "admin_stats"
          },
          {
            text: "📥 درخواست‌ها",
            callback_data: "admin_pending"
          }
        ]
      ]
    }
  });
}
async function member(userId, env) {
  try {
    const result = await tg(
      env,
      "getChatMember",
      {
        chat_id: CHANNEL,
        user_id: userId
      }
    );

    if (!result.ok) {
      return false;
    }

    return [
      "creator",
      "administrator",
      "member",
      "restricted"
    ].includes(result.result.status);

  } catch (error) {
    console.log(
      "Membership check error:",
      error
    );

    return false;
  }
}


async function join(chatId, lang, env) {
  const l = LANGS[lang] || LANGS.fa;

  await tg(env, "sendMessage", {
    chat_id: chatId,
    text: l.j,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📢 عضویت در کانال",
            url: CHANNEL_LINK
          }
        ],
        [
          {
            text: "✅ بررسی عضویت",
            callback_data: "check|" + lang
          }
        ]
      ]
    }
  });
}
async function getMovie(chatId, userId, env) {
  const isMember = await member(userId, env);

  if (!isMember) {
    const user = await db(env).getUser(userId);

    await join(
      chatId,
      user?.lang || "fa",
      env
    );

    return;
  }

  const movie =
    await db(env).getRandomMovie(userId);

  if (!movie) {
    await tg(env, "sendMessage", {
      chat_id: chatId,
      text: "😕 هنوز فیلمی در آرشیو وجود ندارد."
    });

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

  const result = await tg(
    env,
    method,
    {
      chat_id: chatId,

      [mediaField]: movie.file_id,

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
    env.FILM_DELETE.get(deleteId);

  await deleteObject.scheduleDelete(
    chatId,
    result.result.message_id,
    DELETE_AFTER
  );
}
