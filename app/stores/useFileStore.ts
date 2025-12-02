import type {TreeNode} from '~/types/TreeNode'
import type {NavigationMenuItem} from "@nuxt/ui";

export const useFileStore = defineStore('fileStore', () => {
    const fileTree = ref<TreeNode[]>([
            {
                id: 'file-1',
                label: 'Folder 1',
                type: 'folder',
                open: true,
                children: [
                    {
                        id: 'file-2s',
                        label: 'file',
                        type: 'file',
                        open: true,
                        children: [
                            {
                                id: 'file-sss',
                                label: "folder",
                                type: 'folder',
                                open: false
                            },
                            {
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },
                            {
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },
                            {
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },
                            {
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },{
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },{
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },{
                                id: 'file-2s',
                                label: 'file',
                                type: 'file',
                                open: true,
                                children: [
                                    {
                                        id: 'file-sss',
                                        label: "folder",
                                        type: 'folder',
                                        open: false
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        id: 'file-3',
                        label: 'file 2',
                        type: 'file',
                        open: true,
                    }
                ]
            },
            {
                id: 'file-2',
                label: 'folder-2',
                type: 'folder',
                open: true,
                children: [
                    {
                        id: "File221",
                        label: 'file',
                        type: "file",
                        open: true,

                    }
                ],
            },
            {
                id: 'file--',
                label: 'file',
                type: 'file',
                open: true,
            }
        ]
    )


    return {fileTree}
})