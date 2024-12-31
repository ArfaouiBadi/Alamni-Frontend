import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-home-page2',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home-page2.component.html',
  styleUrl: './home-page2.component.css'
})
export class HomePage2Component implements OnInit {
  username: string | null = null;
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }
}
