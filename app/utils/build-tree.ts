import type {TreeNode, FlatTreeNode} from "~/types/TreeNode";

export const buildTree = (pages: FlatTreeNode[]) => {
    const treeNodes: TreeNode[] = []
    const map = new Map()

    for (const page of pages) {
        map.set(page.id, {...page, children: [], open: true})
    }

    for (let page of pages) {
        if (page.parentId) {
            const parent = map.get(page.parentId);
            const child = map.get(page.id);
            if (parent) {
                parent.children.push(child);
                parent.children.sort((a: TreeNode, b: TreeNode) => a.order - b.order);
            } else {
                treeNodes.push(child);
            }
        } else {
            treeNodes.push(map.get(page.id));
            treeNodes.sort((a, b) => a.order - b.order);
        }
    }

    return treeNodes;
}