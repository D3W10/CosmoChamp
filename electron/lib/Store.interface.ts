export interface IStore {
    lastRunVersion: string;
    settings: IStoreSettings;
}

export interface IStoreSettings {
    theme: number;
    playerName: string;
}