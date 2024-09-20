import { memo, useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, theme, Breadcrumb, Space, ConfigProvider, FloatButton, Tooltip, Button } from 'antd';
import { CloudOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, FolderOutlined, EditOutlined, TableOutlined, FileOutlined } from '@ant-design/icons';
import { MemoAddNewFile } from '@/components/AddNewFile';
import { UploadFile } from '@/components/UploadFile';
import { useMessage } from '@/hooks/useMessage';
import style from './index.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { request } from '@/utils';  // 页面开始前初始化store，不可删，需要在引入store前引入
import { showMessage } from '@/store/modules/message';
import { clearUserInfo } from '@/store/modules/user';
import { clearToken } from '@/utils';
import { useParams } from 'react-router-dom';
import { getLayer, getFolderTree } from '@/apis/folder'
const { Content, Sider } = Layout;
const Home = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation()
    const param = useParams()
    const [folderLayer, setFolderLayer] = useState([])
    const [folderTree, SetFolderTree] = useState([])
    const [collapsed, setCollapsed] = useState(false);
    const { message, type, visible } = useSelector(state => state.message)
    const { success, error, contextHolder } = useMessage()
    const exit = () => {
        dispatch(showMessage({ message: '退出成功', type: 'success' }))
        dispatch(clearUserInfo())
        clearToken()
        navigate('/login')
    }
    const getLayerList = async (id) => {
        try {
            const res = await getLayer(id)
            let layer = res.data.reverse()
            setFolderLayer([
                {
                    title: '云盘',
                    onClick: () => navigate('/home')
                },
                ...layer.map(item => ({
                    title: item.name,
                    onClick: () => navigate(`/home/list/${item.id}`)
                }))
            ])
        } catch (e) {
            error({
                content: '导航加载失败，请检查网络'
            })
        }
    }
    const getTree = async () => {
        try {
            const res = await getFolderTree()
            SetFolderTree(res.data)
        } catch (e) {
            error({
                content: '侧边栏获取失败'
            })
        }
    }
    const transformToMenuItems = (data) => {
        return data.map(item => {
            const returnKey = () => {
                if (item.folderId === null) {
                    if (item.status === 1) {
                        return `/content/main/${item.id}`
                    }
                    if (item.status === 2) {
                        return `/home/list/${item.id}`
                    }
                    if (item.status === 3) {
                        return `/excel/main/${item.id}`
                    }
                    if (item.status === 4) {
                        return `file${item.name}${item.id}`
                    }
                } else {
                    if (item.status === 1) {
                        return `/content/${item.folderId}/${item.id}`
                    }
                    if (item.status === 2) {
                        return `/home/list/${item.id}`
                    }
                    if (item.status === 3) {
                        return `/excel/${item.folderId}/${item.id}`
                    }
                    if (item.status === 4) {
                        return `file${item.name}${item.id}`
                    }
                }
            }
            const returnIcon = () => {
                if (item.status === 1) return <EditOutlined />
                if (item.status === 2) return <FolderOutlined />
                if (item.status === 3) return <TableOutlined />
                if (item.status === 4) return <FileOutlined />
            }
            return {
                key: returnKey(),
                icon: returnIcon(),
                label: (
                    <Tooltip title={item.name}>
                        {item.name}
                    </Tooltip>
                )
                ,
                children: item.children && item.children.length > 0
                    ? transformToMenuItems(item.children)
                    : undefined,
            }
        });
    };
    useEffect(() => {
        if (visible && message === '登录成功') {
            success({
                content: message,
                callBack: () => dispatch(showMessage({ message: '' }))
            })
        }
        if (param.id === undefined) {
            setFolderLayer([
                {
                    title: '云盘',
                }
            ])
        } else if (param.id) {
            getLayerList(param.id)
        }
    }, [visible, message, type, param.id])
    useEffect(() => {
        getTree()
    }, [])
    useEffect(() => {
        if (location.state?.refresh) getTree()
    }, [location.state])
    return (
        <Layout style={{
            height: '100vh',
        }}>
            {contextHolder}
            <FloatButton
                icon={<LogoutOutlined />}
                type='primary'
                onClick={exit}
                style={{
                    insetInlineEnd: 36,
                }} />
            <Sider
                width={250}
                breakpoint="lg"
                collapsed={collapsed}
                onCollapse={setCollapsed}
                collapsedWidth={80}
                style={{
                    background: colorBgContainer,
                    overflowY: 'scroll',
                }}
                className={style.sider}
            >
                <div className={style.logo}>{collapsed ? <CloudOutlined style={{
                    fontSize: '25px',
                    color: '#1677ff'
                }} /> : '文件管理系统'}</div>
                <Menu
                    mode="inline"
                    inlineIndent={8}
                    items={
                        transformToMenuItems(folderTree)
                    }
                    onClick={(e) => {
                        if (e.key.slice(0, 4) === 'file') return
                        else navigate(e.key)
                    }}
                />
            </Sider>
            <Layout
                style={{
                    padding: '0 24px 0',
                }}
            >
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Breadcrumb separator=">" items={folderLayer}
                        style={{
                            fontSize: '24px'
                        }}
                        className={style.breadcrumb}
                    />
                    <ConfigProvider
                        wave={{
                            disabled: true, // 全局禁用波纹效果
                        }}
                    >
                        <Space size={50} style={{
                            marginTop: 20
                        }}>
                            <MemoAddNewFile></MemoAddNewFile>
                            <UploadFile></UploadFile>
                        </Space>
                    </ConfigProvider>
                    <div
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                        className={style.fileList}
                    >
                        <Outlet></Outlet>
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
}

export const MemoHome = memo(Home)