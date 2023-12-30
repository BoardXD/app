"use client";

import Link from "next/link";
import "./styles.css";

import { Divider, List, Typography } from "antd";
import { useState } from "react";

const { Text } = Typography;

export const Aside = () => {
  const [selectedLink, setSelectedLink] = useState("");

  const handleLinkClick = (linkName: string) => {
    setSelectedLink(linkName);
  };

  const createLinkItem = (href: string, text: string, linkName: string) => (
    <Link href={href} onClick={() => handleLinkClick(linkName)}>
      <Text className={selectedLink === linkName ? "selected" : ""}>
        {text}
      </Text>
    </Link>
  );

  const assignItems = [
    createLinkItem(
      "/assignments/departaments",
      "Departamentos",
      "departaments",
    ),
    createLinkItem("/assignments/cleaning", "Limpeza", "cleaning"),
    createLinkItem(
      "/assignments/fieldService",
      "Serviço de Campo",
      "fieldService",
    ),
    createLinkItem(
      "/assignments/midweekMeeting",
      "Meio de Semana",
      "midweekMeeting",
    ),
    createLinkItem("/assignments/weekMeeting", "Fim de Semana", "weekMeeting"),
  ];

  const personItems = [createLinkItem("/admin/persons", "Listar", "persons")];

  return (
    <>
      <Divider orientation="left">Designações</Divider>
      <List
        bordered
        dataSource={assignItems}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
      <Divider orientation="left">Estudantes</Divider>
      <List
        bordered
        dataSource={personItems}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </>
  );
};
