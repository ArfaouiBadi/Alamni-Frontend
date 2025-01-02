// filepath: /d:/Projects/Alamni-Frontend/src/app/leaderboard/leaderboard.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../interface/user';
import { UserService } from '../service/user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [FormsModule, SidebarComponent, CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.filterUsers();
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortUsers();
  }

  sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      const comparison = a.points - b.points;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.paginateUsers();
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateUsers();
    }
  }
}
