import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReturnDataService {
  // variable to keep track of the data we get back from our POST request
  public dataReturned: any; // dis used 2 b object, it shouldve been any

  constructor() { }

  // set property for our data
  // parse the data we got back from the server
  setData(data) {
    this.dataReturned = JSON.parse(data);
    return this.dataReturned;
  }

  // get property for data in order for it to be accessed elsewhere
  getData() {
    return this.dataReturned;
  }
}
