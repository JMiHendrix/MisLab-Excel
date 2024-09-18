import { memo, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Drawer, Form, Input, Space, Spin } from 'antd';
import { MemoSheet } from '@/components/UniverSheet';
import { DEFAULT_WORKBOOK_DATA } from '@/assets/default-data'
import { getExcelDetail } from '@/apis/excel';

const Excel = () => {
    const param = useParams()
    const univerRef = useRef()
    const excelName = useRef('')
    const [data, setData] = useState(false);
    const [title, setTitle] = useState('')
    const navigate = useNavigate()
    const getDetail = async (id = param.id) => {
        const res = await getExcelDetail(id)
        const { title, url, createTime, updateTime } = res.data
        setData(JSON.parse(url))
        excelName.current = title
        setTitle(title)
    }
    useEffect(() => {
        getDetail(param.id)
    }, [])
    return (
        <>
            <MemoSheet style={{ flex: 1 }} ref={univerRef} data={data} />
        </>
    )
}

export const MemoExcel = memo(Excel)