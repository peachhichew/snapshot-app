import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { ReturnDataService } from '../return-data.service';
import { SQLiteProvider } from '../../providers/SQLiteProvider';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  // we need a variable that will keep track of the current image and its data
  base64Image: any;

  constructor(private camera: Camera,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private http: HTTP,
    private returnDataService: ReturnDataService,
    public platform: Platform,
    // private sqlite: SQLite,
    private SQLProvider: SQLiteProvider) {
    platform.ready().then(() => {
      this.SQLProvider.createDatabase();
    });
  }

  // once the component is loaded, we want default.jpg to be the placeholder image
  ngOnInit() {
    this.base64Image = "../default.jpg";
  }

  // allows user to upload images using the photo library as the image source
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // when cordova has access to the picture, upload it
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  // allows user to upload an image from their camera 
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // upload image once cordova gets it
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    }, err => {
      this.presentAlert(err);
      console.log(err);
    });
  }

  // upload image to the server using a POST request
  uploadImage(imageData) {
    // update the placeholder image source to be the image we are trying to upload
    this.base64Image = 'data:image/png;base64,' + imageData;

    // display loading animation during upload
    this.presentLoading();

    // here are the parameters we will need for our POST request
    let formData = {
      'base64image': imageData,
      'submit': 'submit'
    };

    // send a POST request to upload the image onto the server
    this.http.post('https://everyonelikesagoodme.me/imagerecognition.php', formData, {})
      .then((data) => {
        // show confirmation message when successful
        this.presentToast("Image uploaded successfully");
        console.log(data.data);
        
        // if the image could not be classified or is considered "non-food", 
        // let the user know
        if (data.data === "The image was not classified as food by the IBM Image Recognition API.") {
          this.presentAlert(data.data);
        }
        // else we update the dataReturned object in our returnDataService and parse the data
        else {
          let parsedResponse = this.returnDataService.setData(data.data);

          // if the JSON contains any null values, print out alert to notify user
          if (parsedResponse.weight === "null" || parsedResponse.weight === null) {
            this.presentAlert(`Nutritional information for ${parsedResponse.name} could not be found on the Nutritionix API.`);
          } 
          
          // if there are no null values in the JSON, insert the food into the table
          else {
            this.SQLProvider.insertNewFood(parsedResponse.name, data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // shows toast messages
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss();

    toast.present();
  }

  // shows alerts
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  // displays loading animation
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Uploading',
      duration: 2000
    });
    return await loading.present();
  }
}