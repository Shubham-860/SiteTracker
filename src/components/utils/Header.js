import React, {useContext} from 'react';
import User from "../../context/user";

const Header = ({title}) => {

    const [user,setUser] = useContext(User);
    return (<div className={'container w-100 border-2 border-bottom pt-3'}>
            <h3>{title}</h3>
        </div>);
};

export default Header;