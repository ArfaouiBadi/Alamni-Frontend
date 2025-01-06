import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service'; // Make sure the path is correct
import { Category } from '../interface/category';    // Ensure Category interface exists

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  totalCategories: number = 0;
  
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.getTotalCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  getTotalCategories(): void {
    this.categoryService.getTotalCategories().subscribe((data) => {
      this.totalCategories = data;
    });
  }

  createCategory(category: Category): void {
    this.categoryService.createCategory(category).subscribe((newCategory) => {
      this.categories.push(newCategory);
      this.getTotalCategories();  // Refresh total count
    });
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter((category) => category.id !== id);
      this.getTotalCategories();  // Refresh total count
    });
  }
}
