/*
 * @Author: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @Date: 2025-07-03 09:37:21
 * @LastEditors: xzl 12842711+x17633997766@user.noreply.gitee.com
 * @LastEditTime: 2025-07-03 09:40:54
 * @FilePath: /nova-admin/frontend/src/components/Logo.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Space } from 'antd';

const Logo = () => {
  return (
    <Space>
      <div style={{
        width: 32,
        height: 32,
        background: '#1890ff',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
      }}>
        N
      </div>
    </Space>
  );
};

export default Logo;