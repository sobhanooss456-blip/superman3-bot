/* =========================================================
   SUPERMAN3 BOT
   Telegram Movie Bot - Cloudflare Workers + KV
   PART 1 / 10
   ========================================================= */

const CONFIG = {
  cooldown: 10000,
  deleteAfter: 10000,
  historyHours: 24,
  maxHistory: 50,
  maxFavorites: 100,
  pageSize: 10,
  channel: "@Super_Pump2",
  channelLink: "https://t.me/Super_Pump2"
};

/* =========================================================
   Telegram API
   ========================================================= */

async function tg(env, method, data = {}) {
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
   Basic Helpers
   ========================================================= */

function reply(data) {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

function uid(value) {
  return String(value || "");
}

function timestamp() {
  return Date.now();
}

function randomId(prefix = "id") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

function adminId(env) {
  return uid(env.ADMIN_ID);
}

function isAdminUser(env, userId) {
  return uid(userId) === adminId(env);
}

function isTeamUser(env, userId) {
  const list = String(env.TEAM_IDS || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);

  return (
    isAdminUser(env, userId) ||
    list.includes(uid(userId))
  );
}

/* =========================================================
   KV Helpers
   ========================================================= */

async function kvGet(env, key, fallback = null) {
  if (!env.BOT_DATA) {
    throw new Error("BOT_DATA KV binding is missing");
  }

  const value = await env.BOT_DATA.get(key);

  if (value === null) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function kvPut(env, key, value) {
  if (!env.BOT_DATA) {
    throw new Error("BOT_DATA KV binding is missing");
  }

  await env.BOT_DATA.put(
    key,
    JSON.stringify(value)
  );
}

async function kvDelete(env, key) {
  if (!env.BOT_DATA) {
    throw new Error("BOT_DATA KV binding is missing");
  }

  await env.BOT_DATA.delete(key);
}

/* =========================================================
   User Storage
   ========================================================= */

function userKey(id) {
  return `user:${uid(id)}`;
}

async function getUser(env, id) {
  return await kvGet(
    env,
    userKey(id),
    null
  );
}

async function saveUser(env, user) {
  await kvPut(
    env,
    userKey(user.id),
    user
  );
}

function createUser(tgUser) {
  return {
    id: uid(tgUser.id),
    username: tgUser.username || "",
    firstName: tgUser.first_name || "",
    lastName: tgUser.last_name || "",

    language: "en",
    languageSelected: false,
    membershipChecked: false,

    country: "",
    joinedAt: timestamp(),

    views: 0,
    ratings: 0,

    favorites: [],
    history: [],

    invites: [],
    validInvites: 0,

    badges: [],
    rewards: [],

    level: 1,
    xp: 0,
    streak: 0,
    lastActive: 0,

    cooldownUntil: 0,
    banned: false,
    warnings: 0,

    notifications: {
      movie: true,
      trending: true,
      reward: true,
      achievement: true,
      levelup: true,
      announcement: true
    },

    state: null,
    stateData: null,

    adminRequest: false
  };
}

async function ensureUser(env, tgUser) {
  const id = uid(tgUser.id);

  let user = await getUser(env, id);

  if (!user) {
    user = createUser(tgUser);
    await saveUser(env, user);
  } else {
    user.username = tgUser.username || user.username;
    user.firstName = tgUser.first_name || user.firstName;
    user.lastName = tgUser.last_name || user.lastName;
    await saveUser(env, user);
  }

  return user;
}
/* =========================================================
   PART 2 / 10
   Languages + Keyboard
   ========================================================= */

const LANG = {
  en: {
    choose: "🌐 Please choose your language:",
    fa: "🇮🇷 فارسی",
    en: "🇬🇧 English",

    join:
      "🔐 To use the bot, you must join our channel first.",

    joinButton: "📢 Join Channel",
    check: "✅ Check Membership",

    notMember:
      "❌ You are not a member yet.\n\nJoin the channel and press Check Membership.",

    verified:
      "✅ Membership verified!",

    welcome:
      "👋 Welcome to the movie bot!",

    get: "📥 Get Movie",
    submit: "📤 Submit Movie",
    invite: "👥 Invite Friends",
    favorites: "❤️ Favorites",
    history: "📜 History",
    trending: "🔥 Trending",
    request: "🎬 Request Movie",
    leaderboard: "🏆 Leaderboard",
    profile: "👤 Profile",
    language: "🌐 Change Language",

    noMovies:
      "📭 There are no available movies right now.",

    cooldown:
      "⏳ Please wait before requesting another movie.",

    sendMovie:
      "🎬 Send your movie here.\n\n🛡️ Your movie will be reviewed by our team.",

    movieReceived:
      "✅ Your movie was received and sent to the review queue.",

    requestMovie:
      "🎬 Send the name of the movie you want.",

    requestReceived:
      "✅ Your movie request has been added to the team queue.",

    rating:
      "⭐ Rate this movie from 1 to 5:",

    rated:
      "⭐ Your rating has been saved.",

    alreadyRated:
      "⚠️ You already rated this movie.",

    favoriteAdded:
      "❤️ Added to Favorites.",

    favoriteRemoved:
      "💔 Removed from Favorites.",

    emptyFavorites:
      "❤️ Your Favorites list is empty.",

    emptyHistory:
      "📜 Your history is empty.",

    report:
      "🚫 Choose the problem:",

    reported:
      "✅ Your report was sent to the team.",

    profileTitle:
      "👤 Profile",

    adminRequest:
      "🔐 Send your admin password.",

    adminPending:
      "⏳ Your admin request was sent to the manager.",

    accessDenied:
      "⛔ Access denied.",

    banned:
      "🚫 Your account is currently restricted."
  },

  fa: {
    choose: "🌐 زبان خود را انتخاب کنید:",
    fa: "🇮🇷 فارسی",
    en: "🇬🇧 English",

    join:
      "🔐 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",

    joinButton: "📢 عضویت در کانال",
    check: "✅ بررسی عضویت",

    notMember:
      "❌ هنوز عضو کانال نشده‌اید.\n\nابتدا عضو کانال شوید و سپس بررسی عضویت را بزنید.",

    verified:
      "✅ عضویت شما تأیید شد!",

    welcome:
      "👋 به ربات فیلم خوش آمدید!",

    get: "📥 دریافت فیلم",
    submit: "📤 ارسال فیلم",
    invite: "👥 دعوت از دوستان",
    favorites: "❤️ علاقه‌مندی‌ها",
    history: "📜 تاریخچه",
    trending: "🔥 ترندینگ",
    request: "🎬 درخواست فیلم",
    leaderboard: "🏆 لیدربورد",
    profile: "👤 پروفایل",
    language: "🌐 تغییر زبان",

    noMovies:
      "📭 در حال حاضر فیلم قابل دریافت وجود ندارد.",

    cooldown:
      "⏳ لطفاً کمی صبر کنید و دوباره تلاش کنید.",

    sendMovie:
      "🎬 فیلم خود را ارسال کنید.\n\n🛡️ فیلم شما توسط تیم بررسی خواهد شد.",

    movieReceived:
      "✅ فیلم شما دریافت شد و وارد صف بررسی شد.",

    requestMovie:
      "🎬 نام فیلم موردنظر خود را ارسال کنید.",

    requestReceived:
      "✅ درخواست فیلم شما در صف تیم قرار گرفت.",

    rating:
      "⭐ امتیاز فیلم را از ۱ تا ۵ انتخاب کنید:",

    rated:
      "⭐ امتیاز شما ثبت شد.",

    alreadyRated:
      "⚠️ شما قبلاً به این فیلم امتیاز داده‌اید.",

    favoriteAdded:
      "❤️ به علاقه‌مندی‌ها اضافه شد.",

    favoriteRemoved:
      "💔 از علاقه‌مندی‌ها حذف شد.",

    emptyFavorites:
      "❤️ لیست علاقه‌مندی‌های شما خالی است.",

    emptyHistory:
      "📜 تاریخچه شما خالی است.",

    report:
      "🚫 مشکل فیلم را انتخاب کنید:",

    reported:
      "✅ گزارش شما برای تیم ارسال شد.",

    profileTitle:
      "👤 پروفایل",

    adminRequest:
      "🔐 رمز ورود مدیر را ارسال کنید.",

    adminPending:
      "⏳ درخواست ادمین برای مدیر اصلی ارسال شد.",

    accessDenied:
      "⛔ دسترسی ندارید.",

    banned:
      "🚫 حساب شما در حال حاضر محدود شده است."
  }
};

function text(lang, key) {
  return (
    LANG[lang]?.[key] ||
    LANG.en[key] ||
    key
  );
}

/* =========================================================
   Main Reply Keyboard
   ========================================================= */

function mainKeyboard(lang, admin = false) {
  const rows = [
    [
      {
        text: text(lang, "get")
      },
      {
        text: text(lang, "submit")
      }
    ],

    [
      {
        text: text(lang, "request")
      },
      {
        text: text(lang, "trending")
      }
    ],

    [
      {
        text: text(lang, "favorites")
      },
      {
        text: text(lang, "history")
      }
    ],

    [
      {
        text: text(lang, "invite")
      },
      {
        text: text(lang, "leaderboard")
      }
    ],

    [
      {
        text: text(lang, "profile")
      },
      {
        text: text(lang, "language")
      }
    ]
  ];

  if (admin) {
    rows.push([
      {
        text: "👑 Admin Panel"
      }
    ]);
  }

  return {
    keyboard: rows,
    resize_keyboard: true,
    is_persistent: true
  };
}

/* =========================================================
   Language Keyboard
   ========================================================= */

function languageKeyboard() {
  return {
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
  };
       }
/* =========================================================
   PART 3 / 10
   Membership + Start + Invites
   ========================================================= */

async function checkMembership(env, userId) {
  const result = await tg(
    env,
    "getChatMember",
    {
      chat_id:
        env.CHANNEL_ID ||
        CONFIG.channel,

      user_id: userId
    }
  );

  if (!result.ok) {
    return false;
  }

  const status =
    result.result?.status;

  return [
    "creator",
    "administrator",
    "member"
  ].includes(status);
}

async function sendLanguageChoice(env, chatId) {
  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: LANG.en.choose,
      reply_markup:
        languageKeyboard()
    }
  );
}

async function sendMembership(env, chatId, lang) {
  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: text(lang, "join"),

      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                text(
                  lang,
                  "joinButton"
                ),

              url:
                env.CHANNEL_LINK ||
                CONFIG.channelLink
            }
          ],

          [
            {
              text:
                text(
                  lang,
                  "check"
                ),

              callback_data:
                "membership:check"
            }
          ]
        ]
      }
    }
  );
}

async function sendWelcome(env, chatId, user) {
  const lang =
    user.language || "en";

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: text(
        lang,
        "welcome"
      ),

      reply_markup:
        mainKeyboard(
          lang,
          isAdminUser(
            env,
            user.id
          )
        )
    }
  );
}

async function completeStart(env, chatId, user) {
  user.membershipChecked = true;

  await saveUser(
    env,
    user
  );

  await sendWelcome(
    env,
    chatId,
    user
  );
}

async function handleStart(env, message) {
  const tgUser =
    message.from;

  const user =
    await ensureUser(
      env,
      tgUser
    );

  if (user.banned) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,
        text:
          text(
            user.language,
            "banned"
          )
      }
    );

    return;
  }

  const args =
    String(message.text || "")
      .split(/\s+/)
      .slice(1);

  if (
    args[0] &&
    args[0].startsWith("ref_")
  ) {
    await registerReferral(
      env,
      user.id,
      args[0].slice(4)
    );
  }

  if (!user.languageSelected) {
    await sendLanguageChoice(
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
    await sendMembership(
      env,
      message.chat.id,
      user.language
    );

    return;
  }

  await completeStart(
    env,
    message.chat.id,
    user
  );
}

/* =========================================================
   Referral System
   ========================================================= */

function referralLink(env, userId) {
  return (
    `https://t.me/` +
    `${env.BOT_USERNAME || "YOUR_BOT"}` +
    `?start=ref_${userId}`
  );
}

async function registerReferral(
  env,
  invitedUserId,
  inviterId
) {
  if (
    !inviterId ||
    inviterId === invitedUserId
  ) {
    return;
  }

  const inviter =
    await getUser(
      env,
      inviterId
    );

  const invited =
    await getUser(
      env,
      invitedUserId
    );

  if (!inviter || !invited) {
    return;
  }

  if (
    inviter.invites.some(
      x =>
        uid(x.userId) ===
        invitedUserId
    )
  ) {
    return;
  }

  if (
    invited.invitedBy
  ) {
    return;
  }

  invited.invitedBy =
    inviterId;

  await saveUser(
    env,
    invited
  );

  inviter.invites.push({
    userId:
      invitedUserId,

    valid:
      false,

    createdAt:
      timestamp()
  });

  await saveUser(
    env,
    inviter
  );
}

async function validateReferral(
  env,
  userId
) {
  const user =
    await getUser(
      env,
      userId
    );

  if (!user || !user.invitedBy) {
    return;
  }

  const inviter =
    await getUser(
      env,
      user.invitedBy
    );

  if (!inviter) {
    return;
  }

  const item =
    inviter.invites.find(
      x =>
        uid(x.userId) ===
        uid(userId)
    );

  if (!item || item.valid) {
    return;
  }

  item.valid = true;

  inviter.validInvites =
    inviter.invites.filter(
      x => x.valid
    ).length;

  await saveUser(
    env,
    inviter
  );

  user.invitedBy =
    null;

  await saveUser(
    env,
    user
  );

  if (
    inviter.validInvites >= 3
  ) {
    inviter.cooldownUntil = 0;

    await saveUser(
      env,
      inviter
    );
  }
             }
/* =========================================================
   PART 4 / 10
   Movies + Random Delivery
   ========================================================= */

async function getMovies(env) {
  return await kvGet(
    env,
    "movies",
    []
  );
}

async function saveMovies(env, movies) {
  await kvPut(
    env,
    "movies",
    movies
  );
}

async function getMovie(env, movieId) {
  const movies =
    await getMovies(env);

  return movies.find(
    m =>
      uid(m.id) ===
      uid(movieId)
  ) || null;
}

async function saveMovie(env, movie) {
  const movies =
    await getMovies(env);

  const index =
    movies.findIndex(
      m =>
        uid(m.id) ===
        uid(movie.id)
    );

  if (index === -1) {
    movies.push(movie);
  } else {
    movies[index] = movie;
  }

  await saveMovies(
    env,
    movies
  );
}

async function deleteMovieData(
  env,
  movieId
) {
  const movies =
    await getMovies(env);

  const result =
    movies.filter(
      m =>
        uid(m.id) !==
        uid(movieId)
    );

  await saveMovies(
    env,
    result
  );
}

function availableMovies(
  movies,
  user
) {
  const seen =
    new Set(
      (user.history || [])
        .map(x => uid(x.movieId))
    );

  return movies.filter(
    m =>
      m.approved !== false &&
      !seen.has(uid(m.id))
  );
}

function movieStatsText(movie) {
  const views =
    Number(movie.views || 0);

  const votes =
    Number(movie.votes || 0);

  const rating =
    votes > 0
      ? (
          Number(
            movie.ratingTotal || 0
          ) / votes
        ).toFixed(1)
      : "0.0";

  return (
    `\n\n👁 Views: ${views}` +
    `\n⭐ Rating: ${rating}/5` +
    `\n👥 Votes: ${votes}` +
    `\n🌍 Country: ${movie.country || "Unknown"}` +
    `\n🎬 ID: ${movie.id}` +
    `\n\n🧷 ${CONFIG.channel}`
  );
}

function movieKeyboard(
  movie,
  user
) {
  const favorite =
    (user.favorites || [])
      .map(uid)
      .includes(
        uid(movie.id)
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
            `movie:fav:${favorite ? "remove" : "add"}:${movie.id}`
        }
      ],

      [
        {
          text: "🔄 Again",
          callback_data:
            `movie:again:${movie.id}`
        },

        {
          text: "⭐ Rate",
          callback_data:
            `movie:rate:${movie.id}`
        }
      ],

      [
        {
          text: "🚫 Report",
          callback_data:
            `movie:report:${movie.id}`
        }
      ]
    ]
  };
}

async function sendMovieFile(
  env,
  chatId,
  movie,
  user
) {
  const caption =
    String(
      movie.description || ""
    ) +
    movieStatsText(movie);

  let result;

  if (
    movie.type === "video"
  ) {
    result =
      await tg(
        env,
        "sendVideo",
        {
          chat_id: chatId,
          video: movie.fileId,
          caption,
          reply_markup:
            movieKeyboard(
              movie,
              user
            )
        }
      );
  } else {
    result =
      await tg(
        env,
        "sendDocument",
        {
          chat_id: chatId,
          document:
            movie.fileId,

          caption,

          reply_markup:
            movieKeyboard(
              movie,
              user
            )
        }
      );
  }

  if (result.ok) {
    return result.result;
  }

  return null;
}

async function addHistory(
  env,
  user,
  movie
) {
  const item = {
    movieId:
      uid(movie.id),

    at:
      timestamp()
  };

  user.history =
    (user.history || [])
      .filter(
        x =>
          uid(x.movieId) !==
          uid(movie.id)
      );

  user.history.unshift(
    item
  );

  const limit =
    CONFIG.maxHistory;

  user.history =
    user.history.slice(
      0,
      limit
    );

  await saveUser(
    env,
    user
  );
}

async function getRandomMovie(
  env,
  user
) {
  const movies =
    await getMovies(env);

  const available =
    availableMovies(
      movies,
      user
    );

  if (!available.length) {
    return null;
  }

  return available[
    Math.floor(
      Math.random() *
      available.length
    )
  ];
}

async function deliverMovie(
  env,
  chatId,
  user,
  movie
) {
  if (!movie) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          text(
            user.language,
            "noMovies"
          )
      }
    );

    return;
  }

  movie.views =
    Number(movie.views || 0) + 1;

  movie.lastViewed =
    timestamp();

  await saveMovie(
    env,
    movie
  );

  user.views =
    Number(user.views || 0) + 1;

  user.cooldownUntil =
    timestamp() +
    CONFIG.cooldown;

  await addHistory(
    env,
    user,
    movie
  );

  await saveUser(
    env,
    user
  );

  const sent =
    await sendMovieFile(
      env,
      chatId,
      movie,
      user
    );

  if (sent?.message_id) {
    setTimeout(
      () =>
        tg(
          env,
          "deleteMessage",
          {
            chat_id:
              chatId,
            message_id:
              sent.message_id
          }
        ).catch(
          () => {}
        ),
      CONFIG.deleteAfter
    );
  }
}

async function handleGetMovie(
  env,
  message,
  user
) {
  const nowTime =
    timestamp();

  if (
    user.validInvites < 3 &&
    user.cooldownUntil > nowTime
  ) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          text(
            user.language,
            "cooldown"
          )
      }
    );

    return;
  }

  const movie =
    await getRandomMovie(
      env,
      user
    );

  await deliverMovie(
    env,
    message.chat.id,
    user,
    movie
  );
           }
/* =========================================================
   PART 5 / 10
   Favorites + History + Rating + Reports
   ========================================================= */

async function toggleFavorite(
  env,
  user,
  movieId,
  add
) {
  user.favorites =
    user.favorites || [];

  const index =
    user.favorites.findIndex(
      id =>
        uid(id) ===
        uid(movieId)
    );

  if (add) {
    if (index === -1) {
      user.favorites.push(
        uid(movieId)
      );
    }
  } else {
    if (index !== -1) {
      user.favorites.splice(
        index,
        1
      );
    }
  }

  user.favorites =
    user.favorites.slice(
      0,
      CONFIG.maxFavorites
    );

  await saveUser(
    env,
    user
  );
}

async function showFavorites(
  env,
  chatId,
  user
) {
  const movies =
    await getMovies(env);

  const ids =
    user.favorites || [];

  const favorites =
    ids
      .map(
        id =>
          movies.find(
            m =>
              uid(m.id) ===
              uid(id)
          )
      )
      .filter(Boolean);

  if (!favorites.length) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          text(
            user.language,
            "emptyFavorites"
          )
      }
    );

    return;
  }

  const buttons =
    favorites
      .slice(0, 20)
      .map(movie => [
        {
          text:
            `🎬 ${movie.title || movie.id}`,

          callback_data:
            `favorite:get:${movie.id}`
        }
      ]);

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text:
        user.language === "fa"
          ? "❤️ فیلم‌های موردعلاقه شما:"
          : "❤️ Your favorite movies:",

      reply_markup: {
        inline_keyboard:
          buttons
      }
    }
  );
}

async function showHistory(
  env,
  chatId,
  user
) {
  const cutoff =
    timestamp() -
    24 * 60 * 60 * 1000;

  const movies =
    await getMovies(env);

  const validHistory =
    (user.history || [])
      .filter(
        x =>
          Number(x.at || 0) >=
          cutoff
      );

  user.history =
    validHistory;

  await saveUser(
    env,
    user
  );

  if (!validHistory.length) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          text(
            user.language,
            "emptyHistory"
          )
      }
    );

    return;
  }

  const buttons =
    validHistory
      .map(item => {
        const movie =
          movies.find(
            m =>
              uid(m.id) ===
              uid(item.movieId)
          );

        if (!movie) {
          return null;
        }

        return [
          {
            text:
              `🎬 ${movie.title || movie.id}`,

            callback_data:
              `history:get:${movie.id}`
          }
        ];
      })
      .filter(Boolean);

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,

      text:
        user.language === "fa"
          ? "📜 تاریخچه ۲۴ ساعت اخیر:"
          : "📜 Your last 24 hours:",

      reply_markup: {
        inline_keyboard:
          buttons
      }
    }
  );
}

async function rateMovie(
  env,
  user,
  movieId,
  rating
) {
  const key =
    `rating:${movieId}:${user.id}`;

  const old =
    await kvGet(
      env,
      key,
      null
    );

  if (old !== null) {
    return false;
  }

  const movie =
    await getMovie(
      env,
      movieId
    );

  if (!movie) {
    return false;
  }

  movie.ratingTotal =
    Number(
      movie.ratingTotal || 0
    ) +
    Number(rating);

  movie.votes =
    Number(
      movie.votes || 0
    ) + 1;

  await saveMovie(
    env,
    movie
  );

  await kvPut(
    env,
    key,
    {
      rating,
      at: timestamp()
    }
  );

  user.ratings =
    Number(user.ratings || 0) +
    1;

  user.xp =
    Number(user.xp || 0) +
    5;

  await saveUser(
    env,
    user
  );

  await checkAchievements(
    env,
    user
  );

  return true;
}

async function createReport(
  env,
  user,
  movieId,
  reason
) {
  const reports =
    await kvGet(
      env,
      "reports",
      []
    );

  reports.push({
    id:
      randomId("report"),

    movieId:
      uid(movieId),

    userId:
      uid(user.id),

    reason,

    createdAt:
      timestamp(),

    status:
      "pending"
  });

  await kvPut(
    env,
    "reports",
    reports
  );
}

function reportKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "🚫 Broken Movie",
          callback_data:
            "report:broken"
        }
      ],

      [
        {
          text: "❌ Wrong Information",
          callback_data:
            "report:wrong"
        }
      ],

      [
        {
          text: "🔁 Duplicate",
          callback_data:
            "report:duplicate"
        }
      ],

      [
        {
          text: "⚠️ Other",
          callback_data:
            "report:other"
        }
      ]
    ]
  };
}
/* =========================================================
   PART 6 / 10
   Submit Movie + Requests + Request Voting
   ========================================================= */

async function getPending(env) {
  return await kvGet(
    env,
    "pending_movies",
    []
  );
}

async function savePending(
  env,
  list
) {
  await kvPut(
    env,
    "pending_movies",
    list
  );
}

async function handleIncomingMovie(
  env,
  message,
  user
) {
  let type = null;
  let fileId = null;

  if (message.video) {
    type = "video";
    fileId =
      message.video.file_id;
  } else if (message.document) {
    type = "document";
    fileId =
      message.document.file_id;
  }

  if (!fileId) {
    return;
  }

  const pending =
    await getPending(env);

  const movie = {
    id:
      randomId("movie"),

    userId:
      uid(user.id),

    type,

    fileId,

    title:
      message.caption ||
      "Untitled",

    description: "",

    genre: "",
    country:
      user.country || "",

    year: "",

    poster: "",

    views: 0,
    ratingTotal: 0,
    votes: 0,

    approved: false,

    createdAt:
      timestamp(),

    status:
      "pending"
  };

  pending.push(movie);

  await savePending(
    env,
    pending
  );

  await tg(
    env,
    "sendMessage",
    {
      chat_id:
        message.chat.id,

      text:
        text(
          user.language,
          "movieReceived"
        )
    }
  );

  const admin =
    adminId(env);

  if (admin) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: admin,

        text:
          `📥 New Movie Submission\n\n` +
          `🎬 ${movie.title}\n` +
          `👤 ${user.id}\n` +
          `🆔 ${movie.id}`,

        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "👀 Review",

                callback_data:
                  `team:view:${movie.id}`
              }
            ],

            [
              {
                text:
                  "✅ Approve",

                callback_data:
                  `team:approve:${movie.id}`
              },

              {
                text:
                  "❌ Reject",

                callback_data:
                  `team:reject:${movie.id}`
              }
            ]
          ]
        }
      }
    );
  }
}

async function getRequests(env) {
  return await kvGet(
    env,
    "movie_requests",
    []
  );
}

async function saveRequests(
  env,
  requests
) {
  await kvPut(
    env,
    "movie_requests",
    requests
  );
}

async function createMovieRequest(
  env,
  user,
  title
) {
  const requests =
    await getRequests(env);

  const clean =
    String(title || "")
      .trim();

  if (!clean) {
    return null;
  }

  const existing =
    requests.find(
      r =>
        r.title.toLowerCase() ===
        clean.toLowerCase() &&
        r.status === "pending"
    );

  if (existing) {
    return existing;
  }

  const request = {
    id:
      randomId("req"),

    title:
      clean,

    userId:
      uid(user.id),

    status:
      "pending",

    votes: 0,

    voters: [],

    createdAt:
      timestamp()
  };

  requests.push(
    request
  );

  await saveRequests(
    env,
    requests
  );

  return request;
}

async function voteRequest(
  env,
  userId,
  requestId
) {
  const requests =
    await getRequests(env);

  const request =
    requests.find(
      r =>
        uid(r.id) ===
        uid(requestId)
    );

  if (!request) {
    return false;
  }

  request.voters =
    request.voters || [];

  if (
    request.voters.includes(
      uid(userId)
    )
  ) {
    return false;
  }

  request.voters.push(
    uid(userId)
  );

  request.votes =
    request.voters.length;

  await saveRequests(
    env,
    requests
  );

  return true;
}

async function showRequests(
  env,
  chatId
) {
  const requests =
    await getRequests(env);

  const list =
    requests
      .filter(
        r =>
          r.status ===
          "pending"
      )
      .sort(
        (a, b) =>
          Number(b.votes || 0) -
          Number(a.votes || 0)
      )
      .slice(0, 20);

  if (!list.length) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🎬 No movie requests yet."
      }
    );

    return;
  }

  const buttons =
    list.map(r => [
      {
        text:
          `🎬 ${r.title} • 🔥 ${r.votes || 0}`,

        callback_data:
          `request:vote:${r.id}`
      }
    ]);

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,

      text:
        "🎬 Movie Requests\n\nVote for movies you want:",

      reply_markup: {
        inline_keyboard:
          buttons
      }
    }
  );
}
/* =========================================================
   PART 7 / 10
   Trending + Leaderboards + Achievements
   ========================================================= */

async function showTrending(
  env,
  chatId
) {
  const movies =
    await getMovies(env);

  const list =
    movies
      .filter(
        m =>
          m.approved !== false
      )
      .sort(
        (a, b) => {
          const scoreA =
            Number(a.views || 0) +
            Number(a.votes || 0) * 10 +
            Number(a.favorites || 0) * 5;

          const scoreB =
            Number(b.views || 0) +
            Number(b.votes || 0) * 10 +
            Number(b.favorites || 0) * 5;

          return scoreB - scoreA;
        }
      )
      .slice(0, 10);

  if (!list.length) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "🔥 Trending is empty."
      }
    );

    return;
  }

  let message =
    "🔥 Trending\n\n";

  list.forEach(
    (movie, index) => {
      const rating =
        Number(movie.votes || 0)
          ? (
              Number(
                movie.ratingTotal || 0
              ) /
              Number(
                movie.votes || 1
              )
            ).toFixed(1)
          : "0.0";

      message +=
        `${index + 1}. 🎬 ${movie.title || movie.id}\n` +
        `👁 ${movie.views || 0}  ⭐ ${rating}\n\n`;
    }
  );

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: message
    }
  );
}

async function getAllUsers(env) {
  return await kvGet(
    env,
    "users_index",
    []
  );
}

async function saveUsersIndex(
  env,
  list
) {
  await kvPut(
    env,
    "users_index",
    list
  );
}

async function registerUserIndex(
  env,
  userId
) {
  const users =
    await getAllUsers(env);

  if (
    !users.includes(
      uid(userId)
    )
  ) {
    users.push(
      uid(userId)
    );

    await saveUsersIndex(
      env,
      users
    );
  }
}

async function leaderboard(
  env,
  chatId,
  mode
) {
  const ids =
    await getAllUsers(env);

  const users = [];

  for (
    const id of ids.slice(0, 5000)
  ) {
    const u =
      await getUser(
        env,
        id
      );

    if (u) {
      users.push(u);
    }
  }

  users.sort(
    (a, b) => {
      if (mode === "invites") {
        return (
          Number(b.validInvites || 0) -
          Number(a.validInvites || 0)
        );
      }

      if (mode === "ratings") {
        return (
          Number(b.ratings || 0) -
          Number(a.ratings || 0)
        );
      }

      if (mode === "views") {
        return (
          Number(b.views || 0) -
          Number(a.views || 0)
        );
      }

      return (
        Number(b.xp || 0) -
        Number(a.xp || 0)
      );
    }
  );

  let out =
    "🏆 Leaderboard\n\n";

  users
    .slice(0, 10)
    .forEach(
      (u, i) => {
        out +=
          `${i + 1}. ${u.firstName || u.username || u.id} — ` +
          `XP: ${u.xp || 0}\n`;
      }
    );

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: out
    }
  );
}

/* =========================================================
   Achievements
   ========================================================= */

async function giveBadge(
  env,
  user,
  badge
) {
  user.badges =
    user.badges || [];

  if (
    user.badges.includes(
      badge
    )
  ) {
    return;
  }

  user.badges.push(
    badge
  );

  user.xp =
    Number(user.xp || 0) +
    20;

  await saveUser(
    env,
    user
  );
}

async function checkAchievements(
  env,
  user
) {
  if (
    Number(user.views || 0) >= 1
  ) {
    await giveBadge(
      env,
      user,
      "🎬 First Movie"
    );
  }

  if (
    Number(user.ratings || 0) >= 1
  ) {
    await giveBadge(
      env,
      user,
      "⭐ First Vote"
    );
  }

  if (
    (user.favorites || []).length >= 1
  ) {
    await giveBadge(
      env,
      user,
      "❤️ First Favorite"
    );
  }

  if (
    Number(user.validInvites || 0) >= 1
  ) {
    await giveBadge(
      env,
      user,
      "👥 First Invite"
    );
  }

  if (
    Number(user.views || 0) >= 10
  ) {
    await giveBadge(
      env,
      user,
      "🔥 Active User"
    );
  }

  if (
    Number(user.views || 0) >= 50
  ) {
    await giveBadge(
      env,
      user,
      "🎬 Movie Hunter"
    );
  }

  if (
    Number(user.views || 0) >= 100
  ) {
    await giveBadge(
      env,
      user,
      "🏆 Veteran"
    );
  }

  if (
    Number(user.views || 0) >= 500
  ) {
    await giveBadge(
      env,
      user,
      "👑 Cinema Master"
    );
  }
}
/* =========================================================
   PART 8 / 10
   Profile + Rewards + Admin Request
   ========================================================= */

async function showProfile(
  env,
  chatId,
  user
) {
  const name =
    [
      user.firstName,
      user.lastName
    ]
      .filter(Boolean)
      .join(" ") ||
    user.username ||
    "-";

  const out =
    `👤 ${text(user.language, "profileTitle")}\n\n` +
    `👤 Name: ${name}\n` +
    `🆔 User ID: ${user.id}\n` +
    `🌐 Language: ${user.language}\n` +
    `🌍 Country: ${user.country || "Unknown"}\n` +
    `📅 Joined: ${new Date(user.joinedAt).toISOString().slice(0, 10)}\n\n` +
    `🎬 Movies: ${user.views || 0}\n` +
    `👁 Viewed: ${user.views || 0}\n` +
    `⭐ Ratings: ${user.ratings || 0}\n` +
    `❤️ Favorites: ${(user.favorites || []).length}\n` +
    `👥 Valid Invites: ${user.validInvites || 0}\n` +
    `🏆 Level: ${user.level || 1}\n` +
    `✨ XP: ${user.xp || 0}\n\n` +
    `🏅 Badges:\n` +
    `${(user.badges || []).join("\n") || "-"}`;

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: out
    }
  );
}

async function showInvite(
  env,
  chatId,
  user
) {
  const link =
    referralLink(
      env,
      user.id
    );

  const out =
    `👥 Invite Friends\n\n` +
    `🔗 Your invite link:\n${link}\n\n` +
    `✅ Valid Invites: ${user.validInvites || 0}\n` +
    `🎁 3 valid invites = cooldown removed`;

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: out
    }
  );
}

async function rewardDaily(
  env,
  user
) {
  const key =
    `reward:daily:${user.id}`;

  const old =
    await kvGet(
      env,
      key,
      null
    );

  if (old) {
    return false;
  }

  await kvPut(
    env,
    key,
    {
      at:
        timestamp()
    }
  );

  user.xp =
    Number(user.xp || 0) +
    10;

  user.rewards =
    user.rewards || [];

  user.rewards.push({
    type: "daily",
    at: timestamp()
  });

  await saveUser(
    env,
    user
  );

  return true;
}

async function updateLevel(
  env,
  user
) {
  const newLevel =
    Math.floor(
      Number(user.xp || 0) /
      100
    ) + 1;

  if (
    newLevel >
    Number(user.level || 1)
  ) {
    user.level =
      newLevel;

    user.rewards =
      user.rewards || [];

    user.rewards.push({
      type: "level_up",
      level:
        newLevel,
      at:
        timestamp()
    });

    await saveUser(
      env,
      user
    );
  }
}

/* =========================================================
   Admin Request
   ========================================================= */

async function requestAdmin(
  env,
  user,
  password
) {
  if (
    password !==
    String(
      env.ADMIN_PASSWORD || ""
    )
  ) {
    return false;
  }

  if (
    isAdminUser(
      env,
      user.id
    )
  ) {
    return true;
  }

  const requests =
    await kvGet(
      env,
      "admin_requests",
      []
    );

  const exists =
    requests.find(
      r =>
        uid(r.userId) ===
        uid(user.id) &&
        r.status ===
          "pending"
    );

  if (!exists) {
    requests.push({
      id:
        randomId("adminreq"),

      userId:
        uid(user.id),

      status:
        "pending",

      createdAt:
        timestamp()
    });

    await kvPut(
      env,
      "admin_requests",
      requests
    );
  }

  const admin =
    adminId(env);

  if (admin) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: admin,

        text:
          `🔐 Admin Request\n\n` +
          `👤 User ID: ${user.id}\n` +
          `👤 ${user.firstName || ""}`,

        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "✅ Approve",

                callback_data:
                  `adminreq:approve:${user.id}`
              },

              {
                text:
                  "❌ Reject",

                callback_data:
                  `adminreq:reject:${user.id}`
              }
            ]
          ]
        }
      }
    );
  }

  return true;
}
/* =========================================================
   PART 9 / 10
   Team + Admin Panel + Logs + Ads
   ========================================================= */

async function addLog(
  env,
  action,
  actor,
  target = "",
  extra = ""
) {
  const logs =
    await kvGet(
      env,
      "logs",
      []
    );

  logs.push({
    id:
      randomId("log"),

    action,
    actor:
      uid(actor),

    target:
      uid(target),

    extra,

    at:
      timestamp()
  });

  await kvPut(
    env,
    "logs",
    logs.slice(-5000)
  );
}

/* =========================================================
   Approve / Reject
   ========================================================= */

async function approveMovie(
  env,
  movieId,
  actor
) {
  const pending =
    await getPending(env);

  const index =
    pending.findIndex(
      m =>
        uid(m.id) ===
        uid(movieId)
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

  await savePending(
    env,
    pending
  );

  movie.approved =
    true;

  movie.status =
    "approved";

  await saveMovie(
    env,
    movie
  );

  await addLog(
    env,
    "movie_approved",
    actor,
    movieId
  );

  return movie;
}

async function rejectMovie(
  env,
  movieId,
  actor,
  reason
) {
  const pending =
    await getPending(env);

  const index =
    pending.findIndex(
      m =>
        uid(m.id) ===
        uid(movieId)
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

  await savePending(
    env,
    pending
  );

  await addLog(
    env,
    "movie_rejected",
    actor,
    movieId,
    reason
  );

  if (movie.userId) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          movie.userId,

        text:
          `❌ Your movie was rejected.\n\n` +
          `Reason: ${reason || "Not specified"}`
      }
    );
  }

  return movie;
}

/* =========================================================
   Admin Dashboard
   ========================================================= */

async function adminDashboard(
  env,
  chatId
) {
  const users =
    await getAllUsers(env);

  const movies =
    await getMovies(env);

  const pending =
    await getPending(env);

  let views = 0;
  let ratings = 0;

  movies.forEach(
    movie => {
      views +=
        Number(movie.views || 0);

      ratings +=
        Number(movie.votes || 0);
    }
  );

  const out =
    `👑 ADMIN DASHBOARD\n\n` +
    `👥 Users: ${users.length}\n` +
    `🎬 Movies: ${movies.length}\n` +
    `👁 Views: ${views}\n` +
    `⭐ Ratings: ${ratings}\n` +
    `📥 Submissions: ${pending.length}\n\n` +
    `📅 ${new Date().toISOString().slice(0, 10)}`;

  await tg(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: out,

      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                "👥 Users",

              callback_data:
                "admin:users"
            },

            {
              text:
                "🎬 Movies",

              callback_data:
                "admin:movies"
            }
          ],

          [
            {
              text:
                "📥 Review Queue",

              callback_data:
                "admin:queue"
            }
          ],

          [
            {
              text:
                "📢 Ads",

              callback_data:
                "admin:ads"
            },

            {
              text:
                "📜 Logs",

              callback_data:
                "admin:logs"
            }
          ]
        ]
      }
    }
  );
}

async function showQueue(
  env,
  chatId
) {
  const pending =
    await getPending(env);

  if (!pending.length) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text:
          "📭 Review queue is empty."
      }
    );

    return;
  }

  for (
    const movie of pending.slice(
      0,
      20
    )
  ) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `📥 Pending Movie\n\n` +
          `🎬 ${movie.title}\n` +
          `👤 ${movie.userId}\n` +
          `🆔 ${movie.id}`,

        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "👀 View",

                callback_data:
                  `team:view:${movie.id}`
              }
            ],

            [
              {
                text:
                  "✅ Approve",

                callback_data:
                  `team:approve:${movie.id}`
              },

              {
                text:
                  "❌ Reject",

                callback_data:
                  `team:reject:${movie.id}`
              }
            ]
          ]
        }
      }
    );
  }
}

/* =========================================================
   Advertisement Storage
   ========================================================= */

async function getAds(env) {
  return await kvGet(
    env,
    "ads",
    []
  );
}

async function saveAds(
  env,
  ads
) {
  await kvPut(
    env,
    "ads",
    ads
  );
}

async function createAd(
  env,
  actor,
  data
) {
  const ads =
    await getAds(env);

  const ad = {
    id:
      randomId("ad"),

    type:
      data.type || "text",

    text:
      data.text || "",

    url:
      data.url || "",

    language:
      data.language || "all",

    active:
      true,

    sent: 0,
    success: 0,
    failed: 0,

    createdAt:
      timestamp(),

    createdBy:
      uid(actor)
  };

  ads.push(ad);

  await saveAds(
    env,
    ads
  );

  return ad;
}

async function sendAdvertisement(
  env,
  ad
) {
  const ids =
    await getAllUsers(env);

  for (
    const id of ids
  ) {
    try {
      const user =
        await getUser(
          env,
          id
        );

      if (
        !user ||
        user.banned
      ) {
        continue;
      }

      if (
        ad.language !== "all" &&
        user.language !==
          ad.language
      ) {
        continue;
      }

      ad.sent++;

      const result =
        await tg(
          env,
          "sendMessage",
          {
            chat_id:
              id,

            text:
              ad.text || ""
          }
        );

      if (result.ok) {
        ad.success++;
      } else {
        ad.failed++;
      }
    } catch {
      ad.failed++;
    }
  }

  const ads =
    await getAds(env);

  const index =
    ads.findIndex(
      x =>
        uid(x.id) ===
        uid(ad.id)
    );

  if (index >= 0) {
    ads[index] =
      ad;
  }

  await saveAds(
    env,
    ads
  );
}
/* =========================================================
   PART 10 / 10
   Callbacks + Messages + Webhook + Health Check
   ========================================================= */

async function handleCallback(
  env,
  callback
) {
  const user =
    await ensureUser(
      env,
      callback.from
    );

  const data =
    String(
      callback.data || ""
    );

  const parts =
    data.split(":");

  await tg(
    env,
    "answerCallbackQuery",
    {
      callback_query_id:
        callback.id
    }
  );

  /* Language */

  if (
    parts[0] === "lang"
  ) {
    const lang =
      parts[1] === "fa"
        ? "fa"
        : "en";

    user.language =
      lang;

    user.languageSelected =
      true;

    await saveUser(
      env,
      user
    );

    const member =
      await checkMembership(
        env,
        user.id
      );

    if (!member) {
      await sendMembership(
        env,
        callback.message.chat.id,
        lang
      );

      return;
    }

    await completeStart(
      env,
      callback.message.chat.id,
      user
    );

    return;
  }

  /* Membership */

  if (
    data ===
    "membership:check"
  ) {
    const member =
      await checkMembership(
        env,
        user.id
      );

    if (!member) {
      await tg(
        env,
        "sendMessage",
        {
          chat_id:
            callback.message.chat.id,

          text:
            text(
              user.language,
              "notMember"
            )
        }
      );

      return;
    }

    await validateReferral(
      env,
      user.id
    );

    await completeStart(
      env,
      callback.message.chat.id,
      user
    );

    return;
  }

  /* Favorite */

  if (
    parts[0] ===
    "movie" &&
    parts[1] ===
    "fav"
  ) {
    const add =
      parts[2] === "add";

    const movieId =
      parts[3];

    await toggleFavorite(
      env,
      user,
      movieId,
      add
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          callback.message.chat.id,

        text:
          text(
            user.language,
            add
              ? "favoriteAdded"
              : "favoriteRemoved"
          )
      }
    );

    await checkAchievements(
      env,
      user
    );

    return;
  }

  /* Again */

  if (
    parts[0] ===
      "movie" &&
    parts[1] ===
      "again"
  ) {
    const movie =
      await getMovie(
        env,
        parts[2]
      );

    if (movie) {
      await deliverMovie(
        env,
        callback.message.chat.id,
        user,
        movie
      );
    }

    return;
  }

  /* Rating */

  if (
    parts[0] ===
      "movie" &&
    parts[1] ===
      "rate"
  ) {
    const movieId =
      parts[2];

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          callback.message.chat.id,

        text:
          text(
            user.language,
            "rating"
          ),

        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⭐ 1",
                callback_data:
                  `rating:${movieId}:1`
              },

              {
                text: "⭐ 2",
                callback_data:
                  `rating:${movieId}:2`
              },

              {
                text: "⭐ 3",
                callback_data:
                  `rating:${movieId}:3`
              }
            ],

            [
              {
                text: "⭐ 4",
                callback_data:
                  `rating:${movieId}:4`
              },

              {
                text: "⭐ 5",
                callback_data:
                  `rating:${movieId}:5`
              }
            ]
          ]
        }
      }
    );

    return;
  }

  if (
    parts[0] ===
    "rating"
  ) {
    const ok =
      await rateMovie(
        env,
        user,
        parts[1],
        Number(parts[2])
      );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          callback.message.chat.id,

        text:
          text(
            user.language,
            ok
              ? "rated"
              : "alreadyRated"
          )
      }
    );

    await updateLevel(
      env,
      user
    );

    return;
  }

  /* Report */

  if (
    parts[0] ===
    "movie" &&
    parts[1] ===
    "report"
  ) {
    user.state =
      "report";

    user.stateData = {
      movieId:
        parts[2]
    };

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          callback.message.chat.id,

        text:
          text(
            user.language,
            "report"
          ),

        reply_markup:
          reportKeyboard()
      }
    );

    return;
  }

  if (
    parts[0] ===
    "report"
  ) {
    const movieId =
      user.stateData?.movieId;

    await createReport(
      env,
      user,
      movieId,
      parts[1]
    );

    user.state = null;
    user.stateData = null;

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          callback.message.chat.id,

        text:
          text(
            user.language,
            "reported"
          )
      }
    );

    return;
  }

  /* Favorite get */

  if (
    parts[0] ===
      "favorite" &&
    parts[1] ===
      "get"
  ) {
    const movie =
      await getMovie(
        env,
        parts[2]
      );

    if (movie) {
      await deliverMovie(
        env,
        callback.message.chat.id,
        user,
        movie
      );
    }

    return;
  }

  /* History get */

  if (
    parts[0] ===
      "history" &&
    parts[1] ===
      "get"
  ) {
    const movie =
      await getMovie(
        env,
        parts[2]
      );

    if (movie) {
      await deliverMovie(
        env,
        callback.message.chat.id,
        user,
        movie
      );
    }

    return;
  }

  /* Request voting */

  if (
    parts[0] ===
    "request" &&
    parts[1] ===
    "vote"
  ) {
    const ok =
      await voteRequest(
        env,
        user.id,
        parts[2]
      );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          callback.message.chat.id,

        text:
          ok
            ? "🔥 Vote recorded."
            : "⚠️ You already voted."
      }
    );

    return;
  }

  /* Team */

  if (
    parts[0] ===
    "team"
  ) {
    if (
      !isTeamUser(
        env,
        user.id
      )
    ) {
      return;
    }

    if (
      parts[1] ===
      "approve"
    ) {
      const movie =
        await approveMovie(
          env,
          parts[2],
          user.id
        );

      if (movie) {
        await tg(
          env,
          "sendMessage",
          {
            chat_id:
              movie.userId,

            text:
              "✅ Your movie was approved and added to the archive."
          }
        );
      }

      return;
    }

    if (
      parts[1] ===
      "reject"
    ) {
      await rejectMovie(
        env,
        parts[2],
        user.id,
        "Rejected by team"
      );

      return;
    }

    if (
      parts[1] ===
      "view"
    ) {
      const pending =
        await getPending(env);

      const movie =
        pending.find(
          m =>
            uid(m.id) ===
            uid(parts[2])
        );

      if (movie) {
        await sendMovieFile(
          env,
          callback.message.chat.id,
          movie,
          user
        );
      }

      return;
    }
  }

  /* Admin Request */

  if (
    parts[0] ===
    "adminreq"
  ) {
    if (
      !isAdminUser(
        env,
        user.id
      )
    ) {
      return;
    }

    const target =
      await getUser(
        env,
        parts[2]
      );

    if (!target) {
      return;
    }

    if (
      parts[1] ===
      "approve"
    ) {
      target.adminApproved =
        true;

      target.cooldownUntil =
        0;

      await saveUser(
        env,
        target
      );

      await addLog(
        env,
        "admin_approved",
        user.id,
        target.id
      );

      await tg(
        env,
        "sendMessage",
        {
          chat_id:
            target.id,

          text:
            "👑 Your admin request was approved."
        }
      );

      return;
    }

    if (
      parts[1] ===
      "reject"
    ) {
      await addLog(
        env,
        "admin_rejected",
        user.id,
        target.id
      );

      await tg(
        env,
        "sendMessage",
        {
          chat_id:
            target.id,

          text:
            "❌ Your admin request was rejected."
        }
      );

      return;
    }
  }

  /* Admin Panel */

  if (
    parts[0] ===
    "admin"
  ) {
    if (
      !isAdminUser(
        env,
        user.id
      )
    ) {
      return;
    }

    if (
      parts[1] ===
      "users"
    ) {
      const users =
        await getAllUsers(env);

      await tg(
        env,
        "sendMessage",
        {
          chat_id:
            callback.message.chat.id,

          text:
            `👥 Users: ${users.length}`
        }
      );

      return;
    }

    if (
      parts[1] ===
      "movies"
    ) {
      const movies =
        await getMovies(env);

      await tg(
        env,
        "sendMessage",
        {
          chat_id:
            callback.message.chat.id,

          text:
            `🎬 Movies: ${movies.length}`
        }
      );

      return;
    }

    if (
      parts[1] ===
      "queue"
    ) {
      await showQueue(
        env,
        callback.message.chat.id
      );

      return;
    }

    if (
      parts[1] ===
      "logs"
    ) {
      const logs =
        await kvGet(
          env,
          "logs",
          []
        );

      const last =
        logs.slice(-20);

      await tg(
        env,
        "sendMessage",
        {
          chat_id:
            callback.message.chat.id,

          text:
            last
              .map(
                x =>
                  `${new Date(x.at).toISOString()}\n` +
                  `${x.action} | ${x.actor} | ${x.target}`
              )
              .join("\n\n") ||
            "No logs."
        }
      );

      return;
    }
  }
}

/* =========================================================
   Message Handler
   ========================================================= */

async function handleMessage(
  env,
  message
) {
  const user =
    await ensureUser(
      env,
      message.from
    );

  await registerUserIndex(
    env,
    user.id
  );

  if (user.banned) {
    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          text(
            user.language,
            "banned"
          )
      }
    );

    return;
  }

  if (
    message.text ===
    "/start" ||
    String(
      message.text || ""
    ).startsWith("/start ")
  ) {
    await handleStart(
      env,
      message
    );

    return;
  }

  /* Admin command */

  if (
    String(
      message.text || ""
    ).trim() ===
    "/Admin"
  ) {
    user.state =
      "admin_password";

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          text(
            user.language,
            "adminRequest"
          )
      }
    );

    return;
  }

  /* Submit movie */

  if (
    user.state ===
    "submit_movie"
  ) {
    if (
      message.video ||
      message.document
    ) {
      user.state = null;

      await saveUser(
        env,
        user
      );

      await handleIncomingMovie(
        env,
        message,
        user
      );

      return;
    }
  }

  /* Request movie */

  if (
    user.state ===
    "request_movie" &&
    message.text
  ) {
    const request =
      await createMovieRequest(
        env,
        user,
        message.text
      );

    user.state = null;

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          request
            ? text(
                user.language,
                "requestReceived"
              )
            : "❌ Invalid request."
      }
    );

    return;
  }

  /* Admin password */

  if (
    user.state ===
    "admin_password" &&
    message.text
  ) {
    const ok =
      await requestAdmin(
        env,
        user,
        message.text.trim()
      );

    user.state = null;

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          ok
            ? text(
                user.language,
                "adminPending"
              )
            : text(
                user.language,
                "accessDenied"
              )
      }
    );

    return;
  }

  const txt =
    String(
      message.text || ""
    ).trim();

  const lang =
    user.language || "en";

  /* Main menu */

  if (
    txt ===
      text(lang, "get") ||
    txt ===
      "📥 دریافت فیلم" ||
    txt ===
      "📥 Get Movie"
  ) {
    await handleGetMovie(
      env,
      message,
      user
    );

    return;
  }

  if (
    txt ===
      text(lang, "submit") ||
    txt ===
      "📤 ارسال فیلم" ||
    txt ===
      "📤 Submit Movie"
  ) {
    user.state =
      "submit_movie";

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          text(
            lang,
            "sendMovie"
          )
      }
    );

    return;
  }

  if (
    txt ===
      text(lang, "request") ||
    txt ===
      "🎬 درخواست فیلم" ||
    txt ===
      "🎬 Request Movie"
  ) {
    user.state =
      "request_movie";

    await saveUser(
      env,
      user
    );

    await tg(
      env,
      "sendMessage",
      {
        chat_id:
          message.chat.id,

        text:
          text(
            lang,
            "requestMovie"
          )
      }
    );

    return;
  }

  if (
    txt ===
      text(lang, "favorites")
  ) {
    await showFavorites(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    txt ===
      text(lang, "history")
  ) {
    await showHistory(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    txt ===
      text(lang, "trending")
  ) {
    await showTrending(
      env,
      message.chat.id
    );

    return;
  }

  if (
    txt ===
      text(lang, "invite")
  ) {
    await showInvite(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    txt ===
      text(lang, "leaderboard")
  ) {
    await leaderboard(
      env,
      message.chat.id,
      "xp"
    );

    return;
  }

  if (
    txt ===
      text(lang, "profile")
  ) {
    await showProfile(
      env,
      message.chat.id,
      user
    );

    return;
  }

  if (
    txt ===
      text(lang, "language")
  ) {
    await sendLanguageChoice(
      env,
      message.chat.id
    );

    return;
  }

  if (
    txt ===
    "👑 Admin Panel"
  ) {
    if (
      isAdminUser(
        env,
        user.id
      )
    ) {
      await adminDashboard(
        env,
        message.chat.id
      );
    }

    return;
  }

  /* Any uploaded movie */

  if (
    message.video ||
    message.document
  ) {
    await handleIncomingMovie(
      env,
      message,
      user
    );
  }
}

/* =========================================================
   Health Check
   ========================================================= */

async function healthCheck(env) {
  const result = {
    bot: false,
    database: false,
    storage: true,
    webhook: false,
    time:
      new Date().toISOString()
  };

  try {
    const me =
      await tg(
        env,
        "getMe"
      );

    result.bot =
      !!me.ok;
  } catch {
    result.bot =
      false;
  }

  try {
    await kvPut(
      env,
      "health:last",
      {
        at:
          timestamp()
      }
    );

    result.database =
      true;
  } catch {
    result.database =
      false;
  }

  try {
    const webhook =
      await tg(
        env,
        "getWebhookInfo"
      );

    result.webhook =
      !!webhook.ok;
  } catch {
    result.webhook =
      false;
  }

  return result;
}

/* =========================================================
   Worker Entry
   ========================================================= */

export default {
  async fetch(request, env, ctx) {
    try {
      if (
        request.method ===
        "GET"
      ) {
        const url =
          new URL(request.url);

        if (
          url.pathname ===
          "/health"
        ) {
          const health =
            await healthCheck(
              env
            );

          return reply(
            health
          );
        }

        return new Response(
          "Superman3 Movie Bot is running.",
          {
            status: 200
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

      if (
        update.callback_query
      ) {
        await handleCallback(
          env,
          update.callback_query
        );
      } else if (
        update.message
      ) {
        await handleMessage(
          env,
          update.message
        );
      }

      return reply({
        ok: true
      });
    } catch (error) {
      console.error(
        "WORKER ERROR:",
        error
      );

      return reply({
        ok: false,
        error:
          String(
            error?.message ||
            error
          )
      });
    }
  }
};
