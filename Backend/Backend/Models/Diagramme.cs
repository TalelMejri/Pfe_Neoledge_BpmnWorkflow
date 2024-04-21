using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Diagramme
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string CodeXml { get; set; }

        public int HistoryId { get; set; }
        [ForeignKey("HistoryId")]
        public History History { get; set; }

        public DateHistory DateHistory { get; set; }

        public ICollection<Changes> ? Changes { get; set; }
    }
}
