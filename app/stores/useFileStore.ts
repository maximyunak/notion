import type {FlatTreeNode, TreeNode} from '~/types/TreeNode'
import {findNode} from "~/utils/find-node";
import FileTree from "~/components/Sidebar/FileTree.vue";

export const useFileStore = defineStore('fileStore', () => {
    const fileTree = ref<TreeNode[]>([]);
    const flatTree = ref<FlatTreeNode[]>([]);

    const fetchPages = async () => {
        const res = await $api<FlatTreeNode[]>('/pages')
        flatTree.value = res
        fileTree.value = buildTree(res)
    }


    const createPage = async (pageData?: Partial<FlatTreeNode>, parentId?: null | string) => {
        let order: number;

        if (parentId) {
            const parent = findNode(parentId, fileTree.value);
            order = parent?.children.length ?? 0;
        } else {
            order = fileTree.value.length;
        }

        const body = {
            ...pageData,
            parentId,
            label: "Untitled",
            order,
        }


        const res = await $api<FlatTreeNode>('/pages', {
            method: 'post',
            body: body,
        })

        const content = await $api('content', {
            method: 'post',
            body: {
                id: res.id,
                title: "Untitled",
                blocks: []
            }
        })

        if (parentId) {
            const parent = findNode(parentId, fileTree.value);
            parent?.children.push({...res, open: true, children: [], order});
        } else {
            fileTree.value.push({...res, open: true, children: [], order});
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

    const editTitle = (id: string, title: string) => {
        const flat = flatTree.value.find(n => n.id === id)
        if (flat) flat.label = title

        const node = findNode(id, fileTree.value);
        if (node) node.label = title;
    }

    const syncParentIds = async () => {
        const walk = async (nodes: TreeNode[], parentId: string | null) => {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]

                if (!node) continue

                node.parentId = parentId ?? undefined
                node.order = i

                await $api(`/pages/${node.id}`, {
                    method: 'patch',
                    body: {
                        parentId: parentId ?? null,
                        order: i
                    }
                })

                await walk(node.children, node.id)
            }
        }

        await walk(fileTree.value, null);
    };


    return {fileTree, flatTree, createPage, fetchPages, deletePage, editTitle, syncParentIds}
})