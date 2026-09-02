// ==========================================
// 🎬 TELEGRAM MOVIE BOT
// Cloudflare Workers + KV
// PART 1 / 8
// ==========================================

const TG = (env) =>
  `https://api.telegram.org/bot${env.BOT_TOKEN}`;


// ==========================================
// Worker
// ==========================================

export default {

  async fetch(request, env, ctx) {

    if (request.method === "GET") {

      return new Response(
        "🎬 Telegram Movie Bot is running!"
      );

    }


    if (request.method !== "POST") {

      return new Response(
        "Method Not Allowed",
        { status: 405 }
      );

    }


    try {

      const update =
        await request.json();

      await handleUpdate(
        update,
        env,
        ctx
      );

      return new Response("OK");

    } catch (error) {

      console.error(
        "BOT ERROR:",
        error
      );

      return new Response("OK");

    }

  }

};


// ==========================================
// Telegram API
// ==========================================

async function telegram(
  env,
  method,
  data = {}
) {

  const response =
    await fetch(
      `${TG(env)}/${method}`,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(data)

      }
    );


  return await response.json();

}


// ==========================================
// Update
// ==========================================

async function handleUpdate(
  update,
  env,
  ctx
) {

  if (update.message) {

    await handleMessage(
      update.message,
      env,
      ctx
    );

    return;

  }


  if (update.callback_query) {

    await handleCallback(
      update.callback_query,
      env,
      ctx
    );

    return;

  }

}
// ==========================================
// PART 2 / 8
// 🗃️ KV + USERS + LANGUAGE
// ==========================================


// ==========================================
// KV
// ==========================================

async function kvGet(
  env,
  key
) {

  return await env.BOT_DATA.get(key);

}


async function kvJSON(
  env,
  key
) {

  return await env.BOT_DATA.get(
    key,
    "json"
  );

}


async function kvPut(
  env,
  key,
  value
) {

  await env.BOT_DATA.put(
    key,
    value
  );

}


async function kvPutJSON(
  env,
  key,
  value
) {

  await env.BOT_DATA.put(
    key,
    JSON.stringify(value)
  );

}


async function kvDelete(
  env,
  key
) {

  await env.BOT_DATA.delete(key);

}


// ==========================================
// User
// ==========================================

async function getUser(
  env,
  userId
) {

  return await kvJSON(
    env,
    `user:${userId}`
  );

}


async function saveUser(
  env,
  telegramUser
) {

  const userId =
    String(telegramUser.id);


  let user =
    await getUser(
      env,
      userId
    );


  if (!user) {

    user = {

      id: userId,

      username:
        telegramUser.username || "",

      first_name:
        telegramUser.first_name || "",

      language: null,

      created_at:
        Date.now()

    };

  } else {

    user.username =
      telegramUser.username || "";

    user.first_name =
      telegramUser.first_name || "";

  }


  await kvPutJSON(
    env,
    `user:${userId}`,
    user
  );


  let users =
    await kvJSON(
      env,
      "users:index"
    );


  if (!Array.isArray(users)) {

    users = [];

  }


  if (!users.includes(userId)) {

    users.push(userId);

    await kvPutJSON(
      env,
      "users:index",
      users
    );

  }

}


// ==========================================
// Language
// ==========================================

async function getLanguage(
  env,
  userId
) {

  const user =
    await getUser(
      env,
      userId
    );


  return user?.language || "fa";

}


async function setLanguage(
  env,
  userId,
  language
) {

  let user =
    await getUser(
      env,
      userId
    );


  if (!user) {

    user = {

      id: String(userId),

      username: "",

      first_name: "",

      language: language,

      created_at:
        Date.now()

    };

  } else {

    user.language =
      language;

  }


  await kvPutJSON(
    env,
    `user:${userId}`,
    user
  );

}


// ==========================================
// User State
// ==========================================

async function getState(
  env,
  userId
) {

  return await kvGet(
    env,
    `state:${userId}`
  );

}


async function setState(
  env,
  userId,
  state
) {

  if (!state) {

    await kvDelete(
      env,
      `state:${userId}`
    );

    return;

  }


  await kvPut(
    env,
    `state:${userId}`,
    state
  );

}
// ==========================================
// PART 3 / 8
// 🌐 LANGUAGES
// ==========================================

const TEXTS = {

  fa: {

    selectLanguage:
      "🌐 لطفاً زبان ربات را انتخاب کنید:",

    languageSelected:
      "✅ زبان فارسی انتخاب شد.",

    welcome:
      "🎬 به ربات فیلم خوش آمدید!",

    choose:
      "یکی از گزینه‌های پایین را انتخاب کنید.",

    getMovie:
      "🎬 دریافت فیلم",

    sendMovie:
      "📤 ارسال فیلم",

    changeLanguage:
      "🌐 تغییر زبان",

    adminPanel:
      "👑 پنل مدیریت",

    joinRequired:
      "📢 برای استفاده از ربات ابتدا باید در کانال عضو شوید.",

    joinChannel:
      "📢 عضویت در کانال",

    checkMembership:
      "✅ بررسی عضویت",

    notMember:
      "❌ هنوز در کانال عضو نشده‌اید.",

    membershipOK:
      "✅ عضویت شما تأیید شد.",

    sendMovieHelp:
      "🎬 لطفاً فیلم خود را ارسال کنید.\n\n" +
      "فیلم شما برای بررسی مدیر ارسال خواهد شد.",

    movieReceived:
      "✅ فیلم شما دریافت شد.\n\n" +
      "⏳ برای بررسی مدیر ارسال شد.",

    onlyVideo:
      "❌ لطفاً یک فیلم ارسال کنید.",

    noMovies:
      "😔 فعلاً فیلم جدیدی موجود نیست.\n\n" +
      "بعداً دوباره امتحان کنید.",

    movieCaption:
      "🎬 فیلم شما\n\n⭐ به فیلم امتیاز دهید:",

    ratingThanks:
      "⭐ ممنون از امتیاز شما!",

    adminOnly:
      "❌ شما اجازه دسترسی به پنل مدیریت را ندارید.",

    adminNewMovie:
      "🎬 فیلم جدید برای بررسی\n\n",

    approve:
      "✅ تأیید",

    reject:
      "❌ رد",

    approved:
      "✅ فیلم تأیید شد و به ربات اضافه شد.",

    rejected:
      "❌ فیلم رد شد.",

    userApproved:
      "✅ فیلم شما توسط مدیر تأیید شد و به ربات اضافه شد.",

    userRejected:
      "❌ فیلم شما توسط مدیر رد شد.",

    adminStats:
      "📊 آمار ربات",

    refresh:
      "🔄 بروزرسانی",

    users:
      "👥 کاربران",

    movies:
      "🎬 فیلم‌های تأییدشده",

    pending:
      "⏳ در انتظار بررسی",

    ratings:
      "⭐ تعداد امتیازها"

  },


  en: {

    selectLanguage:
      "🌐 Please select your language:",

    languageSelected:
      "✅ English selected.",

    welcome:
      "🎬 Welcome to the Movie Bot!",

    choose:
      "Choose an option from the menu below.",

    getMovie:
      "🎬 Get movie",

    sendMovie:
      "📤 Send movie",

    changeLanguage:
      "🌐 Change language",

    adminPanel:
      "👑 Admin panel",

    joinRequired:
      "📢 You must join the channel before using the bot.",

    joinChannel:
      "📢 Join channel",

    checkMembership:
      "✅ Check membership",

    notMember:
      "❌ You have not joined the channel yet.",

    membershipOK:
      "✅ Your membership was confirmed.",

    sendMovieHelp:
      "🎬 Please send your movie.\n\n" +
      "Your movie will be sent to the admin for review.",

    movieReceived:
      "✅ Your movie was received.\n\n" +
      "⏳ It has been sent to the admin for review.",

    onlyVideo:
      "❌ Please send a video.",

    noMovies:
      "😔 There are no new movies available right now.\n\n" +
      "Please try again later.",

    movieCaption:
      "🎬 Your movie\n\n⭐ Rate this movie:",

    ratingThanks:
      "⭐ Thank you for your rating!",

    adminOnly:
      "❌ You do not have permission to access the admin panel.",

    adminNewMovie:
      "🎬 New movie waiting for review\n\n",

    approve:
      "✅ Approve",

    reject:
      "❌ Reject",

    approved:
      "✅ Movie approved and added to the bot.",

    rejected:
      "❌ Movie rejected.",

    userApproved:
      "✅ Your movie was approved and added to the bot.",

    userRejected:
      "❌ Your movie was rejected.",

    adminStats:
      "📊 Bot statistics",

    refresh:
      "🔄 Refresh",

    users:
      "👥 Users",

    movies:
      "🎬 Approved movies",

    pending:
      "⏳ Pending review",

    ratings:
      "⭐ Ratings"

  }

};


function t(
  language,
  key
) {

  const lang =
    TEXTS[language]
      ? language
      : "fa";


  return TEXTS[lang][key] || "";

}
// ==========================================
// PART 4 / 8
// 📢 MEMBERSHIP + ⌨️ MAIN KEYBOARD
// ==========================================


// ==========================================
// بررسی عضویت
// ==========================================

async function isMember(
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
            env.CHANNEL_ID,

          user_id:
            userId

        }
      );


    if (!result.ok) {

      console.error(
        "getChatMember:",
        result
      );

      return false;

    }


    const status =
      result.result.status;


    return [
      "creator",
      "administrator",
      "member"
    ].includes(status);

  } catch (error) {

    console.error(
      "Membership error:",
      error
    );

    return false;

  }

}


// ==========================================
// پیام عضویت
// ==========================================

async function sendJoinMessage(
  env,
  chatId,
  language
) {

  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        chatId,

      text:
        t(
          language,
          "joinRequired"
        ),

      reply_markup: {

        inline_keyboard: [

          [

            {
              text:
                t(
                  language,
                  "joinChannel"
                ),

              url:
                env.CHANNEL_LINK

            }

          ],

          [

            {
              text:
                t(
                  language,
                  "checkMembership"
                ),

              callback_data:
                "check_membership"

            }

          ]

        ]

      }

    }
  );

}


// ==========================================
// منوی اصلی پایین تلگرام
// ==========================================

async function showMainMenu(
  env,
  chatId,
  userId,
  language
) {

  const member =
    await isMember(
      env,
      userId
    );


  if (!member) {

    await sendJoinMessage(
      env,
      chatId,
      language
    );

    return;

  }


  const keyboard = [

    [

      t(
        language,
        "getMovie"
      ),

      t(
        language,
        "sendMovie"
      )

    ],

    [

      t(
        language,
        "changeLanguage"
      )

    ]

  ];


  // فقط مدیر
  if (
    String(userId) ===
    String(env.ADMIN_ID)
  ) {

    keyboard.push([

      t(
        language,
        "adminPanel"
      )

    ]);

  }


  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        chatId,

      text:
        t(
          language,
          "welcome"
        ) +
        "\n\n" +
        t(
          language,
          "choose"
        ),

      reply_markup: {

        keyboard:
          keyboard,

        resize_keyboard:
          true,

        is_persistent:
          true

      }

    }
  );

}
// ==========================================
// PART 5 / 8
// 🎬 MOVIES + ⭐ RATING + ⏳ DELETE
// ==========================================


// ==========================================
// گرفتن لیست فیلم‌ها
// ==========================================

async function getMovieList(
  env
) {

  const list =
    await kvJSON(
      env,
      "movies:index"
    );


  return Array.isArray(list)
    ? list
    : [];

}


// ==========================================
// دریافت فیلم تصادفی
// ==========================================

async function sendRandomMovie(
  env,
  chatId,
  userId,
  language,
  ctx
) {

  // عضویت
  const member =
    await isMember(
      env,
      userId
    );


  if (!member) {

    await sendJoinMessage(
      env,
      chatId,
      language
    );

    return;

  }


  let movieIds =
    await getMovieList(
      env
    );


  // حذف شناسه‌های خراب از لیست
  const validMovies = [];


  for (
    const movieId of movieIds
  ) {

    const movie =
      await kvJSON(
        env,
        `movie:${movieId}`
      );


    if (
      movie &&
      movie.status === "approved"
    ) {

      validMovies.push(
        movieId
      );

    }

  }


  if (
    validMovies.length === 0
  ) {

    await telegram(
      env,
      "sendMessage",
      {

        chat_id:
          chatId,

        text:
          t(
            language,
            "noMovies"
          )

      }
    );

    return;

  }


  // انتخاب تصادفی
  const randomIndex =
    Math.floor(
      Math.random() *
      validMovies.length
    );


  const movieId =
    validMovies[randomIndex];


  const movie =
    await kvJSON(
      env,
      `movie:${movieId}`
    );


  if (!movie) {

    return;

  }


  let result;


  // فیلم ویدیویی
  if (
    movie.type === "video"
  ) {

    result =
      await telegram(
        env,
        "sendVideo",
        {

          chat_id:
            chatId,

          video:
            movie.file_id,

          caption:
            t(
              language,
              "movieCaption"
            ),

          reply_markup: {

            inline_keyboard: [

              [

                {
                  text: "⭐ 1",
                  callback_data:
                    `rate:${movieId}:1`
                },

                {
                  text: "⭐ 2",
                  callback_data:
                    `rate:${movieId}:2`
                },

                {
                  text: "⭐ 3",
                  callback_data:
                    `rate:${movieId}:3`
                },

                {
                  text: "⭐ 4",
                  callback_data:
                    `rate:${movieId}:4`
                },

                {
                  text: "⭐ 5",
                  callback_data:
                    `rate:${movieId}:5`
                }

              ]

            ]

          }

        }
      );

  }


  // اگر به صورت document باشد
  else {

    result =
      await telegram(
        env,
        "sendDocument",
        {

          chat_id:
            chatId,

          document:
            movie.file_id,

          caption:
            t(
              language,
              "movieCaption"
            ),

          reply_markup: {

            inline_keyboard: [

              [

                {
                  text: "⭐ 1",
                  callback_data:
                    `rate:${movieId}:1`
                },

                {
                  text: "⭐ 2",
                  callback_data:
                    `rate:${movieId}:2`
                },

                {
                  text: "⭐ 3",
                  callback_data:
                    `rate:${movieId}:3`
                },

                {
                  text: "⭐ 4",
                  callback_data:
                    `rate:${movieId}:4`
                },

                {
                  text: "⭐ 5",
                  callback_data:
                    `rate:${movieId}:5`
                }

              ]

            ]

          }

        }
      );

  }


  if (
    !result ||
    !result.ok
  ) {

    console.error(
      "Send movie error:",
      result
    );

    return;

  }


  const messageId =
    result.result.message_id;


  // حذف دقیقاً پس از حدود 20 ثانیه
  ctx.waitUntil(

    new Promise(
      (resolve) => {

        setTimeout(
          async () => {

            try {

              await telegram(
                env,
                "deleteMessage",
                {

                  chat_id:
                    chatId,

                  message_id:
                    messageId

                }
              );

            } catch (error) {

              console.error(
                "Delete error:",
                error
              );

            }

            resolve();

          },

          20000

        );

      }
    )

  );

}


// ==========================================
// ⭐ ثبت امتیاز
// ==========================================

async function rateMovie(
  env,
  userId,
  movieId,
  rating
) {

  const userRatingKey =
    `rating:user:${userId}:${movieId}`;


  // هر کاربر فقط یک بار
  const alreadyRated =
    await kvGet(
      env,
      userRatingKey
    );


  if (alreadyRated) {

    return false;

  }


  await kvPut(
    env,
    userRatingKey,
    String(rating)
  );


  const ratingKey =
    `rating:${movieId}`;


  let data =
    await kvJSON(
      env,
      ratingKey
    );


  if (!data) {

    data = {

      total: 0,

      count: 0

    };

  }


  data.total += rating;

  data.count += 1;


  await kvPutJSON(
    env,
    ratingKey,
    data
  );


  return true;

}
// ==========================================
// PART 6 / 8
// 📤 USER MOVIE SUBMISSION
// ==========================================


// ==========================================
// دریافت فیلم از کاربر
// ==========================================

async function submitMovie(
  env,
  message,
  language
) {

  const user =
    message.from;


  const userId =
    String(user.id);


  let fileId = null;

  let type = null;


  // ویدیو
  if (message.video) {

    fileId =
      message.video.file_id;

    type =
      "video";

  }


  // فایل ویدیویی به شکل Document
  else if (
    message.document
  ) {

    fileId =
      message.document.file_id;

    type =
      "document";

  }


  // چیز دیگری ارسال شده
  else {

    await telegram(
      env,
      "sendMessage",
      {

        chat_id:
          message.chat.id,

        text:
          t(
            language,
            "onlyVideo"
          )

      }
    );

    return;

  }


  // شناسه یکتا
  const movieId =
    `${Date.now()}_${userId}`;


  const movie = {

    id:
      movieId,

    file_id:
      fileId,

    type:
      type,

    status:
      "pending",

    user_id:
      userId,

    username:
      user.username || "",

    first_name:
      user.first_name || "",

    language:
      language,

    created_at:
      Date.now()

  };


  // ذخیره در انتظار بررسی
  await kvPutJSON(
    env,
    `pending:${movieId}`,
    movie
  );


  // وضعیت کاربر پاک شود
  await setState(
    env,
    userId,
    null
  );


  // اطلاع به کاربر
  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        message.chat.id,

      text:
        t(
          language,
          "movieReceived"
        )

    }
  );


  // ======================================
  // ارسال اطلاعات به مدیر
  // ======================================

  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        env.ADMIN_ID,

      text:
        t(
          "fa",
          "adminNewMovie"
        ) +

        `👤 ${user.first_name || "-"}\n` +

        `🆔 ${userId}\n` +

        (
          user.username
            ? `🔹 @${user.username}\n`
            : ""
        ) +

        `\n🎞 ID: ${movieId}`,

      reply_markup: {

        inline_keyboard: [

          [

            {

              text:
                t(
                  "fa",
                  "approve"
                ),

              callback_data:
                `approve:${movieId}`

            },

            {

              text:
                t(
                  "fa",
                  "reject"
                ),

              callback_data:
                `reject:${movieId}`

            }

          ]

        ]

      }

    }
  );


  // ======================================
  // ارسال خود فیلم برای مدیر
  // ======================================

  if (
    type === "video"
  ) {

    await telegram(
      env,
      "sendVideo",
      {

        chat_id:
          env.ADMIN_ID,

        video:
          fileId,

        caption:
          `🎬 فیلم در انتظار تأیید\n\n` +
          `ID: ${movieId}`

      }
    );

  } else {

    await telegram(
      env,
      "sendDocument",
      {

        chat_id:
          env.ADMIN_ID,

        document:
          fileId,

        caption:
          `🎬 فیلم در انتظار تأیید\n\n` +
          `ID: ${movieId}`

      }
    );

  }

}
// ==========================================
// PART 7 / 8
// 👑 ADMIN PANEL
// ==========================================


// ==========================================
// شمارش فیلم‌های در انتظار
// ==========================================

async function countPending(
  env
) {

  let count = 0;

  let cursor;


  do {

    const result =
      await env.BOT_DATA.list({

        prefix:
          "pending:",

        cursor:
          cursor

      });


    count +=
      result.keys.length;


    if (
      result.list_complete
    ) {

      cursor =
        undefined;

    } else {

      cursor =
        result.cursor;

    }

  } while (cursor);


  return count;

}


// ==========================================
// شمارش امتیازها
// ==========================================

async function countRatings(
  env
) {

  let count = 0;

  let cursor;


  do {

    const result =
      await env.BOT_DATA.list({

        prefix:
          "rating:",

        cursor:
          cursor

      });


    for (
      const key of result.keys
    ) {

      // فقط rating:movie را بشمار
      if (
        key.name.startsWith(
          "rating:"
        ) &&
        !key.name.startsWith(
          "rating:user:"
        )
      ) {

        const data =
          await kvJSON(
            env,
            key.name
          );


        if (data) {

          count +=
            Number(
              data.count || 0
            );

        }

      }

    }


    if (
      result.list_complete
    ) {

      cursor =
        undefined;

    } else {

      cursor =
        result.cursor;

    }

  } while (cursor);


  return count;

}


// ==========================================
// پنل مدیریت
// ==========================================

async function showAdminPanel(
  env,
  chatId
) {

  const users =
    await kvJSON(
      env,
      "users:index"
    ) || [];


  const movies =
    await getMovieList(
      env
    );


  const pending =
    await countPending(
      env
    );


  const ratings =
    await countRatings(
      env
    );


  const message =

    `📊 آمار ربات\n\n` +

    `👥 کاربران: ${users.length}\n` +

    `🎬 فیلم‌های تأییدشده: ${movies.length}\n` +

    `⏳ در انتظار بررسی: ${pending}\n` +

    `⭐ تعداد امتیازها: ${ratings}`;


  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        chatId,

      text:
        message,

      reply_markup: {

        inline_keyboard: [

          [

            {

              text:
                "🔄 بروزرسانی",

              callback_data:
                "admin:stats"

            }

          ]

        ]

      }

    }
  );

}


// ==========================================
// تأیید فیلم
// ==========================================

async function approveMovie(
  env,
  movieId,
  adminChatId,
  adminMessageId
) {

  const movie =
    await kvJSON(
      env,
      `pending:${movieId}`
    );


  if (!movie) {

    await telegram(
      env,
      "answerCallbackQuery",
      {

        callback_query_id:
          adminMessageId,

        text:
          "❌ این فیلم دیگر در انتظار بررسی نیست."

      }
    );

    return;

  }


  movie.status =
    "approved";


  // ذخیره فیلم اصلی
  await kvPutJSON(
    env,
    `movie:${movieId}`,
    movie
  );


  // اضافه به لیست فیلم‌ها
  let movies =
    await getMovieList(
      env
    );


  if (
    !movies.includes(movieId)
  ) {

    movies.push(
      movieId
    );

    await kvPutJSON(
      env,
      "movies:index",
      movies
    );

  }


  // حذف از pending
  await kvDelete(
    env,
    `pending:${movieId}`
  );


  // تغییر دکمه مدیر
  await telegram(
    env,
    "editMessageReplyMarkup",
    {

      chat_id:
        adminChatId,

      message_id:
        adminMessageId,

      reply_markup: {

        inline_keyboard: [

          [

            {
              text:
                "✅ تأیید شد",

              callback_data:
                "none"

            }

          ]

        ]

      }

    }
  );


  // اطلاع کاربر
  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        movie.user_id,

      text:
        t(
          movie.language || "fa",
          "userApproved"
        )

    }
  );

}


// ==========================================
// رد فیلم
// ==========================================

async function rejectMovie(
  env,
  movieId,
  adminChatId,
  adminMessageId
) {

  const movie =
    await kvJSON(
      env,
      `pending:${movieId}`
    );


  if (!movie) {

    return;

  }


  await kvDelete(
    env,
    `pending:${movieId}`
  );


  await telegram(
    env,
    "editMessageReplyMarkup",
    {

      chat_id:
        adminChatId,

      message_id:
        adminMessageId,

      reply_markup: {

        inline_keyboard: [

          [

            {

              text:
                "❌ رد شد",

              callback_data:
                "none"

            }

          ]

        ]

      }

    }
  );


  await telegram(
    env,
    "sendMessage",
    {

      chat_id:
        movie.user_id,

      text:
        t(
          movie.language || "fa",
          "userRejected"
        )

    }
  );

        }
// ==========================================
// PART 8 / 8
// 🧠 FINAL MESSAGE + CALLBACK HANDLERS
// ==========================================


// ==========================================
// پیام‌های کاربر
// ==========================================

async function handleMessage(
  message,
  env,
  ctx
) {

  if (!message.from) {
    return;
  }


  const user =
    message.from;


  const userId =
    String(user.id);


  const chatId =
    message.chat.id;


  // ذخیره کاربر
  await saveUser(
    env,
    user
  );


  // زبان فعلی
  let language =
    await getLanguage(
      env,
      userId
    );


  // ======================================
  // /start
  // ======================================

  if (
    message.text === "/start"
  ) {

    await showLanguageMenu(
      env,
      chatId
    );

    return;

  }


  // ======================================
  // انتخاب فارسی
  // ======================================

  if (
    message.text === "🇮🇷 فارسی"
  ) {

    await setLanguage(
      env,
      userId,
      "fa"
    );


    await telegram(
      env,
      "sendMessage",
      {

        chat_id:
          chatId,

        text:
          t(
            "fa",
            "languageSelected"
          )

      }
    );


    await showMainMenu(
      env,
      chatId,
      userId,
      "fa"
    );


    return;

  }


  // ======================================
  // انتخاب English
  // ======================================

  if (
    message.text === "🇬🇧 English"
  ) {

    await setLanguage(
      env,
      userId,
      "en"
    );


    await telegram(
      env,
      "sendMessage",
      {

        chat_id:
          chatId,

        text:
          t(
            "en",
            "languageSelected"
          )

      }
    );


    await showMainMenu(
      env,
      chatId,
      userId,
      "en"
    );


    return;

  }


  // ======================================
  // تغییر زبان
  // ======================================

  if (
    message.text ===
      "🌐 تغییر زبان" ||

    message.text ===
      "🌐 Change language"
  ) {

    await showLanguageMenu(
      env,
      chatId
    );

    return;

  }


  // ======================================
  // پنل مدیریت
  // ======================================

  if (
    message.text ===
      "👑 پنل مدیریت" ||

    message.text ===
      "👑 Admin panel"
  ) {

    if (
      userId !==
      String(env.ADMIN_ID)
    ) {

      await telegram(
        env,
        "sendMessage",
        {

          chat_id:
            chatId,

          text:
            t(
              language,
              "adminOnly"
            )

        }
      );

      return;

    }


    await showAdminPanel(
      env,
      chatId
    );

    return;

  }


  // ======================================
  // دریافت فیلم
  // ======================================

  if (
    message.text ===
      "🎬 دریافت فیلم" ||

    message.text ===
      "🎬 Get movie"
  ) {

    await sendRandomMovie(
      env,
      chatId,
      userId,
      language,
      ctx
    );

    return;

  }


  // ======================================
  // ارسال فیلم
  // ======================================

  if (
    message.text ===
      "📤 ارسال فیلم" ||

    message.text ===
      "📤 Send movie"
  ) {

    const member =
      await isMember(
        env,
        userId
      );


    if (!member) {

      await sendJoinMessage(
        env,
        chatId,
        language
      );

      return;

    }


    await setState(
      env,
      userId,
      "waiting_movie"
    );


    await telegram(
      env,
      "sendMessage",
      {

        chat_id:
          chatId,

        text:
          t(
            language,
            "sendMovieHelp"
          )

      }
    );


    return;

  }


  // ======================================
  // دریافت فیلم ارسالی کاربر
  // ======================================

  const state =
    await getState(
      env,
      userId
    );


  if (
    state ===
    "waiting_movie"
  ) {

    await submitMovie(
      env,
      message,
      language
    );

    return;

  }

}


// ==========================================
// منوی انتخاب زبان
// ==========================================

async function showLanguageMenu(
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
        t(
          "fa",
          "selectLanguage"
        ),

      reply_markup: {

        inline_keyboard: [

          [

            {
              text:
                "🇮🇷 فارسی",

              callback_data:
                "language:fa"

            },

            {
              text:
                "🇬🇧 English",

              callback_data:
                "language:en"

            }

          ]

        ]

      }

    }
  );

}


// ==========================================
// Callback ها
// ==========================================

async function handleCallback(
  query,
  env,
  ctx
) {

  if (!query.from) {
    return;
  }


  const userId =
    String(
      query.from.id
    );


  const chatId =
    query.message?.chat?.id;


  const messageId =
    query.message?.message_id;


  const data =
    query.data || "";


  // پاسخ اولیه
  await telegram(
    env,
    "answerCallbackQuery",
    {

      callback_query_id:
        query.id

    }
  );


  // ======================================
  // زبان فارسی
  // ======================================

  if (
    data === "language:fa"
  ) {

    await setLanguage(
      env,
      userId,
      "fa"
    );


    await telegram(
      env,
      "editMessageText",
      {

        chat_id:
          chatId,

        message_id:
          messageId,

        text:
          t(
            "fa",
            "languageSelected"
          )

      }
    );


    await showMainMenu(
      env,
      chatId,
      userId,
      "fa"
    );


    return;

  }


  // ======================================
  // English
  // ======================================

  if (
    data === "language:en"
  ) {

    await setLanguage(
      env,
      userId,
      "en"
    );


    await telegram(
      env,
      "editMessageText",
      {

        chat_id:
          chatId,

        message_id:
          messageId,

        text:
          t(
            "en",
            "languageSelected"
          )

      }
    );


    await showMainMenu(
      env,
      chatId,
      userId,
      "en"
    );


    return;

  }


  // ======================================
  // بررسی عضویت
  // ======================================

  if (
    data ===
    "check_membership"
  ) {

    const language =
      await getLanguage(
        env,
        userId
      );


    const member =
      await isMember(
        env,
        userId
      );


    if (!member) {

      await telegram(
        env,
        "answerCallbackQuery",
        {

          callback_query_id:
            query.id,

          text:
            t(
              language,
              "notMember"
            ),

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
          query.id,

        text:
          t(
            language,
            "membershipOK"
          )

      }
    );


    await telegram(
      env,
      "editMessageText",
      {

        chat_id:
          chatId,

        message_id:
          messageId,

        text:
          t(
            language,
            "membershipOK"
          )

      }
    );


    await showMainMenu(
      env,
      chatId,
      userId,
      language
    );


    return;

  }


  // ======================================
  // ⭐ امتیاز
  // ======================================

  if (
    data.startsWith("rate:")
  ) {

    const parts =
      data.split(":");


    const movieId =
      parts[1];


    const rating =
      Number(parts[2]);


    if (
      !movieId ||
      rating < 1 ||
      rating > 5
    ) {

      return;

    }


    const saved =
      await rateMovie(
        env,
        userId,
        movieId,
        rating
      );


    const language =
      await getLanguage(
        env,
        userId
      );


    await telegram(
      env,
      "answerCallbackQuery",
      {

        callback_query_id:
          query.id,

        text:
          saved
            ? t(
                language,
                "ratingThanks"
              )
            : "⭐ قبلاً امتیاز داده‌اید.",

        show_alert:
          true

      }
    );


    return;

  }


  // ======================================
  // 👑 تأیید فیلم
  // ======================================

  if (
    data.startsWith("approve:")
  ) {

    if (
      userId !==
      String(env.ADMIN_ID)
    ) {

      return;

    }


    const movieId =
      data.substring(
        "approve:".length
      );


    await approveMovie(
      env,
      movieId,
      chatId,
      messageId
    );


    return;

  }


  // ======================================
  // ❌ رد فیلم
  // ======================================

  if (
    data.startsWith("reject:")
  ) {

    if (
      userId !==
      String(env.ADMIN_ID)
    ) {

      return;

    }


    const movieId =
      data.substring(
        "reject:".length
      );


    await rejectMovie(
      env,
      movieId,
      chatId,
      messageId
    );


    return;

  }


  // ======================================
  // 📊 آمار مدیریت
  // ======================================

  if (
    data ===
    "admin:stats"
  ) {

    if (
      userId !==
      String(env.ADMIN_ID)
    ) {

      return;

    }


    const users =
      await kvJSON(
        env,
        "users:index"
      ) || [];


    const movies =
      await getMovieList(
        env
      );


    const pending =
      await countPending(
        env
      );


    const ratings =
      await countRatings(
        env
      );


    await telegram(
      env,
      "answerCallbackQuery",
      {

        callback_query_id:
          query.id,

        text:
          "📊 آمار بروزرسانی شد."

      }
    );


    await telegram(
      env,
      "sendMessage",
      {

        chat_id:
          chatId,

        text:
          `📊 آمار ربات\n\n` +
          `👥 کاربران: ${users.length}\n` +
          `🎬 فیلم‌های تأییدشده: ${movies.length}\n` +
          `⏳ در انتظار بررسی: ${pending}\n` +
          `⭐ تعداد امتیازها: ${ratings}`

      }
    );


    return;

  }

    }
