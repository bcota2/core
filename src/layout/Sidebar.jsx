import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaCubes, FaMoneyBills,FaClipboardUser,FaMoneyBillTransfer,FaCashRegister  } from "react-icons/fa6";
import { IoBarChartSharp } from "react-icons/io5";
import { MdOutlineDashboardCustomize, MdOutlineBorderColor } from "react-icons/md";
import { BsShopWindow } from "react-icons/bs";
import { HiCube } from "react-icons/hi2";
import { FaRegFolderOpen } from "react-icons/fa";
import './Sidebar.css'; 
import { useNavigate } from 'react-router-dom';


export default function SideMenu() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", minHeight: "100vh"}}>

    <Sidebar backgroundColor={"#7B92A6"}>     
      <Menu>
        <MenuItem className="pt-5 pb-4" disabled> <h1 style={{fontSize:25, textAlign: "center",letterSpacing: '20px', color:'#F2F2F2'}}> CORE </h1> </MenuItem>

        <MenuItem  component={<Link to="/" />} icon={ <MdOutlineDashboardCustomize/> } className="sidebar-text" > Dashboard </MenuItem>

        <MenuItem component={<Link to="/inventory" />}  icon={<FaCubes />} className="sidebar-text"> Inventory </MenuItem>

        <SubMenu label="Sales" icon={< BsShopWindow />} className="sidebar-text">
          <MenuItem  className="submenu-text" component={<Link to="/sales/quotes"/>} icon={<FaMoneyBillTransfer />} > Quotes </MenuItem>
          <MenuItem  className="submenu-text" component={<Link to="/sales"/>} icon={<FaCashRegister  />} > Point of Sales </MenuItem>
        </SubMenu>

        <SubMenu label="Purchases" icon={<FaMoneyBills   />} className="sidebar-text">
          <MenuItem component={<Link to="/purchase/orders"/>} icon={<MdOutlineBorderColor  />}  className="submenu-text"> Orders </MenuItem>
          <MenuItem component={<Link to="/purchase/suppliers"/>} icon={<FaClipboardUser  />}  className="submenu-text"> Suppliers </MenuItem>
        </SubMenu>

        <MenuItem component={<Link to="/reports" />} icon={<IoBarChartSharp/>}  className="sidebar-text"> Reports </MenuItem>
        <MenuItem component={<Link to="/products" />} icon={<HiCube/>} className="sidebar-text" onClick={()=>navigate('/products')}> Products </MenuItem>
        <MenuItem component={<Link to="/categories" />} icon={<FaRegFolderOpen/>} className="sidebar-text"> Categories </MenuItem>
      </Menu>
    </Sidebar>
    </div>
  );
}
