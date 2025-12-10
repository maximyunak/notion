export interface FlatTreeNode {
    id: string;
    label: string;
    parentId?: string;
    order: number
}

export interface TreeNode extends FlatTreeNode {
    open: boolean;
    children: TreeNode[];
}