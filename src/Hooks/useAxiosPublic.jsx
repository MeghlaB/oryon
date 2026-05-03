import axios from 'axios'


const axiosPublic= axios.create({

    // baseURL:"https://gadgetzone-server.onrender.com",
    baseURL:"https://gadgetzone-server.onrender.com", 
    withCredentials:true,
  
})

function useAxiosPublic() {
  return axiosPublic
}

export default useAxiosPublic
