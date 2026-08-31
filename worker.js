const CHANNEL = "@Super_Pump2";
const CHANNEL_LINK = "https://t.me/Super_Pump2";
const ARCHIVE_CHAT_ID = "-1004374846750";
const DELETE_AFTER = 20000;

const LANGS = {
  fa:{n:"🇮🇷 فارسی",w:"🎬 به ربات فیلم خوش آمدید!",j:"⚠️ ابتدا عضو کانال شوید.",g:"🎬 دریافت فیلم",s:"📤 ارسال فیلم",l:"🌐 تغییر زبان"},
  en:{n:"🇬🇧 English",w:"🎬 Welcome!",j:"⚠️ Join the channel first.",g:"🎬 Get Movie",s:"📤 Send Movie",l:"🌐 Change Language"},
  ar:{n:"🇸🇦 العربية",w:"🎬 أهلاً بك!",j:"⚠️ انضم إلى القناة أولاً.",g:"🎬 الحصول على فيلم",s:"📤 إرسال فيلم",l:"🌐 تغيير اللغة"},
  tr:{n:"🇹🇷 Türkçe",w:"🎬 Hoş geldiniz!",j:"⚠️ Önce kanala katılın.",g:"🎬 Film Al",s:"📤 Film Gönder",l:"🌐 Dil Değiştir"},
  de:{n:"🇩🇪 Deutsch",w:"🎬 Willkommen!",j:"⚠️ Bitte zuerst beitreten.",g:"🎬 Film erhalten",s:"📤 Film senden",l:"🌐 Sprache ändern"},
  fr:{n:"🇫🇷 Français",w:"🎬 Bienvenue!",j:"⚠️ Rejoignez d'abord le canal.",g:"🎬 Obtenir un film",s:"📤 Envoyer un film",l:"🌐 Changer la langue"},
  es:{n:"🇪🇸 Español",w:"🎬 ¡Bienvenido!",j:"⚠️ Únete primero al canal.",g:"🎬 Obtener película",s:"📤 Enviar película",l:"🌐 Cambiar idioma"},
  pt:{n:"🇵🇹 Português",w:"🎬 Bem-vindo!",j:"⚠️ Entre primeiro no canal.",g:"🎬 Obter filme",s:"📤 Enviar filme",l:"🌐 Mudar idioma"},
  ru:{n:"🇷🇺 Русский",w:"🎬 Добро пожаловать!",j:"⚠️ Сначала вступите в канал.",g:"🎬 Получить фильм",s:"📤 Отправить фильм",l:"🌐 Изменить язык"},
  uk:{n:"🇺🇦 Українська",w:"🎬 Ласкаво просимо!",j:"⚠️ Спочатку приєднайтесь.",g:"🎬 Отримати фільм",s:"📤 Надіслати фільм",l:"🌐 Змінити мову"},
  hi:{n:"🇮🇳 हिन्दी",w:"🎬 स्वागत है!",j:"⚠️ पहले चैनल से जुड़ें।",g:"🎬 फिल्म प्राप्त करें",s:"📤 फिल्म भेजें",l:"🌐 भाषा बदलें"},
  ur:{n:"🇵🇰 اردو",w:"🎬 خوش آمدید!",j:"⚠️ پہلے چینل میں شامل ہوں۔",g:"🎬 فلم حاصل کریں",s:"📤 فلم بھیجیں",l:"🌐 زبان تبدیل کریں"},
  zh:{n:"🇨🇳 中文",w:"🎬 欢迎!",j:"⚠️ 请先加入频道。",g:"🎬 获取电影",s:"📤 发送电影",l:"🌐 更改语言"},
  ja:{n:"🇯🇵 日本語",w:"🎬 ようこそ!",j:"⚠️ 先にチャンネルへ参加してください。",g:"🎬 映画を取得",s:"📤 映画を送信",l:"🌐 言語を変更"},
  ko:{n:"🇰🇷 한국어",w:"🎬 환영합니다!",j:"⚠️ 먼저 채널에 가입하세요.",g:"🎬 영화 받기",s:"📤 영화 보내기",l:"🌐 언어 변경"},
  it:{n:"🇮🇹 Italiano",w:"🎬 Benvenuto!",j:"⚠️ Prima entra nel canale.",g:"🎬 Ottieni film",s:"📤 Invia film",l:"🌐 Cambia lingua"},
  nl:{n:"🇳🇱 Nederlands",w:"🎬 Welkom!",j:"⚠️ Word eerst lid van het kanaal.",g:"🎬 Film ophalen",s:"📤 Film sturen",l:"🌐 Taal wijzigen"},
  pl:{n:"🇵🇱 Polski",w:"🎬 Witamy!",j:"⚠️ Najpierw dołącz do kanału.",g:"🎬 Pobierz film",s:"📤 Wyślij film",l:"🌐 Zmień język"},
  id:{n:"🇮🇩 Bahasa Indonesia",w:"🎬 Selamat datang!",j:"⚠️ Bergabunglah terlebih dahulu.",g:"🎬 Dapatkan Film",s:"📤 Kirim Film",l:"🌐 Ganti Bahasa"},
  vi:{n:"🇻🇳 Tiếng Việt",w:"🎬 Chào mừng!",j:"⚠️ Hãy tham gia kênh trước.",g:"🎬 Nhận phim",s:"📤 Gửi phim",l:"🌐 Đổi ngôn ngữ"}
};

export default {
  async fetch(request, env, ctx) {
    try {
      const u = new URL(request.url);

      if (request.method === "GET" && u.pathname === "/setup") {
        if (!env.SETUP_KEY || u.searchParams.get("key") !== env.SETUP_KEY)
          return new Response("Unauthorized",{status:401});

        return Response.json(await tg(env,"setWebhook",{
          url:u.origin+"/",
          allowed_updates:["message","callback_query"]
        }));
      }

      if (request.method === "GET") return new Response("FILM BOT ONLINE");
      if (request.method !== "POST") return new Response("OK");

      const x = await request.json();

      if (x.callback_query) await callback(x.callback_query,env,ctx);
      if (x.message) await message(x.message,env,ctx);

      return new Response("OK");
    } catch(e) {
      console.log(e);
      return new Response("OK");
    }
  }
};

async function message(m,e,c) {
  if (!m.chat) return;

  const chat=m.chat.id;
  const user=m.from?.id || chat;
  const text=m.text || "";

  if (text==="/start") {
    await languageMenu(chat,e);
    return;
  }

  const lang=await getLang(user,e);
  const l=LANGS[lang];

  if (text===l.g) {
    await getMovie(chat,user,e,c);
    return;
  }

  if (text===l.s) {
    await sendMovie(chat,user,lang,e);
    return;
  }

  if (text===l.l) {
    await languageMenu(chat,e);
    return;
  }

  if (m.video) await receive(m,"video",e);
  else if (m.photo) await receive(m,"photo",e);
}

async function callback(q,e,c) {
  const d=q.data;
  const user=q.from.id;
  const chat=q.message?.chat?.id;

  if (d.startsWith("lang|")) {
    const lang=d.split("|")[1];

    if (!LANGS[lang]) return answer(q.id,"❌ زبان نامعتبر است.",e);

    await put(e,"lang:"+user,lang);
    await answer(q.id,"✅ زبان تغییر کرد.",e);

    await join(chat,lang,e);
    return;
  }

  if (d.startsWith("check|")) {
    const lang=d.split("|")[1] || "fa";

    if (!await member(user,e)) {
      await answer(q.id,"❌ هنوز عضو کانال نیستید.",e);
      await join(chat,lang,e);
      return;
    }

    await answer(q.id,"✅ عضویت تأیید شد.",e);

    await tg(e,"sendMessage",{
      chat_id:chat,
      text:LANGS[lang].w,
      reply_markup:keyboard(lang)
    });
    return;
  }

  if (d.startsWith("rate|")) {
    const [_,id,r]=d.split("|");

    await put(e,"rating:"+id+":"+user,Number(r));
    await answer(q.id,"⭐ امتیاز شما ثبت شد.",e);

    if (chat && q.message) {
      await tg(e,"editMessageReplyMarkup",{
        chat_id:chat,
        message_id:q.message.message_id,
        reply_markup:{
          inline_keyboard:[[
            {text:"⭐ امتیاز ثبت شد: "+r+"/5",callback_data:"done"}
          ]]
        }
      });
    }
  }

  if (d.startsWith("approve|") || d.startsWith("reject|")) {
    if (String(user)!==String(e.ADMIN_ID))
      return answer(q.id,"⛔ دسترسی ندارید.",e);

    const ok=d.startsWith("approve|");
    const id=d.split("|")[1];
    const item=await get(e,"pending:"+id);

    if (!item) return answer(q.id,"❌ درخواست پیدا نشد.",e);

    if (ok) {
      let list=await get(e,"approved") || [];
      list.push(item);
      await put(e,"approved",list);
      await tg(e,"sendMessage",{
        chat_id:item.chatId,
        text:"🎉 فیلم شما تأیید شد و وارد آرشیو شد."
      });
    } else {
      await tg(e,"sendMessage",{
        chat_id:item.chatId,
        text:"❌ فیلم شما تأیید نشد."
      });
    }

    await del(e,"pending:"+id);
    await answer(q.id,ok?"✅ تأیید شد.":"❌ رد شد.",e);

    await tg(e,"editMessageReplyMarkup",{
      chat_id:q.message.chat.id,
      message_id:q.message.message_id,
      reply_markup:{inline_keyboard:[]}
    });
  }
}

async function languageMenu(chat,e) {
  const keys=Object.keys(LANGS);
  const rows=[];

  for(let i=0;i<keys.length;i+=2) {
    const row=[{
      text:LANGS[keys[i]].n,
      callback_data:"lang|"+keys[i]
    }];

    if(keys[i+1])
      row.push({
        text:LANGS[keys[i+1]].n,
        callback_data:"lang|"+keys[i+1]
      });

    rows.push(row);
  }

  await tg(e,"sendMessage",{
    chat_id:chat,
    text:"🌐 لطفاً زبان خود را انتخاب کنید:",
    reply_markup:{inline_keyboard:rows}
  });
}

function keyboard(lang) {
  const l=LANGS[lang];

  return {
    keyboard:[
      [{text:l.g},{text:l.s}],
      [{text:l.l}]
    ],
    resize_keyboard:true,
    is_persistent:true
  };
}

async function join(chat,lang,e) {
  const l=LANGS[lang] || LANGS.fa;

  await tg(e,"sendMessage",{
    chat_id:chat,
    text:l.j,
    reply_markup:{
      inline_keyboard:[
        [{text:"📢 عضویت در کانال",url:CHANNEL_LINK}],
        [{text:"✅ بررسی عضویت",callback_data:"check|"+lang}]
      ]
    }
  });
}

async function getMovie(chat,user,e,c) {
  if (!await member(user,e)) {
    await join(chat,await getLang(user,e),e);
    return;
  }

  const list=await get(e,"approved") || [];

  if (!list.length) {
    await tg(e,"sendMessage",{
      chat_id:chat,
      text:"😕 هنوز فیلمی در آرشیو وجود ندارد."
    });
    return;
  }

  let history=await get(e,"history:"+user) || [];
  let available=list.filter(x=>!history.includes(x.id));

  if (!available.length) {
    history=[];
    available=list;
  }

  const item=available[Math.floor(Math.random()*available.length)];
  history.push(item.id);

  await put(e,"history:"+user,history);

  const r=await tg(e,item.type==="video"?"sendVideo":"sendPhoto",{
    chat_id:chat,
    [item.type==="video"?"video":"photo"]:item.fileId,
    caption:"🎬 فیلم برای شما ارسال شد.\n\n⏳ این پیام بعد از ۲۰ ثانیه حذف می‌شود.\n⭐ امتیاز بدهید:",
    reply_markup:{
      inline_keyboard:[[
        {text:"⭐ 1",callback_data:"rate|"+item.id+"|1"},
        {text:"⭐ 2",callback_data:"rate|"+item.id+"|2"},
        {text:"⭐ 3",callback_data:"rate|"+item.id+"|3"},
        {text:"⭐ 4",callback_data:"rate|"+item.id+"|4"},
        {text:"⭐ 5",callback_data:"rate|"+item.id+"|5"}
      ]]
    }
  });

  if(r.ok && c)
    c.waitUntil(new Promise(resolve=>setTimeout(async()=>{
      await tg(e,"deleteMessage",{
        chat_id:chat,
        message_id:r.result.message_id
      });
      resolve();
    },DELETE_AFTER)));
}

async function sendMovie(chat,user,lang,e) {
  if (!await member(user,e)) {
    await join(chat,lang,e);
    return;
  }

  await tg(e,"sendMessage",{
    chat_id:chat,
    text:"📤 فیلم یا عکس خودت را همینجا ارسال کن."
  });
}

async function receive(m,type,e) {
  const user=m.from?.id || m.chat.id;
  const chat=m.chat.id;
  const lang=await getLang(user,e);

  if (!await member(user,e)) {
    await join(chat,lang,e);
    return;
  }

  const fileId=type==="video"
    ? m.video.file_id
    : m.photo[m.photo.length-1].file_id;

  const id=Date.now()+"_"+user+"_"+Math.random().toString(36).slice(2,7);

  const item={
    id,
    fileId,
    type,
    chatId:chat,
    userId:user
  };

  await put(e,"pending:"+id,item);

  await tg(e,type==="video"?"sendVideo":"sendPhoto",{
    chat_id:ARCHIVE_CHAT_ID,
    [type==="video"?"video":"photo"]:fileId,
    caption:"📥 محتوای جدید برای بررسی\n👤 "+user+"\n🆔 "+id,
    reply_markup:{
      inline_keyboard:[[
        {text:"✅ تأیید",callback_data:"approve|"+id},
        {text:"❌ رد",callback_data:"reject|"+id}
      ]]
    }
  });

  await tg(e,"sendMessage",{
    chat_id:chat,
    text:"✅ محتوای شما برای بررسی مدیر ارسال شد."
  });
}

async function member(user,e) {
  try {
    const r=await tg(e,"getChatMember",{
      chat_id:CHANNEL,
      user_id:user
    });

    return r.ok &&
      ["creator","administrator","member","restricted"].includes(r.result.status);
  } catch {
    return false;
  }
}

async function getLang(user,e) {
  const x=await get(e,"lang:"+user);
  return LANGS[x]?x:"fa";
}

async function answer(id,text,e) {
  await tg(e,"answerCallbackQuery",{
    callback_query_id:id,
    text
  });
}

async function get(e,key) {
  if(!e.FILM_KV) throw new Error("FILM_KV missing");

  const x=await e.FILM_KV.get(key);
  if(x===null) return null;

  try { return JSON.parse(x); }
  catch { return x; }
}

async function put(e,key,value) {
  if(!e.FILM_KV) throw new Error("FILM_KV missing");

  await e.FILM_KV.put(
    key,
    typeof value==="string"?value:JSON.stringify(value)
  );
}

async function del(e,key) {
  if(e.FILM_KV) await e.FILM_KV.delete(key);
}

async function tg(e,method,body) {
  if(!e.BOT_TOKEN) throw new Error("BOT_TOKEN missing");

  const r=await fetch(
    "https://api.telegram.org/bot"+e.BOT_TOKEN+"/"+method,
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    }
  );

  return r.json();
      }
