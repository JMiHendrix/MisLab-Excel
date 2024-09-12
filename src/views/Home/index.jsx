import { memo, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, Breadcrumb, Space, Button, ConfigProvider } from 'antd';
import { CloudOutlined } from '@ant-design/icons';
import { MemoAddNewFile } from '@/components/AddNewFile';
import { UploadFile } from '@/components/UploadFile';
import { request } from '@/utils';
import { useMessage } from '@/hooks/useMessage';
import style from './index.module.css'
const { Content, Sider } = Layout;
const Home = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { contextHolder } = useMessage()
    useEffect(() => {
        request({
            url: '/excel/title',
            method: 'GET'
        })
    }
        , [])
    return (
        <Layout style={{
            height: '100vh',
        }}>
            {contextHolder}
            <Sider
                width={200}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
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