import React, { useEffect, useState } from 'react'
import * as B from 'react-bootstrap'
import { BsPersonPlusFill } from 'react-icons/bs'
import { FaUserEdit, FaSearch } from 'react-icons/fa'
import { AiOutlineUserDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import axios from 'axios'
import swal from 'sweetalert'
import LoaderIcon from "../../layouts/Loading/index";

function Index() {

    const [ncclist, setNcclist] = useState([]);

    // Thêm NCC (start)
    const [nccInput, setNcc] = useState({
        tenNCC: '',
        sdt: '',
        diachi: '',
    });
    const [errorlist, setError] = useState([]);

    const handleNccInput = (e) => {
        e.persist();
        setNcc({ ...nccInput, [e.target.name]: e.target.value });
    }

    const submitNcc = (e) => {
        e.preventDefault();

        const data = {
            tenNCC: nccInput.tenNCC,
            sdt: nccInput.sdt,
            diaChi: nccInput.diachi,
        }

        axios.post(`http://localhost:8000/api/kho/ncc`, data).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success')
                setNcc({
                    tenNCC: '',
                    sdt: '',
                    diachi: '',
                });
                setError([]);
            }
            else if (res.data.status === 400) {
                swal('Error', res.data.message, 'error');
                setError(res.data.errors);
            }
        })
    }
    // Thêm NCC (end)

    useEffect(() => {
        let isMounted = true;

        axios.get(`http://localhost:8000/api/kho/ncc`).then(res => {
            if (isMounted) {
                if (res.data.status === 200) {
                    setNcclist(res.data.Ncc.data);
                }
            }
        });

        return () => {
            isMounted = false
        };

    }, [ncclist]);

    return (
        <>
            <B.Container fluid>
                <B.Row className='pe-xl-5 mb-4'>
                    <B.Col lg={5}>
                        <h1 className='fw-bold text-primary mb-4 text-capitalize'>QUẢN LÝ NHÀ CUNG CẤP</h1>
                    </B.Col>
                    <B.Col lg={1}></B.Col>
                    <B.Col lg={6}>
                        <B.Form>
                            <B.FormGroup>
                                <B.InputGroup>
                                    <B.FormControl
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        className="rounded-0 shadow-none focus-outline-none fw-semibold"
                                    ></B.FormControl>
                                    <B.InputGroup.Text className="bg-transparent text-primary rounded-0">
                                        <FaSearch variant="primary" />
                                    </B.InputGroup.Text>
                                </B.InputGroup>
                            </B.FormGroup>
                            <B.FormGroup className='d-flex d-inline-block justify-content-between mt-2'>
                                <B.FormCheck type='checkbox' className='rounded-0' label='Theo id' />
                            </B.FormGroup>
                        </B.Form>
                    </B.Col>

                </B.Row>

                <B.Row className='pe-xl-5 mb-5'>
                    <B.Form onSubmit={submitNcc} id='formAddNCC'>
                        <B.Row>
                            <B.Col lg={8}>
                                <B.FormGroup>
                                    <B.FormControl type='text' name='tenNCC' className='rounded-0 shadow-none mb-3' placeholder='Tên nhà cung cấp'
                                        onChange={handleNccInput} value={nccInput.tenNCC}></B.FormControl>
                                    <h6 className='text-danger'>{errorlist.tenNCC}</h6>
                                </B.FormGroup>
                                <B.FormGroup>
                                    <B.FormControl type='text' name='sdt' className='rounded-0 shadow-none mb-3' placeholder='Số điện thoại'
                                        onChange={handleNccInput} value={nccInput.sdt}></B.FormControl>
                                    <h6 className='text-danger'>{errorlist.sdt}</h6>
                                </B.FormGroup>
                                <B.FormGroup>
                                    <B.FormControl as='textarea' rows={4} name='diachi' className='rounded-0 shadow-none mb-3' placeholder='Địa chỉ'
                                        onChange={handleNccInput} value={nccInput.diachi}></B.FormControl>
                                    <h6 className='text-danger'>{errorlist.diachi}</h6>
                                </B.FormGroup>
                            </B.Col>
                            <B.Col lg={4}>
                                <B.Button type='submit' variant='outline-primary' className='rounded-0 py-2 mb-2 w-100'>
                                    <BsPersonPlusFill className='me-2' />
                                    Thêm nhà cung cấp
                                </B.Button>
                            </B.Col>
                        </B.Row>
                    </B.Form>
                </B.Row>

                {/* table hien thi tai khoan */}
                <B.Row className='pe-xl-5'>
                    <B.Col lg className='d-grd gap-2 mx-auto table-responsive mb-5' >
                        <B.FormGroup className='d-flex d-inline-block justify-content-between mb-2'>
                            <B.FormSelect className='rounded-0 shadow-none' style={{ width: '200px' }}>
                                <option>Sắp xếp</option>
                                <option>Từ A-Z</option>
                                <option>Theo ID</option>
                            </B.FormSelect>
                        </B.FormGroup>
                        <B.Table className='table-borderless border border-secondary text-center mb-0'>
                            <thead className='text-dark' style={{ backgroundColor: '#edf1ff' }}>
                                <tr>
                                    <th><input type='checkbox' /></th>
                                    <th>ID</th>
                                    <th>Tên nhà cung cấp</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className='align-middle'>
                                {
                                    ncclist.map((item) => {
                                        return (
                                            <tr>
                                                <td key={item.id} className='align-middle'><input type='checkbox' /></td>
                                                <td className='align-middle'>{item.id}</td>
                                                <td className='align-middle'>{item.tenNCC}</td>
                                                <td className='align-middle'>{item.sdt}</td>
                                                <td className='align-middle'>{item.diaChi}</td>
                                                <td className='align-middle fs-5 text-primary'><BiEdit /></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </B.Table>
                    </B.Col>
                </B.Row>
            </B.Container>
        </>
    )
}

export default Index