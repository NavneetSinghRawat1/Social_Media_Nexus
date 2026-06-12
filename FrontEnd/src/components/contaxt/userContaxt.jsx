import {useState} from 'react'
import { createContext } from 'react';
// import Cookies from 'js-cookie';
export const UserDataContext = createContext();
function UserContext(props) {

    const [userInfo, setUserInfo] = useState({username: "",picture: ""});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const token = Cookies.get('token');
  return (
    <div>
        <UserDataContext.Provider value={{ userInfo, setUserInfo, isLoggedIn, setIsLoggedIn }}>
        {props.children}
        </UserDataContext.Provider>
    </div>
  )
}

export default UserContext