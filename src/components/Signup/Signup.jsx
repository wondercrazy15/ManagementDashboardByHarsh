import { React, useState, useEffect } from "react";
import Input from "../../atoms/Input";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import profileImage from "../../assets/profileimage.png";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Signup = () => {
  const navigate = useNavigate();
  const [onChangeData, setOnChangeData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    state: "",
    country: "",
  });
  const [firebaseError, setFirebaseError] = useState("");
  const [preview, setPreview] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [photoUrl, setPhotoUrl] = useState("");

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

  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    const subscription = watch((data) => {
      setOnChangeData(data);
      return () => {
        subscription.unsubscribe();
      };
    });
  }, [watch]);

  const uploadFile = () => {
    document.getElementById("selectFile").click();
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const upload = async (file) => {
    const fileRef = ref(storage, "images");
    const snapshot = await uploadBytes(fileRef, file);
    const purl = await getDownloadURL(fileRef);
    return purl;
  };

  useEffect(() => {
    upload(selectedFile).then((res) => {
      setPhotoUrl(res);
    });
  }, [photoUrl]);

  // console.log(selectedFile);

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
          url: photoUrl,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        setFirebaseError(error.message);
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
            <div>
              {selectedFile ? (
                <img
                  src={preview}
                  alt='noprofileImagephoto'
                  className={styles.image}
                />
              ) : (
                <img
                  src={profileImage}
                  alt='noprofileImagephoto'
                  className={styles.image}
                />
              )}
              <button
                type='button'
                onClick={uploadFile}
                className={styles.uploadfileImage}
              >
                upload profile picture
              </button>
              <input
                {...register("picture", {
                  onChange: (e) => {
                    onSelectFile(e);
                  },
                })}
                type='file'
                id='selectFile'
              />
            </div>
            <div>
              <p className={styles.error}>{firebaseError.slice(16)}</p>
            </div>
            <div>
              <button type='submit'>Sign up</button>
            </div>
            <div className={styles.formText}>
              <p>
                already registered?{" "}
                <Link to='/' className={styles.link}>
                  <span className={styles.text}>Login</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
