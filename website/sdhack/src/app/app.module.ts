import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './header/header.component';
import { PhotoBoxComponent } from './photo-box/photo-box.component';
import { UsersComponent } from './users/users.component';
import { UserBoxComponent } from './user-box/user-box.component';

const appRoutes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'users', component: UsersComponent },
  { path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  { path: '**',
    redirectTo: 'landing',
    pathMatch: 'full'
  }

];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    PhotoBoxComponent,
    UsersComponent,
    UserBoxComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    HttpModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
