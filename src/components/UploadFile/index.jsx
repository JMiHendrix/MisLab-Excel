import { useMemo } from 'react'
import { Button, Upload } from 'antd'
import { CloudUploadOutlined, SelectOutlined } from '@ant-design/icons'
import style from './index.module.css'

export const UploadFile = ({ value, onChange, beforeUpload = () => false, maxCount = 1 }) => {
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

    return <Upload
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        maxCount={maxCount}
        className={style.box}
    >
            <Button type='default'>
                <CloudUploadOutlined className={style.firIcon} />
                上传Word
                <SelectOutlined className={style.secIcon} />
            </Button>
    </Upload>
}