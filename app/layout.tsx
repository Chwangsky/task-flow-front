import Header from "@/components/views/header";
import SidebarComponent from "@/components/views/sidebar/sidebar";
import Tail from "@/components/views/tail";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-row flex-no-wrap">
        <div className="absolute w-50 bg-slate-200">
          <SidebarComponent />
        </div>
        <div id="flex-1 vacant-div-for-sidebar" className="w-50"></div>
        <div className="">
          <div>
            <Header />
          </div>
          <div>{children}</div>
          <div>
            <Tail />
          </div>
        </div>
      </body>
    </html>
  );
}
