import { Component, OnInit } from '@angular/core';
import { ReturnDataService } from '../return-data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  public result;

  constructor(private returnDataService: ReturnDataService, public alertController: AlertController) { }

  ngOnInit() {
    this.result = { ...this.returnDataService.getData() };

    // If we have no data to populate from the JSON, display an alert that tells the 
    // user to upload an image
    if (this.isEmpty(this.result)) {
      this.presentAlert('Please upload an image.');
    }
  }

  ngDoCheck() {
    // Use the lifecycle look to track any changes that have been made in the result object
      this.result = { ...this.returnDataService.getData() };
      console.log('doCheck()', this.result);
  }

  // Checking if the object doesn't have any keys/properties
  isEmpty(obj) {
    for (let key in obj) {
      // if the object has its own properties, then it means it's not empty
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'No image uploaded',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
