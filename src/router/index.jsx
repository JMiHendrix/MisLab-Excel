import { createHashRouter, Navigate } from 'react-router-dom'
import { MemoHome } from '@/views/Home'
import { MemoNotFound } from '@/views/NotFound'
import { MemoFileList } from '@/views/FileList'
import { MemoLogin } from '@/views/Login'
import AuthRoute from './AuthRoute'

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
        path: '*',
        element: <MemoNotFound />
    }
])
export default router