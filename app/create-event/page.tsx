'use client'

import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { PlusOutlined } from '@ant-design/icons'
import { firestore, storage } from '../services/FirebaseService'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Layout,
  message,
  Upload,
} from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import type { Dayjs } from 'dayjs'
const { Content } = Layout
const { TextArea } = Input

export default function CreateEvent() {
  const [messageApi] = message.useMessage()

  type FormValues = {
    name: string
    location_name: string
    description: string
    files: UploadFile[]
    date: Dayjs
    address: string
    image_url: string
  }

  type EventModel = {
    name: string
    location_name: string
    description: string
    date: Timestamp
    address: string
    image_url: string
  }

  const [form] = Form.useForm()

  const onFinish = async (values: FormValues) => {
    const eventModel: EventModel = {
      name: values.name,
      location_name: values.location_name,
      description: values.description,
      date: Timestamp.fromDate(values.date?.toDate() ?? new Date()),
      address: values.address,
      image_url: values.files[0].response,
    }
    try {
      await addDoc(collection(firestore, 'events'), eventModel)
      messageApi.open({
        type: 'success',
        content: 'Event created!',
      })
      form.resetFields()
    } catch {
      onFinishFailed()
    }
  }

  const onFinishFailed = () => {
    messageApi.open({
      type: 'error',
      content: 'Error creating event',
    })
  }

  const customUpload = async (options: RcCustomRequestOptions) => {
    const file = options.file as File
    const storageRef = ref(storage, `pictures/${file.name}`)
    try {
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      options.onSuccess?.(downloadURL, new XMLHttpRequest())
    } catch (e: unknown) {
      options.onError?.(e as Error)
    }
  }

  return (
    <Layout>
      <Content className="flex flex-col items-center justify-center h-screen">
        <Card title="Crear evento" className="w-1/3 shadow-lg text-center">
          <Form
            name="createEvent"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Location"
              name="location_name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
            <Form.Item
              label="Start time"
              name="date"
              rules={[{ required: true }]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Upload picture"
              name="files"
              valuePropName="fileList"
            >
              <Upload customRequest={customUpload} listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}
