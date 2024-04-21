using Backend.Models;
using System.Diagnostics;

namespace Backend.Service
{
    public class ProcessusService
    {
        DbContextClasse _context = new DbContextClasse();

        public async Task<int> SaveProcessContent(string code)
        {
             var uploadedProc = new Processus();
             uploadedProc.CodeXml = code;
             uploadedProc.History = null;
             _context.Processus.Add(uploadedProc);
             await _context.SaveChangesAsync();
             return uploadedProc.Id; 
        }
    }

}
