using Backend.Models;
using Elsa.Expressions;
using Elsa.Extensions;
using Elsa.Workflows;
using Elsa.Workflows.Memory;
using Elsa.Workflows.Models;
using Python.Runtime;

namespace Backend.Activities
{
    public class PythonScriptTask : Activity
    {
        public PythonScriptTask(Variable<string> code,Variable<List<string>> test)
        {
            Script = new(code);
            TestVal = new(test);
        }
        public Input<List<string>> TestVal { get; set; }
        public Input<string> Script { get; set; }

        public void TestPython(string code_val,List<string> data_val)
        {
           Runtime.PythonDLL = @"C:\Users\talel\AppData\Local\Programs\Python\Python312\Python312.dll";
          
           PythonEngine.Initialize();
           PythonEngine.BeginAllowThreads(); 
          
           using (Py.GIL())
           {
                PythonEngine.RunSimpleString("dataApi = ''");

                // Concatenate all items into dataApi
                foreach (var item in data_val)
                {
                    PythonEngine.RunSimpleString($"dataApi += '{item}\\n'");
                }

                // Execute the Python script after concatenating all data
                PythonEngine.RunSimpleString(code_val);
            }
           PythonEngine.Shutdown();
          
        }
        protected override void Execute(ActivityExecutionContext context)
        {
            string code_val = Script.Get(context);
            List<string> data_val = TestVal.Get(context);
            TestPython(code_val, data_val);
        }
    }
}
