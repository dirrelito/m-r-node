import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import { ItemService } from "../item.service";

@Component({
  templateUrl: "./rename.component.html",
})
export class RenameComponent {

  private expectedVersion: number;
  private id: string;
  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.itemService.getItem(this.id).subscribe(data => { this.expectedVersion = data.version; });
  }

  public renameItem(name) {
    this.itemService.renameItem(name, this.id, this.expectedVersion)
        .subscribe(status => {
          if (status === 200) {
            this.router.navigateByUrl("/home");
        }});
  }
}
