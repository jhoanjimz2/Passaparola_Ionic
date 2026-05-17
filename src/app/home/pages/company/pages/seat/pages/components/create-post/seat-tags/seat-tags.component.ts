import { CommonModule }                from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormsModule }                 from '@angular/forms';
import { ModalController }             from '@ionic/angular';

@Component({
  selector: 'app-seat-tags',
  templateUrl: './seat-tags.component.html',
  styleUrls: ['./seat-tags.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class SeatTagsComponent implements OnDestroy{
  @Input() initialTags: string[] = [];   // lo que viene del padre
  maxTags = 5;

  allTags: string[] = [];
  selectedTags: string[] = [];
  search: string = '';

  constructor(private modalController: ModalController) {}
  ngOnDestroy(): void {
  }

  ngOnInit() {
    // Inicializar con lo que viene del padre
    this.selectedTags = [...this.initialTags];
  }

  get filteredTags() {
    if (!this.search) return this.allTags;
    return this.allTags.filter(tag =>
      tag.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  addTag(tag: string) {
    if (!tag || !tag.trim()) return;
    if (this.selectedTags.length >= this.maxTags) return;

    tag = tag.trim();

    if (!this.allTags.includes(tag)) {
      this.allTags.push(tag);
    }

    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }

    this.search = '';
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag(this.search);
    }
  }

  dismiss() {
    this.modalController.dismiss(this.selectedTags);
  }

  cancel() {
    this.modalController.dismiss(null);
  }
}
