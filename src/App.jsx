import React, { useState, useCallback, useEffect } from 'react';
import {
  PcmJlppModal,
  PcmMnmsModal,
  PcmQgqjlModal,
  PcmZyghModal,
} from 'pcm-agents-react';
import './App.css';

function App() {
  // Token 相关状态
  const [token, setToken] = useState('');
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [tokenRetryCount, setTokenRetryCount] = useState(0);

  // 模态框状态
  const [mnmsModalOpen, setMnmsModalOpen] = useState(false);
  const [jlppModalOpen, setJlppModalOpen] = useState(false);
  const [qgqjlModalOpen, setQgqjlModalOpen] = useState(false);
  const [zyghModalOpen, setZyghModalOpen] = useState(false);

  // 自定义输入参数
  const customInputs = {
    file_url: '/resources/file/20250418/590671879d5bf4b6ffe045664ff59ec7.pdf',
    file_name: '陈静- JAVA.pdf',
    job_info: '职位：前端开发工程师，部门：技术部，薪资：15K-25K，学历要求：本科，经验要求：3年以上'
  };

  // 获取 Token 的函数
  const fetchToken = useCallback(async (forceRefresh = false) => {
    try {
      setIsTokenLoading(true);
      
      // 如果不是强制刷新，先从缓存中获取 token
      if (!forceRefresh) {
        const cachedTokenData = localStorage.getItem("sdk_token");

        if (cachedTokenData) {
          const tokenData = JSON.parse(cachedTokenData);
          const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
          const expireTime = parseInt(tokenData.time_expire);

          // 如果 token 未过期且距离过期时间超过30分钟，直接使用缓存的 token
          const thirtyMinutesInSeconds = 30 * 60;
          if (
            expireTime > currentTime &&
            expireTime - currentTime > thirtyMinutesInSeconds
          ) {
            console.log("使用缓存的 token");
            setToken(tokenData.token);
            return tokenData.token;
          }

          console.log("token 即将过期（剩余不足30分钟），重新获取");
        }
      } else {
        console.log("强制刷新 token");
      }

      // 缓存不存在、已过期或强制刷新，重新获取 token
      const response = await fetch(
        "https://api.pincaimao.com/agents/platform/sys/sdk/access-token",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Ilx1ODA1OFx1NjI0ZFx1NzMyYjAyMzgiLCJ1aWQiOjM1NzY5MTA0OTM3Nzc5MjAwLCJleHAiOjE3ODQxMDk2MjJ9.8q3-eDZdtkZL6XIIZsPd_IsQK-Ov6q6yKE0iJTIO18k",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      console.log("获取token响应:", res);

      if (res && res.data) {
        const tokenData = res.data;
        // 保存到缓存
        localStorage.setItem("sdk_token", JSON.stringify(tokenData));
        setToken(tokenData.token);
        showMessage("Token获取成功", "success");
        return tokenData.token;
      }

      throw new Error("获取token失败：响应数据格式错误");
    } catch (error) {
      console.error("获取 token 失败:", error);
      showMessage("获取Token失败，请稍后重试", "error");
      return "";
    } finally {
      setIsTokenLoading(false);
    }
  }, []);

  // 初始化获取 Token
  const initToken = useCallback(async () => {
    try {
      const accessToken = await fetchToken();
      if (!accessToken) {
        console.error("获取 token 失败");
      }
    } catch (error) {
      console.error("初始化 token 失败:", error);
    }
  }, [fetchToken]);

  // 处理 token 验证失败
  const handleTokenInvalid = useCallback(async () => {
    console.log("SDK密钥验证失败，重新获取token");

    // 如果已经尝试了不再尝试
    if (tokenRetryCount >= 1) {
      console.error("已尝试重新获取token两次，仍然失败");
      setToken("");
      showMessage('Token验证失败，请手动重新获取授权', 'error');
      return;
    }

    // 增加尝试次数
    setTokenRetryCount((prevCount) => prevCount + 1);

    // 强制刷新 token
    const newToken = await fetchToken(true);
    if (newToken) {
      setToken(newToken);
      showMessage('Token已自动更新', 'success');
    } else {
      console.error("重新获取 token 失败");
      showMessage('Token更新失败，请手动重新获取', 'error');
    }
  }, [fetchToken, tokenRetryCount]);

  // 组件挂载时获取 token
  useEffect(() => {
    initToken();
  }, [initToken]);

  // 工具配置
  const tools = [
    {
      name: '模拟面试',
      key: 'mnms',
      color: '#1890ff',
      onClick: () => {
        if (!token) {
          showMessage('Token尚未获取，请稍后重试', 'warning');
          return;
        }
        setMnmsModalOpen(true);
      }
    },
    {
      name: '简历匹配诊断',
      key: 'jlpp', 
      color: '#52c41a',
      onClick: () => {
        if (!token) {
          showMessage('Token尚未获取，请稍后重试', 'warning');
          return;
        }
        setJlppModalOpen(true);
      }
    },
    {
      name: '千岗千简历',
      key: 'qgqjl',
      color: '#fa8c16', 
      onClick: () => {
        if (!token) {
          showMessage('Token尚未获取，请稍后重试', 'warning');
          return;
        }
        setQgqjlModalOpen(true);
      }
    },
    {
      name: '职业规划助手',
      key: 'zygh',
      color: '#722ed1',
      onClick: () => {
        if (!token) {
          showMessage('Token尚未获取，请稍后重试', 'warning');
          return;
        }
        setZyghModalOpen(true);
      }
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

  const handleModalClosed = (toolName) => {
    console.log(`${toolName} 模态框已关闭`);
    showMessage(`${toolName} 已关闭`, 'info');
  };

  return (
    <div className="app-container">
      <div className="demo-content">
        <h2>PCM Agents React 组件集成演示</h2>
        <p className="subtitle">点击下方按钮体验不同的AI工具</p>

        {/* Token 状态显示 */}
        <div className="card token-status-card">
          <h3>Token 状态</h3>
          <div className="token-status">
            {isTokenLoading ? (
              <p className="token-loading">⏳ 正在获取 Token...</p>
            ) : token ? (
              <p className="token-success">✅ Token 获取成功</p>
            ) : (
              <p className="token-error">❌ Token 获取失败</p>
            )}
            <div className="token-actions">
              <button 
                className="token-refresh-btn"
                onClick={() => initToken()}
                disabled={isTokenLoading}
              >
                {isTokenLoading ? "获取中..." : "重新获取Token"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="card tools-card">
          <h3>AI助手工具</h3>
          <div className="tools-grid">
            {tools.map(tool => (
              <button
                key={tool.key}
                className="tool-button"
                style={{ backgroundColor: tool.color }}
                onClick={tool.onClick}
                disabled={!token || isTokenLoading}
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
              <strong>Token状态: </strong>
              <code>{token ? '已获取' : '未获取'}</code>
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
      {token && (
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
      )}

      {/* 简历匹配诊断组件 */}
      {token && (
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
      )}

      {/* 千岗千简历组件 */}
      {token && (
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
      )}

      {/* 职业规划助手组件 */}
      {token && (
        <PcmZyghModal
          modalTitle="职业规划助手"
          token={token}
          icon="https://pub.pincaimao.com/static/common/i_pcm_logo.png"
          isOpen={zyghModalOpen}
          filePreviewMode="drawer"
          customInputs={customInputs}
          onConversationStart={handleStartConversation}
          onTokenInvalid={handleTokenInvalid}
          onModalClosed={() => {
            setZyghModalOpen(false);
            handleModalClosed('职业规划助手');
          }}
        />
      )}
    </div>
  );
}

export default App;
