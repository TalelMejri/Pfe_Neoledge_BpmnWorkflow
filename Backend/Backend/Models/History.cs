using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class History
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ProcessusId { get; set; }
        [ForeignKey("ProcessusId")]
        public Processus Processus { get; set; }


        public ICollection<Diagramme> Diagrammes { get; set; }
       
    }
}
