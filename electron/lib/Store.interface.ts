export interface IStore {
    changelog: string | null;
    settings: IStoreSettings;
}

export interface IStoreSettings {
    theme: number;
    reduceMotion: boolean;
    playerName: string;
    volume: number;
}