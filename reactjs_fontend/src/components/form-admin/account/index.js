import React, { useState, useEffect, useCallback } from "react";
import * as B from "react-bootstrap";
import { AiFillEye } from "react-icons/ai";
import { FaUserEdit, FaSearch } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import axios from "axios";
import Cookies from "universal-cookie";
import ViewAccount from "./viewAccount";
import swal from "sweetalert";
import Pagination from "../../form/pagination";
import LoadingPage from "../../layouts/Loading";
const Account = () => {
  const cookies = new Cookies();
  const [user, setUser] = useState([]);
  const [viewAcc, setViewAcc] = useState();
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow((prev) => !prev);
  const handleShow = (item) => {
    // console.log(item);
    setViewAcc(item);
    setShow(true);
  };
  const [addAccount, setAddAccount] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
  });

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [perPage, setPerPage] = useState();
  const [currentPage, setCurrentPage] = useState();
  const handlePerPage = (page) => {
    setPage(page);
  };

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPage / perPage); i++) {
    pageNumbers.push(i);
  }
  //   hiển thị ds user

  useEffect(() => {
    // const controller = new AbortController();
    if (cookies.get("role_id") == 2) {
      axios
        .get(`/api/admin/manageUser?page=${page}`)
        .then((res) => {
          // console.log(res);
          setUser(res.data.users.data);
          setTotalPage(res.data.users.total);
          setPerPage(res.data.users.per_page);
          setCurrentPage(res.data.users.current_page);
          setLoading(false)
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
      // return () => controller.abort();
    } else {
      axios
        .get("/api/nhanvien/manageUser")
        .then((res) => {
          // console.log(res.data.users.data);
          setUser(res.data.users.data);
          setLoading(false)

        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  }, [page]);
  const [submitting, setSubmitting] = useState(true);

  const refresh = useCallback(async () => {
    if (cookies.get("role_id") == 2) {

      const res = await axios.get(`/api/admin/manageUser?page=${page}`);
      setUser(res.data.users.data);
      setTotalPage(res.data.users.total);
      setPerPage(res.data.users.per_page);
      setCurrentPage(res.data.users.current_page);
    }
    else if (cookies.get("role_id") == 4) {
      const res = await axios.get(`/api/nhanvien/manageUser?page=${page}`);
      setUser(res.data.users.data);
      setTotalPage(res.data.users.total);
      setPerPage(res.data.users.per_page);
      setCurrentPage(res.data.users.current_page);
    }
  }, [page]);

  useEffect(() => {
    refresh().then(() => setSubmitting(false));
  }, [submitting, refresh]);

  const handleDeleteAccount = (item) => {
    // console.log(item.id);
    const id = item.id;
    swal({
      title: "Bạn chắc chứ?",
      text: "Xóa tài khoản sẽ không thể hoàn tác",
      buttons: {
        catch: {
          text: "Xóa tài khoản",
          value: "catch",
        },
        no: {
          text: "Hủy bỏ",
          value: "no",
        },
      },
    }).then((value) => {
      switch (value) {
        case "catch":
          if (cookies.get("role_id") == 2) {
            axios
              .delete(`/api/admin/manageUser/${id}`)
              .then((res) => {
                // console.log(res.data);
                if (res.data.status === 200) {
                  swal({
                    title: res.data.message,
                    icon: "success",
                    button: "đóng",
                  });
                  setSubmitting(true);
                }
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          } else if (cookies.get("role_id") == 4) {
            axios
              .delete(`/api/nhanvien/manageUser/${id}`)
              .then((res) => {
                // console.log(res.data);
                if (res.data.status === 200) {
                  swal({
                    title: res.data.message,
                    icon: "success",
                    button: "đóng",
                  });
                  setSubmitting(true);
                }
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          } break;
        default:
          break;

      }
    });
  };

  var htmlRole;
  var htmlStatus;
  return (
    <>
      <B.Modal show={show} onHide={handleClose}>
        <B.ModalHeader closeButton className="bg-secondary">
          <B.ModalTitle>Sửa tài khoản</B.ModalTitle>
        </B.ModalHeader>
        <B.ModalBody>
          <ViewAccount
            viewAcc={viewAcc}
            showModal={handleClose}
            setSubmitting={setSubmitting}
          />
        </B.ModalBody>
      </B.Modal>
      <B.Container fluid>
        <B.Row className="pe-xl-5 mb-4">
          <B.Col lg={6}>
            <h1 className="fw-bold text-primary mb-4 text-capitalize">
              QUẢN LÝ TÀI KHOẢN
            </h1>
          </B.Col>
          <B.Col lg={2}></B.Col>
        </B.Row>

        {/* table hien thi tai khoan */}
        <B.Row className="pe-xl-5">
          <B.Col lg className="d-grd gap-2 mx-auto table-responsive mb-5">
            {/* <B.FormGroup className="d-flex d-inline-block justify-content-between mb-2">
              <B.FormSelect
                className="rounded-0 shadow-none"
                style={{ width: "200px" }}
              >
                <option>Sắp xếp</option>
                <option>Từ A-Z</option>
                <option>Theo ID</option>
                <option>Theo quyền</option>
              </B.FormSelect>
            </B.FormGroup> */}
            <B.Table className="table-borderless border border-secondary mb-0">
              <thead
                className="text-dark"
                style={{ backgroundColor: "#edf1ff" }}
              >
                <tr>
                  <th>STT</th>
                  <th>Username</th>
                  <th>Email</th>

                  <th>Quyền</th>
                  <th>Hoạt động</th>

                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {user.map((item, index) => {
                  //   console.log(item);

                  if (item.role_id == 1) {
                    htmlRole = (
                      <>
                        <td className="align-middle fw-semibold">User</td>
                      </>
                    );
                  } else if (item.role_id == 2) {
                    htmlRole = (
                      <td className="align-middle fw-semibold text-danger">
                        Administrator
                      </td>
                    );
                  } else if (item.role_id == 3) {
                    htmlRole = (
                      <td className="align-middle fw-semibold text-info">
                        Thủ kho
                      </td>
                    );
                  } else if (item.role_id == 4) {
                    htmlRole = (
                      <td className="align-middle fw-semibold text-warning">
                        Nhân viên
                      </td>
                    );
                  }
                  if (item.status == 1) {
                    htmlStatus = (
                      <>
                        <td
                          className="align-middle fw-bold"
                          style={{ color: "#379237" }}
                        >
                          ON
                        </td>
                      </>
                    );
                  } else {
                    htmlStatus = (
                      <>
                        <td
                          className="align-middle fw-bold"
                          style={{ color: "#cecece" }}
                        >
                          OFF
                        </td>
                      </>
                    );
                  }
                  return (
                    <tr key={item.id}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle">{item.username}</td>
                      <td className="align-middle">{item.email}</td>

                      {htmlRole}
                      {htmlStatus}

                      <td className="text-center fs-5 text-primary">
                        <AiFillEye
                          type="button"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Xem chi tiết "
                          style={{ marginRight: "15px" }}
                          onClick={() => handleShow(item)}
                        />

                        <MdDeleteForever
                          type="button"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Xóa tài khoản"
                          onClick={() => handleDeleteAccount(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </B.Table>
            {loading ? <LoadingPage /> : null}
          </B.Col>
        </B.Row>
        <Pagination
          currentPage={currentPage}
          totalPage={pageNumbers}
          handlePerPage={handlePerPage}
        />
      </B.Container>
    </>
  );
};

export default Account;
