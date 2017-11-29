import { Component, OnInit } from "@angular/core";
import { ItemService } from "../item.service";

@Component({
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  public items: Array<{Id, Name}>;

  constructor(private itemService: ItemService) {}

  public ngOnInit(): void {
    this.itemService.getAllItems().subscribe(data => { this.items = data; });
  }
}
