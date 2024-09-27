import React, { memo, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Table, Dropdown, Button, Spin, Modal, Form, Input } from 'antd';
import { FolderOutlined, PlusSquareOutlined, EllipsisOutlined, EditOutlined, TableOutlined, FileOutlined } from '@ant-design/icons';
import { getFileList } from '@/apis/fileList';
import { updateFolder } from '@/apis/folder';
import { delContent, delExcel, delFolder, delFile } from '@/apis/delete';
import { previewFile } from '@/apis/file';
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
                if (record.status === 1 || 3) menuItems = [
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
                if (record.status === 2) menuItems = [
                    {
                        key: 'details',
                        label: '详情',
                        onClick: () => handleMenuClick('details', record),
                    },
                    {
                        key: 'update',
                        label: '更名',
                        onClick: () => handleMenuClick('update', record),
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
                        label: '操作',
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
    const location = useLocation()
    const { error, contextHolder } = useMessage()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalLoding, setModalLoading] = useState(false)
    const [currentFolder, setCurrentFolder] = useState('')
    const folderName = useRef('')
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
    const preview = async (id) => {
        try {
            const res = await previewFile(id)
            window.open(res.data, '_blank')
        } catch (e) {
            error({
                content: '下载文件失败，请检查网络'
            })
        }
    }
    const refreshUrl = () => {
        if (param.id === undefined) navigate(`/home`, { state: { refresh: Date.now() } })
        else navigate(`/home/list/${param.id}`, { state: { refresh: Date.now() } })
    }
    const handleMenuClick = async (action, record) => {
        if (action === 'details') {
            handleClick(record)
        } else if (action === 'delete') {
            try {
                if (record.status === 1) {
                    setLoading(true)
                    await delContent(record.id)
                }
                if (record.status === 2) {
                    setLoading(true)
                    await delFolder(record.id)
                }
                if (record.status === 3) {
                    setLoading(true)
                    await delExcel(record.id)
                }
                if (record.status === 4) {
                    setLoading(true)
                    await delFile(record.id)
                }
                refreshUrl()
            } catch (e) {
                error({
                    content: '删除失败',
                    callBack: () => setLoading(false)
                })
            }
            if (param.id === undefined) getList()
            else getList(param.id)
        } else if (action === 'update') {
            setCurrentFolder(record);
            setIsModalOpen(true);
            folderName.current = record.name;
        } else if (action === 'download') {
            preview(record.id)
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
    const handleOk = async () => {
        setModalLoading(true);
        try {
            await updateFolder({ name: folderName.current, folderId: currentFolder.id });
            setIsModalOpen(false);
            setModalLoading(false);
            refreshUrl()
        } catch (e) {
            error({ content: '更名失败' });
            setModalLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (param.id === undefined) getList()
        else getList(param.id)
    }, [param.id])
    useEffect(() => {
        if (location.state?.refresh)
            if (param.id === undefined) getList()
            else getList(param.id)
    }, [location.state])
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
            <Modal title={'更改文件夹名称'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={'创建'}
                cancelText={'取消'}
                destroyOnClose={true}
                confirmLoading={modalLoding}
            >
                <Form validateTrigger='onChange' colon={false}>
                    <Form.Item name='name' label={'名称'}
                        initialValue={folderName.current}
                        rules={[() => ({
                            validator(_, value) {
                                folderName.current = value
                                return Promise.resolve()
                            }
                        })]}
                    >
                        <Input placeholder="请输入文件夹名称" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export const MemoFileList = memo(FileList);