TelegramBotAPI.HandlerCommand = function () {
  TelegramBotAPI.Handler.apply(this, arguments);
};
TelegramBotAPI.HandlerCommand.prototype = Object.create(TelegramBotAPI.Handler.prototype);
TelegramBotAPI.HandlerCommand.prototype.constructor = TelegramBotAPI.HandlerCommand;
TelegramBotAPI.HandlerCommand.prototype.init = function (commandName, returnMessage) {
  this.commandName = commandName;
  this.returnMessage = returnMessage;
};
TelegramBotAPI.HandlerCommand.prototype.getCommandName = function () {
  return this.commandName;
};
TelegramBotAPI.HandlerCommand.prototype.check = function () {
  update = this.getUpdate();
  if (update.isCommand() && update.getMessage().getText().indexOf("/" + this.commandName) === 0) {
      return true;
  }

  return false;
};
TelegramBotAPI.HandlerCommand.prototype.execute = function () {
  if (typeof this.returnMessage === "function") {
      message = this.returnMessage(this);
      if (typeof message === "string") {
          message = new TelegramBotAPI.Parameters.Message({text: message});
      }
  } else {
      message = new TelegramBotAPI.Parameters.Message({text: this.returnMessage});
  }

  this.getUpdate().getBot().sendMessage(message);
};

/**
*
* @class
*/
TelegramBotAPI.HandlerCallback = function () {
  TelegramBotAPI.Handler.apply(this, arguments);
};
TelegramBotAPI.HandlerCallback.prototype = Object.create(TelegramBotAPI.Handler.prototype);
TelegramBotAPI.HandlerCallback.prototype.constructor = TelegramBotAPI.HandlerCommand;
TelegramBotAPI.HandlerCallback.prototype.init = function (queryStartWith, handlerFunction) {
  this.queryStartWith = queryStartWith;
  this.handlerFunction = handlerFunction;
};
TelegramBotAPI.HandlerCallback.prototype.getQueryStartWith = function () {
  return this.queryStartWith;
};
TelegramBotAPI.HandlerCallback.prototype.check = function () {
  update = this.getUpdate();
  if (update.isCallbackQuery() && update.getCallbackQuery().getData().indexOf(this.queryStartWith) === 0) {
      return true;
  }

  return false;
};
TelegramBotAPI.HandlerCallback.prototype.execute = function () {
  if (typeof this.handlerFunction === "function") {
      message = this.handlerFunction(this.getUpdate().getCallbackQuery(), this);
  } else {
      message = new TelegramBotAPI.Bot.Parameters.Message({text: this.handlerFunction});
  }

  this.getUpdate().getBot().sendMessage(message);
};

/**
* @class
*/
TelegramBotAPI.HandlerCommandWithParams = function () {
  TelegramBotAPI.Handler.apply(this, arguments);
};

TelegramBotAPI.HandlerCommandWithParams.prototype = Object.create(TelegramBotAPI.Handler.prototype);
TelegramBotAPI.HandlerCommandWithParams.prototype.constructor = TelegramBotAPI.HandlerCommand;
/**
* @param commandName
* @param param
* @param handlerFunction
* @param errorHandlerFunction
* @param {Object} options Options
* @param {Boolean} options.exceptByFirstError
* @param {String|RegExp} options.separator
*/
TelegramBotAPI.HandlerCommandWithParams.prototype.init = function (commandName, param, handlerFunction, errorHandlerFunction, options) {
  this.commandName = commandName;
  /**
   * @type {TelegramBotAPI.HandlerCommandWithParams.Param}
   */
  this.param = param;
  this.options = options || {};
  this.options = Object.assign({
      exceptByFirstError: false,
      separator: /\ +/,
  }, this.options);

  this.commandParams = null;

  this.returnObj = {};
  this.returnObjErrors = [];

  this.handlerFunction = handlerFunction;
  this.errorHandlerFunction = errorHandlerFunction;
};
TelegramBotAPI.HandlerCommandWithParams.prototype.setReturnObjParam = function (name, value) {
  this.returnObj[name] = value;
};
TelegramBotAPI.HandlerCommandWithParams.prototype.addReturnObjError = function (paramName, text) {
  this.returnObjErrors.push({paramName: paramName, errorText: text});
};
TelegramBotAPI.HandlerCommandWithParams.prototype.getCommandName = function () {
  return this.commandName;
};
TelegramBotAPI.HandlerCommandWithParams.prototype.check = function () {
  update = this.getUpdate();
  if (update.isCommand() && update.getMessage().getText().indexOf("/" + this.commandName) === 0) {
      return true;
  }

  return false;
};
TelegramBotAPI.HandlerCommandWithParams.prototype.sliceCommandParams = function (start) {
  this.commandParams = this.commandParams.slice(start);

  return this.commandParams;
};
TelegramBotAPI.HandlerCommandWithParams.prototype.execute = function () {
  text = this.getUpdate().getMessage().getText();
  params = text.split(this.options.separator);
  params.shift();
  this.commandParams = params;

  if (this.param.evaluate(this)) {
      message = this.handlerFunction(this.returnObj, this);
  } else {
      message = this.errorHandlerFunction(this.returnObj, this.returnObjErrors, this);
  }

  this.getUpdate().getBot().sendMessage(message);
};

TelegramBotAPI.HandlerCommandWithParams.Param = function () {
  this.init.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.Param.prototype = {
  /**
   *
   * @param {Object} options
   * @param {string} options.paramName
   * @param {string} options.errorText
   * @param {string} options.errorNotSetText
   * @param {boolean} options.mutableParams
   * @param {boolean} options.required
   * @param {string|boolean|number} options.defaultValue
   * @param {[TelegramBotAPI.HandlerCommandWithParams.Param]} params
   */
  init: function (options, params) {
      this.options = options || {};
      this.options = Object.assign({
          mutableParams: false,
          required: true,
          errorNotSetText: "Param is not set!",
      }, this.options);
      this.params = params || [];
  },
  getParamByName: function (commandName) {
      for (var i = 0; i < this.params.length; i++) {
          if (this.params[i].getParamName() === commandName) {
              return this.params[i];
          }
      }

      return false;
  },
  getParamName: function () {
      return this.options.paramName;
  },
  isRequired: function () {
      return this.options.required;
  },
  /**
   *
   * @param {[]} commandParams
   * @param {TelegramBotAPI.HandlerCommandWithParams} handler
   */
  evaluate: function (handler) {
      result = true;

      if (handler.commandParams.length === 0) {
          this.setNotSetError(handler);
          return false;
      }

      if (this.options.mutableParams) {
          mutableResult = {};
          for (var j = 0; j < this.getMaxCountOfParams(); j++) {
              for (var i = 0; i < this.params.length; i++) {
                  if (typeof mutableResult[this.params[i].getParamName()] !== "undefined" && mutableResult[this.params[i].getParamName()]) {
                      continue;
                  }

                  if (handler.commandParams.length !== 0 && this.params[i].check(handler)) {
                      handler.setReturnObjParam(this.params[i].getParamName(), this.params[i].evaluate(handler));
                      mutableResult[this.params[i].getParamName()] = true;
                      handler.sliceCommandParams(this.params[i].getMaxCountOfParamsToDelete());
                  } else {
                      mutableResult[this.params[i].getParamName()] = false;
                  }
              }
          }

          for (var prop in mutableResult) {
              /**
               *
               * @type {TelegramBotAPI.HandlerCommandWithParams.Param} tmpParam
               */
              tmpParam = this.getParamByName(prop);

              if (mutableResult[prop]) {
                  result = result && mutableResult[prop];
              } else {
                  try {
                      dafault = tmpParam.getDefaultValue();
                      handler.setReturnObjParam(prop, dafault);

                      result = result && true;
                  } catch (e) {
                      if (tmpParam.isRequired()) {
                          tmpParam.setNotSetError(handler);
                          result = result && mutableResult[prop];
                      } else {
                          result = result && true;
                      }
                  }
              }
          }

          if (handler.options.exceptByFirstError && !result) {
              return false;
          }
      } else {
          for (var i = 0; i < this.params.length; i++) {
              if (handler.commandParams.length === 0) {
                  try {
                      dafault = this.params[i].getDefaultValue();
                      handler.setReturnObjParam(this.params[i].getParamName(), dafault);
                  } catch (e) {
                      if (this.params[i].isRequired()) {
                          this.params[i].setNotSetError(handler);
                          result = result && false;
                      }
                  }

                  continue;
              }

              if (this.params[i].check(handler)) {
                  handler.setReturnObjParam(this.params[i].getParamName(), this.params[i].evaluate(handler));
                  handler.sliceCommandParams(this.params[i].getMaxCountOfParamsToDelete());
              } else {
                  try {
                      dafault = this.params[i].getDefaultValue();
                      handler.setReturnObjParam(this.params[i].getParamName(), dafault);
                      handler.sliceCommandParams(this.params[i].getMaxCountOfParamsToDelete());


                      result = result && true;
                  } catch (e) {
                      if (this.params[i].isRequired()) {
                          this.params[i].setNotSetError(handler);
                          result = result && false;
                      }
                  }
              }

              if (handler.options.exceptByFirstError && !result) {
                  return false;
              }
          }
      }

      return result;
  },
  check: function (handler) {
      return true;
  },
  setErrors: function (handler) {

  },
  getDefaultValue: function () {
      if (typeof this.options.defaultValue !== 'undefined') {
          if (typeof this.options.defaultValue === "function") {
              dafaultValue = this.options.defaultValue();
          } else {
              dafaultValue = this.options.defaultValue;
          }

          return dafaultValue;
      } else {
          throw "Default value is not set.";
      }
  },
  getMaxCountOfParams: function () {
      result = 0;
      for (var i = 0; i < this.params.length; i++) {
          result += this.params[i].getMaxCountOfParams();
      }

      return result;

      //return 0;
  },
  getMaxCountOfParamsToDelete: function () {
      return 0;
  },
  setNotSetError: function (handler) {
      if (this.options.required) {
          handler.addReturnObjError(this.options.paramName, this.options.errorNotSetText);
      }
  }
};

TelegramBotAPI.HandlerCommandWithParams.ParamString = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamString.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamString.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
/**
*
* @param {TelegramBotAPI.HandlerCommandWithParams} handler
* @returns {boolean}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamString.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  if (isNaN(Number(localParam)) && typeof localParam === 'string') {
      return true;
  } else {
      return false;
  }
};
TelegramBotAPI.HandlerCommandWithParams.ParamString.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  return localParam;
};
TelegramBotAPI.HandlerCommandWithParams.ParamString.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamString.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};

TelegramBotAPI.HandlerCommandWithParams.ParamNumber = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamNumber.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamNumber.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamNumber.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  if (!isNaN(Number(localParam))) {
      return true;
  } else {
      return false;
  }
};
TelegramBotAPI.HandlerCommandWithParams.ParamNumber.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  return Number(localParam);
};
TelegramBotAPI.HandlerCommandWithParams.ParamNumber.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamNumber.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};

TelegramBotAPI.HandlerCommandWithParams.ParamDate = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamDate.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamDate.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
/**
*
* @param {TelegramBotAPI.HandlerCommandWithParams} handler
* @returns {boolean}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamDate.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  if (localParam) {
      rx = /^(\d?\d)(?:[\/.]\d?\d(?:[\/.](?:\d\d)?\d\d)?)?$/;
      match = localParam.match(rx);

      if (match) {
          day = match[1];
          if (day <= 31 && day > 0) {
              return true;
          }
      }
  }

  return false;
};
TelegramBotAPI.HandlerCommandWithParams.ParamDate.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  rx = /(\d?\d)(?:[\/.](\d?\d)(?:[\/.]((?:\d\d)?\d\d))?)?/;
  match = localParam.match(rx);
  date = {'day': 0, 'month': 0, 'year': 0};

  match.shift();

  
  if (day = match.shift()) {
      date.day = day;

      if (month = match.shift()) {
          date.month = month;

          if (year = match.shift()) {
              date.year = year;
          }
      }
  }

  now = new Date();
  if (date.year == 0) {
      date.year = now.getFullYear();
  }

  if (date.month == 0) {
      date.month = now.getMonth() + 1;
  }

  if (date.month <= 9) {
      date.month = "0" +date.month;
  }

  if (date.day <= 9) {
      date.day = "0" + date.day;
  }

  if (date.year.length == 2) {
      date.year = "20" + date.year;
  }

  return Utilities.formatString("%s/%s/%s", date.day, date.month, date.year);
};
TelegramBotAPI.HandlerCommandWithParams.ParamDate.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamDate.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};

TelegramBotAPI.HandlerCommandWithParams.ParamTime = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamTime.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamTime.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamTime.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  rx = /^(\d+(?:[.,]\d+)?)([hmчм]?)$/;
  match = localParam.match(rx);
  if (match) {
      return true;
  }

  return false;
};
/**
*
* @param commandParams
* @param handler
* @returns {{}|*}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamTime.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  rx = /^(\d+(?:[.,]\d+)?)([hmчм]?)$/;
  match = localParam.match(rx);
  obj = {};
  obj.time = match[1];
  obj.dimension = match[2];

  if (obj.dimension == 'ч' || obj.dimension == '') {
      obj.dimension = 'h';
  }

  if (obj.dimension == 'м') {
      obj.dimension = 'm';
  }

  if (obj.dimension == 'm') {
      obj.dimension = 'h';
      obj.time = obj.time / 60;
  }

  obj.time = String(obj.time).replace(".", ",");

  return obj;
};
TelegramBotAPI.HandlerCommandWithParams.ParamTime.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamTime.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};

TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  if (localParam) {
      rx = /^(\d+(?:[.,]\d+)?)(?:\*(\d+(?:[.,]\d+)?))?$/;
      match = localParam.match(rx);
      if (match) {
          return true;
      }
  }

  return false;
};
/**
*
* @param commandParams
* @param handler
* @returns {{}|*}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  rx = /^(\d+(?:[.,]\d+)?)(?:\*(\d+(?:[.,]\d+)?))?$/;
  match = localParam.match(rx);
  obj = {};
  obj.sum = match[1];
  obj.sum = obj.sum.replace(".", ",");
  obj.sumInt = obj.sum.replace(",", ".");
  if (match[2] != null) {
      obj.rate = match[2];
      obj.rate = obj.rate.replace(".", ",");
      obj.rateInt = obj.rate.replace(",", ".");
  } else {
      obj.rate = "";
      obj.rateInt = 1;
  }

  if (obj.rate !== "") {
      obj.sum = "=" + String(obj.sum) + "*" + String(obj.rate);
      obj.sumDisplay = obj.sumInt * obj.rateInt;
  } else {
      obj.sumDisplay = obj.sumInt;
  }

  return obj;
};
TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamMoneyWithExchange.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};

TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  keys = Object.keys(this.options.valueList);

  localParam = localParam.toLowerCase();
  that = this;
  value = null;
  keys.some(function (item, index, array) {
      if (that.options.valueList[item].indexOf(localParam) !== -1) {
          value = item;

          return;
      }
  });

  if (value !== null) {
      this._value = value;
      return true;
  }

  return false;
};
/**
*
* @param commandParams
* @param handler
* @returns {{}|*}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  return this._value;
};
TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamValueFromListWithSynonymous.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};

TelegramBotAPI.HandlerCommandWithParams.ParamDescription = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamDescription.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamDescription.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamDescription.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  if (handler.commandParams.length > 0) {
      return true;
  }

  return false;
};
/**
*
* @param commandParams
* @param handler
* @returns {{}|*}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamDescription.prototype.evaluate = function (handler) {
  this._max_count_of_params = handler.commandParams.length;

  return handler.commandParams.join(' ');
};
TelegramBotAPI.HandlerCommandWithParams.ParamDescription.prototype.getMaxCountOfParams = function () {
  return this._max_count_of_params;
};
TelegramBotAPI.HandlerCommandWithParams.ParamDescription.prototype.getMaxCountOfParamsToDelete = function () {
  return this._max_count_of_params;
};

TelegramBotAPI.HandlerCommandWithParams.ParamNamed = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamNamed.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamNamed.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamNamed.prototype.check = function (handler) {
  firstParam = handler.commandParams[0];
  secondParam = handler.commandParams[1];

  if (!firstParam || !secondParam) {
      return false;
  }

  if (this.options.names.indexOf(firstParam) !== -1) {
      return this.options.param.check({commandParams: [secondParam]});
  }

  return false;
};
/**
*
* @param commandParams
* @param handler
* @returns {{}|*}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamNamed.prototype.evaluate = function (handler) {
  return this.options.param.evaluate({commandParams: [handler.commandParams[1]]});
};
TelegramBotAPI.HandlerCommandWithParams.ParamNamed.prototype.getMaxCountOfParams = function () {
  return 2;
};
TelegramBotAPI.HandlerCommandWithParams.ParamNamed.prototype.getMaxCountOfParamsToDelete = function () {
  return 2;
};

/**
*
* @constructor
*/
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber = function () {
  TelegramBotAPI.HandlerCommandWithParams.Param.apply(this, arguments);
};
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber.prototype = Object.create(TelegramBotAPI.HandlerCommandWithParams.Param.prototype);
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber.prototype.constructor = TelegramBotAPI.HandlerCommandWithParams.Param;
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber.prototype.check = function (handler) {
  localParam = handler.commandParams[0];

  if (localParam) {
      rx = /^(?:\+?(?:38))?(0\d{9,9})$/;
      match = localParam.match(rx);
      if (match) {
          return true;
      }
  }

  return false;
};
/**
*
* @param commandParams
* @param handler
* @returns {{}|*}
*/
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber.prototype.evaluate = function (handler) {
  localParam = handler.commandParams[0];

  rx = /^(?:\+?(?:38))?(0\d{9,9})$/;
  match = localParam.match(rx);
  number = match[1];

  return '38' + number;
};
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber.prototype.getMaxCountOfParams = function () {
  return 1;
};
TelegramBotAPI.HandlerCommandWithParams.ParamPhoneNumber.prototype.getMaxCountOfParamsToDelete = function () {
  return 1;
};