//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ClassLibrary
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblList
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tblList()
        {
            this.tblProductList = new HashSet<tblProductList>();
        }
    
        public int listId { get; set; }
        public string listName { get; set; }
        public System.DateTime listFromDate { get; set; }
        public Nullable<System.DateTime> listToDate { get; set; }
        public string listComment { get; set; }
    
        public virtual tblActualList tblActualList { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblProductList> tblProductList { get; set; }
    }
}