using Elsa.Extensions;
using Elsa.Workflows;
using Elsa.Workflows.Memory;
using Elsa.Workflows.Models;
using System.Xml;

namespace Backend.Activities
{
    public class readpbmn : CodeActivity<string>
    {
        public readpbmn(Variable<List<string>> variable) {
            nameFile = new(variable);
        }
        public Input<List<string>> nameFile { get; set; }
            public string ExtractUserIdFromBpmn(string bpmnFilePath)
             {
        
            return "";
             }

        protected override void Execute(ActivityExecutionContext context)
        {
        /*  string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
          string outputPath = Path.Combine(desktopPath, "res.txt");
          var input2 = nameFile.Get(context);
          var length= input2.ToArray().Length;
          using (StreamWriter writer = new StreamWriter(outputPath))
          {
              var i = 0;
              while (i<length)
              {
                  string rowData = $"test talel +{input2[i]}";
                  writer.WriteLine(rowData);
                  i++;
              }
          }*/
          
            Result.Set(context, "");
        }

    }
}
//string bpmnFilePath = context.Get(nameFile)!;

    /*
     try
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(bpmnFilePath);
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmlDoc.NameTable);
            nsmgr.AddNamespace("bpmn", "http://www.omg.org/spec/BPMN/20100524/MODEL");
            XmlNode serviceTaskNode = xmlDoc.SelectSingleNode("//bpmn:serviceTask", nsmgr);
            if (serviceTaskNode == null)
             {
                 return "videe";
            }
            // Extract the value of the name attribute
            string taskName = serviceTaskNode.Attributes["name"].Value;
            return taskName;
        }
        catch (Exception ex)
        {
            return "5";
        }
    */