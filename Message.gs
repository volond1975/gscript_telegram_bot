TelegramBotAPI.Message = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.Message.prototype = {
  init: function (raw_message) {
      this.raw_message = raw_message || {};
  },
  getText: function () {
      return this.raw_message.text;
  },
  /**
   *
   * @returns {number}
   */
  getChatId: function () {
      return this.raw_message.chat.id;
  },
  getMessageId: function () {
      return this.raw_message.message_id;
  },
  getFrom: function () {
      return new TelegramBotAPI.User(this.raw_message.from);
  }
};
