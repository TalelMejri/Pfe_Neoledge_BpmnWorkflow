using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
   public class DbContextClasse : DbContext
    {

        public DbSet<Processus> Processus { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Diagramme> Diagrammes { get; set; }
        public DbSet<DateHistory> DateHistories { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"data source=LAPTOP-JDBLJIM4\SQLEXPRESS; initial catalog=NeoBd; integrated security=SSPI;Trust Server Certificate=true");
        }
    }
}
