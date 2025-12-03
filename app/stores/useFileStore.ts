import type {FlatTreeNode, PageContent, TreeNode} from '~/types/TreeNode'
import {findNode} from "~/utils/find-node";

export const useFileStore = defineStore('fileStore', () => {
    const fileTree = ref<TreeNode[]>([]);

    const fetchPages = async () => {
        const res = await $api<FlatTreeNode[]>('/pages')

        fileTree.value = buildTree(res)
    }

    const getPageContent = async (id: string) => {
        const page = await $api<FlatTreeNode>(`/pages/${id}`);
        const content = await $api<PageContent>(`content/${id}`).catch(() => ({
            id, content: ''
        }))

        return {
            page,
            content,
        }
    }

    const createPage = async (pageData: Partial<FlatTreeNode>, parentId: null | string) => {
        const body = {
            ...pageData,
            parentId,
            label: "Untitled"
        }

        const res = await $api<FlatTreeNode>('/pages', {
            method: 'post',
            body: body,
        })

        if (parentId) {
            const parent = findNode(parentId, fileTree.value);

            parent?.children.push({...res, open: true, children: []})
        }

        return
    };


    return {fileTree, createPage, fetchPages, getPageContent}
})