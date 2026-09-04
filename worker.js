const MOVIE_COOLDOWN = 10_000;
const AUTO_DELETE_TIME = 20_000;
const MOVIE_PAGE_SIZE = 10;

const CHANNEL_ID = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";

/* =========================================================
   Telegram API
========================================================= */

async function telegram(env, method, data = {}) {
  const token = env.BOT_TOKEN;

  if (!token) {
    throw new Error("BOT_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!result.ok) {
    console.error("Telegram API error:", method, result);
  }

  return result;
}


/* =========================================================
   Helpers
========================================================= */

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function getAdminId(env) {
  return String(env.ADMIN_ID || "");
}

function isAdmin(env, userId) {
  return String(userId) === getAdminId(env);
}

function randomId() {
  return Math.random().toString(36).substring(2, 10);
}

function now() {
  return Date.now();
}

function escapeText(text = "") {
  return String(text);
}


/* =========================================================
   Language
========================================================= */

const TEXTS = {
  fa: {
    chooseLanguage: "🌐 زبان خود را انتخاب کنید:",
    languageSaved: "✅ زبان با موفقیت انتخاب شد.",
    joinChannel: "🔒 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",
    joinChannelButton: "📢 عضویت در کانال",
    checkMembership: "✅ بررسی عضویت",
    notMember: "❌ هنوز عضو کانال نشده‌اید.\n\nابتدا عضو کانال شوید و سپس «بررسی عضویت» را بزنید.",
    welcome: "🎬 به ربات فیلم خوش آمدید.",
    menu: "یکی از گزینه‌های زیر را انتخاب کنید:",
    getMovie: "🎬 دریافت فیلم",
    sendMovie: "📤 ارسال فیلم",
    dailyMovie: "🍿 فیلم پیشنهادی امروز",
    statistics: "📊 آمار",
    topMovies: "🏆 پربازدیدترین‌ها",
    bestMovies: "⭐ برترین‌ها",
    language: "🌐 تغییر زبان",
    adminPanel: "⚙️ پنل مدیریت",
    movieNotFound: "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد.",
    cooldown: "⏳ بعد از ۱۰ ثانیه دوباره تلاش کنید.",
    sendYourMovie: "🎬 فیلم خود را ارسال کنید.",
    movieReceived: "✅ فیلم شما دریافت شد و پس از تأیید مدیر منتشر می‌شود.",
    movieApproved: "✅ فیلم با موفقیت تأیید شد.",
    movieRejected: "❌ فیلم رد شد.",
    rating: "⭐ امتیاز خود را ثبت کنید:",
    alreadyRated: "⚠️ شما قبلاً به این فیلم امتیاز داده‌اید.",
    ratingSaved: "⭐ امتیاز شما ثبت شد. ممنون!",
    noPermission: "⛔ شما اجازه انجام این کار را ندارید.",
    admin: "⚙️ پنل مدیریت",
    movieList: "🎬 لیست فیلم‌ها",
    users: "👥 کاربران",
    pending: "📥 فیلم‌های در انتظار تأیید",
    announcement: "📢 اطلاعیه",
    block: "🚫 بلاک کاربر",
    unblock: "✅ آنبلاک کاربر",
    info: "💾 اطلاعات ربات",
    back: "🔙 بازگشت",
    next: "صفحه بعد ➡️",
    previous: "⬅️ صفحه قبل",
    page: "صفحه",
    emptyMovies: "📭 آرشیو فیلم خالی است.",
    watchMovie: "👀 مشاهده فیلم",
    deleteMovie: "🗑 حذف فیلم",
    featured: "⭐ پیشنهادی",
    featuredOff: "☆ پیشنهادی",
    deleteQuestion: "❗ این فیلم حذف شود؟",
    yesDelete: "✅ بله، حذف کن",
    cancel: "❌ لغو",
    movieDeleted: "🗑 فیلم حذف شد.",
    movieFeatured: "⭐ وضعیت پیشنهادی تغییر کرد.",
    announcementText: "📢 متن اطلاعیه را ارسال کنید.",
    announcementDone: "✅ اطلاعیه برای کاربران ارسال شد.",
    blockText: "🚫 آیدی کاربر را ارسال کنید.",
    unblockText: "✅ آیدی کاربر را ارسال کنید.",
    blocked: "🚫 کاربر بلاک شد.",
    unblocked: "✅ کاربر آنبلاک شد.",
    invalidId: "❌ آیدی معتبر نیست.",
    noPending: "📭 فیلمی در انتظار تأیید نیست.",
    approve: "✅ تأیید",
    reject: "❌ رد",
    usersCount: "👥 تعداد کاربران",
    moviesCount: "🎬 تعداد فیلم‌ها",
    pendingCount: "📥 در انتظار تأیید",
    viewsCount: "👀 مجموع بازدیدها",
    infoTitle: "💾 اطلاعات ربات",
    noFeatured: "⭐ هنوز فیلم پیشنهادی وجود ندارد.",
    noTop: "🏆 هنوز اطلاعات کافی وجود ندارد.",
    noBest: "⭐ هنوز امتیازی ثبت نشده است."
  },

  en: {
    chooseLanguage: "🌐 Choose your language:",
    languageSaved: "✅ Language saved.",
    joinChannel: "🔒 Please join our channel first.",
    joinChannelButton: "📢 Join Channel",
    checkMembership: "✅ Check Membership",
    notMember: "❌ You are not a member yet.",
    welcome: "🎬 Welcome to the movie bot.",
    menu: "Choose an option:",
    getMovie: "🎬 Get Movie",
    sendMovie: "📤 Send Movie",
    dailyMovie: "🍿 Today's Movie",
    statistics: "📊 Statistics",
    topMovies: "🏆 Most Viewed",
    bestMovies: "⭐ Top Rated",
    language: "🌐 Change Language",
    adminPanel: "⚙️ Admin Panel",
    movieNotFound: "📭 No movies available.",
    cooldown: "⏳ Please try again after 10 seconds.",
    sendYourMovie: "🎬 Send your movie.",
    movieReceived: "✅ Your movie was received.",
    rating: "⭐ Rate this movie:",
    alreadyRated: "⚠️ You already rated this movie.",
    ratingSaved: "⭐ Your rating was saved.",
    noPermission: "⛔ You don't have permission.",
    admin: "⚙️ Admin Panel",
    movieList: "🎬 Movie List",
    users: "👥 Users",
    pending: "📥 Pending Movies",
    announcement: "📢 Announcement",
    block: "🚫 Block User",
    unblock: "✅ Unblock User",
    info: "💾 Bot Information",
    back: "🔙 Back",
    next: "Next ➡️",
    previous: "⬅️ Previous",
    page: "Page",
    emptyMovies: "📭 Movie archive is empty.",
    watchMovie: "👀 Watch Movie",
    deleteMovie: "🗑 Delete Movie",
    featured: "⭐ Featured",
    featuredOff: "☆ Featured",
    deleteQuestion: "❗ Delete this movie?",
    yesDelete: "✅ Yes, delete",
    cancel: "❌ Cancel",
    movieDeleted: "🗑 Movie deleted.",
    movieFeatured: "⭐ Featured status changed.",
    noPending: "📭 No pending movies.",
    approve: "✅ Approve",
    reject: "❌ Reject",
    usersCount: "👥 Users",
    moviesCount: "🎬 Movies",
    pendingCount: "📥 Pending",
    viewsCount: "👀 Total Views",
    infoTitle: "💾 Bot Information",
    noFeatured: "⭐ No featured movie yet.",
    noTop: "🏆 Not enough data yet.",
    noBest: "⭐ No ratings yet."
  }
};

function t(language, key) {
  const lang = TEXTS[language] ? language : "fa";
  return TEXTS[lang][key] || TEXTS.fa[key] || key;
}

function getLanguage(user) {
  return user?.language || "fa";
    }
/* =========================================================
   KV helpers
========================================================= */

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

async function getUser(env, userId) {
  return await getJSON(env, `user:${userId}`, {
    id: String(userId),
    language: "fa",
    blocked: false,
    joined: false,
    created_at: now()
  });
}

async function saveUser(env, user) {
  await putJSON(env, `user:${user.id}`, user);
}


/* =========================================================
   User system
========================================================= */

async function ensureUser(env, from) {
  const userId = String(from.id);

  let user = await getUser(env, userId);

  user.id = userId;

  if (from.username) user.username = from.username;
  if (from.first_name) user.first_name = from.first_name;
  if (!user.created_at) user.created_at = now();

  await saveUser(env, user);

  return user;
}

async function isBlocked(env, userId) {
  const user = await getUser(env, userId);
  return Boolean(user.blocked);
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

    const status = result.result.status;

    return [
      "creator",
      "administrator",
      "member"
    ].includes(status);
  } catch {
    return false;
  }
}

async function sendMembershipMessage(env, chatId) {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "🔒 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",
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
            callback_data: "check_membership"
          }
        ]
      ]
    }
  });
}


/* =========================================================
   Main menu
========================================================= */

function mainKeyboard(language = "fa", admin = false) {
  const keyboard = [
    [
      {
        text: t(language, "getMovie")
      },
      {
        text: t(language, "dailyMovie")
      }
    ],
    [
      {
        text: t(language, "sendMovie")
      },
      {
        text: t(language, "topMovies")
      }
    ],
    [
      {
        text: t(language, "bestMovies")
      },
      {
        text: t(language, "statistics")
      }
    ],
    [
      {
        text: t(language, "language")
      }
    ]
  ];

  if (admin) {
    keyboard.push([
      {
        text: t(language, "adminPanel")
      }
    ]);
  }

  return {
    keyboard,
    resize_keyboard: true
  };
}

async function sendMainMenu(env, chatId, user) {
  const language = getLanguage(user);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${t(language, "welcome")}\n\n${t(language, "menu")}`,
    reply_markup: mainKeyboard(
      language,
      isAdmin(env, user.id)
    )
  });
}


/* =========================================================
   /start
========================================================= */

async function handleStart(env, chatId, from) {
  const user = await ensureUser(env, from);

  if (user.blocked) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🚫 دسترسی شما به ربات مسدود شده است."
    });
    return;
  }

  if (!user.language_selected) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🌐 زبان خود را انتخاب کنید:",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🇮🇷 فارسی", callback_data: "lang:fa" },
            { text: "🇬🇧 English", callback_data: "lang:en" }
          ]
        ]
      }
    });

    return;
  }

  const member = await checkMembership(env, from.id);

  if (!member) {
    await sendMembershipMessage(env, chatId);
    return;
  }

  user.joined = true;
  await saveUser(env, user);

  await sendMainMenu(env, chatId, user);
}


/* =========================================================
   Language callback
========================================================= */

async function handleLanguageCallback(env, callback) {
  const userId = String(callback.from.id);
  const chatId = callback.message.chat.id;

  const language = callback.data.split(":")[1];

  const user = await getUser(env, userId);

  user.language = language === "en" ? "en" : "fa";
  user.language_selected = true;

  await saveUser(env, user);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callback.id,
    text: t(user.language, "languageSaved")
  });

  const member = await checkMembership(env, userId);

  if (!member) {
    await sendMembershipMessage(env, chatId);
    return;
  }

  await sendMainMenu(env, chatId, user);
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

  return movies.find(
    movie => String(movie.id) === String(movieId)
  ) || null;
}

async function addMovie(env, movie) {
  const movies = await getMovies(env);

  if (!movie.featured) {
    movie.featured = false;
  }

  movies.push(movie);

  await saveMovies(env, movies);

  return movie;
}

async function deleteMovieById(env, movieId) {
  const movies = await getMovies(env);

  const filtered = movies.filter(
    movie => String(movie.id) !== String(movieId)
  );

  await saveMovies(env, filtered);
}


/* =========================================================
   Send movie
========================================================= */

async function sendMovie(
  env,
  chatId,
  movie,
  ctx = null,
  replyMarkup = null
) {
  if (!movie) return null;

  let result;

  const caption =
    movie.caption ||
    "🎬 فیلم";

  const options = {
    chat_id: chatId,
    caption,
    protect_content: false
  };

  if (replyMarkup) {
    options.reply_markup = replyMarkup;
  }

  if (movie.type === "document") {
    options.document = movie.file_id;

    result = await telegram(
      env,
      "sendDocument",
      options
    );
  } else {
    options.video = movie.file_id;

    result = await telegram(
      env,
      "sendVideo",
      options
    );
  }

  if (result.ok) {
    if (!movie.views) movie.views = 0;

    movie.views++;

    const movies = await getMovies(env);

    const index = movies.findIndex(
      m => String(m.id) === String(movie.id)
    );

    if (index !== -1) {
      movies[index] = movie;
      await saveMovies(env, movies);
    }

    if (
      ctx &&
      result.result &&
      result.result.message_id
    ) {
      const messageId = result.result.message_id;

      const deleteTask = new Promise(resolve => {
        setTimeout(async () => {
          try {
            await telegram(env, "deleteMessage", {
              chat_id: chatId,
              message_id: messageId
            });
          } catch (e) {
            console.error("Auto delete error:", e);
          }

          resolve();
        }, AUTO_DELETE_TIME);
      });

      ctx.waitUntil(deleteTask);
    }
  }

  return result;
}


/* =========================================================
   Random movie + 10 second anti spam
========================================================= */

async function handleGetMovie(env, chatId, userId, ctx) {
  const user = await getUser(env, userId);

  if (user.blocked) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🚫 دسترسی شما مسدود شده است."
    });
    return;
  }

  const lastTime = await env.BOT_DATA.get(
    `cooldown:${userId}`
  );

  if (lastTime) {
    const elapsed = now() - Number(lastTime);

    if (elapsed < MOVIE_COOLDOWN) {
      const remaining = Math.ceil(
        (MOVIE_COOLDOWN - elapsed) / 1000
      );

      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: `⏳ بعد از ${remaining} ثانیه دوباره تلاش کنید.`
      });

      return;
    }
  }

  const movies = await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد."
    });

    return;
  }

  const movie =
    movies[Math.floor(Math.random() * movies.length)];

  const result = await sendMovie(
    env,
    chatId,
    movie,
    ctx
  );

  // فقط اگر ارسال فیلم موفق شد cooldown ثبت می‌شود.
  if (result && result.ok) {
    await env.BOT_DATA.put(
      `cooldown:${userId}`,
      String(now()),
      {
        expirationTtl: 20
      }
    );

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "⭐ به فیلم امتیاز بدهید:",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⭐", callback_data: `rate:${movie.id}:1` },
            { text: "⭐⭐", callback_data: `rate:${movie.id}:2` },
            { text: "⭐⭐⭐", callback_data: `rate:${movie.id}:3` }
          ],
          [
            { text: "⭐⭐⭐⭐", callback_data: `rate:${movie.id}:4` },
            { text: "⭐⭐⭐⭐⭐", callback_data: `rate:${movie.id}:5` }
          ]
        ]
      }
    });
  }
}


/* =========================================================
   Daily movie
========================================================= */

async function handleDailyMovie(env, chatId, ctx) {
  const movies = await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد."
    });

    return;
  }

  const today =
    new Date().toISOString().slice(0, 10);

  let index = 0;

  for (let i = 0; i < today.length; i++) {
    index += today.charCodeAt(i);
  }

  index = index % movies.length;

  await sendMovie(
    env,
    chatId,
    movies[index],
    ctx
  );
}


/* =========================================================
   Rating
========================================================= */

async function handleRating(
  env,
  callback,
  movieId,
  rating
) {
  const userId = String(callback.from.id);

  const movie = await findMovie(env, movieId);

  if (!movie) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "❌ فیلم پیدا نشد."
    });

    return;
  }

  const ratingKey =
    `rating:${movieId}:${userId}`;

  const alreadyRated =
    await env.BOT_DATA.get(ratingKey);

  if (alreadyRated) {
    const user = await getUser(env, userId);
    const language = getLanguage(user);

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: t(language, "alreadyRated"),
      show_alert: true
    });

    return;
  }

  await env.BOT_DATA.put(
    ratingKey,
    String(rating)
  );

  const allRatings =
    await getJSON(
      env,
      `ratings:${movieId}`,
      []
    );

  allRatings.push(Number(rating));

  await putJSON(
    env,
    `ratings:${movieId}`,
    allRatings
  );

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callback.id,
    text: "⭐ امتیاز شما ثبت شد."
  });

  await telegram(env, "sendMessage", {
    chat_id: callback.message.chat.id,
    text: "⭐ امتیاز شما ثبت شد. ممنون!"
  });
        }
/* =========================================================
   Admin movie list
========================================================= */

function movieListKeyboard(
  movies,
  page,
  totalPages
) {
  const keyboard = [];

  const start = page * MOVIE_PAGE_SIZE;
  const pageMovies =
    movies.slice(
      start,
      start + MOVIE_PAGE_SIZE
    );

  pageMovies.forEach((movie, index) => {
    const number =
      start + index + 1;

    const icon =
      movie.featured ? "⭐" : "🎬";

    keyboard.push([
      {
        text: `${icon} فیلم ${number}`,
        callback_data:
          `movies:view:${movie.id}:${page}`
      }
    ]);
  });

  const navigation = [];

  if (page > 0) {
    navigation.push({
      text: "⬅️ صفحه قبل",
      callback_data:
        `movies:list:${page - 1}`
    });
  }

  navigation.push({
    text: `صفحه ${page + 1}`,
    callback_data:
      `movies:list:${page}`
  });

  if (page < totalPages - 1) {
    navigation.push({
      text: "صفحه بعد ➡️",
      callback_data:
        `movies:list:${page + 1}`
    });
  }

  keyboard.push(navigation);

  keyboard.push([
    {
      text: "🔙 بازگشت",
      callback_data: "admin:back"
    }
  ]);

  return {
    inline_keyboard: keyboard
  };
}

async function showMoviesList(
  env,
  chatId,
  page = 0,
  messageId = null
) {
  const movies = await getMovies(env);

  if (!movies.length) {
    const markup = {
      inline_keyboard: [
        [
          {
            text: "🔙 بازگشت",
            callback_data: "admin:back"
          }
        ]
      ]
    };

    if (messageId) {
      await telegram(env, "editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: "📭 آرشیو فیلم خالی است.",
        reply_markup: markup
      });
    } else {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: "📭 آرشیو فیلم خالی است.",
        reply_markup: markup
      });
    }

    return;
  }

  const totalPages =
    Math.ceil(
      movies.length / MOVIE_PAGE_SIZE
    );

  page = Math.max(
    0,
    Math.min(page, totalPages - 1)
  );

  const text =
    `🎬 لیست فیلم‌ها\n\n` +
    `صفحه ${page + 1} از ${totalPages}\n\n` +
    `تعداد کل فیلم‌ها: ${movies.length}`;

  const markup =
    movieListKeyboard(
      movies,
      page,
      totalPages
    );

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


/* =========================================================
   Admin movie details
========================================================= */

async function showMovieDetails(
  env,
  chatId,
  movieId,
  page = 0,
  editMessage = false,
  messageId = null
) {
  const movie =
    await findMovie(env, movieId);

  if (!movie) {
    if (editMessage && messageId) {
      await telegram(env, "editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text: "❌ فیلم پیدا نشد."
      });
    } else {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: "❌ فیلم پیدا نشد."
      });
    }

    return;
  }

  const featured =
    movie.featured === true;

  const markup = {
    inline_keyboard: [
      [
        {
          text: "👀 مشاهده فیلم",
          callback_data:
            `movies:watch:${movie.id}:${page}`
        }
      ],
      [
        {
          text: "🗑 حذف فیلم",
          callback_data:
            `movies:delete:${movie.id}:${page}`
        }
      ],
      [
        {
          text: featured
            ? "☆ پیشنهادی"
            : "⭐ پیشنهادی",
          callback_data:
            `movies:featured:${movie.id}:${page}`
        }
      ],
      [
        {
          text: "🔙 بازگشت",
          callback_data:
            `movies:back:${page}`
        }
      ]
    ]
  };

  const text =
    `🎬 فیلم\n\n` +
    `👀 بازدید: ${movie.views || 0}\n` +
    `⭐ پیشنهادی: ${featured ? "بله" : "خیر"}\n` +
    `🕐 تاریخ افزودن: ${movie.added_at || "-"}\n\n` +
    `${movie.caption || "بدون توضیحات"}`;

  if (editMessage && messageId) {
    await telegram(env, "editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: markup
    });

    return;
  }

  // اول خود فیلم برای مدیر ارسال می‌شود
  await sendMovie(
    env,
    chatId,
    movie,
    null,
    markup
  );
}


/* =========================================================
   Admin movie watch
========================================================= */

async function adminWatchMovie(
  env,
  chatId,
  movieId
) {
  const movie =
    await findMovie(env, movieId);

  if (!movie) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: "",
      text: "❌ فیلم پیدا نشد."
    });

    return;
  }

  const markup = {
    inline_keyboard: [
      [
        {
          text: "👀 مشاهده فیلم",
          callback_data:
            `movies:watch:${movie.id}:0`
        }
      ],
      [
        {
          text: movie.featured
            ? "☆ پیشنهادی"
            : "⭐ پیشنهادی",
          callback_data:
            `movies:featured:${movie.id}:0`
        }
      ],
      [
        {
          text: "🗑 حذف فیلم",
          callback_data:
            `movies:delete:${movie.id}:0`
        }
      ],
      [
        {
          text: "🔙 بازگشت",
          callback_data:
            `movies:back:0`
        }
      ]
    ]
  };

  await sendMovie(
    env,
    chatId,
    movie,
    null,
    markup
  );
}


/* =========================================================
   Delete confirmation
========================================================= */

async function confirmDeleteMovie(
  env,
  chatId,
  movieId,
  page,
  messageId
) {
  const movie =
    await findMovie(env, movieId);

  if (!movie) {
    await telegram(env, "editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text: "❌ فیلم پیدا نشد."
    });

    return;
  }

  await telegram(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: "❗ این فیلم حذف شود؟",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ بله، حذف کن",
            callback_data:
              `movies:confirmdelete:${movieId}:${page}`
          }
        ],
        [
          {
            text: "❌ لغو",
            callback_data:
              `movies:view:${movieId}:${page}`
          }
        ]
      ]
    }
  });
}
async function deleteMovieConfirmed(
  env,
  chatId,
  movieId,
  page,
  messageId
) {
  await deleteMovieById(
    env,
    movieId
  );

  await telegram(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: "🗑 فیلم حذف شد.",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎬 بازگشت به لیست فیلم‌ها",
            callback_data:
              `movies:list:${page}`
          }
        ]
      ]
    }
  });
}


/* =========================================================
   Featured toggle
========================================================= */

async function toggleFeatured(
  env,
  chatId,
  movieId,
  page,
  messageId
) {
  const movies = await getMovies(env);

  const index =
    movies.findIndex(
      movie =>
        String(movie.id) ===
        String(movieId)
    );

  if (index === -1) return;

  movies[index].featured =
    !Boolean(movies[index].featured);

  await saveMovies(env, movies);

  const movie = movies[index];

  const featured =
    movie.featured === true;

  const markup = {
    inline_keyboard: [
      [
        {
          text: "👀 مشاهده فیلم",
          callback_data:
            `movies:watch:${movie.id}:${page}`
        }
      ],
      [
        {
          text: "🗑 حذف فیلم",
          callback_data:
            `movies:delete:${movie.id}:${page}`
        }
      ],
      [
        {
          text: featured
            ? "☆ پیشنهادی"
            : "⭐ پیشنهادی",
          callback_data:
            `movies:featured:${movie.id}:${page}`
        }
      ],
      [
        {
          text: "🔙 بازگشت",
          callback_data:
            `movies:back:${page}`
        }
      ]
    ]
  };

  const text =
    `🎬 فیلم\n\n` +
    `👀 بازدید: ${movie.views || 0}\n` +
    `⭐ پیشنهادی: ${featured ? "بله" : "خیر"}\n` +
    `🕐 تاریخ افزودن: ${movie.added_at || "-"}\n\n` +
    `${movie.caption || "بدون توضیحات"}`;

  await telegram(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    reply_markup: markup
  });
}


/* =========================================================
   Admin panel
========================================================= */

function adminKeyboard() {
  return {
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
          text: "📊 آمار",
          callback_data: "admin:stats"
        }
      ],
      [
        {
          text: "📢 اطلاعیه",
          callback_data: "admin:announcement"
        }
      ],
      [
        {
          text: "🚫 بلاک کاربر",
          callback_data: "admin:block"
        },
        {
          text: "✅ آنبلاک کاربر",
          callback_data: "admin:unblock"
        }
      ],
      [
        {
          text: "💾 اطلاعات ربات",
          callback_data: "admin:info"
        }
      ],
      [
        {
          text: "🔙 بازگشت",
          callback_data: "admin:back"
        }
      ]
    ]
  };
}

async function showAdminPanel(
  env,
  chatId,
  messageId = null
) {
  const text = "⚙️ پنل مدیریت\n\nیکی از گزینه‌ها را انتخاب کنید.";

  const data = {
    chat_id: chatId,
    text,
    reply_markup: adminKeyboard()
  };

  if (messageId) {
    data.message_id = messageId;

    await telegram(
      env,
      "editMessageText",
      data
    );
  } else {
    await telegram(
      env,
      "sendMessage",
      data
    );
  }
}


/* =========================================================
   Pending movies
========================================================= */

async function getPendingMovies(env) {
  return await getJSON(
    env,
    "pending_movies",
    []
  );
}

async function savePendingMovies(
  env,
  movies
) {
  await putJSON(
    env,
    "pending_movies",
    movies
  );
}

async function sendPendingList(
  env,
  chatId
) {
  const pending =
    await getPendingMovies(env);

  if (!pending.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📭 فیلمی در انتظار تأیید نیست."
    });

    return;
  }

  for (const movie of pending) {
    const text =
      `📥 فیلم در انتظار تأیید\n\n` +
      `👤 کاربر: ${movie.user_id}\n` +
      `🕐 ${movie.added_at || "-"}`;

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "👀 مشاهده",
              callback_data:
                `pending:view:${movie.id}`
            }
          ],
          [
            {
              text: "✅ تأیید",
              callback_data:
                `pending:approve:${movie.id}`
            },
            {
              text: "❌ رد",
              callback_data:
                `pending:reject:${movie.id}`
            }
          ]
        ]
      }
    });
  }
}
/* =========================================================
   User movie submission
========================================================= */

async function savePendingMovie(
  env,
  message,
  user
) {
  const pending =
    await getPendingMovies(env);

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
    caption:
      message.caption ||
      "🎬 فیلم ارسال‌شده توسط کاربر",
    user_id: String(user.id),
    added_at: new Date().toISOString(),
    views: 0,
    featured: false
  };

  pending.push(movie);

  await savePendingMovies(
    env,
    pending
  );

  return movie;
}

async function approvePendingMovie(
  env,
  movieId
) {
  const pending =
    await getPendingMovies(env);

  const index =
    pending.findIndex(
      movie =>
        String(movie.id) ===
        String(movieId)
    );

  if (index === -1) return null;

  const movie = pending[index];

  pending.splice(index, 1);

  await savePendingMovies(
    env,
    pending
  );

  delete movie.user_id;

  await addMovie(env, movie);

  return movie;
}

async function rejectPendingMovie(
  env,
  movieId
) {
  const pending =
    await getPendingMovies(env);

  const index =
    pending.findIndex(
      movie =>
        String(movie.id) ===
        String(movieId)
    );

  if (index === -1) return null;

  const movie = pending[index];

  pending.splice(index, 1);

  await savePendingMovies(
    env,
    pending
  );

  return movie;
}


/* =========================================================
   Statistics
========================================================= */

async function getAllUsers(env) {
  const list = await env.BOT_DATA.list({
    prefix: "user:"
  });

  const users = [];

  for (const key of list.keys) {
    const user =
      await getJSON(
        env,
        key.name,
        null
      );

    if (user) users.push(user);
  }

  return users;
}

async function getStatistics(env) {
  const users =
    await getAllUsers(env);

  const movies =
    await getMovies(env);

  const pending =
    await getPendingMovies(env);

  const totalViews =
    movies.reduce(
      (sum, movie) =>
        sum + Number(movie.views || 0),
      0
    );

  return {
    users: users.length,
    movies: movies.length,
    pending: pending.length,
    views: totalViews
  };
}

async function showStatistics(
  env,
  chatId,
  admin = false
) {
  const stats =
    await getStatistics(env);

  const text =
    `📊 آمار\n\n` +
    `👥 کاربران: ${stats.users}\n` +
    `🎬 فیلم‌ها: ${stats.movies}\n` +
    `📥 در انتظار تأیید: ${stats.pending}\n` +
    `👀 مجموع بازدیدها: ${stats.views}`;

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    ...(admin
      ? {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🔙 بازگشت",
                  callback_data:
                    "admin:back"
                }
              ]
            ]
          }
        }
      : {})
  });
}


/* =========================================================
   Most viewed movies
========================================================= */

async function showTopMovies(
  env,
  chatId,
  ctx = null
) {
  const movies =
    await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🏆 هنوز اطلاعات کافی وجود ندارد."
    });

    return;
  }

  const top =
    [...movies]
      .sort(
        (a, b) =>
          Number(b.views || 0) -
          Number(a.views || 0)
      )
      .slice(0, 10);

  let text =
    "🏆 پربازدیدترین فیلم‌ها\n\n";

  top.forEach((movie, index) => {
    text +=
      `${index + 1}. 🎬 فیلم ${index + 1}` +
      ` — 👀 ${movie.views || 0}\n`;
  });

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text
  });
}


/* =========================================================
   Top rated
========================================================= */

async function showBestMovies(
  env,
  chatId
) {
  const movies =
    await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "⭐ هنوز امتیازی ثبت نشده است."
    });

    return;
  }

  const results = [];

  for (const movie of movies) {
    const ratings =
      await getJSON(
        env,
        `ratings:${movie.id}`,
        []
      );

    if (!ratings.length) continue;

    const total =
      ratings.reduce(
        (a, b) => a + Number(b),
        0
      );

    const average =
      total / ratings.length;

    results.push({
      movie,
      average,
      count: ratings.length
    });
  }

  results.sort(
    (a, b) =>
      b.average - a.average
  );

  const top =
    results.slice(0, 10);

  if (!top.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "⭐ هنوز امتیازی ثبت نشده است."
    });

    return;
  }

  let text =
    "⭐ برترین فیلم‌ها\n\n";

  top.forEach((item, index) => {
    text +=
      `${index + 1}. 🎬 فیلم ${index + 1}` +
      ` — ⭐ ${item.average.toFixed(1)}` +
      ` (${item.count})\n`;
  });

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text
  });
}


/* =========================================================
   Featured movie
========================================================= */

async function showFeaturedMovie(
  env,
  chatId,
  ctx = null
) {
  const movies =
    await getMovies(env);

  const featured =
    movies.filter(
      movie => movie.featured === true
    );

  if (!featured.length) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "⭐ هنوز فیلم پیشنهادی وجود ندارد."
    });

    return;
  }

  const movie =
    featured[
      Math.floor(
        Math.random() *
        featured.length
      )
    ];

  await sendMovie(
    env,
    chatId,
    movie,
    ctx
  );
}
/* =========================================================
   Announcement system
========================================================= */

async function sendAnnouncement(
  env,
  text,
  ctx = null
) {
  const users =
    await getAllUsers(env);

  let sent = 0;

  for (const user of users) {
    if (user.blocked) continue;

    const task =
      telegram(env, "sendMessage", {
        chat_id: user.id,
        text: `📢 اطلاعیه\n\n${text}`
      })
      .then(() => {
        sent++;
      })
      .catch(() => {});

    if (ctx) {
      ctx.waitUntil(task);
    }
  }

  return sent;
}


/* =========================================================
   Block / Unblock
========================================================= */

async function blockUser(
  env,
  userId
) {
  const user =
    await getUser(env, userId);

  user.blocked = true;

  await saveUser(env, user);
}

async function unblockUser(
  env,
  userId
) {
  const user =
    await getUser(env, userId);

  user.blocked = false;

  await saveUser(env, user);
}


/* =========================================================
   Admin state
========================================================= */

async function setAdminState(
  env,
  userId,
  state
) {
  await env.BOT_DATA.put(
    `admin_state:${userId}`,
    state
  );
}

async function getAdminState(
  env,
  userId
) {
  return await env.BOT_DATA.get(
    `admin_state:${userId}`
  );
}

async function clearAdminState(
  env,
  userId
) {
  await env.BOT_DATA.delete(
    `admin_state:${userId}`
  );
}


/* =========================================================
   Admin text commands / states
========================================================= */

async function handleAdminText(
  env,
  message,
  ctx
) {
  const userId =
    String(message.from.id);

  const state =
    await getAdminState(
      env,
      userId
    );

  if (!state) return false;

  if (state === "announcement") {
    await clearAdminState(
      env,
      userId
    );

    await sendAnnouncement(
      env,
      message.text || "",
      ctx
    );

    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "✅ اطلاعیه برای کاربران ارسال شد."
    });

    return true;
  }

  if (state === "block") {
    await clearAdminState(
      env,
      userId
    );

    const target =
      String(
        (message.text || "").trim()
      );

    if (!/^\d+$/.test(target)) {
      await telegram(env, "sendMessage", {
        chat_id: message.chat.id,
        text: "❌ آیدی معتبر نیست."
      });

      return true;
    }

    await blockUser(
      env,
      target
    );

    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: `🚫 کاربر ${target} بلاک شد.`
    });

    return true;
  }

  if (state === "unblock") {
    await clearAdminState(
      env,
      userId
    );

    const target =
      String(
        (message.text || "").trim()
      );

    if (!/^\d+$/.test(target)) {
      await telegram(env, "sendMessage", {
        chat_id: message.chat.id,
        text: "❌ آیدی معتبر نیست."
      });

      return true;
    }

    await unblockUser(
      env,
      target
    );

    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: `✅ کاربر ${target} آنبلاک شد.`
    });

    return true;
  }

  return false;
}


/* =========================================================
   Normal buttons
========================================================= */

async function handleButtonMessage(
  env,
  message,
  ctx
) {
  const chatId =
    message.chat.id;

  const user =
    await ensureUser(
      env,
      message.from
    );

  const language =
    getLanguage(user);

  const text =
    message.text || "";

  if (
    text === t(language, "getMovie") ||
    text === "🎬 دریافت فیلم"
  ) {
    const member =
      await checkMembership(
        env,
        user.id
      );

    if (!member) {
      await sendMembershipMessage(
        env,
        chatId
      );
      return;
    }

    await handleGetMovie(
      env,
      chatId,
      user.id,
      ctx
    );

    return;
  }

  if (
    text === t(language, "dailyMovie") ||
    text === "🍿 فیلم پیشنهادی امروز"
  ) {
    await handleDailyMovie(
      env,
      chatId,
      ctx
    );
    return;
  }

  if (
    text === t(language, "sendMovie") ||
    text === "📤 ارسال فیلم"
  ) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🎬 فیلم خود را ارسال کنید."
    });

    return;
  }

  if (
    text === t(language, "topMovies") ||
    text === "🏆 پربازدیدترین‌ها"
  ) {
    await showTopMovies(
      env,
      chatId,
      ctx
    );
    return;
  }

  if (
    text === t(language, "bestMovies") ||
    text === "⭐ برترین‌ها"
  ) {
    await showBestMovies(
      env,
      chatId
    );
    return;
  }

  if (
    text === t(language, "statistics") ||
    text === "📊 آمار"
  ) {
    await showStatistics(
      env,
      chatId
    );
    return;
  }

  if (
    text === t(language, "language") ||
    text === "🌐 تغییر زبان"
  ) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🌐 زبان خود را انتخاب کنید:",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🇮🇷 فارسی",
              callback_data: "lang:fa"
            },
            {
              text: "🇬🇧 English",
              callback_data: "lang:en"
            }
          ]
        ]
      }
    });

    return;
  }

  if (
    isAdmin(env, user.id) &&
    (
      text === t(language, "adminPanel") ||
      text === "⚙️ پنل مدیریت"
    )
  ) {
    await showAdminPanel(
      env,
      chatId
    );
    return;
  }
}
/* =========================================================
   Admin callbacks
========================================================= */

async function handleAdminCallback(
  env,
  callback,
  ctx
) {
  const userId =
    String(callback.from.id);

  if (!isAdmin(env, userId)) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "⛔ دسترسی ندارید.",
      show_alert: true
    });

    return;
  }

  const data =
    callback.data;

  const chatId =
    callback.message.chat.id;

  const messageId =
    callback.message.message_id;

  if (data === "admin:movies") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await showMoviesList(
      env,
      chatId,
      0
    );

    return;
  }

  if (data.startsWith("movies:list:")) {
    const page =
      Number(
        data.split(":")[2]
      ) || 0;

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await showMoviesList(
      env,
      chatId,
      page,
      messageId
    );

    return;
  }

  if (data.startsWith("movies:view:")) {
    const parts =
      data.split(":");

    const movieId = parts[2];
    const page =
      Number(parts[3]) || 0;

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    // فیلم برای خود مدیر ارسال می‌شود
    await showMovieDetails(
      env,
      chatId,
      movieId,
      page
    );

    return;
  }

  if (data.startsWith("movies:watch:")) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await adminWatchMovie(
      env,
      chatId,
      movieId
    );

    return;
  }

  if (data.startsWith("movies:delete:")) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    const page =
      Number(parts[3]) || 0;

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await confirmDeleteMovie(
      env,
      chatId,
      movieId,
      page,
      messageId
    );

    return;
  }

  if (
    data.startsWith(
      "movies:confirmdelete:"
    )
  ) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    const page =
      Number(parts[3]) || 0;

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "🗑 در حال حذف..."
    });

    await deleteMovieConfirmed(
      env,
      chatId,
      movieId,
      page,
      messageId
    );

    return;
  }

  if (
    data.startsWith(
      "movies:featured:"
    )
  ) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    const page =
      Number(parts[3]) || 0;

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "⭐ انجام شد."
    });

    await toggleFeatured(
      env,
      chatId,
      movieId,
      page,
      messageId
    );

    return;
  }

  if (
    data.startsWith(
      "movies:back:"
    )
  ) {
    const page =
      Number(
        data.split(":")[2]
      ) || 0;

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await showMoviesList(
      env,
      chatId,
      page,
      messageId
    );

    return;
  }

  if (data === "admin:pending") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await sendPendingList(
      env,
      chatId
    );

    return;
  }

  if (data === "admin:stats") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await showStatistics(
      env,
      chatId,
      true
    );

    return;
  }

  if (data === "admin:announcement") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await setAdminState(
      env,
      userId,
      "announcement"
    );

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📢 متن اطلاعیه را ارسال کنید."
    });

    return;
  }

  if (data === "admin:block") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await setAdminState(
      env,
      userId,
      "block"
    );

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🚫 آیدی کاربر را ارسال کنید."
    });

    return;
  }

  if (data === "admin:unblock") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await setAdminState(
      env,
      userId,
      "unblock"
    );

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "✅ آیدی کاربر را ارسال کنید."
    });

    return;
  }

  if (data === "admin:info") {
    const stats =
      await getStatistics(env);

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text:
        `💾 اطلاعات ربات\n\n` +
        `🤖 وضعیت: فعال\n` +
        `🎬 فیلم‌ها: ${stats.movies}\n` +
        `👥 کاربران: ${stats.users}\n` +
        `📥 در انتظار: ${stats.pending}\n` +
        `👀 بازدیدها: ${stats.views}\n` +
        `☁️ Cloudflare Workers + KV`
    });

    return;
  }

  if (data === "admin:back") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await showAdminPanel(
      env,
      chatId,
      messageId
    );

    return;
  }
}


/* =========================================================
   Pending callbacks
========================================================= */

async function handlePendingCallback(
  env,
  callback
) {
  if (
    !isAdmin(
      env,
      callback.from.id
    )
  ) {
    return;
  }

  const data =
    callback.data;

  const parts =
    data.split(":");

  const action =
    parts[1];

  const movieId =
    parts[2];

  if (action === "approve") {
    const movie =
      await approvePendingMovie(
        env,
        movieId
      );

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: movie
        ? "✅ فیلم تأیید شد."
        : "❌ فیلم پیدا نشد."
    });

    if (movie) {
      await telegram(env, "sendMessage", {
        chat_id: movie.user_id,
        text: "✅ فیلم شما تأیید شد و به آرشیو اضافه شد."
      });
    }

    return;
  }

  if (action === "reject") {
    const movie =
      await rejectPendingMovie(
        env,
        movieId
      );

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: movie
        ? "❌ فیلم رد شد."
        : "❌ فیلم پیدا نشد."
    });

    if (movie) {
      await telegram(env, "sendMessage", {
        chat_id: movie.user_id,
        text: "❌ فیلم شما توسط مدیر رد شد."
      });
    }

    return;
  }

  if (action === "view") {
    const pending =
      await getPendingMovies(env);

    const movie =
      pending.find(
        m =>
          String(m.id) ===
          String(movieId)
      );

    if (!movie) {
      await telegram(env, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "❌ فیلم پیدا نشد."
      });

      return;
    }

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id
    });

    await sendMovie(
      env,
      callback.message.chat.id,
      movie
    );
  }
}


/* =========================================================
   Callback handler
========================================================= */

async function handleCallback(
  env,
  callback,
  ctx
) {
  const data =
    callback.data || "";

  if (data.startsWith("lang:")) {
    await handleLanguageCallback(
      env,
      callback
    );
    return;
  }

  if (data === "check_membership") {
    const userId =
      String(callback.from.id);

    const member =
      await checkMembership(
        env,
        userId
      );

    if (!member) {
      await telegram(env, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "❌ هنوز عضو کانال نشده‌اید.",
        show_alert: true
      });

      return;
    }

    const user =
      await getUser(
        env,
        userId
      );

    user.joined = true;

    await saveUser(
      env,
      user
    );

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: "✅ عضویت تأیید شد."
    });

    await sendMainMenu(
      env,
      callback.message.chat.id,
      user
    );

    return;
  }

  if (data.startsWith("rate:")) {
    const parts =
      data.split(":");

    const movieId =
      parts[1];

    const rating =
      Number(parts[2]);

    await handleRating(
      env,
      callback,
      movieId,
      rating
    );

    return;
  }

  if (
    data.startsWith("admin:") ||
    data.startsWith("movies:")
  ) {
    await handleAdminCallback(
      env,
      callback,
      ctx
    );

    return;
  }

  if (
    data.startsWith("pending:")
  ) {
    await handlePendingCallback(
      env,
      callback
    );

    return;
  }
}


/* =========================================================
   Incoming movie
========================================================= */

async function handleIncomingMovie(
  env,
  message
) {
  const user =
    await ensureUser(
      env,
      message.from
    );

  if (user.blocked) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "🚫 دسترسی شما مسدود شده است."
    });

    return;
  }

  const movie =
    await savePendingMovie(
      env,
      message,
      user
    );

  if (!movie) return;

  await telegram(env, "sendMessage", {
    chat_id: message.chat.id,
    text: "✅ فیلم شما دریافت شد و پس از تأیید مدیر منتشر می‌شود."
  });

  const adminId =
    getAdminId(env);

  if (adminId) {
    await telegram(env, "sendMessage", {
      chat_id: adminId,
      text:
        `📥 فیلم جدید برای بررسی\n\n` +
        `👤 کاربر: ${user.id}\n` +
        `🕐 ${movie.added_at}`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "👀 مشاهده",
              callback_data:
                `pending:view:${movie.id}`
            }
          ],
          [
            {
              text: "✅ تأیید",
              callback_data:
                `pending:approve:${movie.id}`
            },
            {
              text: "❌ رد",
              callback_data:
                `pending:reject:${movie.id}`
            }
          ]
        ]
      }
    });

    await sendMovie(
      env,
      adminId,
      movie
    );
  }
}


/* =========================================================
   Message handler
========================================================= */

async function handleMessage(
  env,
  message,
  ctx
) {
  if (!message.from) return;

  const user =
    await ensureUser(
      env,
      message.from
    );

  if (user.blocked) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "🚫 دسترسی شما مسدود شده است."
    });

    return;
  }

  // دستورات
  if (message.text === "/start") {
    await handleStart(
      env,
      message.chat.id,
      message.from
    );

    return;
  }

  if (
    isAdmin(env, user.id) &&
    message.text === "/admin"
  ) {
    await showAdminPanel(
      env,
      message.chat.id
    );

    return;
  }

  // وضعیت‌های پنل مدیریت
  if (
    isAdmin(env, user.id) &&
    message.text
  ) {
    const handled =
      await handleAdminText(
        env,
        message,
        ctx
      );

    if (handled) return;
  }

  // ارسال فیلم / فایل
  if (
    message.video ||
    message.document
  ) {
    await handleIncomingMovie(
      env,
      message
    );

    return;
  }

  // دکمه‌های معمولی
  if (message.text) {
    await handleButtonMessage(
      env,
      message,
      ctx
    );
  }
}


/* =========================================================
   Update processor
========================================================= */

async function processUpdate(
  env,
  update,
  ctx
) {
  if (update.message) {
    await handleMessage(
      env,
      update.message,
      ctx
    );
  }

  if (update.callback_query) {
    await handleCallback(
      env,
      update.callback_query,
      ctx
    );
  }
}


/* =========================================================
   Webhook / Fetch
========================================================= */

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "GET") {
        return new Response(
          "Film Bot is running.",
          {
            status: 200,
            headers: {
              "Content-Type":
                "text/plain; charset=utf-8"
            }
          }
        );
      }

      if (request.method !== "POST") {
        return new Response(
          "Method Not Allowed",
          {
            status: 405
          }
        );
      }

      const update =
        await request.json();

      ctx.waitUntil(
        processUpdate(
          env,
          update,
          ctx
        ).catch(error => {
          console.error(
            "Update error:",
            error
          );
        })
      );

      return new Response("OK");
    } catch (error) {
      console.error(
        "Worker error:",
        error
      );

      return new Response(
        "OK",
        {
          status: 200
        }
      );
    }
  }
};
