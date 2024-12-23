import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header>
      {/* ... 其他代码 */}
      <div>{user ? <span>{user.username}</span> : <span>未登录</span>}</div>
      {/* ... 其他代码 */}
    </header>
  );
};

export default Header;
