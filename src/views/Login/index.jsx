import { memo, useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../hooks/useMessage";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import BG from "../../utils/BG";
import style from "./index.module.css";
import { showMessage } from "@/store/modules/message";

const Login = () => {
    const { success, error, warn, contextHolder } = useMessage()
    const { message, type, visible } = useSelector(state => state.message)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await dispatch(fetchLogin(values));
            dispatch(showMessage({ message: '登录成功', type: 'success' }))
            navigate('/home')
        } catch (e) {
            error({
                content: '账号或密码错误！'
            })
        }
    };

    useEffect(() => {
        if (visible && message === '退出成功') {
            success({
                content: message
            })
        } else if (visible && type === 'warn') {
            warn({
                content: message
            })
        }
    }, [visible, message, type])

    return (
        <div>
            {contextHolder}
            <div className={style.login}>
                <Card className={style.loginCard}>
                    <div className={style.logo}></div>
                    <div className={style.logoAfter}></div>
                    <Form onFinish={onFinish} validateTrigger="onBlur">
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入账号",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                size="large"
                                placeholder="请输入账号"
                                className={style.logoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入密码",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                size="large"
                                placeholder="请输入密码"
                                className={style.logoInput}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            <BG />
        </div>
    );
};

export const MemoLogin = memo(Login);
