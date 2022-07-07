import { React, useState, useEffect } from "react";
import Input from "../../atoms/Input";
import styles from "../Signup/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm, Controller } from "react-hook-form";

const Login = () => {
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
      email: "",
      password: "",
    },
  });

  const [onChangeData, setOnChangeData] = useState({
    email: "",
    password: "",
  });

  const [firebaseError, setFirebaseError] = useState("");

  useEffect(() => {
    const subscription = watch((data) => {
      setOnChangeData(data);
      return () => {
        subscription.unsubscribe();
      };
    });
  }, [watch]);

  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const onSubmit = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (res) => {
        console.log(res.user);
      })
      .catch((err) => {
        setFirebaseError(err.message);
      });
  };

  return (
    <>
      <div className={styles.mainFormContainer} style={{ height: "500px" }}>
        <div className={styles.form}>
          <h2 className={styles.header}>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              <p className={styles.error}>{firebaseError.slice(16)}</p>
            </div>
            <div>
              <button type='submit'>Login</button>
            </div>
            <div className={styles.formText}>
              <p>
                don't you register?{" "}
                <Link to='/registration' className={styles.link}>
                  <span className={styles.text}>Register</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
