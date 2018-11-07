import { VoorspellingEindstand, TopscorerDto } from '../toernooiverloop/toernooivoorspellingen.model';
import { Competition } from '../predictions/predictions.model';

export class TeamRanglijst {
    id: number;
    competitieId: number;
    naam: string;
    logoId: number;
    positie: number;          
}

export class ExtraVoorspellingen
{
    teams: TeamRanglijst[];
    voorspellingenEindstand: VoorspellingEindstand[];
    topscorer: TopscorerDto;
    competities: Competition[]
}
