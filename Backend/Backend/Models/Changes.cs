using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Changes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Change { get; set; }
        [Required]
        public string IdElement { get; set; }

        public int DiagrammeId { get; set; }
        [ForeignKey("DiagrammeId")]
        public Diagramme Diagramme { get; set; }
    }
}
