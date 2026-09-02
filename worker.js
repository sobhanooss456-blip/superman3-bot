const TG = "https://api.telegram.org";

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method !== "POST") {
        return new Response("Film Bot is running.");
      }

      const update = await request.json();

      if (update.callback_query) {
        await handleCallback(update.callback_query, env, ctx);
      } else if (update.message) {
        await handleMessage(update.message, env, ctx);
      }

      return new Response("OK");
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("OK");
    }
  }
};


// ===============================
// Telegram API
// ===============================

async function telegram(env, method, data = {}) {
  const response = await fetch(
    `${TG}/bot${env.BOT_TOKEN}/${method}`,
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


// ===============================
// Helpers
// ===============================

function json(value) {
  return JSON.stringify(value);
}

async function getKV(env, key, fallback = null) {
  const value = await env.BOT_DATA.get(key);

  if (value === null || value === undefined) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function putKV(env, key, value) {
  await env.BOT_DATA.put(key, json(value));
}

async function deleteKV(env, key) {
  await env.BOT_DATA.delete(key);
}

async function getArray(env, key) {
  const value = await getKV(env, key, []);
  return Array.isArray(value) ? value : [];
}

async function addToArray(env, key, value) {
  const array = await getArray(env, key);

  if (!array.includes(value)) {
    array.push(value);
    await putKV(env, key, array);
  }

  return array;
}

async function removeFromArray(env, key, value) {
  const array = await getArray(env, key);

  const newArray = array.filter(x => x !== value);

  await putKV(env, key, newArray);

  return newArray;
  }
// ===============================
// User
// ===============================

async function getUser(env, userId) {
  return await getKV(env, `user:${userId}`, null);
}

async function saveUser(env, user) {
  await putKV(env, `user:${user.id}`, user);
  await addToArray(env, "users:index", user.id);
}

async function ensureUser(env, message) {
  const tgUser = message.from;

  let user = await getUser(env, tgUser.id);

  if (!user) {
    user = {
      id: tgUser.id,
      first_name: tgUser.first_name || "",
      username: tgUser.username || "",
      language: null,
      created_at: Date.now()
    };

    await saveUser(env, user);
  }

  return user;
}


// ===============================
// Language
// ===============================

const TEXTS = {
  fa: {
    selectLanguage: "🌐 لطفاً زبان خود را انتخاب کنید:",

    welcome:
      "🎬 به ربات فیلم خوش آمدید!\n\n" +
      "از گزینه‌های پایین صفحه استفاده کنید.",

    joinRequired:
      "📢 برای استفاده از ربات ابتدا باید در کانال ما عضو شوید.",

    joinChannel: "📢 عضویت در کانال",

    checkMembership: "✅ بررسی عضویت",

    membershipSuccess:
      "✅ عضویت شما تأیید شد.\n\n" +
      "حالا می‌توانید از ربات استفاده کنید.",

    membershipFailed:
      "❌ هنوز عضویت شما تأیید نشده است.\n\n" +
      "ابتدا در کانال عضو شوید و سپس دوباره «بررسی عضویت» را بزنید.",

    getMovie: "🎬 دریافت فیلم",
    sendMovie: "📤 ارسال فیلم",
    changeLanguage: "🌐 تغییر زبان",
    adminPanel: "👑 پنل مدیریت",

    sendMovieHelp:
      "📤 فیلمی که می‌خواهید به آرشیو اضافه شود را همینجا ارسال کنید.\n\n" +
      "فیلم ابتدا برای مدیر ارسال می‌شود و بعد از تأیید وارد آرشیو خواهد شد.",

    movieReceived:
      "✅ فیلم شما دریافت شد.\n\n" +
      "پس از بررسی مدیر، در صورت تأیید به آرشیو اضافه خواهد شد.",

    movieApproved:
      "✅ فیلم شما توسط مدیر تأیید شد و به آرشیو اضافه شد. 🎬",

    movieRejected:
      "❌ فیلم شما توسط مدیر رد شد.",

    noMovies:
      "🎬 موجودی فیلم برای شما به پایان رسیده است.\n\n" +
      "نگران نباشید! 😊\n" +
      "شما می‌توانید با ارسال فیلم‌های خود، به آرشیو ربات کمک کنید و فیلم‌های جدیدی به مجموعه اضافه کنید. 🍿🎥\n\n" +
      "📤 برای ارسال فیلم، روی گزینه «ارسال فیلم» بزنید.",

    alreadyRated:
      "⭐ شما قبلاً به این فیلم امتیاز داده‌اید.",

    ratingSaved:
      "⭐ امتیاز شما با موفقیت ثبت شد. ممنون از نظرتان!",

    adminOnly:
      "❌ این بخش فقط برای مدیر قابل دسترسی است.",

    adminPanelTitle:
      "👑 پنل مدیریت\n\n" +
      "یکی از گزینه‌های زیر را انتخاب کنید:",

    stats:
      "📊 آمار ربات\n\n",

    pendingEmpty:
      "📭 در حال حاضر فیلمی برای بررسی وجود ندارد.",

    pendingMovie:
      "📤 فیلم جدید برای بررسی\n\n" +
      "یکی از گزینه‌های زیر را انتخاب کنید:",

    approved:
      "✅ فیلم تأیید شد و به آرشیو اضافه شد.",

    rejected:
      "❌ فیلم رد شد.",

    invalid:
      "❌ این گزینه معتبر نیست.",

    languageChanged:
      "🌐 زبان با موفقیت تغییر کرد."
  },

  en: {
    selectLanguage: "🌐 Please choose your language:",

    welcome:
      "🎬 Welcome to the movie bot!\n\n" +
      "Use the buttons at the bottom of the chat.",

    joinRequired:
      "📢 Please join our channel before using the bot.",

    joinChannel: "📢 Join Channel",

    checkMembership: "✅ Check Membership",

    membershipSuccess:
      "✅ Your membership has been verified.\n\n" +
      "You can now use the bot.",

    membershipFailed:
      "❌ Your membership has not been verified yet.\n\n" +
      "Please join the channel and then tap “Check Membership” again.",

    getMovie: "🎬 Get Movie",
    sendMovie: "📤 Send Movie",
    changeLanguage: "🌐 Change Language",
    adminPanel: "👑 Admin Panel",

    sendMovieHelp:
      "📤 Send the movie you want to add to the archive here.\n\n" +
      "The movie will first be sent to the admin for review and will be added to the archive after approval.",

    movieReceived:
      "✅ Your movie has been received.\n\n" +
      "It will be added to the archive if the admin approves it.",

    movieApproved:
      "✅ Your movie was approved by the admin and added to the archive. 🎬",

    movieRejected:
      "❌ Your movie was rejected by the admin.",

    noMovies:
      "🎬 The available movies have run out for you.\n\n" +
      "Don’t worry! 😊\n" +
      "You can help expand the bot’s archive by sending your own movies and adding new titles to the collection. 🍿🎥\n\n" +
      "📤 To send a movie, simply tap “Send Movie”.",

    alreadyRated:
      "⭐ You have already rated this movie.",

    ratingSaved:
      "⭐ Your rating has been saved successfully. Thank you!",

    adminOnly:
      "❌ This section is available to the admin only.",

    adminPanelTitle:
      "👑 Admin Panel\n\n" +
      "Choose an option below:",

    stats:
      "📊 Bot Statistics\n\n",

    pendingEmpty:
      "📭 There are currently no movies waiting for review.",

    pendingMovie:
      "📤 New movie waiting for review\n\n" +
      "Choose an action below:",

    approved:
      "✅ Movie approved and added to the archive.",

    rejected:
      "❌ Movie rejected.",

    invalid:
      "❌ Invalid option.",

    languageChanged:
      "🌐 Language changed successfully."
  }
};


function t(language, key) {
  const lang = TEXTS[language] ? language : "fa";
  return TEXTS[lang][key] || key;
      }
// ===============================
// Main Reply Keyboard
// ===============================

function mainKeyboard(language, isAdmin) {
  const buttons = [
    [
      {
        text: t(language, "getMovie")
      },
      {
        text: t(language, "sendMovie")
      }
    ],
    [
      {
        text: t(language, "changeLanguage")
      }
    ]
  ];

  if (isAdmin) {
    buttons.push([
      {
        text: t(language, "adminPanel")
      }
    ]);
  }

  return {
    keyboard: buttons,
    resize_keyboard: true,
    is_persistent: true
  };
}


async function showMainMenu(env, chatId, user) {
  const isAdmin =
    String(user.id) === String(env.ADMIN_ID);

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(user.language || "fa", "welcome"),
    reply_markup: mainKeyboard(
      user.language || "fa",
      isAdmin
    )
  });
}


// ===============================
// Language Menu
// ===============================

async function showLanguageMenu(env, chatId) {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: TEXTS.fa.selectLanguage,
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
}


// ===============================
// Membership
// ===============================

async function isMember(env, userId) {
  try {
    const result = await telegram(
      env,
      "getChatMember",
      {
        chat_id: env.CHANNEL_ID,
        user_id: userId
      }
    );

    if (!result.ok) {
      return false;
    }

    const status = result.result.status;

    return [
      "creator",
      "administrator",
      "member"
    ].includes(status);
  } catch (error) {
    console.error("Membership error:", error);
    return false;
  }
}


async function sendJoinMessage(env, chatId, language) {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(language, "joinRequired"),
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: t(language, "joinChannel"),
            url: env.CHANNEL_LINK
          }
        ],
        [
          {
            text: t(language, "checkMembership"),
            callback_data: "membership:check"
          }
        ]
      ]
    }
  });
}


async function requireMembership(env, message, user) {
  const member = await isMember(
    env,
    message.from.id
  );

  if (!member) {
    await sendJoinMessage(
      env,
      message.chat.id,
      user.language || "fa"
    );

    return false;
  }

  return true;
}


// ===============================
// State
// ===============================

async function getState(env, userId) {
  return await getKV(
    env,
    `state:${userId}`,
    null
  );
}

async function setState(env, userId, state) {
  await putKV(
    env,
    `state:${userId}`,
    state
  );
}

async function clearState(env, userId) {
  await deleteKV(
    env,
    `state:${userId}`
  );
            }
// ===============================
// Movies
// ===============================

async function getMovie(env, movieId) {
  return await getKV(
    env,
    `movie:${movieId}`,
    null
  );
}

async function saveMovie(env, movie) {
  await putKV(
    env,
    `movie:${movie.id}`,
    movie
  );

  await addToArray(
    env,
    "movies:index",
    movie.id
  );
}

async function getMovies(env) {
  const ids = await getArray(
    env,
    "movies:index"
  );

  const movies = [];

  for (const id of ids) {
    const movie = await getMovie(env, id);

    if (movie) {
      movies.push(movie);
    }
  }

  return movies;
}


function randomItem(array) {
  if (!array.length) {
    return null;
  }

  return array[
    Math.floor(Math.random() * array.length)
  ];
}


// ===============================
// Send Movie
// ===============================

async function sendMovieToUser(
  env,
  chatId,
  movie
) {
  let result;

  if (movie.type === "video") {
    result = await telegram(env, "sendVideo", {
      chat_id: chatId,
      video: movie.file_id,
      caption: movie.caption || ""
    });
  } else {
    result = await telegram(env, "sendDocument", {
      chat_id: chatId,
      document: movie.file_id,
      caption: movie.caption || ""
    });
  }

  return result;
}


async function handleGetMovie(
  env,
  message,
  user,
  ctx
) {
  const movies = await getMovies(env);

  if (!movies.length) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(
        user.language,
        "noMovies"
      ),
      reply_markup: mainKeyboard(
        user.language,
        String(user.id) === String(env.ADMIN_ID)
      )
    });

    return;
  }

  const movie = randomItem(movies);

  const result = await sendMovieToUser(
    env,
    message.chat.id,
    movie
  );

  if (!result.ok) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t(user.language, "noMovies"),
      reply_markup: mainKeyboard(
        user.language,
        String(user.id) === String(env.ADMIN_ID)
      )
    });

    return;
  }

  const sentMessageId =
    result.result.message_id;

  await telegram(env, "sendMessage", {
    chat_id: message.chat.id,
    text: user.language === "en"
      ? "⭐ Rate this movie:"
      : "⭐ به این فیلم امتیاز بدهید:",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⭐", callback_data: `rate:${movie.id}:1` },
          { text: "⭐⭐", callback_data: `rate:${movie.id}:2` },
          { text: "⭐⭐⭐", callback_data: `rate:${movie.id}:3` },
          { text: "⭐⭐⭐⭐", callback_data: `rate:${movie.id}:4` },
          { text: "⭐⭐⭐⭐⭐", callback_data: `rate:${movie.id}:5` }
        ]
      ]
    }
  });

  // Delete movie message after approximately 20 seconds.
  ctx.waitUntil(
    new Promise(resolve => {
      setTimeout(async () => {
        try {
          await telegram(
            env,
            "deleteMessage",
            {
              chat_id: message.chat.id,
              message_id: sentMessageId
            }
          );
        } catch (error) {
          console.error(
            "Delete movie error:",
            error
          );
        }

        resolve();
      }, 20000);
    })
  );
    }
// ===============================
// Ratings
// ===============================

async function hasRated(
  env,
  userId,
  movieId
) {
  return await getKV(
    env,
    `rating:user:${userId}:${movieId}`,
    null
  );
}


async function saveRating(
  env,
  userId,
  movieId,
  rating
) {
  await putKV(
    env,
    `rating:user:${userId}:${movieId}`,
    {
      user_id: userId,
      movie_id: movieId,
      rating,
      created_at: Date.now()
    }
  );

  const movieRatings =
    await getKV(
      env,
      `rating:${movieId}`,
      []
    );

  const ratings = Array.isArray(movieRatings)
    ? movieRatings
    : [];

  ratings.push({
    user_id: userId,
    rating,
    created_at: Date.now()
  });

  await putKV(
    env,
    `rating:${movieId}`,
    ratings
  );
}


async function handleRating(
  env,
  query
) {
  const userId = query.from.id;

  const parts = query.data.split(":");

  const movieId = parts[1];
  const rating = Number(parts[2]);

  if (
    !movieId ||
    !rating ||
    rating < 1 ||
    rating > 5
  ) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id,
        text: "Invalid rating."
      }
    );

    return;
  }

  const alreadyRated =
    await hasRated(
      env,
      userId,
      movieId
    );

  if (alreadyRated) {
    const user =
      await getUser(env, userId);

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id,
        text: t(
          user?.language || "fa",
          "alreadyRated"
        ),
        show_alert: true
      }
    );

    return;
  }

  await saveRating(
    env,
    userId,
    movieId,
    rating
  );

  const user =
    await getUser(env, userId);

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id: query.id,
      text: t(
        user?.language || "fa",
        "ratingSaved"
      ),
      show_alert: true
    }
  );
}


// ===============================
// Rating Statistics
// ===============================

async function countRatings(env) {
  const movieIds =
    await getArray(
      env,
      "movies:index"
    );

  let total = 0;

  for (const movieId of movieIds) {
    const ratings =
      await getKV(
        env,
        `rating:${movieId}`,
        []
      );

    if (Array.isArray(ratings)) {
      total += ratings.length;
    }
  }

  return total;
}
// ===============================
// Pending Movies
// ===============================

async function getPending(
  env,
  movieId
) {
  return await getKV(
    env,
    `pending:${movieId}`,
    null
  );
}


async function savePending(
  env,
  movie
) {
  await putKV(
    env,
    `pending:${movie.id}`,
    movie
  );
}


async function getPendingMovies(env) {
  const keys =
    await env.BOT_DATA.list({
      prefix: "pending:"
    });

  const movies = [];

  for (const key of keys.keys) {
    const movie =
      await getPending(
        env,
        key.name.replace("pending:", "")
      );

    if (movie) {
      movies.push(movie);
    }
  }

  return movies;
}


// ===============================
// Receive User Movie
// ===============================

async function handleUserMovie(
  env,
  message,
  user
) {
  let type = null;
  let fileId = null;

  if (message.video) {
    type = "video";
    fileId = message.video.file_id;
  } else if (message.document) {
    type = "document";
    fileId = message.document.file_id;
  }

  if (!fileId) {
    return false;
  }

  const movieId =
    `${message.from.id}_${message.message_id}_${Date.now()}`;

  const pending = {
    id: movieId,
    type,
    file_id: fileId,
    caption:
      message.caption || "",
    user_id: message.from.id,
    chat_id: message.chat.id,
    created_at: Date.now()
  };

  await savePending(
    env,
    pending
  );

  // Send confirmation to user.
  await telegram(env, "sendMessage", {
    chat_id: message.chat.id,
    text: t(
      user.language,
      "movieReceived"
    ),
    reply_markup: mainKeyboard(
      user.language,
      String(user.id) === String(env.ADMIN_ID)
    )
  });

  // Send movie to admin.
  let adminResult;

  if (type === "video") {
    adminResult = await telegram(
      env,
      "sendVideo",
      {
        chat_id: env.ADMIN_ID,
        video: fileId,
        caption:
          `📤 ${user.language === "en" ? "New movie submission" : "فیلم جدید"}\n\n` +
          `👤 User ID: ${message.from.id}\n` +
          (message.from.username
            ? `🔹 @${message.from.username}`
            : ""),
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ تأیید",
                callback_data:
                  `approve:${movieId}`
              },
              {
                text: "❌ رد",
                callback_data:
                  `reject:${movieId}`
              }
            ]
          ]
        }
      }
    );
  } else {
    adminResult = await telegram(
      env,
      "sendDocument",
      {
        chat_id: env.ADMIN_ID,
        document: fileId,
        caption:
          `📤 ${user.language === "en" ? "New movie submission" : "فیلم جدید"}\n\n` +
          `👤 User ID: ${message.from.id}\n` +
          (message.from.username
            ? `🔹 @${message.from.username}`
            : ""),
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ تأیید",
                callback_data:
                  `approve:${movieId}`
              },
              {
                text: "❌ رد",
                callback_data:
                  `reject:${movieId}`
              }
            ]
          ]
        }
      }
    );
  }

  if (adminResult.ok) {
    pending.admin_message_id =
      adminResult.result.message_id;

    await savePending(
      env,
      pending
    );
  }

  return true;
}
// ===============================
// Approve Movie
// ===============================

async function approveMovie(
  env,
  query,
  movieId
) {
  const pending =
    await getPending(
      env,
      movieId
    );

  if (!pending) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id,
        text: "این فیلم دیگر در انتظار بررسی نیست.",
        show_alert: true
      }
    );

    return;
  }

  const movie = {
    id: pending.id,
    type: pending.type,
    file_id: pending.file_id,
    caption: pending.caption,
    added_by: pending.user_id,
    created_at: Date.now()
  };

  await saveMovie(
    env,
    movie
  );

  await deleteKV(
    env,
    `pending:${movieId}`
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id: query.id,
      text: "✅ فیلم تأیید شد."
    }
  );

  await telegram(
    env,
    "editMessageReplyMarkup",
    {
      chat_id: env.ADMIN_ID,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: []
      }
    }
  );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id: pending.user_id,
      text: t(
        (
          await getUser(
            env,
            pending.user_id
          )
        )?.language || "fa",
        "movieApproved"
      )
    }
  );
}


// ===============================
// Reject Movie
// ===============================

async function rejectMovie(
  env,
  query,
  movieId
) {
  const pending =
    await getPending(
      env,
      movieId
    );

  if (!pending) {
    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id,
        text: "این فیلم دیگر در انتظار بررسی نیست.",
        show_alert: true
      }
    );

    return;
  }

  await deleteKV(
    env,
    `pending:${movieId}`
  );

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id: query.id,
      text: "❌ فیلم رد شد."
    }
  );

  await telegram(
    env,
    "editMessageReplyMarkup",
    {
      chat_id: env.ADMIN_ID,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: []
      }
    }
  );

  const user =
    await getUser(
      env,
      pending.user_id
    );

  await telegram(
    env,
    "sendMessage",
    {
      chat_id: pending.user_id,
      text: t(
        user?.language || "fa",
        "movieRejected"
      )
    }
  );
}


// ===============================
// Admin Statistics
// ===============================

async function adminStats(env) {
  const users =
    await getArray(
      env,
      "users:index"
    );

  const movies =
    await getArray(
      env,
      "movies:index"
    );

  const pending =
    await getPendingMovies(env);

  const ratings =
    await countRatings(env);

  return {
    users: users.length,
    movies: movies.length,
    pending: pending.length,
    ratings
  };
}


async function showAdminPanel(
  env,
  chatId,
  language
) {
  await telegram(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text: t(
        language,
        "adminPanelTitle"
      ),
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📊 آمار",
              callback_data: "admin:stats"
            }
          ],
          [
            {
              text: "📭 فیلم‌های در انتظار",
              callback_data: "admin:pending"
            }
          ]
        ]
      }
    }
  );
}


async function showAdminStats(
  env,
  chatId,
  language
) {
  const stats =
    await adminStats(env);

  const text =
    t(language, "stats") +
    `👥 Users: ${stats.users}\n` +
    `🎬 Movies: ${stats.movies}\n` +
    `📭 Pending: ${stats.pending}\n` +
    `⭐ Ratings: ${stats.ratings}`;

  await telegram(
    env,
    "sendMessage",
    {
      chat_id: chatId,
      text
    }
  );
}


async function showPendingMovies(
  env,
  chatId,
  language
) {
  const pending =
    await getPendingMovies(env);

  if (!pending.length) {
    await telegram(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text: t(
          language,
          "pendingEmpty"
        )
      }
    );

    return;
  }

  for (const movie of pending) {
    const caption =
      t(language, "pendingMovie") +
      `\n\n👤 User ID: ${movie.user_id}`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "✅ تأیید",
            callback_data:
              `approve:${movie.id}`
          },
          {
            text: "❌ رد",
            callback_data:
              `reject:${movie.id}`
          }
        ]
      ]
    };

    if (movie.type === "video") {
      await telegram(
        env,
        "sendVideo",
        {
          chat_id: chatId,
          video: movie.file_id,
          caption,
          reply_markup: keyboard
        }
      );
    } else {
      await telegram(
        env,
        "sendDocument",
        {
          chat_id: chatId,
          document: movie.file_id,
          caption,
          reply_markup: keyboard
        }
      );
    }
  }
}
// ===============================
// Handle Messages
// ===============================

async function handleMessage(
  message,
  env,
  ctx
) {
  if (!message.from) {
    return;
  }

  const user =
    await ensureUser(
      env,
      message
    );

  const text =
    message.text || "";

  // -------------------------------
  // /start
  // -------------------------------

  if (text === "/start") {
    await clearState(
      env,
      message.from.id
    );

    if (!user.language) {
      await showLanguageMenu(
        env,
        message.chat.id
      );

      return;
    }

    const member =
      await isMember(
        env,
        message.from.id
      );

    if (!member) {
      await sendJoinMessage(
        env,
        message.chat.id,
        user.language
      );

      return;
    }

    await showMainMenu(
      env,
      message.chat.id,
      user
    );

    return;
  }


  // -------------------------------
  // Language buttons
  // -------------------------------

  if (
    text === "🎬 دریافت فیلم" ||
    text === "🎬 Get Movie"
  ) {
    const allowed =
      await requireMembership(
        env,
        message,
        user
      );

    if (!allowed) {
      return;
    }

    await handleGetMovie(
      env,
      message,
      user,
      ctx
    );

    return;
  }


  if (
    text === "📤 ارسال فیلم" ||
    text === "📤 Send Movie"
  ) {
    const allowed =
      await requireMembership(
        env,
        message,
        user
      );

    if (!allowed) {
      return;
    }

    await setState(
      env,
      message.from.id,
      {
        action: "waiting_movie"
      }
    );

    await telegram(
      env,
      "sendMessage",
      {
        chat_id: message.chat.id,
        text: t(
          user.language,
          "sendMovieHelp"
        ),
        reply_markup: mainKeyboard(
          user.language,
          String(user.id) ===
            String(env.ADMIN_ID)
        )
      }
    );

    return;
  }


  if (
    text === "🌐 تغییر زبان" ||
    text === "🌐 Change Language"
  ) {
    await showLanguageMenu(
      env,
      message.chat.id
    );

    return;
  }


  if (
    text === "👑 پنل مدیریت" ||
    text === "👑 Admin Panel"
  ) {
    if (
      String(message.from.id) !==
      String(env.ADMIN_ID)
    ) {
      await telegram(
        env,
        "sendMessage",
        {
          chat_id: message.chat.id,
          text: t(
            user.language,
            "adminOnly"
          )
        }
      );

      return;
    }

    await showAdminPanel(
      env,
      message.chat.id,
      user.language
    );

    return;
  }


  // -------------------------------
  // Waiting for movie
  // -------------------------------

  const state =
    await getState(
      env,
      message.from.id
    );

  if (
    state &&
    state.action === "waiting_movie"
  ) {
    const allowed =
      await requireMembership(
        env,
        message,
        user
      );

    if (!allowed) {
      return;
    }

    const received =
      await handleUserMovie(
        env,
        message,
        user
      );

    if (received) {
      await clearState(
        env,
        message.from.id
      );
    }

    return;
  }
}


// ===============================
// Handle Callback Queries
// ===============================

async function handleCallback(
  query,
  env,
  ctx
) {
  const data =
    query.data || "";

  const userId =
    query.from.id;

  // -------------------------------
  // Language
  // -------------------------------

  if (data.startsWith("lang:")) {
    const language =
      data.split(":")[1];

    if (
      language !== "fa" &&
      language !== "en"
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: query.id,
          text: "Invalid language."
        }
      );

      return;
    }

    let user =
      await getUser(
        env,
        userId
      );

    if (!user) {
      user = {
        id: userId,
        first_name:
          query.from.first_name || "",
        username:
          query.from.username || "",
        language,
        created_at: Date.now()
      };
    } else {
      user.language = language;
    }

    await saveUser(
      env,
      user
    );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id,
        text: t(
          language,
          "languageChanged"
        )
      }
    );

    await telegram(
      env,
      "deleteMessage",
      {
        chat_id: query.message.chat.id,
        message_id:
          query.message.message_id
      }
    );

    const member =
      await isMember(
        env,
        userId
      );

    if (!member) {
      await sendJoinMessage(
        env,
        query.message.chat.id,
        language
      );

      return;
    }

    await showMainMenu(
      env,
      query.message.chat.id,
      user
    );

    return;
  }


  // -------------------------------
  // Membership check
  // -------------------------------

  if (
    data === "membership:check"
  ) {
    const user =
      await getUser(
        env,
        userId
      );

    const language =
      user?.language || "fa";

    const member =
      await isMember(
        env,
        userId
      );

    if (member) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: query.id,
          text: t(
            language,
            "membershipSuccess"
          )
        }
      );

      await telegram(
        env,
        "deleteMessage",
        {
          chat_id:
            query.message.chat.id,
          message_id:
            query.message.message_id
        }
      );

      await showMainMenu(
        env,
        query.message.chat.id,
        user
      );
    } else {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: query.id,
          text: t(
            language,
            "membershipFailed"
          ),
          show_alert: true
        }
      );
    }

    return;
  }


  // -------------------------------
  // Rating
  // -------------------------------

  if (data.startsWith("rate:")) {
    await handleRating(
      env,
      query
    );

    return;
  }


  // -------------------------------
  // Admin security
  // -------------------------------

  if (
    data.startsWith("approve:") ||
    data.startsWith("reject:") ||
    data.startsWith("admin:")
  ) {
    if (
      String(userId) !==
      String(env.ADMIN_ID)
    ) {
      await telegram(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: query.id,
          text: "❌ فقط مدیر می‌تواند این کار را انجام دهد.",
          show_alert: true
        }
      );

      return;
    }
  }


  // -------------------------------
  // Approve
  // -------------------------------

  if (data.startsWith("approve:")) {
    const movieId =
      data.substring(
        "approve:".length
      );

    await approveMovie(
      env,
      query,
      movieId
    );

    return;
  }


  // -------------------------------
  // Reject
  // -------------------------------

  if (data.startsWith("reject:")) {
    const movieId =
      data.substring(
        "reject:".length
      );

    await rejectMovie(
      env,
      query,
      movieId
    );

    return;
  }


  // -------------------------------
  // Admin statistics
  // -------------------------------

  if (data === "admin:stats") {
    const user =
      await getUser(
        env,
        userId
      );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id
      }
    );

    await showAdminStats(
      env,
      query.message.chat.id,
      user?.language || "fa"
    );

    return;
  }


  // -------------------------------
  // Admin pending movies
  // -------------------------------

  if (data === "admin:pending") {
    const user =
      await getUser(
        env,
        userId
      );

    await telegram(
      env,
      "answerCallbackQuery",
      {
        callback_query_id: query.id
      }
    );

    await showPendingMovies(
      env,
      query.message.chat.id,
      user?.language || "fa"
    );

    return;
  }


  // -------------------------------
  // Invalid callback
  // -------------------------------

  await telegram(
    env,
    "answerCallbackQuery",
    {
      callback_query_id: query.id,
      text: "Invalid option."
    }
  );
  }
