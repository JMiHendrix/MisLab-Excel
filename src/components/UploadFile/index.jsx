import { useMemo, useState } from 'react'
import { Button, Upload, Result } from 'antd'
import { CloudUploadOutlined, SelectOutlined, LoadingOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useMessage } from '@/hooks/useMessage'
import { uploadFile } from '@/apis/file'
import style from './index.module.css'

export const UploadFile = ({ value, onChange, maxCount = 1 }) => {
    const { success, error, contextHolder } = useMessage()
    const param = useParams()
    const [loading, setLoading] = useState(true)
    const beforeUpload = async (file) => {
        let id = ''
        if (param.id !== undefined) id = param.id
        try {
            await uploadFile({ id, file });
            onChange?.(file); // 成功上传后，触发父组件的回调
            success({
                content: '上传文件成功'
            })
        } catch (e) {
            error({
                content: '上传文件失败'
            })
        }
        return false; // 阻止默认上传行为
    };

    const handleChange = ({ file }) => {
        if (file && file.status !== 'removed') {
            onChange?.(file)
        } else {
            onChange?.(undefined)
        }
    }

    const fileList = useMemo(() => {
        if (value && value.status !== 'removed') {
            return [value]
        }
        return undefined
    }, [])

    return (
        <>
            {contextHolder}
            <Upload
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                maxCount={maxCount}
                showUploadList={false}
                className={style.box}
            >
                <Button type='default'>
                    <CloudUploadOutlined className={style.firIcon} />
                    上传文件
                    <SelectOutlined className={style.secIcon} />
                </Button>
            </Upload>
            {
                loading ?
                    <Result
                        icon={<LoadingOutlined />}
                        title='系统正在上传文件，请稍等'
                        status={success}
                        className={style.result}
                    />
                    : <></>
            }
        </>
    )
}