export interface IPhnxGrid {
    id: string;
    data: Object[];
    pageSize: number;
    sortBy: string;
    direction: number;
    currentPage: number;
    totalRows: number;
}