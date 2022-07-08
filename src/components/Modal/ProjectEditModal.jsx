import React from "react";
import Input from "../../atoms/Input";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";

const ProjectEditModal = () => {
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
      projectname: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "project"), {
        projectname: data.projectname,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        className='modal fade'
        id='exampleEditModal'
        tabIndex='-1'
        aria-labelledby='exampleEditModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleEditModalLabel'>
                Edit Project
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  fieldName='projectname'
                  type='text'
                  register={register}
                  errors={errors}
                  placeHolder='Enter ProjectName*'
                  isRequired={true}
                  minimLength={3}
                />
                <button
                  type='submit'
                  className='btn btn-primary ms-3 btn-sm'
                  data-bs-dismiss='modal'
                >
                  submit
                </button>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectEditModal;
