

/**
 * @param  {} api_token
 */
TelegramBotAPI.Bot = function (api_token) {
  this.init.apply(this, arguments);
};

TelegramBotAPI.Bot.prototype = {
  /**
   *
   * @param {string} api_token
   * @param {Object} update - raw object of update
   */
  init: function (api_token, update) {
      this.handlers = [];
      this.api_token = api_token;

      /**
       *
       * @type {TelegramBotAPI.Update|null}
       */
      this.update = new TelegramBotAPI.Update(update, this);
  },
  getToken: function () {
      return this.api_token;
  },
  /**
   *
   * @param {TelegramBotAPI.Handler} handler
   */
  addHandler: function (handler) {
      this.handlers.push(handler);
  },
  /**
   *
   * @param {TelegramBotAPI.Update} update
   */
  setUpdate: function (update) {
      this.update = update;
  },
  getUpdate: function () {
      return this.update;
  },
  execute: function () {
      var self = this;
      return this.handlers.some(
          /**
           *
           * @param {TelegramBotAPI.Handler} item
           * @param {number} index
           * @param {[]} array
           * @returns {boolean}
           */
          function (item, index, array) {
              item.setUpdate(self.getUpdate());
              if (item.check()) {
                  item.execute();
                  return true;
              }

              return false;
          });
  },
  /**
   *
   * @param {TelegramBotAPI.Parameters.MessageReplyMarkup} message
   */
  editMessageReplyMarkup: function (message) {
      chat_id = message.chatId || this.getUpdate().getMessage().getChatId();
      message_id = message.messageId || false;
      inline_message_id = message.inlineMessageId || false;
      reply_markup = message.replyMarkup || false;

      var payload = {
          'method': 'editMessageReplyMarkup',
      };

      if (chat_id) {
          payload.chat_id = String(chat_id);
      }

      if (message_id) {
          payload.message_id = message_id;
      }

      if (inline_message_id) {
          payload.inline_message_id = inline_message_id;
      }

      if (reply_markup) {
          payload.reply_markup = JSON.stringify(reply_markup);
      }

      var data = {
          "method": "post",
          "payload": payload
      };

      this.__request(data);
  },
  /**
   *
   * @param {TelegramBotAPI.Parameters.Message} message
   */
  sendMessage: function (message) {
      if (typeof message === 'undefined') {
          throw "Must set message (TelegramBotAPI.Parameters.Message).";
      }

      chatId = message.chatId || this.getUpdate().getMessage().getChatId();
      parse_mode = message.parseMode || "HTML";
      disable_web_page_preview = message.disableWebPagePreview || false;
      disable_notification = message.disableNotification || false;
      reply_to_message_id = message.replyToMessageId || false;
      reply_markup = message.replyMarkup || false;
      text = message.text || '';
      var payload = {
          'method': 'sendMessage',
          'chat_id': String(chatId),
          'text': text,
          'parse_mode': parse_mode,
      };

      if (disable_web_page_preview) {
          payload.disable_web_page_preview = disable_web_page_preview;
      }

      if (disable_notification) {
          payload.disable_notification = disable_notification;
      }

      if (reply_to_message_id) {
          payload.reply_to_message_id = reply_to_message_id;
      }

      if (reply_markup) {
          payload.reply_markup = JSON.stringify(reply_markup);
      }

      var data = {
          "method": "post",
          "payload": payload
      };

      this.__request(data);
  },
  /**
   *
   * @param {TelegramBotAPI.Parameters.MessageText} message
   */
  editMessageText: function (message) {
      chat_id = message.chatId || this.getUpdate().getMessage().getChatId();
      message_id = message.messageId || false;
      inline_message_id = message.inlineMessageId || false;
      text = message.text || '';
      parse_mode = message.parseMode || "HTML";
      disable_web_page_preview = message.disableWebPagePreview || false;
      reply_markup = message.replyMarkup || false;

      var payload = {
          'method': 'editMessageText',
          'text': text,
      };

      if (chat_id) {
          payload.chat_id = chat_id;
      }

      if (message_id) {
          payload.message_id = message_id;
      }

      if (inline_message_id) {
          payload.inline_message_id = inline_message_id;
      }

      if (parse_mode) {
          payload.parse_mode = parse_mode;
      }

      if (disable_web_page_preview) {
          payload.disable_web_page_preview = disable_web_page_preview;
      }

      if (reply_markup) {
          payload.reply_markup = JSON.stringify(reply_markup);
      }

      var data = {
          "method": "post",
          "payload": payload
      };

      this.__request(data);
  },
  __request: function (data) {
      var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + this.getToken() + '/', data);
      if (response.getResponseCode() !== 200) {
          MailApp.sendEmail(adminEmail, SCRIPT_NAME +" "+SCRIPT_VERSION+" Error", "", {
              htmlBody: "Status Code: " + String(response.getResponseCode()) + "<br />" +
                  "Headers: <pre><code>" + JSON.stringify(response.getAllHeaders(), null, 2) + "</code></pre><br />" +
                  "Body: " + "<br />" +
                  "<pre><code>" + response.getContentText() + "</code></pre>"
          });
      }
  },
};





