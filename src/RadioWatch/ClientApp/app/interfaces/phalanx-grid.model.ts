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
    sort: string;
    by: number;
}
export interface IPhnxGridResponseState {
    total: number;
    data: any[];
}