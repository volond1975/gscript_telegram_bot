TelegramBotAPI.Parameters = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.Parameters.prototype = {
  init: function () {
  },
};

/**
* @property {number} chatId
* @property {string} parseMode
* @property {boolean} disableWebPagePreview
* @property {boolean} disableNotification
* @property {number} replyToMessageId
* @property {Object} replyMarkup
* @property {string} text
* @constructor
*/
TelegramBotAPI.Parameters.Message = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.Parameters.Message.prototype = {
  /**
   *
   * @param {Object} obj
   * @param {number} obj.chatId
   * @param {string} obj.parseMode
   * @param {boolean} obj.disableWebPagePreview
   * @param {boolean} obj.disableNotification
   * @param {number} obj.replyToMessageId
   * @param {Object} obj.replyMarkup
   * @param {string} obj.text
   */
  init: function (obj) {
      tmpObj = Object.assign({
          text: null,
          chatId: null,
          parseMode: null,
          disableWebPagePreview: null,
          disableNotification: null,
          replyToMessageId: null,
          replyMarkup: null,
      }, obj);

      Object.assign(this, tmpObj);
  },
};
/**
* @property {number} chatId
* @property {number} messageId
* @property {number} inlineMessageId
* @property {string} parseMode
* @property {boolean} disableWebPagePreview
* @property {number} replyToMessageId
* @property {Object} replyMarkup
* @property {string} text
* @constructor
*/
TelegramBotAPI.Parameters.MessageText = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.Parameters.MessageText.prototype = {
  /**
   *
   * @param {Object} obj
   * @param {number} obj.chatId
   * @param {number} obj.messageId
   * @param {number} obj.inlineMessageId
   * @param {string} obj.parseMode
   * @param {boolean} obj.disableWebPagePreview
   * @param {Object} obj.replyMarkup
   * @param {string} obj.text
   */
  init: function (obj) {
      tmpObj = Object.assign({
          text: null,
          chatId: null,
          messageId: null,
          inlineMessageId: null,
          parseMode: null,
          disableWebPagePreview: null,
          replyMarkup: null,
      }, obj);

      Object.assign(this, tmpObj);
  },
};

/**
* @property {number} chatId
* @property {number} messageId
* @property {number} inlineMessageId
* @property {Object} replyMarkup
* @constructor
*/
TelegramBotAPI.Parameters.MessageReplyMarkup = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.Parameters.MessageReplyMarkup.prototype = {
  /**
   *
   * @param {Object} obj
   * @property {number} obj.chatId
   * @property {number} obj.messageId
   * @property {number} obj.inlineMessageId
   * @property {Object} obj.replyMarkup
   */
  init: function (obj) {
      tmpObj = Object.assign({
          chatId: null,
          messageId: null,
          inlineMessageId: null,
          replyMarkup: null,
      }, obj);

      Object.assign(this, tmpObj);
  },
};