TelegramBotAPI.Handler = function () {
  this.init.apply(this, arguments);
};

TelegramBotAPI.Handler.prototype = {
  init: function () {
      this.update = null;
  },
  setUpdate: function (update) {
      this.update = update;
  },
  /**
   *
   * @returns {TelegramBotAPI.Update|null}
   */
  getUpdate: function () {
      return this.update;
  },
  execute: function () {
  },
  check: function () {
  },
};


