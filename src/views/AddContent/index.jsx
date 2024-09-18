import { memo, useState, useRef } from 'react'
import { theme, Layout, Form, Input, FloatButton, Spin } from 'antd'
import { RollbackOutlined, CheckOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import { useQuillTooBar } from '@/hooks/useQuillTooBar'
import { useMessage } from '@/hooks/useMessage';
import { addContent } from '@/apis/content';
import 'react-quill/dist/quill.snow.css'
import style from './index.module.css'

const { Content } = Layout

const AddContent = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate()
    const param = useParams()
    const { error, contextHolder } = useMessage()
    const { modules, formats } = useQuillTooBar()
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const title = useRef('')
    const author = useRef('')
    const add = async () => {
        try {
            setLoading(true)
            let folder = ''
            if (param.folder !== 'main') folder = param.folder
            await addContent({
                title: title.current,
                author: author.current,
                content: value,
                folderId: folder
            })
            if (param.folder === 'main') navigate('/home')
            else navigate(`/home/list/${param.folder}`)
        } catch (e) {
            error({
                content: '添加论文失败',
                callBack: () => setLoading(false)
            })
        }
    }
    const back = () => {
        if (param.folder === 'main') navigate('/home')
        else navigate(`/home/list/${param.folder}`)
    }
    return (
        <>
            {contextHolder}
            <Layout
                style={{
                    padding: '24px',
                    height: '100vh'
                }}
            >
                <Content
                    style={{
                        paddingLeft: 24,
                        paddingRight: 24,
                        paddingBottom: 24,
                        paddingTop: 6,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {
                        !loading ?
                            <>
                                <Form className={style.editBox} validateTrigger='onChange'>
                                    <Form.Item
                                        name='title'
                                        label='论文名称'
                                        rules={[() => ({
                                            validator(_, value) {
                                                title.current = value
                                                return Promise.resolve()
                                            }
                                        })]}
                                    >
                                        <Input size='large' style={{ width: '100%' }}></Input>
                                    </Form.Item>
                                    <Form.Item
                                        name='author'
                                        label='论文作者'
                                        rules={[() => ({
                                            validator(_, value) {
                                                author.current = value
                                                return Promise.resolve()
                                            }
                                        })]}
                                    >
                                        <Input size='large' style={{ width: '100%' }}></Input>
                                    </Form.Item>
                                </Form >
                                <ReactQuill theme="snow" className={style.contentEdit} value={value} onChange={setValue} modules={modules} formats={formats} />
                                <FloatButton.Group
                                    shape="circle"
                                    style={{
                                        insetInlineEnd: 36,
                                    }}
                                >
                                    <FloatButton
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={add}
                                    />
                                    <FloatButton
                                        type="primary"
                                        icon={<RollbackOutlined />}
                                        onClick={back}
                                    />
                                </FloatButton.Group>
                            </>
                            : <Spin size='large' className={style.spin} />
                    }
                </Content>
            </Layout>
        </>
    )
}

export const MemoAddContent = memo(AddContent)