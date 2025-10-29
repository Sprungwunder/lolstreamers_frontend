import {Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnDestroy} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";
import {ChampionService} from "../champion-service/champion-service.service";

@Component({
    selector: 'app-champion-name-input',
    imports: [ReactiveFormsModule],
    templateUrl: './champion-name-input.component.html',
    styleUrls: ['./champion-name-input.component.css']
})
export class ChampionNameInputComponent extends TypeAheadInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Type to filter champion names...';  // Placeholder for input
  @Input() championsList: string[] = [];
  @Input() isAdmin: boolean = false;

  @Output() championsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  private championSubscription: Subscription = new Subscription();

  constructor(private sharedChampionService: ChampionService) {
    super();
    // Filter champions as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  ngOnInit(): void {
    this.championSubscription = this.sharedChampionService.championSelections$.subscribe(() => {
      if (this.itemsListManager) {
        this.reinitializeWithExclusions();
      }
    });
  }

  ngOnDestroy(): void {
    this.championSubscription.unsubscribe();
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['championsList'] && changes['championsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    const excludedChampions = this.sharedChampionService.getExcludedChampions('champion');
    return this.championsList.filter(champion => !excludedChampions.includes(champion));
  }

  emitEvent() {
    this.sharedChampionService.updateSelections('champion', this.selectedItems);
    this.championsChange.emit(this.selectedItems);
  }
}
