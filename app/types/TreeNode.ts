export interface TreeNode {
    id: string;
    label: string;
    open: boolean;
    children: TreeNode[];
    parentId?: string;
}

export interface FlatTreeNode {
    id: string;
    label: string;
    parentId?: string;
}