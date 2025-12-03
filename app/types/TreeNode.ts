export interface FlatTreeNode {
    id: string;
    label: string;
    parentId?: string;
}

export interface TreeNode extends FlatTreeNode {
    open: boolean;
    children: TreeNode[];
}

export interface PageContent {
    id: string;
    content: string;
}
