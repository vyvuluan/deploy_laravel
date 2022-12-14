import React, { useEffect, useState } from "react";
import { FaICursor } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as FaI from "react-icons/fa";
import * as B from "react-bootstrap";
import { MdDashboard } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { SideNavBarData } from "./SideNavBarData.js";
import axios from "axios";
import Cookies from "universal-cookie";

import { connect } from "react-redux";

function SideNavBar() {
  const cookies = new Cookies();



  return (
    <>
      <B.TabContainer fluid defaultActiveKey={"/Home"}>
        <B.Row
          className="d-flex flex-column d-none d-md-none d-lg-block flex-shrink-0 p-3 text-white bg-dark"
          style={{ height: "100vh", position: "fixed" }}
        >
          <B.Nav
            variant="pills"
            className="flex-column mb-auto"
            style={{ marginTop: "70px" }}
          >
            <B.NavItem>
              {SideNavBarData.map(
                ({ title, icon, path, link, id_role }, index) => {
                  var res =
                    id_role.filter(function (val) {
                      return val == cookies.get("role_id");
                    }).length > 0;
                  if (res) {
                    return (
                      <B.NavLink
                        key={index}
                        className="text-white"
                        eventKey={path}
                      // onClick={handlelink}
                      >
                        <Link
                          style={{ textDecoration: "none", color: "#fff" }}
                          to={link}
                        >
                          <span className="fs-5 me-3">{icon}</span>
                          <span className="fs-5">{title}</span>
                        </Link>
                      </B.NavLink>
                    );
                  }
                }
              )}
            </B.NavItem>
            {/* <B.Tabs className='mt-3'>
                        </B.Tabs> */}
          </B.Nav>
        </B.Row>
      </B.TabContainer>
    </>
  );
}

export default SideNavBar;
