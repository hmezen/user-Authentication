import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "./firebaseApp";

const authContext = createContext();
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("users")
          .doc(user.email)
          .get()
          .then((res) => {
            setUser({
              email: user.email,
              uid: user.uid,
              ...res.data(),
            });
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    setUser,
  };
}
