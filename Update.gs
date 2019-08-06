TelegramBotAPI.Update = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.Update.prototype = {
  /**
   *
   * @param {Object} update
   * @param {TelegramBotAPI.Bot} bot
   */
  init: function (update, bot) {
      this.raw_update = update;
      if (this.isMessage()) {
          this.message = new TelegramBotAPI.Message(this.raw_update.message);
      } else {
          this.message = null;
      }
      /**
       * @name TelegramBotAPI.Update#bot
       * @type {TelegramBotAPI.Bot|null}
       */
      this.bot = bot || null;
  },
  setBot: function (bot) {
      this.bot = bot;
  },
  /**
   *
   * @returns {TelegramBotAPI.Bot}
   */
  getBot: function () {
      return this.bot;
  },
  isMessage: function () {
      if (this.raw_update.hasOwnProperty('message')) {
          return true;
      }

      return false;
  },
  isCallbackQuery: function () {
      if (this.raw_update.hasOwnProperty('callback_query')) {
          return true;
      }

      return false;
  },
  isCommand: function () {
      if (this.isMessage() && this.raw_update.message.hasOwnProperty('entities')) {
          var is_command = this.raw_update.message.entities.some(function (e) {
              return e.type === 'bot_command';
          });

          return is_command;
      }

      return false;
  },
  /**
   *
   * @returns {TelegramBotAPI.Message|boolean}
   */
  getMessage: function () {
      if (this.isMessage()) {
          return this.message;
      }

      if (this.isCallbackQuery()) {
          return this.getCallbackQuery().getMessage();
      }

      return false;
  },
  /**
   *
   * @returns {TelegramBotAPI.CallbackQuery|boolean}
   */
  getCallbackQuery: function () {
      if (this.isCallbackQuery()) {
          return new TelegramBotAPI.CallbackQuery(this.raw_update.callback_query);
      }

      return false;
  },
};
