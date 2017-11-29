import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable } from "rxjs/Observable";

import { ItemService } from "../item.service";

@Component({
  templateUrl: "./deactivate.component.html",
})
export class DeactivateComponent implements OnInit {

  private item: Observable<{Name, Version, Id}>;
  private lastItem: {Id, Version};
  constructor(private http: HttpClient, private router: Router,
              private route: ActivatedRoute, private itemService: ItemService) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.item = this.itemService.getItem(id);
    this.item.subscribe(i => {
      this.lastItem = i;
    });
  }

  public deactivateItem() {
    this.itemService
        .deactivateItem(this.lastItem.Id, this.lastItem.Version)
        .subscribe((status: number) => {
          if (status === 200) { this.router.navigateByUrl("/home"); }
        });
      }
}
