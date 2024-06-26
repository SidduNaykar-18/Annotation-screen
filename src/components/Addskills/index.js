import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Select } from 'antd';
import { showNotification } from '../showNotification';
import { PROJECT_URL } from '../utils/constant';
import axios from 'axios';

const DataSetForm = ({ onCancel, onAdd, selected }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selected && selected.data && selected.data.skill) {
      form.setFieldsValue({
        technologyName: selected.data.skill,
      });
    }
  }, [selected, form]);

  const onFinish = async (values) => {
    const { technologyName, associatedSkills } = values;

    if (!technologyName) {
      showNotification('Error', 'Please enter the technology name.', 'error');
      return;
    }

    if (!associatedSkills || associatedSkills.length === 0) {
      showNotification('Error', 'Please enter at least one associated skill.', 'error');
      return;
    }

    const payload = {
      skill_name: technologyName,
      associated_skills: associatedSkills
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      setButtonLoading(true);
      const response = await axios.post(`${PROJECT_URL}/add_skill`, payload, { headers });
      console.log('API response:', response);
      setButtonLoading(false);
      showNotification('Success', 'Skill added successfully!', 'success');
      form.resetFields();
      onCancel();
      onAdd();
    } catch (error) {
      setButtonLoading(false);
      showNotification('Error', 'Failed to add skill. Please try again later.', 'error');
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="skillsForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete='false'
    >
      <div style={{ marginBottom: "20px" }}><h3>ADD SKILLS</h3></div>

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
        <Input size="large" placeholder="Enter Technology" maxLength={50}  autoComplete='off'/>
      </Form.Item>

      <Form.Item
        label="Associated Skills"
        name="associatedSkills"
        rules={[
          {
            required: true,
            message: "Please enter at least one associated skill!",
            type: 'array'
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
};

export default DataSetForm;
