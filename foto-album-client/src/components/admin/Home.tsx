import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/admin/dashboard')
    }, [])
    return (<>
        <div className="w-full h-full flex-1 p-6">
        <Outlet />
        </div>
       
    </>)
}