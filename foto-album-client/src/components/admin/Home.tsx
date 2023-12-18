import { Outlet } from "react-router-dom";

export default function Home(){
    return (<>
        <div className="w-full h-full flex-1 p-6">
        <Outlet />
        </div>
       
    </>)
}