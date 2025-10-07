import React from "react";
import { useResolvedPath } from "react-router";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiLogOut } from "react-icons/fi";

import { SidebarItem } from "./AccountPageStyles";

const Sidebar = ({ onLogout, tabLabels }) => {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();
  const activeTab = pathname.replace("/", "");

  return (
    <SidebarWrapper>
      {Object.keys(tabLabels).map((tab) => (
        <SidebarItem
          key={tab}
          $active={activeTab === tab}
          onClick={() => navigate(tab)}
          aria-pressed={activeTab === tab}
        >
          {tabLabels[tab]}
        </SidebarItem>
      ))}
      <SidebarItem onClick={onLogout} style={{ color: "#f3ededff" }}>
        <FiLogOut style={{ marginRight: "8px" }} />
        Вийти
      </SidebarItem>
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  width: 220px;
  background-color: rgba(30, 41, 59, 0.85);
  padding: 30px 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export default Sidebar;
