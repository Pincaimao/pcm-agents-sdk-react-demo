import React, { useState } from 'react';
import {
  PcmJlppModal,
  PcmMnmsModal,
  PcmQgqjlModal,
  PcmZyghModal,
} from 'pcm-agents-react';
import './App.css';

function App() {
  // 模态框状态
  const [mnmsModalOpen, setMnmsModalOpen] = useState(false);
  const [jlppModalOpen, setJlppModalOpen] = useState(false);
  const [qgqjlModalOpen, setQgqjlModalOpen] = useState(false);
  const [zyghModalOpen, setZyghModalOpen] = useState(false);
  
  // 模拟token
  const [token] = useState('mock_token_12345');
  
  // 自定义输入参数
  const customInputs = {
    file_url: '/resources/file/20250416/d258f91a1ff6061822f00b4e245dbd00.pdf',
    file_name: 'test.pdf',
    job_info: '职位：前端开发工程师，部门：技术部，薪资：15K-25K，学历要求：本科，经验要求：3年以上'
  };

  // 工具配置
  const tools = [
    {
      name: '模拟面试',
      key: 'mnms',
      color: '#1890ff',
      onClick: () => setMnmsModalOpen(true)
    },
    {
      name: '简历匹配诊断',
      key: 'jlpp', 
      color: '#52c41a',
      onClick: () => setJlppModalOpen(true)
    },
    {
      name: '千岗千简历',
      key: 'qgqjl',
      color: '#fa8c16', 
      onClick: () => setQgqjlModalOpen(true)
    },
    {
      name: '职业规划助手',
      key: 'zygh',
      color: '#722ed1',
      onClick: () => setZyghModalOpen(true)
    }
  ];

  // 消息提示函数
  const showMessage = (message, type = 'info') => {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 3秒后移除
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  };

  // 回调事件处理函数
  const handleStartConversation = (e) => {
    const { conversation_id } = e.detail;
    console.log('对话开始，conversation_id:', conversation_id);
    showMessage(`对话已开始: ${conversation_id}`, 'success');
  };

  const handleTokenInvalid = () => {
    console.log('Token验证失败，需要重新获取');
    showMessage('Token验证失败，请重新获取授权', 'error');
  };

  const handleModalClosed = (toolName) => {
    console.log(`${toolName} 模态框已关闭`);
    showMessage(`${toolName} 已关闭`, 'info');
  };

  return (
    <div className="app-container">
      <div className="demo-content">
        <h2>PCM Agents React 组件集成演示</h2>
        <p className="subtitle">点击下方按钮体验不同的AI工具</p>
        
        <div className="card tools-card">
          <h3>AI助手工具</h3>
          <div className="tools-grid">
            {tools.map(tool => (
              <button
                key={tool.key}
                className="tool-button"
                style={{ backgroundColor: tool.color }}
                onClick={tool.onClick}
              >
                🤖 {tool.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card info-card">
          <h3>当前配置</h3>
          <div className="config-info">
            <div>
              <strong>Token: </strong>
              <code>{token}</code>
            </div>
            <div>
              <strong>简历文件: </strong>
              <span>{customInputs.file_name}</span>
            </div>
            <div>
              <strong>职位信息: </strong>
              <span>{customInputs.job_info}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 模拟面试组件 */}
      <PcmMnmsModal
        modalTitle="模拟面试"
        token={token}
        icon="https://pub.pincaimao.com/static/common/i_pcm_logo.png"
        isOpen={mnmsModalOpen}
        interviewMode="text"
        filePreviewMode="drawer"
        onConversationStart={handleStartConversation}
        onTokenInvalid={handleTokenInvalid}
        onModalClosed={() => {
          setMnmsModalOpen(false);
          handleModalClosed('模拟面试');
        }}
      />

      {/* 简历匹配诊断组件 */}
      <PcmJlppModal
        modalTitle="简历匹配助手"
        token={token}
        icon="https://pub.pincaimao.com/static/common/i_pcm_logo.png"
        isOpen={jlppModalOpen}
        filePreviewMode="drawer"
        customInputs={customInputs}
        onConversationStart={handleStartConversation}
        onTokenInvalid={handleTokenInvalid}
        onModalClosed={() => {
          setJlppModalOpen(false);
          handleModalClosed('简历匹配诊断');
        }}
      />

      {/* 千岗千简历组件 */}
      <PcmQgqjlModal
        modalTitle="千岗千简历"
        token={token}
        icon="https://pub.pincaimao.com/static/common/i_pcm_logo.png"
        isOpen={qgqjlModalOpen}
        filePreviewMode="drawer"
        onConversationStart={handleStartConversation}
        onTokenInvalid={handleTokenInvalid}
        onModalClosed={() => {
          setQgqjlModalOpen(false);
          handleModalClosed('千岗千简历');
        }}
      />

      {/* 职业规划助手组件 */}
      <PcmZyghModal
        modalTitle="职业规划助手"
        token={token}
        icon="https://pub.pincaimao.com/static/common/i_pcm_logo.png"
        isOpen={zyghModalOpen}
        filePreviewMode="drawer"
        onConversationStart={handleStartConversation}
        onTokenInvalid={handleTokenInvalid}
        onModalClosed={() => {
          setZyghModalOpen(false);
          handleModalClosed('职业规划助手');
        }}
      />
    </div>
  );
}

export default App;
