import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Users.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
export default function Users() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  function sendDataToApi(values) {
    axios
      .post('https://dummyapi.io/data/v1/user/create', values, {
        headers: { 'app-id': '65fe05abf3daaa60c013c8f4' }
      })
      .then((data) => {
        if (data.data.email) {
          toast.info('Contact added successfully');
          navigate('/contact');
        }
      })
      .catch((err) => {
        setErrMsg(err.response.data.data.email);
      });
  }
  const validationSchema = Yup.object({
    firstName: Yup.string().min(2).max(10).required(),
    lastName: Yup.string().min(2).max(10).required(),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is Required'),
    phoneNumber: Yup.string()
      .matches(
        /^(?:\+\d{1,3})?[ -]?\(?(?:\d{2,3})\)?[ -]?(?:\d{3}[ -]?\d{4}|\d{4}[ -]?\d{3})$/,
        'Invalid phone number'
      )
      .required('Phone number is Required')
  });
  const handleAddchChange = (event) => {
    const value = event.target.files[0];
    console.log(event.target);
    console.log(value);
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      picture: '',
      phoneNumber: ''
    },
    validationSchema,
    onSubmit: (values) => {
      sendDataToApi(values);
    }
  });
  return (
    <>
      <div className='user d-flex align-items-center'>
        <div className='container container-user py-5 px-4 '>
          <form onSubmit={formik.handleSubmit}>
            <div className='image upload m-auto'>
              <img
                src='images/noprofile.jpg'
                alt=''
                className='rounded-circle'
              />
              <div className='round'>
                <input type='file' onChange={handleAddchChange} />
                <i className='fa-solid fa-camera font'></i>
              </div>
            </div>
            <h6 className='text-center mt-4'>Upload photo</h6>
            <div className='row gy-4 mt-2'>
              <div className='col-md-6'>
                <div className='firstName'>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    type='text'
                    name='firstName'
                    className={`form-control ${
                      formik.errors.firstName ? 'is-invalid' : ''
                    }`}
                    placeholder='First Name'
                  />
                </div>
                {formik.errors.firstName && formik.touched.firstName && (
                  <div className='error-message alert alert-danger'>
                    {formik.errors.firstName}
                  </div>
                )}
              </div>

              <div className='col-md-6'>
                <div className='lastName'>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    type='text'
                    name='lastName'
                    className={`form-control ${
                      formik.errors.lastName ? 'is-invalid' : ''
                    }`}
                    placeholder='Last Name'
                  />
                </div>
                {formik.errors.lastName && formik.touched.lastName && (
                  <div className='error-message alert alert-danger'>
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
              <div className='col-md-6'>
                <div className='phoneNumber'>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.phoneNumber}
                    type='number'
                    name='phoneNumber'
                    className={`form-control ${
                      formik.errors.phoneNumber ? 'is-invalid' : ''
                    }`}
                    placeholder='Phone Number'
                  />
                </div>
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <div className='error-message alert alert-danger'>
                    {formik.errors.phoneNumber}
                  </div>
                )}
              </div>

              <div className='col-md-6'>
                <div className='email'>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type='email'
                    name='email'
                    className={`form-control ${
                      formik.errors.email ? 'is-invalid' : ''
                    }`}
                    placeholder='Email'
                  />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <div className='error-message alert alert-danger'>
                    {formik.errors.email}
                  </div>
                )}
              </div>
            </div>
            {errMsg && (
              <div className='error-message alert alert-danger'>
                <span>{errMsg}</span>
              </div>
            )}
            <div className='row mt-4'>
              <div className='col-md-6 col-sm-6 d-flex justify-content-lg-start justify-content-md-start justify-content-sm-start justify-content-center mt-4'>
                <Link className='link' to='/contact'>
                  <button className='btn buttoncancle'>Cancel</button>
                </Link>
              </div>
              <div className='col-md-6 col-sm-6 d-flex justify-content-lg-end justify-content-md-end justify-content-sm-end justify-content-center mt-4'>
                <button
                  type='submit'
                  className='btn buttonsave'
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
