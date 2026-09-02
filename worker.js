const API = "https://api.telegram.org/bot";

async function telegram(env, method, data = {}) {
  const response = await fetch(`${API}${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}

async function getKV(env, key) {
  const value = await env.BOT_DATA.get(key);

  if (value === null || value === undefined) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function putKV(env, key, value) {
  await env.BOT_DATA.put(key, JSON.stringify(value));
}

async function deleteKV(env, key) {
  await env.BOT_DATA.delete(key);
}

async function getArray(env, key) {
  const value = await getKV(env, key);
  return Array.isArray(value) ? value : [];
}

async function saveArray(env, key, array) {
  await putKV(env, key, array);
}

function isAdmin(userId, env) {
  return String(userId) === String(env.ADMIN_ID);
}

function getLanguage(user) {
  return user && user.language === "en" ? "en" : "fa";
}

function t(language, key) {
  const texts = {
    fa: {
      chooseLanguage: "🌐 زبان خود را انتخاب کنید:",
      languageSaved: "✅ زبان فارسی انتخاب شد.",
      englishSaved: "✅ English selected.",
      joinRequired: "🔒 برای استفاده از ربات ابتدا باید عضو کانال شوید.",
      joinButton: "📢 عضویت در کانال",
      checkMembership: "✅ بررسی عضویت",
      notMember: "❌ هنوز عضویت شما تأیید نشده است.\nابتدا در کانال عضو شوید و سپس «بررسی عضویت» را بزنید.",
      memberConfirmed: "✅ عضویت شما تأیید شد.",
      mainWelcome: "🎬 به ربات فیلم خوش آمدید.\n\nیکی از گزینه‌های زیر را انتخاب کنید:",
      getMovie: "🎬 دریافت فیلم",
      sendMovie: "📤 ارسال فیلم",
      changeLanguage: "🌐 تغییر زبان",
      adminPanel: "👑 پنل مدیریت",
      sendMoviePrompt: "📤 فیلمی که می‌خواهید ارسال کنید را همینجا بفرستید.\n\nفقط ویدئو یا فایل فیلم ارسال کنید.",
      movieReceived: "✅ فیلم شما دریافت شد و برای بررسی مدیر ارسال شد.",
      invalidMovie: "❌ لطفاً فقط ویدئو یا فایل فیلم ارسال کنید.",
      noMovies: "🎬 موجودی فیلم برای شما به پایان رسیده است.\n\nنگران نباشید! 😊\nشما می‌توانید با ارسال فیلم‌های خود، به آرشیو ربات کمک کنید و فیلم‌های جدیدی به مجموعه اضافه کنید. 🍿🎥\n\n📤 برای ارسال فیلم، روی گزینه «ارسال فیلم» بزنید.",
      rateMovie: "⭐ به این فیلم امتیاز دهید:",
      rated: "⭐ امتیاز شما ثبت شد. ممنون!",
      alreadyRated: "⭐ شما قبلاً به این فیلم امتیاز داده‌اید.",
      adminOnly: "⛔ این بخش فقط برای مدیر است.",
      adminTitle: "👑 پنل مدیریت",
      statistics: "📊 آمار",
      pendingMovies: "📥 فیلم‌های در انتظار بررسی",
      back: "🔙 بازگشت",
      statsText: "📊 آمار ربات\n\n👥 کاربران: {users}\n🎬 فیلم‌ها: {movies}\n📥 در انتظار بررسی: {pending}\n⭐ تعداد امتیازها: {ratings}",
      noPending: "📭 فیلمی در انتظار بررسی نیست.",
      approve: "✅ تأیید",
      reject: "❌ رد",
      movieApproved: "✅ فیلم تأیید و به آرشیو اضافه شد.",
      movieRejected: "❌ فیلم رد شد.",
      approvalCaption: "📥 فیلم جدید برای بررسی\n\nفرستنده: {name}\nشناسه: {id}",
      error: "❌ مشکلی پیش آمد. لطفاً دوباره تلاش کنید."
    },

    en: {
      chooseLanguage: "🌐 Choose your language:",
      languageSaved: "✅ فارسی selected.",
      englishSaved: "✅ English selected.",
      joinRequired: "🔒 You must join the channel before using the bot.",
      joinButton: "📢 Join Channel",
      checkMembership: "✅ Check Membership",
      notMember: "❌ Your membership has not been confirmed yet.\nJoin the channel first, then tap “Check Membership”.",
      memberConfirmed: "✅ Your membership has been confirmed.",
      mainWelcome: "🎬 Welcome to the movie bot.\n\nChoose one of the options below:",
      getMovie: "🎬 Get Movie",
      sendMovie: "📤 Send Movie",
      changeLanguage: "🌐 Change Language",
      adminPanel: "👑 Admin Panel",
      sendMoviePrompt: "📤 Send the movie you want to submit here.\n\nPlease send only a video or movie file.",
      movieReceived: "✅ Your movie was received and sent to the admin for review.",
      invalidMovie: "❌ Please send only a video or movie file.",
      noMovies: "🎬 The available movies have run out for you.\n\nDon’t worry! 😊\nYou can help expand the bot’s archive by sending your own movies and adding new titles to the collection. 🍿🎥\n\n📤 To send a movie, simply tap “Send Movie”.",
      rateMovie: "⭐ Rate this movie:",
      rated: "⭐ Your rating has been saved. Thank you!",
      alreadyRated: "⭐ You have already rated this movie.",
      adminOnly: "⛔ This section is for the admin only.",
      adminTitle: "👑 Admin Panel",
      statistics: "📊 Statistics",
      pendingMovies: "📥 Pending Movies",
      back: "🔙 Back",
      statsText: "📊 Bot Statistics\n\n👥 Users: {users}\n🎬 Movies: {movies}\n📥 Pending: {pending}\n⭐ Ratings: {ratings}",
      noPending: "📭 There are no pending movies.",
      approve: "✅ Approve",
      reject: "❌ Reject",
      movieApproved: "✅ Movie approved and added to the archive.",
      movieRejected: "❌ Movie rejected.",
      approvalCaption: "📥 New movie for review\n\nSender: {name}\nID: {id}",
      error: "❌ Something went wrong. Please try again."
    }
  };

  return texts[language]?.[key] ?? texts.fa[key] ?? key;
}

function formatText(text, values) {
  let result = text;

  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }

  return result;
      }
function mainKeyboard(language, admin = false) {
  const keyboard = [
    [
      { text: t(language, "getMovie") },
      { text: t(language, "sendMovie") }
    ],
    [
      { text: t(language, "changeLanguage") }
    ]
  ];

  if (admin) {
    keyboard.push([
      { text: t(language, "adminPanel") }
    ]);
  }

  return {
    keyboard,
    resize_keyboard: true,
    is_persistent: true,
    one_time_keyboard: false
  };
}

function removeKeyboard() {
  return {
    remove_keyboard: true
  };
}

function languageKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "🇮🇷 فارسی", callback_data: "lang:fa" },
        { text: "🇬🇧 English", callback_data: "lang:en" }
      ]
    ]
  };
}

function membershipKeyboard(language) {
  return {
    inline_keyboard: [
      [
        {
          text: t(language, "joinButton"),
          url: envChannelLink
        }
      ],
      [
        {
          text: t(language, "checkMembership"),
          callback_data: "membership:check"
        }
      ]
    ]
  };
}

let envChannelLink = "";

async function getUser(env, userId) {
  return await getKV(env, `user:${userId}`);
}

async function saveUser(env, user) {
  await putKV(env, `user:${user.id}`, user);
}

async function ensureUser(env, from) {
  let user = await getUser(env, from.id);

  if (!user) {
    user = {
      id: from.id,
      first_name: from.first_name || "",
      username: from.username || "",
      language: null,
      joined: false,
      created_at: Date.now()
    };
  } else {
    user.first_name = from.first_name || user.first_name || "";
    user.username = from.username || user.username || "";
  }

  await saveUser(env, user);
  return user;
}

async function getState(env, userId) {
  return await getKV(env, `state:${userId}`);
}

async function setState(env, userId, state) {
  await putKV(env, `state:${userId}`, state);
}

async function clearState(env, userId) {
  await deleteKV(env, `state:${userId}`);
}

async function getUsers(env) {
  return await getArray(env, "users");
}

async function registerUser(env, userId) {
  const users = await getUsers(env);

  if (!users.includes(String(userId))) {
    users.push(String(userId));
    await saveArray(env, "users", users);
  }
}

async function getMovies(env) {
  return await getArray(env, "movies");
}

async function saveMovies(env, movies) {
  await saveArray(env, "movies", movies);
}

async function getPendingMovies(env) {
  return await getArray(env, "pending_movies");
}

async function savePendingMovies(env, pending) {
  await saveArray(env, "pending_movies", pending);
}

async function getRatings(env) {
  return await getArray(env, "ratings");
}

async function saveRatings(env, ratings) {
  await saveArray(env, "ratings", ratings);
}
async function isMember(env, userId) {
  try {
    const result = await telegram(env, "getChatMember", {
      chat_id: env.CHANNEL_ID,
      user_id: userId
    });

    if (!result.ok) {
      return false;
    }

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

async function showLanguageMenu(env, chatId) {
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t("fa", "chooseLanguage"),
    reply_markup: languageKeyboard()
  });
}

async function showJoinMessage(env, chatId, language) {
  envChannelLink = env.CHANNEL_LINK || "";

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(language, "joinRequired"),
    reply_markup: membershipKeyboard(language)
  });
}

async function showMainMenu(env, chatId, language, admin) {
  /*
    اول کیبورد قبلی را حذف می‌کنیم تا منوی قدیمی تلگرام باقی نماند.
  */
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "\u2060",
    reply_markup: removeKeyboard()
  });

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(language, "mainWelcome"),
    reply_markup: mainKeyboard(language, admin)
  });
}

async function sendText(env, chatId, text, replyMarkup = undefined) {
  const data = {
    chat_id: chatId,
    text
  };

  if (replyMarkup) {
    data.reply_markup = replyMarkup;
  }

  return await telegram(env, "sendMessage", data);
}

function getMovieFileId(movie) {
  if (!movie) {
    return null;
  }

  return movie.file_id || movie.fileId || null;
}

function getMovieType(movie) {
  if (!movie) {
    return "video";
  }

  return movie.type || "video";
}

async function sendMovie(env, chatId, movie) {
  const fileId = getMovieFileId(movie);

  if (!fileId) {
    return null;
  }

  const type = getMovieType(movie);

  if (type === "document") {
    return await telegram(env, "sendDocument", {
      chat_id: chatId,
      document: fileId,
      caption: movie.caption || ""
    });
  }

  return await telegram(env, "sendVideo", {
    chat_id: chatId,
    video: fileId,
    caption: movie.caption || "",
    supports_streaming: true
  });
}

function ratingKeyboard(movieId) {
  return {
    inline_keyboard: [
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

function randomMovie(movies) {
  if (!movies.length) {
    return null;
  }

  const index = Math.floor(Math.random() * movies.length);
  return movies[index];
}
async function handleGetMovie(env, chatId, userId, language) {
  const movies = await getMovies(env);

  if (!movies.length) {
    await sendText(env, chatId, t(language, "noMovies"));
    return;
  }

  const movie = randomMovie(movies);

  if (!movie) {
    await sendText(env, chatId, t(language, "noMovies"));
    return;
  }

  const sent = await sendMovie(env, chatId, movie);

  if (!sent || !sent.ok) {
    await sendText(env, chatId, t(language, "error"));
    return;
  }

  const movieMessageId = sent.result.message_id;

  const ratingMessage = await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(language, "rateMovie"),
    reply_markup: ratingKeyboard(movie.id)
  });

  /*
    خود فیلم بعد از ۲۰ ثانیه حذف می‌شود.
    فیلم از آرشیو حذف نمی‌شود.
  */
  await new Promise(resolve => setTimeout(resolve, 20000));

  await telegram(env, "deleteMessage", {
    chat_id: chatId,
    message_id: movieMessageId
  });

  /*
    پیام امتیازدهی هم در صورت وجود، حذف می‌شود.
  */
  if (ratingMessage?.ok) {
    await telegram(env, "deleteMessage", {
      chat_id: chatId,
      message_id: ratingMessage.result.message_id
    });
  }
}

async function hasRated(env, userId, movieId) {
  const ratings = await getRatings(env);

  return ratings.some(
    item =>
      String(item.user_id) === String(userId) &&
      String(item.movie_id) === String(movieId)
  );
}

async function saveRating(env, userId, movieId, rating) {
  const ratings = await getRatings(env);

  ratings.push({
    user_id: String(userId),
    movie_id: String(movieId),
    rating: Number(rating),
    created_at: Date.now()
  });

  await saveRatings(env, ratings);
}

async function handleRating(env, callbackQuery, movieId, rating) {
  const userId = callbackQuery.from.id;
  const chatId = callbackQuery.message.chat.id;

  const already = await hasRated(env, userId, movieId);

  if (already) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: "⭐ " + t("fa", "alreadyRated"),
      show_alert: true
    });

    return;
  }

  await saveRating(env, userId, movieId, rating);

  const user = await getUser(env, userId);
  const language = getLanguage(user);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackQuery.id,
    text: t(language, "rated")
  });

  if (callbackQuery.message) {
    await telegram(env, "editMessageReplyMarkup", {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      reply_markup: {
        inline_keyboard: []
      }
    });
  }
}

async function createMovieId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function handleUserMovie(env, message, user) {
  const chatId = message.chat.id;
  const language = getLanguage(user);

  let fileId = null;
  let type = null;

  if (message.video) {
    fileId = message.video.file_id;
    type = "video";
  } else if (message.document) {
    fileId = message.document.file_id;
    type = "document";
  }

  if (!fileId) {
    await sendText(env, chatId, t(language, "invalidMovie"));
    return;
  }

  const movieId = await createMovieId();

  const pendingMovie = {
    id: movieId,
    file_id: fileId,
    type,
    user_id: user.id,
    first_name: user.first_name || "",
    username: user.username || "",
    created_at: Date.now()
  };

  const pending = await getPendingMovies(env);
  pending.push(pendingMovie);
  await savePendingMovies(env, pending);

  await sendText(env, chatId, t(language, "movieReceived"));

  const senderName =
    user.first_name ||
    (user.username ? `@${user.username}` : String(user.id));

  const caption = formatText(
    t("fa", "approvalCaption"),
    {
      name: senderName,
      id: user.id
    }
  );

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: t("fa", "approve"),
          callback_data: `approve:${movieId}`
        },
        {
          text: t("fa", "reject"),
          callback_data: `reject:${movieId}`
        }
      ]
    ]
  };

  if (type === "document") {
    await telegram(env, "sendDocument", {
      chat_id: env.ADMIN_ID,
      document: fileId,
      caption,
      reply_markup: keyboard
    });
  } else {
    await telegram(env, "sendVideo", {
      chat_id: env.ADMIN_ID,
      video: fileId,
      caption,
      supports_streaming: true,
      reply_markup: keyboard
    });
  }
}
async function approveMovie(env, callbackQuery, movieId) {
  const pending = await getPendingMovies(env);

  const index = pending.findIndex(
    movie => String(movie.id) === String(movieId)
  );

  if (index === -1) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: "این فیلم قبلاً بررسی شده است.",
      show_alert: true
    });
    return;
  }

  const movie = pending[index];

  const movies = await getMovies(env);

  movies.push({
    id: movie.id,
    file_id: movie.file_id,
    type: movie.type,
    caption: "",
    added_at: Date.now()
  });

  await saveMovies(env, movies);

  pending.splice(index, 1);
  await savePendingMovies(env, pending);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackQuery.id,
    text: "✅ فیلم تأیید شد."
  });

  if (callbackQuery.message) {
    await telegram(env, "editMessageReplyMarkup", {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      reply_markup: {
        inline_keyboard: []
      }
    });
  }

  const user = await getUser(env, movie.user_id);

  if (user) {
    const language = getLanguage(user);

    await sendText(
      env,
      movie.user_id,
      t(language, "movieApproved")
    );
  }
}

async function rejectMovie(env, callbackQuery, movieId) {
  const pending = await getPendingMovies(env);

  const index = pending.findIndex(
    movie => String(movie.id) === String(movieId)
  );

  if (index === -1) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: "این فیلم قبلاً بررسی شده است.",
      show_alert: true
    });
    return;
  }

  const movie = pending[index];

  pending.splice(index, 1);
  await savePendingMovies(env, pending);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackQuery.id,
    text: "❌ فیلم رد شد."
  });

  if (callbackQuery.message) {
    await telegram(env, "editMessageReplyMarkup", {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      reply_markup: {
        inline_keyboard: []
      }
    });
  }

  const user = await getUser(env, movie.user_id);

  if (user) {
    const language = getLanguage(user);

    await sendText(
      env,
      movie.user_id,
      t(language, "movieRejected")
    );
  }
}

async function countRatings(env) {
  const ratings = await getRatings(env);
  return ratings.length;
}

async function showAdminPanel(env, chatId) {
  await sendText(env, chatId, t("fa", "adminTitle"), {
    inline_keyboard: [
      [
        {
          text: t("fa", "statistics"),
          callback_data: "admin:stats"
        }
      ],
      [
        {
          text: t("fa", "pendingMovies"),
          callback_data: "admin:pending"
        }
      ]
    ]
  });
}

async function showAdminStats(env, chatId) {
  const users = await getUsers(env);
  const movies = await getMovies(env);
  const pending = await getPendingMovies(env);
  const ratings = await countRatings(env);

  const text = formatText(t("fa", "statsText"), {
    users: users.length,
    movies: movies.length,
    pending: pending.length,
    ratings
  });

  await sendText(env, chatId, text, {
    inline_keyboard: [
      [
        {
          text: t("fa", "back"),
          callback_data: "admin:back"
        }
      ]
    ]
  });
}

async function showPendingMovies(env, chatId) {
  const pending = await getPendingMovies(env);

  if (!pending.length) {
    await sendText(env, chatId, t("fa", "noPending"));
    return;
  }

  for (const movie of pending) {
    const name =
      movie.first_name ||
      (movie.username ? `@${movie.username}` : String(movie.user_id));

    const caption = formatText(
      t("fa", "approvalCaption"),
      {
        name,
        id: movie.user_id
      }
    );

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: t("fa", "approve"),
            callback_data: `approve:${movie.id}`
          },
          {
            text: t("fa", "reject"),
            callback_data: `reject:${movie.id}`
          }
        ]
      ]
    };

    if (movie.type === "document") {
      await telegram(env, "sendDocument", {
        chat_id: chatId,
        document: movie.file_id,
        caption,
        reply_markup: keyboard
      });
    } else {
      await telegram(env, "sendVideo", {
        chat_id: chatId,
        video: movie.file_id,
        caption,
        supports_streaming: true,
        reply_markup: keyboard
      });
    }
  }
}
async function handleStart(env, message, user) {
  const chatId = message.chat.id;

  await clearState(env, user.id);

  if (!user.language) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: t("fa", "chooseLanguage"),
      reply_markup: languageKeyboard()
    });

    return;
  }

  const language = getLanguage(user);
  const member = await isMember(env, user.id);

  if (!member) {
    await showJoinMessage(env, chatId, language);
    return;
  }

  user.joined = true;
  await saveUser(env, user);

  await showMainMenu(
    env,
    chatId,
    language,
    isAdmin(user.id, env)
  );
}

async function handleButtonMessage(env, message, user) {
  const chatId = message.chat.id;
  const text = message.text || "";
  const language = getLanguage(user);

  /*
    این بخش عمداً متن دکمه‌ها را با زبان کاربر مقایسه می‌کند.
    بنابراین دکمه‌های فارسی و انگلیسی هر دو کار می‌کنند.
  */

  if (
    text === "🌐 تغییر زبان" ||
    text === "🌐 Change Language"
  ) {
    await clearState(env, user.id);

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: t(language, "chooseLanguage"),
      reply_markup: languageKeyboard()
    });

    return;
  }

  if (
    text === "🎬 دریافت فیلم" ||
    text === "🎬 Get Movie"
  ) {
    const member = await isMember(env, user.id);

    if (!member) {
      await showJoinMessage(env, chatId, language);
      return;
    }

    await clearState(env, user.id);
    await handleGetMovie(env, chatId, user.id, language);
    return;
  }

  if (
    text === "📤 ارسال فیلم" ||
    text === "📤 Send Movie"
  ) {
    const member = await isMember(env, user.id);

    if (!member) {
      await showJoinMessage(env, chatId, language);
      return;
    }

    await setState(env, user.id, {
      action: "waiting_movie"
    });

    await sendText(
      env,
      chatId,
      t(language, "sendMoviePrompt")
    );

    return;
  }

  if (
    text === "👑 پنل مدیریت" ||
    text === "👑 Admin Panel"
  ) {
    if (!isAdmin(user.id, env)) {
      await sendText(env, chatId, t(language, "adminOnly"));
      return;
    }

    await clearState(env, user.id);
    await showAdminPanel(env, chatId);
    return;
  }

  /*
    اگر کاربر در حالت ارسال فیلم باشد،
    پیام ویدئو/فایل را به بخش ارسال فیلم می‌فرستیم.
  */
  const state = await getState(env, user.id);

  if (state?.action === "waiting_movie") {
    if (message.video || message.document) {
      await handleUserMovie(env, message, user);
      await clearState(env, user.id);
      return;
    }

    await sendText(
      env,
      chatId,
      t(language, "invalidMovie")
    );

    return;
  }

  /*
    اگر پیام معمولی بود، منوی اصلی را دوباره نمایش می‌دهیم.
  */
  await showMainMenu(
    env,
    chatId,
    language,
    isAdmin(user.id, env)
  );
}

async function handleMessage(env, message) {
  if (!message || !message.from || !message.chat) {
    return;
  }

  const user = await ensureUser(env, message.from);

  await registerUser(env, user.id);

  const text = message.text || "";

  if (text === "/start") {
    await handleStart(env, message, user);
    return;
  }

  /*
    اگر زبان هنوز انتخاب نشده باشد،
    فقط منوی انتخاب زبان نمایش داده می‌شود.
  */
  if (!user.language) {
    await telegram(env, "sendMessage", {
      chat_id: message.chat.id,
      text: t("fa", "chooseLanguage"),
      reply_markup: languageKeyboard()
    });

    return;
  }

  const member = await isMember(env, user.id);

  if (!member) {
    await showJoinMessage(
      env,
      message.chat.id,
      getLanguage(user)
    );
    return;
  }

  user.joined = true;
  await saveUser(env, user);

  await handleButtonMessage(env, message, user);
}
async function handleCallback(env, callbackQuery) {
  if (!callbackQuery || !callbackQuery.from) {
    return;
  }

  const userId = callbackQuery.from.id;
  const data = callbackQuery.data || "";

  const user = await getUser(env, userId);

  if (!user) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: "ابتدا /start را بزنید.",
      show_alert: true
    });

    return;
  }

  /*
    انتخاب زبان
  */
  if (data === "lang:fa" || data === "lang:en") {
    const language = data === "lang:en" ? "en" : "fa";

    user.language = language;
    await saveUser(env, user);
    await clearState(env, userId);

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text:
        language === "en"
          ? t("en", "englishSaved")
          : t("fa", "languageSaved")
    });

    const member = await isMember(env, userId);

    if (!member) {
      await showJoinMessage(
        env,
        callbackQuery.message.chat.id,
        language
      );
      return;
    }

    user.joined = true;
    await saveUser(env, user);

    await showMainMenu(
      env,
      callbackQuery.message.chat.id,
      language,
      isAdmin(userId, env)
    );

    return;
  }

  /*
    بررسی عضویت
  */
  if (data === "membership:check") {
    const language = getLanguage(user);

    const member = await isMember(env, userId);

    if (!member) {
      await telegram(env, "answerCallbackQuery", {
        callback_query_id: callbackQuery.id,
        text: t(language, "notMember"),
        show_alert: true
      });

      return;
    }

    user.joined = true;
    await saveUser(env, user);

    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: t(language, "memberConfirmed")
    });

    await showMainMenu(
      env,
      callbackQuery.message.chat.id,
      language,
      isAdmin(userId, env)
    );

    return;
  }

  /*
    امتیاز فیلم
  */
  if (data.startsWith("rate:")) {
    const parts = data.split(":");

    const movieId = parts[1];
    const rating = Number(parts[2]);

    if (
      movieId &&
      Number.isInteger(rating) &&
      rating >= 1 &&
      rating <= 5
    ) {
      await handleRating(
        env,
        callbackQuery,
        movieId,
        rating
      );
    }

    return;
  }

  /*
    تمام عملیات مدیریتی فقط برای ADMIN_ID
  */
  if (
    data.startsWith("approve:") ||
    data.startsWith("reject:") ||
    data.startsWith("admin:")
  ) {
    if (!isAdmin(userId, env)) {
      await telegram(env, "answerCallbackQuery", {
        callback_query_id: callbackQuery.id,
        text: t(getLanguage(user), "adminOnly"),
        show_alert: true
      });

      return;
    }
  }

  if (data.startsWith("approve:")) {
    const movieId = data.substring("approve:".length);

    await approveMovie(
      env,
      callbackQuery,
      movieId
    );

    return;
  }

  if (data.startsWith("reject:")) {
    const movieId = data.substring("reject:".length);

    await rejectMovie(
      env,
      callbackQuery,
      movieId
    );

    return;
  }

  if (data === "admin:stats") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await showAdminStats(
      env,
      callbackQuery.message.chat.id
    );

    return;
  }

  if (data === "admin:pending") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await showPendingMovies(
      env,
      callbackQuery.message.chat.id
    );

    return;
  }

  if (data === "admin:back") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await showAdminPanel(
      env,
      callbackQuery.message.chat.id
    );

    return;
  }

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackQuery.id
  });
}

async function processUpdate(env, update) {
  try {
    if (update.message) {
      await handleMessage(env, update.message);
      return;
    }

    if (update.callback_query) {
      await handleCallback(env, update.callback_query);
      return;
    }
  } catch (error) {
    console.error("PROCESS UPDATE ERROR:", error);

    /*
      اگر خطایی رخ داد، تلاش می‌کنیم به کاربر پیام خطا بدهیم.
    */
    try {
      const chatId =
        update?.message?.chat?.id ||
        update?.callback_query?.message?.chat?.id;

      if (chatId) {
        await sendText(
          env,
          chatId,
          t("fa", "error")
        );
      }
    } catch {
      // ignore secondary error
    }
  }
      }
export default {
  async fetch(request, env, ctx) {
    /*
      GET برای تست Worker
    */
    if (request.method === "GET") {
      return new Response("Film Bot is running.", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=UTF-8"
        }
      });
    }

    /*
      تلگرام فقط باید POST بفرستد.
    */
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405
      });
    }

    try {
      const update = await request.json();

      /*
        پردازش را بدون نگه داشتن درخواست تلگرام انجام می‌دهیم.
        این کار باعث می‌شود Telegram سریع پاسخ 200 بگیرد.
      */
      ctx.waitUntil(
        processUpdate(env, update)
      );

      return json({
        ok: true
      });
    } catch (error) {
      console.error("WEBHOOK ERROR:", error);

      return json({
        ok: false,
        error: "Invalid update"
      }, 400);
    }
  }
};
