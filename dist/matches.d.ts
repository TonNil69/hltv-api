interface IEvent {
    name: string;
    logo: string;
}
interface ITeam {
    name: string;
    logo: string;
}
interface IMatch {
    id: number;
    time: string;
    event: IEvent;
    stars: number;
    maps: string;
    teams: ITeam[];
}
export declare function getMatches(): Promise<IMatch[]>;
export {};
