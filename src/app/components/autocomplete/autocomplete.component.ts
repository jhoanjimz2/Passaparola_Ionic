import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {
  @Input() maxTags:       number   = 0;
  @Input() placeholder:   string   = '';
  @Input() label:         string   = '';
  @Input() suggestedList: string[] = [];
  @Input() buttonCrea:    boolean  = false;
  @Output() selectedItem = new EventEmitter<string[]>();

  searchText: string = '';
  filteredList: string[] = [];
  showDropdown: boolean = false;
  selectedList: string[] = [];

  constructor() {}

  filtrarResultados(event: any) {
    const inputValue = event.target?.value?.toLowerCase().trim() || '';

    if (!inputValue) {
      this.filteredList = [];
      this.showDropdown = false;
      return;
    }

    this.filteredList = this.suggestedList.filter(tag =>
      tag.toLowerCase().includes(inputValue)
    );

    this.showDropdown = this.filteredList.length > 0;
  }

  seleccionar(item: string) {
    if (!this.selectedList.includes(item) && this.selectedList.length < 10) {
      this.selectedList.push(item);
      this.selectedItem.emit(this.selectedList);
    }
    this.searchText = '';
    this.showDropdown = false;
  }

  eliminar(item: string) {
    this.selectedList = this.selectedList.filter(t => t !== item);
    this.selectedItem.emit(this.selectedList);
  }

  crea() {
    const searchString = this.searchText;
    if (!this.suggestedList.length || !this.suggestedList.includes(searchString.toLowerCase())) {
      this.addItem(searchString);
    } else {
      this.filterSuggestedItem(searchString);
    }
    this.searchText = '';
    this.showDropdown = false;
  }
  addItem(item: string) {
    this.suggestedList.push(item);
    this.selectedList.push(item);
    this.selectedList.sort();
    this.selectedItem.emit(this.selectedList);
  }
  filterSuggestedItem(item: string) {
    const filteredData = this.suggestedList.filter((_item: any) =>
      _item.toLowerCase().includes(item.toLowerCase())
    );

    this.selectedList = filteredData;
    this.selectedItem.emit(this.selectedList);
  }

}
