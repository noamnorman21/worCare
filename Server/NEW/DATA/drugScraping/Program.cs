using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Linq;

namespace DATA
{
    // Define classes for payload data
    class SearchPayload
    {
        public string val { get; set; }
        public bool prescription { get; set; }
        public bool healthServices { get; set; }
        public int pageIndex { get; set; }
        public int orderBy { get; set; }
    }

    class SpecificDrugPayload
    {
        public string dragRegNum { get; set; }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            igroup194Db db = new igroup194Db();
            string urlBySpecificDrug = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer/GetSpecificDrug";
            string url = "https://israeldrugs.health.gov.il/GovServiceList/IDRServer/SearchByName";
            var payload = new SearchPayload
            {
                val = "",
                prescription = false,
                healthServices = false,
                pageIndex = 1,
                orderBy = 0
            };

            var payloadForSpecificDrug = new SpecificDrugPayload
            {
                dragRegNum = ""
            };

            string drugName = "None";
            string drugNameEn = "None";
            string Type = "None";
            string drugUrlEn = "None";
            string drugUrl = "None";
            DateTime modifyDate = DateTime.Now;
            
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            int totalPages = 1; // Initialize totalPages to 1
            for (int i = 0; i < 22; i++) // 27 is the number of letters in the Hebrew alphabet
            {
                payload.val = ((char)(i + 1488)).ToString(); // 1488 is the Unicode value of the first letter in the Hebrew alphabet              
                while (payload.pageIndex <= totalPages) // Continue until the current page reaches the total pages
                {
                    // Send the POST request to search drugs by name
                    string jsonPayload = JsonConvert.SerializeObject(payload);
                    HttpContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync(url, content);

                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content
                        string responseJson = await response.Content.ReadAsStringAsync();

                        // Deserialize the response JSON
                        dynamic searchData = JsonConvert.DeserializeObject<dynamic>(responseJson);

                        // Access the 'results' and 'pages' properties
                        var results = searchData.results;

                        // Process and use the search results as needed
                        foreach (var drug in results)
                        {
                            totalPages = drug.pages;
                            drugName = drug.dragHebName;
                            drugNameEn = drug.dragEnName;
                            Type = drug.dosageForm;
                            try
                            {
                                if (Type.Contains("תמיסה") || Type.Contains("סירופ"))
                                    Type = "Syrup";
                                else if (Type.Contains("משחה") || Type.Contains("ג'ל") || Type.Contains("גל") || Type.Contains("קרם") || Type.Contains("פסטה") || Type.Contains("לק"))
                                    Type = "Cream";
                                else if (Type.Contains("אבקה"))
                                    Type = "Powder";
                                else if (Type.Contains("טבליות") || Type.Contains("קפסולות") || Type.Contains("קפליות") || Type.Contains("טבליה") || Type.Contains("קפסולה") || Type.Contains("קפליה") || Type.Contains("לכסניה"))
                                    Type = "Pill";
                                else
                                    throw new Exception("Type is not valid");
                            }
                            catch (Exception)
                            {
                                Type = "Other";
                            }

                            payloadForSpecificDrug.dragRegNum = drug.dragRegNum;

                            if (!db.tblDrug.Any(d => d.drugNameEn == drugNameEn && d.drugName == drugName))
                            {
                                // Send the POST request to get specific drug information
                                string specificDrugJsonPayload = JsonConvert.SerializeObject(payloadForSpecificDrug);
                                HttpContent specificDrugContent = new StringContent(specificDrugJsonPayload, Encoding.UTF8, "application/json");
                                HttpResponseMessage specificDrugResponse = await client.PostAsync(urlBySpecificDrug, specificDrugContent);

                                if (specificDrugResponse.IsSuccessStatusCode)
                                {
                                    // Read the response content
                                    string specificDrugResponseJson = await specificDrugResponse.Content.ReadAsStringAsync();

                                    // Deserialize the response JSON
                                    dynamic specificDrugData = JsonConvert.DeserializeObject<dynamic>(specificDrugResponseJson);

                                    // Access the 'brochure' property
                                    var brochure = specificDrugData.brochure;
                                    foreach (var drugBrochure in brochure)
                                    {
                                        string lng = drugBrochure.lng;
                                        if (lng == "אנגלית")
                                        {
                                            drugUrlEn = "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/" + drugBrochure.url;
                                        }
                                        if (lng == "עברית")
                                        {
                                            drugUrl = "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/" + drugBrochure.url;
                                        }
                                    }
                                    db.InsertNewDrug(drugName, drugNameEn, drugUrl, drugUrlEn, modifyDate, Type);
                                }
                                else
                                {
                                    Console.WriteLine("Failed to get specific drug information");
                                }
                            }
                        }

                        payload.pageIndex++; // Increment the page index
                    }
                    else
                    {
                        Console.WriteLine("Failed to search drugs by name");
                        break; // Exit the loop if the request fails
                    }
                }
                payload.pageIndex = 1; // Reset the page index for the next letter
                Console.WriteLine(i);
            }
            db.SaveChanges();
            Console.WriteLine("Done");
        }
    }
}