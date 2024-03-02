import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

const Countries = () => {
  const initialValues = { name: '', email: '', phone: '',}
  const  secondValue ={ id: null,
    name: '',
    email: '',
    phone: '',}
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [dataModal, setDataModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [newUserData, setNewUserData] = useState({initialValues });
  const [editData, setEditData] = useState({ secondValue});
  // const [isEditMode, setIsEditMode] = useState(false);

  const [editDataModal, setEditDataModal] = useState(false);
  const [viewDataModal, setViewDataModal] = useState(false);
  const [formError,setFormError]=useState({});
  const [isSubmit,setIsSubmit]=useState(false);

  
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const getusers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { name: 'Users Name', selector: (row) => row.name, sortable: true },
    { name: 'Users Email', selector: (row) => row.email },
    { name: 'Users PhoneNumbers', selector: (row) => row.phone },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <button
            className='btn btn-primary'
            onClick={() => handleviewButtonClick(row)}
          >
            View
          </button>

          <button style={{marginLeft:'5px'}}
            className='btn btn-primary'
            onClick={() => handleEditButtonClick(row)}
          >
            Edit
          </button>
          <button style={{marginLeft:'5px'}}
            className='btn btn-danger'
            onClick={() => handleDeleteButtonClick(row)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    getusers();
  }, []);

  useEffect(() => {
    // const result = users.filter((user) => {
    //   return user.name.toLowerCase().includes(search.toLowerCase());
    // });
    // setFilteredUsers(result);
  }, [search, users]);

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
// what is Asyn 2:try catch 3:object.keys  4:State
  const handleFormSubmit = async (action) => {
    try {
      const errors =validate(newUserData);
      setFormError(errors);
      
      if(Object.keys(errors).length === 0 ){
        action=="add"?await axios.post('http://localhost:3000/users', newUserData): await axios.put(`http://localhost:3000/users/${newUserData.id}`, newUserData);

      setModal(false);
      getusers();
      setFormError({});
      setIsSubmit(true);
      emptyFields();
    }} catch (error) {
      console.error(error);
    }
  }
  const emptyFields=()=>{
    setNewUserData({
      name: '',
      id:'',
      email: '',
      phone: '',
    });
  }
  const handleEditButtonClick = (row) => {
    setNewUserData({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
    });
    setModal(true);
    // setFormError({secondValue})
  };

  const handleviewButtonClick = (row) => {
    setEditData({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
    });
    setViewDataModal(true);
  };

  const handleUpdateButtonClick = async () => {
    try {
      const errors = validate(newUserData);
      setFormError(errors);
      if(Object.keys(errors).length === 0 ){
      await axios.put(`http://localhost:3000/users/${newUserData.id}`, newUserData);
      setModal(false);
      getusers();
      setFormError({});
      setIsSubmit(true);
    }} 
    catch (error) {
      console.error(error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleViewInputChange = (e) => {
    const { name, value } = e.target;
    setViewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteButtonClick = (row) => {
    setDeleteTarget(row);
    setDeleteConfirmationModal(true);
  };

  const handleAddClick = ()=>{
    setModal(true);
    setNewUserData({initialValues});
    setFormError({initialValues});
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/${deleteTarget.id}`);
      setDeleteConfirmationModal(false);
      getusers();
    } catch (error) {
      console.error(error);
    }
  };

  const validate=(values)=>{
       const errors={};
       if(!values.name){
        errors.name="Name is required!";
       } else if(values.name.trim() ===''){
         errors.name ="Name Must be required"
       }
       if(!values.email){
        errors.email="Email is required!";
       }
       if(!values.phone){
        errors.phone="phone is required!";
       } else if(values.phone.trim()===''){
           errors.phone="phone Must be required"
       }
       return errors;
  }

  return (
    <>
      <div>
        <DataTable
          columns={columns}
          data={filteredUsers}
          pagination
          fixedHeader
          fixedHeaderScrollHeight='300px'
          selectableRows
          selectableRowsHighlight
          highlightOnHover
          actions={
            <button
              className='btn btn-sm btn-info'
              onClick={handleAddClick}
            >
              Add
            </button>
          }
          subHeader
          subHeaderComponent={
            <input
              type='text'
              placeholder='Search'
              className='w-25 form-control'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        />
        <Modal size='sm' isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>
            { newUserData?.id?'Update':'Add'} Recod
          </ModalHeader>
          <ModalBody>
            <form>
              <Row>
                <Col lg={12}>
                  <div>
                    <label>Name</label>
                    <input
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      name='name'
                      value={newUserData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formError.name && <p className="text-danger">{formError.name}</p>}
                </Col>
                <Col lg={12}>
                  <div>
                    <label>E-mail</label>
                    <input
                      type='email'
                      placeholder='Enter E-mail'
                      className='form-control'
                      name='email'
                      value={newUserData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formError.email && <p className="text-danger">{formError.email}</p>}
                </Col>
                <Col lg={12}>
                  <div>
                    <label>PhoneNumber</label>
                    <input
                      type='number'
                      placeholder='Enter Number'
                      className='form-control'
                      name='phone'
                      value={newUserData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formError.phone && <p className="text-danger">{formError.phone}</p>}
                </Col>
              </Row>
            </form>
          {  newUserData?.id? <button
              className='btn btn-success mt-3'
              onClick={()=>handleFormSubmit()}
            >
              Update
            </button>: <button
              className='btn btn-success mt-3'
              onClick={()=>handleFormSubmit('add')}
            >
              Submit
            </button>}
          </ModalBody>
        </Modal>
      </div>
      <div>
        <Modal
          size='sm'
          isOpen={editDataModal}
          toggle={() => setEditDataModal(!editDataModal)}
        >
          <ModalHeader toggle={() => setEditDataModal(!editDataModal)}>Edit Recod</ModalHeader>
          
          <ModalBody>
            <form>
              <Row>
                <Col lg={12}>
                  <div>
                    <label>Edit Name</label>
                    <input
                      type='text'
                      placeholder='Name'
                      name='name'
                      value={editData.name}
                      onChange={handleEditInputChange}
                      className='form-control'
                    />
                  </div>
                  {formError.name && <p className="text-danger">{formError.name}</p>}
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <div>
                    <label>Edit-Email</label>
                    <input
                      type='text'
                      placeholder='E-mail'
                      name='email'
                      value={editData.email}
                      onChange={handleEditInputChange}
                      className='form-control'
                    />
                  </div>
                  {formError.email && <p className="text-danger">{formError.email}</p>}
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <div>
                    <label>Edit phone</label>
                    <input
                      type='text'
                      placeholder='Phone'
                      name='phone'
                      value={editData.phone}
                      onChange={handleEditInputChange}
                      className='form-control'
                    />
                  </div>
                  {formError.phone && <p className="text-danger">{formError.phone}</p>}
                </Col>
              </Row>
            </form>
            <button
              className='btn btn-success mt-3'
              onClick={handleUpdateButtonClick}
            >
              Update
            </button>
          </ModalBody>
        </Modal>

        {/* view modal  */}
        <Modal
          size='sm'
          isOpen={viewDataModal}
          toggle={() => setViewDataModal(!viewDataModal)}
        >
          <ModalHeader toggle={() => setViewDataModal(!viewDataModal)}>View Recod</ModalHeader>
          
          <ModalBody>
            <form>
              <Row>
                <Col lg={12}>
                  <div>
                    <label> Name</label>
                    <input
                      type='text'
                      placeholder='Name'
                      name='name'
                      value={editData.name}
                      onChange={handleViewInputChange}
                      className='form-control'
                      readOnly
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <div>
                    <label>Email</label>
                    <input
                      type='text'
                      placeholder='E-mail'
                      name='email'
                      value={editData.email}
                      onChange={handleViewInputChange}
                      className='form-control'
                      readOnly
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <div>
                    <label> phone</label>
                    <input
                      type='text'
                      placeholder='Phone'
                      name='phone'
                      value={editData.phone}
                      onChange={handleViewInputChange}
                      className='form-control'
                      readOnly
                    />
                  </div>
                </Col>
              </Row>
            </form>
          </ModalBody>
        </Modal>

        {/* Delete confirmation modal */}
        <Modal
          size='sm'
          isOpen={deleteConfirmationModal}
          toggle={() => setDeleteConfirmationModal(!deleteConfirmationModal)}
        >
          <ModalHeader toggle={() => setDeleteConfirmationModal(!deleteConfirmationModal)}>
             Delete Recod
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this recod?</p>
            <button className='btn btn-danger' onClick={handleDeleteConfirm}>
              Yes
            </button>
            <button
              className='btn btn-secondary m-2'
              onClick={() => setDeleteConfirmationModal(false)}
            >
              No
            </button>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default Countries;
