using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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
            var processus = await _context.Processus
                                 .Include(p => p.History)
                                 .FirstOrDefaultAsync(p => p.Id == id);

            if (processus == null)
            {
                return NotFound();
            }

            return processus;
        }


        [HttpGet("{id}/Diagrammes")]
        public async Task<ActionResult<IEnumerable<Diagramme>>> GetDiagrammesByProcessusHistory(int id)
        {
            var processus = await _context.Processus
               .Include(p => p.History)
            .ThenInclude(h => h.Diagrammes)
                .ThenInclude(d => d.Changes) 
        .Include(p => p.History)
            .ThenInclude(h => h.Diagrammes)
                .ThenInclude(d => d.DateHistory) 
        .FirstOrDefaultAsync(p => p.Id == id);

            if (processus == null || processus.History == null || processus.History.Diagrammes == null)
            {
                return NotFound();
            }

            var diagrammes = processus.History.Diagrammes.ToList();

            return diagrammes;
        }

        [HttpPost("{processusId}/HistoryAndDiagramWithChanges")]
        public async Task<ActionResult> AddHistoryAndDiagramWithChangesToProcessus(int processusId, [FromBody] HistoryAndDiagramDto historyAndDiagramDto)
        {
            var processus = await _context.Processus.FindAsync(processusId);
            if (processus == null)
            {
                return NotFound($"Processus with ID {processusId} not found.");
            }

            var existingHistory = await _context.Histories.FirstOrDefaultAsync(h => h.ProcessusId == processusId);
            var newHistory = new History { ProcessusId = processusId };
            if (existingHistory == null)
            {
                _context.Histories.Add(newHistory);
                processus.History = newHistory;
            }
            else
            {
            
                newHistory = existingHistory;
            }

            var newDiagramme = new Diagramme
            {
                Name = historyAndDiagramDto.DiagrammeName,
                CodeXml = historyAndDiagramDto.DiagrammeCodeXml,
                History = newHistory
            };
            _context.Diagrammes.Add(newDiagramme);

            foreach (var changeDto in historyAndDiagramDto.Changes)
            {
                var newChange = new Changes
                {
                    Change = changeDto.change,
                    IdElement = changeDto.IdElement,
                    Diagramme = newDiagramme
                };
                _context.Changes.Add(newChange);
            }

            var newDateHistory = new DateHistory
            {
                Heure = historyAndDiagramDto.Heure,
                Day = historyAndDiagramDto.Day,
                Month = historyAndDiagramDto.Month,
                Annee = historyAndDiagramDto.Annee,
                Diagramme = newDiagramme
            };
            _context.DateHistories.Add(newDateHistory);

            await _context.SaveChangesAsync();
            return Ok("History, Diagram, and Changes added successfully.");
        }
        public class HistoryAndDiagramDto
        {
            public string DiagrammeName { get; set; }
            public string DiagrammeCodeXml { get; set; }
            public string Heure { get; set; }
            public int Day { get; set; }
            public int Month { get; set; }
            public int Annee { get; set; }
            public List<ChangeDto> Changes { get; set; }
        }

        public class ChangeDto
        {
            public string change { get; set; }
            public string IdElement { get; set; }
        }
    }
}

