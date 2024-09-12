import { memo } from "react";
import { Card, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../hooks/useMessage";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import BG from "../../utils/BG";
import style from "./index.module.css";

const Login = () => {
    const { success, error, contextHolder } = useMessage()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await dispatch(fetchLogin(values));
            success({
                content: '登录成功！',
                callBack: () => navigate("/home"),
                delayTime: 0
            })
        } catch (e) {
            error({
                content: '账号或密码错误！'
            })
        }
    };

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
