import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ListManager} from "../../list-manager";

@Component({
  selector: 'app-champion-name-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './champion-name-input.component.html',
  styleUrls: ['./champion-name-input.component.css']
})
export class ChampionNameInput {
  @Input() placeholder: string = 'Type to search champions...';  // Placeholder for input
  @Input() championsList: string[] = [];                         // List of all champions

  @Output() championsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  championInput = new FormControl('');                           // FormControl for input field

  championsListManager!: ListManager;                            // ListManager instance
  championsSuggestionList: string[] = [];
  selectedChampions: string[] = [];                              // Selected champions list

  constructor() {
    // Filter champions as user types
    this.championInput.valueChanges.subscribe(value =>
      this.championsSuggestionList = this.championsListManager.updateList(value)
    );
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['championsList'] && changes['championsList'].currentValue?.length > 0) {
      this.initializeChampionsList();
    }
  }

  /**
   * Initialize or reinitialize the champions list manager.
   */
  private initializeChampionsList(): void {
    console.log('Initializing champions list manager...');
    console.log(this.championsList);
    this.championsListManager = new ListManager(this.championsList, 1);
    this.championsSuggestionList = [...this.championsList]; // Reset filtered list
  }


  // Add a champion to the selected list
  selectChampion(champion: string): void {
    this.championsSuggestionList = this.championsListManager.addItem(champion, this.championInput.value || '');
    this.selectedChampions = this.championsListManager.selectedItems;
    this.championsChange.emit(this.selectedChampions); // Notify parent
    this.championInput.reset();
  }

  // Remove a champion from the selected list
  removeChampion(champion: string): void {
    this.championsSuggestionList = this.championsListManager.removeItem(champion, undefined);
    this.selectedChampions = this.championsListManager.selectedItems;
    this.championsChange.emit(this.selectedChampions); // Notify parent
  }
}
