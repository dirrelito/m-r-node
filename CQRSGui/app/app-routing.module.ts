import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AddComponent } from "./add/add.component";
import { CheckInComponent } from "./checkIn/checkIn.component";
import { DeactivateComponent } from "./deactivate/deactivate.component";
import { DetailsComponent } from "./details/details.component";
import { HomeComponent } from "./home/home.component";
import { RemoveComponent } from "./remove/remove.component";
import { RenameComponent } from "./rename/rename.component";

const routes: Routes = [
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "add", component: AddComponent},
  {path: "details/:id", component: DetailsComponent},
  {path: "rename/:id", component: RenameComponent},
  {path: "deactivate/:id", component: DeactivateComponent},
  {path: "checkIn/:id", component: CheckInComponent},
  {path: "remove/:id", component: RemoveComponent},
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {}
