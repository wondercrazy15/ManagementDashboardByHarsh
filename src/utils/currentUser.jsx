import { React, useEffect } from "react";
import { Get_CurrentUser } from "../redux/currentUser/currentUserAction";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore/lite";

const CurrentUser = () => {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();
  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "user"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      const dataId = doc.docs[0].id;
      const userData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        country: data.country,
        state: data.state,
        uid: data.uid,
        url: data.url,
        role: data.role,
      };
      dispatch(Get_CurrentUser(userData));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return error;
    fetchUserData();
  }, [user, loading]);

  return <></>;
};

export default CurrentUser;
