import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ItemService } from "../item.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
})
export class DetailsComponent implements OnInit {
  public id;
  public item: Observable<{Id, Name, CurrentCount, Version}>;

  constructor(private itemService: ItemService, private route: ActivatedRoute) { }

  public ngOnInit() {
    this.item = this.itemService.getItem(this.route.snapshot.params.id);
  }
}
