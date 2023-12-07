import { NextPage } from "next";
import Head from "next/head";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Cart from "@/features/cart/Cart";

const CartPage: NextPage = () => {
  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>Cart</title>
      </Head>
      <Cart />
    </UserFlowVariedPages>
  );
};

export default CartPage;
