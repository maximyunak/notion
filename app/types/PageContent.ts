export interface PageContent {
    id: string;
    title: string;
    content: string;
    blocks: ContentBlock[]
}

export type ContentBlock = TextType | TableType;

export interface TextType {
    id: string;
    type: BlockType
    value: string
}

export interface TableType {
    id: string,
    type: 'table',
    value: string[][]
}

export type BlockType =
    'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'text'
    | 'image'
    | 'table'
    | 'link'
    | 'youtube'
    | 'page';
