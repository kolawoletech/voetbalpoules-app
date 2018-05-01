export class UserPoulesModel {
    poules: PouleModel[];
}
export class PouleModel {
    id: number;
    naam: string;
    competities: PouleUserCompetitie[]; 
}

export class PouleUserCompetitie {
    id: number;
    naam: string;
    positie: number;
    poulePositie: number;
}