import type {ContentBlock, PageContent} from "~/types/PageContent";
import type {FlatTreeNode} from "~/types/TreeNode";

export const useContentStore = defineStore('contentStore', () => {
    const pageContent = ref<PageContent>()
    const pageData = ref<FlatTreeNode>()

    const getPageContent = async (id: string) => {
        const [page, content] = await Promise.all([
            $api<FlatTreeNode>(`/pages/${id}`),
            $api<PageContent>(`content/${id}`).catch(() => ({
                id, content: '', blocks: []
            }))
        ])

        pageContent.value = content
        pageData.value = page

        return
    }

    const updatePageContent = async (updated: ContentBlock) => {
        if (!pageContent.value) return

        const idx = pageContent.value?.blocks.findIndex(block => block.id === updated.id)

        if (idx !== -1) {
            pageContent.value?.blocks.splice(idx, 1, updated)
        }

        await $api(`content/${pageContent.value.id}`, {
            method: 'patch',
            body: pageContent.value
        })

        return
    }

    const editPageTitle = async (title: string) => {
        if (!pageData.value) return
        pageData.value.label = title

        console.log(title)

        await $api(`pages/${pageData.value.id}`, {
            method: 'patch',
            body: pageData.value
        })
    }

    const deleteContentBlock = async (id: string) => {
        if (!pageContent.value) return

        console.log(id)

        pageContent.value.blocks = pageContent.value.blocks.filter(block => block.id !== id)

        await $api(`content/${pageContent.value.id}`, {
            method: 'patch',
            body: pageContent.value
        })
    }

    const createContentBlock = async (block: ContentBlock) => {
        if (!pageContent.value) return

        console.log(block, 'store')

        pageContent.value?.blocks.push(block)
        await $api(`content/${pageContent.value.id}`, {
            method: 'patch',
            body: pageContent.value
        })
    }

    const savePositions = async () => {
        if (!pageContent.value) return

        await $api(`content/${pageContent.value.id}`, {
            method: 'patch',
            body: {
                blocks: pageContent.value.blocks
            }
        })
    }

    return {
        pageContent,
        pageData,
        getPageContent,
        updatePageContent,
        editPageTitle,
        deleteContentBlock,
        createContentBlock,
        savePositions
    }
})