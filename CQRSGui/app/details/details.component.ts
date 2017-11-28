import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
})
export class DetailsComponent implements OnInit {
  public id;
  public item: Observable<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  public ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.item = this.http.get("http://localhost:3000/api/InventoryItem/" + this.id);
  }
}
