import type {FlatTreeNode, TreeNode} from '~/types/TreeNode'
import {findNode} from "~/utils/find-node";

export const useFileStore = defineStore('fileStore', () => {
    const fileTree = ref<TreeNode[]>([]);

    const fetchPages = async () => {
        const res = await $api<FlatTreeNode[]>('/pages')

        fileTree.value = buildTree(res)
    }


    const createPage = async (pageData?: Partial<FlatTreeNode>, parentId?: null | string) => {
        const body = {
            ...pageData,
            parentId,
            label: "Untitled"
        }

        const res = await $api<FlatTreeNode>('/pages', {
            method: 'post',
            body: body,
        })

        const content = await $api('content', {
            method: 'post',
            body: {
                id: res.id,
                content: ''
            }
        })

        if (parentId) {
            const parent = findNode(parentId, fileTree.value);

            parent?.children.push({...res, open: true, children: []})
        } else {
            fileTree.value.push({...res, open: true, children: []})
        }

        return res.id
    };

    const deletePage = async (id: string) => {

        const node = findNode(id, fileTree.value);

        if (!node) return

        if (node?.children.length > 0) {
            for (const child of node?.children) {
                await deletePage(child.id);
            }
        }

        const res = Promise.all([
            $api(`/pages/${id}`, {
                method: 'delete'
            }),
            $api(`/content/${id}`, {
                method: 'delete'
            }),
        ])

        removeNode(id, fileTree.value)

        console.log(res)
    }

    const removeNode = (nodeId: string, nodes: TreeNode[]): boolean => {
        const index = nodes.findIndex(n => n.id === nodeId)


        if (index !== -1) {
            nodes.splice(index, 1)
            return true
        }

        for (const node of nodes) {
            if (node.children?.length) {
                const removed = removeNode(nodeId, node.children)
                if (removed) return true
            }
        }

        return false
    }


    return {fileTree, createPage, fetchPages, deletePage}
})