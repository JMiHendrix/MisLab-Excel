import { memo } from 'react'
import React from 'react';
import { Layout, Menu, theme, Breadcrumb, Dropdown, Space, Button } from 'antd';
import { CloudOutlined, FormOutlined } from '@ant-design/icons';
import style from './index.module.css'
const { Content, Sider } = Layout;
const Home = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{
            height: '100vh'
        }}>
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
                    {/* <Space wrap>
                        <Dropdown.Button>
                                <Space>
                                    <FormOutlined />
                                    Button
                                </Space>
                        </Dropdown.Button>
                    </Space> */}
                </Content>
            </Layout>
        </Layout>
    );
}

export const MemoHome = memo(Home)