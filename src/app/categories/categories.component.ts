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
import Swal from 'sweetalert2'; // Import SweetAlert2

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
        Swal.fire('Error', 'Failed to load categories.', 'error');
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
        Swal.fire('Error', 'Failed to fetch total categories.', 'error');
      },
    });
  }

  // Create a new category
  createCategory(): void {
    if (this.addCategoryForm.invalid) {
      Swal.fire('Error', 'Please fill out the form correctly.', 'error');
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
        Swal.fire('Success', 'Category created successfully!', 'success');
      },
      error: (err) => {
        console.error('Error creating category:', err);
        Swal.fire('Error', 'Failed to create category.', 'error');
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
      Swal.fire('Error', 'Please fill out the form correctly.', 'error');
      return;
    }

    const updatedCategory: Category = {
      id: this.editCategoryForm.value.id,
      name: this.editCategoryForm.value.name,
      description: this.editCategoryForm.value.description,
    };

    if (!updatedCategory.id) {
      Swal.fire('Error', 'Invalid category ID.', 'error');
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
            Swal.fire('Success', 'Category updated successfully!', 'success');
          }
          this.selectedCategory = null;
        },
        error: (err) => {
          console.error('Error updating category:', err);
          Swal.fire('Error', 'Failed to update category.', 'error');
        },
      });
  }

  // Delete a category
  deleteCategory(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.categories = this.categories.filter(
              (category) => category.id !== id
            );
            this.getTotalCategories();
            Swal.fire('Deleted!', 'Category deleted successfully.', 'success');
          },
          error: (err) => {
            console.error('Error deleting category:', err);
            Swal.fire('Error', 'Failed to delete category.', 'error');
          },
        });
      }
    });
  }
}
