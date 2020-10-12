import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
  Layout,
  Menu,
  Comment,
  Tooltip,
  Avatar,
  Input,
  Modal,
  Button,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import moment from "moment";
import client from "./feathers";

const { Content, Footer, Sider } = Layout;

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addMessage = async (text: string) => {
    await client.service("messages").create({
      text: text,
    });
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    (async () => {
      const messages = await client.service("messages").find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
        },
      });
      setMessages(messages);
    })();
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Modal
        title="Sign in"
        visible={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          style={{ marginBottom: "20px" }}
          type="email"
          placeholder="E-mail"
        />
        <Input type="password" placeholder="Password" />
      </Modal>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" selectable={false}>
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Sign in
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: "85vh" }}
          >
            <Comment
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <p>
                  We supply a series of design principles, practical patterns
                  and high quality design resources (Sketch and Axure), to help
                  people create their product prototypes beautifully and
                  efficiently.
                </p>
              }
              datetime={
                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
          </div>
          {isAuthenticated ? (
            <Input
              style={{ alignSelf: "bottom" }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onPressEnter={() => {
                addMessage(message);
              }}
              placeholder="Press enter to send"
            />
          ) : null}
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}

export default App;
