import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {

  const [details, setDetails] = useState("")

  const getDetails = async (instructorId) => {
    try{
        const response = await fetch(`http://localhost:3500/api/data/instructor/${instructorId}`,{
          method: "GET",

        });

        if(response.ok){
          const data = await response.json()
          console.log(data.msg)
          setDetails(data.msg)
        }
    }catch(error){
    console.log(`services error: ${error}`)
    }
  }

  useEffect(()=>{
    getDetails();
  }, [])


 

  return (
    <AuthContext.Provider value={{ details}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};