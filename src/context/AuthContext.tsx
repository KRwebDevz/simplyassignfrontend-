import React, { createContext, useContext, useEffect, useState } from 'react';



interface User{
    _id:string;
    name:string;
    email:string;
    first_name:string;
    last_name:string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    user: any;
    SetUserFunction: (arg0: User) => void;
}



export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    user:null,
    SetUserFunction:(User)=>{}

});

export const useAuth=()=>{
    return useContext(AuthContext);
}

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user,setUser]=useState<User>();

    const login = () => {
    
        setIsAuthenticated(true);
    };

    const logout = () => {
       
        setIsAuthenticated(false);
    };

    const SetUserFunction=(currentUser:User)=>{
        setUser(currentUser);
    }

    useEffect(()=>{
        console.log('user ',user)
    },[user])


    const getLoggedInUser=async()=>{
        try {
            const token = localStorage.getItem('token');
            if(token){
                fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            setUser(data);
                            console.log(data);
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    
    }

    useEffect(() => {
        getLoggedInUser();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout ,user,SetUserFunction}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;