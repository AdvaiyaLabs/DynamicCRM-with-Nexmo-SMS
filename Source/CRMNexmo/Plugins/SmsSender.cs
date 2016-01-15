using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace DynamicCRMWithNexmoSMS.Plugins
{
    public  class SmsSender
    {

        public string GetAccountNumber(string username, string password)
        {
            string FromNumber = string.Empty;
            string uri = string.Format("https://rest.nexmo.com/account/numbers/{0}/{1}", username, password);
            HttpWebRequest request = WebRequest.Create(uri) as HttpWebRequest;
            request.ContentType = "application/json";
            request.Accept = "application/json";
            request.Method = "GET";
            HttpWebResponse response = request.GetResponse() as HttpWebResponse;
            string result = string.Empty;
            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            {
                result = reader.ReadToEnd();
            }
            DataContractJsonSerializer js = new DataContractJsonSerializer(typeof(RootObject));
            MemoryStream ms = new MemoryStream(System.Text.ASCIIEncoding.ASCII.GetBytes(result));
            RootObject fireBall = (RootObject)js.ReadObject                                                                                                                                                                                                             (ms);
            FromNumber = fireBall.numbers[0].msisdn;
            ms.Close();
            return FromNumber;
        }

        public string SendSMS(string number, string from, string username, string pasword, string text)
        {
            string uri = string.Format("https://rest.nexmo.com/sms/json?api_key={0}&api_secret={1}&from={2}&to={3}&text={4}", username, pasword, from, number, text);
            //string uri = "https://rest.nexmo.com/sms/xml?api_key=5b2a23d7&api_secret=59d9fa03&from=919460264151&to=919950464151&text=Hi%2c+this+is+KK+Nexmo+DEMO";
            var json = new WebClient().DownloadString(uri);
            return json; 
            //return ParseSmsResponseJson(json);
        }

        private SmsResponse ParseSmsResponseJson(string json)
        {
            // hyphens are not allowed in in .NET var names
            json = json.Replace("message-count", "MessageCount");
            json = json.Replace("message-price", "MessagePrice");
            json = json.Replace("message-id", "MessageId");
            json = json.Replace("remaining-balance", "RemainingBalance");
            return new JavaScriptSerializer().Deserialize<SmsResponse>(json);
        }
    }

    public class Message
    {
        public string To { get; set; }
        public string Messageprice { get; set; }
        public string Status { get; set; }
        public string MessageId { get; set; }
        public string RemainingBalance { get; set; }
    }

    public class SmsResponse
    {
        public string Messagecount { get; set; }
        public List<Message> Messages { get; set; }
    }

    [DataContract]
    public class Number
    {
        [DataMember(Name = "country", IsRequired = true)]
        public string country { get; set; }

        [DataMember(Name = "msisdn", IsRequired = true)]
        public string msisdn { get; set; }

        [DataMember(Name = "type", IsRequired = true)]
        public string type { get; set; }

        [DataMember(Name = "features", IsRequired = true)]
        public List<string> features { get; set; }
    }

    [DataContract]
    public class RootObject
    {
        [DataMember(Name = "count", IsRequired = true)]
        public int count { get; set; }

        [DataMember(Name = "numbers", IsRequired = true)]
        public List<Number> numbers { get; set; }
    }


}
