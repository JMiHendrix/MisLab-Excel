import { memo, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Drawer, Form, Input, Space, Spin } from 'antd';
import { MemoSheet } from '@/components/UniverSheet';
import { useMessage } from '@/hooks/useMessage';
import { getExcelDetail } from '@/apis/excel';
import style from './index.module.css'

const Excel = () => {
    const param = useParams()
    const univerRef = useRef()
    const excelName = useRef('')
    const { success, error, contextHolder } = useMessage()
    const [data, setData] = useState(false);
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const getDetail = async (id = param.id) => {
        const res = await getExcelDetail(id)
        const { title, url, createTime, updateTime } = res.data
        setData(JSON.parse(url))
        excelName.current = title
        setTitle(title)
        setLoading(false)
    }
    useEffect(() => {
        try {
            getDetail(param.id)
        } catch (e) {

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
                    ? <Spin />
                    : <MemoSheet style={{ flex: 1 }} ref={univerRef} data={data} />
            }
        </>
    )
}

export const MemoExcel = memo(Excel)