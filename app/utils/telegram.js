/////////////////////////////////////////////////////////////////////
// 텔레그램 봇 API로 특정 채팅방에 메시지를 전송하는 모듈
/////////////////////////////////////////////////////////////////////

const axios = require('axios');

const TELEGRAM_API_BASE = 'https://api.telegram.org';

// 특정 채팅방으로 메시지를 전송한다
// botToken : 텔레그램 봇 토큰
// chatId : 전송할 채팅방 ID
// message : 전송할 텍스트
// options : { parse_mode, disable_notification 등 텔레그램 API 추가 옵션 }
exports.sendMessage = async function (botToken, chatId, message, options) {
  if (!botToken) {
    global.logger.error('Telegram sendMessage failed: botToken is not set.');
    return { ok: false, error: 'botToken is not set' };
  }

  if (!chatId) {
    global.logger.error('Telegram sendMessage failed: chatId is not set.');
    return { ok: false, error: 'chatId is not set' };
  }

  const url = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;

  try {
    const res = await axios.post(url, {
      chat_id: chatId,
      text: message,
      ...options
    });

    global.logger.debug(`Telegram message sent to ${chatId}.`);

    return res.data;
  } catch (err) {
    const errMsg = err.response ? err.response.data : err.message;
    global.logger.error('Telegram sendMessage error: ', errMsg);

    return { ok: false, error: errMsg };
  }
};

