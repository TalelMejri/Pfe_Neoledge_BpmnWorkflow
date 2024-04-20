using Backend.Models;

namespace Backend.Service
{
    public class ProcessusService
    {
        DbContextClasse _context = new DbContextClasse();

        public async Task<int> SaveProcessContent(string code)
        {
             var uploadedProc = new Processus();
              uploadedProc.CodeXml = code;
             _context.Processus.Add(uploadedProc);
             await _context.SaveChangesAsync();
             return uploadedProc.Id; 
        }
    }

}
