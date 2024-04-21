class HistoryAndDiagramData {
    DiagrammeName: string;
    DiagrammeCodeXml: string;
    Heure: string;
    Day: number;
    Month: number;
    Annee: number;
    Changes: Change[];
  
    constructor(
      DiagrammeName: string,
      DiagrammeCodeXml: string,
      Heure: string,
      Day: number,
      Month: number,
      Annee: number,
      Changes: Change[]
    ) {
      this.DiagrammeName = DiagrammeName;
      this.DiagrammeCodeXml = DiagrammeCodeXml;
      this.Heure = Heure;
      this.Day = Day;
      this.Month = Month;
      this.Annee = Annee;
      this.Changes = Changes;
    }
  }