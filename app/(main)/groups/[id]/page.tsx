"use client";

import React, { useEffect, useState } from "react";
import { Form, Card, message, Button, List, Avatar, Modal, Table } from "antd";
import { useTheme } from "../../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../../src/contexts/LanguageContext";
import { api } from 'src/services/api';
import { useParams, useRouter } from "next/navigation";
import { EditOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import Meta from 'antd/es/card/Meta';
interface DataType {
  key: React.Key;
  name: string;
}
const users = JSON.parse(localStorage.getItem('userList'))?.map(i => ({ ...i, key: i.id }))


export default function GroupDetailPage() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams();
  const [groupList, setGroupList] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groupDetails, setGroupDetails] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectRows, setSelectRows] = useState();

  const handleSubmit = async (value) => {
    api.groups.createGroup(value)
    message.success("创建成功！");
    router.push("/groups")
  };

  const handleGoToChat = () => {
    router.push(`/chat/group/${id}`)
  }

  const getGroupDetails = async () => {
    const res = await api.groups.getGroupDetails(String(id));
    const ids = res.members.map(i => i.user_id);
    const admin = res.members.filter(i => i.role === 'admin')
    const resp = await api.user.getUsersByIDs(ids);
    const members = resp.users.map(i => {
      if (i.id === admin.id) {
        return { ...id, role: 'admin' }
      }
      return { ...i }
    })

    setGroupList(members);
    setGroupDetails(res);
  }

  const addUserToGroup = async () => {
    const userIds = selectRows.map(i => i.id)
    const res = await api.groups.addMember(id, userIds)
    if (res.message === "All users successfully joined the group") {
      message.success('添加成功');
      getGroupDetails();
      setIsAdd(false)
    }
  }

  useEffect(() => {
    getGroupDetails();
  }, [])

  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectRows(selectedRows)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };


  return (
    <>
      <div style={{ padding: "60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card
          style={{
            width: 600,
            margin: "0 auto",
            backgroundColor: currentTheme.colors.secondaryBackground,
            border: `1px solid ${currentTheme.colors.border}`,
            marginBottom: "16px"
          }}
        >
          <Meta
            avatar={<Avatar size={40} icon={<TeamOutlined />} />}
            title={groupDetails?.group.name || ''}
          />
        </Card>
        <Card
          style={{
            width: 600,
            margin: "0 auto",
            backgroundColor: currentTheme.colors.secondaryBackground,
            border: `1px solid ${currentTheme.colors.border}`,
            marginBottom: "16px"
          }}
          title={t("groups.groupInformation")}

          extra={<EditOutlined key="edit" onClick={() => setIsEdit(true)} />}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label={t("groups.groupName")}
              rules={[
                {
                  required: true,
                  message: t("groups.groupNameRequired"),
                },
              ]}
            >
              {/* <Input size="large" /> */}
              {groupDetails?.group.name || ''}
            </Form.Item>

            <Form.Item name="description" label={t("groups.groupDescription")}>
              {/* <Input.TextArea
                rows={4}
                placeholder={t("groups.groupDescriptionPlaceholder")}
              /> */}
              {groupDetails?.group.description || ''}
            </Form.Item>
          </Form>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <span>{t("groups.member")}</span>
            <div>
              <Button type="text" onClick={() => setIsModalOpen(true)}>{t("groups.expand")}</Button>
              <PlusOutlined onClick={() => setIsAdd(true)} />
            </div>
          </div>
          <div style={{ marginBottom: "20px", display: "flex" }}>
            {groupList?.length < 16 ? groupList?.map((item) => <Avatar key={item.id} src={'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} />)
              : (groupList?.slice(0, 16).map((item) => <Avatar key={item.id} src={'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} />))
            }
            {
              groupList?.length > 16 && <div style={{ marginLeft: "4px" }}>...</div>
            }
          </div>
        </Card>
        <Button
          type="dashed"
          onClick={handleGoToChat}
          size="large"
          shape="circle"
          style={{ width: "80px", height: "80px" }}
        >
          {t("groups.goToChat")}
        </Button>
      </div>
      <Modal title="群成员" open={isModalOpen} footer="" onCancel={() => setIsModalOpen(false)}>
        <List
          style={{ height: "500px", overflow: "auto" }}
          itemLayout="horizontal"
          dataSource={groupList}
          renderItem={(item, index) => (
            <List.Item actions={[<Button key={index} onClick={() => console.log(item)}>删除</Button>]}>
              <List.Item.Meta
                avatar={<Avatar src={'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} />}
                title={<a href="https://ant.design">{item.username}</a>}
                description={item.role === 'admin' && '群主'}
              />
            </List.Item>
          )}
        />
      </Modal>
      <Modal title="添加群组成员" open={isAdd} onCancel={() => setIsAdd(false)} onOk={() => {
        addUserToGroup()
      }}
        footer={(_, { OkBtn }) => (
          <OkBtn />
        )}
      >
        <Table
          rowSelection={{ ...rowSelection }}
          columns={[
            {
              title: 'Name',
              dataIndex: 'username',
            }
          ]}
          dataSource={users || []}
        />
      </Modal>
    </>
  );
}
