import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReturnDataService {
  // Variable to keep track of the data we get back from our POST request
  public dataReturned: any;

  constructor() { }

  // Set property for our data
  // Parse the data we got back from the server
  setData(data) {
    this.dataReturned = JSON.parse(data);
    return this.dataReturned;
  }

  // Get property for data in order for it to be accessed elsewhere
  getData() {
    return this.dataReturned;
  }
}
