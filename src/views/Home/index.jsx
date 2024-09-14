import { memo, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, Breadcrumb, Space, ConfigProvider, FloatButton } from 'antd';
import { CloudOutlined, LogoutOutlined, FolderOutlined } from '@ant-design/icons';
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
    const param = useParams()
    const [folderLayer, setFolderLayer] = useState([])
    const [folderTree, SetFolderTree] = useState([])
    const { message, type, visible } = useSelector(state => state.message)
    const { success, error, contextHolder } = useMessage()
    const exit = () => {
        dispatch(showMessage({ message: '退出成功', type: 'success' }))
        dispatch(clearUserInfo())
        clearToken()
        navigate('/login')
    }
    const getLayerList = async (id) => {
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
    }
    // const getTree = async () => {
    //     const res = await getFolderTree()
    //     SetFolderTree(res.data)
    // }
    const transformToMenuItems = (data) => {
        return data.map(item => ({
            key: `/home/list/${item.id}`, // 生成唯一的key
            icon: <FolderOutlined />,
            label: item.name, // 使用name作为标签
            children: item.children && item.children.length > 0 ? transformToMenuItems(item.children) : undefined, // 如果有children，递归转换
        }));
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
            try {
                getLayerList(param.id)
            } catch (e) {
                error({
                    content: '导航加载失败，请检查网络'
                })
            }
        }

    }, [visible, message, type, param.id])
    // useEffect(() => {
    //     getTree()
    // }, []) //TODO 判定条件
    return (
        <Layout style={{
            height: '100vh',
        }}>
            {contextHolder}
            <FloatButton icon={<LogoutOutlined />} type='primary' onClick={exit} />
            <Sider
                width={200}
                breakpoint="lg"
                collapsedWidth="0"
                style={{
                    background: colorBgContainer,
                }}
            >
                <div className={style.logo}>论文管理系统</div>
                <Menu
                    mode="inline"
                    items={[
                        {
                            key: '/home',
                            icon: <CloudOutlined />,
                            label: '云盘',
                            // children: transformToMenuItems(folderTree)
                        }
                    ]}
                // onClick={(e) => navigate(e.key)} 
                />
            </Sider>
            <Layout
                style={{
                    padding: '0 24px 24px',
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