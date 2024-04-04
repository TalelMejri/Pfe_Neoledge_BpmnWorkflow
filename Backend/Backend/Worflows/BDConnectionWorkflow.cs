using Backend.Activities;
using Backend.Models;
using Elsa.Expressions;
using Elsa.Expressions.Models;
using Elsa.Extensions;
using Elsa.Http;
using Elsa.Models;
using Elsa.Workflows;
using Elsa.Workflows.Activities;
using Elsa.Workflows.Activities.Flowchart.Models;
using Elsa.Workflows.Contracts;
using Elsa.Workflows.Memory;
using Elsa.Workflows.Models;
using JetBrains.Annotations;
using System.Runtime.CompilerServices;

namespace Backend.Worflows
{
    public class BDConnectionWorkflow : WorkflowBase
    {
        private readonly string _data;
        private readonly string _requete;
        private readonly string _type;
        public BDConnectionWorkflow(string data,string requete, string type)
        {
            _data = data;
            _requete = requete;
            _type = type;
        }

        protected override async void Build(IWorkflowBuilder builder)
        {
            var res = builder.WithVariable<List<string>>().WithMemoryStorage();
            var req = builder.WithVariable<string>(_requete);
            var conn = builder.WithVariable<string>(_data);
            var type=builder.WithVariable<string>(_type);
            var workflowCompleted = builder.WithVariable<bool>("WorkflowCompleted", false); 
            builder.Root = new Sequence
            {
                Variables = { res,workflowCompleted},
                Activities =
              {
                new ExecuterRequetek(req, conn, type)
                {
                    Result = new(res),
                },
                new Inline(context => context.WorkflowExecutionContext.Output["resultat"] =  res.Get(context)!)
              },
            };
        }
    }
}
