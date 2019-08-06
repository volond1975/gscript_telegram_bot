


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