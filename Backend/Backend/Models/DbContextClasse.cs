using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
   public class DbContextClasse : DbContext
    {

        public DbSet<Processus> Processus { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Diagramme> Diagrammes { get; set; }
        public DbSet<DateHistory> DateHistories { get; set; }
        public DbSet<Changes> Changes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Diagramme>()
        .HasOne(d => d.History)
        .WithMany(h => h.Diagrammes)
        .HasForeignKey(d => d.HistoryId);

            modelBuilder.Entity<Diagramme>()
                .HasOne(d => d.DateHistory)
                .WithOne()
                .HasForeignKey<Diagramme>(d => d.Id);

            modelBuilder.Entity<DateHistory>()
                .HasOne(dh => dh.Diagramme)
                .WithOne(d => d.DateHistory)
                .HasForeignKey<DateHistory>(dh => dh.DiagrammeId);

  
            modelBuilder.Entity<Changes>()
                .HasOne(c => c.Diagramme)
                .WithMany(d => d.Changes)
                .HasForeignKey(c => c.DiagrammeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"data source=LAPTOP-JDBLJIM4\SQLEXPRESS; initial catalog=NeoBd; integrated security=SSPI;Trust Server Certificate=true");
        }
    }
}
