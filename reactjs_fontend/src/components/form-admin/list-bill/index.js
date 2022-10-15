import React from "react";
import { Table,FormLabel } from "react-bootstrap";
import { AiFillEye } from 'react-icons/ai';

const ListBill = () => {
  return (
    <>
        <FormLabel style={{ fontSize: "30px" }}>
        Danh sách đơn hàng
      </FormLabel>
      <Table responsive>
        <thead>
          <tr>
            <th>#ID</th>
            <th>ID khách hàng</th>
            <th>ID customer</th>
            <th>Trạng thái</th>
            <th>PT thanh toán</th>
            <th>Địa chỉ</th>

            <th>Tổng tiền</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@md</td>
            <td>1</td>
            <td style={{wordBreak: "break-word", maxWidth: "250px"}} >ádasdadd</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td><button onClick type="submit" className="border-0 bg-primary rounded ">
                <AiFillEye className="me-1"/>Xem
              </button>
              
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
export default ListBill;
