import { useContext } from "react"
import { AuthContext } from "../Provider/AuthProvider"

export default function useAuth (){
    const auth = useContext(AuthContext)
    return auth
}
