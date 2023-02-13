using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using Fleck;
using Google.Cloud.Translation.V2;
using Newtonsoft.Json;



namespace ConsoleApp1
{
   
    internal class Program
    {
        private static Dictionary<string,ClientData> clients= new Dictionary<string,ClientData>();
        static void Main(string[] args)
        {
            string ApiGooglekey = ENV.GetenviromentVariable();
            TranslationClient client = TranslationClient.CreateFromApiKey(ApiGooglekey);
            var server = new WebSocketServer("ws://0.0.0.0:8181");
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine("Open!");
                };
          
                    socket.OnClose = () => { Console.WriteLine("Close!"); };
                    socket.OnMessage = (message) =>
                    {

                        MessageData messagedata = JsonConvert.DeserializeObject<MessageData>(message);
                        switch (messagedata.MessageType)
                        {
                            case "message":

                                var recipient = clients.Values.FirstOrDefault(c => c.Username == messagedata.Usertarget);
                                if (recipient != null)
                                {
                                    if (recipient.Shouldtranslate)
                                    {
                                        TranslationResult result = client.TranslateText(messagedata.Content, "he", "en");
                                        Console.WriteLine(result.TranslatedText);
                                        string translatedText = result.TranslatedText;
                                        recipient.Connection.Send(translatedText);

                                    }
                                    else
                                    {
                                        recipient.Connection.Send(messagedata.Content);
                                    }
                                }
                                break;

                            case "translate preference":
                                if (clients.ContainsKey(messagedata.Sender))
                                {
                                    var client2 = clients[messagedata.Sender];
                                    client2.Shouldtranslate = messagedata.ShouldTranslate;

                                }
                                break;

                            case "clientData":

                                ClientData clientdata = new ClientData { ConnectionId = socket.ConnectionInfo.Id.ToString() };
                                clientdata.Connection = socket;
                                clientdata.Username = messagedata.Username;
                                clientdata.Shouldtranslate = true;
                                clients.Add(clientdata.ConnectionId, clientdata);
                                break;

                            default:
                                break;
                        }


                    };
                
            });

            var input = Console.ReadLine();
            while (input != "exit")
            {
                input = Console.ReadLine();
            }
        }
    }
}
