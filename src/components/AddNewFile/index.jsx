import { memo } from 'react'
import { Dropdown, Button } from 'antd';
import { DownOutlined, FileAddOutlined, FileExcelOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import style from './index.module.css'

const AddNewFile = () => {
    const handleMenuClick = (e) => {
        console.log('click', e);
    };
    const items = [
        {
            label: '在线文档',
            key: '1',
            icon: <FileMarkdownOutlined />
        },
        {
            label: '在线Excel',
            key: '2',
            icon: <FileExcelOutlined />
        }
    ]

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <Dropdown menu={menuProps} className={style.box}>
                <Button>
                    <FileAddOutlined className={style.firIcon} />
                    新建
                    <DownOutlined className={style.secIcon} />
                </Button>
        </Dropdown>
    )
}

export const MemoAddNewFile = memo(AddNewFile)