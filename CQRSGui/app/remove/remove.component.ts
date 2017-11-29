import {ActivatedRoute, Router} from "@angular/router";

import { Component, OnInit } from "@angular/core";
import { ItemService } from "../item.service";

@Component({
  templateUrl: "./remove.component.html",
})
export class RemoveComponent implements OnInit {

  private Version: number;
  private id: string;
  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.itemService.getItem(this.id).subscribe(data => { this.Version = data.Version; });
  }

  public removeItem(count) {
    this.itemService.remove(count, this.id, this.Version)
        .subscribe(status => {
          if (status === 200) {
            this.router.navigateByUrl("/home");
        }});
  }
}
