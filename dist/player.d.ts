interface IPlayer {
    id: number;
    team: {
        id: number;
        name: string;
    };
    image: string;
    nickname: string;
    name: string;
    age: number | null;
    rating: number;
    impact: number | null;
    dpr: number | null;
    apr: number | null;
    kast: number | null;
    kpr: number;
    headshots: number;
    mapsPlayed: number | null;
}
export declare function getPlayerById(id: number): Promise<IPlayer>;
export {};
