import axios from 'axios';
import React, { useState, useEffect } from 'react'
import * as B from 'react-bootstrap'
import Pagination from '../../form/pagination/index'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { FaSearch, FaMinus, FaPlus, FaRegEye, FaTimes } from "react-icons/fa";
import { FcPrint } from 'react-icons/fc'
import { BiEdit, BiReset, BiRefresh } from 'react-icons/bi'
import { TbTrashX } from 'react-icons/tb'
import swal from 'sweetalert';
import EditPx from './editPx'
import './style.css'

const checkStatus = [
    { id: 0, name: 'Chờ xác nhận' },
    { id: 1, name: 'Đã xác nhận' },
    { id: 2, name: 'Đang đóng gói' },
    { id: 3, name: 'Đang vận chuyển' },
    { id: 4, name: 'Giao hàng thành công' },
];


function Index() {
    const [pxlist, setPxlist] = useState();
    const [error, setError] = useState([]);
    const [pxinput, setPxInput] = useState({
        tenKH: '',
        sdtKH: '',
        diachiKH: '',
    });
    const [pxid, setPXid] = useState();
    const [ekey, setEkey] = useState();
    const [searchList, setSearchlist] = useState();
    const [pxsearchList, setPxSearchlist] = useState([]);
    const [viewPx, setViewPx] = useState();
    const [editPx, setEditPx] = useState();
    const [tabkey, setTabkey] = useState(1)
    const [prodData, setProdData] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [show, setShow] = useState(false);
    const [showCtpx, setShowCtpx] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showTab, setShowTab] = useState(false);
    const [showSearchTable, setShowSearchTable] = useState(false);
    const handleClose = () => setShow(prev => !prev);
    const handleShow = (ctpx) => {
        setShow(true);
        setEditPx(ctpx);
    }

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [perPage, setPerPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const handlePerPage = (page) => {
        setPage(page);
    };

    function formatMoney(money) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(money);
    }

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPage / perPage); i++) {
        pageNumbers.push(i);
    }

    // Function thêm phiếu xuất/Ct phiếu xuất mới
    const handlePxInput = (e) => {
        setPxInput({ ...pxinput, [e.target.name]: e.target.value });
    }

    const handleSubmitPx = (e) => {
        e.preventDefault();

        const data = {
            tenKH: pxinput.tenKH,
            sdt: pxinput.sdtKH,
            diaChi: pxinput.diachiKH,
            pt_ThanhToan: 'Tại quầy',
        }

        axios.post(`/api/kho/px`, data).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success')
                setPXid(res.data.px_id);
                setShowCtpx(true);
                setError([]);
                setPxInput({
                    ...pxinput,
                    tenKH: '',
                    sdtKH: '',
                    diachiKH: '',
                })
            } else if (res.data.status === 400) {
                setError(res.data.error);
            }
        })
    }

    const submitAddCtpx = (e) => {
        e.preventDefault();

        const data = {
            px_id: pxid,
            product_id: prodData.id,
            soluong: quantity,
            gia: prodData.gia * quantity,
        }

        axios.post(`/api/kho/addctpx`, data).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success');
                setProdData([]);
                setError([]);
                setShowCtpx(false);
                setShowTable(false);
                setQuantity(1);
            } else if (res.data.status === 400) {
                setError(res.data.error);
            } else if (res.data.status === 401) {
                swal('Error', res.data.message, 'error')
            } else if (res.data.status === 402) {
                swal('Warning', res.data.message, 'error')
            } else if (res.data.status === 403) {
                swal('Error', res.data.message, 'error')
            } else if (res.data.status === 404) {
                swal('Error', res.data.message, 'error')
            }
        })

    }
    // End

    // Fetch data phiếu xuất
    useEffect(() => {
        let isMounted = true;

        axios.get(`/api/kho/px?page=${page}`).then(res => {
            if (isMounted) {
                if (res.status === 200) {
                    setPxlist(res.data.data.data);
                    setTotalPage(res.data.data.total);
                    setPerPage(res.data.data.per_page);
                    setCurrentPage(res.data.data.current_page)
                }
            }
        });

        return () => {
            isMounted = false;
        }
    }, [page])

    const handleUpdateStatus = (value, px) => {
        const data = {
            tenKH: px.tenKH,
            diaChi: px.diaChi,
            pt_ThanhToan: px.pt_ThanhToan,
            sdt: ` 0${px.sdt} `,
            tongTien: px.tongTien,
            status: value.id,
        }
        axios.put(`/api/kho/px/${px.id}`, data).then(res => {
            if (res.status === 200) {
                // setPxlist(res.data.data.data);
                // setEkey()
            }
        })
    }
    // End

    // Function search và thêm sản phẩm mẫu cho chi tiết phiếu xuất
    const handleOnProdSearch = (key) => {
        axios.get(`http://localhost:8000/api/searchProduct?key=${key}`).then(res => {
            if (res.data.status === 200) {
                setSearchlist(res.data.product)
            }
        })
    };

    const handleOnProdSelect = (value) => {
        setProdData(value);
        setShowTable(true);
    };

    const formatResult = (item) => {
        return (
            <div className="result-wrapper">
                <span className="result-span">
                    <img
                        src={`http://localhost:8000/uploadhinh/${item.hinh}`}
                        style={{ height: '60px' }}
                        alt=''
                    />
                </span>
                <span className="result-span">{item.tenSP}</span>
            </div>
        );
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prevCount) => prevCount - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < 10) {
            setQuantity((prevCount) => prevCount + 1);
        }
    };
    // End

    const handleOnPxSearch = (key) => {
        axios.get(`http://localhost:8000/api/kho/px-search?key=${key}`).then(res => {
            // if (res.data.status === 200) {

            // }
            setPxSearchlist(res.data.data)
            setShowSearchTable(true);
        })
    }

    const handleOnPxClear = () => {
        setPxSearchlist([]);
        setShowSearchTable(false);
    }

    const handleView = (px) => {
        setShowTab(true);
        setTabkey(3);
        setViewPx(px);
    }

    const handleCloseTab = () => {
        setShowTab(false);
        setTabkey(1);
    }

    const handleAddCtpxProd = (value) => {
        const data = {
            px_id: viewPx.id,
            product_id: value.id,
            soluong: quantity,
        }

        axios.post(`/api/kho/addctpx`, data).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success');
                setQuantity(1);
                setProdData([]);
                setError([]);
            } else if (res.data.status === 400) {
                setError(res.data.error);
            } else if (res.data.status === 401) {
                swal('Error', res.data.message, 'error')
            } else if (res.data.status === 402) {
                swal('Warning', res.data.message, 'error')
            } else if (res.data.status === 403) {
                swal('Error', res.data.message, 'error')
            } else if (res.data.status === 404) {
                swal('Error', res.data.message, 'error')
            }
        })
    }

    const handleRefresh = () => {
        axios.get(`/api/kho/px?page=${page}`).then(res => {
            if (res.status === 200) {
                setPxlist(res.data.data.data);
                setTotalPage(res.data.data.total);
                setPerPage(res.data.data.per_page);
                setCurrentPage(res.data.data.current_page)
            }
        });
    }

    const test = (status) => {
        var x;
        switch (status) {
            case 0: {
                x = 'Chờ xác nhận';
                break;
            }
            case 1: {
                x = 'Đã xác nhận';
                break;
            }
            case 2: {
                x = 'Đang đóng gói';
                break;
            }
            case 3: {
                x = 'Đang vận chuyển';
                break;
            }
            case 4: {
                x = 'Giao hàng thành công';
                break;
            }
            default: {
                break;
            }
        }
        return x;
    }

    // hàm này sau này có thể sẽ dùng

    // const handleOnSelect = (value) => {
    //     var checkProductExist = prodData.filter((val) => {
    //         return val.id == value.id ? true : false
    //     });

    //     if (checkProductExist.length > 0) {
    //         checkProductExist[0].soLuongSP += 1;
    //     } else {
    //         value.soLuongSP = 1;
    //         setProdData((prev) => [...prev, value]);
    //     }
    //     setShowTable(!showTable)
    // };


    return (
        <>
            <B.Container fluid>
                <B.Modal size='lg' show={show} onHide={handleClose}>
                    <B.ModalHeader closeButton className="bg-secondary">
                        <B.ModalTitle>Sửa Phiếu xuất</B.ModalTitle>
                    </B.ModalHeader>
                    <B.ModalBody>
                        <EditPx px={editPx} showModal={handleClose} />
                    </B.ModalBody>
                    <B.ModalFooter className="bg-secondary">
                        <B.Button
                            variant="outline-primary"
                            className="mt-2 rounded-0"
                            onClick={handleClose}
                        >
                            Hủy bỏ
                        </B.Button>
                    </B.ModalFooter>
                </B.Modal>

                <B.Row className='pe-xl-5 mb-4'>
                    <h1 className='fw-bold text-primary mb-4 text-capitalize'>QUẢN LÝ PHIẾU XUẤT</h1>
                </B.Row>

                <B.Tabs activeKey={tabkey}
                    onSelect={(k) => setTabkey(k)}>

                    {/* Hien thi phieu xuat */}
                    <B.Tab eventKey={1} title="Danh sách phiếu xuất" className=" border border-top-0 py-3 px-3">
                        <B.Row className='px-xl-3 mb-3'>
                            <B.Col lg={4}>
                                <ReactSearchAutocomplete
                                    items={pxsearchList}
                                    onSearch={handleOnPxSearch}
                                    onClear={handleOnPxClear}
                                    // fuseOptions={{ keys: ["id", "tenKH", "sdt"] }}
                                    // resultStringKeyName="tenKH"
                                    // formatResult={formatResult}
                                    placeholder='Tìm kiếm phiếu xuất'
                                    maxResults={10}
                                    showNoResults={false}
                                    styling={{
                                        height: "34px",
                                        border: "1px solid lightgray",
                                        borderRadius: "0",
                                        backgroundColor: "white",
                                        boxShadow: "none",
                                        hoverBackgroundColor: "#d19c97",
                                        color: "black",
                                        fontSize: "15px",
                                        // fontFamily: "Courier",
                                        iconColor: "black",
                                        lineColor: "#d19c97",
                                        // placeholderColor: "black",
                                        clearIconMargin: "3px 8px 0 0",
                                        zIndex: '2',
                                    }}
                                />
                            </B.Col>
                        </B.Row>
                        <B.Row className='px-xl-3'>
                            <B.Col lg className='d-grd gap-2 mx-auto table-responsive mb-5'>
                                <B.Table className='table-borderless border border-secondary mb-0'>
                                    <thead className='text-dark' style={{ backgroundColor: '#edf1ff' }}>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên Khách hàng</th>
                                            <th>Số điện thoại</th>
                                            <th>Địa chỉ</th>
                                            <th>Phương thức thanh toán</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!showSearchTable && (
                                            pxlist && pxlist.map((px) => {
                                                return (
                                                    <tr key={px.id}>
                                                        <td>{px.id}</td>
                                                        <td>{px.tenKH}</td>
                                                        <td>{px.sdt}</td>
                                                        <td>{px.diaChi}</td>
                                                        <td>{px.pt_ThanhToan}</td>
                                                        <td>{px.tongTien}</td>
                                                        <td className='text-success fw-semibold'>{test(px.status)}</td>
                                                        {/* <td>
                                                                    <B.DropdownButton variant='success' className='me-2' title={test(px.status)}>
                                                                        {checkStatus.map((val) => (
                                                                            <B.Dropdown.Item key={val.id}
                                                                                onClick={() => handleUpdateStatus(val, px)}
                                                                                eventKey={ekey}>{val.name}</B.Dropdown.Item>
                                                                        ))}
                                                                    </B.DropdownButton>
                                                                </td> */}
                                                        <td className='d-flex'>
                                                            <FaRegEye className='fs-3 text-info me-3' onClick={() => handleView(px)} />
                                                            <FcPrint className='fs-3' onClick={window.print} />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}

                                        {showSearchTable && (
                                            pxsearchList && pxsearchList.map((px) => {
                                                return (
                                                    <tr key={px.id}>
                                                        <td>{px.id}</td>
                                                        <td>{px.tenKH}</td>
                                                        <td>{px.sdt}</td>
                                                        <td>{px.diaChi}</td>
                                                        <td>{px.pt_ThanhToan}</td>
                                                        <td>{px.tongTien}</td>
                                                        <td className='text-success fw-semibold'>{test(px.status)}</td>
                                                        {/* <td>
                                                                    <B.DropdownButton variant='success' className='me-2' title={test(px.status)}>
                                                                        {checkStatus.map((val) => (
                                                                            <B.Dropdown.Item key={val.id}
                                                                                onClick={() => handleUpdateStatus(val, px)}
                                                                                eventKey={ekey}>{val.name}</B.Dropdown.Item>
                                                                        ))}
                                                                    </B.DropdownButton>
                                                                </td> */}
                                                        <td className='d-flex'>
                                                            <FaRegEye className='fs-3 text-info me-3' onClick={() => handleView(px)} />
                                                            <FcPrint className='fs-3' onClick={window.print} />
                                                        </td>
                                                    </tr>
                                                )
                                            })

                                        )}
                                    </tbody>
                                </B.Table>
                            </B.Col>
                        </B.Row>
                        <Pagination currentPage={currentPage} totalPage={pageNumbers} handlePerPage={handlePerPage} />
                    </B.Tab>
                    {/* Hien thi phieu xuat */}

                    {/* Xem va sua PX */}
                    {showTab && (
                        <B.Tab eventKey={3} title="Xem chi tiết phiếu xuất" className=" border border-top-0 py-3 px-3">
                            <B.Row className='px-xl-3 mb-3'>
                                <B.Col lg={8} xs={8}>
                                    <h5 className='text-primary mb-3'>Chi tiết phiếu xuất</h5>
                                </B.Col>
                                <B.Col lg={4} xs={4} className='text-end'>
                                    <BiReset className='fs-3 customborder' onClick={handleRefresh} />
                                    <BiEdit className='fs-3 customborder' onClick={() => handleShow(viewPx)} />
                                    <FaTimes className='fs-3 customborder' onClick={handleCloseTab} />
                                </B.Col>
                            </B.Row>
                            <B.Row className='px-xl-3 mb-3'>
                                <B.Col lg={5}>
                                    <B.FormGroup className='d-flex'>
                                        <B.FormLabel className='fs-6'>Họ và tên:</B.FormLabel>
                                        <B.FormLabel className='fs-6 ms-2 mb-3 text-success'>{viewPx.tenKH}</B.FormLabel>
                                    </B.FormGroup>
                                    <B.FormGroup className='d-flex'>
                                        <B.FormLabel className='fs-6'>Số điện thoại:</B.FormLabel>
                                        <B.FormLabel className='fs-6 ms-2 mb-3 text-success'>{viewPx.sdt}</B.FormLabel>
                                    </B.FormGroup>
                                    <B.FormGroup className='d-flex'>
                                        <B.FormLabel className='fs-6'>Địa chỉ:</B.FormLabel>
                                        <B.FormLabel className='fs-6 ms-2 mb-3 text-success'>{viewPx.diaChi}</B.FormLabel>
                                    </B.FormGroup>
                                    <B.FormGroup className='d-flex'>
                                        <B.FormLabel className='fs-6'>Phương thức thanh toán:</B.FormLabel>
                                        <B.FormLabel className='fs-6 ms-2 mb-3 text-success'>{viewPx.pt_ThanhToan}</B.FormLabel>
                                    </B.FormGroup>
                                    <B.FormGroup className='d-flex'>
                                        <B.FormLabel className='fs-6'>Đơn giá:</B.FormLabel>
                                        <B.FormLabel className='fs-6 ms-2 mb-3 text-success'>{formatMoney(viewPx.tongTien)}</B.FormLabel>
                                    </B.FormGroup>
                                </B.Col>
                                <B.Col lg={7}>
                                    <B.Row>
                                        <B.Col lg={6}>
                                            <ReactSearchAutocomplete
                                                items={searchList}
                                                onSearch={handleOnProdSearch}
                                                onSelect={handleOnProdSelect}
                                                fuseOptions={{ keys: ["id", "tenSP"] }}
                                                resultStringKeyName="tenSP"
                                                formatResult={formatResult}
                                                placeholder='Tìm kiếm sản phẩm'
                                                maxResults={5}
                                                styling={{
                                                    height: "36px",
                                                    border: "1px solid lightgray",
                                                    borderRadius: "0",
                                                    backgroundColor: "white",
                                                    boxShadow: "none",
                                                    hoverBackgroundColor: "#d19c97",
                                                    color: "black",
                                                    fontSize: "15px",
                                                    iconColor: "black",
                                                    lineColor: "#d19c97",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    zIndex: '2',
                                                }}
                                            />
                                            <div className='pull-left mt-1'>
                                                <small className='text-danger ms-2 d-block'>{error.px_id}</small>
                                                <small className='text-danger ms-2 d-block'>{error.product_id}</small>
                                                <small className='text-danger ms-2 d-block'>{error.soluong}</small>
                                            </div>
                                            <B.Button variant='outline-info' className='rounded-0 my-3 pull-right' onClick={() => handleAddCtpxProd(prodData)} >Thêm sản phẩm</B.Button>
                                        </B.Col>
                                        <B.Col lg={6}>
                                            <B.Table className='table-borderless border border-secondary mb-3'>
                                                <thead className='text-dark' style={{ backgroundColor: '#edf1ff' }}>
                                                    <tr>
                                                        <th>Tên sản phẩm</th>
                                                        <th>Số lượng</th>
                                                        <th className='text-center'>Giá</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><img
                                                            src={`http://localhost:8000/uploadhinh/${prodData.hinh}`}
                                                            style={{ height: '60px' }}
                                                            alt=''
                                                        /> {prodData.tenSP}</td>
                                                        <td style={{ width: '130px' }}>
                                                            <B.InputGroup className="quantity mx-auto">
                                                                <B.Button
                                                                    className="btn-sm rounded-0"
                                                                    variant="primary"
                                                                    type="button"
                                                                    onClick={handleDecrement}
                                                                >
                                                                    <FaMinus />
                                                                </B.Button>
                                                                <B.InputGroup.Text className="form-control-sm text-center">
                                                                    {quantity}
                                                                </B.InputGroup.Text>
                                                                <B.Button
                                                                    className="btn-sm rounded-0"
                                                                    variant="primary"
                                                                    type="button"
                                                                    onClick={handleIncrement}
                                                                >
                                                                    <FaPlus />
                                                                </B.Button>
                                                            </B.InputGroup>
                                                        </td>
                                                        <td className='text-center'>{formatMoney(prodData.gia * quantity)}</td>
                                                    </tr>
                                                </tbody>
                                            </B.Table>
                                        </B.Col>
                                    </B.Row>
                                    <B.Table className='table-borderless border border-secondary mb-0'>
                                        <thead className='text-dark' style={{ backgroundColor: '#edf1ff' }}>
                                            <tr>
                                                <th>Mã sản phẩm</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Số lượng</th>
                                                <th>Giá</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewPx.pxct.map((prod) => {
                                                return (
                                                    <tr key={prod.product.id}>
                                                        <td>{prod.product.id}</td>
                                                        <td>{prod.product.tenSP}</td>
                                                        <td>{prod.soluong}</td>
                                                        <td>{formatMoney(prod.product.gia)}</td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </B.Table>
                                </B.Col>
                            </B.Row>
                        </B.Tab>
                    )}
                    {/* Xem va sua PX */}

                    {/* Form them phieu xuat */}
                    <B.Tab eventKey={2} title="Thêm phiếu xuất" className=" border border-top-0 py-3 px-3">
                        <B.Row className='px-xl-3 mb-3'>
                            <B.Form onSubmit={handleSubmitPx}>
                                <h4 className='text-primary mb-3'>Thông tin cơ bản của khách hàng</h4>
                                <B.Row>
                                    <B.Col lg={4}>
                                        <B.FormGroup>
                                            <B.FormLabel className='fs-5'>Họ và tên</B.FormLabel>
                                            <small className='text-danger ms-2'>{error.tenKH}</small>
                                            <B.FormControl type='text' name='tenKH' placeholder='Nhập vào họ và tên' className='rounded-0 shadow-none mb-3'
                                                value={pxinput.tenKH} onChange={handlePxInput}></B.FormControl>
                                        </B.FormGroup>
                                    </B.Col>
                                    <B.Col lg={4}>
                                        <B.FormGroup>
                                            <B.FormLabel className='fs-5'>Số điện thoại</B.FormLabel>
                                            <small className='text-danger ms-2'>{error.sdt}</small>
                                            <B.FormControl type='text' name='sdtKH' placeholder='Nhập vào số điện thoại' className='rounded-0 shadow-none mb-3' maxLength='10'
                                                value={pxinput.sdtKH} onChange={handlePxInput}></B.FormControl>
                                        </B.FormGroup>
                                    </B.Col>
                                    <B.Col lg={4}>
                                        <B.FormGroup>
                                            <B.FormLabel className='fs-5'>Địa chỉ</B.FormLabel>
                                            <small className='text-danger ms-2'>{error.diaChi}</small>
                                            <B.FormControl as='textarea' rows={1} name='diachiKH' placeholder='Nhập vào địa chỉ' className='rounded-0 shadow-none mb-3'
                                                value={pxinput.diachiKH} onChange={handlePxInput}></B.FormControl>
                                        </B.FormGroup>
                                    </B.Col>
                                </B.Row>
                                <B.Button type='submit' variant='primary' className='rounded-0 mb-3'>Thêm phiếu xuất</B.Button>
                            </B.Form>
                        </B.Row>
                        {showCtpx && (
                            <B.Row className='px-xl-3 mb-3'>
                                <B.Form onSubmit={submitAddCtpx}>
                                    <h4 className='text-primary mb-3'>Chi tiết phiếu xuất</h4>
                                    <label className='fs-5'>Thêm sản phẩm</label>
                                    <B.Row className='mt-2' >
                                        <B.Col lg={4}>
                                            <ReactSearchAutocomplete
                                                items={searchList}
                                                onSearch={handleOnProdSearch}
                                                onSelect={handleOnProdSelect}
                                                fuseOptions={{ keys: ["id", "tenSP"] }}
                                                resultStringKeyName="tenSP"
                                                formatResult={formatResult}
                                                placeholder='Tìm kiếm sản phẩm'
                                                maxResults={5}
                                                styling={{
                                                    height: "36px",
                                                    border: "1px solid lightgray",
                                                    borderRadius: "0",
                                                    backgroundColor: "white",
                                                    boxShadow: "none",
                                                    hoverBackgroundColor: "#d19c97",
                                                    color: "black",
                                                    fontSize: "15px",
                                                    iconColor: "black",
                                                    lineColor: "#d19c97",
                                                    clearIconMargin: "3px 8px 0 0",
                                                    zIndex: '2',
                                                }}
                                            />
                                            <B.Button type='submit' variant='primary' className='rounded-0 my-2'>Thêm chi tiết phiếu xuất</B.Button>
                                            <div>
                                                <small className='text-danger ms-2 d-block'>{error.px_id}</small>
                                                <small className='text-danger ms-2 d-block'>{error.product_id}</small>
                                                <small className='text-danger ms-2 d-block'>{error.soluong}</small>
                                            </div>
                                        </B.Col>
                                        <B.Col lg={8} className='mx-auto table-responsive mb-3' style={{ zIndex: '1' }}>
                                            {showTable && (
                                                <B.Table className='table-borderless border border-secondary mb-0'>
                                                    <thead className='text-dark' style={{ backgroundColor: '#edf1ff' }}>
                                                        <tr>
                                                            <th>Tên sản phẩm</th>
                                                            <th>Số lượng</th>
                                                            <th className='text-center'>Giá</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><img
                                                                src={`http://localhost:8000/uploadhinh/${prodData.hinh}`}
                                                                style={{ height: '60px' }}
                                                                alt=''
                                                            /> {prodData.tenSP}</td>
                                                            <td style={{ width: '130px' }}>
                                                                <B.InputGroup className="quantity mx-auto">
                                                                    <B.Button
                                                                        className="btn-sm rounded-0"
                                                                        variant="primary"
                                                                        type="button"
                                                                        onClick={handleDecrement}
                                                                    >
                                                                        <FaMinus />
                                                                    </B.Button>
                                                                    <B.InputGroup.Text className="form-control-sm text-center">
                                                                        {quantity}
                                                                    </B.InputGroup.Text>
                                                                    <B.Button
                                                                        className="btn-sm rounded-0"
                                                                        variant="primary"
                                                                        type="button"
                                                                        onClick={handleIncrement}
                                                                    >
                                                                        <FaPlus />
                                                                    </B.Button>
                                                                </B.InputGroup>
                                                            </td>
                                                            <td className='text-center'>{formatMoney(prodData.gia * quantity)}</td>
                                                        </tr>
                                                    </tbody>
                                                </B.Table>
                                            )}
                                        </B.Col>
                                    </B.Row>
                                </B.Form>
                            </B.Row>
                        )}
                    </B.Tab>
                    {/* Form them phieu xuat */}



                </B.Tabs>
            </B.Container>
        </>
    )
}

export default Index