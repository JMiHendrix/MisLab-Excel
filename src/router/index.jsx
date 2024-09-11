import { createHashRouter, Navigate } from 'react-router-dom'
import { MemoHome } from '@/views/Home'
import { MemoNotFound } from '@/views/NotFound'
import { MemoFileList } from '@/views/FileList'

const router = createHashRouter([
    {
        path: '/',
        element: <Navigate replace to='/home' />
    },
    {
        path: 'home',
        element: <MemoHome />,
        children: [
            {
                index: true,
                element: <MemoFileList />
            }
        ]
    },
    {
        path: '*',
        element: <MemoNotFound />
    }
])
export default router