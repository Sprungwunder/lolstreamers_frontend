import {Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnDestroy} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";
import {ChampionService} from "../champion-service/champion-service.service";

@Component({
    selector: 'app-team-champions-input',
    imports: [ReactiveFormsModule],
    templateUrl: './team-champions-input.component.html',
    styleUrls: ['./team-champions-input.component.css']
})
export class TeamChampionsInputComponent extends TypeAheadInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Type to filter for team-champions...';  // Placeholder for input
  @Input() teamChampionsList: string[] = [];                         // List of all team-champions

  @Output() teamChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 4

  private championSubscription: Subscription = new Subscription();

  constructor(private sharedChampionService: ChampionService) {
    super();
    // Filter team-champions as user types
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
    if (changes['teamChampionsList'] && changes['teamChampionsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    const excludedChampions = this.sharedChampionService.getExcludedChampions('teamChampions');
    return this.teamChampionsList.filter(champion => !excludedChampions.includes(champion));
  }

  emitEvent() {
    this.sharedChampionService.updateSelections('teamChampions', this.selectedItems);
    this.teamChampionsChange.emit(this.selectedItems);
  }
}
