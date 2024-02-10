
export type PatchOperation = 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';

export type ApiRequest<T> = {
    data: T
}

export type ApiResponse<T> = {
    data: T
}

export type PatchDocument = {
    op: PatchOperation,
    path: string,
    value: string
}
