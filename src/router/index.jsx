// import { createHashRouter, Navigate } from 'react-router-dom'
// import { MemoHome } from '@/views/Home'
// import { MemoNotFound } from '@/views/NotFound'
// import { MemoFileList } from '@/views/FileList'
// import { MemoLogin } from '@/views/Login'
// import { MemoContent } from '@/views/Content'
// import { MemoExcel } from '@/views/Excel'
// import { MemoAddContent } from '@/views/AddContent'
// import { MemoAddExcel } from '@/views/AddExcel'

// const router = createHashRouter([
//     {
//         path: '/',
//         element: <Navigate replace to='/home' />
//     },
//     {
//         path: '/login',
//         element: <MemoLogin />
//     },
//     {
//         path: 'home',
//         element: <MemoHome />,
//         children: [
//             {
//                 index: true,
//                 element: <MemoFileList />
//             },
//             {
//                 path: 'list/:id',
//                 element: <MemoFileList />
//             }
//         ]
//     },
//     {
//         path: 'content/:folder/:id',
//         element: <MemoContent />
//     },
//     {
//         path: 'addContent/:folder',
//         element: <MemoAddContent />
//     },
//     {
//         path: 'excel/:folder/:id',
//         element: <MemoExcel />
//     },
//     {
//         path: 'addExcel/:folder',
//         element: <MemoAddExcel />
//     },
//     {
//         path: '*',
//         element: <MemoNotFound />
//     }
// ])
// export default router

//使用懒加载模式进行优化
//使用懒加载在初次加载时仅加载当前页面所需最小资源，结合suspense提供占位加载符，确保用户在访问路由时不会看到空白页面而是加载的提示
import { createHashRouter, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { useEffect } from 'react';

// 使用 React.lazy 动态加载组件
const LazyHome = lazy(() => import('@/views/Home'));
const LazyNotFound = lazy(() => import('@/views/NotFound'));
const LazyFileList = lazy(() => import('@/views/FileList'));
const LazyLogin = lazy(() => import('@/views/Login'));
const LazyContent = lazy(() => import('@/views/Content'));
const LazyExcel = lazy(() => import('@/views/Excel'));
const LazyAddContent = lazy(() => import('@/views/AddContent'));
const LazyAddExcel = lazy(() => import('@/views/AddExcel'));

//考虑某些情况下希望提前加载某些关键路由资源，以进一步减少用户的等待时间。可以通过 useEffect 在用户尚未访问某些页面时提前加载组件。
useEffect(() => {
    import('@/views/Home')
},[])

// 创建路由表
const router = createHashRouter([
    {
        path: '/',
        element: <Navigate replace to='/home' />,
    },
    {
        path: '/login',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyLogin />
            </Suspense>
        ),
    },
    {
        path: '/home',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyHome />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LazyFileList />
                    </Suspense>
                ),
            },
            {
                path: 'list/:id',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <LazyFileList />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '/content/:folder/:id',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyContent />
            </Suspense>
        ),
    },
    {
        path: '/addContent/:folder',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyAddContent />
            </Suspense>
        ),
    },
    {
        path: '/excel/:folder/:id',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyExcel />
            </Suspense>
        ),
    },
    {
        path: '/addExcel/:folder',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyAddExcel />
            </Suspense>
        ),
    },
    {
        path: '*',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <LazyNotFound />
            </Suspense>
        ),
    },
]);

export default router;
