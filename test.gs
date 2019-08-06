var API_TOKEN = '340010686:AAGeqWaS6IMYr3wJP0I1gzZaMshORAP9sDg' 
var ChatIDs=['192818801','589075442']//Админ первій
var adminChatID='192818801'
var Chudny='589075442'


function doPost(e) {
  update = JSON.parse(e.postData.contents);
  bot = new GScriptTelegramBot.TelegramBotAPI.Bot(API_TOKEN, update);
  
  handler = new GScriptTelegramBot.TelegramBotAPI.HandlerCommand("test", function () {
    return "testtesttest";
  });
  bot.addHandler(handler);
  
  bot.execute();
}
function doGet(e) {
  update = JSON.parse(e.postData.contents);
  bot = new GScriptTelegramBot.TelegramBotAPI.Bot(API_TOKEN, update);
  
  handler = new GScriptTelegramBot.TelegramBotAPI.HandlerCommand("test", function () {
    return "testtesttest";
  });
  bot.addHandler(handler);
  
  bot.execute();
}