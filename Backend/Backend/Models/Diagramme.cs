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

        public int DateHistoryId { get; set; }
        [ForeignKey("DateHistoryId")]
        public DateHistory DateHistory { get; set; }
    }
}
