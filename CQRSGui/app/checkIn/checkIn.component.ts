import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

import { Component, OnInit } from "@angular/core";
import { ItemService } from "../item.service";

@Component({
  templateUrl: "./checkIn.component.html",
})
export class CheckInComponent implements OnInit {

  private version: number;
  private id: string;
  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.itemService.getItem(this.id).subscribe(
      data => {  this.version = data.version; });
  }

  public checkInItem(count) {
    this.itemService.checkIn(count, this.id, this.version)
        .subscribe(status => {
          if (status === 200) {
            this.router.navigateByUrl("/home");
        }});
  }
}
