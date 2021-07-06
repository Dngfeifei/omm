import {Modal,Input,Row,Col} from "antd";
import React,{useState} from "react";
import OrganizeSelectTree from "./OrganizeSelectTree";
import UserTable from "./UserTable";
import UserTag from "./UserTag";
import _ from 'lodash';

const { Search } = Input;
/**
 * 权限设置
 */
const UserSelectModal = (props) => {
    let {options,onOk} = props;
     
    const [user, setUser] = useState("");
    const [selectUser, setSelectUser] = useState([]);
    const [selectUserVisible, setSelectUserVisible] = useState(false);
    
    const [companyId, setCompanyId] = useState("");
    const [officeId, setOfficeId] = useState("");
  

    //确认选择用户
    const selectUserModalOk = () => {
        setSelectUserVisible(false);
        setUser(selectUser.map((item) => item.name).join(","));
        onOk(selectUser);
    }

    //添加用户
    const addSelectUser = (list)=>{
        let arr =  _.uniqBy([].concat(selectUser,list), 'id');
        setSelectUser(arr);
    }
  

    return (
        <div>
            <Search 
                onSearch={() => setSelectUserVisible(true)} 
                value={user}
                placeholder={options.placeholder}
                defaultValue={options.defaultValue}
                style={{ width: options.width }}
            />
            <Modal
                title="选择用户"
                width={1200}
                visible={selectUserVisible}
                onOk={()=>selectUserModalOk()}
                onCancel={() => setSelectUserVisible(false)}
                bodyStyle={{ padding: 10 }}
                destroyOnClose
            >
                <Row gutter={8}>
                    <Col span={6}>
                        <OrganizeSelectTree
                            setCompanyId={setCompanyId}
                            setOfficeId={setOfficeId}
                            companyId={companyId}
                            officeId={officeId}
                        />
                    </Col>
                    <Col span={12}>
                        <UserTable
                            selectUser={selectUser}
                            setSelectUser={addSelectUser}
                            companyId={companyId}
                            officeId={officeId}
                            setCompanyId={setCompanyId}
                            setOfficeId={setOfficeId}
                        />
                    </Col>
                    <Col span={6}>
                        <UserTag tag={selectUser} setTag={setSelectUser} />
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default UserSelectModal
