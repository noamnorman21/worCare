using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ProductListDTO
    {
        public int productId { get; set; }
        public int actualId { get; set; }
        public int taskId { get; set; }
        public string commentForProduct { get; set; }
        public string productStatus { get; set; }
        public int productQuantity { get; set; }
        public string productName { get; set; }
    }
}