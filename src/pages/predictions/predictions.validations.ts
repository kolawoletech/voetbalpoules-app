import { FormGroup, ValidationErrors } from '@angular/forms';

export class PredictionValidations {
    static wedstrijdVanDeWeek(form: FormGroup): ValidationErrors {
        if(!form.dirty)
            return null;

        let errors = new Array();   
        let error = PredictionValidations.validateDoelpuntenmaker(form, 'thuis');
        if(error != null)
            errors.push(error);
        
        error = PredictionValidations.validateDoelpuntenmaker(form, 'uit');
        if(error != null)
            errors.push(error);

        return errors.length > 0 ? errors : null;    
    }

    private static validateDoelpuntenmaker(form: FormGroup, team: string) : any {
        const fieldName = team + 'spelerId';
        const doelpunt = form.get(team + 'doelpunten');
        const spelerId = form.get(fieldName);

        console.log("validate wedstrijd van de week " + team + "doelpunten: " + doelpunt.value + " " + spelerId.value);

        if (doelpunt.value == 0 && spelerId.value != -1) {
            spelerId.setErrors({'error': 'VOORSPELLING_KIES_GEEN_SCORE'});
            const message = {
                fieldName: {
                    'error': "VOORSPELLING_KIES_GEEN_SCORE"
                }
            };    
            return message;
        }
        if (doelpunt.value > 0 && spelerId.value == -1) {
            spelerId.setErrors({'error': 'VOORSPELLING_KIES_EEN_SPELER'});
            const message = {
                fieldName: {
                'error': "VOORSPELLING_KIES_EEN_SPELER"
                }
            };    
            return message;
        }
        if (doelpunt.value != null && spelerId.value == null) {
            spelerId.setErrors({'error': 'VOORSPELLING_KIES_DOELPUNTENMAKER'});
            const message = {
                fieldName: {
                'error': "VOORSPELLING_KIES_DOELPUNTENMAKER"
                }
            };    
            return message;
        }        
        spelerId.setErrors(null);
        return null;        
    }
}
