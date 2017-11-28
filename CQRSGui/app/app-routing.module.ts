import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {AddComponent} from "./add/add.component";
import { DetailsComponent } from "./details/details.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "addItem", component: AddComponent},
  {path: "details/:id", component: DetailsComponent},
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
