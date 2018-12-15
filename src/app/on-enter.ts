// creating an interface for ionViewWillEnter since the event does 
// not exist in Ionic 4
export interface OnEnter {
    onEnter(): Promise<void>;
}