using Backend.Activities;
using Elsa.Http;
using Elsa.Workflows;
using Elsa.Workflows.Activities;
using Elsa.Workflows.Contracts;
using JetBrains.Annotations;

namespace Backend.Worflows
{
    public class ScriptTaskWorkflow : WorkflowBase
    {
      private readonly string _data;
        private readonly List<string> newVal;

        public ScriptTaskWorkflow(string data, List<string> newVal)
        {
            _data = data;
            this.newVal = newVal;
        }
     
        protected override void Build(IWorkflowBuilder builder)
        {
            var code = builder.WithVariable<string>(_data);
            var test = builder.WithVariable<List<string>>(newVal);

            builder.Root = new Sequence
            {
                Activities =
            {
                new PythonScriptTask(code,test),
                new WriteHttpResponse
                {
                    Content = new("Python Executed")
                }
            }
            };
        }
    }
}
