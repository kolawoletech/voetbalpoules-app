import { Competition, Team } from '../predictions/predictions.model';

export class ToernooiverloopVoorspellingen
{
    voorspellingenEindstand: VoorspellingEindstand[];
    voorspellingenKnockout: ToernooiVoorspellingen;
}

export class VoorspellingEindstand
{
    competitieGroepId: number;
    teamId: number;
    eindpositie: number;
    punten: number;
}

export class VoorspellingEindstandDto
{
    team: Team;
    eindpositie: number;
    punten: number;
}

export class ToernooiVoorspellingen
{
    //finales: FinaleRonde[];
    finales: FinaleWedstrijd[];
    winnaar: FinaleTeam;
    nummer3: FinaleTeam;
}

export class FinaleTeam
{
    teamId: number; 
    punten: number;
}

export class FinaleWedstrijd
{
    wedstrijdNummer: number;
    thuisTeam: FinaleTeam;
    uitTeam: FinaleTeam;
}

export class FinaleRonde
{
    competitie: Competition;
    finales: FinaleWedstrijd[];
}
