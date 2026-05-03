import { useContext } from 'react'

import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../Provider/AuthProvider'
import axios from 'axios'

export default function userSeller() {
  const {user} =useContext(AuthContext)


const {data: isseller,isPending: issellerLoading} = useQuery({
  queryKey:[user?.email ,'isseller'],
  queryFn:async ()=>{
    const result = await axios.get(`https://gadgetzone-server.onrender.com/users/seller/${user?.email}`)

    return result.data?.seller
  }
})

  return[isseller, issellerLoading]
}
