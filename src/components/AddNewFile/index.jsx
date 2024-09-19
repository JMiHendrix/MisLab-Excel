import { memo, useState, useRef } from 'react'
import { Dropdown, Button, Modal, Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { DownOutlined, FileAddOutlined, FileExcelOutlined, FileMarkdownOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { addFolder } from '@/apis/folder';
import { useMessage } from '@/hooks/useMessage';
import style from './index.module.css'

const AddNewFile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const param = useParams()
    const { error, contextHolder } = useMessage()
    const folderName = useRef('')
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        try {
            let parentId = ''
            if (param.id !== undefined) parentId = param.id
            setLoading(true)
            const res = await addFolder({
                name: folderName.current,
                parentId
            })
            folderName.current = ''
            setIsModalOpen(false);
            setLoading(false)
            navigate(`/home/list/${res.data}`)
        } catch (e) {
            error({
                content: '新增文件夹失败',
                callBack: () => {
                    folderName.current = ''
                    setIsModalOpen(false);
                    setLoading(false)
                }
            })
        }
    };
    const handleCancel = () => {
        folderName.current = ''
        setIsModalOpen(false);
    };
    const handleMenuClick = (e) => {
        if (e.key === '1') {
            if (param.id === undefined)
                navigate(`/addContent/main`)
            else navigate(`/addContent/${param.id}`)
        }
        if (e.key === '2') {
            if (param.id === undefined)
                navigate(`/addExcel/main`)
            else navigate(`/addExcel/${param.id}`)
        }
        if (e.key === "3") showModal()
    };
    const items = [
        {
            label: '在线文档',
            key: '1',
            icon: <FileMarkdownOutlined />
        },
        {
            label: '在线Excel',
            key: '2',
            icon: <FileExcelOutlined />
        },
        {
            label: '文件夹',
            key: '3',
            icon: <FolderOpenOutlined />
        }
    ]

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <>
            {contextHolder}
            <Dropdown menu={menuProps} className={style.box}>
                <Button>
                    <FileAddOutlined className={style.firIcon} />
                    新建
                    <DownOutlined className={style.secIcon} />
                </Button>
            </Dropdown>
            <Modal title={'创建文件夹'}
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel} 
            okText={'创建'} 
            cancelText={'取消'} 
            destroyOnClose={true}
            confirmLoading={loading}
            >
                <Form validateTrigger='onChange' colon={false}>
                    <Form.Item name='name' label={'名称'}
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
    )
}

export const MemoAddNewFile = memo(AddNewFile)