import React, { memo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Dropdown, Button, Spin } from 'antd';
import { FolderOutlined, PlusSquareOutlined, EllipsisOutlined, EditOutlined, TableOutlined, FileOutlined } from '@ant-design/icons';
import { getFileList } from '@/apis/fileList';
import { useMessage } from '@/hooks/useMessage';
import { formatDate } from '@/utils';
import style from './index.module.css'

const FileList = () => {
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.status === 1) {
                    return (
                        <span>
                            <EditOutlined style={{ marginRight: 8 }} />
                            {text}
                        </span>
                    )
                } else if (record.status === 2) {
                    return (
                        <span>
                            <FolderOutlined style={{ marginRight: 8 }} />
                            {text}
                        </span>
                    )
                } else if (record.status === 3) {
                    return (
                        <span>
                            <TableOutlined style={{ marginRight: 8 }} />
                            {text}
                        </span>
                    )
                } else if (record.status === 4) {
                    return (
                        <span>
                            <FileOutlined style={{ marginRight: 8 }} />
                            {text}
                        </span>
                    )
                }
            }
        },
        {
            title: '所有者',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: (<div style={{ textAlign: 'center' }}><PlusSquareOutlined /></div>),
            key: 'operation',
            width: 100,
            render: (text, record) => {
                let menuItems = []
                if (record.status === 1 || 2 || 3) menuItems = [
                    {
                        key: 'details',
                        label: '详情',
                        onClick: () => handleMenuClick('details', record),
                    },
                    {
                        key: 'delete',
                        label: '删除',
                        danger: true,
                        onClick: () => handleMenuClick('delete', record),
                    },
                ]
                if (record.status === 4) menuItems = [
                    {
                        key: 'download',
                        label: '下载',
                        onClick: () => handleMenuClick('download', record),
                    },
                    {
                        key: 'delete',
                        label: '删除',
                        danger: true,
                        onClick: () => handleMenuClick('delete', record),
                    },
                ]
                return (
                    <div
                        style={{ textAlign: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Dropdown
                            menu={{ items: menuItems }}
                            trigger={['click']}
                            overlayStyle={{
                                width: '60px'
                            }}
                        >
                            <Button
                                icon={<EllipsisOutlined />}
                                size="big"
                                style={{ border: 'none' }}
                            />
                        </Dropdown>
                    </div>
                );
            },
        },
    ];
    const param = useParams()
    const navigate = useNavigate()
    const { error, contextHolder } = useMessage()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const getList = async (id = '') => {
        try {
            setLoading(true)
            const res = await getFileList(id)
            setList(res.data)
            setLoading(false)
        } catch (e) {
            error({
                content: '数据获取失败'
            })
            setLoading(false)
        }
    }
    const handleMenuClick = (action, record) => {
        if (action === 'details') {
            handleClick(record)
        } else if (action === 'delete') {
            console.log('删除:', record);
        }
    };
    const handleClick = (record) => {
        if (record.status === 1) {
            if (param.id === undefined) navigate(`/content/main/${record.id}`)
            else navigate(`/content/${param.id}/${record.id}`)
        }
        if (record.status === 2) {
            navigate(`/home/list/${record.id}`)
        }
        if (record.status === 3) {
            if (param.id === undefined) navigate(`/excel/main/${record.id}`)
            else navigate(`/excel/${param.id}/${record.id}`)
        }
    }
    useEffect(() => {
        if (param.id === undefined) getList()
        else getList(param.id)
    }, [param.id])
    return (
        <>
            {contextHolder}
            {
                loading
                    ? <Spin size='large' className={style.spin} />
                    : <Table
                        columns={columns}
                        dataSource={list.map(item => ({ ...item, key: `${item.id}` + `${item.status}`, updateTime: formatDate(item.updateTime) }))}
                        pagination={false}
                        scroll={{ y: 'calc(100vh - 260px)' }}
                        onRow={(record) => ({
                            onClick: () => handleClick(record)
                        })}
                        className={style.fileList}
                    />
            }
        </>
    );
};

export const MemoFileList = memo(FileList);