import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  public items: InventoryItemDto[];
  private http;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public ngOnInit(): void {
    this.http.get("http://localhost:3000/api/InventoryItem").subscribe(
      data => {  this.items = data; },
      err => { console.log("Something went wrong:",err); });
  }
}

class InventoryItemDto {
  public Name: string;
  public Id: string;
}
