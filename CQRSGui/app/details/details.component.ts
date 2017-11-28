import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {
  public item;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  public ngOnInit() {
    this.route.params.subscribe((p: Params) => {
      const id = p.id;
      this.http.get("http://localhost:3000/api/InventoryItem/" + id).subscribe(
        data => {  this.item = data; },
        err => { console.log("Something went wrong:", err); });
    });
  }
}
