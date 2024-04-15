import { NextPage } from "next";
import Head from "next/head";
import { datadogRum } from "@datadog/browser-rum";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import Cart from "@/features/cart/Cart";

const CartPage: NextPage = () => {
  datadogRum.startView({
    name: "Cart",
  });

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
