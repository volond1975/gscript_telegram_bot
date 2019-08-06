TelegramBotAPI.User = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.User.prototype = {
  init: function (raw_user) {
      this.raw_user = raw_user || {};
  },
  getId: function () {
      return this.raw_user.id;
  },
  getFirsName: function () {
      return this.raw_user.first_name;
  },
};