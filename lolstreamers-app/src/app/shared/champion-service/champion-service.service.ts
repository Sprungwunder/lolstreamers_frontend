
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChampionSelections {
  champion: string[];
  enemyChampion: string[];
  teamChampions: string[];
  enemyTeamChampions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChampionService {
  private championSelections: ChampionSelections = {
    champion: [],
    enemyChampion: [],
    teamChampions: [],
    enemyTeamChampions: []
  };

  private championSelectionsSubject = new BehaviorSubject<ChampionSelections>(this.championSelections);
  public championSelections$ = this.championSelectionsSubject.asObservable();

  constructor() {}

  updateSelections(component: keyof ChampionSelections, selections: string[]): void {
    this.championSelections = {
      ...this.championSelections,
      [component]: selections
    };
    this.championSelectionsSubject.next(this.championSelections);
  }

  getExcludedChampions(excludeComponent: keyof ChampionSelections): string[] {
    const allSelections: string[] = [];

    Object.keys(this.championSelections).forEach(key => {
      if (key !== excludeComponent) {
        allSelections.push(...this.championSelections[key as keyof ChampionSelections]);
      }
    });

    return allSelections;
  }

  resetSelections(): void {
    this.championSelections = {
      champion: [],
      enemyChampion: [],
      teamChampions: [],
      enemyTeamChampions: []
    };
    this.championSelectionsSubject.next(this.championSelections);
  }
}
