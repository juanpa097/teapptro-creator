'use client';

import React from "react";
import { Button, DatePicker, Layout, Space, version, } from "antd";
import { Typography } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

const { Title, Text } = Typography;

export default function Home() {
  return (
    <main>
      <Layout>
        <Content className="flex flex-col items-center justify-center h-screen">
          <Title level={2} className="m-0">Bienvenido a Teapptro!</Title>
          <Text className="mb-3 w-1/3 text-center">Descubre una nueva forma de sumergirte en el mundo del teatro: ¡crea tus propios eventos, compártelos con tus amigos y vive experiencias teatrales inolvidables!</Text>
          <div>
          <Button type="primary">Crear evento</Button>
          </div>
      </Content>
      </Layout>
    </main>
  )
}
