
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


namespace DATA
{

using System;
    using System.Collections.Generic;
    
public partial class tblProduct
{

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
    public tblProduct()
    {

        this.tblProductLists = new HashSet<tblProductList>();

    }


    public int productId { get; set; }

    public string productName { get; set; }

    public int productQuantity { get; set; }

    public string commentForProduct { get; set; }



    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<tblProductList> tblProductLists { get; set; }

}

}
