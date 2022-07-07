import React, { useEffect, useState } from "react";
import { Get_CurrentUser } from "../redux/currentUser/currentUserAction";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { query, collection, getDocs, where } from "firebase/firestore/lite";

function CurrentUser() {
  const dispatch = useDispatch();
  const [user, loading, error] = useAuthState(auth);
  const userDetail = useSelector((state) => state);
  console.log(userDetail);

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
        uid: dataId,
        url: data.url,
      };
      dispatch(Get_CurrentUser(userData));
    } catch (err) {
      console.error(err);
    }
  };

  //   const logout = () => {
  //     signOut(auth);
  //     setFirstName("");
  //     setLastName("");
  //     setEmail("");
  //     setPhoneNumber("");
  //     setRole("");
  //     setPhotoUrl("");
  //     setUid("");
  //   };

  useEffect(() => {
    if (loading) return;
    if (!user) return error;
    fetchUserData();
  }, [user, loading]);

  return <></>;
}

export default CurrentUser;
