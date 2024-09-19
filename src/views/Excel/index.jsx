import { memo, useRef, useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Drawer, Form, Input, Spin, FloatButton, Space, Modal } from 'antd';
import { RollbackOutlined, CheckOutlined, VerticalAlignBottomOutlined, UpOutlined } from '@ant-design/icons'
import { MemoSheet } from '@/components/UniverSheet';
import { useMessage } from '@/hooks/useMessage';
import { getExcelDetail, updateExcel } from '@/apis/excel';
import { convertToExcelFormat } from '@/utils';
import style from './index.module.css'

const Excel = () => {
    const param = useParams()
    const univerRef = useRef()
    const excelName = useRef('')
    const { success, error, contextHolder } = useMessage()
    const [data, setData] = useState(false);
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    // 初始化逻辑
    const getDetail = async (id = param.id) => {
        const res = await getExcelDetail(id)
        const { title, url, createTime, updateTime } = res.data
        setData(JSON.parse(url))
        excelName.current = title
        setTitle(title)
        setLoading(false)
    }
    const back = () => {
        if (param.folder === 'main') navigate('/home')
        else navigate(`/home/list/${param.folder}`)
    }
    // 更新逻辑
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const finishEdit = async () => {
        try {
            setBtnLoading(true)
            await updateExcel({
                title: excelName.current,
                url: JSON.stringify(data),
                id: param.id
            })
            success({
                content: '更新Excel成功！',
                callBack: () => {
                    setBtnLoading(false)
                    onClose()
                }
            })
        } catch (e) {
            error({
                content: '更新Excel失败',
                callBack: () => {
                    setBtnLoading(false)
                }
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
        Object.keys(data.sheets).forEach(sheetName => {
            const sheetData = data.sheets[sheetName].cellData;
            const excelFormat = convertToExcelFormat(sheetData);
            if (excelFormat['!ref'] === 'A1:\x00-Infinity') excelFormat['!ref'] = 'A1:A2'
            // console.log("format", excelFormat);
            XLSX.utils.book_append_sheet(workbook, excelFormat, data.sheets[sheetName].name);
        });
        XLSX.writeFile(workbook, `${ExportExcelName.current}.xlsx`, { compression: true });
    };
    useEffect(() => {
        try {
            getDetail(param.id)
        } catch (e) {
            error({
                content: 'Excel加载失败',
                callBack: () => setLoading(false)
            })
        }
        const saveExcel = setInterval(async () => {
            try {
                await updateExcel({
                    title: excelName.current,
                    url: JSON.stringify(univerRef.current?.getData()),
                    id: param.id
                })
            } catch (e) {
                error({
                    content: '实时更新失败，请尝试手动提交'
                })
            }
        }, 10000)
        return () => clearInterval(saveExcel);
    }, [])
    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                const toolbar = document.querySelector('.univer-toolbar');
                if (toolbar) {
                    toolbar.style.opacity = '1';
                }
            }, 500);
        }
    }, [loading]);
    return (
        <>
            {contextHolder}
            {
                loading
                    ? <Spin size='large' className={style.spin} />
                    : (
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
                    )
            }
            <Drawer
                title="请输入Excel名称"
                placement={'right'}
                closable={false}
                onClose={onClose}
                open={open}
            >
                <Form validateTrigger='onChange' initialValues={{ excel: title }}>
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
                    <Button onClick={finishEdit} type='primary' style={{ width: 100 }} loading={btnLoading}>确认</Button>
                    <Button onClick={onClose} danger style={{ width: 100 }}>取消</Button>
                </Space>
            </Drawer>
            <Modal title="请输入下载 Excel 文件的名称：" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Form validateTrigger='onChange' initialValues={{ excel: title }}>
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

export const MemoExcel = memo(Excel)