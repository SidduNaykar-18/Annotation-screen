import React, { useState } from 'react';
import { Button, Input, Form, Select } from 'antd';
import '../Addskills/addskills.css';
import { showNotification } from '../showNotification';
import { PROJECT_URL } from '../utils/constant';
import axios from 'axios';

export default function DataSetForm({ onCancel, visible }) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log('Received values:', values);
    const { categoryName, technologyName, associatedSkills } = values;
    const payload = {
      category: categoryName,
      skill_name: technologyName,
      associated_skills: associatedSkills
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    
    

    try {
      if (payload) {
        setButtonLoading(true);
        const response = await axios.post(`${PROJECT_URL}/add_skill`, payload,{headers});
        console.log('API response:', response);
        setButtonLoading(false);
        showNotification('Success', 'Skill added successfully!', 'success');
        form.resetFields();
        onCancel(); // Close the modal
      }

    } catch (error) {
      // console.error('API error:', error);
      setButtonLoading(false);
      showNotification('Error', 'Failed to add skill. Please try again later.', 'error');
      form.resetFields();
      onCancel(); // Close the modal
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="skillsForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <div style={{ marginBottom: "20px" }}><h3>ADD SKILLS</h3></div>
      <Form.Item
        label="Category Name"
        name="categoryName"
        rules={[
          {
            required: false,
            message: "Please enter the category name!",
          }
        ]}
      >
        <Input size="large" placeholder="Enter Category" maxLength={50} />
      </Form.Item>

      <Form.Item
        label="Technology Name"
        name="technologyName"
        rules={[
          {
            required: true,
            message: "Please enter the technology name!",
          }
        ]}
      >
        <Input size="large" placeholder="Enter Technology" maxLength={50} />
      </Form.Item>

      <Form.Item
        label="Associated Skills"
        name="associatedSkills"
        rules={[
          {
            required: true,
            message: "Please enter the associated skills!",
          }
        ]}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Enter Skills"
          tokenSeparators={[',']}
        />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type='primary' style={{ marginRight: "15px" }} onClick={onCancel}>
          Cancel
        </Button>
        <Button type='primary' htmlType="submit" loading={buttonLoading}>
          {buttonLoading ? 'Adding Skill...' : 'Add Skills'}
        </Button>
      </Form.Item>
    </Form>

  );
}
