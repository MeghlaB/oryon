
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../Provider/AuthProvider'

export default function userAdmin() {
  const {user} =useContext(AuthContext)
  
  
const {data: isAdmin ,isLoading: isAdminLoading } = useQuery({
  queryKey:[user?.email ,'isAdmin'],
  queryFn:async ()=>{
    const result = await axios.get(`https://gadgetzone-server.onrender.com/users/admin/${user.email}`)
    
    return result.data?.admin
  }
})

  return[isAdmin , isAdminLoading]
}
