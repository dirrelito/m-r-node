import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "./rename.component.html",
})
export class RenameComponent {

  private expectedVersion: string;
  private id: string;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.http.get<any>("http://localhost:3000/api/InventoryItem/" + this.id).subscribe(
      data => {  this.expectedVersion = data.Version; });
  }

  public renameItem(name) {
    this.http
        .patch("http://localhost:3000/api/InventoryItem/" + this.id,
              {name, expectedVersion: this.expectedVersion },
              {observe: "response", responseType: "text" })
        .subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.router.navigateByUrl("/home");
        }}, err => console.log("err", err));
      }



}
