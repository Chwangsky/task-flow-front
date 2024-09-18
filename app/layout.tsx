"use client";
import Header from "@/components/views/header";
import SidebarComponent from "@/components/views/sidebar/SidebarComponent";
import Tail from "@/components/views/tail";
import { ReactNode, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  return (
    <html lang="en">
      <body className="flex flex-row h-screen">
        {/* 사이드바 */}
        <div className="w-[300px] bg-slate-200 flex-shrink-0">
          <SidebarComponent isCollapsed={isSidebarCollapsed} width="300px" />
        </div>

        {/* 주 콘텐츠 영역 */}
        <div id="flex-1 vacant-div-for-sidebar" className="flex-1">
          {/* 여기에는 여백을 설정할 수도 있습니다. */}
          <div>
            {/* 콘텐츠를 여기 배치 */}
            <div className="mb-10">
              <Header />
            </div>
            <div>{children}</div>
            <div className="mt-10">
              <Tail />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
