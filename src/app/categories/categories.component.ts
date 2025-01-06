import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service'; // Ensure the path is correct
import { Category } from '../interface/category'; // Ensure Category interface exists
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  totalCategories: number = 0;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  selectedCategory: Category | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    // Initialize the add category form
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    // Initialize the edit category form
    this.editCategoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.getTotalCategories();
  }

  // Fetch all categories
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorMessage = 'Failed to load categories.';
      },
    });
  }

  // Fetch total number of categories
  getTotalCategories(): void {
    this.categoryService.getTotalCategories().subscribe({
      next: (data: number) => {
        this.totalCategories = data;
      },
      error: (err) => {
        console.error('Error fetching total categories:', err);
        this.errorMessage = 'Failed to fetch total categories.';
      },
    });
  }

  // Create a new category
  createCategory(): void {
    if (this.addCategoryForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const newCategory: Category = {
      name: this.addCategoryForm.value.name,
      description: this.addCategoryForm.value.description,
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (createdCategory: Category) => {
        this.categories.push(createdCategory);
        this.getTotalCategories();
        this.addCategoryForm.reset();
        this.successMessage = 'Category created successfully!';
      },
      error: (err) => {
        console.error('Error creating category:', err);
        this.errorMessage = 'Failed to create category.';
      },
    });
  }

  // Select a category for editing
  selectCategoryForEdit(category: Category): void {
    this.selectedCategory = category;
    this.editCategoryForm.setValue({
      id: category.id,
      name: category.name,
      description: category.description,
    });
  }

  // Update an existing category
  updateCategory(): void {
    if (this.editCategoryForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const updatedCategory: Category = {
      id: this.editCategoryForm.value.id,
      name: this.editCategoryForm.value.name,
      description: this.editCategoryForm.value.description,
    };

    if (!updatedCategory.id) {
      this.errorMessage = 'Invalid category ID.';
      return;
    }

    this.categoryService
      .updateCategory(updatedCategory.id, updatedCategory)
      .subscribe({
        next: (category: Category) => {
          const index = this.categories.findIndex(
            (cat) => cat.id === category.id
          );
          if (index !== -1) {
            this.categories[index] = category;
            this.successMessage = 'Category updated successfully!';
          }
          this.selectedCategory = null;
        },
        error: (err) => {
          console.error('Error updating category:', err);
          this.errorMessage = 'Failed to update category.';
        },
      });
  }

  // Delete a category
  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(
            (category) => category.id !== id
          );
          this.getTotalCategories();
          this.successMessage = 'Category deleted successfully!';
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.errorMessage = 'Failed to delete category.';
        },
      });
    }
  }

  // Clear messages
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
