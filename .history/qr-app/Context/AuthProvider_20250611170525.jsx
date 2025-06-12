import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import PrivateAxios from "../src/Services/PrivateAxios.js";
import { LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner9 } from "react-icons/im";
import { loginSuccess } from "../src/Redux/Fetures/authSlice.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (token) {
      return setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await PrivateAxios.get("/auth/check");
        if (res.status === 200) {
          dispatch(loginSuccess({ token: res.data.token }));
          setAuthenticated(true);
        }
        setLoading(false);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    <div className="flex justify-center items-center">
      <ImSpinner9 className="animate-spin" size={70} />
    </div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
