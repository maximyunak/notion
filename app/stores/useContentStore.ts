import type {ContentBlock, PageContent} from "~/types/PageContent";
import type {FlatTreeNode} from "~/types/TreeNode";

export const useContentStore = defineStore('contentStore', () => {
    const pageContent = ref<PageContent>()

    const getPageContent = async (id: string) => {
        pageContent.value = await $api<PageContent>(`/content/${id}`)
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
    }

    const savePageTitle = async () => {
        if (!pageContent.value) return



        await Promise.all([
            $api(`content/${pageContent.value.id}`, {
                method: 'patch',
                body: {
                    title: pageContent.value.title
                }
            }),
            $api(`pages/${pageContent.value.id}`, {
                method: 'patch',
                body: {
                    label: pageContent.value.title
                }
            }),
        ])
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

    const createContentBlock = async (block: ContentBlock, prevBlockId: string) => {
        if (!pageContent.value) return

        const prevIndex = pageContent.value?.blocks.findIndex(block => block.id === prevBlockId) + 1
        pageContent.value?.blocks.splice(prevIndex, 0, block)
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
        getPageContent,
        updatePageContent,
        savePageTitle,
        deleteContentBlock,
        createContentBlock,
        savePositions
    }
})