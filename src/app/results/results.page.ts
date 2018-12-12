import { Component, OnInit } from '@angular/core';
import { ReturnDataService } from '../return-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  constructor(private returnDataService: ReturnDataService) { }

  ngOnInit() {
    this.returnDataService.getData();
  }

}
