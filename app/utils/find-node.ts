import type {TreeNode} from "~/types/TreeNode";

export const findNode = (nodeId: string, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
        if (nodeId === node.id) {
            return node
        }
        if (node.children && node.children.length) {
            const child = findNode(nodeId, node.children)
            if (child) return child
        }
    }
    return null
}