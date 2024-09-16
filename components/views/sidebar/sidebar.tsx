"use client";

import useLoginUserStore from "@/contexts/login-user.store";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Book } from "./icons/Book";
import { ProfileImage } from "./icons/ProfileImage";
import "@/app/globals.css";

const SidebarComponent = (props: ) => {
  const { loginUser } = useLoginUserStore();

  return (
    <Sidebar collapsed={props}>
      <Menu>
        {loginUser ? (
          <img src={`${loginUser.profileImage}`}></img>
        ) : (
          <ProfileImage />
        )}
        <div>여기에 로그인 유저의 정보가들어갈 예정.</div>
        <div>로그인 여부: {loginUser !== null ? "true" : "false"} </div>
        <SubMenu label="TOOLS" icon={<Book />}>
          <MenuItem>Todo Stack</MenuItem>
          <MenuItem>Calendar</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
