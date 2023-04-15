using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity; // for DbContext
using System.Web.Http;
using System.Web.Http.Results;
using System.Net.Http;
using HtmlAgilityPack; // for HtmlDocument
using Newtonsoft.Json.Linq; // for JObject

namespace DATA
{
    public partial class tblCalendarForUser
    {
        igroup194Db db = new igroup194Db();
        public int InsertCalendar(int id, int[] calendarsTypeArr)
        {
            try
            {
                tblUser userExist = db.tblUser.Where(x => x.userId == id).First();
                if (userExist == null)
                    return -1;
                //24 mean the Jewish calendar, its hard coded because all users have the Jewish calendar as primary calendar
                db.InsertCalendarForUser(24, userExist.userId, true);
                foreach (int item in calendarsTypeArr)
                {
                    //here we will add all the calendars that the user choose 
                    if (item != 24)
                        db.InsertCalendarForUser(item, userExist.userId, false);
                }
                return 1;
            }
            catch (Exception)
            {
                return -1;
            }
        }
    }
    public partial class tblDrugForPatient
    {
        igroup194Db db = new igroup194Db();
        public int InsertDrugForPatient()
        {

        }

    }

    class Program
    {
        igroup194Db db = new igroup194Db();

        static async System.Threading.Tasks.Task Main(string[] args)
        {
            var url = "https://israeldrugs.health.gov.il/#!/byDrug"; // url for Drug Registery
            var web = new HtmlWeb();
            var doc = await web.LoadFromWebAsync(url);

            var searchBar = doc.DocumentNode.SelectSingleNode("//input[@id='drugSearchInput']");
            var autocompleteUrl = searchBar.GetAttributeValue("autocomplete-url", "");

            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(autocompleteUrl);
                var content = await response.Content.ReadAsStringAsync();
                var suggestions = ExtractSuggestionsFromJson(content);
                Console.WriteLine(string.Join(Environment.NewLine, suggestions));
            }
        }
        static List<string> ExtractSuggestionsFromJson(string json)
        {
            var suggestions = new List<string>();
            var root = JObject.Parse(json);
            var data = root.SelectToken("Data") as JArray;
            if (data != null)
            {
                foreach (var item in data)
                {
                    var suggestion = item.SelectToken("Name")?.Value<string>();
                    if (!string.IsNullOrEmpty(suggestion))
                    {
                        suggestions.Add(suggestion);
                    }
                }
            }
            return suggestions;
        }

    }
}