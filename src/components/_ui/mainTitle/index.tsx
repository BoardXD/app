"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Typography, Divider } from "antd";

export function MainTitle() {
  const [title, setTitle] = useState<string>();

  const pathName = usePathname();

  const handlerTitle = (path: string) => {
    switch (path) {
      case "departaments":
        return "Departamentos"
      case "cleaning":
        return "Limpeza";
      case "fieldService":
        return "Serviço de Campo";
      case "midweekMeeting":
        return "Nossa Vida e Ministério Cristão";
      case "weekMeeting":
        return "Finais de Semana";
      case "persons":
        return "Estudantes";
      default:
        "Designações";
    }
  };

  const setTitleOnPage = () => {
    const path = pathName.split("/").filter(Boolean)[1];
    const res = handlerTitle(path);
    if (res) setTitle(res);
  };

  useEffect(() => {
    setTitleOnPage();
  }, [pathName]);

  return (
    <>
      <Divider orientation="center">
        <Typography.Text strong>{title}</Typography.Text>
      </Divider>
    </>
  );
}
