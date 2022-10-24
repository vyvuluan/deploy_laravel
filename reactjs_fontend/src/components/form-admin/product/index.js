import React, { useState, useEffect } from "react";
import * as B from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { BsPersonPlusFill } from "react-icons/bs";
import { FaUserEdit, FaSearch } from "react-icons/fa";
import { AiOutlineUserDelete, AiOutlineEdit } from "react-icons/ai";
import { CgExtensionAdd } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import LoaderIcon from "../../layouts/Loading/index";
import { Link } from "react-router-dom";

function Index() {
  const [loading, setLoading] = useState(true);
  const [categorylist, setCategorylist] = useState([]);
  const [ncclist, setNcclist] = useState([]);
  const [nsxlist, setNsxlist] = useState([]);
  const [productInput, setProduct] = useState({
    loaisp_id: "",
    tenSP: "",
    soLuong: "",
    gia: "",
    ncc_id: "",
    nsx_id: "",
    baohanh: "",
    moTa: "",
    ctSanPham: "",
  });

  const [pricture, setPicture] = useState([]);
  const [errorlist, setError] = useState([]);

  const [viewProd, setViewProd] = useState([]);

  // Thêm sản phẩm (start)
  const handleProductInput = (e) => {
    e.persist();
    setProduct({ ...productInput, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setPicture({ image: e.target.files[0] });
  };

  useEffect(() => {
    let isMounted = true;

    axios.get(`http://localhost:8000/api/loaisp/view`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setCategorylist(res.data.Loaisp);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    axios.get(`http://localhost:8000/api/kho/ncc`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setNcclist(res.data.Ncc.data);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    axios.get(`http://localhost:8000/api/kho/nsx`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setNsxlist(res.data.Nsx.data);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const submitProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hinh", pricture.image);
    formData.append("maLoai", productInput.loaisp_id);
    formData.append("tenSP", productInput.tenSP);
    formData.append("soLuongSP", productInput.soLuong);
    formData.append("gia", productInput.gia);
    formData.append("maNCC", productInput.ncc_id);
    formData.append("maNSX", productInput.nsx_id);
    formData.append("moTa", productInput.moTa);
    formData.append("baoHanh", productInput.baohanh);
    formData.append("ctSanPham", productInput.ctSanPham);

    axios
      .post(`http://localhost:8000/api/kho/products`, formData)
      .then((res) => {
        if (res.data.status === 200) {
          swal("Thêm sản phẩm thành công", res.data.message, "success");
          setProduct({
            ...productInput,
            loaisp_id: "",
            tenSP: "",
            soLuong: "",
            gia: "",
            ncc_id: "",
            nsx_id: "",
            baohanh: "",
            moTa: "",
            ctSanPham: "",
          });
          setError([]);
        } else if (res.data.status === 422) {
          swal("Vui lòng nhập đầy đủ các mục", "", "error");
          setError(res.data.errors);
        }
      });
  };
  // Thêm sản phẩm (end)
  useEffect(() => {
    let isMounted = true;

    axios.get(`http://localhost:8000/api/products/view`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setViewProd(res.data.data);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // var display_Productdata = "";
  // if (loading) {
  //     return <LoaderIcon />

  // }
  // else {
  //     display_Productdata =
  // }

  // const [categoryInput, setCategory] = useState({
  //     tenLoai: '',
  //     error_list: [],
  // });

  // const handleInput = (e) => {
  //     e.persist();
  //     setCategory({ ...categoryInput, [e.target.name]: e.target.value })
  // }

  // const submitCategory = (e) => {
  //     e.preventDefault();

  //     const data = {
  //         tenLoai: categoryInput.tenLoai,
  //     }

  //     axios.post(`http://localhost:8000/api/kho/loaisp`, data).then(res => {
  //         if (res.data.status === 200) {
  //             swal('Success', res.data.message, 'success')
  //             document.getElementById('formLoaiSP').reset();
  //         }
  //         else if (res.data.status === 400) {
  //             setCategory({ ...categoryInput, error_list: res.data.error })
  //         }
  //     });
  // }

  // var display_error = [];
  // if (categoryInput.error_list) {
  //     display_error = [
  //         categoryInput.error_list.tenLoai,
  //     ]
  // }

  return (
    <>
      <B.Container fluid>
        <B.Row className="pe-xl-5 mb-4">
          <B.Col lg={4}>
            <h1 className="fw-bold text-primary mb-4 text-capitalize">
              QUẢN LÝ SẢN PHẨM
            </h1>
          </B.Col>
          <B.Col lg={2}></B.Col>
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
              <B.FormGroup className="d-flex d-inline-block justify-content-between mt-2">
                <B.FormCheck
                  type="checkbox"
                  className="rounded-0"
                  label="Theo id"
                />
                <B.FormCheck
                  type="checkbox"
                  className="rounded-0"
                  label="Theo loại"
                />
                <B.FormSelect className="w-25 rounded-0 shadow-none">
                  <option>Administrator</option>
                  <option>Manager</option>
                  <option>User</option>
                </B.FormSelect>
              </B.FormGroup>
            </B.Form>
          </B.Col>
        </B.Row>

        <B.Row className="pe-xl-5 mb-5">
          <B.Col lg={8}>
            <B.Form onSubmit={submitProduct}>
              <B.FormGroup>
                <B.FormControl
                  type="text"
                  name="tenSP"
                  className="rounded-0 shadow-none mb-3"
                  placeholder="Tên sản phẩm"
                  onChange={handleProductInput}
                  value={productInput.tenSP}
                ></B.FormControl>
                <small className="text-danger">{errorlist.tenSP}</small>
              </B.FormGroup>

              <div className="d-flex">
                <B.FormGroup className="me-2 w-100">
                  <B.FormSelect
                    name="loaisp_id"
                    onChange={handleProductInput}
                    value={productInput.loaisp_id}
                    className="rounded-0 shadow-none mb-3 text-muted"
                  >
                    <option>Chọn loại sản phẩm</option>
                    {categorylist &&
                      categorylist.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.tenLoai}
                          </option>
                        );
                      })}
                  </B.FormSelect>
                  <small className="text-danger">{errorlist.loaisp_id}</small>
                </B.FormGroup>
                <B.FormGroup className="me-2 w-100">
                  <B.FormControl
                    type="text"
                    name="soLuong"
                    className="rounded-0 shadow-none mb-3"
                    placeholder="Số lượng"
                    onChange={handleProductInput}
                    value={productInput.soLuong}
                  ></B.FormControl>
                </B.FormGroup>
                <B.FormGroup className="w-100">
                  <B.FormControl
                    type="text"
                    name="gia"
                    className="rounded-0 shadow-none mb-3"
                    placeholder="Giá"
                    onChange={handleProductInput}
                    value={productInput.gia}
                  ></B.FormControl>
                  <small className="text-danger">{errorlist.gia}</small>
                </B.FormGroup>
              </div>
              <div className="d-flex">
                <B.FormGroup className="me-2 w-100">
                  <B.FormControl
                    type="file"
                    name="image"
                    onChange={handleImage}
                    className="rounded-0 shadow-none mb-3"
                  ></B.FormControl>
                  <small className="text-danger">{errorlist.image}</small>
                </B.FormGroup>
                <B.FormGroup className="me-2 w-100">
                  <B.FormSelect
                    name="ncc_id"
                    onChange={handleProductInput}
                    value={productInput.ncc_id}
                    className="rounded-0 shadow-none mb-3 text-muted"
                  >
                    <option>Chọn nhà cung cấp</option>
                    {ncclist &&
                      ncclist.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.tenNCC}
                          </option>
                        );
                      })}
                  </B.FormSelect>
                  <small className="text-danger">{errorlist.ncc_id}</small>
                </B.FormGroup>
                <B.FormGroup className="w-100">
                  <B.FormSelect
                    name="nsx_id"
                    onChange={handleProductInput}
                    value={productInput.nsx_id}
                    className="rounded-0 shadow-none mb-3 text-muted"
                  >
                    <option>Chọn nhà sản xuất</option>
                    {nsxlist &&
                      nsxlist.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.tenNSX}
                          </option>
                        );
                      })}
                  </B.FormSelect>
                  <small className="text-danger">{errorlist.nsx_id}</small>
                </B.FormGroup>
              </div>
              <div className="d-flex">
                <B.FormGroup className="me-2 w-100">
                  <B.FormControl
                    type="text"
                    name="baohanh"
                    className="rounded-0 shadow-none mb-3"
                    placeholder="Bảo hành (tháng)"
                    onChange={handleProductInput}
                    value={productInput.baohanh}
                  ></B.FormControl>
                  <small className="text-danger">{errorlist.baohanh}</small>
                </B.FormGroup>
                <B.FormGroup className="me-2 w-100">
                  <B.FormControl
                    type="text"
                    name="moTa"
                    className="rounded-0 shadow-none mb-3"
                    placeholder="Mô tả"
                    onChange={handleProductInput}
                    value={productInput.moTa}
                  ></B.FormControl>
                  <small className="text-danger">{errorlist.moTa}</small>
                </B.FormGroup>
                <B.FormGroup className="w-100">
                  <B.FormControl
                    as="textarea"
                    name="ctSanPham"
                    id="ctSP"
                    className="rounded-0 shadow-none mb-3"
                    placeholder="Chi tiết sản phẩm"
                    onChange={handleProductInput}
                    value={productInput.ctSanPham}
                  ></B.FormControl>
                  <small className="text-danger">{errorlist.ctSanPham}</small>

                  {/* <CKEditor
                                        editor={ClassicEditor}
                                        data='<p>Mô tả sản phẩm</p>'
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                        }}
                                    /> */}
                </B.FormGroup>
              </div>

              <B.Button
                type="submit"
                variant="outline-primary"
                className="rounded-0 py-2 mb-2"
              >
                <BsPersonPlusFill className="me-2" />
                Thêm sản phẩm
              </B.Button>
            </B.Form>
          </B.Col>
          <B.Col lg={4}>
            {/* <B.Form onSubmit={submitCategory} id='formLoaiSP'>
                            <hr />
                            <B.FormGroup>
                                <B.FormControl type='text' name='tenLoaiSP' className='rounded-0 shadow-none mt-1 mb-2' placeholder='Tên loại sản phẩm'
                                    onChange={handleProductInput} value={categoryInput.tenLoaiSP}></B.FormControl>
                                <span>{categoryInput.error_list.tenLoai}</span>
                                <div className='d-flex d-inline-block justify-content-between'>
                                    <B.Button variant='outline-primary' type='submit' className='rounded-0 py-2 w-50 me-1'>
                                        <CgExtensionAdd className='me-2' />
                                        Thêm loại
                                    </B.Button>
                                    <B.Button variant='outline-primary' className='rounded-0 py-2 w-50 ms-1'>
                                        <AiOutlineEdit className='me-2' />
                                        Sửa loại
                                    </B.Button>
                                </div>
                            </B.FormGroup>
                        </B.Form> */}
          </B.Col>
        </B.Row>

        {/* table hien thi tai khoan */}
        <B.Row className="pe-xl-5">
          <B.Col lg className="d-grd gap-2 mx-auto table-responsive mb-5">
            <B.FormGroup className="d-flex d-inline-block justify-content-between mb-2">
              <B.FormSelect
                className="rounded-0 shadow-none"
                style={{ width: "200px" }}
              >
                <option>Sắp xếp</option>
                <option>Từ A-Z</option>
                <option>Theo ID</option>
                <option>Theo loại</option>
              </B.FormSelect>
            </B.FormGroup>
            <B.Table className="table-borderless border border-secondary text-center mb-0">
              <thead
                className="text-dark"
                style={{ backgroundColor: "#edf1ff" }}
              >
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Hình</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {viewProd.map((item) => {
                  return (
                    <>
                      <tr>
                        <td key={item.id} className="align-middle">
                          <input type="checkbox" />
                        </td>
                        <td className="align-middle">{item.id}</td>
                        <td className="align-middle">{item.tenSP}</td>
                        <td className="align-middle">{item.maLoai}</td>
                        <td className="align-middle">{item.gia}</td>
                        <td className="align-middle">{item.soLuongSP}</td>
                        <td className="align-middle">
                          <img
                            src={`http://localhost:8000/${item.hinh}`}
                            width="50px"
                          />
                        </td>
                        <td className="align-middle fs-5 text-primary">
                          <Link to={"/"}>
                            <BiEdit />
                          </Link>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </B.Table>
          </B.Col>
        </B.Row>
      </B.Container>
    </>
  );
}

export default Index;