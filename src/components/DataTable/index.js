import React, { useState, useEffect } from 'react';
import { GraphCanvas } from 'reagraph';
import axios from 'axios';
import { Modal, Spin, Empty, Layout, Button, Input } from 'antd';
import { PROJECT_URL } from '../utils/constant';
import DataSetForm from '../Addskills';

const { Header, Content } = Layout;

const DataTable = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${PROJECT_URL}/skills`);
      const skillsData = response.data;
      const { nodes, edges } = transformData(skillsData);
      setGraphData({ nodes, edges });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills data:', error);
      setLoading(false);
    }
  };

  const transformData = (skillsData) => {
    const nodes = [];
    const edges = [];

    skillsData.forEach((skill, index) => {
      const skillNode = {
        id: `n-${index + 1}`,
        label: skill.skill,
        data: skill,
        isSkillNode: true 
      };
      nodes.push(skillNode);

      skill.associated_skills.forEach((associatedSkill, subIndex) => {
        const subchildNode = {
          id: `n-${index + 1}-${subIndex + 1}`,
          label: associatedSkill,
          parent: skillNode.id,
          isSkillNode: false 
        };
        nodes.push(subchildNode);

        const edge = {
          id: `e-${index + 1}-${subIndex + 1}`,
          source: skillNode.id,
          target: subchildNode.id,
          label: `Associated with ${associatedSkill}`
        };
        edges.push(edge);
      });
    });

    return { nodes, edges };
  };

  const handleNodeClick = (node) => {
    const clickedNode = graphData.nodes.find(n => n.id === node.id);
    if (clickedNode) {
      setSelectedNode(clickedNode);
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleAddSkillsClick = () => {
    setModalVisible(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filterNodesAndEdges = () => {
    const filteredNodes = graphData.nodes.filter(node =>
      node.label.toLowerCase().includes(searchTerm) || 
      (
        graphData.nodes.some(parentNode =>
          parentNode.id === node.parent &&
          parentNode.isSkillNode && 
          parentNode.label.toLowerCase().includes(searchTerm)
        )
      )
    );

    const filteredEdges = graphData.edges.filter(edge =>
      filteredNodes.some(node =>
        edge.source === node.id || edge.target === node.id
      )
    );

    return { nodes: filteredNodes, edges: filteredEdges };
  };

  const { nodes: filteredNodes, edges: filteredEdges } = filterNodesAndEdges();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={headerStyle}>
        <div style={headerRightStyle}>
          <Input.Search
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={searchStyle}
          />
          <Button type="primary" onClick={handleAddSkillsClick} style={addButtonStyle}>Add Skills</Button>
        </div>
      </Header>
      <Content style={contentStyle}>
        {loading ? (
          <div style={loadingStyle}>
            <Spin size="large" />
            <p>Loading skills data...</p>
          </div>
        ) : filteredNodes.length > 0 ? (
          <GraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodeClick={handleNodeClick}
          
          />
        ) : (
          <div style={emptyStyle}>
            <Empty description="No skills found" />
          </div>
        )}

        <Modal
          title={selectedNode ? selectedNode.label : ''}
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={650}
        >
          <DataSetForm onCancel={handleModalClose} onAdd={fetchData} selected={selectedNode} />
        </Modal>
      </Content>
    </Layout>
  );
};

const headerStyle = {
  backgroundColor: '#001529',
  padding: '0 20px',
  zIndex: 1,
  width: '100%',
  position: 'fixed',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center'
};

const headerRightStyle = {
  display: 'flex',
  alignItems: 'center'
};

const searchStyle = {
  width: '300px',
  height: 'auto',
  borderRadius: '50px',
  marginRight: '20px'
};

const addButtonStyle = {
  marginLeft: '20px'
};

const contentStyle = {
  marginTop: '64px',
  padding: '20px'
};

const loadingStyle = {
  textAlign: 'center',
  marginTop: '20px'
};

const emptyStyle = {
  textAlign: 'center',
  marginTop: '20px'
};

export default DataTable;
