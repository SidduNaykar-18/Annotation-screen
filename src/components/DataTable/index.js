import React, { useEffect, useState } from 'react';
import { Button, Layout, Modal, Table, Spin, Empty } from 'antd';
import DataSetForm from '../Addskills';
import axios from 'axios';
import { PROJECT_URL } from '../utils/constant';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${PROJECT_URL}/skills`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
      });
      console.log('Skills API response:', response.data);

      const processedData = response?.data?.map(skill => ({
        ...skill,
        associated_skills: skill?.associated_skills?.map(skillName => ({ name: skillName }))
      }));

      setData(processedData);
      setLoading(false);
    } catch (error) {
      setLoading(false); 
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddSkills = async () => {
    setIsModalVisible(false); 
    await fetchData(); 
  };

  const columns = [
    {
      title: <span style={{ color: '#1890ff' }}>Sno</span>,
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: <span style={{ color: '#1890ff' }}>Category</span>,
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: <span style={{ color: '#1890ff' }}>Skill Name</span>,
      dataIndex: 'skill',
      key: 'skill',
    },
    {
      title: <span style={{ color: '#1890ff' }}>Associated Skills</span>,
      dataIndex: 'associated_skills',
      key: 'associated_skills',
      render: associatedSkills => (
        <ul>
          {associatedSkills && associatedSkills.map(skill => (
            <li key={skill.name}>{skill.name}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Layout>
      <Layout.Header style={{ backgroundColor: '#001529', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>Skills From Database</h2>
        <div>
          <Button type="primary" onClick={handleOpenModal}> Add Skills</Button>
        </div>
      </Layout.Header>
      <Layout.Content>
        <div style={{ border: '1px solid black', padding: '10px', overflowY: 'scroll', maxHeight: '600px', scrollbarWidth: 'thin' }}>
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin size="large" />
            </div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Empty description="No skills Found" />
            </div>
          ) : (
            <Table dataSource={data} columns={columns} bordered={true} headerClassName="custom-header" bodyStyle={{ fontSize: '16px', backgroundColor: '#f0f2f5' }} />
          )}
        </div>
      </Layout.Content>
      <Modal
        visible={isModalVisible}
        width={500}
        onCancel={handleCloseModal}
        footer={null}
        style={{ maxWidth: '80%', minHeight: '400px' }}
      >
        <DataSetForm onCancel={handleCloseModal} onAdd={handleAddSkills} />
      </Modal>
    </Layout>
  );
};

export default DataTable;
