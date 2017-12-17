export class LocalStorageService {
    public getStorageVariable(name) {
        return JSON.parse(window.localStorage.getItem(name));
    }
    
    public setStorageVariable(name, data) {
        window.localStorage.setItem(name, JSON.stringify(data));
    }    
}
