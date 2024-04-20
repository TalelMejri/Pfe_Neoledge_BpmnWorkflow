using Backend.Activities;
using Backend.Models;
using Backend.Service;
using Backend.Worflows;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Elsa.Workflows.Contracts;
using Timer = Elsa.Scheduling.Activities.Timer;
using Elsa.Models;
using Elsa.Expressions.Helpers;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BpmnController : ControllerBase
    {
      //  private System.Threading.Timer timer;
        ProcessusService _ProcService = new ProcessusService();
        //private DateTime _lastExecutionTime = DateTime.MinValue;
        private System.Timers.Timer _timer;
        private readonly IWorkflowRunner _workflowRunner;
        private readonly IServiceProvider _serviceProvider;
        public BpmnController(IWorkflowRunner workflowRunner, IServiceProvider serviceProvider)
        {
            _workflowRunner = workflowRunner;
            _serviceProvider = serviceProvider;
        }

        [HttpPost]
        public async Task<IActionResult> UploadBpmn([FromBody] UploadRequest request)
        {
            var content = request.Content;
            var data = request.Data;

            var elements = JsonConvert.DeserializeObject<List<ElementType>>(data);
              var replay = 0;
              var path = "";
              foreach (ElementType element in elements)
              {
                  if (element.ExtensionElements != null)
                  {
                    var extensionPath = element.ExtensionElements.FirstOrDefault(ev => ev.Path != null);
                    if (extensionPath != null && extensionPath is ExtensionElement extensionElement)
                    {
                        path = extensionElement.Path; 
                    }
                 
                    if (element.ExtensionElements.Any(ev => ev.Time != null))
                      {
                          var extensionValue = element.ExtensionElements.FirstOrDefault(ev => ev.Time != null);
                          if (int.TryParse(extensionValue.Time, out int replayMinutes))
                          {
                              replay = replayMinutes;
                          }
                          else
                          {
                              replay = 0;
                          }
                      }
                  }
              }
 
            await _ProcService.SaveProcessContent(content);
            var listWorflows = new List<String>();
            if (path=="" && replay == 0)
            {
                listWorflows = await BmnWorkflow(data);
                return Ok(listWorflows);
            }else if (path!="" && replay==0)
            {
                 string directoryToWatch = path;
                 FileSystemWatcher watcher = new FileSystemWatcher();
                 watcher.Path = directoryToWatch;
                 watcher.NotifyFilter = NotifyFilters.FileName;
                 // watcher.Filter = "*.bpmn"
                 watcher.Filter = "*.*";
                 watcher.Created += async (sender, e) =>
                 {
                     listWorflows = await BmnWorkflow(data);
                 };
                watcher.EnableRaisingEvents = true;
                return Ok(listWorflows);
            }
            else
            {
                  listWorflows = await BmnWorkflow(data);
                 _timer = new System.Timers.Timer(TimeSpan.FromMinutes(replay).TotalMilliseconds);
                 _timer.Elapsed += async (sender, e) =>
                 {
                      listWorflows = await BmnWorkflow(data);
                 };
                 _timer.AutoReset = true; // to make it executed many time
                 _timer.Start();
                 //_timer.Stop();
                 return Ok(listWorflows);
            }
        }
    
            private async Task<List<String>> BmnWorkflow(string data)
        { 
            var elements = JsonConvert.DeserializeObject<List<ElementType>>(data);
            var list = new List<String>();
            List<string> newVal= new List<string>();

            foreach (var element in elements)
            {
                switch (element.Type)
                {
                    /*case "bpmn:StartEvent":
                        list.Add(element.Id);
                        break;*/
                    case "bpmn:ScriptTask":
                         var scriptValue = element.ExtensionElements.FirstOrDefault(ev => ev.Code != null);
                          if (scriptValue != null)
                          {
                              var code = scriptValue.Code;
                              //await Task.Delay(TimeSpan.FromSeconds(2));
                              await _workflowRunner.RunAsync(new ScriptTaskWorkflow(code, newVal));
                              newVal.Clear();
                              list.Add(element.Id);
                           }
                        break;
                    case "bpmn:BusinessRuleTask":
                        var connection = element.ExtensionElements.FirstOrDefault(ev => ev.ConnectionString != null);
                        var requete = element.ExtensionElements.FirstOrDefault(ev => ev.Requete != null);
                        var type = element.ExtensionElements.FirstOrDefault(ev => ev.TypeSgbd != null);

                        if (connection != null && requete!=null && type!=null)
                        {
                            var connectionTest = connection.ConnectionString;
                            var requeteTest =requete.Requete;
                            var typesgbd =  type.TypeSgbd;
                            // await Task.Delay(TimeSpan.FromSeconds(2));
                            try
                            {
                                //var workflowRunner = _serviceProvider.GetRequiredService<IWorkflowRunner>();
                                var result = await _workflowRunner.RunAsync(new BDConnectionWorkflow(connectionTest, requeteTest, typesgbd));
                                var resVar = result.WorkflowState.Output["resultat"];
                                if (resVar != null)
                                {
                                    newVal.Clear();
                                    if (resVar is List<string> resultList)
                                    {
                                        foreach (var item in resultList)
                                        {
                                            newVal.Add(item);
                                        }
                                    }
                                    else
                                    {
                                        newVal.Clear();
                                    }
                                }
                                else
                                {
                                    newVal.Clear();
                                }
                                list.Add(element.Id);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"An error occurred: {ex.Message}");
                            }
                        }
                        break;
                    case "bpmn:SendTask":
                        list.Add(element.Id);
                        break;
                    default:
                        break;
                }
            }
            return list;
        }
      

    }
}
