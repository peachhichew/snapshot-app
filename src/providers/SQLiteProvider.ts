import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';

@Injectable()
export class SQLiteProvider {

  // we need to declare a var that will point to the initialized db:
  public db: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    public toastController: ToastController) { }

  createDatabase() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      this.db.executeSql('CREATE TABLE IF NOT EXISTS `food` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `information` TEXT)')
        .then(() => console.log('Database running.'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  getRecentFood() {
    var numOfRows;
    let query = "select * from food order by id desc limit 5";
    let list = document.querySelector('#resultsList');
    list.innerHTML = "";
    this.db.executeSql(query, []).then((data) => {
      numOfRows = data.rows.length;
      for (let i=0; i<numOfRows; i++) {
        let foodName = data.rows.item(i).name;
        //console.log("Name of food: " + foodName);
        let healthInformation = JSON.parse(data.rows.item(i).information);
        //console.log("Health information: " + healthInformation);//data.rows.item(i).information);
      
        // let list = document.querySelector('#resultsList');
        // list.innerHTML = "";
        let elemName = document.createElement('h2');
        elemName.innerHTML = foodName;

        let elemInfo = document.createElement('p');

        elemInfo.innerHTML += "Weight: " + healthInformation.weight + "g<br>";
        elemInfo.innerHTML += "Calories: " + healthInformation.calories + "cal<br>";
        elemInfo.innerHTML += "Total Fat: " + healthInformation.totalFat + "g<br>";
        elemInfo.innerHTML += "Saturated Fat: " + healthInformation.saturatedFat + "g<br>";
        elemInfo.innerHTML += "Cholesterol: " + healthInformation.cholesterol + "mg<br>";
        elemInfo.innerHTML += "Sodium: " + healthInformation.sodium + "mg<br>";
        elemInfo.innerHTML += "Total Carbs: " + healthInformation.carbs + "g<br>";
        elemInfo.innerHTML += "Dietary Fiber: " + healthInformation.fiber + "g<br>";
        elemInfo.innerHTML += "Total Sugars: " + healthInformation.sugar + "g<br>";
        elemInfo.innerHTML += "Protein: " + healthInformation.protein + "g<br>";
        elemInfo.innerHTML += "Potassium: " + healthInformation.potassium + "mg<br>";

        list.appendChild(elemName);
        list.appendChild(elemInfo);
        //console.log(data.rows.item(i).name + " " + data.rows.item(i).information + "\r\n");
      }
    })
      .catch(e => {
        console.log(e);
      })
  }

  insertNewFood(name, information) {
      let query = "insert into food (name, information) values (?, ?)";
      this.db.executeSql(query, [name, information]).then((data) => {
        //console.log(name + " has been inserted into food table.");
      })
        .catch(e => {
          console.log(e);
        })
    }
  

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss();

    toast.present();
  }
}