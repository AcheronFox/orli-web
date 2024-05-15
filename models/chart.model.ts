export interface IBarChart {
    nationality: {
        nationalityId: number;
        natCount: number;
    }[],
    age: {
        age: number;
        count: number;
    }[]
}