export interface ColumnType {
    id?: string;
    title?: string;
};

export interface LabelsType{
    id?:number;
    name?:string;
    userId?:number;
}

export interface TasksType {
    id?: number;
    title?: string;
    description?: string;
    status?: string;
    creationDateTime?: string;
    updationDateTime?: string;
    priority?: number;
    userId?: number;
    labels?: LabelsType[] | undefined
};


export interface queryType{
    qParam:string;
    priority:number;
    cat:number;
}