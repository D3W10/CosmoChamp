export interface IStore {
    changelog: string | null;
    firstTimeSpecial: boolean;
    settings: IStoreSettings;
}

export interface IStoreSettings {
    theme: number;
    reduceMotion: boolean;
    playerName: string;
    volume: number;
    sfxVolume: number;
}