import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {HomeComponent} from "./home/home.component";
import {AddComponent} from "./add/add.component";

const routes: Routes = [
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "add", component: AddComponent},
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
