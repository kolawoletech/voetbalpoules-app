export class PredictionsModel {
  voorspellingen: Prediction[];
  datum: Date;
  vorigeDag: Date;
  volgendeDag: Date;
  user: string;

  constructor(datumpie?: Date) {
    if(datumpie)
    {
      this.datum = datumpie;
    }
  }
}

export class Prediction {
  punten: number;
  thuisdoelpunten: number;
  thuisspeler: Player;
  wijzigbaar: Boolean;
  uitdoelpunten: number;
  uitspeler: Player;
  wedstrijd: Match;
}

enum Status {
  normal = 0
}

export class Match {
  datum: Date;
  hoofdcompetitie: Competition;
  live: boolean;
  status: Status;
  thuisdoelpunten: number;
  thuisspeler: Player;
  thuisteam: Team;
  uitdoelpunten: number;
  uitspeler: Player;
  uitteam: Team;
  wedstrijdVanDeWeek: boolean;
}

export class Player {
  id: number;
  naam: string;
}

export class Team {
  id: number;
  naam: string;
  logoId: number;
}

export class Competition {
  id: number;
  naam: string;
  logoId: number;
}