using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class DateHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Heure { get; set; }

        [Required]
        public int Day { get; set; }

        [Required]
        public int Month { get; set; }

        [Required]
        public int Annee { get; set; }

        public Diagramme Diagramme { get; set; }
    }
}
