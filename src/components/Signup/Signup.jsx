import { React, useState, useEffect } from "react";
import Input from "../../atoms/Input";
import styles from "./Signup.module.css";
import { useForm, Controller } from "react-hook-form";
import validation from "../../utils/validation";
import { collection, addDoc } from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Signup = () => {
  const [onChangeData, setOnChangeData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    state: "",
    country: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    const subscription = watch((data) => {
      setOnChangeData(data);
      return () => {
        subscription.unsubscribe();
      };
    });
  }, [watch]);
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // const uploadFile = () => {
  //   document.getElementById("selectFile").click();
  // };
  const onSubmit = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (res) => {
        const user = res.user;
        await addDoc(collection(db, "user"), {
          uid: user.uid,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
          confirmpassword: data.confirmpassword,
          state: data.state,
          country: data.country,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <div className={styles.mainFormContainer}>
        <div className={styles.form}>
          <h2 className={styles.header}>Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                fieldName='firstname'
                type='text'
                register={register}
                errors={errors}
                placeHolder='Enter FirstName*'
                isRequired={true}
                minimLength={3}
              />
              {errors.firstname && (
                <p className={styles.error}>{errors.firstname.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='lastname'
                type='text'
                register={register}
                errors={errors}
                placeHolder='Enter LastName*'
                isRequired={true}
                minimLength={3}
              />
              {errors.lastname && (
                <p className={styles.error}>{errors.lastname.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='email'
                type='email'
                register={register}
                errors={errors}
                placeHolder='Enter Email*'
                isRequired={true}
                patternn={pattern}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='password'
                type='password'
                register={register}
                errors={errors}
                placeHolder='Enter Password*'
                isRequired={true}
                minimLength={8}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='confirmpassword'
                type='password'
                register={register}
                errors={errors}
                placeHolder='Enter ConfirmPassword*'
                isRequired={true}
                minimLength={8}
              />
              {errors.confirmpassword ? (
                <p className={styles.error}>{errors.confirmpassword.message}</p>
              ) : onChangeData.confirmpassword &&
                onChangeData.password !== onChangeData.confirmpassword ? (
                <p className={styles.error}>password must be same</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <Input
                fieldName='state'
                type='text'
                register={register}
                errors={errors}
                placeHolder='Enter State*'
                isRequired={true}
                minimLength={2}
              />
              {errors.state && (
                <p className={styles.error}>{errors.state.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='country'
                type='text'
                register={register}
                errors={errors}
                placeHolder='Enter Country*'
                isRequired={true}
                minimLength={2}
              />
              {errors.country && (
                <p className={styles.error}>{errors.country.message}</p>
              )}
            </div>
            {/* <div>
              <button onClick={uploadFile}>Hii</button>
              <input
                {...register("picture", {
                  onChange: (e) => {
                    // onSelectFile(e);
                  },
                })}
                type='file'
                id='selectFile'
              />
            </div> */}
            <div>
              <button type='submit'>Sign up</button>
            </div>
            <div className={styles.formText}>
              <p>
                already registered? <span className={styles.text}>Login</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
