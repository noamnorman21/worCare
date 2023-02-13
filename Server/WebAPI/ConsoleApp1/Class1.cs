using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fleck;

namespace ConsoleApp1
{
    public class ClientData
    {
        public IWebSocketConnection Connection { get; set; }
        public string Username { get; set; }
        public bool Shouldtranslate { get; set; }

        public string ConnectionId { get; set; }


    }

    public class MessageData
    {
        public string Sender { get; set; }
        public string Recipient { get; set; }

        public string Username { get; set; }
        public string Usertarget { get; set; }
        public string Content { get; set; }
        public bool ShouldTranslate { get; set; }

        public string MessageType { get; set; }
    }

}
