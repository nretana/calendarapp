
export type PatchOperation = 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';

export interface ApiRequest<T> {
    data: T
}

export interface ApiResponse<T> {
    data: T
}

export interface PatchDocument {
    op: PatchOperation,
    path: string,
    value: string
}
