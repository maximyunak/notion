import type {TreeNode} from '~/types/TreeNode'
import type {NavigationMenuItem} from "@nuxt/ui";

export const useFileStore = defineStore('fileStore', () => {
    const fileTree = ref<TreeNode[]>([
            {
                id: 'ds',
                label: 'folder',
                open: true,
                type: 'folder',
                children: [
                    {
                        id: 'sdfsdf',
                        label: 'file',
                        type: 'file',
                    }
                ]
            }
        ]
    )


    return {fileTree}
})