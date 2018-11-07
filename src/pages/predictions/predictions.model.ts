export class PredictionsModel {
  voorspellingen: Prediction[];
  datum: Date;
  vorigeDag: Date;
  volgendeDag: Date;
  user: string;
  weekPosities: WeekPositie[];

  constructor(datumpie?: Date) {
    if(datumpie)
    {
      this.datum = datumpie;
    }
  }
}

export class PredictionCommand {
  wedstrijdId: number;
  thuisdoelpunten: number;
  uitdoelpunten: number;
  thuisspelerId: number;
  uitspelerId: number;
}

export class PredictionCommandResponse {
  message: string;
  errors: HttpResponseFormErrors[];
}

export class HttpResponseFormErrors {
  membernames: string[];
  errorMessage: string;
}

export class Prediction {
  punten: number;
  thuisdoelpunten: number;
  thuisspeler: Player;
  wijzigbaar: Boolean;
  uitdoelpunten: number;
  uitspeler: Player;
  wedstrijd: Match;
  opgeslagen: boolean;
  foutmelding: string;
}

enum Status {
  normal = 0
}

export class Match {
  id: number;
  datum: Date;
  hoofdcompetitie: Competition;
  competitieRonde: Competition; 
  live: boolean;
  status: Status;
  thuisdoelpunten: number;
  thuisspeler: Player;
  thuisteam: Team;
  uitdoelpunten: number;
  uitspeler: Player;
  uitteam: Team;
  wedstrijdVanDeWeek: boolean;
  week: number;
  jaar: number;
}

export class Player {
  id: number;
  positie: number;
  naam: string;
  doelpunten: number;
}

export class Team {
  id: number;
  naam: string;
  logoId: number;
  spelers: Player[];
}

export class Competition {
  id: number;
  naam: string;
  type: number;
  aantalTeams: number;
  logoId: number;
  selected: boolean;
  voorspelTopscorer: boolean;
}

export class WeekPositie {
  hoofdCompetitieId: number;
  week: number;
  jaar: number;
  positie: number;
  punten: number;
}

export class ValidationResult {
  message: string;
  errors: ValidationError[];

  constructor(message: string) {
    this.message = message;
  }
}

export class ValidationError {
  memberNames: string[];
  errorMessage: string;
}