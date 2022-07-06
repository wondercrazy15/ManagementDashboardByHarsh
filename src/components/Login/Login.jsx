import React from "react";
import Input from "../../atoms/Input";
import styles from "../Signup/Signup.module.css";

const Login = () => {
  return (
    <>
      <div className={styles.mainFormContainer} style={{ height: "400px" }}>
        <div className={styles.form}>
          <h2 className={styles.header}>Login</h2>
          <form>
            <div>
              <Input
                type='text'
                id='email'
                name='email'
                placeholder='Enter Email*'
              />
            </div>
            <div>
              <Input
                type='password'
                id='password'
                name='password'
                placeholder='Enter Password*'
              />
            </div>
            <div>
              <button type='submit'>Login</button>
            </div>
            <div className={styles.formText}>
              <p>
                don't you register?{" "}
                <span className={styles.text}>Register</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
