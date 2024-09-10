import { createHashRouter, Navigate } from 'react-router-dom'
import { MemoHome } from '@/views/Home'
import { MemoNotFound } from '@/views/NotFound'

const router = createHashRouter([
    {
        path: '/',
        element: <Navigate replace to='/home' />
    },
    {
        path: 'home',
        element: <MemoHome />
    },
    {
        path: '*',
        element: <MemoNotFound />
    }
])
export default router