import { Competition, Team } from '../predictions/predictions.model';

export class Toernooiverloop {
    competitieRondes: Competition[];
    teams: Team[];
    schema: Finale[];
}

export class Finale {
    wedstrijdNummer: number;
    thuisTeam: string;
    uitTeam: string;
    thuisTeamVerliezer: string;
    uitTeamVerliezer: string;
    thuisTeamDefault: string;
    uitTeamDefault: string;
    voorspelType: number;
    competitieRondeId: number;
}

export enum VoorspelType
{
    eindstand = 65,
    volgendeRonde8 = 66,
    volgendeRonde4 = 78,
    volgendeRonde2 = 79,
    winnaar = 88,
    volgendeRonde16 = 168,
    volgendeRonde2Verliezers = 169,
    nummer3 = 170,
    topscorer = 239,
    /// <summary>
    /// gebruikt om volgende ronde te bepalen
    /// </summary>
    Leeg = 0
}
