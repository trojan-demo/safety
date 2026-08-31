import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConstructionService } from '../../services/construction.service';
import { Project } from '../../models/construction.model';


@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructionService = inject(ConstructionService);

  readonly selectedCategory = signal<string>('All');
  readonly activeModalProject = signal<Project | null>(null);

  filterProjects(category: string) {
    this.selectedCategory.set(category);
  }

  get filteredProjects(): Project[] {
    const all = this.constructionService.projects();
    const cat = this.selectedCategory();
    if (cat === 'All') return all;
    return all.filter((p) => p.category.toLowerCase().includes(cat.toLowerCase()));
  }

  openProjectModal(proj: Project) {
    this.activeModalProject.set(proj);
  }

  closeProjectModal() {
    this.activeModalProject.set(null);
  }
}
