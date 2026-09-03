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
      antiSpam: "⏳ لطفاً کمی صبر کنید و دوباره تلاش کنید.",
      adminOnly: "⛔ این بخش فقط برای مدیر است.",
      adminTitle: "👑 پنل مدیریت",
      statistics: "📊 آمار",
      pendingMovies: "📥 فیلم‌های در انتظار بررسی",
      topMovies: "🏆 پربازدیدترین فیلم‌ها",
      bestMovies: "⭐ برترین فیلم‌ها",
      deleteMovie: "🗑️ حذف فیلم",
      announcement: "📢 ارسال اطلاعیه",
      blockUser: "🚫 بلاک کاربر",
      unblockUser: "✅ آنبلاک کاربر",
      dailyMovie: "🍿 فیلم پیشنهادی امروز",
      backup: "💾 اطلاعات ربات",
      back: "🔙 بازگشت",
      statsText: "📊 آمار ربات\n\n👥 کاربران: {users}\n🎬 فیلم‌ها: {movies}\n📥 در انتظار بررسی: {pending}\n⭐ تعداد امتیازها: {ratings}\n👀 مجموع دریافت‌ها: {views}\n🚫 کاربران بلاک‌شده: {blocked}",
      noPending: "📭 فیلمی در انتظار بررسی نیست.",
      noTopMovies: "🏆 هنوز اطلاعات کافی برای نمایش پربازدیدترین فیلم‌ها وجود ندارد.",
      noBestMovies: "⭐ هنوز امتیاز کافی برای نمایش برترین فیلم‌ها وجود ندارد.",
      approve: "✅ تأیید",
      reject: "❌ رد",
      movieApproved: "✅ فیلم تأیید و به آرشیو اضافه شد.",
      movieRejected: "❌ فیلم رد شد.",
      approvalCaption: "📥 فیلم جدید برای بررسی\n\nفرستنده: {name}\nشناسه کاربر: {id}",
      error: "❌ مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
      movieId: "🎬 شناسه فیلم: {id}",
      dailyTitle: "🍿 فیلم پیشنهادی امروز",
      deletePrompt: "🗑️ شناسه فیلمی که می‌خواهید حذف کنید را ارسال کنید.",
      movieDeleted: "✅ فیلم حذف شد.",
      movieNotFound: "❌ فیلمی با این شناسه پیدا نشد.",
      announcementPrompt: "📢 متن اطلاعیه را ارسال کنید.",
      announcementDone: "✅ اطلاعیه برای کاربران ارسال شد.\n\n📨 موفق: {success}\n❌ ناموفق: {failed}",
      blockPrompt: "🚫 آیدی عددی کاربری که می‌خواهید بلاک کنید را ارسال کنید.",
      unblockPrompt: "✅ آیدی عددی کاربری که می‌خواهید آنبلاک کنید را ارسال کنید.",
      blockedDone: "🚫 کاربر بلاک شد.",
      unblockedDone: "✅ کاربر آنبلاک شد.",
      invalidUserId: "❌ آیدی کاربر معتبر نیست.",
      blockedMessage: "🚫 شما توسط مدیر از استفاده از ربات مسدود شده‌اید.",
      backupText: "💾 اطلاعات ذخیره‌شده ربات\n\n👥 کاربران: {users}\n🎬 فیلم‌ها: {movies}\n📥 در انتظار: {pending}\n⭐ امتیازها: {ratings}\n🚫 بلاک‌شده‌ها: {blocked}",
      dailyNone: "🍿 فعلاً فیلمی برای پیشنهاد امروز وجود ندارد.",
      topTitle: "🏆 پربازدیدترین فیلم‌ها",
      bestTitle: "⭐ برترین فیلم‌ها"
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
      antiSpam: "⏳ Please wait a little and try again.",
      adminOnly: "⛔ This section is for the admin only.",
      adminTitle: "👑 Admin Panel",
      statistics: "📊 Statistics",
      pendingMovies: "📥 Pending Movies",
      topMovies: "🏆 Most Viewed Movies",
      bestMovies: "⭐ Top Rated Movies",
      deleteMovie: "🗑️ Delete Movie",
      announcement: "📢 Send Announcement",
      blockUser: "🚫 Block User",
      unblockUser: "✅ Unblock User",
      dailyMovie: "🍿 Movie of the Day",
      backup: "💾 Bot Information",
      back: "🔙 Back",
      statsText: "📊 Bot Statistics\n\n👥 Users: {users}\n🎬 Movies: {movies}\n📥 Pending: {pending}\n⭐ Ratings: {ratings}\n👀 Total Views: {views}\n🚫 Blocked Users: {blocked}",
      noPending: "📭 There are no pending movies.",
      noTopMovies: "🏆 There is not enough view data yet.",
      noBestMovies: "⭐ There are not enough ratings yet.",
      approve: "✅ Approve",
      reject: "❌ Reject",
      movieApproved: "✅ Movie approved and added to the archive.",
      movieRejected: "❌ Movie rejected.",
      approvalCaption: "📥 New movie for review\n\nSender: {name}\nUser ID: {id}",
      error: "❌ Something went wrong. Please try again.",
      movieId: "🎬 Movie ID: {id}",
      dailyTitle: "🍿 Movie of the Day",
      deletePrompt: "🗑️ Send the ID of the movie you want to delete.",
      movieDeleted: "✅ Movie deleted.",
      movieNotFound: "❌ No movie was found with this ID.",
      announcementPrompt: "📢 Send the announcement text.",
      announcementDone: "✅ Announcement sent to users.\n\n📨 Successful: {success}\n❌ Failed: {failed}",
      blockPrompt: "🚫 Send the numeric ID of the user you want to block.",
      unblockPrompt: "✅ Send the numeric ID of the user you want to unblock.",
      blockedDone: "🚫 User blocked.",
      unblockedDone: "✅ User unblocked.",
      invalidUserId: "❌ Invalid user ID.",
      blockedMessage: "🚫 You have been blocked from using this bot.",
      backupText: "💾 Saved bot information\n\n👥 Users: {users}\n🎬 Movies: {movies}\n📥 Pending: {pending}\n⭐ Ratings: {ratings}\n🚫 Blocked: {blocked}",
      dailyNone: "🍿 There is no movie available for today's recommendation.",
      topTitle: "🏆 Most Viewed Movies",
      bestTitle: "⭐ Top Rated Movies"
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
      { text: t(language, "dailyMovie") },
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

function membershipKeyboard(language, link) {
  return {
    inline_keyboard: [
      [
        {
          text: t(language, "joinButton"),
          url: link || ""
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
      created_at: Date.now(),
      blocked: false
    };
  } else {
    user.first_name = from.first_name || user.first_name || "";
    user.username = from.username || user.username || "";

    if (typeof user.blocked !== "boolean") {
      user.blocked = false;
    }
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

async function getBlockedUsers(env) {
  return await getArray(env, "blocked_users");
}

async function saveBlockedUsers(env, users) {
  await saveArray(env, "blocked_users", users);
}

async function isBlocked(env, userId) {
  const blocked = await getBlockedUsers(env);
  return blocked.some(id => String(id) === String(userId));
}

async function setBlocked(env, userId, value) {
  const blocked = await getBlockedUsers(env);
  const id = String(userId);

  if (value) {
    if (!blocked.includes(id)) {
      blocked.push(id);
    }
  } else {
    const index = blocked.indexOf(id);

    if (index !== -1) {
      blocked.splice(index, 1);
    }
  }

  await saveBlockedUsers(env, blocked);

  const user = await getUser(env, userId);

  if (user) {
    user.blocked = value;
    await saveUser(env, user);
  }
}

async function getViews(env) {
  return await getArray(env, "movie_views");
}

async function saveViews(env, views) {
  await saveArray(env, "movie_views", views);
}

async function getLastMovieTime(env, userId) {
  return await getKV(env, `cooldown:${userId}`);
}

async function setLastMovieTime(env, userId) {
  await putKV(env, `cooldown:${userId}`, Date.now());
}

async function getRemainingCooldown(env, userId) {
  const last = await getLastMovieTime(env, userId);

  if (!last) {
    return 0;
  }

  const remaining = 10000 - (Date.now() - Number(last));

  return remaining > 0 ? remaining : 0;
}

async function createMovieId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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

    return [
      "creator",
      "administrator",
      "member"
    ].includes(result.result.status);
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
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: t(language, "joinRequired"),
    reply_markup: membershipKeyboard(
      language,
      env.CHANNEL_LINK || ""
    )
  });
}

async function showMainMenu(env, chatId, language, admin) {
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

function movieAdminKeyboard(movieId) {
  return {
    inline_keyboard: [
      [
        {
          text: "🗑️ حذف فیلم",
          callback_data: `delete_movie:${movieId}`
        }
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

async function registerView(env, movieId, userId) {
  const views = await getViews(env);

  views.push({
    movie_id: String(movieId),
    user_id: String(userId),
    created_at: Date.now()
  });

  await saveViews(env, views);
}

async function getMovieViews(env, movieId) {
  const views = await getViews(env);

  return views.filter(
    item => String(item.movie_id) === String(movieId)
  ).length;
}

async function handleGetMovie(env, chatId, userId, language) {
  const cooldown = await getRemainingCooldown(env, userId);

  if (cooldown > 0) {
    await sendText(
      env,
      chatId,
      t(language, "antiSpam")
    );
    return;
  }

  if (await isBlocked(env, userId)) {
    await sendText(
      env,
      chatId,
      t(language, "blockedMessage")
    );
    return;
  }

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

  await setLastMovieTime(env, userId);
  await registerView(env, movie.id, userId);

  const movieMessageId = sent.result.message_id;

  const ratingMessage = await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `${t(language, "rateMovie")}\n\n` +
      formatText(t(language, "movieId"), {
        id: movie.id
      }),
    reply_markup: ratingKeyboard(movie.id)
  });

  setTimeout(async () => {
    try {
      await telegram(env, "deleteMessage", {
        chat_id: chatId,
        message_id: movieMessageId
      });

      if (ratingMessage?.ok) {
        await telegram(env, "deleteMessage", {
          chat_id: chatId,
          message_id: ratingMessage.result.message_id
        });
      }
    } catch {
      // ignore delete errors
    }
  }, 20000);
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

async function getMovieRating(env, movieId) {
  const ratings = await getRatings(env);

  const movieRatings = ratings.filter(
    item => String(item.movie_id) === String(movieId)
  );

  if (!movieRatings.length) {
    return {
      average: 0,
      count: 0
    };
  }

  const total = movieRatings.reduce(
    (sum, item) => sum + Number(item.rating || 0),
    0
  );

  return {
    average: Number((total / movieRatings.length).toFixed(2)),
    count: movieRatings.length
  };
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

  const info = await getMovieRating(env, movieId);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackQuery.id,
    text: t(language, "rated")
  });

  if (callbackQuery.message) {
    await telegram(env, "editMessageText", {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      text:
        `${t(language, "rated")}\n\n` +
        `⭐ ${info.average}/5 (${info.count} رأی)`
    });
  }
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

  await sendText(
    env,
    chatId,
    t(language, "movieReceived")
  );

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
    views: 0,
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

async function deleteMovie(env, callbackQuery, movieId) {
  const movies = await getMovies(env);

  const index = movies.findIndex(
    movie => String(movie.id) === String(movieId)
  );

  if (index === -1) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: t("fa", "movieNotFound"),
      show_alert: true
    });

    return;
  }

  movies.splice(index, 1);

  await saveMovies(env, movies);

  await telegram(env, "answerCallbackQuery", {
    callback_query_id: callbackQuery.id,
    text: t("fa", "movieDeleted")
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
}
async function countRatings(env) {
  const ratings = await getRatings(env);
  return ratings.length;
}

async function countTotalViews(env) {
  const views = await getViews(env);
  return views.length;
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
      ],
      [
        {
          text: t("fa", "topMovies"),
          callback_data: "admin:top"
        },
        {
          text: t("fa", "bestMovies"),
          callback_data: "admin:best"
        }
      ],
      [
        {
          text: t("fa", "deleteMovie"),
          callback_data: "admin:delete"
        }
      ],
      [
        {
          text: t("fa", "announcement"),
          callback_data: "admin:announce"
        }
      ],
      [
        {
          text: t("fa", "blockUser"),
          callback_data: "admin:block"
        },
        {
          text: t("fa", "unblockUser"),
          callback_data: "admin:unblock"
        }
      ],
      [
        {
          text: t("fa", "backup"),
          callback_data: "admin:backup"
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
  const views = await countTotalViews(env);
  const blocked = await getBlockedUsers(env);

  const text = formatText(t("fa", "statsText"), {
    users: users.length,
    movies: movies.length,
    pending: pending.length,
    ratings,
    views,
    blocked: blocked.length
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

async function showTopMovies(env, chatId) {
  const movies = await getMovies(env);

  if (!movies.length) {
    await sendText(env, chatId, t("fa", "noTopMovies"));
    return;
  }

  const views = await getViews(env);

  const result = movies.map(movie => {
    const count = views.filter(
      item => String(item.movie_id) === String(movie.id)
    ).length;

    return {
      movie,
      views: count
    };
  });

  result.sort((a, b) => b.views - a.views);

  const top = result.slice(0, 10);

  if (!top.length) {
    await sendText(env, chatId, t("fa", "noTopMovies"));
    return;
  }

  let text = "🏆 پربازدیدترین فیلم‌ها\n\n";

  top.forEach((item, index) => {
    text += `${index + 1}. 🎬 ${item.movie.id}\n`;
    text += `👀 ${item.views} دریافت\n\n`;
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

async function showBestMovies(env, chatId) {
  const movies = await getMovies(env);
  const ratings = await getRatings(env);

  if (!movies.length || !ratings.length) {
    await sendText(env, chatId, t("fa", "noBestMovies"));
    return;
  }

  const result = [];

  for (const movie of movies) {
    const movieRatings = ratings.filter(
      item => String(item.movie_id) === String(movie.id)
    );

    if (!movieRatings.length) {
      continue;
    }

    const total = movieRatings.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    result.push({
      movie,
      average: total / movieRatings.length,
      count: movieRatings.length
    });
  }

  result.sort((a, b) => {
    if (b.average !== a.average) {
      return b.average - a.average;
    }

    return b.count - a.count;
  });

  const top = result.slice(0, 10);

  if (!top.length) {
    await sendText(env, chatId, t("fa", "noBestMovies"));
    return;
  }

  let text = "⭐ برترین فیلم‌ها\n\n";

  top.forEach((item, index) => {
    text += `${index + 1}. 🎬 ${item.movie.id}\n`;
    text += `⭐ ${item.average.toFixed(2)}/5`;
    text += ` | ${item.count} رأی\n\n`;
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
async function sendAnnouncement(env, text) {
  const users = await getUsers(env);

  let success = 0;
  let failed = 0;

  for (const userId of users) {
    if (String(userId) === String(env.ADMIN_ID)) {
      continue;
    }

    try {
      const blocked = await isBlocked(env, userId);

      if (blocked) {
        continue;
      }

      const result = await telegram(env, "sendMessage", {
        chat_id: userId,
        text
      });

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
    success,
    failed
  };
}

async function showBackupInfo(env, chatId) {
  const users = await getUsers(env);
  const movies = await getMovies(env);
  const pending = await getPendingMovies(env);
  const ratings = await getRatings(env);
  const blocked = await getBlockedUsers(env);

  const text = formatText(t("fa", "backupText"), {
    users: users.length,
    movies: movies.length,
    pending: pending.length,
    ratings: ratings.length,
    blocked: blocked.length
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

function getTodayKey() {
  const date = new Date();

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

async function getDailyMovie(env) {
  const movies = await getMovies(env);

  if (!movies.length) {
    return null;
  }

  const key = getTodayKey();

  const saved = await getKV(env, "daily_movie");

  if (
    saved &&
    saved.date === key &&
    movies.some(movie => String(movie.id) === String(saved.movie_id))
  ) {
    return movies.find(
      movie => String(movie.id) === String(saved.movie_id)
    );
  }

  const index = Math.floor(Math.random() * movies.length);
  const movie = movies[index];

  await putKV(env, "daily_movie", {
    date: key,
    movie_id: movie.id
  });

  return movie;
}

async function handleDailyMovie(env, chatId, userId, language) {
  if (await isBlocked(env, userId)) {
    await sendText(
      env,
      chatId,
      t(language, "blockedMessage")
    );
    return;
  }

  const movie = await getDailyMovie(env);

  if (!movie) {
    await sendText(
      env,
      chatId,
      t(language, "dailyNone")
    );
    return;
  }

  const sent = await sendMovie(env, chatId, movie);

  if (!sent || !sent.ok) {
    await sendText(env, chatId, t(language, "error"));
    return;
  }

  await registerView(env, movie.id, userId);

  const ratingMessage = await telegram(env, "sendMessage", {
    chat_id: chatId,
    text:
      `${t(language, "dailyTitle")}\n\n` +
      formatText(t(language, "movieId"), {
        id: movie.id
      }) +
      `\n\n${t(language, "rateMovie")}`,
    reply_markup: ratingKeyboard(movie.id)
  });

  const movieMessageId = sent.result.message_id;

  setTimeout(async () => {
    try {
      await telegram(env, "deleteMessage", {
        chat_id: chatId,
        message_id: movieMessageId
      });

      if (ratingMessage?.ok) {
        await telegram(env, "deleteMessage", {
          chat_id: chatId,
          message_id: ratingMessage.result.message_id
        });
      }
    } catch {
      // ignore
    }
  }, 20000);
}

async function handleAdminState(env, message, user, state) {
  const chatId = message.chat.id;

  if (!isAdmin(user.id, env)) {
    await clearState(env, user.id);
    await sendText(
      env,
      chatId,
      t(getLanguage(user), "adminOnly")
    );
    return true;
  }

  if (state.action === "delete_movie") {
    const movieId = (message.text || "").trim();

    if (!movieId) {
      await sendText(
        env,
        chatId,
        t("fa", "movieNotFound")
      );
      return true;
    }

    const movies = await getMovies(env);

    const index = movies.findIndex(
      movie => String(movie.id) === movieId
    );

    if (index === -1) {
      await sendText(
        env,
        chatId,
        t("fa", "movieNotFound")
      );
      return true;
    }

    movies.splice(index, 1);
    await saveMovies(env, movies);
    await clearState(env, user.id);

    await sendText(
      env,
      chatId,
      t("fa", "movieDeleted")
    );

    await showAdminPanel(env, chatId);
    return true;
  }

  if (state.action === "announcement") {
    const announcement = (message.text || "").trim();

    if (!announcement) {
      return true;
    }

    await clearState(env, user.id);

    const result = await sendAnnouncement(
      env,
      announcement
    );

    await sendText(
      env,
      chatId,
      formatText(t("fa", "announcementDone"), result)
    );

    await showAdminPanel(env, chatId);
    return true;
  }

  if (state.action === "block_user") {
    const userId = (message.text || "").trim();

    if (!/^-?\d+$/.test(userId)) {
      await sendText(
        env,
        chatId,
        t("fa", "invalidUserId")
      );
      return true;
    }

    await setBlocked(env, userId, true);
    await clearState(env, user.id);

    await sendText(
      env,
      chatId,
      t("fa", "blockedDone")
    );

    await showAdminPanel(env, chatId);
    return true;
  }

  if (state.action === "unblock_user") {
    const userId = (message.text || "").trim();

    if (!/^-?\d+$/.test(userId)) {
      await sendText(
        env,
        chatId,
        t("fa", "invalidUserId")
      );
      return true;
    }

    await setBlocked(env, userId, false);
    await clearState(env, user.id);

    await sendText(
      env,
      chatId,
      t("fa", "unblockedDone")
    );

    await showAdminPanel(env, chatId);
    return true;
  }

  return false;
          }
async function handleStart(env, message, user) {
  const chatId = message.chat.id;

  await clearState(env, user.id);

  if (await isBlocked(env, user.id)) {
    await sendText(
      env,
      chatId,
      t(getLanguage(user), "blockedMessage")
    );
    return;
  }

  if (!user.language) {
    await showLanguageMenu(env, chatId);
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

  if (await isBlocked(env, user.id)) {
    await sendText(
      env,
      chatId,
      t(language, "blockedMessage")
    );
    return;
  }

  const state = await getState(env, user.id);

  if (state?.action && state.action !== "waiting_movie") {
    const handled = await handleAdminState(
      env,
      message,
      user,
      state
    );

    if (handled) {
      return;
    }
  }

  if (
    text === "🌐 تغییر زبان" ||
    text === "🌐 Change Language"
  ) {
    await clearState(env, user.id);

    await sendText(
      env,
      chatId,
      t(language, "chooseLanguage"),
      languageKeyboard()
    );

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

    await handleGetMovie(
      env,
      chatId,
      user.id,
      language
    );

    return;
  }

  if (
    text === "🍿 فیلم پیشنهادی امروز" ||
    text === "🍿 Movie of the Day"
  ) {
    const member = await isMember(env, user.id);

    if (!member) {
      await showJoinMessage(env, chatId, language);
      return;
    }

    await clearState(env, user.id);

    await handleDailyMovie(
      env,
      chatId,
      user.id,
      language
    );

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
      await sendText(
        env,
        chatId,
        t(language, "adminOnly")
      );
      return;
    }

    await clearState(env, user.id);
    await showAdminPanel(env, chatId);
    return;
  }

  if (state?.action === "waiting_movie") {
    if (message.video || message.document) {
      await handleUserMovie(
        env,
        message,
        user
      );

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

  const user = await ensureUser(
    env,
    message.from
  );

  await registerUser(
    env,
    user.id
  );

  if (await isBlocked(env, user.id)) {
    await sendText(
      env,
      message.chat.id,
      t(getLanguage(user), "blockedMessage")
    );
    return;
  }

  const text = message.text || "";

  if (text === "/start") {
    await handleStart(
      env,
      message,
      user
    );
    return;
  }

  if (!user.language) {
    await showLanguageMenu(
      env,
      message.chat.id
    );
    return;
  }

  const state = await getState(
    env,
    user.id
  );

  if (state?.action === "waiting_movie") {
    const member = await isMember(
      env,
      user.id
    );

    if (!member) {
      await showJoinMessage(
        env,
        message.chat.id,
        getLanguage(user)
      );
      return;
    }

    if (message.video || message.document) {
      await handleUserMovie(
        env,
        message,
        user
      );

      await clearState(
        env,
        user.id
      );

      return;
    }

    await sendText(
      env,
      message.chat.id,
      t(getLanguage(user), "invalidMovie")
    );

    return;
  }

  if (
    state?.action === "delete_movie" ||
    state?.action === "announcement" ||
    state?.action === "block_user" ||
    state?.action === "unblock_user"
  ) {
    await handleAdminState(
      env,
      message,
      user,
      state
    );
    return;
  }

  const member = await isMember(
    env,
    user.id
  );

  if (!member) {
    await showJoinMessage(
      env,
      message.chat.id,
      getLanguage(user)
    );
    return;
  }

  user.joined = true;

  await saveUser(
    env,
    user
  );

  await handleButtonMessage(
    env,
    message,
    user
  );
}

async function handleCallback(env, callbackQuery) {
  if (!callbackQuery || !callbackQuery.from) {
    return;
  }

  const userId = callbackQuery.from.id;
  const data = callbackQuery.data || "";

  const user = await getUser(
    env,
    userId
  );

  if (!user) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: "ابتدا /start را بزنید.",
      show_alert: true
    });

    return;
  }

  if (await isBlocked(env, userId)) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id,
      text: t(getLanguage(user), "blockedMessage"),
      show_alert: true
    });
    return;
  }

  if (data === "lang:fa" || data === "lang:en") {
    const language =
      data === "lang:en"
        ? "en"
        : "fa";

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

    const member = await isMember(
      env,
      userId
    );

    if (!member) {
      await showJoinMessage(
        env,
        callbackQuery.message.chat.id,
        language
      );
      return;
    }

    user.joined = true;

    await saveUser(
      env,
      user
    );

    await showMainMenu(
      env,
      callbackQuery.message.chat.id,
      language,
      isAdmin(userId, env)
    );

    return;
  }

  if (data === "membership:check") {
    const language = getLanguage(user);

    const member = await isMember(
      env,
      userId
    );

    if (!member) {
      await telegram(env, "answerCallbackQuery", {
        callback_query_id: callbackQuery.id,
        text: t(language, "notMember"),
        show_alert: true
      });

      return;
    }

    user.joined = true;

    await saveUser(
      env,
      user
    );

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
    if (
    data.startsWith("approve:") ||
    data.startsWith("reject:") ||
    data.startsWith("admin:") ||
    data.startsWith("delete_movie:")
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
    const movieId = data.substring(
      "approve:".length
    );

    await approveMovie(
      env,
      callbackQuery,
      movieId
    );

    return;
  }

  if (data.startsWith("reject:")) {
    const movieId = data.substring(
      "reject:".length
    );

    await rejectMovie(
      env,
      callbackQuery,
      movieId
    );

    return;
  }

  if (data.startsWith("delete_movie:")) {
    const movieId = data.substring(
      "delete_movie:".length
    );

    await deleteMovie(
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

  if (data === "admin:top") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await showTopMovies(
      env,
      callbackQuery.message.chat.id
    );

    return;
  }

  if (data === "admin:best") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await showBestMovies(
      env,
      callbackQuery.message.chat.id
    );

    return;
  }

  if (data === "admin:delete") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await setState(env, userId, {
      action: "delete_movie"
    });

    await sendText(
      env,
      callbackQuery.message.chat.id,
      t("fa", "deletePrompt")
    );

    return;
  }

  if (data === "admin:announce") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await setState(env, userId, {
      action: "announcement"
    });

    await sendText(
      env,
      callbackQuery.message.chat.id,
      t("fa", "announcementPrompt")
    );

    return;
  }

  if (data === "admin:block") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await setState(env, userId, {
      action: "block_user"
    });

    await sendText(
      env,
      callbackQuery.message.chat.id,
      t("fa", "blockPrompt")
    );

    return;
  }

  if (data === "admin:unblock") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await setState(env, userId, {
      action: "unblock_user"
    });

    await sendText(
      env,
      callbackQuery.message.chat.id,
      t("fa", "unblockPrompt")
    );

    return;
  }

  if (data === "admin:backup") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: callbackQuery.id
    });

    await showBackupInfo(
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
      await handleMessage(
        env,
        update.message
      );
      return;
    }

    if (update.callback_query) {
      await handleCallback(
        env,
        update.callback_query
      );
      return;
    }
  } catch (error) {
    console.error(
      "PROCESS UPDATE ERROR:",
      error
    );

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
    if (request.method === "GET") {
      return new Response(
        "Film Bot is running.",
        {
          status: 200,
          headers: {
            "Content-Type":
              "text/plain; charset=UTF-8"
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

    try {
      const update = await request.json();

      ctx.waitUntil(
        processUpdate(
          env,
          update
        )
      );

      return json({
        ok: true
      });
    } catch (error) {
      console.error(
        "WEBHOOK ERROR:",
        error
      );

      return json(
        {
          ok: false,
          error: "Invalid update"
        },
        400
      );
    }
  }
};
