export interface IPhnxGridState {
    id: string;
    data: Object[];
    pageSize: number;
    sortBy: string;
    direction: number;
    currentPage: number;
    totalRows: number;
}

export interface IPhnxGridRequestState {
    pageSize: number;
    page: number;
    sort: number;
    by: string;
}
export interface IPhnxGridResponseState {
    total: number;
    data: any[];
}