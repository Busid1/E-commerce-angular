import { Component } from '@angular/core';
import SearchComponent from "../search/search.component";
import SearchBarComponent from "../search/search-bar/search-bar.component";

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './hero.component.html',
})
export default class HeroComponent {

}
