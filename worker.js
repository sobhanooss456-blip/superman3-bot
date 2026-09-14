const MOVIE_COOLDOWN = 10_000;
const AUTO_DELETE_TIME = 10_000;
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
    console.error(
      "Telegram API error:",
      method,
      result
    );
  }

  return result;
}

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8"
      }
    }
  );
}

function getAdminId(env) {
  return String(env.ADMIN_ID || "");
}

function isAdmin(env, userId) {
  return String(userId) === getAdminId(env);
}

function randomId() {
  return Math.random()
    .toString(36)
    .substring(2, 10);
}

function now() {
  return Date.now();
}

/* =========================================================
   Language
========================================================= */

const TEXTS = {
  fa: {
    chooseLanguage:
      "🌐 Choose your language / زبان خود را انتخاب کنید:",
    languageSaved:
      "✅ زبان با موفقیت ذخیره شد.",
    joinChannel:
      "🔒 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",
    joinChannelButton:
      "📢 عضویت در کانال",
    checkMembership:
      "✅ بررسی عضویت",
    notMember:
      "❌ هنوز عضو کانال نشده‌اید.\n\nابتدا عضو کانال شوید و سپس «بررسی عضویت» را بزنید.",
    welcome:
      "🎬 به ربات فیلم خوش آمدید.",
    menu:
      "یکی از گزینه‌های زیر را انتخاب کنید:",
    getMovie:
      "📥 دریافت فیلم",
    sendMovie:
      "📤 ارسال فیلم",
    dailyMovie:
      "🍿 فیلم پیشنهادی امروز",
    statistics:
      "📊 آمار",
    topMovies:
      "🏆 پربازدیدترین‌ها",
    bestMovies:
      "⭐ برترین‌ها",
    language:
      "🌐 تغییر زبان",
    adminPanel:
      "👑 پنل مدیریت",
    movieNotFound:
      "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد.",
    cooldown:
      "⏳ بعد از چند ثانیه دوباره تلاش کنید.",
    sendYourMovie:
      "🎬 فیلم خود را ارسال کنید.",
    movieReceived:
      "✅ فیلم شما دریافت شد و پس از تأیید مدیر منتشر می‌شود.",
    movieApproved:
      "✅ فیلم با موفقیت تأیید شد.",
    movieRejected:
      "❌ فیلم رد شد.",
    rating:
      "⭐ امتیاز خود را ثبت کنید:",
    alreadyRated:
      "⚠️ شما قبلاً به این فیلم امتیاز داده‌اید.",
    ratingSaved:
      "⭐ امتیاز شما ثبت شد. ممنون!",
    noPermission:
      "⛔ شما اجازه انجام این کار را ندارید.",
    admin:
      "👑 پنل مدیریت",
    movieList:
      "🎬 لیست فیلم‌ها",
    users:
      "👥 کاربران",
    pending:
      "📥 فیلم‌های در انتظار تأیید",
    announcement:
      "📢 اطلاعیه",
    block:
      "🚫 بلاک کاربر",
    unblock:
      "✅ آنبلاک کاربر",
    info:
      "💾 اطلاعات ربات",
    back:
      "🔙 بازگشت",
    next:
      "صفحه بعد ➡️",
    previous:
      "⬅️ صفحه قبل",
    page:
      "صفحه",
    emptyMovies:
      "📭 آرشیو فیلم خالی است.",
    watchMovie:
      "👀 مشاهده فیلم",
    deleteMovie:
      "🗑 حذف فیلم",
    featured:
      "⭐ پیشنهادی",
    featuredOff:
      "☆ پیشنهادی",
    deleteQuestion:
      "❗ این فیلم حذف شود؟",
    yesDelete:
      "✅ بله، حذف کن",
    cancel:
      "❌ لغو",
    movieDeleted:
      "🗑 فیلم حذف شد.",
    movieFeatured:
      "⭐ وضعیت پیشنهادی تغییر کرد.",
    announcementText:
      "📢 متن اطلاعیه را ارسال کنید.",
    announcementDone:
      "✅ اطلاعیه برای کاربران ارسال شد.",
    blockText:
      "🚫 آیدی کاربر را ارسال کنید.",
    unblockText:
      "✅ آیدی کاربر را ارسال کنید.",
    blocked:
      "🚫 کاربر بلاک شد.",
    unblocked:
      "✅ کاربر آنبلاک شد.",
    invalidId:
      "❌ آیدی معتبر نیست.",
    noPending:
      "📭 فیلمی در انتظار تأیید نیست.",
    approve:
      "✅ تأیید",
    reject:
      "❌ رد",
    usersCount:
      "👥 تعداد کاربران",
    moviesCount:
      "🎬 تعداد فیلم‌ها",
    pendingCount:
      "📥 در انتظار تأیید",
    viewsCount:
      "👀 مجموع بازدیدها",
    infoTitle:
      "💾 اطلاعات ربات",
    noFeatured:
      "⭐ هنوز فیلم پیشنهادی وجود ندارد.",
    noTop:
      "🏆 هنوز اطلاعات کافی وجود ندارد.",
    noBest:
      "⭐ هنوز امتیازی ثبت نشده است."
  },

  en: {
    chooseLanguage:
      "🌐 Choose your language / زبان خود را انتخاب کنید:",
    languageSaved:
      "✅ Language saved.",
    joinChannel:
      "🔒 Please join our channel first.",
    joinChannelButton:
      "📢 Join Channel",
    checkMembership:
      "✅ Check Membership",
    notMember:
      "❌ You are not a member yet.",
    welcome:
      "🎬 Welcome to the movie bot.",
    menu:
      "Choose an option:",
    getMovie:
      "📥 Get Movie",
    sendMovie:
      "📤 Submit Movie",
    dailyMovie:
      "🍿 Today's Movie",
    statistics:
      "📊 Statistics",
    topMovies:
      "🏆 Most Viewed",
    bestMovies:
      "⭐ Top Rated",
    language:
      "🌐 Change Language",
    adminPanel:
      "👑 Admin Panel",
    movieNotFound:
      "📭 No movies available.",
    cooldown:
      "⏳ Please wait a few seconds.",
    sendYourMovie:
      "🎬 Send your movie.",
    movieReceived:
      "✅ Your movie was received.",
    rating:
      "⭐ Rate this movie:",
    alreadyRated:
      "⚠️ You already rated this movie.",
    ratingSaved:
      "⭐ Your rating was saved.",
    noPermission:
      "⛔ You don't have permission.",
    admin:
      "👑 Admin Panel",
    movieList:
      "🎬 Movie List",
    users:
      "👥 Users",
    pending:
      "📥 Pending Movies",
    announcement:
      "📢 Announcement",
    block:
      "🚫 Block User",
    unblock:
      "✅ Unblock User",
    info:
      "💾 Bot Information",
    back:
      "🔙 Back",
    next:
      "Next ➡️",
    previous:
      "⬅️ Previous",
    page:
      "Page",
    emptyMovies:
      "📭 Movie archive is empty.",
    watchMovie:
      "👀 Watch Movie",
    deleteMovie:
      "🗑 Delete Movie",
    featured:
      "⭐ Featured",
    featuredOff:
      "☆ Featured",
    deleteQuestion:
      "❗ Delete this movie?",
    yesDelete:
      "✅ Yes, delete",
    cancel:
      "❌ Cancel",
    movieDeleted:
      "🗑 Movie deleted.",
    movieFeatured:
      "⭐ Featured status changed.",
    noPending:
      "📭 No pending movies.",
    approve:
      "✅ Approve",
    reject:
      "❌ Reject",
    usersCount:
      "👥 Users",
    moviesCount:
      "🎬 Movies",
    pendingCount:
      "📥 Pending",
    viewsCount:
      "👀 Total Views",
    noFeatured:
      "⭐ No featured movie yet.",
    noTop:
      "🏆 Not enough data yet.",
    noBest:
      "⭐ No ratings yet."
  }
};

function t(language, key) {
  const lang =
    TEXTS[language]
      ? language
      : "en";

  return (
    TEXTS[lang][key] ||
    TEXTS.en[key] ||
    key
  );
}

function getLanguage(user) {
  return user?.language || "en";
}

/* =========================================================
   KV helpers
========================================================= */

async function getJSON(
  env,
  key,
  fallback = null
) {
  const value =
    await env.BOT_DATA.get(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function putJSON(
  env,
  key,
  value
) {
  await env.BOT_DATA.put(
    key,
    JSON.stringify(value)
  );
}

async function getUser(
  env,
  userId
) {
  return await getJSON(
    env,
    `user:${userId}`,
    {
      id: String(userId),
      language: "en",
      language_selected: false,
      blocked: false,
      joined: false,
      created_at: now()
    }
  );
}

async function saveUser(
  env,
  user
) {
  await putJSON(
    env,
    `user:${user.id}`,
    user
  );
}

/* =========================================================
   User system
========================================================= */

async function ensureUser(
  env,
  from
) {
  const userId =
    String(from.id);

  const user =
    await getUser(
      env,
      userId
    );

  user.id = userId;

  if (from.username) {
    user.username =
      from.username;
  }

  if (from.first_name) {
    user.first_name =
      from.first_name;
  }

  if (from.language_code) {
    user.telegram_language_code =
      from.language_code;
  }

  if (!user.created_at) {
    user.created_at =
      now();
  }

  if (!user.language) {
    user.language =
      "en";
  }

  if (!Array.isArray(user.favorites)) {
    user.favorites = [];
  }

  if (!Array.isArray(user.history)) {
    user.history = [];
  }

  if (!Array.isArray(user.badges)) {
    user.badges = [];
  }

  if (!Array.isArray(user.warnings)) {
    user.warnings = [];
  }

  if (user.notifications === undefined) {
    user.notifications = true;
  }

  if (user.level === undefined) {
    user.level = 1;
  }

  if (user.xp === undefined) {
    user.xp = 0;
  }

  if (user.valid_invites === undefined) {
    user.valid_invites = 0;
  }

  if (user.movies_received === undefined) {
    user.movies_received = 0;
  }

  if (user.ratings === undefined) {
    user.ratings = 0;
  }

  await saveUser(
    env,
    user
  );

  return user;
}

async function isBlocked(
  env,
  userId
) {
  const user =
    await getUser(
      env,
      userId
    );

  return Boolean(
    user.blocked
  );
}

/* =========================================================
   Membership
========================================================= */

async function checkMembership(
  env,
  userId
) {
  try {
    const result =
      await telegram(
        env,
        "getChatMember",
        {
          chat_id:
            CHANNEL_ID,
          user_id:
            Number(userId)
        }
      );

    if (!result.ok) {
      return false;
    }

    const status =
      result.result.status;

    return [
      "creator",
      "administrator",
      "member"
    ].includes(status);
  } catch {
    return false;
  }
}

async function sendMembershipMessage(
  env,
  chatId
) {
  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        "🔒 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                "📢 عضویت در کانال",
              url:
                CHANNEL_LINK
            }
          ],
          [
            {
              text:
                "✅ بررسی عضویت",
              callback_data:
                "check_membership"
            }
          ]
        ]
      }
    }
  );
}

/* =========================================================
   Main menu
========================================================= */

function mainKeyboard(
  language = "en",
  admin = false
) {
  const keyboard = [
    [
      {
        text:
          t(language, "getMovie")
      },
      {
        text:
          t(language, "sendMovie")
      }
    ],
    [
      {
        text:
          "🎬 Request Movie"
      },
      {
        text:
          "🔥 Trending"
      }
    ],
    [
      {
        text:
          "❤️ Favorites"
      },
      {
        text:
          "📜 History"
      }
    ],
    [
      {
        text:
          "👥 Invite Friends"
      },
      {
        text:
          "🏆 Leaderboard"
      }
    ],
    [
      {
        text:
          "👤 Profile"
      },
      {
        text:
          t(language, "language")
      }
    ]
  ];

  if (admin) {
    keyboard.push([
      {
        text:
          t(language, "adminPanel")
      }
    ]);
  }

  return {
    keyboard,
    resize_keyboard:
      true,
    is_persistent:
      true
  };
}

async function sendMainMenu(
  env,
  chatId,
  user
) {
  const language =
    getLanguage(user);

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        `${t(language, "welcome")}\n\n${t(language, "menu")}`,
      reply_markup:
        mainKeyboard(
          language,
          isAdmin(
            env,
            user.id
          )
        )
    }
  );
}

/* =========================================================
   /start
========================================================= */

async function handleStart(
  env,
  chatId,
  from
) {
  const user =
    await ensureUser(
      env,
      from
    );

  if (user.blocked) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "🚫 دسترسی شما به ربات مسدود شده است."
      }
    );

    return;
  }

  if (!user.language) {
    user.language =
      "en";

    await saveUser(
      env,
      user
    );
  }

  if (!user.language_selected) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          t(
            "en",
            "chooseLanguage"
          ),
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🇬🇧 English",
                callback_data:
                  "lang:en"
              },
              {
                text:
                  "🇮🇷 فارسی",
                callback_data:
                  "lang:fa"
              }
            ]
          ]
        }
      }
    );

    return;
  }

  const member =
    await checkMembership(
      env,
      from.id
    );

  if (!member) {
    await sendMembershipMessage(
      env,
      chatId
    );

    return;
  }

  user.joined =
    true;

  await saveUser(
    env,
    user
  );

  await sendMainMenu(
    env,
    chatId,
    user
  );
}
/* =========================================================
   Language callback
========================================================= */

async function handleLanguageCallback(
  env,
  callback
) {
  const userId =
    String(callback.from.id);

  const chatId =
    callback.message.chat.id;

  const language =
    callback.data.split(":")[1] ===
    "fa"
      ? "fa"
      : "en";

  const user =
    await getUser(
      env,
      userId
    );

  user.language =
    language;

  user.language_selected =
    true;

  await saveUser(
    env,
    user
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        t(
          language,
          "languageSaved"
        )
    }
  );

  const member =
    await checkMembership(
      env,
      userId
    );

  if (!member) {
    await sendMembershipMessage(
      env,
      chatId
    );

    return;
  }

  user.joined =
    true;

  await saveUser(
    env,
    user
  );

  await sendMainMenu(
    env,
    chatId,
    user
  );
}

/* =========================================================
   Movies
========================================================= */

async function getMovies(
  env
) {
  return await getJSON(
    env,
    "movies",
    []
  );
}

async function saveMovies(
  env,
  movies
) {
  await putJSON(
    env,
    "movies",
    movies
  );
}

async function findMovie(
  env,
  movieId
) {
  const movies =
    await getMovies(
      env
    );

  return (
    movies.find(
      movie =>
        String(movie.id) ===
        String(movieId)
    ) || null
  );
}

async function addMovie(
  env,
  movie
) {
  const movies =
    await getMovies(
      env
    );

  if (!movie.featured) {
    movie.featured =
      false;
  }

  if (!movie.movie_code) {
    movie.movie_code =
      `MOV-${String(movie.id)
        .slice(0, 8)
        .toUpperCase()}`;
  }

  movies.push(
    movie
  );

  await saveMovies(
    env,
    movies
  );

  return movie;
}

async function deleteMovieById(
  env,
  movieId
) {
  const movies =
    await getMovies(
      env
    );

  const filtered =
    movies.filter(
      movie =>
        String(movie.id) !==
        String(movieId)
    );

  await saveMovies(
    env,
    filtered
  );

  await env.BOT_DATA
    .delete(
      `ratings:${movieId}`
    )
    .catch(() => {});
}

/* =========================================================
   Ratings
========================================================= */

async function getMovieRatings(
  env,
  movieId
) {
  return await getJSON(
    env,
    `ratings:${movieId}`,
    []
  );
}

async function getMovieRatingInfo(
  env,
  movieId
) {
  const ratings =
    await getMovieRatings(
      env,
      movieId
    );

  const values =
    ratings
      .map(Number)
      .filter(
        Number.isFinite
      );

  const votes =
    values.length;

  const average =
    votes
      ? values.reduce(
          (sum, value) =>
            sum + value,
          0
        ) / votes
      : 0;

  return {
    votes,
    average
  };
}

/* =========================================================
   Country
========================================================= */

function getUserCountry(
  user
) {
  if (user?.country) {
    return user.country;
  }

  if (
    user?.telegram_language_code ===
    "fa"
  ) {
    return "Iran";
  }

  return "Unknown";
}

function countryFlag(
  country
) {
  const map = {
    Iran: "🇮🇷",
    France: "🇫🇷",
    Germany: "🇩🇪",
    Turkey: "🇹🇷",
    India: "🇮🇳",
    Japan: "🇯🇵",
    China: "🇨🇳",
    Russia: "🇷🇺",
    Ukraine: "🇺🇦",
    "United Kingdom":
      "🇬🇧",
    "United States":
      "🇺🇸"
  };

  return (
    map[country] ||
    "🌍"
  );
}

/* =========================================================
   Movie caption metadata
========================================================= */

async function buildMovieCaption(
  env,
  movie,
  user = null
) {
  const info =
    await getMovieRatingInfo(
      env,
      movie.id
    );

  const country =
    movie.country ||
    (
      user
        ? getUserCountry(user)
        : "Unknown"
    );

  const flag =
    countryFlag(
      country
    );

  const movieCode =
    movie.movie_code ||
    `MOV-${String(movie.id)
      .slice(0, 8)
      .toUpperCase()}`;

  return (
    `${movie.caption || "🎬 Movie"}\n\n` +
    `👁 Views: ${movie.views || 0}\n` +
    `⭐ Rating: ${info.average.toFixed(1)}/5\n` +
    `👥 Votes: ${info.votes}\n\n` +
    `🌍 ${flag} ${country}\n` +
    `🧷 ${movieCode}\n\n` +
    `📢 ${CHANNEL_LINK}`
  ).slice(
    0,
    1024
  );
}

/* =========================================================
   Send movie
========================================================= */

const __originalSendMovie =
  sendMovie;

async function sendMovie(
  env,
  chatId,
  movie,
  ctx = null,
  replyMarkup = null
) {
  if (!movie) {
    return null;
  }

  const enriched =
    {
      ...movie
    };

  enriched.caption =
    await buildMovieCaption(
      env,
      enriched
    );

  const result =
    await __originalSendMovie(
      env,
      chatId,
      enriched,
      ctx,
      replyMarkup
    );

  if (
    result?.ok &&
    !movie.movie_code
  ) {
    movie.movie_code =
      enriched.movie_code;

    const movies =
      await getMovies(
        env
      );

    const index =
      movies.findIndex(
        item =>
          String(item.id) ===
          String(movie.id)
      );

    if (index >= 0) {
      movies[index] =
        {
          ...movies[index],
          movie_code:
            enriched.movie_code
        };

      await saveMovies(
        env,
        movies
      );
    }
  }

  return result;
}

/* =========================================================
   History
========================================================= */

const HISTORY_MAX_AGE =
  24 * 60 * 60 * 1000;

async function cleanHistory(
  user
) {
  const history =
    Array.isArray(
      user.history
    )
      ? user.history
      : [];

  user.history =
    history
      .filter(
        item =>
          now() -
            Number(
              item.at || 0
            ) <=
          HISTORY_MAX_AGE
      )
      .slice(
        0,
        100
      );
}

async function addHistory(
  env,
  user,
  movie
) {
  await cleanHistory(
    user
  );

  user.history =
    user.history.filter(
      item =>
        String(
          item.movie_id
        ) !==
        String(movie.id)
    );

  user.history.unshift({
    movie_id:
      String(movie.id),
    at:
      now()
  });

  user.movies_received =
    Number(
      user.movies_received ||
        0
    ) + 1;

  user.views =
    Number(
      user.views || 0
    ) + 1;

  user.last_active =
    now();

  await saveUser(
    env,
    user
  );
}

/* =========================================================
   Favorites
========================================================= */

function hasFavorite(
  user,
  movieId
) {
  return (
    Array.isArray(
      user.favorites
    ) &&
    user.favorites
      .map(String)
      .includes(
        String(movieId)
      )
  );
}

async function addFavorite(
  env,
  user,
  movieId
) {
  if (!Array.isArray(user.favorites)) {
    user.favorites = [];
  }

  if (
    !hasFavorite(
      user,
      movieId
    )
  ) {
    user.favorites.push(
      String(movieId)
    );
  }

  await saveUser(
    env,
    user
  );
}

async function removeFavorite(
  env,
  user,
  movieId
) {
  user.favorites =
    (
      Array.isArray(
        user.favorites
      )
        ? user.favorites
        : []
    ).filter(
      id =>
        String(id) !==
        String(movieId)
    );

  await saveUser(
    env,
    user
  );
}

/* =========================================================
   Movie action buttons
========================================================= */

function movieActionKeyboard(
  user,
  movieId
) {
  const favorite =
    hasFavorite(
      user,
      movieId
    );

  return {
    inline_keyboard: [
      [
        {
          text:
            favorite
              ? "💔 Remove Favorite"
              : "❤️ Favorite",
          callback_data:
            `x_fav:${favorite ? "remove" : "add"}:${movieId}`
        }
      ],
      [
        {
          text:
            "🔄 Send Again",
          callback_data:
            `x_repeat:${movieId}`
        },
        {
          text:
            "🚫 Report",
          callback_data:
            `x_report:${movieId}`
        }
      ],
      [
        {
          text: "⭐",
          callback_data:
            `x_rate:${movieId}:1`
        },
        {
          text: "⭐⭐",
          callback_data:
            `x_rate:${movieId}:2`
        },
        {
          text: "⭐⭐⭐",
          callback_data:
            `x_rate:${movieId}:3`
        },
        {
          text: "⭐⭐⭐⭐",
          callback_data:
            `x_rate:${movieId}:4`
        },
        {
          text: "⭐⭐⭐⭐⭐",
          callback_data:
            `x_rate:${movieId}:5`
        }
      ]
    ]
  };
}

/* =========================================================
   Rate limiting
========================================================= */

async function canRequestMovie(
  env,
  user
) {
  if (
    isAdmin(
      env,
      user.id
    ) ||
    user.no_cooldown
  ) {
    return true;
  }

  const key =
    `cooldown:${user.id}`;

  const value =
    await env.BOT_DATA.get(
      key
    );

  if (
    value &&
    now() -
      Number(value) <
      MOVIE_COOLDOWN
  ) {
    return false;
  }

  await env.BOT_DATA.put(
    key,
    String(now()),
    {
      expirationTtl: 30
    }
  );

  return true;
}

/* =========================================================
   Get random movie
========================================================= */

async function extendedGetMovie(
  env,
  chatId,
  user,
  ctx
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

  if (
    !(await canRequestMovie(
      env,
      user
    ))
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          t(
            getLanguage(user),
            "cooldown"
          )
      }
    );

    return;
  }

  const movies =
    await getMovies(
      env
    );

  if (!movies.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          t(
            getLanguage(user),
            "movieNotFound"
          )
      }
    );

    return;
  }

  await cleanHistory(
    user
  );

  const unseen =
    movies.filter(
      movie =>
        !(user.history || [])
          .some(
            item =>
              String(
                item.movie_id
              ) ===
              String(movie.id)
          )
    );

  const pool =
    unseen.length
      ? unseen
      : movies;

  const movie =
    pool[
      Math.floor(
        Math.random() *
          pool.length
      )
    ];

  const result =
    await sendMovie(
      env,
      chatId,
      movie,
      ctx,
      movieActionKeyboard(
        user,
        movie.id
      )
    );

  if (result?.ok) {
    await addHistory(
      env,
      user,
      movie
    );
  }
}
/* =========================================================
   Rating handler
========================================================= */

async function extendedHandleRating(
  env,
  callback,
  movieId,
  value
) {
  const user =
    await getUser(
      env,
      callback.from.id
    );

  const movie =
    await findMovie(
      env,
      movieId
    );

  if (!movie) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ فیلم پیدا نشد.",
        show_alert:
          true
      }
    );

    return;
  }

  if (
    !Number.isInteger(
      value
    ) ||
    value < 1 ||
    value > 5
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ امتیاز نامعتبر است.",
        show_alert:
          true
      }
    );

    return;
  }

  const key =
    `rating:${movieId}:${user.id}`;

  const exists =
    await env.BOT_DATA.get(
      key
    );

  if (exists) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          t(
            getLanguage(user),
            "alreadyRated"
          ),
        show_alert:
          true
      }
    );

    return;
  }

  await env.BOT_DATA.put(
    key,
    String(value)
  );

  const ratings =
    await getMovieRatings(
      env,
      movieId
    );

  ratings.push(
    Number(value)
  );

  await putJSON(
    env,
    `ratings:${movieId}`,
    ratings
  );

  user.ratings =
    Number(
      user.ratings || 0
    ) + 1;

  await saveUser(
    env,
    user
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        t(
          getLanguage(user),
          "ratingSaved"
        )
    }
  );
}

/* =========================================================
   Favorites view
========================================================= */

async function showFavoritesExtended(
  env,
  chatId,
  user
) {
  const ids =
    Array.isArray(
      user.favorites
    )
      ? user.favorites
      : [];

  const movies =
    await getMovies(
      env
    );

  const list =
    ids
      .map(
        id =>
          movies.find(
            movie =>
              String(
                movie.id
              ) ===
              String(id)
          )
      )
      .filter(Boolean);

  if (!list.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "❤️ لیست علاقه‌مندی‌های شما خالی است."
      }
    );

    return;
  }

  const rows =
    list
      .slice(0, 20)
      .map(
        movie => [
          {
            text:
              `❤️ ${String(
                movie.caption ||
                  "Movie"
              ).slice(
                0,
                45
              )}`,
            callback_data:
              `x_favview:${movie.id}`
          }
        ]
      );

  rows.push([
    {
      text:
        "🔙 بازگشت",
      callback_data:
        "x_back"
    }
  ]);

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        `❤️ Favorites\n\n🎬 ${list.length}`,
      reply_markup: {
        inline_keyboard:
          rows
      }
    }
  );
}

/* =========================================================
   History view
========================================================= */

async function showHistoryExtended(
  env,
  chatId,
  user
) {
  await cleanHistory(
    user
  );

  await saveUser(
    env,
    user
  );

  const movies =
    await getMovies(
      env
    );

  const list =
    (user.history || [])
      .map(
        item =>
          movies.find(
            movie =>
              String(
                movie.id
              ) ===
              String(
                item.movie_id
              )
          )
      )
      .filter(Boolean);

  if (!list.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "📜 تاریخچه ۲۴ ساعته خالی است."
      }
    );

    return;
  }

  const rows =
    list
      .slice(0, 20)
      .map(
        movie => [
          {
            text:
              `📜 ${String(
                movie.caption ||
                  "Movie"
              ).slice(
                0,
                45
              )}`,
            callback_data:
              `x_historyview:${movie.id}`
          }
        ]
      );

  rows.push([
    {
      text:
        "🔙 بازگشت",
      callback_data:
        "x_back"
    }
  ]);

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        "📜 History — 24h",
      reply_markup: {
        inline_keyboard:
          rows
      }
    }
  );
}

/* =========================================================
   Profile
========================================================= */

async function showProfileExtended(
  env,
  chatId,
  user
) {
  await cleanHistory(
    user
  );

  await saveUser(
    env,
    user
  );

  const country =
    getUserCountry(
      user
    );

  const text =
    `👤 Profile\n\n` +
    `👤 Name: ${
      user.first_name ||
      user.username ||
      "-"
    }\n` +
    `🆔 User ID: ${
      user.id
    }\n` +
    `🌐 Language: ${
      getLanguage(user)
    }\n` +
    `🌍 Country: ${
      countryFlag(country)
    } ${country}\n` +
    `📅 Joined: ${
      user.created_at
        ? new Date(
            user.created_at
          ).toLocaleDateString(
            "en-GB"
          )
        : "-"
    }\n` +
    `🎬 Movies received: ${
      user.movies_received ||
      0
    }\n` +
    `👁 Views: ${
      user.views || 0
    }\n` +
    `⭐ Ratings: ${
      user.ratings || 0
    }\n` +
    `❤️ Favorites: ${
      (user.favorites || [])
        .length
    }\n` +
    `👥 Valid Invites: ${
      user.valid_invites ||
      0
    }\n` +
    `🏆 Badges: ${
      (user.badges || [])
        .join(", ") ||
      "-"
    }\n` +
    `🎁 XP: ${
      user.xp || 0
    }\n` +
    `🆙 Level: ${
      user.level || 1
    }\n` +
    `⚠️ Warnings: ${
      (user.warnings || [])
        .length
    }`;

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                user.notifications === false
                  ? "🔔 Notifications On"
                  : "🔕 Notifications Off",
              callback_data:
                "x_notifications"
            }
          ],
          [
            {
              text:
                "🎁 Reward",
              callback_data:
                "x_reward"
            },
            {
              text:
                "🔙 Back",
              callback_data:
                "x_back"
            }
          ]
        ]
      }
    }
  );
}

/* =========================================================
   Invite system
========================================================= */

async function getBotUsername(
  env
) {
  return (
    env.BOT_USERNAME ||
    "SuperManFilmBot"
  );
}

async function showInvite(
  env,
  chatId,
  user
) {
  const username =
    await getBotUsername(
      env
    );

  const link =
    `https://t.me/${username}?start=ref_${user.id}`;

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        `👥 Invite Friends\n\n` +
        `🔗 ${link}\n\n` +
        `✅ Valid Invites: ${
          user.valid_invites ||
          0
        }\n` +
        `🎁 بعد از ۳ دعوت معتبر، محدودیت دریافت فیلم برداشته می‌شود.`
    }
  );
}

async function registerReferral(
  env,
  newUser,
  startParameter
) {
  const value =
    String(
      startParameter ||
        ""
    );

  if (
    !value.startsWith(
      "ref_"
    )
  ) {
    return;
  }

  const inviterId =
    value.slice(4);

  if (
    !inviterId ||
    String(inviterId) ===
      String(newUser.id)
  ) {
    return;
  }

  const doneKey =
    `ref:credited:${newUser.id}`;

  if (
    await env.BOT_DATA.get(
      doneKey
    )
  ) {
    return;
  }

  const inviter =
    await getUser(
      env,
      inviterId
    );

  if (
    !inviter ||
    inviter.blocked
  ) {
    return;
  }

  await env.BOT_DATA.put(
    doneKey,
    String(inviterId)
  );

  inviter.valid_invites =
    Number(
      inviter.valid_invites ||
        0
    ) + 1;

  inviter.invite_count =
    Number(
      inviter.invite_count ||
        0
    ) + 1;

  if (
    inviter.valid_invites >=
    3
  ) {
    inviter.no_cooldown =
      true;
  }

  await saveUser(
    env,
    inviter
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        inviter.id,
      text:
        "🎁 یک دعوت معتبر جدید ثبت شد!"
    }
  );
}

/* =========================================================
   XP / Achievements
========================================================= */

async function notifyUser(
  env,
  user,
  text,
  force = false
) {
  if (
    force ||
    user.notifications !==
      false
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          user.id,
        text
      }
    ).catch(
      () => {}
    );
  }
}

async function awardBadge(
  env,
  user,
  badge
) {
  if (!Array.isArray(
    user.badges
  )) {
    user.badges = [];
  }

  if (
    !user.badges.includes(
      badge
    )
  ) {
    user.badges.push(
      badge
    );

    await notifyUser(
      env,
      user,
      `🏆 Achievement Unlocked!\n\n${badge}`
    );

    await saveUser(
      env,
      user
    );
  }
}

async function addXP(
  env,
  user,
  amount
) {
  user.xp =
    Number(
      user.xp || 0
    ) + Number(
      amount || 0
    );

  const oldLevel =
    Number(
      user.level || 1
    );

  user.level =
    Math.max(
      1,
      Math.floor(
        user.xp / 100
      ) + 1
    );

  if (
    user.level >
    oldLevel
  ) {
    await notifyUser(
      env,
      user,
      `🆙 Level Up!\n\n🏆 Level ${user.level}`
    );

    await awardBadge(
      env,
      user,
      "🆙 Level Up"
    );
  }

  await saveUser(
    env,
    user
  );
}

async function updateAchievements(
  env,
  user
) {
  if (
    Number(
      user.movies_received ||
        0
    ) >= 1
  ) {
    await awardBadge(
      env,
      user,
      "🎬 First Movie"
    );
  }

  if (
    Number(
      user.ratings ||
        0
    ) >= 1
  ) {
    await awardBadge(
      env,
      user,
      "⭐ First Vote"
    );
  }

  if (
    (user.favorites || [])
      .length >= 1
  ) {
    await awardBadge(
      env,
      user,
      "❤️ First Favorite"
    );
  }

  if (
    Number(
      user.valid_invites ||
        0
    ) >= 1
  ) {
    await awardBadge(
      env,
      user,
      "👥 First Invite"
    );
  }

  if (
    Number(
      user.movies_received ||
        0
    ) >= 25
  ) {
    await awardBadge(
      env,
      user,
      "🎬 Movie Hunter"
    );
  }

  if (
    Number(
      user.streak ||
        0
    ) >= 7
  ) {
    await awardBadge(
      env,
      user,
      "🔥 Active User"
    );
  }

  if (
    user.created_at &&
    now() -
      Number(
        user.created_at
      ) >=
      30 *
        24 *
        60 *
        60 *
        1000
  ) {
    await awardBadge(
      env,
      user,
      "🏆 Veteran"
    );
  }

  if (
    Number(
      user.level ||
        1
    ) >= 10
  ) {
    await awardBadge(
      env,
      user,
      "👑 Cinema Master"
    );
  }
}

/* =========================================================
   Daily / Weekly rewards
========================================================= */

async function dailyReward(
  env,
  user
) {
  const today =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );

  if (
    user.daily_reward ===
    today
  ) {
    return;
  }

  user.daily_reward =
    today;

  await addXP(
    env,
    user,
    10
  );

  await notifyUser(
    env,
    user,
    "🎁 Daily Reward +10 XP"
  );
}

async function weeklyReward(
  env,
  user
) {
  const date =
    new Date();

  const week =
    `${date.getUTCFullYear()}-${Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 1)) / 604800000)}`;

  if (
    user.weekly_reward ===
    week
  ) {
    return;
  }

  user.weekly_reward =
    week;

  await addXP(
    env,
    user,
    50
  );

  await notifyUser(
    env,
    user,
    "🎁 Weekly Reward +50 XP"
  );
     }
/* =========================================================
   Trending
========================================================= */

async function showTrendingExtended(
  env,
  chatId
) {
  const movies =
    await getMovies(
      env
    );

  const scored =
    [];

  for (
    const movie of movies
  ) {
    const info =
      await getMovieRatingInfo(
        env,
        movie.id
      );

    const score =
      Number(
        movie.views || 0
      ) +
      Number(
        info.average || 0
      ) *
        5 +
      Number(
        info.votes || 0
      ) *
        2 +
      Number(
        movie.favorites || 0
      ) *
        3;

    scored.push({
      movie,
      score,
      rating:
        info.average,
      votes:
        info.votes
    });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score
  );

  const top =
    scored.slice(
      0,
      10
    );

  if (!top.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "🔥 هنوز اطلاعات کافی برای Trending وجود ندارد."
      }
    );

    return;
  }

  let text =
    "🔥 Trending Today\n\n";

  top.forEach(
    (
      item,
      index
    ) => {
      text +=
        `${index + 1}. 🎬 ${
          item.movie.caption ||
          "Movie"
        }\n` +
        `   👁 ${
          item.movie.views ||
          0
        }  ⭐ ${
          Number(
            item.rating || 0
          ).toFixed(1)
        }  👥 ${
          item.votes ||
          0
        }\n\n`;
    }
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text
    }
  );
}

/* =========================================================
   Leaderboard
========================================================= */

async function showLeaderboardExtended(
  env,
  chatId,
  type = "overall"
) {
  const users =
    await getAllUsers(
      env
    );

  const sorted =
    [...users];

  if (
    type ===
    "invites"
  ) {
    sorted.sort(
      (a, b) =>
        Number(
          b.valid_invites ||
            0
        ) -
        Number(
          a.valid_invites ||
            0
        )
    );
  } else if (
    type ===
    "ratings"
  ) {
    sorted.sort(
      (a, b) =>
        Number(
          b.ratings ||
            0
        ) -
        Number(
          a.ratings ||
            0
        )
    );
  } else if (
    type ===
    "movies"
  ) {
    sorted.sort(
      (a, b) =>
        Number(
          b.movies_received ||
            0
        ) -
        Number(
          a.movies_received ||
            0
        )
    );
  } else if (
    type ===
    "active"
  ) {
    sorted.sort(
      (a, b) =>
        Number(
          b.last_active ||
            0
        ) -
        Number(
          a.last_active ||
            0
        )
    );
  } else {
    sorted.sort(
      (a, b) =>
        Number(
          b.xp || 0
        ) -
        Number(
          a.xp || 0
        )
    );
  }

  const top =
    sorted.slice(
      0,
      10
    );

  if (!top.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "📭 هنوز داده‌ای وجود ندارد."
      }
    );

    return;
  }

  let text =
    "🏆 Leaderboard\n\n";

  top.forEach(
    (
      user,
      index
    ) => {
      let value =
        user.xp || 0;

      if (
        type ===
        "invites"
      ) {
        value =
          user.valid_invites ||
          0;
      }

      if (
        type ===
        "ratings"
      ) {
        value =
          user.ratings ||
          0;
      }

      if (
        type ===
        "movies"
      ) {
        value =
          user.movies_received ||
          0;
      }

      text +=
        `${index + 1}. ${
          user.first_name ||
          user.username ||
          user.id
        } — ${value}\n`;
    }
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text
    }
  );
}

/* =========================================================
   Movie Requests
========================================================= */

async function getMovieRequests(
  env
) {
  return await getJSON(
    env,
    "movie_requests",
    []
  );
}

async function saveMovieRequests(
  env,
  list
) {
  await putJSON(
    env,
    "movie_requests",
    list
  );
}

async function createMovieRequest(
  env,
  user,
  name
) {
  const value =
    String(
      name || ""
    ).trim();

  if (!value) {
    return null;
  }

  const list =
    await getMovieRequests(
      env
    );

  let request =
    list.find(
      item =>
        String(
          item.name
        )
          .toLowerCase() ===
          value.toLowerCase() &&
        item.status !==
          "rejected"
    );

  if (request) {
    request.voters =
      Array.isArray(
        request.voters
      )
        ? request.voters
        : [];

    if (
      request.voters
        .map(String)
        .includes(
          String(user.id)
        )
    ) {
      return request;
    }

    request.voters.push(
      user.id
    );

    request.votes =
      Number(
        request.votes ||
          0
      ) + 1;
  } else {
    request = {
      id:
        randomId(),
      name:
        value,
      user_id:
        String(user.id),
      votes:
        1,
      voters: [
        String(user.id)
      ],
      status:
        "pending",
      created_at:
        now()
    };

    list.push(
      request
    );
  }

  await saveMovieRequests(
    env,
    list
  );

  return request;
}

async function showMovieRequests(
  env,
  chatId
) {
  const requests =
    (
      await getMovieRequests(
        env
      )
    )
      .filter(
        item =>
          item.status ===
          "pending"
      )
      .sort(
        (a, b) =>
          Number(
            b.votes ||
              0
          ) -
          Number(
            a.votes ||
              0
          )
      )
      .slice(
        0,
        20
      );

  if (!requests.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "📭 هنوز درخواست فیلمی ثبت نشده است."
      }
    );

    return;
  }

  const rows =
    requests.map(
      item => [
        {
          text:
            `🎬 ${item.name} — 🔥 ${item.votes || 0}`,
          callback_data:
            `x_request_vote:${item.id}`
        }
      ]
    );

  rows.push([
    {
      text:
        "🔙 بازگشت",
      callback_data:
        "x_back"
    }
  ]);

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        "🎬 Movie Requests",
      reply_markup: {
        inline_keyboard:
          rows
      }
    }
  );
}

async function voteMovieRequest(
  env,
  callback,
  requestId
) {
  const user =
    await getUser(
      env,
      callback.from.id
    );

  const list =
    await getMovieRequests(
      env
    );

  const request =
    list.find(
      item =>
        String(item.id) ===
        String(requestId)
    );

  if (!request) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ درخواست پیدا نشد.",
        show_alert:
          true
      }
    );

    return;
  }

  request.voters =
    Array.isArray(
      request.voters
    )
      ? request.voters
      : [];

  if (
    request.voters
      .map(String)
      .includes(
        String(user.id)
      )
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "⚠️ قبلاً رأی داده‌اید.",
        show_alert:
          true
      }
    );

    return;
  }

  request.voters.push(
    String(user.id)
  );

  request.votes =
    Number(
      request.votes || 0
    ) + 1;

  await saveMovieRequests(
    env,
    list
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        "🔥 رأی شما ثبت شد."
    }
  );
}

/* =========================================================
   Reports
========================================================= */

async function reportMovieExtended(
  env,
  callback,
  movieId,
  reason
) {
  const report = {
    id:
      randomId(),
    movie_id:
      String(movieId),
    user_id:
      String(
        callback.from.id
      ),
    reason,
    created_at:
      now(),
    status:
      "open"
  };

  await putJSON(
    env,
    `report:${report.id}`,
    report
  );

  const adminId =
    getAdminId(env);

  if (adminId) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          adminId,
        text:
          `🚫 Movie Report\n\n` +
          `🎬 Movie: ${movieId}\n` +
          `👤 User: ${callback.from.id}\n` +
          `⚠️ Reason: ${reason}`
      }
    ).catch(
      () => {}
    );
  }

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        "✅ گزارش ثبت شد."
    }
  );
}

async function showReportMenu(
  env,
  chatId,
  movieId
) {
  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        "🚫 دلیل گزارش را انتخاب کنید:",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                "🚫 فیلم خراب",
              callback_data:
                `x_report:${movieId}:broken`
            },
            {
              text:
                "❌ اطلاعات اشتباه",
              callback_data:
                `x_report:${movieId}:wrong`
            }
          ],
          [
            {
              text:
                "🔁 فیلم تکراری",
              callback_data:
                `x_report:${movieId}:duplicate`
            },
            {
              text:
                "⚠️ مشکل دیگر",
              callback_data:
                `x_report:${movieId}:other`
            }
          ]
        ]
      }
    }
  );
}

/* =========================================================
   All users
========================================================= */

async function getAllUsers(
  env
) {
  const users =
    [];

  let cursor =
    undefined;

  do {
    const result =
      await env.BOT_DATA.list({
        prefix:
          "user:",
        ...(cursor
          ? {
              cursor
            }
          : {})
      });

    for (
      const key of
        result.keys
    ) {
      const user =
        await getJSON(
          env,
          key.name,
          null
        );

      if (user) {
        users.push(
          user
        );
      }
    }

    cursor =
      result.list_complete
        ? undefined
        : result.cursor;
  } while (cursor);

  return users;
}

/* =========================================================
   Statistics
========================================================= */

async function getStatisticsExtended(
  env
) {
  const users =
    await getAllUsers(
      env
    );

  const movies =
    await getMovies(
      env
    );

  const pending =
    await getJSON(
      env,
      "pending_movies",
      []
    );

  let views =
    0;

  let ratings =
    0;

  let favorites =
    0;

  for (
    const movie of
      movies
  ) {
    views +=
      Number(
        movie.views || 0
      );

    const info =
      await getMovieRatingInfo(
        env,
        movie.id
      );

    ratings +=
      info.votes;

    favorites +=
      Number(
        movie.favorites || 0
      );
  }

  const active =
    users.filter(
      user =>
        now() -
          Number(
            user.last_active ||
              user.created_at ||
              0
          ) <
        24 *
          60 *
          60 *
          1000
    ).length;

  const invites =
    users.reduce(
      (
        sum,
        user
      ) =>
        sum +
        Number(
          user.valid_invites ||
            0
        ),
      0
    );

  return {
    users:
      users.length,
    movies:
      movies.length,
    pending:
      pending.length,
    views,
    ratings,
    favorites,
    active, 
    invites
  };
}
/* =========================================================
   Extended Admin Login / Team
========================================================= */

async function getApprovedAdmins(
  env
) {
  return await getJSON(
    env,
    "admin:approved",
    []
  );
}

async function saveApprovedAdmins(
  env,
  list
) {
  await putJSON(
    env,
    "admin:approved",
    list
  );
}

async function isApprovedAdmin(
  env,
  userId
) {
  if (
    isAdmin(
      env,
      userId
    )
  ) {
    return true;
  }

  const admins =
    await getApprovedAdmins(
      env
    );

  return admins
    .map(String)
    .includes(
      String(userId)
    );
}

async function getTeamMembers(
  env
) {
  return await getJSON(
    env,
    "team:members",
    []
  );
}

async function saveTeamMembers(
  env,
  list
) {
  await putJSON(
    env,
    "team:members",
    list
  );
}

async function isTeamMember(
  env,
  userId
) {
  if (
    await isApprovedAdmin(
      env,
      userId
    )
  ) {
    return true;
  }

  const list =
    await getTeamMembers(
      env
    );

  return list
    .map(String)
    .includes(
      String(userId)
    );
}

/* =========================================================
   Logs
========================================================= */

async function logActionExtended(
  env,
  actorId,
  action,
  details = {}
) {
  const item = {
    at:
      now(),
    actor:
      String(actorId),
    action,
    details
  };

  await putJSON(
    env,
    `log:${now()}:${randomId()}`,
    item
  );
}

/* =========================================================
   Admin state
========================================================= */

async function getAdminStateExtended(
  env,
  userId
) {
  return await env.BOT_DATA.get(
    `admin_state:${userId}`
  );
}

async function setAdminStateExtended(
  env,
  userId,
  value
) {
  await env.BOT_DATA.put(
    `admin_state:${userId}`,
    value
  );
}

async function clearAdminStateExtended(
  env,
  userId
) {
  await env.BOT_DATA.delete(
    `admin_state:${userId}`
  );
}

/* =========================================================
   Admin access request
========================================================= */

async function startAdminRequest(
  env,
  chatId,
  user
) {
  await setAdminStateExtended(
    env,
    user.id,
    "admin_password"
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text:
        `🔐 برای درخواست دسترسی Admin، رمز را ارسال کنید.\n\n` +
        `در صورت صحیح بودن رمز، درخواست برای مدیر اصلی ارسال می‌شود.`
    }
  );
}

async function processAdminPassword(
  env,
  message
) {
  const userId =
    String(
      message.from.id
    );

  const value =
    String(
      message.text ||
        ""
    ).trim();

  await clearAdminStateExtended(
    env,
    userId
  );

  if (
    value !==
    "SuperMan26"
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "❌ رمز Admin اشتباه است."
      }
    );

    return true;
  }

  if (
    await isApprovedAdmin(
      env,
      userId
    )
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "✅ شما دسترسی Admin دارید."
      }
    );

    return true;
  }

  const requests =
    await getJSON(
      env,
      "admin:requests",
      []
    );

  const existing =
    requests.find(
      item =>
        String(
          item.user_id
        ) ===
          userId &&
        item.status ===
          "pending"
    );

  if (existing) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "⏳ درخواست شما قبلاً ارسال شده و در انتظار تأیید مدیر است."
      }
    );

    return true;
  }

  requests.push({
    id:
      randomId(),
    user_id:
      userId,
    created_at:
      now(),
    status:
      "pending"
  });

  await putJSON(
    env,
    "admin:requests",
    requests
  );

  const adminId =
    getAdminId(env);

  if (adminId) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          adminId,
        text:
          `🔐 درخواست جدید Admin\n\n👤 User ID: ${userId}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "✅ Approve",
                callback_data:
                  `x_adminreq:approve:${userId}`
              },
              {
                text:
                  "❌ Reject",
                callback_data:
                  `x_adminreq:reject:${userId}`
              }
            ]
          ]
        }
      }
    );
  }

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        message.chat.id,
      text:
        "⏳ درخواست شما برای مدیر اصلی ارسال شد."
    }
  );

  return true;
}

/* =========================================================
   Admin Dashboard
========================================================= */

async function showExtendedAdminDashboard(
  env,
  chatId
) {
  const stats =
    await getStatisticsExtended(
      env
    );

  const text =
    `👑 ADMIN DASHBOARD\n\n` +
    `👥 Users: ${stats.users}\n` +
    `🎬 Movies: ${stats.movies}\n` +
    `👁 Views: ${stats.views}\n` +
    `⭐ Ratings: ${stats.ratings}\n` +
    `❤️ Favorites: ${stats.favorites}\n` +
    `🔥 Active Users: ${stats.active}\n` +
    `📥 Submissions: ${stats.pending}\n` +
    `👥 Valid Invites: ${stats.invites}`;

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                "🔙 Back",
              callback_data:
                "admin:back"
            }
          ]
        ]
      }
    }
  );
}

/* =========================================================
   Admin user profile
========================================================= */

async function showExtendedUserProfile(
  env,
  chatId,
  targetId
) {
  const user =
    await getUser(
      env,
      targetId
    );

  const country =
    getUserCountry(
      user
    );

  const text =
    `👤 User Profile\n\n` +
    `👤 Name: ${
      user.first_name ||
      user.username ||
      "-"
    }\n` +
    `🆔 User ID: ${
      user.id
    }\n` +
    `🌐 Language: ${
      getLanguage(user)
    }\n` +
    `🌍 Country: ${
      countryFlag(country)
    } ${country}\n` +
    `🎬 Movies: ${
      user.movies_received ||
      0
    }\n` +
    `👁 Views: ${
      user.views || 0
    }\n` +
    `⭐ Ratings: ${
      user.ratings || 0
    }\n` +
    `❤️ Favorites: ${
      (user.favorites || [])
        .length
    }\n` +
    `👥 Invites: ${
      user.valid_invites ||
      0
    }\n` +
    `🏆 Badges: ${
      (user.badges || [])
        .join(", ") ||
      "-"
    }\n` +
    `🆙 Level: ${
      user.level || 1
    }\n` +
    `🎁 XP: ${
      user.xp || 0
    }\n` +
    `🚫 Blocked: ${
      user.blocked
        ? "Yes"
        : "No"
    }\n` +
    `⚠️ Warnings: ${
      (user.warnings || [])
        .length
    }`;

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        chatId,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                user.blocked
                  ? "✅ Unban"
                  : "🚫 Ban",
              callback_data:
                `x_user:${user.blocked ? "unban" : "ban"}:${user.id}`
            }
          ],
          [
            {
              text:
                "⚠️ Warning",
              callback_data:
                `x_user:warn:${user.id}`
            }
          ],
          [
            {
              text:
                "🔙 Back",
              callback_data:
                "admin:users"
            }
          ]
        ]
      }
    }
  );
}

/* =========================================================
   Ban / Unban / Warning
========================================================= */

async function extendedUserAction(
  env,
  callback,
  action,
  targetId
) {
  if (
    !(await isApprovedAdmin(
      env,
      callback.from.id
    ))
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "⛔ دسترسی ندارید.",
        show_alert:
          true
      }
    );

    return;
  }

  const user =
    await getUser(
      env,
      targetId
    );

  if (
    action ===
    "ban"
  ) {
    user.blocked =
      true;

    await saveUser(
      env,
      user
    );

    await logActionExtended(
      env,
      callback.from.id,
      "ban_user",
      {
        user_id:
          targetId
      }
    );
  }

  if (
    action ===
    "unban"
  ) {
    user.blocked =
      false;

    await saveUser(
      env,
      user
    );

    await logActionExtended(
      env,
      callback.from.id,
      "unban_user",
      {
        user_id:
          targetId
      }
    );
  }

  if (
    action ===
    "warn"
  ) {
    if (!Array.isArray(user.warnings)) {
      user.warnings = [];
    }

    user.warnings.push({
      at:
        now(),
      by:
        String(
          callback.from.id
        )
    });

    await saveUser(
      env,
      user
    );

    await notifyUser(
      env,
      user,
      "⚠️ شما یک اخطار دریافت کردید.",
      true
    );

    await logActionExtended(
      env,
      callback.from.id,
      "warning_user",
      {
        user_id:
          targetId
      }
    );
  }

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        "✅ انجام شد."
    }
  );

  await showExtendedUserProfile(
    env,
    callback.message.chat.id,
    targetId
  );
}

/* =========================================================
   Admin requests approval
========================================================= */

async function processAdminRequestCallback(
  env,
  callback,
  action,
  targetId
) {
  if (
    !isAdmin(
      env,
      callback.from.id
    )
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "⛔ فقط مدیر اصلی.",
        show_alert:
          true
      }
    );

    return;
  }

  const requests =
    await getJSON(
      env,
      "admin:requests",
      []
    );

  const item =
    requests.find(
      request =>
        String(
          request.user_id
        ) ===
          String(
            targetId
          ) &&
        request.status ===
          "pending"
    );

  if (!item) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ درخواست پیدا نشد.",
        show_alert:
          true
      }
    );

    return;
  }

  item.status =
    action ===
    "approve"
      ? "approved"
      : "rejected";

  await putJSON(
    env,
    "admin:requests",
    requests
  );

  if (
    action ===
    "approve"
  ) {
    const admins =
      await getApprovedAdmins(
        env
      );

    if (
      !admins
        .map(String)
        .includes(
          String(
            targetId
          )
        )
    ) {
      admins.push(
        String(
          targetId
        )
      );

      await saveApprovedAdmins(
        env,
        admins
      );
    }
  }

  await logActionExtended(
    env,
    callback.from.id,
    `admin_request_${action}`,
    {
      user_id:
        targetId
    }
  );

  const targetUser =
    await getUser(
      env,
      targetId
    );

  await notifyUser(
    env,
    targetUser,
    action ===
      "approve"
      ? "✅ دسترسی Admin شما توسط مدیر اصلی تأیید شد."
      : "❌ درخواست Admin شما رد شد.",
    true
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        action ===
        "approve"
          ? "Approved"
          : "Rejected"
    }
  );
         }
/* =========================================================
   Advertisement System
========================================================= */

async function sendAdvertisement(
  env,
  sourceMessage
) {
  const users =
    await getAllUsers(
      env
    );

  let success =
    0;

  let failed =
    0;

  for (
    const user of
      users
  ) {
    try {
      const result =
        await telegram(
          env,
          "copyMessage",
          {
            chat_id:
              user.id,
            from_chat_id:
              sourceMessage.chat.id,
            message_id:
              sourceMessage.message_id
          }
        );

      if (result.ok) {
        success++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return {
    sent:
      success +
      failed,
    success,
    failed
  };
}

/* =========================================================
   Backup
========================================================= */

async function createBackup(
  env
) {
  const payload = {
    created_at:
      now(),
    users:
      await getAllUsers(
        env
      ),
    movies:
      await getMovies(
        env
      ),
    pending:
      await getJSON(
        env,
        "pending_movies",
        []
      ),
    requests:
      await getMovieRequests(
        env
      )
  };

  const key =
    `backup:${new Date().toISOString()}`;

  await putJSON(
    env,
    key,
    payload
  );

  await env.BOT_DATA.put(
    "backup:last",
    key
  );

  return key;
}

/* =========================================================
   Health Check
========================================================= */

async function performHealthCheck(
  env
) {
  const health = {
    bot:
      Boolean(
        env.BOT_TOKEN
      ),
    database:
      false,
    storage:
      false,
    webhook:
      true,
    backup:
      false
  };

  try {
    await env.BOT_DATA.get(
      "health:test"
    );

    health.database =
      true;

    health.storage =
      true;

    health.backup =
      Boolean(
        await env.BOT_DATA.get(
          "backup:last"
        )
      );
  } catch {
    // keep false
  }

  return health;
}

/* =========================================================
   Extended Admin Panel
========================================================= */

function extendedAdminKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text:
            "🎬 Movies",
          callback_data:
            "admin:movies"
        },
        {
          text:
            "📥 Queue",
          callback_data:
            "admin:pending"
        }
      ],
      [
        {
          text:
            "👥 Users",
          callback_data:
            "x_admin:users"
        },
        {
          text:
            "📊 Dashboard",
          callback_data:
            "x_admin:dashboard"
        }
      ],
      [
        {
          text:
            "📢 Ads",
          callback_data:
            "x_admin:ads"
        },
        {
          text:
            "👮 Team",
          callback_data:
            "x_admin:team"
        }
      ],
      [
        {
          text:
            "📜 Logs",
          callback_data:
            "x_admin:logs"
        },
        {
          text:
            "🛡️ Security",
          callback_data:
            "x_admin:security"
        }
      ],
      [
        {
          text:
            "💾 Backup",
          callback_data:
            "x_admin:backup"
        },
        {
          text:
            "🏥 Health",
          callback_data:
            "x_admin:health"
        }
      ],
      [
        {
          text:
            "🔙 Back",
          callback_data:
            "admin:back"
        }
      ]
    ]
  };
}

/* =========================================================
   Extended admin callback
========================================================= */

const __oldAdminCallback =
  handleAdminCallback;

async function handleAdminCallback(
  env,
  callback,
  ctx
) {
  const data =
    callback.data ||
    "";

  const userId =
    String(
      callback.from.id
    );

  if (
    data.startsWith(
      "x_admin:"
    )
  ) {
    if (
      !(await isTeamMember(
        env,
        userId
      ))
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id,
          text:
            "⛔ دسترسی ندارید.",
          show_alert:
            true
        }
      );

      return;
    }

    const action =
      data.split(":")[1];

    const chatId =
      callback.message.chat.id;

    if (
      action ===
      "dashboard"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      return showExtendedAdminDashboard(
        env,
        chatId
      );
    }

    if (
      action ===
      "users"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      await setAdminStateExtended(
        env,
        userId,
        "user_search"
      );

      return telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text:
            "🔍 آیدی کاربر را ارسال کنید."
        }
      );
    }

    if (
      action ===
      "ads"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      await setAdminStateExtended(
        env,
        userId,
        "ad_copy"
      );

      return telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text:
            "📢 پیام تبلیغاتی را ارسال کنید.\n\nمتن، عکس، ویدئو، فایل و کپشن قابل استفاده است."
        }
      );
    }

    if (
      action ===
      "team"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      const team =
        await getTeamMembers(
          env
        );

      return telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text:
            `👮 Team Members\n\n${
              team.length
                ? team.join(
                    "\n"
                  )
                : "No team members."
            }`
        }
      );
    }

    if (
      action ===
      "logs"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      const result =
        await env.BOT_DATA.list(
          {
            prefix:
              "log:",
            limit:
              30
          }
        );

      let text =
        "📜 Logs\n\n";

      for (
        const key of
          result.keys
      ) {
        const item =
          await getJSON(
            env,
            key.name,
            null
          );

        if (item) {
          text +=
            `${new Date(
              item.at
            ).toISOString()} — ${
              item.actor
            } — ${
              item.action
            }\n`;
        }
      }

      return telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text
        }
      );
    }

    if (
      action ===
      "security"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      return telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text:
            `🛡️ Security\n\n` +
            `✅ Membership Gate\n` +
            `✅ Rate Limit\n` +
            `✅ Referral Validation\n` +
            `✅ Admin Approval\n` +
            `✅ Sensitive Logs\n` +
            `✅ Ban / Unban\n` +
            `✅ Warning System`
        }
      );
    }

    if (
      action ===
      "backup"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      try {
        const key =
          await createBackup(
            env
          );

        await logActionExtended(
          env,
          userId,
          "backup_created",
          {
            key
          }
        );

        return telegram(
          env,
          "sendMessage",
          {
            chat_id:
              chatId,
            text:
              `💾 Backup created.\n\n${key}`
          }
        );
      } catch (
        error
      ) {
        await telegram(
          env,
          "sendMessage",
          {
            chat_id:
              getAdminId(env),
            text:
              `🚨 SYSTEM ALERT\n\n❌ Backup failed.\n🕐 ${new Date().toISOString()}`
          }
        ).catch(
          () => {}
        );

        return telegram(
          env,
          "sendMessage",
          {
            chat_id:
              chatId,
            text:
              "❌ Backup failed."
          }
        );
      }
    }

    if (
      action ===
      "health"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      const health =
        await performHealthCheck(
          env
        );

      return telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text:
            `🏥 Health Check\n\n` +
            `🤖 Bot: ${
              health.bot
                ? "✅"
                : "❌"
            }\n` +
            `💾 Database: ${
              health.database
                ? "✅"
                : "❌"
            }\n` +
            `🗄️ Storage: ${
              health.storage
                ? "✅"
                : "❌"
            }\n` +
            `🌐 Webhook: ${
              health.webhook
                ? "✅"
                : "❌"
            }\n` +
            `💾 Backup: ${
              health.backup
                ? "✅"
                : "❌"
            }`
        }
      );
    }
  }

  if (
    data.startsWith(
      "x_adminreq:"
    )
  ) {
    const parts =
      data.split(":");

    await processAdminRequestCallback(
      env,
      callback,
      parts[1],
      parts[2]
    );

    return;
  }

  if (
    data.startsWith(
      "x_user:"
    )
  ) {
    const parts =
      data.split(":");

    await extendedUserAction(
      env,
      callback,
      parts[1],
      parts[2]
    );

    return;
  }

  return __oldAdminCallback(
    env,
    callback,
    ctx
  );
}

/* =========================================================
   Extended admin text states
========================================================= */

const __oldHandleAdminText =
  handleAdminText;

async function handleAdminText(
  env,
  message,
  ctx
) {
  const userId =
    String(
      message.from.id
    );

  const state =
    await getAdminStateExtended(
      env,
      userId
    );

  if (
    state ===
    "admin_password"
  ) {
    return processAdminPassword(
      env,
      message
    );
  }

  if (
    state ===
    "user_search"
  ) {
    await clearAdminStateExtended(
      env,
      userId
    );

    await showExtendedUserProfile(
      env,
      message.chat.id,
      String(
        message.text ||
          ""
      ).trim()
    );

    return true;
  }

  if (
    state ===
    "ad_copy"
  ) {
    await clearAdminStateExtended(
      env,
      userId
    );

    if (
      !(await isApprovedAdmin(
        env,
        userId
      ))
    ) {
      return true;
    }

    const result =
      await sendAdvertisement(
        env,
        message
      );

    await logActionExtended(
      env,
      userId,
      "advertisement",
      result
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          `📢 Advertisement\n\n` +
          `📨 Sent: ${
            result.sent
          }\n` +
          `✅ Success: ${
            result.success
          }\n` +
          `❌ Failed: ${
            result.failed
          }`
      }
    );

    return true;
  }

  if (
    state ===
    "request_movie"
  ) {
    await clearAdminStateExtended(
      env,
      userId
    );

    const user =
      await getUser(
        env,
        userId
      );

    const request =
      await createMovieRequest(
        env,
        user,
        message.text
      );

    if (!request) {
      return true;
    }

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "✅ درخواست فیلم شما ثبت شد."
      }
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          getAdminId(env),
        text:
          `🎬 New Movie Request\n\n` +
          `🎬 ${request.name}\n` +
          `🔥 Votes: ${request.votes}\n` +
          `👤 User: ${user.id}`
      }
    ).catch(
      () => {}
    );

    return true;
  }

  return __oldHandleAdminText(
    env,
    message,
    ctx
  );
}
/* =========================================================
   Extended Normal Buttons
========================================================= */

const __oldHandleButtonMessage =
  handleButtonMessage;

async function handleButtonMessage(
  env,
  message,
  ctx
) {
  const user =
    await ensureUser(
      env,
      message.from
    );

  const text =
    message.text ||
    "";

  const language =
    getLanguage(user);

  if (
    text ===
    t(
      language,
      "getMovie"
    )
  ) {
    await extendedGetMovie(
      env,
      message.chat.id,
      user,
      ctx
    );

    return;
  }

  if (
    text ===
    t(
      language,
      "sendMovie"
    )
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          language ===
          "fa"
            ? "🎬 فیلم خود را ارسال کنید.\n\n🛡️ فیلم شما توسط تیم بررسی خواهد شد."
            : "🎬 Send your movie here.\n\n🛡️ Your movie will be reviewed by our team."
      }
    );

    return;
  }

  if (
    text ===
    "🎬 Request Movie"
  ) {
    await setAdminStateExtended(
      env,
      user.id,
      "request_movie"
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          language ===
          "fa"
            ? "🎬 نام فیلم موردنظر را ارسال کنید."
            : "🎬 Send the movie name you want."
      }
    );

    return;
  }

  if (
    text ===
    "🔥 Trending"
  ) {
    await showTrendingExtended(
      env,
      message.chat.id
    );

    return;
  }

  if (
    text ===
    "❤️ Favorites"
  ) {
    await showFavoritesExtended(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    text ===
    "📜 History"
  ) {
    await showHistoryExtended(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    text ===
    "👥 Invite Friends"
  ) {
    await showInvite(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    text ===
    "🏆 Leaderboard"
  ) {
    await showLeaderboardExtended(
      env,
      message.chat.id,
      "overall"
    );

    return;
  }

  if (
    text ===
    "👤 Profile"
  ) {
    await showProfileExtended(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    text ===
    t(
      language,
      "language"
    )
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          t(
            language,
            "chooseLanguage"
          ),
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🇬🇧 English",
                callback_data:
                  "lang:en"
              },
              {
                text:
                  "🇮🇷 فارسی",
                callback_data:
                  "lang:fa"
              }
            ]
          ]
        }
      }
    );

    return;
  }

  if (
    text ===
      t(
        language,
        "adminPanel"
      ) &&
    (
      await isTeamMember(
        env,
        user.id
      )
    )
  ) {
    await showAdminPanel(
      env,
      message.chat.id
    );

    return;
  }

  return __oldHandleButtonMessage(
    env,
    message,
    ctx
  );
}

/* =========================================================
   Callback extras
========================================================= */

const __oldHandleCallback =
  handleCallback;

async function handleCallback(
  env,
  callback,
  ctx
) {
  const data =
    callback.data ||
    "";

  try {
    if (
      data.startsWith(
        "x_rate:"
      )
    ) {
      const parts =
        data.split(":");

      await extendedHandleRating(
        env,
        callback,
        parts[1],
        Number(parts[2])
      );

      return;
    }

    if (
      data.startsWith(
        "x_fav:"
      )
    ) {
      const parts =
        data.split(":");

      const user =
        await getUser(
          env,
          callback.from.id
        );

      if (
        parts[1] ===
        "add"
      ) {
        await addFavorite(
          env,
          user,
          parts[2]
        );

        await awardBadge(
          env,
          user,
          "❤️ First Favorite"
        );

        await telegram(
          env,
          "answerCallbackQuery",
          {
            callback_query_id:
              callback.id,
            text:
              "❤️ به علاقه‌مندی‌ها اضافه شد."
          }
        );
      } else {
        await removeFavorite(
          env,
          user,
          parts[2]
        );

        await telegram(
          env,
          "answerCallbackQuery",
          {
            callback_query_id:
              callback.id,
            text:
              "💔 از علاقه‌مندی حذف شد."
          }
        );
      }

      return;
    }

    if (
      data.startsWith(
        "x_repeat:"
      )
    ) {
      const movieId =
        data.split(":")[1];

      const user =
        await getUser(
          env,
          callback.from.id
        );

      const movie =
        await findMovie(
          env,
          movieId
        );

      if (!movie) {
        await telegram(
          env,
          "answerCallbackQuery",
          {
            callback_query_id:
              callback.id,
            text:
              "❌ فیلم پیدا نشد.",
            show_alert:
              true
          }
        );

        return;
      }

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      await sendMovie(
        env,
        callback.message.chat.id,
        movie,
        ctx,
        movieActionKeyboard(
          user,
          movie.id
        )
      );

      return;
    }

    if (
      data.startsWith(
        "x_favview:"
      )
    ) {
      const movieId =
        data.split(":")[1];

      const user =
        await getUser(
          env,
          callback.from.id
        );

      const movie =
        await findMovie(
          env,
          movieId
        );

      if (!movie) {
        return;
      }

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      await sendMovie(
        env,
        callback.message.chat.id,
        movie,
        ctx,
        movieActionKeyboard(
          user,
          movie.id
        )
      );

      return;
    }

    if (
      data.startsWith(
        "x_historyview:"
      )
    ) {
      const movieId =
        data.split(":")[1];

      const user =
        await getUser(
          env,
          callback.from.id
        );

      const movie =
        await findMovie(
          env,
          movieId
        );

      if (!movie) {
        return;
      }

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      await sendMovie(
        env,
        callback.message.chat.id,
        movie,
        ctx,
        movieActionKeyboard(
          user,
          movie.id
        )
      );

      return;
    }

    if (
      data.startsWith(
        "x_report:"
      )
    ) {
      const parts =
        data.split(":");

      if (
        parts.length ===
        2
      ) {
        await showReportMenu(
          env,
          callback.message.chat.id,
          parts[1]
        );

        return;
      }

      await reportMovieExtended(
        env,
        callback,
        parts[1],
        parts[2]
      );

      return;
    }

    if (
      data.startsWith(
        "x_request_vote:"
      )
    ) {
      await voteMovieRequest(
        env,
        callback,
        data.split(":")[1]
      );

      return;
    }

    if (
      data ===
      "x_notifications"
    ) {
      const user =
        await getUser(
          env,
          callback.from.id
        );

      user.notifications =
        user.notifications ===
        false;

      await saveUser(
        env,
        user
      );

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id,
          text:
            user.notifications
              ? "🔔 اعلان‌ها روشن شد."
              : "🔕 اعلان‌های غیرضروری خاموش شد."
        }
      );

      await showProfileExtended(
        env,
        callback.message.chat.id,
        user
      );

      return;
    }

    if (
      data ===
      "x_reward"
    ) {
      const user =
        await getUser(
          env,
          callback.from.id
        );

      await dailyReward(
        env,
        user
      );

      await weeklyReward(
        env,
        user
      );

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id,
          text:
            "🎁 Reward processed."
        }
      );

      return;
    }

    if (
      data ===
      "x_back"
    ) {
      const user =
        await getUser(
          env,
          callback.from.id
        );

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id
        }
      );

      await sendMainMenu(
        env,
        callback.message.chat.id,
        user
      );

      return;
    }

    if (
      data ===
      "check_membership"
    ) {
      const user =
        await getUser(
          env,
          callback.from.id
        );

      const member =
        await checkMembership(
          env,
          user.id
        );

      if (!member) {
        await telegram(
          env,
          "answerCallbackQuery",
          {
            callback_query_id:
              callback.id,
            text:
              "❌ هنوز عضو نشده‌اید.",
            show_alert:
              true
          }
        );

        return;
      }

      user.joined =
        true;

      await saveUser(
        env,
        user
      );

      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id,
          text:
            "✅ عضویت تأیید شد."
        }
      );

      await sendMainMenu(
        env,
        callback.message.chat.id,
        user
      );

      return;
    }

    return __oldHandleCallback(
      env,
      callback,
      ctx
    );
  } catch (
    error
  ) {
    console.error(
      "Extended callback error:",
      error
    );

    try {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id,
          text:
            "❌ خطایی رخ داد.",
          show_alert:
            true
        }
      );
    } catch {}

    return;
  }
}
/* =========================================================
   Extended Incoming Movie
========================================================= */

const __oldHandleIncomingMovie =
  handleIncomingMovie;

async function handleIncomingMovie(
  env,
  message
) {
  const user =
    await ensureUser(
      env,
      message.from
    );

  if (
    user.blocked
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "🚫 دسترسی شما مسدود است."
      }
    );

    return;
  }

  const member =
    await checkMembership(
      env,
      user.id
    );

  if (!member) {
    await sendMembershipMessage(
      env,
      message.chat.id
    );

    return;
  }

  if (
    !message.video &&
    !message.document
  ) {
    return __oldHandleIncomingMovie(
      env,
      message
    );
  }

  const pending =
    await getJSON(
      env,
      "pending_movies",
      []
    );

  let type =
    null;

  let fileId =
    null;

  if (
    message.video
  ) {
    type =
      "video";

    fileId =
      message.video.file_id;
  }

  if (
    message.document
  ) {
    type =
      "document";

    fileId =
      message.document.file_id;
  }

  if (!fileId) {
    return;
  }

  const movie = {
    id:
      randomId(),
    file_id:
      fileId,
    type,
    caption:
      message.caption ||
      "🎬 فیلم ارسال‌شده توسط کاربر",
    user_id:
      String(
        user.id
      ),
    added_at:
      new Date().toISOString(),
    views:
      0,
    featured:
      false,
    country:
      getUserCountry(
        user
      ),
    genre:
      "",
    year:
      "",
    description:
      "",
    movie_code:
      `MOV-${randomId()
        .slice(0, 8)
        .toUpperCase()}`
  };

  pending.push(
    movie
  );

  await putJSON(
    env,
    "pending_movies",
    pending
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        message.chat.id,
      text:
        user.language ===
        "fa"
          ? "✅ فیلم شما دریافت شد و برای بررسی تیم ارسال شد."
          : "✅ Your movie was received and sent to the review queue."
    }
  );

  const adminId =
    getAdminId(env);

  if (adminId) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          adminId,
        text:
          `📥 New Movie Submission\n\n` +
          `👤 User: ${user.id}\n` +
          `🎬 ${movie.caption}\n` +
          `🌍 ${movie.country}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "👀 مشاهده",
                callback_data:
                  `pending:view:${movie.id}`
              }
            ],
            [
              {
                text:
                  "✅ تأیید",
                callback_data:
                  `pending:approve:${movie.id}`
              },
              {
                text:
                  "❌ رد",
                callback_data:
                  `pending:reject:${movie.id}`
              }
            ]
          ]
        }
      }
    );

    await sendMovie(
      env,
      adminId,
      movie,
      null,
      null
    );
  }
}

/* =========================================================
   Message wrapper
========================================================= */

const __oldHandleMessage =
  handleMessage;

async function handleMessage(
  env,
  message,
  ctx
) {
  if (
    !message.from
  ) {
    return;
  }

  const user =
    await ensureUser(
      env,
      message.from
    );

  user.last_active =
    now();

  await saveUser(
    env,
    user
  );

  if (
    user.blocked
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "🚫 دسترسی شما مسدود است."
      }
    );

    return;
  }

  if (
    message.text ===
      "/start" ||
    (
      message.text &&
      message.text.startsWith(
        "/start "
      )
    )
  ) {
    const parameter =
      message.text
        .split(" ")[1] ||
        "";

    await registerReferral(
      env,
      user,
      parameter
    );

    await handleStart(
      env,
      message.chat.id,
      message.from
    );

    return;
  }

  if (
    message.text &&
    message.text.toLowerCase() ===
      "/admin"
  ) {
    await startAdminRequest(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    message.text ===
    "/profile"
  ) {
    await showProfileExtended(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    message.text ===
    "/trending"
  ) {
    await showTrendingExtended(
      env,
      message.chat.id
    );

    return;
  }

  if (
    message.text ===
    "/leaderboard"
  ) {
    await showLeaderboardExtended(
      env,
      message.chat.id,
      "overall"
    );

    return;
  }

  if (
    message.text ===
    "/request"
  ) {
    await setAdminStateExtended(
      env,
      user.id,
      "request_movie"
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "🎬 نام فیلم موردنظر را ارسال کنید."
      }
    );

    return;
  }

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

  if (
    message.text
  ) {
    await handleButtonMessage(
      env,
      message,
      ctx
    );
  }
}

/* =========================================================
   State-aware message wrapper
========================================================= */

const __oldHandleMessage2 =
  handleMessage;

async function handleMessage(
  env,
  message,
  ctx
) {
  if (
    message?.from
  ) {
    const userId =
      String(
        message.from.id
      );

    const state =
      await getAdminStateExtended(
        env,
        userId
      );

    if (
      state &&
      message.text
    ) {
      if (
        state ===
        "admin_password"
      ) {
        return processAdminPassword(
          env,
          message
        );
      }

      if (
        state ===
        "request_movie"
      ) {
        await clearAdminStateExtended(
          env,
          userId
        );

        const user =
          await getUser(
            env,
            userId
          );

        await createMovieRequest(
          env,
          user,
          message.text
        );

        await telegram(
          env,
          "sendMessage",
          {
            chat_id:
              message.chat.id,
            text:
              "✅ درخواست فیلم ثبت شد."
          }
        );

        await telegram(
          env,
          "sendMessage",
          {
            chat_id:
              getAdminId(env),
            text:
              `🎬 Movie Request\n\n${message.text}\n👤 ${user.id}`
          }
        ).catch(
          () => {}
        );

        return;
      }

      if (
        (
          await isTeamMember(
            env,
            userId
          )
        ) &&
        (
          state ===
            "user_search" ||
          state ===
            "ad_copy"
        )
      ) {
        const handled =
          await handleAdminText(
            env,
            message,
            ctx
          );

        if (
          handled
        ) {
          return;
        }
      }
    }
  }

  return __oldHandleMessage2(
    env,
    message,
    ctx
  );
}
/* =========================================================
   Pending callbacks extended
========================================================= */

async function handlePendingCallbackExtended(
  env,
  callback
) {
  if (
    !(await isTeamMember(
      env,
      callback.from.id
    ))
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "⛔ دسترسی تیم لازم است.",
        show_alert:
          true
      }
    );

    return;
  }

  const parts =
    String(
      callback.data ||
        ""
    ).split(":");

  const action =
    parts[1];

  const movieId =
    parts[2];

  const pending =
    await getJSON(
      env,
      "pending_movies",
      []
    );

  const index =
    pending.findIndex(
      movie =>
        String(
          movie.id
        ) ===
        String(movieId)
    );

  if (
    index ===
    -1
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ فیلم پیدا نشد.",
        show_alert:
          true
      }
    );

    return;
  }

  const movie =
    pending[index];

  if (
    action ===
    "view"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await sendMovie(
      env,
      callback.message.chat.id,
      movie
    );

    return;
  }

  if (
    action ===
    "approve"
  ) {
    pending.splice(
      index,
      1
    );

    await putJSON(
      env,
      "pending_movies",
      pending
    );

    const originalUserId =
      movie.user_id;

    delete movie.user_id;

    await addMovie(
      env,
      movie
    );

    await logActionExtended(
      env,
      callback.from.id,
      "approve_movie",
      {
        movie_id:
          movie.id
      }
    );

    if (
      originalUserId
    ) {
      const user =
        await getUser(
          env,
          originalUserId
        );

      await notifyUser(
        env,
        user,
        "✅ فیلم شما تأیید شد و به آرشیو اضافه شد.",
        true
      );
    }

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "✅ تأیید شد."
      }
    );

    return;
  }

  if (
    action ===
    "reject"
  ) {
    pending.splice(
      index,
      1
    );

    await putJSON(
      env,
      "pending_movies",
      pending
    );

    await logActionExtended(
      env,
      callback.from.id,
      "reject_movie",
      {
        movie_id:
          movie.id
      }
    );

    if (
      movie.user_id
    ) {
      const user =
        await getUser(
          env,
          movie.user_id
        );

      await notifyUser(
        env,
        user,
        "❌ فیلم شما توسط تیم رد شد.",
        true
      );
    }

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ رد شد."
      }
    );

    return;
  }
}

/* =========================================================
   Extended callback wrapper for pending
========================================================= */

const __oldHandleCallback2 =
  handleCallback;

async function handleCallback(
  env,
  callback,
  ctx
) {
  const data =
    callback.data ||
    "";

  if (
    data.startsWith(
      "pending:"
    )
  ) {
    await handlePendingCallbackExtended(
      env,
      callback
    );

    return;
  }

  return __oldHandleCallback2(
    env,
    callback,
    ctx
  );
}

/* =========================================================
   Daily movie compatibility
========================================================= */

async function handleDailyMovieExtended(
  env,
  chatId,
  ctx
) {
  const movies =
    await getMovies(
      env
    );

  if (!movies.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد."
      }
    );

    return;
  }

  const today =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );

  let index =
    0;

  for (
    let i = 0;
    i <
    today.length;
    i++
  ) {
    index +=
      today.charCodeAt(i);
  }

  index %=
    movies.length;

  await sendMovie(
    env,
    chatId,
    movies[index],
    ctx
  );
}

/* =========================================================
   Main admin panel wrapper
========================================================= */

async function showAdminPanel(
  env,
  chatId,
  messageId = null
) {
  const userId =
    String(
      chatId
    );

  if (
    !(await isTeamMember(
      env,
      userId
    ))
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          chatId,
        text:
          "⛔ دسترسی مدیریت ندارید."
      }
    );

    return;
  }

  await logActionExtended(
    env,
    userId,
    "admin_panel_open"
  );

  const data = {
    chat_id:
      chatId,
    text:
      "👑 Admin / Team Panel",
    reply_markup:
      extendedAdminKeyboard()
  };

  if (
    messageId
  ) {
    data.message_id =
      messageId;

    const result =
      await telegram(
        env,
        "editMessageText",
        data
      );

    if (!result.ok) {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id:
            chatId,
          text:
            "👑 Admin / Team Panel",
          reply_markup:
            extendedAdminKeyboard()
        }
      );
    }
  } else {
    await telegram(
      env,
      "sendMessage",
      data
    );
  }
}

/* =========================================================
   Override approval callback handling order
========================================================= */

const __oldHandleAdminCallback2 =
  handleAdminCallback;

async function handleAdminCallback(
  env,
  callback,
  ctx
) {
  const data =
    callback.data ||
    "";

  if (
    data.startsWith(
      "x_admin:"
    ) ||
    data.startsWith(
      "x_adminreq:"
    ) ||
    data.startsWith(
      "x_user:"
    )
  ) {
    return __oldHandleAdminCallback2(
      env,
      callback,
      ctx
    );
  }

  return __oldHandleAdminCallback2(
    env,
    callback,
    ctx
  );
}
/* =========================================================
   Final processUpdate + Worker
========================================================= */

async function processUpdate(
  env,
  update,
  ctx
) {
  if (
    update.message
  ) {
    await handleMessage(
      env,
      update.message,
      ctx
    );
  }

  if (
    update.callback_query
  ) {
    await handleCallback(
      env,
      update.callback_query,
      ctx
    );
  }
}

/* =========================================================
   Worker
========================================================= */

export default {
  async fetch(
    request,
    env,
    ctx
  ) {
    try {
      const url =
        new URL(
          request.url
        );

      /* -----------------------------------------------
         Basic health
      ------------------------------------------------ */

      if (
        request.method ===
          "GET" &&
        url.pathname ===
          "/"
      ) {
        return new Response(
          "Film Bot is running.",
          {
            status:
              200,
            headers: {
              "Content-Type":
                "text/plain; charset=utf-8"
            }
          }
        );
      }

      /* -----------------------------------------------
         Health endpoint
      ------------------------------------------------ */

      if (
        request.method ===
          "GET" &&
        url.pathname ===
          "/health"
      ) {
        const health =
          await performHealthCheck(
            env
          );

        return json({
          status:
            "OK",
          bot:
            health.bot,
          database:
            health.database,
          storage:
            health.storage,
          webhook:
            health.webhook,
          backup:
            health.backup
        });
      }

      /* -----------------------------------------------
         Manual backup
         
         Requires:
         /backup?admin=YOUR_ADMIN_ID
      ------------------------------------------------ */

      if (
        request.method ===
          "GET" &&
        url.pathname ===
          "/backup"
      ) {
        const admin =
          url.searchParams.get(
            "admin"
          );

        if (
          !isAdmin(
            env,
            admin
          )
        ) {
          return new Response(
            "Forbidden",
            {
              status:
                403
            }
          );
        }

        const key =
          await createBackup(
            env
          );

        await logActionExtended(
          env,
          admin,
          "manual_backup",
          {
            key
          }
        );

        return json({
          status:
            "OK",
          backup:
            key
        });
      }

      if (
        request.method !==
        "POST"
      ) {
        return new Response(
          "Method Not Allowed",
          {
            status:
              405
          }
        );
      }

      const update =
        await request.json();

      console.log(
        "TELEGRAM UPDATE:",
        JSON.stringify(
          update
        )
      );

      ctx.waitUntil(
        processUpdate(
          env,
          update,
          ctx
        ).catch(
          error => {
            console.error(
              "Update error:",
              error
            );
          }
        )
      );

      return new Response(
        "OK"
      );
    } catch (
      error
    ) {
      console.error(
        "Worker error:",
        error
      );

      try {
        const adminId =
          getAdminId(
            env
          );

        if (
          adminId
        ) {
          await telegram(
            env,
            "sendMessage",
            {
              chat_id:
                adminId,
              text:
                `🚨 SYSTEM ALERT\n\n` +
                `❌ Worker error\n` +
                `🕐 ${new Date().toISOString()}`
            }
          );
        }
      } catch {}

      return new Response(
        "OK",
        {
          status:
            200
        }
      );
    }
  },

  /* -------------------------------------------------------
     Scheduled Backup
     
     برای اجرا، Worker باید Cron Trigger داشته باشد.
     این بخش هیچ Binding فعلی را تغییر نمی‌دهد.
  ------------------------------------------------------- */

  async scheduled(
    event,
    env,
    ctx
  ) {
    ctx.waitUntil(
      (async () => {
        try {
          const key =
            await createBackup(
              env
            );

          await logActionExtended(
            env,
            getAdminId(env),
            "scheduled_backup",
            {
              key
            }
          );
        } catch (
          error
        ) {
          console.error(
            "Scheduled backup error:",
            error
          );

          try {
            const adminId =
              getAdminId(
                env
              );

            if (
              adminId
            ) {
              await telegram(
                env,
                "sendMessage",
                {
                  chat_id:
                    adminId,
                  text:
                    `🚨 SYSTEM ALERT\n\n` +
                    `❌ Scheduled backup failed.\n` +
                    `🕐 ${new Date().toISOString()}`
                }
              );
            }
          } catch {}
        }
      })()
    );
  }
};
