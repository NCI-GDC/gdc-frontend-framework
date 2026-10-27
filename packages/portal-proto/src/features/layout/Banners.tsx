"use client";
import React from "react";
import {
  useCoreSelector,
  selectBanners,
  useGetBannerNotificationsQuery,
} from "@gff/core";
import Banner from "@/components/Banner";

const Banners: React.FC = () => {
  useGetBannerNotificationsQuery();
  const banners = useCoreSelector((state) => selectBanners(state));

  return (
    <>
      {banners.map((banner) => (
        <Banner {...banner} key={banner.id} />
      ))}
    </>
  );
};

export default Banners;
