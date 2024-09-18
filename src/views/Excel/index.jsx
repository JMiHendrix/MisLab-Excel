import { memo, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Drawer, Form, Input, Spin, FloatButton, Space } from 'antd';
import { RollbackOutlined, CheckOutlined, VerticalAlignBottomOutlined, UpOutlined } from '@ant-design/icons'
import { MemoSheet } from '@/components/UniverSheet';
import { useMessage } from '@/hooks/useMessage';
import { getExcelDetail, updateExcel } from '@/apis/excel';
import style from './index.module.css'

const Excel = () => {
    const param = useParams()
    const univerRef = useRef()
    const excelName = useRef('')
    const { success, error, contextHolder } = useMessage()
    const [data, setData] = useState(false);
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
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
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const finishEdit = async () => {
        try {
            await updateExcel({
                title: excelName.current,
                url: JSON.stringify(data),
                id: param.id
            })
            success({
                content: '更新Excel成功！',
                callBack: onClose()
            })
        } catch (e) {
            error({
                content: '更新Excel失败'
            })
        }
    }
    useEffect(() => {
        try {
            getDetail(param.id)
        } catch (e) {
            error({
                content: 'Excel加载失败',
                callBack: () => setLoading(false)
            })
        }
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
                                // onClick={back}
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
                    <Button onClick={finishEdit} type='primary' style={{ width: 100 }}>确认</Button>
                    <Button onClick={onClose} danger style={{ width: 100 }}>取消</Button>
                </Space>
            </Drawer>
        </>
    )
}

export const MemoExcel = memo(Excel)