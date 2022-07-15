import { NextPage } from "next";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Cart from "@/features/cart/Cart";

const CartPage: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench", headerElements }}
    >
      <Cart />
    </UserFlowVariedPages>
  );
};

export default CartPage;
