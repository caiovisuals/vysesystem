import Header from "./SidebarUi/Header"
import Nav from "./SidebarUi/Nav"
import Footer from "./SidebarUi/Footer"

export function Sidebar({ ...props }) {
    return (
        <div className="h-full min-w-[350px] max-w-[350px] flex flex-col justify-between p-[10px] gap-[30px]" {...props}>
            <div className="w-full flex flex-col gap-[10px]">
                <Header/>
                <Nav/>
            </div>
            <Footer/>
        </div>
    )
}