export class PredictionsModel {
  voorspellingen: Prediction[];
  user: string;
}

export class Prediction {
  thuisDoelpunten: number;
  uitDoelpunten: number;
  punten: number;
  thuisSpelerId: number;
  uitSpelerId: number;
  wedstrijdDatum: Date;
  thuisteamNaam: string;
  uitteamNaam: string;
}
