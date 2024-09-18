"use client";

import "@/app/globals.css";
import useLoginUserStore from "@/contexts/login-user.store";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Book } from "./icons/Book";
import { ProfileImage } from "./icons/ProfileImage";

interface Props {
  isCollapsed: boolean;
  width: string;
}

const SidebarComponent = (props: Props) => {
  const { isCollapsed, width } = props;

  const { loginUser } = useLoginUserStore();
  return (
    <Sidebar width="300px" collapsed={isCollapsed}>
      <Menu>
        {loginUser ? (
          <div>
            <img src={`${loginUser.profileImage}`}></img>
          </div>
        ) : (
          <div>
            <div className="flex flex-row justify-center">
              <ProfileImage size={100} />
            </div>
            "로그인 이후 이용해 주세요"
          </div>
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
