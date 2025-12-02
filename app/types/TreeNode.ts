export interface TreeNode {
    id: string;
    label: string;
    type: 'folder' | 'file',
    open?: boolean;
    children?: TreeNode[];
}