import type {FlatTreeNode, TreeNode} from '~/types/TreeNode'

export const useFileStore = defineStore('fileStore', () => {
    const fileTree = ref<TreeNode[]>([]);

    const fetchPages = async () => {
        const res = await $api<FlatTreeNode[]>('/pages')

        fileTree.value = buildTree(res)
    }

    const createPage = async (parentId: null | string, pageData: Partial<FlatTreeNode>) => {
        const body = {
            ...pageData,
            open: false,
            parentId,
        }

        return await $api('/pages', {
            method: 'post',
            body: body,
        })
    };


    return {fileTree, createPage, fetchPages}
})