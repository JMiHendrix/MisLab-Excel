import { createHashRouter, Navigate } from 'react-router-dom'
import { MemoHome } from '@/views/Home'
import { MemoNotFound } from '@/views/NotFound'
import { MemoFileList } from '@/views/FileList'
import { MemoLogin } from '@/views/Login'
import { MemoContent } from '@/views/Content'
import { MemoExcel } from '@/views/Excel'
import { MemoAddContent } from '@/views/AddContent'
import { MemoAddExcel } from '@/views/AddExcel'

const router = createHashRouter([
    {
        path: '/',
        element: <Navigate replace to='/home' />
    },
    {
        path: '/login',
        element: <MemoLogin />
    },
    {
        path: 'home',
        element: <MemoHome />,
        children: [
            {
                index: true,
                element: <MemoFileList />
            },
            {
                path: 'list/:id',
                element: <MemoFileList />
            }
        ]
    },
    {
        path: 'content/:folder/:id',
        element: <MemoContent />
    },
    {
        path: 'addContent/:folder',
        element: <MemoAddContent />
    },
    {
        path: 'excel/:folder/:id',
        element: <MemoExcel />
    },
    {
        path: 'addExcel/:folder',
        element: <MemoAddExcel />
    },
    {
        path: '*',
        element: <MemoNotFound />
    }
])
export default router