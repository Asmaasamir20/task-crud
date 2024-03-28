import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import './DeskTop.css';

export default function DeskTop() {
  // -------- START GetUser ------------------
  const [pageNumber, setPageNumber] = useState(0);
  function handleNextPage() {
    setPageNumber(pageNumber + 1);
  }
  function handlePreviousPage() {
    setPageNumber(pageNumber - 1);
  }
  function getUsers() {
    return axios.get(
      `https://dummyapi.io/data/v1/user?limit=5&page=${pageNumber}`,
      {
        headers: { 'app-id': '65fe05abf3daaa60c013c8f4' }
      }
    );
  }
  const { data, isLoading, refetch } = useQuery(
    ['getUsers', pageNumber],
    getUsers
  );
  // -------- END GetUser ------------------

  // -------- START DELETE User ------------
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const openDeleteModal = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };
  const deletUser = (id) => {
    axios
      .delete(`https://dummyapi.io/data/v1/user/` + id, {
        headers: { 'app-id': '65fe05abf3daaa60c013c8f4' }
      })
      .then((response) => {
        console.log('User deleted successfully');
        refetch();
        toast.success('DELETED');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };
  // -------- END DELETE User ----------------
  // -------- START Search User --------------
  const [search, setSearch] = useState('');
  const validationSchema = Yup.object().shape({
    search: Yup.string().required('Search is required')
  });
  const formik = useFormik({
    initialValues: {
      search: ''
    },
    validationSchema,
    onSubmit: (values) => {
      setSearch(values.search);
    }
  });
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
    refetch();
  };
  // --------- END Search User --------------

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className='contact d-flex align-items-center p-5'>
        <div className='container container-Contact pt-4 pb-1 px-4'>
          <form onSubmit={formik.handleSubmit}>
            <input
              onChange={handleSearchChange}
              type='text'
              name='search'
              className='form-control'
              placeholder='Search by Name'
            />
          </form>
          <div className='d-flex justify-content-end mt-4 '>
            <Link className='link' to='/new'>
              <button className='btn buttonsave d-inline '>
                <i className='fa-solid fa-plus pe-3 '></i> Add New Contact
              </button>
            </Link>
          </div>
          {data?.data.data
            .filter((item) => {
              return (
                search.toLowerCase() === '' ||
                item.firstName.toLowerCase().includes(search.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((item, index) => {
              return (
                <div key={index} className='row mt-4 '>
                  <div className='col-md-6 d-flex align-items-center'>
                    <div className='col-md-4'>
                      <div className='image'>
                        <img
                          src={item.picture}
                          alt=''
                          className='rounded-circle'
                        />
                      </div>
                    </div>
                    <div className='col-md-7 data '>
                      <h5 className='py-2'>
                        {item.firstName} {item.lastName}
                      </h5>
                      <h5 className='py-2'>01051345496</h5>
                    </div>
                  </div>
                  <div className='col-md-6 d-flex justify-content-end '>
                    <div className='col-md-4  d-flex justify-content-end align-items-center'>
                      <div className='update'>
                        <Link to={'/upbate/' + item.id}>
                          <Button className='btn btn-update mx-4 border-0'>
                            <i className='fa-regular fa-pen-to-square p-2'></i>
                          </Button>
                        </Link>
                      </div>
                      <div className='col-md-4 d-flex justify-content-end align-items-center'>
                        <div className='delete'>
                          <Button
                            onClick={() => {
                              openDeleteModal(item.id);
                            }}
                            className='btn btn-delete mx-2 border-0'
                          >
                            <i className='fa-solid fa-trash-can p-2'></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='brdr'></div>
                </div>
              );
            })}

          <div className=' mt-5 d-flex justify-content-end align-items-center text-white'>
            <button
              onClick={() => handlePreviousPage()}
              className='btn btn-angle'
              disabled={pageNumber <= 0}
            >
              <i className='fa-solid fa-angle-left'></i>
            </button>
            <span>{pageNumber + 1}</span>
            <span>/</span>
            {data?.data.total && data?.data.limit && (
              <span>{Math.ceil(data?.data.total / data?.data.limit)}</span>
            )}

            <button
              onClick={() => handleNextPage()}
              className='btn btn-angle'
              disabled={
                pageNumber >= Math.ceil(data?.data.total / data?.data.limit) - 1
              }
            >
              <i className='fa-solid fa-angle-right'></i>
            </button>
          </div>
        </div>
      </div>
      <div
        className='modal show'
        style={{
          display: 'block',
          position: 'initial'
        }}
      >
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
          <Modal.Dialog className='bg-black p-0'>
            <Modal.Header className='modalbg border-0'>
              <Modal.Title className='modal-title '>Delete user</Modal.Title>
            </Modal.Header>

            <Modal.Body className='modalbg text-white text-center py-0'>
              <p>Are you sure you want to delete this user?</p>
            </Modal.Body>

            <Modal.Footer className='modalbg border-0 '>
              <Button
                onClick={closeDeleteModal}
                variant='secondary '
                className='ms-auto px-4'
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  deletUser(deleteItemId);
                  closeDeleteModal();
                }}
                className='btndlete me-auto px-4'
                variant='danger'
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
      </div>
    </>
  );
}
