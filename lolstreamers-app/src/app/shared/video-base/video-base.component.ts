import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Video} from "../../video";
import {VideoService} from "../../video.service";


export abstract class VideoBaseComponent {
  isAdmin = false;
  duplicateVideos: Video[] = [];
  showDuplicateWarning = false;
  addAnotherVideo = false;

  videoList: Video[] = [];
  filteredVideoList: Video[] = [];

  streamerList: string[] = [];
  selectedStreamer: string[] = [];

  // champions
  championsList: string[] = [
    'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar', 'Ambessa', 'Amumu', 'Anivia', 'Annie', 'Aphelios',
    'Ashe', 'Aurelion Sol', 'Aurora', 'Azir', 'Bard', 'Bel\'Veth', 'Blitzcrank', 'Brand', 'Braum',
    'Briar', 'Caitlyn', 'Camille', 'Cassiopeia', 'Cho\'Gath', 'Corki', 'Darius', 'Diana',
    'Dr. Mundo', 'Draven', 'Ekko', 'Elise', 'Evelynn', 'Ezreal', 'Fiddlesticks', 'Fiora',
    'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen', 'Hecarim',
    'Heimerdinger', 'Hwei', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV', 'Jax', 'Jayce',
    'Jhin', 'Jinx', 'K\'Sante', 'Kai\'Sa', 'Kalista', 'Karma', 'Karthus', 'Kassadin',
    'Katarina', 'Kayle', 'Kayn', 'Kennen', 'Kha\'Zix', 'Kindred', 'Kled', 'Kog\'Maw',
    'LeBlanc', 'Lee Sin', 'Leona', 'Lillia', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite',
    'Malzahar', 'Maokai', 'Master Yi', 'Mel', 'Milio', 'Miss Fortune', 'Mordekaiser', 'Morgana', 'Naafiri',
    'Nami', 'Nasus', 'Nautilus', 'Neeko', 'Nidalee', 'Nilah', 'Nocturne', 'Nunu Willump',
    'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke', 'Qiyana', 'Quinn', 'Rakan',
    'Rammus', 'Rek\'Sai', 'Rell', 'Renata Glasc', 'Renekton', 'Rengar', 'Riven', 'Rumble',
    'Ryze', 'Samira', 'Sejuani', 'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen', 'Shyvana',
    'Singed', 'Sion', 'Sivir', 'Skarner', 'Smolder', 'Sona', 'Soraka', 'Swain', 'Sylas', 'Syndra',
    'Tahm Kench', 'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle',
    'Tryndamere', 'Twisted Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar',
    'Vel\'Koz', 'Vex', 'Vi', 'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong',
    'Xayah', 'Xerath', 'Xin Zhao', 'Yasuo', 'Yone', 'Yorick', 'Yunara', 'Yuumi', 'Zaahen', 'Zac', 'Zed',
    'Zeri', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'
  ];

  selectedChampion: string[] = []; // Holds the selected champion

  // enemy champions
  enemyChampionsList: string[] = this.championsList;
  selectedEnemyChampion: string[] = [];

  lanesList: string[] = ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Any'];
  selectedLane: string[] = [];


  // Runes Management
  runesList: string[] = [
    // Precision
    'Press the Attack', 'Lethal Tempo', 'Fleet Footwork', 'Conqueror',
    'Absorb Life', 'Triumph', 'Presence of Mind',
    'Legend: Alacrity', 'Legend: Haste', 'Legend: Bloodline',
    'Coup de Grace', 'Cut Down', 'Last Stand',

    // Domination
    'Electrocute', 'Dark Harvest', 'Hail of Blades',
    'Cheap Shot', 'Taste of Blood', 'Sudden Impact',
    'Sixth Sense', 'Grisly Mementos', 'Deep Ward',
    'Treasure Hunter', 'Relentless Hunter', 'Ultimate Hunter',

    // Sorcery
    'Summon Aery', 'Arcane Comet', 'Phase Rush',
    'Axiom Arcanist', 'Manaflow Band', 'Nimbus Cloak',
    'Transcendence', 'Celerity', 'Absolute Focus',
    'Scorch', 'Waterwalking', 'Gathering Storm',

    // Resolve
    'Grasp of the Undying', 'Aftershock', 'Guardian',
    'Demolish', 'Font of Life', 'Shield Bash',
    'Conditioning', 'Second Wind', 'Bone Plating',
    'Overgrowth', 'Revitalize', 'Unflinching',

    // Inspiration
    'Glacial Augment', 'Unsealed Spellbook', 'First Strike',
    'Hextech Flashtraption', 'Magical Footwear', 'Cash Back',
    'Triple Tonic', 'Time Warp Tonic', 'Biscuit Delivery',
    'Cosmic Insight', 'Approach Velocity', 'Jack of All Trades'
  ]
  ;
  selectedRunes: string[] = [];

  // Items
  itemsList: string[] = [
    // legendary items
    "Abyssal Mask", "Archangel's Staff", "Ardent Censer", "Axiom Arc", "Banshee's Veil",
    "Black Cleaver", "Blackfire Torch", "Blade of the Ruined King", "Bloodletter's Curse",
    "Bloodsong", "Bloodthirster", "Bounty of Worlds", "Celestial Opposition",
    "Chempunk Chainsword", "Cosmic Drive", "Cryptbloom", "Dawncore", "Dead Man's Plate",
    "Death's Dance", "Dream Maker", "Echoes of Helia", "Eclipse", "Edge of Night",
    "Essence Reaver", "Experimental Hexplate", "Fimbulwinter", "Force of Nature",
    "Frozen Heart", "Guardian Angel", "Guinsoo's Rageblade", "Heartsteel",
    "Hextech Rocketbelt", "Hollow Radiance", "Horizon Focus", "Hubris", "Hullbreaker",
    "Iceborn Gauntlet", "Immortal Shieldbow", "Imperial Mandate", "Infinity Edge",
    "Jak'Sho, The Protean", "Kaenic Rookern", "Knight's Vow", "Kraken Slayer",
    "Liandry's Torment", "Lich Bane", "Locket of the Iron Solari", "Lord Dominik's Regards",
    "Luden's Companion", "Malignance", "Manamune", "Maw of Malmortius", "Mejai's Soulstealer",
    "Mercurial Scimitar", "Mikael's Blessing", "Moonstone Renewer", "Morellonomicon",
    "Mortal Reminder", "Muramana", "Nashor's Tooth", "Navori Flickerblade", "Opportunity",
    "Overlord's Bloodmail", "Phantom Dancer", "Profane Hydra", "Rabadon's Deathcap",
    "Randuin's Omen", "Rapid Firecannon", "Ravenous Hydra", "Redemption",
    "Riftmaker", "Rod of Ages", "Runaan's Hurricane",
    "Rylai's Crystal Scepter", "Serylda's Grudge", "Serpent's Fang", "Seraph's Embrace",
    "Shadowflame", "Sheen", "Shurelya's Battlesong", "Solstice Sleigh",
    "Spear of Shojin", "Spirit Visage", "Staff of Flowing Water", "Statikk Shiv", "Sterak's Gage",
    "Stormsurge", "Stridebreaker", "Sundered Sky", "Sunfire Aegis", "Terminus",
    "The Collector", "Thornmail", "Titanic Hydra", "Trailblazer", "Trinity Force",
    "Umbral Glaive", "Unending Despair", "Vigilant Wardstone", "Void Staff", "Voltaic Cyclosword",
    "Warmog's Armor", "Winter's Approach", "Wit's End", "Youmuu's Ghostblade", "Yun Tal Wildarrows",
    "Zaz'Zak's Realmspike", "Zeke's Convergence", "Zhonya's Hourglass",

    // boots
    "Armored Advance", "Berserker's Greaves", "Boots", "Boots of Swiftness",
    "Chainlaced Crushers", "Crimson Lucidity", "Forever Forward", "Gunmetal Greaves",
    "Ionian Boots of Lucidity", "Mercury's Treads", "Plated Steelcaps", "Sorcerer's Shoes",
    "Spellslinger's Shoes", "Swiftmarch", "Symbiotic Soles", "Synchronized Souls",

  ];

  selectedItems: string[] = [];

  // team champions
  teamChampionsList: string[] = this.championsList;
  selectedTeamChampions: string[] = [];

  // enemy team champions
  enemyTeamChampionsList: string[] = this.championsList;
  selectedEnemyTeamChampions: string[] = [];

  // Search form controls
  inputForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    enemyChampionName: new FormControl(''),
    runes: new FormControl(''),
    championItems: new FormControl(''),
    teamChampions: new FormControl(''),
    enemyTeamChampions: new FormControl(''),
    youtubeUrl: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  });

  constructor(protected videoService: VideoService) {
  }

  // Handle Champion changes from the reusable component
  handleChampionChange(selectedChampions: string[]): void {
    this.selectedChampion = selectedChampions;
  }

  handleEnemyChampionChange(selectedChampions: string[]): void {
    this.selectedEnemyChampion = selectedChampions;
  }

  handleLanesChange(selectedLane: string[]): void {
    this.selectedLane = selectedLane;
  }

  handleRunesChange(selectedRunes: string[]): void {
    this.selectedRunes = selectedRunes;
  }

  handleItemsChange(selectedItems: string[]): void {
    this.selectedItems = selectedItems;
  }

  handleTeamChampionsChange(selectedTeamChampions: string[]): void {
    this.selectedTeamChampions = selectedTeamChampions;
  }

  handleEnemyTeamChampionsChange(selectedTeamChampions: string[]): void {
    this.selectedEnemyTeamChampions = selectedTeamChampions;
  }

  handleStreamerChange(selectedStreamers: string[]): void {
    this.selectedStreamer = selectedStreamers
  }

  abstract handleSubmit(): void; // To be implemented by child classes

  onVideoDeleted(_videoId: string): void {};

  onVideoActivated(_videoId: string): void {};

  onYoutubeUrlChange(event: any) {}
}


// YouTube URL validator function
export function youtubeUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    // Extract video ID from different YouTube URL formats
    let videoId: string | null = null;

    // Handle youtube.com/watch?v= format
    const fullUrlRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11}).*$/;
    const fullMatch = control.value.match(fullUrlRegex);

    // Handle youtu.be/ format
    const shortUrlRegex = /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(\?.*)?$/;
    const shortMatch = control.value.match(shortUrlRegex);

    if (fullMatch && fullMatch[3]) {
      videoId = fullMatch[3];
    } else if (shortMatch && shortMatch[3]) {
      videoId = shortMatch[3];
    }

    // If no valid video ID was extracted, the URL is invalid
    if (!videoId) {
      return {invalidYoutubeUrl: true};
    }

    // Validate the video ID is the correct length
    if (videoId.length !== 11) {
      return {invalidYoutubeId: true};
    }

    return null;
  };
}
