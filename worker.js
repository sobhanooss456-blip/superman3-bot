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
    notMember:
      "❌ هنوز عضو کانال نشده‌اید.\n\nابتدا عضو کانال شوید و سپس «بررسی عضویت» را بزنید.",
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
    movieReceived:
      "✅ فیلم شما دریافت شد و پس از تأیید مدیر منتشر می‌شود.",
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
    noBest: "⭐ هنوز امتیازی ثبت نشده است.",
    menuButton: "☰ منو",
    closeMenu: "✖️ بستن منو",
    requestMovie: "📝 درخواست فیلم",
    favorites: "❤️ مورد علاقه‌ها",
    history24: "🕐 تاریخچه ۲۴ ساعت",
    inviteFriends: "👥 دعوت دوستان",
    movieWillDelete: "⚠️ این فیلم بعد از ۲۰ ثانیه حذف می‌شود.",
    resendMovie: "🔄 ارسال مجدد فیلم",
    menuOpened: "منوی اصلی",
    requestSaved: "✅ درخواست فیلم ثبت شد.",
    requestPrompt: "📝 نام فیلم موردنظر را ارسال کنید.",
    inviteTitle: "👥 دعوت دوستان",
    inviteCount: "دعوت‌های موفق",
    usersList: "👥 لیست کاربران",
    userProfile: "👤 مشاهده پروفایل",
    addAdmin: "👑 درخواست Admin",
    adminRequest: "🔐 درخواست مدیریت",
    adminApprove: "✅ تأیید",
    adminReject: "❌ رد",
    adminRequestSent: "⏳ درخواست Admin برای مدیر اصلی ارسال شد.",
    adminApproved: "✅ درخواست Admin شما تأیید شد.",
    adminRejected: "❌ درخواست Admin شما رد شد.",
    noUsers: "📭 کاربری ثبت نشده است.",
    userDetails: "👤 اطلاعات کاربر",
    previous: "⬅️ قبلی",
    next: "بعدی ➡️"
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
    noBest: "⭐ No ratings yet.",
    menuButton: "☰ Menu",
    closeMenu: "✖️ Close Menu",
    requestMovie: "📝 Request Movie",
    favorites: "❤️ Favorites",
    history24: "🕐 24h History",
    inviteFriends: "👥 Invite Friends",
    movieWillDelete: "⚠️ This movie will be deleted after 20 seconds.",
    resendMovie: "🔄 Send Movie Again",
    menuOpened: "Main Menu",
    requestSaved: "✅ Movie request saved.",
    requestPrompt: "📝 Send the movie name you want.",
    inviteTitle: "👥 Invite Friends",
    inviteCount: "Successful invites",
    usersList: "👥 User List",
    userProfile: "👤 View Profile",
    addAdmin: "👑 Admin Request",
    adminRequest: "🔐 Admin Request",
    adminApprove: "✅ Approve",
    adminReject: "❌ Reject",
    adminRequestSent: "⏳ Your Admin request was sent to the main manager.",
    adminApproved: "✅ Your Admin request was approved.",
    adminRejected: "❌ Your Admin request was rejected.",
    noUsers: "📭 No users found.",
    userDetails: "👤 User Details",
    previous: "⬅️ Previous",
    next: "Next ➡️"
  }
};

function t(language, key) {
  const lang = TEXTS[language] ? language : "en";
  return TEXTS[lang][key] || TEXTS.en[key] || key;
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
    language_selected: false,
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

  if (from.username) {
    user.username = from.username;
  }

  if (from.first_name) {
    user.first_name = from.first_name;
  }

  if (!user.created_at) {
    user.created_at = now();
  }

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

async function sendMembershipMessage(env, chatId, language = "fa") {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(language, "joinChannel"),
    reply_markup: {
      inline_keyboard: [
        [{ text: t(language, "joinChannelButton"), url: CHANNEL_LINK }],
        [{ text: t(language, "checkMembership"), callback_data: "check_membership" }]
      ]
    }
  });
}

/* =========================================================
   Main menu
========================================================= */

function collapsedKeyboard(language = "fa") {
  return {
    keyboard: [[{ text: t(language, "menuButton") }]],
    resize_keyboard: true,
    is_persistent: true
  };
}

function mainKeyboard(language = "fa", admin = false) {
  const keyboard = [
    [
      { text: t(language, "getMovie") },
      { text: t(language, "sendMovie") }
    ],
    [
      { text: t(language, "requestMovie") },
      { text: t(language, "favorites") }
    ],
    [
      { text: t(language, "history24") },
      { text: t(language, "inviteFriends") }
    ],
    [
      { text: t(language, "language") }
    ]
  ];

  if (admin) {
    keyboard.push([{ text: t(language, "adminPanel") }]);
  }

  keyboard.push([{ text: t(language, "closeMenu") }]);

  return {
    keyboard,
    resize_keyboard: true,
    is_persistent: true
  };
}

async function sendMainMenu(env, chatId, user) {
  const language = getLanguage(user);
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${t(language, "welcome")}\n\n${t(language, "menu")}`,
    reply_markup: collapsedKeyboard(language)
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

  const member =
    await checkMembership(
      env,
      from.id
    );

  if (!member) {
    await sendMembershipMessage(
      env,
      chatId,
      getLanguage(user)
    );

    return;
  }

  user.joined = true;

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
    callback.data.split(":")[1];

  const user =
    await getUser(
      env,
      userId
    );

  user.language =
    language === "en"
      ? "en"
      : "fa";

  user.language_selected = true;

  await saveUser(
    env,
    user
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id: callback.id,
      text: t(
        user.language,
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

  user.joined = true;

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

async function getMovies(env) {
  return await getJSON(
    env,
    "movies",
    []
  );
}

async function saveMovies(env, movies) {
  await putJSON(
    env,
    "movies",
    movies
  );
}

async function findMovie(env, movieId) {
  const movies =
    await getMovies(env);

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
    await getMovies(env);

  if (!movie.featured) {
    movie.featured = false;
  }

  movies.push(movie);

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
    await getMovies(env);

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
    .delete(`ratings:${movieId}`)
    .catch(() => {});
}

/* =========================================================
   Send movie
========================================================= */

async function sendMovie(
  env,
  chatId,
  movie,
  ctx = null,
  replyMarkup = null,
     viewerUserId = null
) {
  if (!movie) return null;

  let result;
  const caption = movie.caption || "🎬 فیلم";
  const options = {
    chat_id: chatId,
    caption,
    protect_content: false
  };

  if (replyMarkup) options.reply_markup = replyMarkup;

  if (movie.type === "document") {
    options.document = movie.file_id;
    result = await telegram(env, "sendDocument", options);
  } else {
    options.video = movie.file_id;
    result = await telegram(env, "sendVideo", options);
  }

  if (result.ok && ctx && result.result?.message_id) {
    const messageId = result.result.message_id;
    ctx.waitUntil((async () => {
      await new Promise(resolve => setTimeout(resolve, AUTO_DELETE_TIME));
      try {
        await telegram(env, "deleteMessage", {
          chat_id: chatId,
          message_id: messageId
        });
      } catch (e) {
        console.error("Auto delete error:", e);
      }

      if (viewerUserId) {
        const language = getLanguage(await getUser(env, viewerUserId));
        await telegram(env, "sendMessage", {
          chat_id: chatId,
          text: t(language, "movieDeleted"),
          reply_markup: {
            inline_keyboard: [[{
              text: t(language, "resendMovie"),
              callback_data: `fx:again:${movie.id}`
            }]]
          }
        }).catch(() => {});
      }
    })());
  }

  return result;
}

/* =========================================================
   Random movie + 10 second anti spam
========================================================= */

async function handleGetMovie(
  env,
  chatId,
  userId,
  ctx
) {
  const user =
    await getUser(
      env,
      userId
    );

  if (user.blocked) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🚫 دسترسی شما مسدود شده است."
      }
    );

    return;
  }

  const lastTime =
    await env.BOT_DATA.get(
      `cooldown:${userId}`
    );

  if (lastTime) {
    const elapsed =
      now() - Number(lastTime);

    if (elapsed < MOVIE_COOLDOWN) {
      const remaining =
        Math.ceil(
          (MOVIE_COOLDOWN - elapsed) /
            1000
        );

      await telegram(
        env,
        "sendMessage",
        {
          chat_id: chatId,
          text:
            `⏳ بعد از ${remaining} ثانیه دوباره تلاش کنید.`
        }
      );

      return;
    }
  }

  const movies =
    await getMovies(env);

  if (!movies.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد."
      }
    );

    return;
  }

  const movie =
    movies[
      Math.floor(
        Math.random() *
          movies.length
      )
    ];

  const result =
    await sendMovie(
      env,
      chatId,
      movie,
      ctx
    );

  if (
    result &&
    result.ok
  ) {
    await env.BOT_DATA.put(
      `cooldown:${userId}`,
      String(now()),
      {
        expirationTtl: 20
      }
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "⭐ به فیلم امتیاز بدهید:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⭐",
                callback_data:
                  `rate:${movie.id}:1`
              },
              {
                text: "⭐⭐",
                callback_data:
                  `rate:${movie.id}:2`
              },
              {
                text: "⭐⭐⭐",
                callback_data:
                  `rate:${movie.id}:3`
              }
            ],
            [
              {
                text: "⭐⭐⭐⭐",
                callback_data:
                  `rate:${movie.id}:4`
              },
              {
                text: "⭐⭐⭐⭐⭐",
                callback_data:
                  `rate:${movie.id}:5`
              }
            ]
          ]
        }
      }
    );
  }
}

/* =========================================================
   Daily movie
========================================================= */

async function handleDailyMovie(
  env,
  chatId,
  ctx
) {
  const movies =
    await getMovies(env);

  if (!movies.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "📭 فعلاً هیچ فیلمی در آرشیو وجود ندارد."
      }
    );

    return;
  }

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  let index = 0;

  for (
    let i = 0;
    i < today.length;
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
   Rating
========================================================= */

async function handleRating(
  env,
  callback,
  movieId,
  rating
) {
  const userId =
    String(callback.from.id);

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
          "❌ فیلم پیدا نشد."
      }
    );

    return;
  }

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "❌ امتیاز نامعتبر است."
      }
    );

    return;
  }

  const ratingKey =
    `rating:${movieId}:${userId}`;

  const alreadyRated =
    await env.BOT_DATA.get(
      ratingKey
    );

  if (alreadyRated) {
    const user =
      await getUser(
        env,
        userId
      );

    const language =
      getLanguage(user);
         await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          t(
            language,
            "alreadyRated"
          ),
        show_alert: true
      }
    );

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

  allRatings.push(
    Number(rating)
  );

  await putJSON(
    env,
    `ratings:${movieId}`,
    allRatings
  );

  const ratingUser = await getUser(env, userId);
  ratingUser.ratings = Number(ratingUser.ratings || 0) + 1;
  await saveUser(env, ratingUser);

  if (callback.message?.message_id) {
    const language = getLanguage(ratingUser);
    const fav = Array.isArray(ratingUser.favorites) && ratingUser.favorites.map(String).includes(String(movieId));
    await telegram(env, "editMessageReplyMarkup", {
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      reply_markup: { inline_keyboard: [[
        { text: fav ? "💔 Remove Favorite" : "❤️ Favorite", callback_data: `fx:fav:${fav ? "remove" : "add"}:${movieId}` },
        { text: "🔄 Again", callback_data: `fx:again:${movieId}` }
      ]] }
    }).catch(() => {});
  }

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id,
      text:
        "⭐ امتیاز شما ثبت شد."
    }
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        callback.message.chat.id,
      text:
        "⭐ امتیاز شما ثبت شد. ممنون!"
    }
  );
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

  const start =
    page * MOVIE_PAGE_SIZE;

  const pageMovies =
    movies.slice(
      start,
      start + MOVIE_PAGE_SIZE
    );

  pageMovies.forEach(
    (movie, index) => {
      const number =
        start + index + 1;

      const icon =
        movie.featured
          ? "⭐"
          : "🎬";

      keyboard.push([
        {
          text:
            `${icon} فیلم ${number}`,
          callback_data:
            `movies:view:${movie.id}:${page}`
        }
      ]);
    }
  );

  const navigation = [];

  if (page > 0) {
    navigation.push({
      text:
        "⬅️ صفحه قبل",
      callback_data:
        `movies:list:${page - 1}`
    });
  }

  navigation.push({
    text:
      `صفحه ${page + 1}`,
    callback_data:
      `movies:list:${page}`
  });

  if (
    page <
    totalPages - 1
  ) {
    navigation.push({
      text:
        "صفحه بعد ➡️",
      callback_data:
        `movies:list:${page + 1}`
    });
  }

  keyboard.push(
    navigation
  );

  keyboard.push([
    {
      text:
        "🔙 بازگشت",
      callback_data:
        "admin:back"
    }
  ]);

  return {
    inline_keyboard:
      keyboard
  };
}

async function showMoviesList(
  env,
  chatId,
  page = 0,
  messageId = null
) {
  const movies =
    await getMovies(env);

  if (!movies.length) {
    const markup = {
      inline_keyboard: [
        [
          {
            text:
              "🔙 بازگشت",
            callback_data:
              "admin:back"
          }
        ]
      ]
    };

    if (messageId) {
      const result =
        await telegram(
          env,
          "editMessageText",
          {
            chat_id: chatId,
            message_id:
              messageId,
            text:
              "📭 آرشیو فیلم خالی است.",
            reply_markup:
              markup
          }
        );

      if (!result.ok) {
        await telegram(
          env,
          "deleteMessage",
          {
            chat_id: chatId,
            message_id:
              messageId
          }
        ).catch(() => {});

        await telegram(
          env,
          "sendMessage",
          {
            chat_id: chatId,
            text:
              "📭 آرشیو فیلم خالی است.",
            reply_markup:
              markup
          }
        );
      }
    } else {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id: chatId,
          text:
            "📭 آرشیو فیلم خالی است.",
          reply_markup:
            markup
        }
      );
    }

    return;
  }

  const totalPages =
    Math.ceil(
      movies.length /
        MOVIE_PAGE_SIZE
    );

  page =
    Math.max(
      0,
      Math.min(
        page,
        totalPages - 1
      )
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
    const result =
      await telegram(
        env,
        "editMessageText",
        {
          chat_id: chatId,
          message_id:
            messageId,
          text,
          reply_markup:
            markup
        }
    );

    if (!result.ok) {
      await telegram(
        env,
        "deleteMessage",
        {
          chat_id: chatId,
          message_id:
            messageId
        }
      ).catch(() => {});

      await telegram(
        env,
        "sendMessage",
        {
          chat_id: chatId,
          text,
          reply_markup:
            markup
        }
      );
    }
  } else {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text,
        reply_markup:
          markup
      }
    );
  }
}

/* =========================================================
   Admin movie details
========================================================= */

function movieAdminMarkup(
  movie,
  page
) {
  const featured =
    movie.featured === true;

  return {
    inline_keyboard: [
      [
        {
          text:
            "👀 مشاهده فیلم",
          callback_data:
            `movies:watch:${movie.id}:${page}`
        }
      ],
      [
        {
          text:
            "🗑 حذف فیلم",
          callback_data:
            `movies:delete:${movie.id}:${page}`
        }
      ],
      [
        {
          text:
            featured
              ? "☆ پیشنهادی"
              : "⭐ پیشنهادی",
          callback_data:
            `movies:featured:${movie.id}:${page}`
        }
      ],
      [
        {
          text:
            "🔙 بازگشت",
          callback_data:
            `movies:back:${page}`
        }
      ]
    ]
  };
}

function movieAdminCaption(
  movie
) {
  const featured =
    movie.featured === true;

  return (
    `🎬 ${movie.caption || "فیلم"}\n\n` +
    `👀 بازدید: ${movie.views || 0}\n` +
    `⭐ پیشنهادی: ${featured ? "بله" : "خیر"}\n` +
    `🕐 تاریخ افزودن: ${movie.added_at || "-"}`
  );
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
    await findMovie(
      env,
      movieId
    );

  if (!movie) {
    if (
      editMessage &&
      messageId
    ) {
      const result =
        await telegram(
          env,
          "editMessageCaption",
          {
            chat_id: chatId,
            message_id:
              messageId,
            caption:
              "❌ فیلم پیدا نشد."
          }
        );

      if (!result.ok) {
        await telegram(
          env,
          "editMessageText",
          {
            chat_id: chatId,
            message_id:
              messageId,
            text:
              "❌ فیلم پیدا نشد."
          }
        ).catch(() => {});
      }
    } else {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id: chatId,
          text:
            "❌ فیلم پیدا نشد."
        }
      );
    }

    return;
  }

  const markup =
    movieAdminMarkup(
      movie,
      page
    );

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
  movieId,
  page = 0
) {
  const movie =
    await findMovie(
      env,
      movieId
    );

  if (!movie) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "❌ فیلم پیدا نشد."
      }
    );

    return;
  }

  const markup =
    movieAdminMarkup(
      movie,
      page
    );

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
    await findMovie(
      env,
      movieId
    );

  if (!movie) {
    const result =
      await telegram(
        env,
        "editMessageCaption",
        {
          chat_id: chatId,
          message_id:
            messageId,
          caption:
            "❌ فیلم پیدا نشد."
        }
      );

    if (!result.ok) {
      await telegram(
        env,
        "editMessageText",
        {
          chat_id: chatId,
          message_id:
            messageId,
          text:
            "❌ فیلم پیدا نشد."
        }
      ).catch(() => {});
    }

    return;
  }

  const result =
    await telegram(
      env,
      "editMessageCaption",
      {
        chat_id: chatId,
        message_id:
          messageId,
        caption:
          `❗ این فیلم حذف شود؟\n\n` +
          `🎬 ${movie.caption || "فیلم"}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "✅ بله، حذف کن",
                callback_data:
                  `movies:confirmdelete:${movieId}:${page}`
              }
            ],
            [
              {
                text:
                  "❌ لغو",
                callback_data:
                  `movies:view:${movieId}:${page}`
              }
            ]
          ]
        }
      }
    );

  if (!result.ok) {
    console.error(
      "confirmDeleteMovie editMessageCaption failed:",
      result
    );
  }
}

async function deleteMovieConfirmed(
  env,
  chatId,
  movieId,
  page,
  messageId
) {
  const movie =
    await findMovie(
      env,
      movieId
    );

  if (!movie) {
    await telegram(
      env,
      "editMessageCaption",
      {
        chat_id: chatId,
        message_id:
          messageId,
        caption:
          "❌ فیلم قبلاً حذف شده است.",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🎬 بازگشت به لیست فیلم‌ها",
                callback_data:
                  `movies:list:${page}`
              }
            ]
          ]
        }
      }
    );

    return;
  }

  await deleteMovieById(
    env,
    movieId
  );

  const result =
    await telegram(
      env,
      "editMessageCaption",
       {
                  chat_id: chatId,
        message_id:
          messageId,
        caption:
          "🗑 فیلم با موفقیت حذف شد.",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🎬 بازگشت به لیست فیلم‌ها",
                callback_data:
                  `movies:list:${page}`
              }
            ]
          ]
        }
      }
    );

  if (!result.ok) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🗑 فیلم با موفقیت حذف شد.",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🎬 بازگشت به لیست فیلم‌ها",
                callback_data:
                  `movies:list:${page}`
              }
            ]
          ]
        }
      }
    );
  }
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
  const movies =
    await getMovies(env);

  const index =
    movies.findIndex(
      movie =>
        String(movie.id) ===
        String(movieId)
    );

  if (index === -1) {
    console.error(
      "toggleFeatured: movie not found",
      movieId
    );

    return;
  }

  movies[index].featured =
    !Boolean(
      movies[index].featured
    );

  await saveMovies(
    env,
    movies
  );

  const movie =
    movies[index];

  const markup =
    movieAdminMarkup(
      movie,
      page
    );

  const result =
    await telegram(
      env,
      "editMessageCaption",
      {
        chat_id: chatId,
        message_id:
          messageId,
        caption:
          movieAdminCaption(
            movie
          ),
        reply_markup:
          markup
      }
    );

  if (!result.ok) {
    console.error(
      "toggleFeatured editMessageCaption failed:",
      result
    );
  }
}

/* =========================================================
   Admin panel
========================================================= */

function adminKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text:
            "🎬 لیست فیلم‌ها",
          callback_data:
            "admin:movies"
        }
      ],
      [
        {
          text:
            "📥 فیلم‌های در انتظار تأیید",
          callback_data:
            "admin:pending"
        }
      ],
      [
        {
          text:
            "📊 آمار",
          callback_data:
            "admin:stats"
        }
      ],
      [
        {
          text:
            "📢 اطلاعیه",
          callback_data:
            "admin:announcement"
        }
      ],
      [
        {
          text:
            "🚫 بلاک کاربر",
          callback_data:
            "admin:block"
        },
        {
          text:
            "✅ آنبلاک کاربر",
          callback_data:
            "admin:unblock"
        }
      ],
      [
        {
          text:
            "💾 اطلاعات ربات",
          callback_data:
            "admin:info"
        }
      ],
      [
        {
          text:
            "🔙 بازگشت",
          callback_data:
            "admin:back"
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
  const text =
    "⚙️ پنل مدیریت\n\nیکی از گزینه‌ها را انتخاب کنید.";

  const data = {
    chat_id: chatId,
    text,
    reply_markup:
      adminKeyboard()
  };

  if (messageId) {
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
          chat_id: chatId,
          text,
          reply_markup:
            adminKeyboard()
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
   Pending movies
========================================================= */

async function getPendingMovies(
  env
) {
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
    await getPendingMovies(
      env
    );

  if (!pending.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "📭 فیلمی در انتظار تأیید نیست."
      }
    );

    return;
  }

  for (
    const movie of pending
  ) {
    const text =
      `📥 فیلم در انتظار تأیید\n\n` +
      `👤 کاربر: ${movie.user_id}\n` +
      `🕐 ${movie.added_at || "-"}`;

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text,
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
    await getPendingMovies(
      env
    );

  let type = null;
  let fileId = null;

  if (message.video) {
    type = "video";
    fileId =
      message.video.file_id;
  } else if (
    message.document
  ) {
    type = "document";
    fileId =
      message.document.file_id;
  }

  if (!fileId) {
    return null;
  }

  const movie = {
    id: randomId(),
    file_id: fileId,
    type,
    caption:
      message.caption ||
      "🎬 فیلم ارسال‌شده توسط کاربر",
    user_id:
      String(user.id),
    added_at:
      new Date().toISOString(),
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
    await getPendingMovies(
      env
    );

  const index =
    pending.findIndex(
      movie =>
        String(movie.id) ===
        String(movieId)
    );

  if (index === -1) {
    return null;
  }

  const movie =
    pending[index];

  pending.splice(
    index,
    1
  );

  await savePendingMovies(
    env,
    pending
  );

  delete movie.user_id;

  await addMovie(
    env,
    movie
  );

  return movie;
}

async function rejectPendingMovie(
  env,
  movieId
) {
  const pending =
    await getPendingMovies(
      env
    );

  const index =
    pending.findIndex(
      movie =>
        String(movie.id) ===
        String(movieId)
    );

  if (index === -1) {
    return null;
  }

  const movie =
    pending[index];

  pending.splice(
    index,
    1
  );

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
  const list =
    await env.BOT_DATA.list({
      prefix: "user:"
    });

  const users = [];

  for (
    const key of list.keys
  ) {
    const user =
      await getJSON(
        env,
        key.name,
        null
      );

    if (user) {
      users.push(user);
    }
  }

  return users;
}

async function getStatistics(
  env
) {
  const users =
    await getAllUsers(env);

  const movies =
    await getMovies(env);

  const pending =
    await getPendingMovies(
      env
    );

  const totalViews =
    movies.reduce(
      (sum, movie) =>
        sum +
        Number(
          movie.views || 0
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
    views:
      totalViews
  };
}

async function showStatistics(
  env,
  chatId,
  admin = false
) {
  const stats =
    await getStatistics(
      env
    );

  const text =
    `📊 آمار\n\n` +
    `👥 کاربران: ${stats.users}\n` +
    `🎬 فیلم‌ها: ${stats.movies}\n` +
    `📥 در انتظار تأیید: ${stats.pending}\n` +
    `👀 مجموع بازدیدها: ${stats.views}`;

  await telegram(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text,
      ...(admin
        ? {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text:
                      "🔙 بازگشت",
                    callback_data:
                      "admin:back"
                  }
                ]
              ]
            }
          }
        : {})
    }
  );
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
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🏆 هنوز اطلاعات کافی وجود ندارد."
      }
    );

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

  top.forEach(
    (movie, index) => {
      text +=
        `${index + 1}. 🎬 فیلم ${index + 1}` +
        ` — 👀 ${movie.views || 0}\n`;
    }
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text
    }
  );
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
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "⭐ هنوز امتیازی ثبت نشده است."
      }
    );

    return;
       }

  const results = [];

  for (
    const movie of movies
  ) {
    const ratings =
      await getJSON(
        env,
        `ratings:${movie.id}`,
        []
      );

    if (!ratings.length) {
      continue;
    }

    const total =
      ratings.reduce(
        (a, b) =>
          a + Number(b),
        0
      );

    const average =
      total / ratings.length;

    results.push({
      movie,
      average,
      count:
        ratings.length
    });
  }

  results.sort(
    (a, b) =>
      b.average -
      a.average
  );

  const top =
    results.slice(
      0,
      10
    );

  if (!top.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "⭐ هنوز امتیازی ثبت نشده است."
      }
    );

    return;
  }

  let text =
    "⭐ برترین فیلم‌ها\n\n";

  top.forEach(
    (item, index) => {
      text +=
        `${index + 1}. 🎬 فیلم ${index + 1}` +
        ` — ⭐ ${item.average.toFixed(1)}` +
        ` (${item.count})\n`;
    }
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text
    }
  );
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
      movie =>
        movie.featured === true
    );

  if (!featured.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "⭐ هنوز فیلم پیشنهادی وجود ندارد."
      }
    );

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

  for (
    const user of users
  ) {
    if (user.blocked) {
      continue;
    }

    const task =
      telegram(
        env,
        "sendMessage",
        {
          chat_id: user.id,
          text:
            `📢 اطلاعیه\n\n${text}`
        }
      )
        .then(result => {
          if (result.ok) {
            sent++;
          }
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
    await getUser(
      env,
      userId
    );

  user.blocked = true;

  await saveUser(
    env,
    user
  );
}

async function unblockUser(
  env,
  userId
) {
  const user =
    await getUser(
      env,
      userId
    );

  user.blocked = false;

  await saveUser(
    env,
    user
  );
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
    String(
      message.from.id
    );

  const state =
    await getAdminState(
      env,
      userId
    );

  if (!state) {
    return false;
  }

  if (
    state ===
    "announcement"
  ) {
    await clearAdminState(
      env,
      userId
    );

    await sendAnnouncement(
      env,
      message.text || "",
      ctx
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "✅ اطلاعیه برای کاربران ارسال شد."
      }
    );

    return true;
  }

  if (
    state ===
    "block"
  ) {
    await clearAdminState(
      env,
      userId
    );

    const target =
      String(
        (
          message.text ||
          ""
        ).trim()
      );

    if (
      !/^\d+$/.test(
        target
      )
    ) {
      await telegram(
        env,
                 "sendMessage",
        {
          chat_id:
            message.chat.id,
          text:
            "❌ آیدی معتبر نیست."
        }
      );

      return true;
    }

    await blockUser(
      env,
      target
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          `🚫 کاربر ${target} بلاک شد.`
      }
    );

    return true;
  }

  if (
    state ===
    "unblock"
  ) {
    await clearAdminState(
      env,
      userId
    );

    const target =
      String(
        (
          message.text ||
          ""
        ).trim()
      );

    if (
      !/^\d+$/.test(
        target
      )
    ) {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id:
            message.chat.id,
          text:
            "❌ آیدی معتبر نیست."
        }
      );

      return true;
    }

    await unblockUser(
      env,
      target
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          `✅ کاربر ${target} آنبلاک شد.`
      }
    );

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
    text ===
      t(
        language,
        "getMovie"
      ) ||
    text ===
      "🎬 دریافت فیلم"
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
    text ===
      t(
        language,
        "dailyMovie"
      ) ||
    text ===
      "🍿 فیلم پیشنهادی امروز"
  ) {
    await handleDailyMovie(
      env,
      chatId,
      ctx
    );

    return;
  }

  if (
    text ===
      t(
        language,
        "sendMovie"
      ) ||
    text ===
      "📤 ارسال فیلم"
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🎬 فیلم خود را ارسال کنید."
      }
    );

    return;
  }

  if (
    text ===
      t(
        language,
        "topMovies"
      ) ||
    text ===
      "🏆 پربازدیدترین‌ها"
  ) {
    await showTopMovies(
      env,
      chatId,
      ctx
    );

    return;
  }

  if (
    text ===
      t(
        language,
        "bestMovies"
      ) ||
    text ===
      "⭐ برترین‌ها"
  ) {
    await showBestMovies(
      env,
      chatId
    );

    return;
  }

  if (
    text ===
      t(
        language,
        "statistics"
      ) ||
    text ===
      "📊 آمار"
  ) {
    await showStatistics(
      env,
      chatId
    );

    return;
  }

  if (
    text ===
      t(
        language,
        "language"
      ) ||
    text ===
      "🌐 تغییر زبان"
  ) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🌐 زبان خود را انتخاب کنید:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🇮🇷 فارسی",
                callback_data:
                  "lang:fa"
              },
              {
                text:
                  "🇬🇧 English",
                callback_data:
                  "lang:en"
              }
            ]
          ]
        }
      }
    );

    return;
  }

  if (
    isAdmin(
      env,
      user.id
    ) &&
    (
      text ===
        t(
          language,
          "adminPanel"
        ) ||
      text ===
        "⚙️ پنل مدیریت"
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
    String(
      callback.from.id
    );

  if (!(await enhancedIsApprovedAdmin(env, userId))) {
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

  const data =
    callback.data || "";

  const chatId =
    callback.message
      .chat.id;

  const messageId =
    callback.message
      .message_id;

  if (
    data ===
    "admin:movies"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await showMoviesList(
      env,
      chatId,
      0
    );

    return;
  }

  if (
    data.startsWith(
      "movies:list:"
    )
  ) {
    const page =
      Number(
        data.split(":")[2]
      ) || 0;

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await showMoviesList(
      env,
      chatId,
      page,
      messageId
    );

    return;
  }

  if (
    data.startsWith(
      "movies:view:"
    )
  ) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    const page =
      Number(
        parts[3]
      ) || 0;

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await showMovieDetails(
      env,
      chatId,
      movieId,
      page
    );

    return;
  }

  if (
    data.startsWith(
      "movies:watch:"
    )
  ) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    const page =
      Number(
        parts[3]
      ) || 0;

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await adminWatchMovie(
      env,
      chatId,
      movieId,
      page
    );

    return;
  }

  if (
    data.startsWith(
      "movies:delete:"
    )
  ) {
    const parts =
      data.split(":");

    const movieId =
      parts[2];

    const page =
      Number(
        parts[3]
      ) || 0;

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

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
      Number(
        parts[3]
      ) || 0;

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "🗑 در حال حذف..."
      }
    );

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
      Number(
        parts[3]
      ) || 0;

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          "⭐ انجام شد."
      }
    );

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

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    /*
      این دکمه روی پیام فیلم قرار دارد.
      بنابراین editMessageText روی آن قابل استفاده نیست.
      ابتدا پیام فیلم حذف می‌شود و سپس لیست دوباره ارسال می‌شود.
    */

    await telegram(
      env,
      "deleteMessage",
      {
        chat_id: chatId,
        message_id:
          messageId
      }
    ).catch(() => {});

    await showMoviesList(
      env,
      chatId,
      page
    );

    return;
  }

  if (
    data ===
    "admin:pending"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await sendPendingList(
      env,
      chatId
    );

    return;
  }

  if (
    data ===
    "admin:stats"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await showStatistics(
             env,
      chatId,
      true
    );

    return;
  }

  if (
    data ===
    "admin:announcement"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await setAdminState(
      env,
      userId,
      "announcement"
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "📢 متن اطلاعیه را ارسال کنید."
      }
    );

    return;
  }

  if (
    data ===
    "admin:block"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await setAdminState(
      env,
      userId,
      "block"
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🚫 آیدی کاربر را ارسال کنید."
      }
    );

    return;
  }

  if (
    data ===
    "admin:unblock"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await setAdminState(
      env,
      userId,
      "unblock"
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "✅ آیدی کاربر را ارسال کنید."
      }
    );

    return;
  }

  if (
    data ===
    "admin:info"
  ) {
    const stats =
      await getStatistics(
        env
      );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          `💾 اطلاعات ربات\n\n` +
          `🤖 وضعیت: فعال\n` +
          `🎬 فیلم‌ها: ${stats.movies}\n` +
          `👥 کاربران: ${stats.users}\n` +
          `📥 در انتظار: ${stats.pending}\n` +
          `👀 بازدیدها: ${stats.views}\n` +
          `☁️ Cloudflare Workers + KV`
      }
    );

    return;
  }

  if (
    data ===
    "admin:back"
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id
      }
    );

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
  if (!(await enhancedIsApprovedAdmin(env, callback.from.id))) {
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

  const data =
    callback.data || "";

  const parts =
    data.split(":");

  const action =
    parts[1];

  const movieId =
    parts[2];

  if (
    action ===
    "approve"
  ) {
    const movie =
      await approvePendingMovie(
        env,
        movieId
      );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          movie
            ? "✅ فیلم تأیید شد."
            : "❌ فیلم پیدا نشد."
      }
    );

    if (movie) {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id:
            movie.user_id,
          text:
            "✅ فیلم شما تأیید شد و به آرشیو اضافه شد."
        }
      );
    }

    return;
  }

  if (
    action ===
    "reject"
  ) {
    const movie =
      await rejectPendingMovie(
        env,
        movieId
      );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id:
          callback.id,
        text:
          movie
            ? "❌ فیلم رد شد."
            : "❌ فیلم پیدا نشد."
      }
    );

    if (movie) {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id:
            movie.user_id,
          text:
            "❌ فیلم شما توسط مدیر رد شد."
        }
      );
    }

    return;
  }

  if (
    action ===
    "view"
  ) {
    const pending =
      await getPendingMovies(
        env
      );

    const movie =
      pending.find(
        m =>
          String(m.id) ===
          String(movieId)
      );

    if (!movie) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id:
            callback.id,
          text:
            "❌ فیلم پیدا نشد."
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
      callback.message
        .chat.id,
      movie
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

  try {
    /*
      مهم:
      اینجا callback را به‌صورت عمومی answer نمی‌کنیم.
      هر handler دقیقاً یک بار answerCallbackQuery می‌کند.
      این کار مشکل «query is already answered» را جلوگیری می‌کند.
    */

    if (
      data.startsWith(
        "lang:"
      )
    ) {
      await handleLanguageCallback(
        env,
        callback
      );

      return;
    }

    if (
      data ===
      "check_membership"
    ) {
      const userId =
        String(
          callback.from.id
        );

      const member =
        await checkMembership(
          env,
          userId
        );

      if (!member) {
        await telegram(
          env,
          "answerCallbackQuery",
          {
            callback_query_id:
              callback.id,
            text:
              "❌ هنوز عضو کانال نشده‌اید.",
            show_alert:
              true
          }
        );

        return;
      }

      const user =
        await getUser(
          env,
          userId
        );

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
        callback.message
          .chat.id,
        user
      );

      return;
    }

    if (
      data.startsWith(
        "rate:"
      )
    ) {
      const parts =
        data.split(":");

      const movieId =
        parts[1];

      const rating =
        Number(
          parts[2]
        );

      await handleRating(
        env,
        callback,
        movieId,
        rating
      );

      return;
    }

    /*
      pending قبل از admin/movies بررسی می‌شود.
    */

    if (
      data.startsWith(
        "pending:"
      )
    ) {
      await handlePendingCallback(
        env,
        callback
      );

      return;
    }

    if (
      data.startsWith(
        "admin:"
      ) ||
      data.startsWith(
        "movies:"
      )
    ) {
      await handleAdminCallback(
        env,
        callback,
        ctx
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
  } catch (error) {
    console.error(
      "Callback error:",
      error
    );

    try {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id:
            callback.message
              .chat.id,
          text:
            "❌ هنگام اجرای این دکمه خطایی رخ داد."
        }
      );
    } catch {}
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
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "🚫 دسترسی شما مسدود شده است."
      }
    );

    return;
  }

  const movie =
    await savePendingMovie(
      env,
      message,
      user
    );

  if (!movie) {
    return;
  }

  await telegram(
    env,
    "sendMessage",
    {
      chat_id:
        message.chat.id,
      text:
        "✅ فیلم شما دریافت شد و پس از تأیید مدیر منتشر می‌شود."
    }
  );

  const adminId =
    getAdminId(env);

  if (adminId) {
    /*
      پیام بررسی برای مدیر
    */

    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          adminId,
        text:
          `📥 فیلم جدید برای بررسی\n\n` +
          `👤 کاربر: ${user.id}\n` +
          `🕐 ${movie.added_at}`,
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

    /*
      خود فیلم نیز برای مدیر ارسال می‌شود.
    */

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
  if (!message.from) {
    return;
  }

  const user =
    await ensureUser(
      env,
      message.from
    );
     if (user.blocked) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          "🚫 دسترسی شما مسدود شده است."
      }
    );

    return;
  }

  /*
    /start
  */

  if (
    message.text ===
    "/start"
  ) {
    await handleStart(
      env,
      message.chat.id,
      message.from
    );

    return;
  }

  /*
    /admin
  */

  if (
    isAdmin(
      env,
      user.id
    ) &&
    message.text ===
      "/admin"
  ) {
    await showAdminPanel(
      env,
      message.chat.id
    );

    return;
  }

  /*
    وضعیت‌های پنل مدیریت
  */

  if (
    isAdmin(
      env,
      user.id
    ) &&
    message.text
  ) {
    const handled =
      await handleAdminText(
        env,
        message,
        ctx
      );

    if (handled) {
      return;
    }
  }

  /*
    ارسال فیلم / فایل
  */

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

  /*
    دکمه‌های معمولی
  */

  if (message.text) {
    await handleButtonMessage(
      env,
      message,
      ctx
    );
  }
}

/* =========================================================
   Enhanced feature layer
   Uses unique function names to avoid duplicate declarations.
========================================================= */

const ENHANCED_REQUEST_STATE_PREFIX = "feature_state:";
const ENHANCED_HISTORY_TTL = 24 * 60 * 60 * 1000;
const ENHANCED_REF_REWARD = 3;

function enhancedKey(name, id) {
  return `${ENHANCED_REQUEST_STATE_PREFIX}${name}:${id}`;
}

async function enhancedSetState(env, userId, state) {
  await env.BOT_DATA.put(enhancedKey("user", userId), state);
}

async function enhancedGetState(env, userId) {
  return await env.BOT_DATA.get(enhancedKey("user", userId));
}

async function enhancedClearState(env, userId) {
  await env.BOT_DATA.delete(enhancedKey("user", userId));
}

async function enhancedUserProfile(env, userId) {
  const user = await getUser(env, userId);
  if (!Array.isArray(user.favorites)) user.favorites = [];
  if (!Array.isArray(user.history)) user.history = [];
  if (!Array.isArray(user.badges)) user.badges = [];
  if (!Array.isArray(user.warnings)) user.warnings = [];
  if (user.language === undefined) user.language = "fa";
  if (user.movies_received === undefined) user.movies_received = 0;
  if (user.ratings === undefined) user.ratings = 0;
  if (user.valid_invites === undefined) user.valid_invites = 0;
  if (user.level === undefined) user.level = 1;
  if (user.xp === undefined) user.xp = 0;
  if (user.notifications === undefined) user.notifications = true;
  return user;
}

async function enhancedSaveUser(env, user) {
  await saveUser(env, user);
  return user;
}

function enhancedCountryForUser(user) {
  if (user.country) return user.country;
  const code = String(user.telegram_language_code || "").toLowerCase();
  if (code === "fa") return "Iran";
  if (code === "fr") return "France";
  if (code === "de") return "Germany";
  if (code === "tr") return "Turkey";
  if (code === "ar") return "Arab World";
  return "Unknown";
}

function enhancedFlag(country) {
  return ({
    Iran: "🇮🇷", France: "🇫🇷", Germany: "🇩🇪", Turkey: "🇹🇷",
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", India: "🇮🇳",
    Japan: "🇯🇵", China: "🇨🇳", Russia: "🇷🇺", "Arab World": "🌍", Unknown: "🌍"
  })[country] || "🌍";
}

async function enhancedMovieInfo(env, movieId) {
  const ratings = await getJSON(env, `ratings:${movieId}`, []);
  const values = Array.isArray(ratings) ? ratings.map(Number).filter(Number.isFinite) : [];
  const votes = values.length;
  const average = votes ? values.reduce((a,b)=>a+b,0) / votes : 0;
  return { votes, average };
}

async function enhancedMovieCaption(env, movie, senderUser = null) {
  const info = await enhancedMovieInfo(env, movie.id);
  const country = movie.country || enhancedCountryForUser(senderUser || {});
  const code = movie.movie_code || `MOV-${String(movie.id).slice(0,8).toUpperCase()}`;
  const language = getLanguage(senderUser || {});
  const alreadyViewed = senderUser?.id ? Boolean(await env.BOT_DATA.get(`view:${movie.id}:${senderUser.id}`)) : true;
  const displayedViews = Number(movie.views || 0) + (!alreadyViewed && senderUser?.id ? 1 : 0);
  return (
    `${movie.caption || "🎬 Movie"}\n\n` +
    `👁 Views: ${displayedViews}\n` +
    `⭐ Rating: ${info.average.toFixed(1)}/5\n` +
    `👥 Votes: ${info.votes}\n` +
    `🌍 ${enhancedFlag(country)} ${country}\n` +
    `🧷 ${code}\n\n` +
    `${t(language, "movieWillDelete")}\n` +
    `📢 ${CHANNEL_LINK}`
  ).slice(0, 1024);
}

async function enhancedMovieKeyboard(user, movieId, rated = false) {
  const fav = Array.isArray(user.favorites) && user.favorites.map(String).includes(String(movieId));
  const rows = [
    [
      { text: fav ? "💔 Remove Favorite" : "❤️ Favorite", callback_data: `fx:fav:${fav ? "remove" : "add"}:${movieId}` },
      { text: "🔄 Again", callback_data: `fx:again:${movieId}` }
    ]
  ];
  if (!rated) {
    rows.push([
      { text: "⭐ 1", callback_data: `fx:rate:${movieId}:1` },
      { text: "⭐ 2", callback_data: `fx:rate:${movieId}:2` },
      { text: "⭐ 3", callback_data: `fx:rate:${movieId}:3` },
      { text: "⭐ 4", callback_data: `fx:rate:${movieId}:4` },
      { text: "⭐ 5", callback_data: `fx:rate:${movieId}:5` }
    ]);
  }
  return { inline_keyboard: rows };
}

async function enhancedHasRated(env, movieId, userId) {
  return Boolean(await env.BOT_DATA.get(`rating:${movieId}:${userId}`));
}

async function enhancedRecordUniqueView(env, movieId, userId) {
  const key = `view:${movieId}:${userId}`;
  if (await env.BOT_DATA.get(key)) return false;
  await env.BOT_DATA.put(key, String(now()));
  const movies = await getMovies(env);
  const index = movies.findIndex(m => String(m.id) === String(movieId));
  if (index !== -1) {
    movies[index].views = Number(movies[index].views || 0) + 1;
    await saveMovies(env, movies);
  }
  return true;
}

async function enhancedSendMovie(env, chatId, movie, user, ctx, extraMarkup = null) {
  if (!movie) return null;
  const rated = await enhancedHasRated(env, movie.id, user.id);
  const copy = { ...movie, caption: await enhancedMovieCaption(env, movie, user) };
  const markup = extraMarkup || await enhancedMovieKeyboard(user, movie.id, rated);
  const result = await sendMovie(env, chatId, copy, ctx, markup, user.id);
  if (result?.ok) {
    await enhancedRecordUniqueView(env, movie.id, user.id);
  }
  return result;
}

async function enhancedRecordHistory(env, user, movieId) {
  user.history = Array.isArray(user.history) ? user.history : [];
  const cutoff = now() - ENHANCED_HISTORY_TTL;
  user.history = user.history.filter(x => Number(x.at || 0) >= cutoff);
  user.history = user.history.filter(x => String(x.movie_id) !== String(movieId));
  user.history.unshift({ movie_id: String(movieId), at: now() });
  user.movies_received = Number(user.movies_received || 0) + 1;
  user.views = Number(user.views || 0) + 1;
  user.last_active = now();
  await enhancedSaveUser(env, user);
}

async function enhancedGrantXP(env, user, amount, reason = "") {
  user.xp = Number(user.xp || 0) + Number(amount || 0);
  const oldLevel = Number(user.level || 1);
  const newLevel = Math.max(1, Math.floor(user.xp / 100) + 1);
  user.level = newLevel;
  if (newLevel > oldLevel) {
    await enhancedNotify(env, user, `🆙 Level Up!\n\n🏆 Level ${newLevel}`);
  }
  if (reason) user.last_reward = reason;
  await enhancedSaveUser(env, user);
}

async function enhancedNotify(env, user, text, force = false) {
  if (force || user.notifications !== false) {
    await telegram(env, "sendMessage", { chat_id: user.id, text }).catch(()=>{});
  }
}

async function enhancedBadges(env, user) {
  user.badges = Array.isArray(user.badges) ? user.badges : [];
  const checks = [
    [Number(user.movies_received || 0) >= 1, "🎬 First Movie"],
    [Number(user.ratings || 0) >= 1, "⭐ First Vote"],
    [(user.favorites || []).length >= 1, "❤️ First Favorite"],
    [Number(user.valid_invites || 0) >= 1, "👥 First Invite"],
    [Number(user.movies_received || 0) >= 25, "🎬 Movie Hunter"],
    [Number(user.streak || 0) >= 7, "🔥 Active User"],
    [user.created_at && now() - Number(user.created_at) >= 30*24*60*60*1000, "🏆 Veteran"],
    [Number(user.level || 1) >= 10, "👑 Cinema Master"]
  ];
  for (const [ok, badge] of checks) {
    if (ok && !user.badges.includes(badge)) {
      user.badges.push(badge);
      await enhancedNotify(env, user, `🏆 Achievement Unlocked!\n\n${badge}`);
    }
  }
  await enhancedSaveUser(env, user);
}

async function enhancedGetMovie(env, chatId, user, ctx, mode = "random") {
  const member = await checkMembership(env, user.id);
  if (!member) { await sendMembershipMessage(env, chatId, getLanguage(user)); return; }
  const cooldownKey = `fx:cooldown:${user.id}`;
  const last = await env.BOT_DATA.get(cooldownKey);
  const unlimited = (await enhancedIsApprovedAdmin(env, user.id)) || user.no_cooldown === true || Number(user.valid_invites || 0) >= ENHANCED_REF_REWARD;
  if (!unlimited && last && now() - Number(last) < MOVIE_COOLDOWN) {
    const remain = Math.ceil((MOVIE_COOLDOWN - (now() - Number(last))) / 1000);
    await telegram(env, "sendMessage", { chat_id: chatId, text: `⏳ Please wait ${remain} seconds.` });
    return;
  }
  const movies = await getMovies(env);
  if (!movies.length) { await telegram(env, "sendMessage", { chat_id: chatId, text: t(getLanguage(user), "movieNotFound") }); return; }
  user.history = Array.isArray(user.history) ? user.history : [];
  const cutoff = now() - ENHANCED_HISTORY_TTL;
  user.history = user.history.filter(x => Number(x.at || 0) >= cutoff);
  const unseen = movies.filter(m => !user.history.some(x => String(x.movie_id) === String(m.id)));
  const pool = mode === "featured" ? movies.filter(m=>m.featured) : (unseen.length ? unseen : movies);
  const actualPool = pool.length ? pool : movies;
  const movie = actualPool[Math.floor(Math.random()*actualPool.length)];
  if (!unlimited) await env.BOT_DATA.put(cooldownKey, String(now()), { expirationTtl: 30 });
  const result = await enhancedSendMovie(env, chatId, movie, user, ctx);
  if (result?.ok) {
    await enhancedRecordHistory(env, user, movie.id);
    await enhancedGrantXP(env, user, 5, "movie_view");
    user.streak = Number(user.streak || 0) + 1;
    await enhancedBadges(env, user);
  }
}
async function addFavorite(env, user, movieId) {
  user.favorites = Array.isArray(user.favorites) ? user.favorites : [];
  if (!user.favorites.map(String).includes(String(movieId))) {
    user.favorites.push(String(movieId));
    await enhancedSaveUser(env, user);
  }
}

async function removeFavorite(env, user, movieId) {
  user.favorites = (Array.isArray(user.favorites) ? user.favorites : []).filter(id => String(id) !== String(movieId));
  await enhancedSaveUser(env, user);
}

async function enhancedShowFavorites(env, chatId, user) {
  const ids = Array.isArray(user.favorites) ? user.favorites : [];
  const movies = await getMovies(env);
  const list = ids.map(id => movies.find(m => String(m.id) === String(id))).filter(Boolean);
  const language = getLanguage(user);
  if (!list.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: language === "fa" ? "❤️ مورد علاقه‌ای ثبت نشده است." : "❤️ Favorites is empty." });
    return;
  }
  const rows = list.slice(0, 50).map((m, i) => [{
    text: `🎬 ${language === "fa" ? "فیلم" : "Movie"} ${i + 1}`,
    callback_data: `fx:favview:${m.id}`
  }]);
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${t(language, "favorites")}\\n\\n${language === "fa" ? "یکی از شماره‌ها را انتخاب کنید:" : "Choose a movie number:"}`,
    reply_markup: { inline_keyboard: rows }
  });
}

async function enhancedShowHistory(env, chatId, user) {
  const movies = await getMovies(env);
  const cutoff = now() - ENHANCED_HISTORY_TTL;
  user.history = (Array.isArray(user.history) ? user.history : []).filter(x => Number(x.at || 0) >= cutoff);
  await enhancedSaveUser(env, user);
  const list = user.history.map(x => movies.find(m => String(m.id) === String(x.movie_id))).filter(Boolean);
  const language = getLanguage(user);
  if (!list.length) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: language === "fa" ? "🕐 در ۲۴ ساعت گذشته فیلمی مشاهده نشده است." : "🕐 No movie in the last 24 hours." });
    return;
  }
  const rows = list.slice(0, 50).map((m, i) => [{
    text: `🎬 ${language === "fa" ? "فیلم" : "Movie"} ${i + 1}`,
    callback_data: `fx:historyview:${m.id}`
  }]);
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: `${t(language, "history24")}\\n\\n${language === "fa" ? "یکی از شماره‌ها را انتخاب کنید:" : "Choose a movie number:"}`,
    reply_markup: { inline_keyboard: rows }
  });
}

async function enhancedShowProfile(env, chatId, user) {
  const country = enhancedCountryForUser(user);
  const text =
    `👤 Profile\n\n` +
    `👤 Name: ${user.first_name || user.username || "-"}\n` +
    `🆔 User ID: ${user.id}\n` +
    `🌐 Language: ${getLanguage(user)}\n` +
    `🌍 Country: ${enhancedFlag(country)} ${country}\n` +
    `📅 Joined: ${user.created_at ? new Date(user.created_at).toLocaleDateString("en-GB") : "-"}\n` +
    `🎬 Movies received: ${user.movies_received || 0}\n` +
    `👁 Views: ${user.views || 0}\n` +
    `⭐ Votes: ${user.ratings || 0}\n` +
    `❤️ Favorites: ${(user.favorites||[]).length}\n` +
    `👥 Valid Invites: ${user.valid_invites || 0}\n` +
    `🏆 Badges: ${(user.badges||[]).join(", ") || "-"}\n` +
    `🎁 XP: ${user.xp || 0}\n` +
    `🆙 Level: ${user.level || 1}`;
  await telegram(env,"sendMessage",{chat_id:chatId,text,reply_markup:{inline_keyboard:[
    [{text:user.notifications === false ? "🔔 Notifications On":"🔕 Notifications Off",callback_data:"fx:notifications"}],
    [{text:"🎁 Reward",callback_data:"fx:reward"}]
  ]}});
}

async function enhancedShowInvite(env, chatId, user) {
  const me = await telegram(env, "getMe", {});
  const username = me?.ok && me.result?.username ? me.result.username : "SuperManFilmBot";
  const link = `https://t.me/${username}?start=ref_${user.id}`;
  const lang = getLanguage(user);
  const text = lang === "fa"
    ? `👥 دعوت دوستان\n\n🔗 ${link}\n\n✅ دعوت‌های موفق: ${user.valid_invites || 0}`
    : `👥 Invite Friends\n\n🔗 ${link}\n\n✅ Successful invites: ${user.valid_invites || 0}`;
  await telegram(env, "sendMessage", { chat_id: chatId, text });
}

async function enhancedRegisterReferral(env, newUser, parameter = "") {
  if (parameter && String(parameter).startsWith("ref_")) {
    const inviterId = String(parameter).slice(4);
    if (inviterId && inviterId !== String(newUser.id) && !newUser.referrer_id && !newUser.referral_credited) {
      const inviter = await getUser(env, inviterId);
      if (inviter && !inviter.blocked) {
        newUser.referrer_id = inviterId;
        await saveUser(env, newUser);
      }
    }
  }

  if (!newUser.joined || !newUser.referrer_id || newUser.referral_credited) return;

  const creditKey = `fx:refcredited:${newUser.id}`;
  if (await env.BOT_DATA.get(creditKey)) {
    newUser.referral_credited = true;
    await saveUser(env, newUser);
    return;
  }

  const inviterId = String(newUser.referrer_id);
  if (inviterId === String(newUser.id)) return;
  const inviter = await getUser(env, inviterId);
  if (!inviter || inviter.blocked) return;

  inviter.valid_invites = Number(inviter.valid_invites || 0) + 1;
  if (inviter.valid_invites >= ENHANCED_REF_REWARD) inviter.no_cooldown = true;
  await saveUser(env, inviter);

  await env.BOT_DATA.put(creditKey, inviterId);
  newUser.referral_credited = true;
  await saveUser(env, newUser);
  await enhancedGrantXP(env, inviter, 20, "referral");
  await enhancedBadges(env, inviter);
  await enhancedNotify(env, inviter, `🎁 ${getLanguage(inviter) === "fa" ? "دعوت موفق ثبت شد!" : "Valid referral added!"}\\n\\n👥 ${inviter.valid_invites}`);
}

async function enhancedShowTrending(env, chatId) {
  const movies = await getMovies(env);
  const scored = [];
  for (const movie of movies) {
    const info = await enhancedMovieInfo(env,movie.id);
    const score = Number(movie.views||0) + info.average*5 + info.votes*2 + Number(movie.favorites||0)*3;
    scored.push({movie,score,info});
  }
  scored.sort((a,b)=>b.score-a.score);
  const top = scored.slice(0,10);
  let text = "🔥 Trending\n\n";
  top.forEach((x,i)=>{ text += `${i+1}. 🎬 ${x.movie.caption||"Movie"}\n   👁 ${x.movie.views||0} ⭐ ${x.info.average.toFixed(1)} 👥 ${x.info.votes}\n\n`; });
  await telegram(env,"sendMessage",{chat_id:chatId,text:text || "📭 No data yet."});
}

async function enhancedShowLeaderboard(env, chatId) {
  const users = await getAllUsers(env);
  users.sort((a,b)=>Number(b.xp||0)-Number(a.xp||0));
  let text="🏆 Leaderboard\n\n";
  users.slice(0,10).forEach((u,i)=>{text += `${i+1}. ${u.first_name||u.username||u.id} — 🆙 ${u.level||1} / ${u.xp||0} XP\n`;});
  await telegram(env,"sendMessage",{chat_id:chatId,text:text||"📭 No data yet."});
}

async function enhancedCreateRequest(env, user, text) {
  const name = String(text||"").trim();
  if (!name) return null;
  const list = await getJSON(env,"fx:requests",[]);
  let item = list.find(x=>String(x.name).toLowerCase()===name.toLowerCase() && x.status!=="rejected");
  if (!item) { item={id:randomId(),name,votes:1,voters:[String(user.id)],user_id:String(user.id),status:"pending",created_at:now()}; list.push(item); }
  else if (!(item.voters||[]).map(String).includes(String(user.id))) { item.voters.push(String(user.id)); item.votes=Number(item.votes||0)+1; }
  await putJSON(env,"fx:requests",list);
  return item;
}

async function enhancedRequestList(env, chatId) {
  const list=(await getJSON(env,"fx:requests",[])).filter(x=>x.status==="pending").sort((a,b)=>Number(b.votes||0)-Number(a.votes||0)).slice(0,20);
  const rows=list.map(x=>[{text:`🎬 ${x.name} — 🔥 ${x.votes||0}`,callback_data:`fx:reqvote:${x.id}`}]);
  await telegram(env,"sendMessage",{chat_id:chatId,text:"🎬 Movie Requests",reply_markup:{inline_keyboard:rows}});
}

async function enhancedReport(env, callback, movieId, reason) {
  const report={id:randomId(),movie_id:String(movieId),user_id:String(callback.from.id),reason,created_at:now(),status:"open"};
  await putJSON(env,`report:${report.id}`,report);
  const admin=getAdminId(env);
  if(admin) await telegram(env,"sendMessage",{chat_id:admin,text:`🚫 Movie Report\n\n🎬 ${movieId}\n👤 ${callback.from.id}\n⚠️ ${reason}`}).catch(()=>{});
  await telegram(env,"answerCallbackQuery",{callback_query_id:callback.id,text:"✅ Report received."});
}

async function enhancedProcessState(env, message, ctx, user) {
  const state = await enhancedGetState(env,user.id);
  if (!state || !message.text) return false;
  if (state === "request") {
    await enhancedClearState(env,user.id);
    const item = await enhancedCreateRequest(env,user,message.text);
    await telegram(env,"sendMessage",{chat_id:message.chat.id,text:item?"✅ Movie request saved.":"❌ Invalid request."});
    const admin=getAdminId(env);
    if(admin&&item) await telegram(env,"sendMessage",{chat_id:admin,text:`🎬 New request\n\n${item.name}\n🔥 Votes: ${item.votes}\n👤 ${user.id}`}).catch(()=>{});
    return true;
  }
  return false;
}

async function enhancedApprovedAdmins(env) {
  return await getJSON(env, "admin:approved", []);
}

async function enhancedIsApprovedAdmin(env, userId) {
  if (isAdmin(env, userId)) return true;
  const admins = await enhancedApprovedAdmins(env);
  return admins.map(String).includes(String(userId));
}

async function enhancedProcessAdminRequest(env, callback, action, targetId) {
  if (!isAdmin(env, callback.from.id)) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⛔ فقط مدیر اصلی اجازه این کار را دارد.", show_alert: true });
    return;
  }

  const requests = await getJSON(env, "admin:requests", []);
  const item = requests.find(x => String(x.user_id) === String(targetId) && x.status === "pending");
  if (!item) {
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ درخواست پیدا نشد.", show_alert: true });
    return;
  }

  item.status = action === "approve" ? "approved" : "rejected";
  item.decided_at = now();
  item.decided_by = String(callback.from.id);
  await putJSON(env, "admin:requests", requests);

  if (action === "approve") {
    const admins = await enhancedApprovedAdmins(env);
    if (!admins.map(String).includes(String(targetId))) {
      admins.push(String(targetId));
      await putJSON(env, "admin:approved", admins);
    }
  }

  const target = await getUser(env, targetId);
  const lang = getLanguage(target);
  await telegram(env, "sendMessage", {
    chat_id: targetId,
    text: action === "approve" ? t(lang, "adminApproved") : t(lang, "adminRejected")
  }).catch(() => {});

  await logActionExtendedSafe(env, callback.from.id, `admin_request_${action}`, { user_id: String(targetId) });
  await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: action === "approve" ? "✅ Approved" : "❌ Rejected" });

  await telegram(env, "editMessageReplyMarkup", {
    chat_id: callback.message.chat.id,
    message_id: callback.message.message_id,
    reply_markup: { inline_keyboard: [[{ text: action === "approve" ? "✅ تأیید شد" : "❌ رد شد", callback_data: "noop" }]] }
  }).catch(() => {});
}

async function enhancedShowAdminRequestProfile(env, chatId, userId, language = "fa") {
  const user = await getUser(env, userId);
  const text = `${t(language, "userDetails")}\\n\\n` +
    `👤 ${user.first_name || "-"} ${user.last_name || ""}`.trim() + `\\n` +
    `🔹 Username: ${user.username ? "@" + user.username : "-"}\\n` +
    `🆔 User ID: ${user.id}\\n` +
    `🌐 Language: ${getLanguage(user)}\\n` +
    `📅 Joined: ${user.created_at ? new Date(user.created_at).toISOString().slice(0,10) : "-"}\\n` +
    `🔗 Referral: ${user.referrer_id || "-"}`;
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: { inline_keyboard: [[
      { text: t(language, "adminApprove"), callback_data: `fx:adminreq:approve:${user.id}` },
      { text: t(language, "adminReject"), callback_data: `fx:adminreq:reject:${user.id}` }
    ]] }
  });
}

async function enhancedCreateBackup(env) {
  const payload = {
    created_at: now(),
    users: await getAllUsers(env),
    movies: await getMovies(env),
    pending: await getJSON(env, "pending_movies", []),
    requests: await getJSON(env, "fx:requests", []),
    admin_requests: await getJSON(env, "admin:requests", []),
    approved_admins: await getJSON(env, "admin:approved", [])
  };

  const key = `backup:${new Date().toISOString()}`;
  await putJSON(env, key, payload);
  await env.BOT_DATA.put("backup:last", key);
  return key;
}

async function enhancedHealth(env) {
  const result = { bot: Boolean(env.BOT_TOKEN), database: false, storage: false, webhook: true, backup: false };
  try {
    await env.BOT_DATA.get("health:test");
    result.database = true;
    result.storage = true;
    result.backup = Boolean(await env.BOT_DATA.get("backup:last"));
  } catch {}
  return result;
}

async function enhancedShowUsers(env, chatId, page = 0, messageId = null) {
  const users = await getAllUsers(env);
  const size = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / size));
  page = Math.max(0, Math.min(Number(page) || 0, totalPages - 1));
  const start = page * size;
  const pageUsers = users.slice(start, start + size);
  const rows = pageUsers.map((u, i) => [{
    text: `👤 ${start + i + 1}. ${String(u.first_name || u.username || u.id).slice(0, 35)}`,
    callback_data: `fx:userprofile:${u.id}:${page}`
  }]);
  const nav = [];
  if (page > 0) nav.push({ text: "⬅️", callback_data: `fx:userlist:${page - 1}` });
  nav.push({ text: `${page + 1}/${totalPages}`, callback_data: `fx:userlist:${page}` });
  if (page < totalPages - 1) nav.push({ text: "➡️", callback_data: `fx:userlist:${page + 1}` });
  rows.push(nav);
  rows.push([{ text: "🔙 بازگشت", callback_data: "fx:admin_back" }]);
  const text = users.length ? `👥 لیست کاربران\\n\\n${page + 1} / ${totalPages}` : "📭 کاربری ثبت نشده است.";
  const data = { chat_id: chatId, text, reply_markup: { inline_keyboard: rows } };
  if (messageId) {
    data.message_id = messageId;
    const r = await telegram(env, "editMessageText", data);
    if (r.ok) return;
  }
  await telegram(env, "sendMessage", data);
}

async function enhancedShowUserProfile(env, chatId, userId, page = 0) {
  const user = await getUser(env, userId);
  const country = enhancedCountryForUser(user);
  const language = getLanguage(user);
  const text = `${t(language, "userDetails")}\\n\\n` +
    `👤 Name: ${user.first_name || "-"}\\n` +
    `🔹 Username: ${user.username ? "@" + user.username : "-"}\\n` +
    `🆔 User ID: ${user.id}\\n` +
    `🌐 Language: ${language}\\n` +
    `🌍 ${enhancedFlag(country)} ${country}\\n` +
    `📅 Created: ${user.created_at ? new Date(user.created_at).toISOString().slice(0,10) : "-"}\\n` +
         `🎬 Movies received: ${user.movies_received || 0}\\n` +
    `👁 Unique views: ${user.views || 0}\\n` +
    `⭐ Ratings: ${user.ratings || 0}\\n` +
    `❤️ Favorites: ${(user.favorites || []).length}\\n` +
    `👥 Successful invites: ${user.valid_invites || 0}\\n` +
    `🚫 Blocked: ${user.blocked ? "Yes" : "No"}`;
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: { inline_keyboard: [
      [{ text: "🔙 لیست کاربران", callback_data: `fx:userlist:${page}` }]
    ] }
  });
}

async function enhancedAdminPanel(env, chatId, userId) {
  if (!(await enhancedIsApprovedAdmin(env, userId) || await isTeamMemberSafe(env, userId))) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: "⛔ Access denied." });
    return;
  }
  const s = await getStatisticsSafe(env);
  const lang = getLanguage(await getUser(env, userId));
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: lang === "fa" ? `👑 پنل مدیریت\\n\\n👥 کاربران: ${s.users}\\n🎬 فیلم‌ها: ${s.movies}\\n👁 بازدیدهای یکتا: ${s.views}\\n⭐ امتیازها: ${s.ratings}\\n📥 در انتظار تأیید: ${s.pending}` : `👑 Admin Panel\\n\\n👥 Users: ${s.users}\\n🎬 Movies: ${s.movies}\\n👁 Unique views: ${s.views}\\n⭐ Ratings: ${s.ratings}\\n📥 Pending: ${s.pending}`,
    reply_markup: { inline_keyboard: [
      [{ text: lang === "fa" ? "🎬 لیست فیلم‌ها" : "🎬 Movie List", callback_data: "fx:admin_movies" }],
      [{ text: lang === "fa" ? "👥 لیست کاربران" : "👥 User List", callback_data: "fx:admin_users" }],
      [{ text: lang === "fa" ? "📥 فیلم‌های در انتظار تأیید" : "📥 Pending Movies", callback_data: "fx:admin_pending" }],
      [{ text: lang === "fa" ? "📊 آمار" : "📊 Statistics", callback_data: "fx:admin_stats" }],
      [{ text: lang === "fa" ? "📢 اطلاعیه" : "📢 Announcement", callback_data: "fx:admin_announce" }],
      [{ text: lang === "fa" ? "💾 پشتیبان" : "💾 Backup", callback_data: "fx:admin_backup" }, { text: lang === "fa" ? "🏥 سلامت" : "🏥 Health", callback_data: "fx:admin_health" }],
      [{ text: lang === "fa" ? "🔙 بازگشت" : "🔙 Back", callback_data: "fx:back" }]
    ] }
  });
}

async function isTeamMemberSafe(env,userId){
  if(isAdmin(env,userId)) return true;
  const admins=await getJSON(env,"admin:approved",[]);
  const team=await getJSON(env,"team:members",[]);
  return [...admins,...team].map(String).includes(String(userId));
}

async function logActionExtendedSafe(env,actor,action,details){
  await putJSON(env,`log:${now()}:${randomId()}`,{at:now(),actor:String(actor),action,details});
}

async function getStatisticsSafe(env){
  const users=await getAllUsers(env);
  const movies=await getMovies(env);
  const pending=await getJSON(env,"pending_movies",[]);
  let views=0,ratings=0,favorites=0;
  for(const m of movies){ views += Number(m.views||0); const info=await enhancedMovieInfo(env,m.id); ratings+=info.votes; favorites+=Number(m.favorites||0); }
  const active=users.filter(u=>now()-Number(u.last_active||u.created_at||0)<86400000).length;
  const invites=users.reduce((a,u)=>a+Number(u.valid_invites||0),0);
  return {users:users.length,movies:movies.length,pending:pending.length,views,ratings,favorites,active,invites};
}

async function enhancedHandleMessage(env, message, ctx) {
  if (!message.from) return;
  const user = await enhancedUserProfile(env, message.from.id);
  if (message.from.username) user.username = message.from.username;
  if (message.from.first_name) user.first_name = message.from.first_name;
  if (message.from.last_name) user.last_name = message.from.last_name;
  if (message.from.language_code) user.telegram_language_code = message.from.language_code;
  user.last_active = now();
  await enhancedSaveUser(env, user);

  const chatId = message.chat.id;
  if (user.blocked) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: getLanguage(user) === "fa" ? "🚫 دسترسی شما مسدود شده است." : "🚫 Access denied." });
    return;
  }

  if (message.text && (message.text === "/start" || message.text.startsWith("/start "))) {
    const param = message.text.split(" ")[1] || "";
    await enhancedRegisterReferral(env, user, param);
    if (!user.language_selected) {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: "زبان خود را انتخاب کنید / Choose your language",
        reply_markup: { inline_keyboard: [[
          { text: "🇮🇷 فارسی", callback_data: "lang:fa" },
          { text: "🇬🇧 English", callback_data: "lang:en" }
        ]] }
      });
      return;
    }
    const member = await checkMembership(env, user.id);
    if (!member) { await sendMembershipMessage(env, chatId, getLanguage(user)); return; }
    user.joined = true;
    await enhancedSaveUser(env, user);
    await enhancedRegisterReferral(env, user);
    await sendMainMenu(env, chatId, user);
    return;
  }

  const lang = getLanguage(user);

  // Main menu open/close. Telegram reply keyboards require a bot message to change the keyboard.
  if (message.text === t(lang, "menuButton")) {
    await telegram(env, "sendMessage", { chat_id: chatId, text: "\u200b", reply_markup: mainKeyboard(lang, await enhancedIsApprovedAdmin(env, user.id)) });
    return;
  }
  if (message.text === t(lang, "closeMenu")) {
    await sendMainMenu(env, chatId, user);
    return;
  }

  // Admin request: the user simply sends Admin.
  if (message.text && message.text.trim().toLowerCase() === "admin") {
    const existing = await getJSON(env, "admin:requests", []);
    const pending = existing.find(x => String(x.user_id) === String(user.id) && x.status === "pending");
    if (await enhancedIsApprovedAdmin(env, user.id)) {
      await enhancedAdminPanel(env, chatId, user.id);
      return;
    }
    if (!pending) {
      const item = {
        id: randomId(),
        user_id: String(user.id),
        status: "pending",
        created_at: now(),
        name: user.first_name || "-",
        username: user.username || "",
        language: lang
      };
      existing.push(item);
      await putJSON(env, "admin:requests", existing);
      const adminId = getAdminId(env);
      if (adminId) {
        const profileText = `🔐 ${t("fa", "adminRequest")}\\n\\n👤 نام: ${user.first_name || "-"}\\n🔹 Username: ${user.username ? "@" + user.username : "-"}\\n🆔 آیدی: ${user.id}\\n🌐 زبان: ${lang}\\n📅 ثبت‌نام: ${user.created_at ? new Date(user.created_at).toISOString().slice(0,10) : "-"}`;
        await telegram(env, "sendMessage", {
          chat_id: adminId,
          text: profileText,
          reply_markup: { inline_keyboard: [
            [{ text: "👤 مشاهده پروفایل", callback_data: `fx:adminreqprofile:${user.id}` }],
            [{ text: "✅ تأیید", callback_data: `fx:adminreq:approve:${user.id}` }, { text: "❌ رد", callback_data: `fx:adminreq:reject:${user.id}` }]
          ] }
        });
      }
    }
    await telegram(env, "sendMessage", { chat_id: chatId, text: t(lang, "adminRequestSent") });
    return;
  }

  if (await enhancedProcessState(env, message, ctx, user)) return;

  if (message.video || message.document) {
    await handleIncomingMovie(env, message);
    return;
  }

  if (!message.text) return;
  const txt = message.text;

  if (txt === t(lang, "getMovie") || txt === "🎬 دریافت فیلم" || txt === "📥 دریافت فیلم") { await enhancedGetMovie(env, chatId, user, ctx); return; }
  if (txt === t(lang, "sendMovie") || txt === "📤 ارسال فیلم") { await enhancedSetState(env, user.id, "submit"); await telegram(env, "sendMessage", { chat_id: chatId, text: lang === "fa" ? "🎬 فیلم خود را ارسال کنید." : "🎬 Send your movie here." }); return; }
  if (txt === t(lang, "requestMovie") || txt === "📝 درخواست فیلم" || txt === "🎬 Request Movie") { await enhancedSetState(env, user.id, "request"); await telegram(env, "sendMessage", { chat_id: chatId, text: t(lang, "requestPrompt") }); return; }
  if (txt === t(lang, "favorites") || txt === "❤️ فیلم‌های موردعلاقه" || txt === "❤️ Favorites") { await enhancedShowFavorites(env, chatId, user); return; }
  if (txt === t(lang, "history24") || txt === "📜 تاریخچه فیلم های مشاهده شده" || txt === "🕐 تاریخچه ۲۴ ساعت") { await enhancedShowHistory(env, chatId, user); return; }
  if (txt === t(lang, "inviteFriends") || txt === "👥 دعوت از دوستان" || txt === "👥 Invite Friends") { await enhancedShowInvite(env, chatId, user); return; }
  if (txt === t(lang, "language") || txt === "🌐 تغییر زبان") { await telegram(env, "sendMessage", { chat_id: chatId, text: "زبان خود را انتخاب کنید / Choose your language", reply_markup: { inline_keyboard: [[{ text: "🇮🇷 فارسی", callback_data: "lang:fa" }, { text: "🇬🇧 English", callback_data: "lang:en" }]] } }); return; }
  if (txt === t(lang, "adminPanel") || txt === "👑 پنل مدیریت" || txt === "⚙️ پنل مدیریت") { await enhancedAdminPanel(env, chatId, user.id); return; }
}

async function enhancedHandleCallback(env, callback, ctx) {
  const data = callback.data || "";
  try {
    if (data.startsWith("lang:")) { await handleLanguageCallback(env, callback); return; }
    if (data === "check_membership") { await handleCallback(env, callback, ctx); return; }
    const uid = String(callback.from.id);
    const user = await enhancedUserProfile(env, uid);

    if (data.startsWith("fx:rate:")) { const p = data.split(":"); await handleRating(env, callback, p[2], Number(p[3])); return; }
    if (data.startsWith("fx:fav:")) {
      const p = data.split(":"); const id = p[3];
      if (p[2] === "add") await addFavorite(env, user, id); else await removeFavorite(env, user, id);
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: p[2] === "add" ? "❤️ Added." : "💔 Removed." });
      return;
    }
    if (data.startsWith("fx:favview:")) { const movie = await findMovie(env, data.split(":")[2]); if (movie) { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await enhancedSendMovie(env, callback.message.chat.id, movie, user, ctx); } return; }
    if (data === "fx:history") { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await enhancedShowHistory(env, callback.message.chat.id, user); return; }
    if (data.startsWith("fx:historyview:")) { const movie = await findMovie(env, data.split(":")[2]); if (movie) { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await enhancedSendMovie(env, callback.message.chat.id, movie, user, ctx); } return; }
    if (data.startsWith("fx:again:")) { const movie = await findMovie(env, data.split(":")[2]); if (movie) { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await enhancedSendMovie(env, callback.message.chat.id, movie, user, ctx); } else { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ فیلم پیدا نشد.", show_alert: true }); } return; }

    if (data === "fx:admin_users") {
      if (!(await enhancedIsApprovedAdmin(env, uid))) { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "⛔ دسترسی ندارید.", show_alert: true }); return; }
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
      await enhancedShowUsers(env, callback.message.chat.id, 0);
      return;
    }
    if (data.startsWith("fx:userlist:")) {
      if (!(await enhancedIsApprovedAdmin(env, uid))) return;
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
      await enhancedShowUsers(env, callback.message.chat.id, Number(data.split(":")[2]) || 0);
      return;
    }
    if (data.startsWith("fx:userprofile:")) {
      if (!(await enhancedIsApprovedAdmin(env, uid))) return;
      const p = data.split(":");
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
      await enhancedShowUserProfile(env, callback.message.chat.id, p[2], Number(p[3]) || 0);
      return;
    }
    if (data === "fx:admin_back") { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await enhancedAdminPanel(env, callback.message.chat.id, uid); return; }
    if (data.startsWith("fx:adminreqprofile:")) {
      if (!isAdmin(env, uid)) return;
      await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
      await enhancedShowAdminRequestProfile(env, callback.message.chat.id, data.split(":")[2], "fa");
      return;
    }
    if (data.startsWith("fx:adminreq:")) { const p = data.split(":"); await enhancedProcessAdminRequest(env, callback, p[2], p[3]); return; }
    if (data === "fx:admin_stats") { await showStatistics(env, callback.message.chat.id, true); return; }
    if (data === "fx:admin_pending") { await sendPendingList(env, callback.message.chat.id); return; }
    if (data === "fx:admin_movies") { await showMoviesList(env, callback.message.chat.id, 0); return; }
    if (data === "fx:admin_announce") { await setAdminState(env, uid, "announcement"); await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await telegram(env, "sendMessage", { chat_id: callback.message.chat.id, text: "📢 متن اطلاعیه را ارسال کنید." }); return; }
    if (data === "fx:back") { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id }); await sendMainMenu(env, callback.message.chat.id, user); return; }
    if (data.startsWith("fx:report:")) { await enhancedReport(env, callback, data.split(":")[2], data.split(":")[3] || "other"); return; }

    await handleCallback(env, callback, ctx);
  } catch (error) {
    console.error("Enhanced callback error:", error);
    try { await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "❌ Error.", show_alert: true }); } catch {}
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
    await enhancedHandleMessage(
      env,
      update.message,
      ctx
    );
  }

  if (update.callback_query) {
    await enhancedHandleCallback(
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
  async fetch(
    request,
    env,
    ctx
  ) {
    try {
      if (
        request.method ===
        "GET"
      ) {
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

      if (
        request.method !==
        "POST"
      ) {
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

      return new Response(
        "OK"
      );
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
