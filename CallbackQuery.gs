TelegramBotAPI.CallbackQuery = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.CallbackQuery.prototype = {
  init: function (raw_callback_query) {
      this.raw_callback_query = raw_callback_query || {};
  },
  /**
   *
   * @returns {TelegramBotAPI.Message}
   */
  getMessage: function () {
      return new TelegramBotAPI.Message(this.raw_callback_query.message);
  },
  /**
   *
   * @returns {string}
   */
  getData: function () {
      return this.raw_callback_query.data;
  }
};