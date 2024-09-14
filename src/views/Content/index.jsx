import { memo, useState, useRef, useEffect } from 'react'
import { theme, Layout, Form, Input, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import ReactHtmlParser from 'react-html-parser';
import { useQuillTooBar } from '@/hooks/useQuillTooBar'
import { formatDate } from '@/utils';
import { useMessage } from '@/hooks/useMessage';
import { getContentDetail } from '@/apis/content';
import 'react-quill/dist/quill.snow.css'
import style from './index.module.css'

const { Content } = Layout
const Area = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const param = useParams()
    const { success, error, contextHolder } = useMessage()
    const { modules, formats } = useQuillTooBar()
    const [value, setValue] = useState(``)
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const title = useRef('')
    const author = useRef('')
    const time = useRef({})
    const getDetail = async (id = param.id) => {
        const res = await getContentDetail(id)
        const detail = res.data
        title.current = detail.title
        author.current = detail.author
        time.current = {
            createTime: formatDate(detail.createTime),
            updateTime: formatDate(detail.updateTime)
        }
        setValue(detail.content)
    }
    useEffect(() => {
        try {
            getDetail()
            success({
                content: '论文获取成功',
                callBack: setIsLoading(true)
            })
        } catch (e) {
            error({
                content: '论文获取失败',
                callBack: setIsLoading(true)
            })
        }
    }, [])
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
                        isLoading ?
                            (isEdit ?
                                <Form
                                    className={style.editBox}
                                    initialValues={{ title: title.current, author: author.current }}
                                    validateTrigger='onChange'
                                >
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
                                        <Input size='large' style={{ width: '90%' }}></Input>
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
                                        <Input size='large' style={{ width: '90%' }}></Input>
                                    </Form.Item>
                                </Form >
                                :
                                ReactHtmlParser(`
                                    <h1>${title.current}</h1>
                                    <h2>作者：${author.current}</h2>
                                    <h3>创建时间：${time.current.createTime}&nbsp;&nbsp;&nbsp;&nbsp;更新时间：${time.current.updateTime}</h3>
                                    `)
                            )
                            : <Spin size='large' className={style.spin} />
                    }
                    {
                        isEdit ?
                            <ReactQuill
                                theme="snow"
                                value={value}
                                onChange={setValue}
                                className={style.contentEdit}
                                modules={modules}
                                formats={formats}
                            />
                            :
                            <div className='ql-container ql-snow' style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                <div className='ql-editor'>
                                    {ReactHtmlParser(value)}
                                </div>
                            </div>
                    }
                </Content>
            </Layout >
        </>
    )
}

export const MemoContent = memo(Area)