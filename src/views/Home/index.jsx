import { memo, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, Breadcrumb, Space, ConfigProvider, FloatButton } from 'antd';
import { CloudOutlined, LogoutOutlined } from '@ant-design/icons';
import { MemoAddNewFile } from '@/components/AddNewFile';
import { UploadFile } from '@/components/UploadFile';
import { useMessage } from '@/hooks/useMessage';
import style from './index.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { request } from '@/utils';  // 页面开始前初始化store，不可删，需要在引入store前引入
import { showMessage } from '@/store/modules/message';
import { clearUserInfo } from '@/store/modules/user';
import { clearToken } from '@/utils';
const { Content, Sider } = Layout;
const Home = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { message, type, visible } = useSelector(state => state.message)
    const { success, contextHolder } = useMessage()
    const exit = () => {
        dispatch(showMessage({ message: '退出成功', type: 'success' }))
        dispatch(clearUserInfo())
        clearToken()
        navigate('/login')
    }
    useEffect(() => {
        if (visible && message === '登录成功') {
            success({
                content: message,
                callBack: () => dispatch(showMessage({ message: '' }))
            })
        }
    }, [visible, message, type])
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
                        }
                    ]}
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
                    <Breadcrumb separator=">" items={[
                        {
                            title: '云盘'
                        }
                    ]}
                        style={{
                            fontSize: '24px'
                        }}
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