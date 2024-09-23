import { memo, useState, useRef, useEffect } from 'react'
import { theme, Layout, Form, Input, Spin, FloatButton } from 'antd'
import { HighlightOutlined, RollbackOutlined, CheckOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import ReactHtmlParser from 'react-html-parser';
import { useQuillTooBar } from '@/hooks/useQuillTooBar'
import { formatDate } from '@/utils';
import { useMessage } from '@/hooks/useMessage';
import { getContentDetail, editContent } from '@/apis/content';
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
    const [isLoading, setIsLoading] = useState(true)
    const title = useRef('')
    const author = useRef('')
    const time = useRef({})
    const navigate = useNavigate()
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
    const back = () => {
        if (param.folder === 'main') navigate('/home')
        else navigate(`/home/list/${param.folder}`)
    }
    const edit = async ({ title, author, content, id = param.id }) => {
        await editContent({ title, author, content, id })
        getDetail()
    }
    const ChangeIsEdit = async () => {
        if (isEdit) {
            try {
                await edit({
                    title: title.current,
                    author: author.current,
                    content: value,
                })
                success({
                    content: '文档更新成功！',
                    delayTime: 0
                })
            } catch (e) {
                error({
                    content: '文档更新失败'
                })
            }
        }
        setIsEdit(!isEdit)
    }
    const saveContent = async () => {
        try {
            await editContent({
                title: title.current,
                author: author.current,
                content: value,
                id: param.id
            });
        } catch (e) {
            error({
                content: '实时更新失败，请尝试手动提交'
            });
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getDetail();
                setIsLoading(false)
            } catch (e) {
                error({
                    content: '文档获取失败',
                    callBack: () => setIsLoading(false)
                });
            }
        };
        fetchData();
    }, [param.id])
    useEffect(() => {
        let intervalId;
        if (isEdit) {
            intervalId = setInterval(saveContent, 10000);
        }
        return () => clearInterval(intervalId);
    }, [isEdit]);

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
                        isLoading ? <Spin size='large' className={style.spin} /> :
                            (
                                isEdit ?
                                    <>
                                        <Form
                                            className={style.editBox}
                                            initialValues={{ title: title.current, author: author.current }}
                                            validateTrigger='onChange'
                                        >
                                            <Form.Item
                                                name='title'
                                                label='文章名称'
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
                                                label='文章作者'
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
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            className={style.contentEdit}
                                            modules={modules}
                                            formats={formats}
                                        />
                                    </>
                                    :
                                    <>
                                        {
                                            ReactHtmlParser(`
                                        <h1>${title.current}</h1>
                                        <h2>作者：${author.current}</h2>
                                        <h3>创建时间：${time.current.createTime}&nbsp;&nbsp;&nbsp;&nbsp;更新时间：${time.current.updateTime}</h3>
                                        `)
                                        }
                                        <div className='ql-container ql-snow' style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                            <div className='ql-editor'>
                                                {ReactHtmlParser(value)}
                                            </div>
                                        </div>
                                    </>

                            )
                    }
                </Content>
                <FloatButton.Group
                    shape="circle"
                    style={{
                        insetInlineEnd: 36,
                    }}
                >
                    <FloatButton
                        type="primary"
                        icon={isEdit ? <CheckOutlined /> : <HighlightOutlined />}
                        onClick={ChangeIsEdit}
                    />
                    <FloatButton
                        type="primary"
                        icon={<RollbackOutlined />}
                        onClick={back}
                    />
                </FloatButton.Group>
            </Layout >
        </>
    )
}

export const MemoContent = memo(Area)