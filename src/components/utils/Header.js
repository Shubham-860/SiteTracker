import React from 'react';

const Header = ({title}) => {

    return (<div className={'container w-100 border-2 border-bottom pt-3'}>
            <h3>{title}</h3>
        </div>);
};

export default Header;