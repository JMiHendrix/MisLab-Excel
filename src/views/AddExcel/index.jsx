import { memo, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Drawer, Form, Input, Space, FloatButton, Modal, Spin } from 'antd';
import { RollbackOutlined, CheckOutlined, VerticalAlignBottomOutlined, UpOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { MemoSheet } from '@/components/UniverSheet';
import { useMessage } from '@/hooks/useMessage';
import { convertToExcelFormat } from '@/utils';
import { DEFAULT_WORKBOOK_DATA } from '@/assets/default-data'
import { addExcel } from '@/apis/excel';
import style from './index.module.css'

const AddExcel = () => {
    const { error, contextHolder } = useMessage()
    const [open, setOpen] = useState(false);
    const [data] = useState({})
    const [loading, setLoading] = useState(false)
    const univerRef = useRef();
    const excelName = useRef('')
    const navigate = useNavigate()
    const param = useParams()
    const back = () => {
        if (param.folder === 'main') navigate('/home')
        else navigate(`/home/list/${param.folder}`)
    }
    // 新增逻辑
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const add = async () => {
        try {
            setLoading(true)
            let folder = ''
            if (param.folder !== 'main') folder = param.folder
            await addExcel({
                title: excelName.current,
                url: JSON.stringify(univerRef.current?.getData()),
                folderId: folder
            })
            if (param.folder === 'main') navigate('/home')
            else navigate(`/home/list/${param.folder}`)
        } catch (e) {
            error({
                content: '新增Excel失败',
                callBack: () => setLoading(false)
            })
        }
    }
    // 导出逻辑
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ExportExcelName = useRef('MISLab-Excel')
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        handleExportExcel()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleExportExcel = () => {
        // 创建一个工作簿
        const workbook = XLSX.utils.book_new();

        // 遍历每个工作表并将其添加到工作簿中
        // 使用 univerRef.current?.getData() 可以避免Univer组件修改data，从而实现多次进入新增页面可以得到空表
        Object.keys(univerRef.current?.getData().sheets).forEach(sheetName => {
            const sheetData = univerRef.current?.getData().sheets[sheetName].cellData;
            const excelFormat = convertToExcelFormat(sheetData);
            if (excelFormat['!ref'] === 'A1:\x00-Infinity') excelFormat['!ref'] = 'A1:A2'
            // console.log("format", excelFormat);
            XLSX.utils.book_append_sheet(workbook, excelFormat, univerRef.current?.getData().sheets[sheetName].name);
        });
        XLSX.writeFile(workbook, `${ExportExcelName.current}.xlsx`, { compression: true });
    };

    useEffect(() => {        
        if (!loading) {
            setTimeout(() => {
                const toolbar = document.querySelector('.univer-toolbar');
                if (toolbar) {
                    toolbar.style.opacity = '1';
                }
            }, 500);
        }
    }, []);
    return (
        <>
            {contextHolder}
            {
                loading ?
                    <Spin size='large' className={style.spin} /> :
                    <>
                        <MemoSheet style={{ flex: 1 }} ref={univerRef} data={data} />
                        <FloatButton.Group
                            shape="circle"
                            trigger="hover"
                            type="primary"
                            icon={<UpOutlined />}
                            style={{
                                insetInlineEnd: 36,
                            }}
                        >
                            <FloatButton
                                icon={<CheckOutlined />}
                                onClick={showDrawer}
                            />
                            <FloatButton
                                icon={<VerticalAlignBottomOutlined />}
                                onClick={showModal}
                            />
                            <FloatButton
                                icon={<RollbackOutlined />}
                                onClick={back}
                            />
                        </FloatButton.Group>
                    </>
            }
            <Drawer
                title="请输入Excel名称"
                placement={'right'}
                closable={false}
                onClose={onClose}
                open={open}
            >
                <Form validateTrigger='onChange'>
                    <Form.Item name={'excel'}
                        rules={[() => ({
                            validator(_, value) {
                                excelName.current = value
                                return Promise.resolve()
                            }
                        })]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
                <Space size={130} style={{ width: '100%' }}>
                    <Button onClick={add} type='primary' style={{ width: 100 }}>确认</Button>
                    <Button onClick={onClose} danger style={{ width: 100 }}>取消</Button>
                </Space>
            </Drawer>
            <Modal title="请输入下载 Excel 文件的名称：" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Form validateTrigger='onChange'>
                    <Form.Item name={'excel'}
                        rules={[() => ({
                            validator(_, value) {
                                ExportExcelName.current = value
                                return Promise.resolve()
                            }
                        })]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export const MemoAddExcel = memo(AddExcel)