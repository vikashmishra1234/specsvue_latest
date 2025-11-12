import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Cookeis from 'js-cookie'
import AdminBillForm from "./BillingForm";

interface AccountInfo{
    oldPassword:string;
    newUserName?:string;
    newPassword?:string;
    token:string;
}

export default function AdminSettings() {
    const [accountInfo,setAccountInfo] = useState<AccountInfo>({
        oldPassword:'',
        newUserName:'',
        newPassword:'',
        token:''
    })
    const [loading,setLoading] = useState(false)

    const updateAccountInfo = async(e:any) =>{
        e.preventDefault();
        accountInfo.token = Cookeis.get("adminToken") as string;
        const res = await axios.post('/api/update-admin-account',(accountInfo as any));
        console.log(res)
    }
       
  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-10 text-gray-200">
      {/* Update Account Section */}
      <section className="lg:w-1/2 w-full bg-[#111] border border-gray-700 rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
          Update Account Information
        </h2>

        <form onSubmit={updateAccountInfo} className="flex flex-col gap-4">
          <input
            className="bg-[#1b1b1b] border border-gray-700 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
            required
            type="password"
            placeholder="Enter Old Password"
            onChange={(e)=>setAccountInfo({...accountInfo,oldPassword:e.target.value})}
          />
          <input
            className="bg-[#1b1b1b] border border-gray-700 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
            type="text"
            placeholder="Enter New Username"
             onChange={(e)=>setAccountInfo({...accountInfo,newUserName:e.target.value})}
          />
          <input
            className="bg-[#1b1b1b] border border-gray-700 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
            type="password"
            placeholder="Enter New Password"
             onChange={(e)=>setAccountInfo({...accountInfo,newPassword:e.target.value})}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white cursor-pointer text-black font-medium py-2 rounded-lg hover:bg-gray-300 transition"
          >
           {
            loading?"Updating...":"Update"
           }
          </button>
        </form>
      </section>

      {/* Create Bill Section */}
      <section className="hidden" >
       <AdminBillForm/>
      </section>
    </div>
  );
}
