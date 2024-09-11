import React, { memo } from 'react';
import { Table, Dropdown, Button } from 'antd';
import { FolderOutlined, PlusSquareOutlined, EllipsisOutlined } from '@ant-design/icons';

const data = [
    {
        key: '1',
        name: 'JS',
        author: 'Sytus',
        modified: '昨天 16:07',
    },
    {
        key: '2',
        name: 'NodeJS',
        author: 'Sytus',
        modified: '3月14日 21:21',
    },
    {
        key: '3',
        name: 'React',
        author: 'Sytus',
        modified: '今天 14:19',
    },
    {
        key: '4',
        name: 'TypeScript',
        author: 'Sytus',
        modified: '2023年11月15日',
    },
    {
        key: '5',
        name: 'Webpack',
        author: 'Sytus',
        modified: '3月26日 17:00',
    },
    {
        key: '6',
        name: '包管理',
        author: 'Sytus',
        modified: '3月20日 21:24',
    },
    {
        key: '7',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '8',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '9',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '10',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '11',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '12',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '13',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    }, {
        key: '14',
        name: '计算机网络',
        author: 'Sytus',
        modified: '4月28日 22:20',
    },
];

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
            <span>
                <FolderOutlined style={{ marginRight: 8 }} />
                {text}
            </span>
        ),
    },
    {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
    },
    {
        title: '修改时间',
        dataIndex: 'modified',
        key: 'modified',
    },
    {
        title: (<div style={{ textAlign: 'center' }}><PlusSquareOutlined /></div>),
        key: 'operation',
        width: 100,
        render: (text, record) => {
            const menuItems = [
                {
                    key: 'details',
                    label: '详情',
                    onClick: () => handleMenuClick('details', record),
                },
                {
                    key: 'delete',
                    label: '删除',
                    onClick: () => handleMenuClick('delete', record),
                },
            ];

            return (
                <div
                    style={{ textAlign: 'center' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                    >
                        <Button
                            icon={<EllipsisOutlined />}
                            size="small"
                            style={{ border: 'none' }}
                        />
                    </Dropdown>
                </div>
            );
        },
    },
];

const handleMenuClick = (action, record) => {
    if (action === 'details') {
        console.log('详情:', record);
    } else if (action === 'delete') {
        console.log('删除:', record);
    }
};

const FileList = () => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ y: 'calc(100vh - 260px)' }}
            onRow={(record) => ({
                onClick: () => {
                    console.log(record.name);
                },
            })}
        />
    );
};

export const MemoFileList = memo(FileList);