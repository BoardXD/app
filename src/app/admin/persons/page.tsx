"use client";

import React, { useState } from "react";

import { FaEdit } from "react-icons/fa";
import {
  Button,
  Row,
  Col,
  Space,
  Table,
  Tag,
  Switch,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import { usePersonManager } from "@/hooks/usePersonManager";
import { ROLES_COLORS } from "@/consts/colors";
import { ROLES, RolesDefault } from "@/consts/roles";
import Search from "antd/es/input/Search";

interface DataType {
  key: number;
  name: string;
  roles: RolesDefault[];
  active: number;
}

type FieldType = {
  firstName?: string;
  lastName?: string;
  gender: number;
  roles?: string;
};

const renderRoles = (roles: RolesDefault[]) =>
  roles.map((role) => {
    const color = ROLES_COLORS[role];
    return (
      <Tag color={color} key={role}>
        {role?.toLocaleUpperCase()}
      </Tag>
    );
  });
const columns: ColumnsType<DataType> = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Sexo",
    dataIndex: "gender",
    key: "gender",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Funções",
    dataIndex: "roles",
    key: "roles",
    render: (_, { roles }) => <>{renderRoles(roles)}</>,
  },
  {
    title: "Status",
    dataIndex: "active",
    key: "active",
    render: (_, { active }) => <>{!!active ? "Inativo" : "Ativo"}</>,
  },
  {
    title: "Ações",
    dataIndex: "active",
    key: "name",
    render: (_, text) => (
      <Space size="middle">
        <a>
          <FaEdit />
        </a>
        <a>
          <Switch size="small" defaultChecked={!!text} />
        </a>
      </Space>
    ),
  },
];

export default function Page(): JSX.Element {
  const { persons, searchTerm, setSearchTerm } = usePersonManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredPersons = persons.filter((person) =>
    `${person.firstName} ${person.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Row style={{ marginBottom: 50 }}>
        <Col flex={"auto"}>
          <Search
            size="large"
            placeholder="Digite o nome o estudante..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col flex={"100px"}>
          <Button
            type="primary"
            onClick={showModal}
            style={{ alignSelf: "center", margin: 5 }}
          >
            Adicionar
          </Button>
          <Modal
            title="Adicionar Estudante"
            open={isModalOpen}
            onOk={handleOk}
            okText="Salvar"
            onCancel={handleCancel}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Nome"
                name="firstName"
                rules={[{ required: true, message: "Campo obrigatório!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Sobrenome"
                name="lastName"
                rules={[{ required: true, message: "Campo obrigatório!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Sexo"
                name="gender"
                rules={[{ required: true, message: "Campo obrigatório!" }]}
              >
                <Select
                  options={[
                    {
                      value: "M",
                      label: "Masculino",
                    },
                    {
                      value: "F",
                      label: "Feminino",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item<FieldType> name="roles">
                <Select
                  mode="tags"
                  size={"middle"}
                  placeholder="Please select"
                  defaultValue={[ROLES[5]]}
                  // onChange={handleChange}
                  style={{ width: "100%" }}
                  options={Object.entries(ROLES).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>
      <Table
        columns={columns as any}
        dataSource={filteredPersons}
        size="small"
      />
    </>
  );
}

function mockData() {
  return;
}
