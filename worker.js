const MOVIE_PAGE_SIZE = 10;
const USER_PAGE_SIZE = 10;
const HISTORY_TTL = 24 * 60 * 60 * 1000;
const REFERRAL_REWARD = 3;

const CHANNEL_ID = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";

const TEXT = {
  fa: {
    choose: "🌐 زبان خود را انتخاب کنید:",
    welcome: "🎬 به ربات فیلم خوش آمدید.",
    menu: "یکی از گزینه‌های زیر را انتخاب کنید:",
    get: "🎬 دریافت فیلم",
    send: "📤 ارسال فیلم",
    request: "📝 درخواست فیلم",
    fav: "❤️ مورد علاقه‌ها",
    history: "🕐 تاریخچه ۲۴ ساعت",
    invite: "👥 دعوت دوستان",
    list: "📚 لیست فیلم‌ها",
    lang: "🌐 تغییر زبان",
    admin: "👑 پنل مدیریت",
    pending: "📥 فیلم‌های در انتظار تأیید",
    requests: "📝 درخواست‌های فیلم",
    admins: "👑 مدیریت ادمین‌ها",
    users: "👥 کاربران",
    back: "🔙 بازگشت",
    next: "صفحه بعد ➡️",
    prev: "⬅️ صفحه قبل",
    empty: "📭 موردی وجود ندارد.",
    join: "🔒 ابتدا باید در کانال عضو شوید.",
    joinBtn: "📢 عضویت در کانال",
    check: "✅ بررسی عضویت",
    blocked: "🚫 دسترسی شما مسدود شده است.",
    sendMovie: "🎬 فیلم را به‌صورت ویدیو یا فایل ارسال کنید.",
    received: "✅ فیلم شما دریافت شد و برای بررسی مدیر ارسال شد.",
    noMovies: "📭 فعلاً فیلمی در آرشیو وجود ندارد.",
    approved: "✅ فیلم تأیید شد.",
    rejected: "❌ فیلم رد شد.",
    approve: "✅ تأیید",
    reject: "❌ رد",
    rateSaved: "⭐ امتیاز شما ثبت شد.",
    alreadyRated: "⚠️ قبلاً به این فیلم امتیاز داده‌اید.",
    addAdmin: "➕ افزودن ادمین",
    removeAdmin: "➖ حذف ادمین",
    adminList: "👥 لیست ادمین‌ها",
    adminId: "🆔 آیدی عددی کاربر را ارسال کنید.",
    adminAdded: "✅ ادمین با موفقیت اضافه شد.",
    adminRemoved: "✅ ادمین حذف شد.",
    notAdmin: "⛔ شما دسترسی مدیریت ندارید.",
    requestAsk: "📝 نام فیلم موردنظر را ارسال کنید.",
    requestSaved: "✅ درخواست فیلم ثبت شد.",
    profile: "👤 مشاهده پروفایل",
    favoriteAdded: "❤️ به مورد علاقه‌ها اضافه شد.",
    favoriteRemoved: "💔 از مورد علاقه‌ها حذف شد."
  },

  en: {
    choose: "🌐 Choose your language:",
    welcome: "🎬 Welcome to the movie bot.",
    menu: "Choose an option:",
    get: "🎬 Get Movie",
    send: "📤 Submit Movie",
    request: "📝 Request Movie",
    fav: "❤️ Favorites",
    history: "🕐 24h History",
    invite: "👥 Invite Friends",
    list: "📚 Movie List",
    lang: "🌐 Change Language",
    admin: "👑 Admin Panel",
    pending: "📥 Pending Movies",
    requests: "📝 Movie Requests",
    admins: "👑 Admin Management",
    users: "👥 Users",
    back: "🔙 Back",
    next: "Next ➡️",
    prev: "⬅️ Previous",
    empty: "📭 Nothing found.",
    join: "🔒 Please join the channel first.",
    joinBtn: "📢 Join Channel",
    check: "✅ Check Membership",
    blocked: "🚫 You are blocked.",
    sendMovie: "🎬 Send the movie as video or document.",
    received: "✅ Your movie was received for admin review.",
    approved: "✅ Movie approved.",
    rejected: "❌ Movie rejected.",
    approve: "✅ Approve",
    reject: "❌ Reject",
    rateSaved: "⭐ Your rating was saved.",
    alreadyRated: "⚠️ You already rated this movie.",
    addAdmin: "➕ Add Admin",
    removeAdmin: "➖ Remove Admin",
    adminList: "👥 Admin List",
    adminId: "🆔 Send the user's numeric ID.",
    adminAdded: "✅ Admin added.",
    adminRemoved: "✅ Admin removed.",
    notAdmin: "⛔ You don't have admin access.",
    requestAsk: "📝 Send the movie name.",
    requestSaved: "✅ Movie request saved.",
    profile: "👤 View Profile",
    favoriteAdded: "❤️ Added to favorites.",
    favoriteRemoved: "💔 Removed from favorites."
  }
};

function t(lang, key) {
  return (TEXT[lang] || TEXT.fa)[key] || key;
}

function telegram(env, method, data = {}) {
  return fetch(
    `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  ).then(r => r.json());
}

async function getJSON(env, key, fallback = null) {
  const v = await env.BOT_DATA.get(key);
  if (!v) return fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

async function putJSON(env, key, value) {
  await env.BOT_DATA.put(key, JSON.stringify(value));
}

function id() {
  return Math.random().toString(36).slice(2, 10);
}

function now() {
  return Date.now();
}
async function getUser(env, userId) {
  return await getJSON(env, `user:${userId}`, {
    id: String(userId),
    first_name: "",
    username: "",
    language: "fa",
    language_selected: false,
    blocked: false,
    joined: false,
    favorites: [],
    history: [],
    valid_invites: 0,
    no_cooldown: true,
    created_at: now()
  });
}

async function saveUser(env, user) {
  await putJSON(env, `user:${user.id}`, user);
}

async function ensureUser(env, from) {
  const user = await getUser(env, from.id);

  user.id = String(from.id);
  user.first_name = from.first_name || user.first_name || "";
  user.username = from.username || user.username || "";

  if (!user.created_at) {
    user.created_at = now();
  }

  await saveUser(env, user);
  return user;
}

function isMainAdmin(env, userId) {
  return String(userId) === String(env.ADMIN_ID || "");
}

async function getApprovedAdmins(env) {
  return await getJSON(env, "admin:approved", []);
}

async function saveApprovedAdmins(env, list) {
  await putJSON(env, "admin:approved", [...new Set(list.map(String))]);
}

async function isAdmin(env, userId) {
  if (isMainAdmin(env, userId)) return true;

  const admins = await getApprovedAdmins(env);
  return admins.map(String).includes(String(userId));
}

async function addAdmin(env, userId) {
  const admins = await getApprovedAdmins(env);

  if (!admins.map(String).includes(String(userId))) {
    admins.push(String(userId));
  }

  await saveApprovedAdmins(env, admins);
}

async function removeAdmin(env, userId) {
  if (isMainAdmin(env, userId)) return;

  const admins = await getApprovedAdmins(env);

  await saveApprovedAdmins(
    env,
    admins.filter(x => String(x) !== String(userId))
  );
}

/* =========================
   Membership
========================= */

async function checkMembership(env, userId) {
  try {
    const r = await telegram(env, "getChatMember", {
      chat_id: CHANNEL_ID,
      user_id: Number(userId)
    });

    if (!r.ok) return false;

    return [
      "creator",
      "administrator",
      "member"
    ].includes(r.result.status);
  } catch {
    return false;
  }
}

async function sendJoinMessage(env, chatId, lang) {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(lang, "join"),
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t(lang, "joinBtn"),
            url: CHANNEL_LINK
          }
        ],
        [
          {
            text: t(lang, "check"),
            callback_data: "membership:check"
          }
        ]
      ]
    }
  });
     }
function mainKeyboard(lang, admin) {
  const fa = lang === "fa";

  const rows = [
    [
      { text: fa ? "🎬 دریافت فیلم" : "🎬 Get Movie" },
      { text: fa ? "📤 ارسال فیلم" : "📤 Submit Movie" }
    ],
    [
      { text: fa ? "📝 درخواست فیلم" : "📝 Request Movie" },
      { text: fa ? "❤️ مورد علاقه‌ها" : "❤️ Favorites" }
    ],
    [
      { text: fa ? "🕐 تاریخچه ۲۴ ساعت" : "🕐 24h History" },
      { text: fa ? "👥 دعوت دوستان" : "👥 Invite Friends" }
    ],
    [
      { text: fa ? "📚 لیست فیلم‌ها" : "📚 Movie List" },
      { text: fa ? "🌐 تغییر زبان" : "🌐 Change Language" }
    ]
  ];

  if (admin) {
    rows.push([
      { text: fa ? "👑 پنل مدیریت" : "👑 Admin Panel" }
    ]);
  }

  return {
    keyboard: rows,
    resize_keyboard: true,
    is_persistent: true
  };
}

async function sendMainMenu(env, chatId, user) {
  const admin = await isAdmin(env, user.id);
  const lang = user.language || "fa";

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `${t(lang, "welcome")}\n\n` +
      `${t(lang, "menu")}`,
    reply_markup: mainKeyboard(lang, admin)
  });
}

/* =========================
   Language
========================= */

async function chooseLanguage(env, chatId) {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "🌐 زبان خود را انتخاب کنید / Choose your language:",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇮🇷 فارسی", callback_data: "lang:fa" },
          { text: "🇬🇧 English", callback_data: "lang:en" }
        ]
      ]
    }
  });
}

async function handleLanguage(env, callback) {
  const lang = callback.data.split(":")[1] === "en"
    ? "en"
    : "fa";

  const user = await getUser(env, callback.from.id);

  user.language = lang;
  user.language_selected = true;

  await saveUser(env, user);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callback.id,
    text: t(lang, "languageSaved") || "✅"
  });

  const member = await checkMembership(env, user.id);

  if (!member) {
    await sendJoinMessage(
      env,
      callback.message.chat.id,
      lang
    );
    return;
  }

  user.joined = true;
  await saveUser(env, user);

  await sendMainMenu(
    env,
    callback.message.chat.id,
    user
  );
}
/* =========================
   Movies
========================= */

async function getMovies(env) {
  return await getJSON(env, "movies", []);
}

async function saveMovies(env, movies) {
  await putJSON(env, "movies", movies);
}

async function findMovie(env, movieId) {
  const movies = await getMovies(env);

  return movies.find(
    m => String(m.id) === String(movieId)
  ) || null;
}

async function addMovie(env, movie) {
  const movies = await getMovies(env);

  movies.push({
    ...movie,
    views: Number(movie.views || 0),
    featured: Boolean(movie.featured),
    added_at: movie.added_at || now()
  });

  await saveMovies(env, movies);
}

async function deleteMovie(env, movieId) {
  const movies = await getMovies(env);

  await saveMovies(
    env,
    movies.filter(
      m => String(m.id) !== String(movieId)
    )
  );

  await env.BOT_DATA
    .delete(`ratings:${movieId}`)
    .catch(() => {});
}

function movieCaption(movie, average, votes) {
  return (
    `${movie.caption || "🎬 فیلم"}\n\n` +
    `👁 بازدید: ${movie.views || 0}\n` +
    `⭐ امتیاز: ${average.toFixed(1)}/5\n` +
    `👥 رأی‌ها: ${votes}\n` +
    `🌍 ${movie.country || "نامشخص"}\n\n` +
    `📢 ${CHANNEL_LINK}`
  ).slice(0, 1024);
}

async function movieRatingInfo(env, movieId) {
  const ratings = await getJSON(
    env,
    `ratings:${movieId}`,
    []
  );

  const values = ratings
    .map(Number)
    .filter(Number.isFinite);

  const votes = values.length;

  const average = votes
    ? values.reduce((a, b) => a + b, 0) / votes
    : 0;

  return { votes, average };
}

/* =========================
   Movie keyboard
========================= */

function movieKeyboard(user, movieId) {
  const favorite =
    Array.isArray(user.favorites) &&
    user.favorites.map(String).includes(String(movieId));

  return {
    inline_keyboard: [
      [
        {
          text: favorite
            ? "💔 حذف از علاقه‌مندی"
            : "❤️ مورد علاقه",
          callback_data:
            `fav:${favorite ? "remove" : "add"}:${movieId}`
        }
      ],
      [
        { text: "⭐ 1", callback_data: `rate:${movieId}:1` },
        { text: "⭐ 2", callback_data: `rate:${movieId}:2` },
        { text: "⭐ 3", callback_data: `rate:${movieId}:3` },
        { text: "⭐ 4", callback_data: `rate:${movieId}:4` },
        { text: "⭐ 5", callback_data: `rate:${movieId}:5` }
      ]
    ]
  };
}
async function sendMovie(env, chatId, movie, user) {
  if (!movie) return;

  const info = await movieRatingInfo(env, movie.id);

  const caption = movieCaption(
    movie,
    info.average,
    info.votes
  );

  const markup = movieKeyboard(
    user,
    movie.id
  );

  const data = {
    chat_id: chatId,
    caption,
    reply_markup: markup
  };

  let result;

  if (movie.type === "document") {
    data.document = movie.file_id;

    result = await telegram(
      env,
      "sendDocument",
      data
    );
  } else {
    data.video = movie.file_id;

    result = await telegram(
      env,
      "sendVideo",
      data
    );
  }

  if (result.ok) {
    const movies = await getMovies(env);

    const index = movies.findIndex(
      m => String(m.id) === String(movie.id)
    );

    if (index !== -1) {
      movies[index].views =
        Number(movies[index].views || 0) + 1;

      await saveMovies(env, movies);
    }

    user.history = Array.isArray(user.history)
      ? user.history
      : [];

    user.history = [
      {
        movie_id: String(movie.id),
        at: now()
      },
      ...user.history.filter(
        x => String(x.movie_id) !== String(movie.id)
      )
    ].slice(0, 50);

    await saveUser(env, user);
  }
}

async function handleGetMovie(
  env,
  chatId,
  user
) {
  const movies = await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: t(user.language, "noMovies")
    });
    return;
  }

  const movie =
    movies[Math.floor(Math.random() * movies.length)];

  await sendMovie(
    env,
    chatId,
    movie,
    user
  );
}

/* =========================
   Favorites
========================= */

async function toggleFavorite(
  env,
  user,
  movieId,
  action
) {
  user.favorites = Array.isArray(user.favorites)
    ? user.favorites.map(String)
    : [];

  const id = String(movieId);

  if (action === "add") {
    if (!user.favorites.includes(id)) {
      user.favorites.push(id);
    }
  } else {
    user.favorites =
      user.favorites.filter(x => x !== id);
  }

  await saveUser(env, user);
}

async function showFavorites(
  env,
  chatId,
  user,
  page = 0,
  messageId = null
) {
  const ids = Array.isArray(user.favorites)
    ? user.favorites
    : [];

  const movies = [];

  for (const movieId of ids) {
    const movie = await findMovie(env, movieId);
    if (movie) movies.push(movie);
  }

  await showSelectableMovies(
    env,
    chatId,
    user,
    movies,
    page,
    "favorites",
    messageId
  );
}
/* =========================
   History
========================= */

async function showHistory(
  env,
  chatId,
  user,
  page = 0,
  messageId = null
) {
  const history = Array.isArray(user.history)
    ? user.history
    : [];

  const valid = history.filter(
    x => now() - Number(x.at || 0) <= HISTORY_TTL
  );

  user.history = valid;
  await saveUser(env, user);

  const movies = [];

  for (const item of valid) {
    const movie = await findMovie(
      env,
      item.movie_id
    );

    if (movie) movies.push(movie);
  }

  await showSelectableMovies(
    env,
    chatId,
    user,
    movies,
    page,
    "history",
    messageId
  );
}

/* =========================
   Movie List
========================= */

async function showMovieList(
  env,
  chatId,
  user,
  page = 0,
  messageId = null
) {
  const movies = await getMovies(env);

  await showSelectableMovies(
    env,
    chatId,
    user,
    movies,
    page,
    "movielist",
    messageId
  );
}

async function showSelectableMovies(
  env,
  chatId,
  user,
  movies,
  page,
  prefix,
  messageId
) {
  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: t(user.language, "empty")
    });
    return;
  }

  const totalPages =
    Math.max(
      1,
      Math.ceil(movies.length / MOVIE_PAGE_SIZE)
    );

  page = Math.max(
    0,
    Math.min(page, totalPages - 1)
  );

  const start = page * MOVIE_PAGE_SIZE;

  const rows = [];

  movies
    .slice(start, start + MOVIE_PAGE_SIZE)
    .forEach((movie, index) => {
      rows.push([
        {
          text:
            `${start + index + 1}. 🎬 ${
              String(movie.caption || "فیلم")
                .replace(/\n/g, " ")
                .slice(0, 45)
            }`,
          callback_data:
            `${prefix}:movie:${movie.id}:${page}`
        }
      ]);
    });

  const nav = [];

  if (page > 0) {
    nav.push({
      text: t(user.language, "prev"),
      callback_data:
        `${prefix}:page:${page - 1}`
    });
  }

  if (page < totalPages - 1) {
    nav.push({
      text: t(user.language, "next"),
      callback_data:
        `${prefix}:page:${page + 1}`
    });
  }

  if (nav.length) rows.push(nav);

  rows.push([
    {
      text: t(user.language, "back"),
      callback_data: "menu:back"
    }
  ]);

  const markup = {
    inline_keyboard: rows
  };

  const text =
    `🎬 ${prefix === "favorites"
      ? t(user.language, "fav")
      : prefix === "history"
        ? t(user.language, "history")
        : t(user.language, "list")}\n\n` +
    `${t(user.language, "page")} ${page + 1}/${totalPages}`;

  if (messageId) {
    await telegram(env, "editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: markup
    });
  } else {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text,
      reply_markup: markup
    });
  }
}
/* =========================
   Requests
========================= */

async function createMovieRequest(
  env,
  user,
  name
) {
  const requests = await getJSON(
    env,
    "movie:requests",
    []
  );

  const request = {
    id: id(),
    name: String(name).trim(),
    user_id: String(user.id),
    username: user.username || "",
    first_name: user.first_name || "",
    status: "pending",
    created_at: now()
  };

  requests.unshift(request);

  await putJSON(
    env,
    "movie:requests",
    requests
  );

  return request;
}

async function getRequests(env) {
  return await getJSON(
    env,
    "movie:requests",
    []
  );
}

async function saveRequests(env, list) {
  await putJSON(
    env,
    "movie:requests",
    list
  );
}

/* =========================
   Pending Movies
========================= */

async function getPending(env) {
  return await getJSON(
    env,
    "movie:pending",
    []
  );
}

async function savePending(env, list) {
  await putJSON(
    env,
    "movie:pending",
    list
  );
}

async function createPendingMovie(
  env,
  user,
  movie
) {
  const list = await getPending(env);

  const item = {
    id: id(),
    ...movie,
    user_id: String(user.id),
    username: user.username || "",
    first_name: user.first_name || "",
    created_at: now()
  };

  list.unshift(item);

  await savePending(env, list);

  return item;
}

/* =========================
   Notify admins
========================= */

async function notifyAdmins(
  env,
  text,
  markup = null
) {
  const admins = await getApprovedAdmins(env);

  const ids = [
    String(env.ADMIN_ID || ""),
    ...admins.map(String)
  ];

  for (const userId of [...new Set(ids)]) {
    if (!userId) continue;

    await telegram(env, "sendMessage", {
      chat_id: userId,
      text,
      ...(markup
        ? { reply_markup: markup }
        : {})
    }).catch(() => {});
  }
}
/* =========================
   Receive Movie
========================= */

async function receiveMovie(
  env,
  message,
  user
) {
  let movie = null;

  if (message.video) {
    movie = {
      type: "video",
      file_id: message.video.file_id,
      caption:
        message.caption ||
        "🎬 فیلم ارسال‌شده"
    };
  }

  if (message.document) {
    movie = {
      type: "document",
      file_id: message.document.file_id,
      caption:
        message.caption ||
        "🎬 فیلم ارسال‌شده"
    };
  }

  if (!movie) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(user.language, "sendMovie")
    });
    return;
  }

  const pending = await createPendingMovie(
    env,
    user,
    movie
  );

  await telegram(env, "sendMessage", {
    chat_id: message.chat.id,
    text: t(user.language, "received")
  });

  await notifyAdmins(
    env,
    `📥 فیلم جدید برای تأیید\n\n` +
    `🎬 ${movie.caption}\n` +
    `👤 ${user.first_name || "-"}\n` +
    `🆔 ${user.id}\n` +
    `${user.username ? `@${user.username}` : ""}`,
    {
      inline_keyboard: [
        [
          {
            text: "👀 بررسی",
            callback_data:
              `pending:view:${pending.id}`
          }
        ]
      ]
    }
  );
}

/* =========================
   Pending List
========================= */

async function showPendingList(
  env,
  chatId,
  page = 0,
  messageId = null
) {
  const list = await getPending(env);

  if (!list.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: TEXT.fa.empty
    });
    return;
  }

  const totalPages =
    Math.ceil(list.length / MOVIE_PAGE_SIZE);

  page = Math.max(
    0,
    Math.min(page, totalPages - 1)
  );

  const start = page * MOVIE_PAGE_SIZE;

  const rows = list
    .slice(start, start + MOVIE_PAGE_SIZE)
    .map((item, i) => [
      {
        text:
          `${start + i + 1}. 🎬 ${
            String(item.caption || "فیلم")
              .replace(/\n/g, " ")
              .slice(0, 45)
          }`,
        callback_data:
          `pending:view:${item.id}:${page}`
      }
    ]);

  const nav = [];

  if (page > 0) {
    nav.push({
      text: "⬅️ قبلی",
      callback_data: `pending:list:${page - 1}`
    });
  }

  if (page < totalPages - 1) {
    nav.push({
      text: "بعدی ➡️",
      callback_data: `pending:list:${page + 1}`
    });
  }

  if (nav.length) rows.push(nav);

  rows.push([
    {
      text: "🔙 بازگشت",
      callback_data: "admin:back"
    }
  ]);

  const data = {
    chat_id: chatId,
    text:
      `📥 فیلم‌های در انتظار تأیید\n\n` +
      `صفحه ${page + 1}/${totalPages}`,
    reply_markup: {
      inline_keyboard: rows
    }
  };

  if (messageId) {
    await telegram(
      env,
      "editMessageText",
      {
        ...data,
        message_id: messageId
      }
    );
  } else {
    await telegram(
      env,
      "sendMessage",
      data
    );
  }
}
async function showPendingMovie(
  env,
  chatId,
  pendingId,
  page = 0
) {
  const list = await getPending(env);

  const item = list.find(
    x => String(x.id) === String(pendingId)
  );

  if (!item) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "❌ این مورد دیگر وجود ندارد."
    });
    return;
  }

  const text =
    `📥 فیلم در انتظار تأیید\n\n` +
    `🎬 ${item.caption || "فیلم"}\n` +
    `👤 ${item.first_name || "-"}\n` +
    `🆔 ${item.user_id}\n` +
    `${item.username ? `@${item.username}\n` : ""}`;

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "👀 مشاهده فیلم",
            callback_data:
              `pending:watch:${item.id}`
          }
        ],
        [
          {
            text: "✅ تأیید",
            callback_data:
              `pending:approve:${item.id}`
          },
          {
            text: "❌ رد",
            callback_data:
              `pending:reject:${item.id}`
          }
        ],
        [
          {
            text: "🔙 بازگشت",
            callback_data:
              `pending:list:${page}`
          }
        ]
      ]
    }
  });
}

async function watchPending(
  env,
  chatId,
  pendingId
) {
  const list = await getPending(env);

  const item = list.find(
    x => String(x.id) === String(pendingId)
  );

  if (!item) return;

  const markup = {
    inline_keyboard: [
      [
        {
          text: "✅ تأیید",
          callback_data:
            `pending:approve:${item.id}`
        },
        {
          text: "❌ رد",
          callback_data:
            `pending:reject:${item.id}`
        }
      ]
    ]
  };

  const data = {
    chat_id: chatId,
    caption: item.caption || "🎬 فیلم",
    reply_markup: markup
  };

  if (item.type === "document") {
    data.document = item.file_id;

    await telegram(
      env,
      "sendDocument",
      data
    );
  } else {
    data.video = item.file_id;

    await telegram(
      env,
      "sendVideo",
      data
    );
  }
}

async function approvePending(
  env,
  chatId,
  pendingId
) {
  const list = await getPending(env);

  const index = list.findIndex(
    x => String(x.id) === String(pendingId)
  );

  if (index === -1) return;

  const item = list[index];

  await addMovie(env, {
    type: item.type,
    file_id: item.file_id,
    caption: item.caption,
    country: item.country || "نامشخص"
  });

  list.splice(index, 1);

  await savePending(env, list);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "✅ فیلم تأیید و به آرشیو اضافه شد."
  });

  if (item.user_id) {
    await telegram(env, "sendMessage", {
      chat_id: item.user_id,
      text: "✅ فیلم ارسالی شما تأیید و منتشر شد."
    }).catch(() => {});
  }
}

async function rejectPending(
  env,
  chatId,
  pendingId
) {
  const list = await getPending(env);

  const item = list.find(
    x => String(x.id) === String(pendingId)
  );

  if (!item) return;

  await savePending(
    env,
    list.filter(
      x => String(x.id) !== String(pendingId)
    )
  );

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "❌ فیلم رد شد."
  });

  if (item.user_id) {
    await telegram(env, "sendMessage", {
      chat_id: item.user_id,
      text: "❌ فیلم ارسالی شما توسط مدیریت رد شد."
    }).catch(() => {});
  }
}
/* =========================
   Requests Admin
========================= */

async function showRequests(
  env,
  chatId,
  page = 0
) {
  const list = (await getRequests(env))
    .filter(x => x.status === "pending");

  if (!list.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📝 هیچ درخواست فیلمی وجود ندارد."
    });
    return;
  }

  const totalPages =
    Math.ceil(list.length / MOVIE_PAGE_SIZE);

  page = Math.max(
    0,
    Math.min(page, totalPages - 1)
  );

  const start = page * MOVIE_PAGE_SIZE;

  const rows = list
    .slice(start, start + MOVIE_PAGE_SIZE)
    .map((item, i) => [
      {
        text:
          `${start + i + 1}. 🎬 ${item.name}`,
        callback_data:
          `request:view:${item.id}:${page}`
      }
    ]);

  const nav = [];

  if (page > 0) {
    nav.push({
      text: "⬅️ قبلی",
      callback_data: `request:list:${page - 1}`
    });
  }

  if (page < totalPages - 1) {
    nav.push({
      text: "بعدی ➡️",
      callback_data: `request:list:${page + 1}`
    });
  }

  if (nav.length) rows.push(nav);

  rows.push([
    {
      text: "🔙 بازگشت",
      callback_data: "admin:back"
    }
  ]);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `📝 درخواست‌های فیلم\n\n` +
      `صفحه ${page + 1}/${totalPages}`,
    reply_markup: {
      inline_keyboard: rows
    }
  });
}

async function showRequest(
  env,
  chatId,
  requestId,
  page = 0
) {
  const list = await getRequests(env);

  const item = list.find(
    x => String(x.id) === String(requestId)
  );

  if (!item) return;

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `📝 درخواست فیلم\n\n` +
      `🎬 نام: ${item.name}\n` +
      `👤 کاربر: ${item.first_name || "-"}\n` +
      `🆔 ID: ${item.user_id}\n` +
      `${item.username ? `@${item.username}` : ""}`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ انجام شد",
            callback_data:
              `request:done:${item.id}`
          },
          {
            text: "❌ حذف",
            callback_data:
              `request:delete:${item.id}`
          }
        ],
        [
          {
            text: "🔙 بازگشت",
            callback_data:
              `request:list:${page}`
          }
        ]
      ]
    }
  });
}

async function finishRequest(
  env,
  chatId,
  requestId
) {
  const list = await getRequests(env);

  const item = list.find(
    x => String(x.id) === String(requestId)
  );

  if (!item) return;

  item.status = "done";

  await saveRequests(env, list);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "✅ درخواست به‌عنوان انجام‌شده ثبت شد."
  });

  await telegram(env, "sendMessage", {
    chat_id: item.user_id,
    text:
      `✅ درخواست فیلم شما بررسی شد.\n\n🎬 ${item.name}`
  }).catch(() => {});
}

async function deleteRequest(
  env,
  chatId,
  requestId
) {
  const list = await getRequests(env);

  await saveRequests(
    env,
    list.filter(
      x => String(x.id) !== String(requestId)
    )
  );

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "🗑 درخواست حذف شد."
  });
}
/* =========================
   Admin Management
========================= */

async function showAdminManagement(
  env,
  chatId
) {
  if (!isMainAdmin(env, chatId)) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "⛔ فقط ادمین اصلی می‌تواند ادمین‌ها را مدیریت کند."
    });
    return;
  }

  const admins = await getApprovedAdmins(env);

  let text = "👑 مدیریت ادمین‌ها\n\n";
  text += `👑 ادمین اصلی: ${env.ADMIN_ID}\n\n`;

  if (admins.length) {
    admins.forEach((x, i) => {
      text += `${i + 1}. 🆔 ${x}\n`;
    });
  } else {
    text += "📭 ادمین دیگری اضافه نشده است.\n";
  }

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "➕ افزودن ادمین",
            callback_data: "admins:add"
          }
        ],
        [
          {
            text: "➖ حذف ادمین",
            callback_data: "admins:remove"
          }
        ],
        [
          {
            text: "🔙 بازگشت",
            callback_data: "admin:back"
          }
        ]
      ]
    }
  });
}

async function addAdminPrompt(
  env,
  chatId
) {
  await env.BOT_DATA.put(
    `state:${chatId}`,
    JSON.stringify({
      type: "add_admin"
    })
  );

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "🆔 آیدی عددی کاربر را ارسال کنید."
  });
}

async function removeAdminPrompt(
  env,
  chatId
) {
  await env.BOT_DATA.put(
    `state:${chatId}`,
    JSON.stringify({
      type: "remove_admin"
    })
  );

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "🆔 آیدی ادمینی که می‌خواهید حذف کنید را ارسال کنید."
  });
}

async function processAdminState(
  env,
  message,
  state
) {
  const chatId = String(message.from.id);
  const userId = String(message.text || "").trim();

  if (!/^\d+$/.test(userId)) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "❌ آیدی باید عددی باشد."
    });
    return true;
  }

  if (state.type === "add_admin") {
    if (isMainAdmin(env, userId)) {
      await telegram(env, "sendMessage", {
        chat_id: message.chat.id,
        text: "این کاربر از قبل ادمین اصلی است."
      });
      return true;
    }

    await addAdmin(env, userId);

    await env.BOT_DATA.delete(
      `state:${chatId}`
    );

    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text:
        `✅ کاربر با ID ${userId} ادمین شد.`
    });

    await telegram(env, "sendMessage", {
      chat_id: userId,
      text:
        "👑 شما به‌عنوان ادمین ربات اضافه شدید."
    }).catch(() => {});

    return true;
  }

  if (state.type === "remove_admin") {
    await removeAdmin(env, userId);

    await env.BOT_DATA.delete(
      `state:${chatId}`
    );

    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text:
        `✅ ادمین ${userId} حذف شد.`
    });

    return true;
  }

  return false;
}
/* =========================
   Users
========================= */

async function getAllUsers(env) {
  const list = await getJSON(
    env,
    "users:index",
    []
  );

  const users = [];

  for (const id of list) {
    const user = await getUser(env, id);
    users.push(user);
  }

  return users;
}

async function addUserToIndex(env, userId) {
  const list = await getJSON(
    env,
    "users:index",
    []
  );

  if (!list.map(String).includes(String(userId))) {
    list.push(String(userId));
    await putJSON(env, "users:index", list);
  }
}

async function showUsers(
  env,
  chatId,
  page = 0
) {
  const users = await getAllUsers(env);

  if (!users.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "👥 کاربری وجود ندارد."
    });
    return;
  }

  const totalPages =
    Math.ceil(users.length / USER_PAGE_SIZE);

  page = Math.max(
    0,
    Math.min(page, totalPages - 1)
  );

  const start = page * USER_PAGE_SIZE;

  const rows = users
    .slice(start, start + USER_PAGE_SIZE)
    .map((user, i) => [
      {
        text:
          `${start + i + 1}. ${
            user.first_name ||
            user.username ||
            user.id
          }`,
        callback_data:
          `users:view:${user.id}:${page}`
      }
    ]);

  const nav = [];

  if (page > 0) {
    nav.push({
      text: "⬅️ قبلی",
      callback_data: `users:list:${page - 1}`
    });
  }

  if (page < totalPages - 1) {
    nav.push({
      text: "بعدی ➡️",
      callback_data: `users:list:${page + 1}`
    });
  }

  if (nav.length) rows.push(nav);

  rows.push([
    {
      text: "🔙 بازگشت",
      callback_data: "admin:back"
    }
  ]);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `👥 کاربران\n\nصفحه ${page + 1}/${totalPages}`,
    reply_markup: {
      inline_keyboard: rows
    }
  });
}

async function showUserProfile(
  env,
  chatId,
  userId,
  page = 0
) {
  const user = await getUser(env, userId);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `👤 پروفایل کاربر\n\n` +
      `🆔 ID: ${user.id}\n` +
      `👤 نام: ${user.first_name || "-"}\n` +
      `🔗 Username: ${
        user.username ? "@" + user.username : "-"
      }\n` +
      `🌐 زبان: ${user.language}\n` +
      `❤️ علاقه‌مندی‌ها: ${
        (user.favorites || []).length
      }\n` +
      `👥 دعوت موفق: ${
        user.valid_invites || 0
      }\n` +
      `🚫 مسدود: ${
        user.blocked ? "بله" : "خیر"
      }`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: user.blocked
              ? "✅ رفع بلاک"
              : "🚫 بلاک",
            callback_data:
              `users:block:${user.id}`
          }
        ],
        [
          {
            text: "🔙 بازگشت",
            callback_data:
              `users:list:${page}`
          }
        ]
      ]
    }
  });
}

async function toggleBlock(
  env,
  userId
) {
  const user = await getUser(env, userId);

  user.blocked = !user.blocked;

  await saveUser(env, user);
}
/* =========================
   Admin Panel
========================= */

async function adminPanel(
  env,
  chatId
) {
  const main =
    isMainAdmin(env, chatId);

  if (!(await isAdmin(env, chatId))) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "⛔ دسترسی ندارید."
    });
    return;
  }

  const movies = await getMovies(env);
  const pending = await getPending(env);
  const requests =
    (await getRequests(env))
      .filter(x => x.status === "pending");

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `👑 پنل مدیریت\n\n` +
      `🎬 فیلم‌ها: ${movies.length}\n` +
      `📥 در انتظار تأیید: ${pending.length}\n` +
      `📝 درخواست‌ها: ${requests.length}`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎬 لیست فیلم‌ها",
            callback_data: "admin:movies"
          }
        ],
        [
          {
            text: "📥 فیلم‌های در انتظار تأیید",
            callback_data: "admin:pending"
          }
        ],
        [
          {
            text: "📝 درخواست‌های فیلم",
            callback_data: "admin:requests"
          }
        ],
        [
          {
            text: "👥 کاربران",
            callback_data: "admin:users"
          }
        ],
        ...(main
          ? [
              [
                {
                  text: "👑 مدیریت ادمین‌ها",
                  callback_data: "admin:admins"
                }
              ]
            ]
          : []),
        [
          {
            text: "🔙 بازگشت",
            callback_data: "admin:back"
          }
        ]
      ]
    }
  });
}

/* =========================
   Admin movie list
========================= */

async function adminMovieList(
  env,
  chatId,
  page = 0
) {
  const movies = await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📭 آرشیو فیلم خالی است."
    });
    return;
  }

  const totalPages =
    Math.ceil(movies.length / MOVIE_PAGE_SIZE);

  page = Math.max(
    0,
    Math.min(page, totalPages - 1)
  );

  const start = page * MOVIE_PAGE_SIZE;

  const rows = movies
    .slice(start, start + MOVIE_PAGE_SIZE)
    .map((movie, i) => [
      {
        text:
          `${start + i + 1}. 🎬 ${
            String(movie.caption || "فیلم")
              .replace(/\n/g, " ")
              .slice(0, 45)
          }`,
        callback_data:
          `adminmovie:view:${movie.id}:${page}`
      }
    ]);

  const nav = [];

  if (page > 0) {
    nav.push({
      text: "⬅️ قبلی",
      callback_data: `admin:movies:${page - 1}`
    });
  }

  if (page < totalPages - 1) {
    nav.push({
      text: "بعدی ➡️",
      callback_data: `admin:movies:${page + 1}`
    });
  }

  if (nav.length) rows.push(nav);

  rows.push([
    {
      text: "🔙 بازگشت",
      callback_data: "admin:back"
    }
  ]);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `🎬 لیست فیلم‌ها\n\nصفحه ${page + 1}/${totalPages}`,
    reply_markup: {
      inline_keyboard: rows
    }
  });
}
/* =========================
   Start / Referrals
========================= */

function getReferral(text) {
  const value = String(text || "");

  if (!value.startsWith("/start ref_")) {
    return null;
  }

  return value.slice(11).trim();
}

async function processReferral(
  env,
  user,
  inviterId
) {
  if (!inviterId) return;
  if (String(inviterId) === String(user.id)) return;

  if (user.referral_parent) return;

  const inviter = await getUser(
    env,
    inviterId
  );

  if (!inviter) return;

  user.referral_parent =
    String(inviterId);

  await saveUser(env, user);

  const key =
    `referral:claimed:${user.id}`;

  if (await env.BOT_DATA.get(key)) return;

  inviter.valid_invites =
    Number(inviter.valid_invites || 0) + 1;

  if (
    inviter.valid_invites >=
    REFERRAL_REWARD
  ) {
    inviter.no_cooldown = true;
  }

  await saveUser(env, inviter);

  await env.BOT_DATA.put(
    key,
    String(inviterId)
  );

  await telegram(env, "sendMessage", {
    chat_id: inviter.id,
    text:
      `🎁 یک دعوت موفق ثبت شد!\n\n` +
      `👥 تعداد دعوت موفق: ${inviter.valid_invites}`
  }).catch(() => {});
}

async function handleStart(
  env,
  message
) {
  const user =
    await ensureUser(
      env,
      message.from
    );

  await addUserToIndex(
    env,
    user.id
  );

  const ref =
    getReferral(message.text);

  if (ref) {
    await processReferral(
      env,
      user,
      ref
    );
  }

  if (user.blocked) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(user.language, "blocked")
    });
    return;
  }

  if (!user.language_selected) {
    await chooseLanguage(
      env,
      message.chat.id
    );
    return;
  }

  const member =
    await checkMembership(
      env,
      user.id
    );

  if (!member) {
    await sendJoinMessage(
      env,
      message.chat.id,
      user.language
    );
    return;
  }

  user.joined = true;
  await saveUser(env, user);

  await sendMainMenu(
    env,
    message.chat.id,
    user
  );
}

/* =========================
   Invite
========================= */

async function showInvite(
  env,
  chatId,
  user
) {
  const me =
    await telegram(
      env,
      "getMe"
    );

  const botUsername =
    me.ok && me.result?.username
      ? me.result.username
      : "SuperManFilmBot";

  const link =
    `https://t.me/${botUsername}?start=ref_${user.id}`;

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `👥 دعوت دوستان\n\n` +
      `🔗 لینک اختصاصی شما:\n${link}\n\n` +
      `👥 دعوت موفق: ${
        user.valid_invites || 0
      }\n\n` +
      `🎁 بعد از ${REFERRAL_REWARD} دعوت موفق، محدودیت دریافت فیلم ندارید.`
  });
}

/* =========================
   Movie request from user
========================= */

async function startRequest(
  env,
  chatId
) {
  await env.BOT_DATA.put(
    `state:${chatId}`,
    JSON.stringify({
      type: "movie_request"
    })
  );

  const user =
    await getUser(env, chatId);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(user.language, "requestAsk")
  });
}
/* =========================
   Callbacks
========================= */

async function handleCallback(
  env,
  callback
) {
  const data = callback.data || "";
  const user =
    await ensureUser(
      env,
      callback.from
    );

  const chatId =
    callback.message.chat.id;

  if (data.startsWith("lang:")) {
    await handleLanguage(
      env,
      callback
    );
    return;
  }

  if (data === "membership:check") {
    const ok =
      await checkMembership(
        env,
        user.id
      );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: callback.id,
        text: ok
          ? "✅ عضویت تأیید شد."
          : "❌ هنوز عضو کانال نیستید."
      }
    );

    if (ok) {
      user.joined = true;
      await saveUser(env, user);
      await sendMainMenu(env, chatId, user);
    }

    return;
  }

  if (data.startsWith("fav:")) {
    const [, action, movieId] =
      data.split(":");

    await toggleFavorite(
      env,
      user,
      movieId,
      action
    );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: callback.id,
        text:
          action === "add"
            ? t(user.language, "favoriteAdded")
            : t(user.language, "favoriteRemoved")
      }
    );

    return;
  }

  if (data.startsWith("rate:")) {
    const [, movieId, value] =
      data.split(":");

    const key =
      `rating:${movieId}:${user.id}`;

    if (await env.BOT_DATA.get(key)) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: callback.id,
          text: t(
            user.language,
            "alreadyRated"
          ),
          show_alert: true
        }
      );
      return;
    }

    await env.BOT_DATA.put(
      key,
      value
    );

    const ratings =
      await getJSON(
        env,
        `ratings:${movieId}`,
        []
      );

    ratings.push(Number(value));

    await putJSON(
      env,
      `ratings:${movieId}`,
      ratings
    );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: callback.id,
        text: t(
          user.language,
          "rateSaved"
        )
      }
    );

    /* حذف دکمه‌های امتیاز بعد از رأی */
    await telegram(
      env,
      "editMessageReplyMarkup",
      {
        chat_id: chatId,
        message_id:
          callback.message.message_id,
        reply_markup:
          movieKeyboard(
            user,
            movieId
          )
      }
    );

    return;
  }

  if (data.startsWith("movielist:page:")) {
    const page =
      Number(data.split(":")[2]) || 0;

    await showMovieList(
      env,
      chatId,
      user,
      page,
      callback.message.message_id
    );
    return;
  }

  if (data.startsWith("movielist:movie:")) {
    const movieId =
      data.split(":")[2];

    const movie =
      await findMovie(
        env,
        movieId
      );

    if (movie) {
      await sendMovie(
        env,
        chatId,
        movie,
        user
      );
    }

    return;
  }

  if (data.startsWith("favorites:page:")) {
    await showFavorites(
      env,
      chatId,
      user,
      Number(data.split(":")[2]) || 0
    );
    return;
  }

  if (data.startsWith("favorites:movie:")) {
    const movie =
      await findMovie(
        env,
        data.split(":")[2]
      );

    if (movie) {
      await sendMovie(
        env,
        chatId,
        movie,
        user
      );
    }

    return;
  }

  if (data.startsWith("history:page:")) {
    await showHistory(
      env,
      chatId,
      user,
      Number(data.split(":")[2]) || 0
    );
    return;
  }

  if (data.startsWith("history:movie:")) {
    const movie =
      await findMovie(
        env,
        data.split(":")[2]
      );

    if (movie) {
      await sendMovie(
        env,
        chatId,
        movie,
        user
      );
    }

    return;
  }

  /* ---------- Pending ---------- */

  if (!(await isAdmin(env, user.id))) {
    if (
      data.startsWith("pending:") ||
      data.startsWith("request:") ||
      data.startsWith("admin:")
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: callback.id,
          text: t(user.language, "notAdmin"),
          show_alert: true
        }
      );
      return;
    }
  }

  if (data.startsWith("pending:list:")) {
    await showPendingList(
      env,
      chatId,
      Number(data.split(":")[2]) || 0
    );
    return;
  }

  if (data.startsWith("pending:view:")) {
    await showPendingMovie(
      env,
      chatId,
      data.split(":")[2],
      Number(data.split(":")[3]) || 0
    );
    return;
  }

  if (data.startsWith("pending:watch:")) {
    await watchPending(
      env,
      chatId,
      data.split(":")[2]
    );
    return;
  }

  if (data.startsWith("pending:approve:")) {
    await approvePending(
      env,
      chatId,
      data.split(":")[2]
    );
    return;
  }

  if (data.startsWith("pending:reject:")) {
    await rejectPending(
      env,
      chatId,
      data.split(":")[2]
    );
    return;
  }

  /* ---------- Requests ---------- */

  if (data.startsWith("request:list:")) {
    await showRequests(
      env,
      chatId,
      Number(data.split(":")[2]) || 0
    );
    return;
  }

  if (data.startsWith("request:view:")) {
    await showRequest(
      env,
      chatId,
      data.split(":")[2],
      Number(data.split(":")[3]) || 0
    );
    return;
  }

  if (data.startsWith("request:done:")) {
    await finishRequest(
      env,
      chatId,
      data.split(":")[2]
    );
    return;
  }

  if (data.startsWith("request:delete:")) {
    await deleteRequest(
      env,
      chatId,
      data.split(":")[2]
    );
    return;
  }

  /* ---------- Admin ---------- */

  if (data === "admin:back") {
    await adminPanel(env, chatId);
    return;
  }

  if (data === "admin:pending") {
    await showPendingList(env, chatId);
    return;
  }

  if (data === "admin:requests") {
    await showRequests(env, chatId);
    return;
  }

  if (data === "admin:users") {
    await showUsers(env, chatId);
    return;
  }

  if (data === "admin:admins") {
    await showAdminManagement(env, chatId);
    return;
  }

  if (data === "admins:add") {
    if (isMainAdmin(env, user.id)) {
      await addAdminPrompt(env, chatId);
    }
    return;
  }

  if (data === "admins:remove") {
    if (isMainAdmin(env, user.id)) {
      await removeAdminPrompt(env, chatId);
    }
    return;
  }

  if (data.startsWith("users:list:")) {
    await showUsers(
      env,
      chatId,
      Number(data.split(":")[2]) || 0
    );
    return;
  }

  if (data.startsWith("users:view:")) {
    await showUserProfile(
      env,
      chatId,
      data.split(":")[2],
      Number(data.split(":")[3]) || 0
    );
    return;
  }

  if (data.startsWith("users:block:")) {
    await toggleBlock(
      env,
      data.split(":")[2]
    );

    await showUserProfile(
      env,
      chatId,
      data.split(":")[2]
    );

    return;
  }

  if (data === "admin:movies") {
    await adminMovieList(
      env,
      chatId,
      0
    );
    return;
  }

  if (data.startsWith("admin:movies:")) {
    await adminMovieList(
      env,
      chatId,
      Number(data.split(":")[2]) || 0
    );
    return;
  }

  if (data.startsWith("adminmovie:view:")) {
    const movie =
      await findMovie(
        env,
        data.split(":")[2]
      );

    if (!movie) return;

    await sendMovie(
      env,
      chatId,
      movie,
      user
    );

    return;
  }

  if (data === "menu:back") {
    await sendMainMenu(
      env,
      chatId,
      user
    );
    return;
  }
}

/* =========================
   Text Router
========================= */

async function handleText(
  env,
  message,
  user
) {
  const text =
    String(message.text || "").trim();

  const lang = user.language || "fa";

  const state =
    await getJSON(
      env,
      `state:${user.id}`,
      null
    );

  if (
    state &&
    (await isAdmin(env, user.id)) &&
    (state.type === "add_admin" ||
      state.type === "remove_admin")
  ) {
    await processAdminState(
      env,
      message,
      state
    );
    return;
  }

  if (
    state &&
    state.type === "movie_request"
  ) {
    await createMovieRequest(
      env,
      user,
      text
    );

    await env.BOT_DATA.delete(
      `state:${user.id}`
    );

    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(lang, "requestSaved")
    });

    await notifyAdmins(
      env,
      `📝 درخواست فیلم جدید\n\n` +
      `🎬 ${text}\n` +
      `👤 ${user.first_name || "-"}\n` +
      `🆔 ${user.id}`,
      {
        inline_keyboard: [
          [
            {
              text: "👀 مشاهده درخواست‌ها",
              callback_data: "admin:requests"
            }
          ]
        ]
      }
    );

    return;
  }

  if (
    text === t(lang, "get") ||
    text === TEXT.fa.get ||
    text === TEXT.en.get
  ) {
    await handleGetMovie(
      env,
      message.chat.id,
      user
    );
    return;
  }

  if (
    text === t(lang, "send") ||
    text === TEXT.fa.send ||
    text === TEXT.en.send
  ) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(lang, "sendMovie")
    });
    return;
  }

  if (
    text === t(lang, "request") ||
    text === TEXT.fa.request ||
    text === TEXT.en.request
  ) {
    await startRequest(
      env,
      message.chat.id
    );
    return;
  }

  if (
    text === t(lang, "fav") ||
    text === TEXT.fa.fav ||
    text === TEXT.en.fav
  ) {
    await showFavorites(
      env,
      message.chat.id,
      user
    );
    return;
  }

  if (
    text === t(lang, "history") ||
    text === TEXT.fa.history ||
    text === TEXT.en.history
  ) {
    await showHistory(
      env,
      message.chat.id,
      user
    );
    return;
  }

  if (
    text === t(lang, "invite") ||
    text === TEXT.fa.invite ||
    text === TEXT.en.invite
  ) {
    await showInvite(
      env,
      message.chat.id,
      user
    );
    return;
  }

  if (
    text === t(lang, "list") ||
    text === TEXT.fa.list ||
    text === TEXT.en.list
  ) {
    await showMovieList(
      env,
      message.chat.id,
      user
    );
    return;
  }

  if (
    text === t(lang, "lang") ||
    text === TEXT.fa.lang ||
    text === TEXT.en.lang
  ) {
    await chooseLanguage(
      env,
      message.chat.id
    );
    return;
  }

  if (
    text === t(lang, "admin") ||
    text === TEXT.fa.admin ||
    text === TEXT.en.admin
  ) {
    await adminPanel(
      env,
      message.chat.id
    );
    return;
  }
}

/* =========================
   Update
========================= */

async function handleUpdate(
  env,
  update
) {
  if (update.callback_query) {
    await handleCallback(
      env,
      update.callback_query
    );
    return;
  }

  const message = update.message;

  if (!message || !message.from) return;

  const user =
    await ensureUser(
      env,
      message.from
    );

  await addUserToIndex(
    env,
    user.id
  );

  if (message.text === "/start") {
    await handleStart(
      env,
      message
    );
    return;
  }

  if (
    String(message.text || "")
      .startsWith("/start ref_")
  ) {
    await handleStart(
      env,
      message
    );
    return;
  }

  if (user.blocked) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(user.language, "blocked")
    });
    return;
  }

  if (message.video || message.document) {
    await receiveMovie(
      env,
      message,
      user
    );
    return;
  }

  await handleText(
    env,
    message,
    user
  );
}

/* =========================
   Worker
========================= */

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response(
        "Movie Bot is running.",
        { status: 200 }
      );
    }

    try {
      const update =
        await request.json();

      await handleUpdate(
        env,
        update
      );

      return new Response(
        "OK",
        { status: 200 }
      );
    } catch (error) {
      console.error(error);

      return new Response(
        "ERROR",
        { status: 500 }
      );
    }
  }
};
