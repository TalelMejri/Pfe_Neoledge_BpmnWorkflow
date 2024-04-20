using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessusController : ControllerBase
    {
        DbContextClasse _context = new DbContextClasse();

        [HttpGet("{id}")]
        public async Task<ActionResult<Processus>> GetProcessus(int id)
        {
            var processus = await _context.Processus.FindAsync(id);

            if (processus == null)
            {
                return NotFound(); 
            }

            return processus;
        }

    }
}
