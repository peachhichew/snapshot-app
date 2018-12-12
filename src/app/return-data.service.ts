import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReturnDataService {
  // variable to keep track of the data we get back from our POST request
  public dataReturned: object;

  constructor() { }

  setData(data) {
    this.dataReturned = data;
    console.log('setData()', this.dataReturned);
    return this.dataReturned;
  }

  getData() {
    console.log("getData()", this.dataReturned);
    return this.dataReturned;
  }
}
